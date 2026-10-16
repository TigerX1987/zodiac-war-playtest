import { SKILL_DESCRIPTIONS } from '../src/content/skillDescriptions.mjs';
import {
  applyAction,
  applySingleAiAction,
  autoDiscardToHp,
  createGame,
  createInfectionGame,
} from '../src/game/engine.mjs';

const SERVER_VERSION = "web-8fcc6163a4b8e28a";
const MULLIGAN_SECONDS = 8;
const MAIN_TOTAL_SECONDS = 65;
const MAIN_IDLE_SECONDS = 20;
const RESPONSE_TOTAL_SECONDS = 35;
const RESPONSE_IDLE_SECONDS = 10;
const TIMER_SPEEDUP = 5;
const FINAL_NORMAL_SECONDS = 3;
const AI_ACTION_DELAY_MS = 3000;

const characterLabels = {
  aries: '白羊座',
  leo: '狮子座',
  sagittarius: '射手座',
  gemini: '双子座',
  libra: '天秤座',
  aquarius: '水瓶座',
  cancer: '巨蟹座',
  scorpio: '天蝎座',
  pisces: '双鱼座',
  taurus: '金牛座',
  virgo: '处女座',
  capricorn: '摩羯座',
};

const STANDARD_PLAYER_NAMES = {
  4: ['A队前锋', 'A队辅助', 'B队前锋', 'B队终结'],
  6: ['A队前锋', 'A队中坚', 'A队辅助', 'B队前锋', 'B队中坚', 'B队终结'],
};

const GAME_MODES = {
  test: {
    seatCount: 4,
    playerCounts: [4],
    randomCharacters: false,
    characters: ['aries', 'cancer', 'gemini', 'capricorn'],
    controls: ['human', 'ai', 'ai', 'ai'],
    playerNames: STANDARD_PLAYER_NAMES[4],
  },
  standard: {
    seatCount: 4,
    playerCounts: [4, 6],
    randomCharacters: true,
    characters: ['aries', 'cancer', 'gemini', 'capricorn', 'taurus', 'aquarius'],
    controls: ['human', 'ai', 'ai', 'ai', 'ai', 'ai'],
    playerNames: STANDARD_PLAYER_NAMES[4],
  },
  infection: {
    seatCount: 4,
    playerCounts: [4, 5, 6, 7, 8],
    randomCharacters: true,
    characters: ['aries', 'cancer', 'aquarius', 'taurus', 'virgo', 'sagittarius', 'libra', 'pisces'],
    controls: ['human', 'ai', 'ai', 'ai', 'ai', 'ai', 'ai', 'ai'],
    playerNames: ['1号位', '2号位', '3号位', '4号位', '5号位', '6号位', '7号位', '8号位'],
  },
};

function normalizeMode(value) {
  if (value === 'infection') return 'infection';
  if (value === 'standard' || value === '3v3') return 'standard';
  return 'test';
}

function normalizePlayerCount(value, requestedCount) {
  const normalizedMode = normalizeMode(value);
  const allowed = GAME_MODES[normalizedMode].playerCounts;
  const parsed = Number(requestedCount);
  return allowed.includes(parsed) ? parsed : allowed[0];
}

function shuffleCharacterPool(pool, initialSeed) {
  const result = [...pool];
  let value = Math.abs(Number(initialSeed)) >>> 0;
  if (!value) value = 1;
  const random = () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 0x100000000;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function randomCharactersForMode(value, playerCount, initialSeed) {
  const normalizedMode = normalizeMode(value);
  if (normalizedMode === 'infection') {
    const pool = Object.keys(characterLabels)
      .filter((characterId) => characterId !== 'capricorn' && characterId !== 'virgo');
    const selected = shuffleCharacterPool(pool, initialSeed).slice(0, playerCount);
    const bossIndex = Math.abs(Number(initialSeed)) % playerCount;
    const virgoIndex = Array.from(
      { length: playerCount },
      (_, index) => playerCount - index - 1,
    ).find((index) => index !== bossIndex);
    selected[virgoIndex] = 'virgo';
    return selected;
  }
  return shuffleCharacterPool(Object.keys(characterLabels), initialSeed).slice(0, playerCount);
}

function playerNamesForMode(value, playerCount) {
  const normalizedMode = normalizeMode(value);
  if (normalizedMode === 'infection') return GAME_MODES.infection.playerNames.slice(0, playerCount);
  return STANDARD_PLAYER_NAMES[playerCount] ?? STANDARD_PLAYER_NAMES[4];
}

function createModeGame(nextMode, nextSeed, nextCharacters, nextControls, requestedSeatCount) {
  const normalizedMode = normalizeMode(nextMode);
  const playerCount = normalizePlayerCount(normalizedMode, requestedSeatCount);
  if (normalizedMode === 'infection') {
    return createInfectionGame({
      seed: nextSeed,
      playerCount,
      characters: nextCharacters.slice(0, playerCount),
      controls: nextControls.slice(0, playerCount),
      playerNames: playerNamesForMode(normalizedMode, playerCount),
    });
  }
  return createGame({
    seed: nextSeed,
    characters: nextCharacters.slice(0, playerCount),
    controls: nextControls.slice(0, playerCount),
    playerNames: playerNamesForMode(normalizedMode, playerCount),
    teamLayout: normalizedMode === 'standard' ? 'balanced' : 'configured',
  });
}

function freshSeed() {
  return Math.floor(Math.random() * 1000000000) + 1;
}

function normalizeSeed(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : freshSeed();
}

let seed = freshSeed();
let mode = 'test';
let characters = [...GAME_MODES[mode].characters];
let controls = [...GAME_MODES[mode].controls];
let playerCount = 4;
let game = createModeGame(mode, seed, characters, controls, playerCount);
let lobbyOpen = true;
let localPlayerId = game.players.find((player) => player.control === 'human')?.id || game.players[0]?.id || '';
let setupPaused = true;
let setupFateDrawn = false;
let mulliganDeadline = null;
let actionDeadline = null;
let actionDeadlineKey = null;
let actionStartedAt = null;
let lastError = '';
let matchSerial = 0;
let matchId = SERVER_VERSION + ':0';

function resetCurrentGame(nextSeed = seed, toLobby = false) {
  matchId = SERVER_VERSION + ':' + (++matchSerial);
  seed = normalizeSeed(nextSeed);
  game = createModeGame(mode, seed, characters, controls, playerCount);
  lobbyOpen = toLobby;
  localPlayerId = game.players.find((player) => player.control === 'human')?.id || game.players[0]?.id || '';
  setupPaused = true;
  setupFateDrawn = false;
  mulliganDeadline = null;
  actionDeadline = null;
  actionDeadlineKey = null;
  actionStartedAt = null;
  lastError = '';
}

function validateMatchNavigation(body, surrender = false) {
  if (body.confirmed !== true) throw new Error('请先确认此操作');
  if (body.matchId !== matchId) throw new Error('对局已变化，请重新确认');
  if (lobbyOpen) throw new Error('当前没有正在进行的对局');
  if (surrender) {
    if (setupPaused) throw new Error('请先完成开局设置');
    const player = game.players.find(candidate => candidate.id === localPlayerId);
    if (!player) throw new Error('未找到本机玩家');
    const faction = game.mode === 'infection' ? player.factionId : player.teamId;
    if (body.faction !== faction) throw new Error('你的队伍或阵营已变化，请重新确认投降');
  }
}


function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sendJson(res, body, httpStatus = 200) {
  res.writeHead(httpStatus, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function finishMulliganDefaults() {
  if (setupPaused || game.phase !== 'mulligan') {
    if (game.phase !== 'mulligan') mulliganDeadline = null;
    return;
  }
  const pending = [...game.mulliganPendingPlayerIds];
  for (const playerId of pending) {
    game = applyAction(game, { type: 'mulligan', playerId, replace: false }).state;
  }
  mulliganDeadline = null;
}

function finishExpiredMulligan() {
  if (mulliganDeadline && Date.now() >= mulliganDeadline) finishMulliganDefaults();
}

function actionTimeoutTargetIdFor(state) {
  if (setupPaused || state.pendingSkillDecisions?.length) return '';
  if (state.phase === 'main') return state.activePlayerId;
  if (state.phase === 'response' && state.pendingAttack) return state.pendingAttack.currentTargetId;
  if (state.phase === 'infectionResponse') return state.infection?.pendingInfectionCard?.targetId || '';
  if (state.phase === 'rescue') return (state.pendingRescue || state.infection?.pendingDying)?.currentResponderId || '';
  if (state.phase === 'reward') return state.infection?.pendingReward?.playerId || '';
  return '';
}

function timerProfileForPhase(phase) {
  if (phase === 'main') return { total: MAIN_TOTAL_SECONDS, idle: MAIN_IDLE_SECONDS };
  if (['response', 'infectionResponse', 'rescue', 'reward'].includes(phase)) {
    return { total: RESPONSE_TOTAL_SECONDS, idle: RESPONSE_IDLE_SECONDS };
  }
  return { total: 0, idle: 0 };
}

function actionTimeoutWallMsFor(state) {
  const profile = timerProfileForPhase(state.phase);
  if (profile.total <= 0) return 0;
  const acceleratedSpan = Math.max(0, profile.total - profile.idle - FINAL_NORMAL_SECONDS);
  return Math.ceil((profile.idle + acceleratedSpan / TIMER_SPEEDUP + FINAL_NORMAL_SECONDS) * 1000);
}

function actionTimeoutKeyFor(state) {
  const targetId = actionTimeoutTargetIdFor(state);
  if (!targetId) return '';
  if (state.phase === 'response' && state.pendingAttack) {
    return [state.phase, targetId, state.pendingAttack.sourceId, state.pendingAttack.card.id, state.pendingAttack.hitsRemaining, state.pendingAttack.defensesRemaining, state.pendingAttack.remainingTargetIds.join(',')].join(':');
  }
  return [state.phase, targetId, state.round, state.metrics.turns].join(':');
}

function syncActionDeadline(reset = false) {
  const key = actionTimeoutKeyFor(game);
  if (!key) {
    actionDeadline = null;
    actionDeadlineKey = null;
    actionStartedAt = null;
    return;
  }
  if (reset || actionDeadlineKey !== key || !actionDeadline) {
    actionDeadlineKey = key;
    actionStartedAt = Date.now();
    actionDeadline = actionStartedAt + actionTimeoutWallMsFor(game);
  }
}

function pushTimeoutLog(message, playerId) {
  game.log.unshift({ type: 'timeout', message, playerId });
}

function hasLegalDefenseResponse(gameState, player) {
  const pending = gameState.pendingAttack;
  if (!pending || !player) return false;
  if (pending.scorpioPoisonStep) return player.hand.length > 0;
  return player.hand.some((card) => {
    if (card.kind === 'sun' || card.kind === 'moon') return true;
    if (card.kind !== 'normalAttack') return false;
    if (pending.card.kind === 'aoe') return card.element === pending.card.element;
    if (pending.card.fusion && pending.card.kind === 'statusAttack') {
      return card.element === pending.card.element;
    }
    return pending.card.kind === 'normalAttack' || pending.card.kind === 'statusAttack';
  });
}

function finishDefenselessResponses() {
  if (game.pendingSkillDecisions?.length) return;
  let guard = 0;
  while (game.phase === 'response' && game.pendingAttack && !game.pendingSkillDecisions?.length && guard < 12) {
    const playerId = game.pendingAttack.currentTargetId;
    const player = game.players.find((candidate) => candidate.id === playerId);
    if (!player || hasLegalDefenseResponse(game, player)) return;
    pushTimeoutLog(`${player.name} 没有可用响应牌，自动${game.pendingAttack.scorpioPoisonStep ? '不交蝎毒额外牌' : '跳过防御'}`, playerId);
    game = applyAction(game, { type: 'skipDefense', playerId }).state;
    actionDeadline = null;
    actionDeadlineKey = null;
    actionStartedAt = null;
    guard += 1;
  }
  if (game.phase === 'infectionResponse' && game.infection?.pendingInfectionCard) {
    const playerId = game.infection.pendingInfectionCard.targetId;
    const player = game.players.find((candidate) => candidate.id === playerId);
    const canCounter = player?.hand.some((card) => card.kind === 'sun' || card.kind === 'ritual');
    if (player && !canCounter) {
      pushTimeoutLog(`${player.name} 没有太阳或净化仪式，感染牌直接生效`, playerId);
      game = applyAction(game, { type: 'respondInfection', playerId }).state;
      actionDeadline = null;
      actionDeadlineKey = null;
      actionStartedAt = null;
    }
  }
}

function finishActionTimeout() {
  syncActionDeadline();
  if (!actionDeadline || Date.now() < actionDeadline) return;
  if (game.phase === 'main') {
    const playerId = game.activePlayerId;
    pushTimeoutLog(`${game.players.find((player) => player.id === playerId)?.name || playerId} 出牌阶段超时，自动跳过`, playerId);
    game = applyAction(game, { type: 'endMain', playerId }).state;
    actionDeadline = null;
    actionDeadlineKey = null;
    actionStartedAt = null;
    return;
  }
  if (game.phase === 'response' && game.pendingAttack) {
    const playerId = game.pendingAttack.currentTargetId;
    pushTimeoutLog(`${game.players.find((player) => player.id === playerId)?.name || playerId} 响应阶段超时，自动跳过防御`, playerId);
    game = applyAction(game, { type: 'skipDefense', playerId }).state;
    actionDeadline = null;
    actionDeadlineKey = null;
    actionStartedAt = null;
    return;
  }
  if (game.phase === 'infectionResponse' && game.infection?.pendingInfectionCard) {
    const playerId = game.infection.pendingInfectionCard.targetId;
    pushTimeoutLog('感染牌响应超时，感染直接生效', playerId);
    game = applyAction(game, { type: 'respondInfection', playerId }).state;
    actionDeadline = null;
    actionDeadlineKey = null;
    actionStartedAt = null;
    return;
  }
  if (game.phase === 'rescue' && (game.pendingRescue || game.infection?.pendingDying)?.currentResponderId) {
    const playerId = (game.pendingRescue || game.infection?.pendingDying).currentResponderId;
    pushTimeoutLog('急救响应超时，自动放弃急救', playerId);
    game = applyAction(game, { type: 'skipRescue', playerId }).state;
    actionDeadline = null;
    actionDeadlineKey = null;
    actionStartedAt = null;
    return;
  }
  if (game.phase === 'reward' && game.infection?.pendingReward?.playerId) {
    const playerId = game.infection.pendingReward.playerId;
    pushTimeoutLog('击杀奖励选择超时，自动摸 2 张牌', playerId);
    game = applyAction(game, {
      type: 'chooseInfectionReward',
      playerId,
      option: 'draw2',
    }).state;
    actionDeadline = null;
    actionDeadlineKey = null;
    actionStartedAt = null;
  }
}

function finishExpiredActionTimeout() {
  if (actionDeadline && Date.now() >= actionDeadline) finishActionTimeout();
}

// 判断当前是否有「进行中的对局」。
// 本服务为单实例（全局只有一个 game），所以结果只有 0 或 1。
// 用于发布/更新前判断「现在发版安不安全」——为 0 时更新不会打断任何人。
function isMatchInProgress() {
  if (lobbyOpen) return false;                                 // 还在选角/等待界面
  if (setupPaused) return false;                               // 还在确认星盘，尚未开打
  if (game.phase === 'gameOver') return false;                 // 已结束
  if (game.winnerTeamId || game.winnerId) return false;        // 已分出胜负
  return true;
}

function sendState(res, httpStatus = 200) {
  finishExpiredMulligan();
  finishExpiredActionTimeout();
  finishDefenselessResponses();
  syncActionDeadline();
  sendJson(res, {
    state: game,
    error: lastError,
    lobbyOpen,
    localPlayerId,
    setupPaused,
    setupFateDrawn,
    mulliganDeadline,
    actionDeadline,
    actionStartedAt,
    matchId,
    config: { mode, characters, controls, playerCount },
  }, httpStatus);
  lastError = '';
}

export async function handleRequest(req, res) {
  try {


    if (req.method === 'GET' && req.url === '/api/state') {
      sendState(res);
      return;
    }

    if (req.method === 'GET' && req.url === '/api/version') {
      sendJson(res, { version: SERVER_VERSION });
      return;
    }

    // 发布前安全闸门：返回当前是否有人在打牌。
    // 用法：更新线上版本前先 GET 一次，safeToDeploy 为 true 才发版。
    if (req.method === 'GET' && req.url === '/api/active-matches') {
      finishExpiredMulligan();
      finishExpiredActionTimeout();
      finishDefenselessResponses();
      const inProgress = isMatchInProgress();
      sendJson(res, {
        activeMatches: inProgress ? 1 : 0,
        safeToDeploy: !inProgress,
        phase: game.phase,
        round: game.round,
        mode,
        playerCount,
        lobbyOpen,
        setupPaused,
        hasWinner: Boolean(game.winnerTeamId || game.winnerId),
        version: SERVER_VERSION,
        checkedAt: new Date().toISOString(),
      });
      return;
    }

    if (req.method === 'POST' && req.url === '/api/action') {
      const body = await readBody(req);
      try {
        if (body.type === 'surrender') throw new Error('投降必须通过独立确认入口执行');
        if (setupPaused) throw new Error('请先确认星盘，再开始换牌或行动');
        finishExpiredMulligan();
        finishExpiredActionTimeout();
        game = applyAction(game, body).state;
        actionDeadline = null;
        actionDeadlineKey = null;
        actionStartedAt = null;
        lastError = '';
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }
      sendState(res);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/auto-discard') {
      try {
        if (setupPaused) throw new Error('请先确认星盘，再开始换牌或行动');
        finishExpiredMulligan();
        finishExpiredActionTimeout();
        game = applyAction(game, {
          type: 'discard',
          playerId: game.activePlayerId,
          cardIds: autoDiscardToHp(game, game.activePlayerId),
        }).state;
        actionDeadline = null;
        actionDeadlineKey = null;
        actionStartedAt = null;
        lastError = '';
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }
      sendState(res);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/ai') {
      try {
        if (setupPaused) throw new Error('请先确认星盘，再推进 AI');
        finishExpiredMulligan();
        finishExpiredActionTimeout();
        game = applySingleAiAction(game).state;
        actionDeadline = null;
        actionDeadlineKey = null;
        actionStartedAt = null;
        lastError = '';
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }
      sendState(res);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/restart') {
      const body = await readBody(req);
      seed = freshSeed();
      mode = normalizeMode(body.mode);
      const modeConfig = GAME_MODES[mode];
      playerCount = normalizePlayerCount(mode, body.playerCount);
      characters = modeConfig.randomCharacters
        ? randomCharactersForMode(mode, playerCount, seed)
        : Array.from(
          { length: playerCount },
          (_, index) => body.characters?.[index] ?? modeConfig.characters[index] ?? 'aries',
        );
      controls = Array.from(
        { length: playerCount },
        (_, index) => body.controls?.[index] ?? modeConfig.controls[index] ?? 'ai',
      );
      resetCurrentGame(seed, false);
      sendState(res);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/exit') {
      const body = await readBody(req);
      try {
        validateMatchNavigation(body);
        resetCurrentGame(freshSeed(), true);
        sendState(res);
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        sendState(res, 409);
      }
      return;
    }

    if (req.method === 'POST' && req.url === '/api/surrender') {
      const body = await readBody(req);
      try {
        validateMatchNavigation(body, true);
        game = applyAction(game, { type: 'surrender', playerId: localPlayerId }).state;
        actionDeadline = null;
        actionDeadlineKey = null;
        actionStartedAt = null;
        mulliganDeadline = null;
        lastError = '';
        sendState(res);
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        sendState(res, 409);
      }
      return;
    }

    if (req.method === 'POST' && req.url === '/api/toggle-entrust') {
      if (lobbyOpen) {
        lastError = '请先开始一局游戏';
      } else {
        const player = game.players.find((candidate) => candidate.id === localPlayerId);
        if (!player) {
          lastError = '未找到本机玩家座位';
        } else {
          player.control = player.control === 'ai' ? 'human' : 'ai';
          actionDeadline = null;
          actionDeadlineKey = null;
          actionStartedAt = null;
          lastError = '';
        }
      }
      sendState(res);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/start') {
      if (!setupPaused || !setupFateDrawn) {
        lastError = '请先由先手玩家抽取命运牌';
        sendState(res);
        return;
      }
      setupPaused = false;
      mulliganDeadline = game.phase === 'mulligan' ? Date.now() + MULLIGAN_SECONDS * 1000 : null;
      actionDeadline = null;
      actionDeadlineKey = null;
      actionStartedAt = null;
      lastError = '';
      sendState(res);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/draw-opening-fate') {
      if (!setupPaused) {
        lastError = '牌局已经开始';
      } else {
        setupFateDrawn = true;
        lastError = '';
      }
      sendState(res);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/mulligan-timeout') {
      finishMulliganDefaults();
      lastError = '';
      sendState(res);
      return;
    }

    if (req.method === 'POST' && req.url === '/api/action-timeout') {
      finishActionTimeout();
      lastError = '';
      sendState(res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error), state: game }));
  }
}

export function snapshot() {
  return {version: SERVER_VERSION, seed, mode, characters, controls, playerCount, game, lobbyOpen, localPlayerId, setupPaused, setupFateDrawn, mulliganDeadline, actionDeadline, actionDeadlineKey, actionStartedAt, matchSerial, matchId};
}
export function restoreSnapshot(saved) {
  if (saved?.version !== SERVER_VERSION || !Array.isArray(saved.game?.players) || !GAME_MODES[saved.mode]) return false;
  ({seed, mode, characters, controls, playerCount, game, lobbyOpen, localPlayerId, setupPaused, setupFateDrawn, mulliganDeadline, actionDeadline, actionDeadlineKey, actionStartedAt, matchSerial, matchId} = saved);
  return true;
}
let requestQueue = Promise.resolve();
export function request(route, options = {}) {
  const run = () => new Promise((resolve, reject) => {
    const listeners = {};
    const req = {url: route, method: options.method || 'GET', on(name, callback) {listeners[name] = callback; return this;}};
    let status = 200;
    let headers = {};
    const res = {writeHead(code, values) {status = code; headers = values;}, end(body = '') {resolve(new Response(body, {status, headers}));}};
    queueMicrotask(() => {try {listeners.data?.(options.body || ''); listeners.end?.();} catch (error) {reject(error);}});
    Promise.resolve(handleRequest(req, res)).catch(reject);
  });
  const pending = requestQueue.then(run, run);
  requestQueue = pending.catch(() => {});
  return pending;
}
