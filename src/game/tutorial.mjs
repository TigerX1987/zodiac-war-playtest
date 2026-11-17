import { createBaseDeck } from '../content/cards.mjs?v=web-707d5b82f1a73e9b';
import { applyAction, createGame } from './engine.mjs?v=web-707d5b82f1a73e9b';
                                                     

// Fixed teaching checkpoints use the production engine, not simulated HP changes.
export const TUTORIAL_STEPS = ['welcome', 'attack', 'attack-result', 'defense', 'defense-result', 'skill', 'skill-result', 'rescue', 'rescue-result', 'practice', 'finish']         ;
                                                                             
                                                                                      

const teachingCard = (id        ) => {
  const card = createBaseDeck().find(candidate => candidate.id === id);
  if (!card) throw new Error('Unknown tutorial card: ' + id);
  return { ...card };
};

export function createTutorialCheckpoint(step              , previousStoryState            )            {
  let state = createGame({ seed: 42, characters: ['aries', 'cancer', 'gemini', 'capricorn'], controls: ['human', 'ai', 'ai', 'ai'] });
  state.phase = 'main';
  state.activePlayerId = 'p1';
  state.firstTurn = false;
  state.mulliganPendingPlayerIds = [];
  state.log = [];
  state.players.forEach(player => { player.hand = []; player.armor = 0; player.equipment = {}; player.statuses = {}; });
  if (previousStoryState) {
    for (const player of state.players) {
      const previous = previousStoryState.players.find(candidate => candidate.id === player.id) ;
      player.hp = previous.hp;
      player.armor = previous.armor;
      player.rage = previous.rage;
      player.statuses = structuredClone(previous.statuses);
    }
  }
  const self = state.players[0];
  const enemy = state.players[3];
  self.hand = ['fire-normal-1', 'air-normal-1', 'water-normal-1', 'sun'].map(teachingCard);
  if (step === 'practice' && previousStoryState) self.hand = structuredClone(previousStoryState.players[0].hand);
  if (step === 'skill' && !previousStoryState) enemy.hp -= 1;
  if (step === 'defense') {
    state.activePlayerId = enemy.id;
    enemy.hand = [teachingCard('air-normal-2')];
  }
  if (step === 'rescue') {
    state.activePlayerId = enemy.id;
    if (!previousStoryState) state.players[1].hp = 1;
    enemy.hand = [teachingCard('air-normal-2')];
  }
  const storyHit = previousStoryState ? (step === 'defense' ? 'air-normal-3' : step === 'skill' ? 'air-normal-4' : null) : null;
  const gemini = state.players[2];
  if (storyHit) gemini.hand = [teachingCard(storyHit)];
  const dealt = new Set(state.players.flatMap(player => player.hand.map(card => card.id)));
  state.deck = createBaseDeck().filter(card => !dealt.has(card.id));
  if (storyHit) {
    const lessonActor = state.activePlayerId;
    state.activePlayerId = gemini.id;
    state = applyAction(state, { type: 'playCard', playerId: gemini.id, cardId: storyHit, targetId: 'p2' }).state;
    state = applyAction(state, { type: 'skipDefense', playerId: 'p2' }).state;
    state.activePlayerId = lessonActor;
  }
  if (step === 'defense' || step === 'rescue') {
    state = applyAction(state, { type: 'playCard', playerId: enemy.id, cardId: 'air-normal-2', targetId: step === 'defense' ? self.id : 'p2' }).state;
    if (step === 'rescue') state = applyAction(state, { type: 'skipDefense', playerId: 'p2' }).state;
  }
  return state;
}

function closePracticeTurn(state           ) {
  const player = state.players.find(person => person.id === state.activePlayerId) ;
  const excess = Math.max(0, player.hand.length - player.hp);
  // Preserve normal attacks when a skipped practice turn must discard cards.
  const hand = [...player.hand].sort((a, b) => Number(a.kind === 'normalAttack') - Number(b.kind === 'normalAttack'));
  const discards = hand.slice(0, excess).map(card => card.id);
  const ended = applyAction(state, { type: 'endMain', playerId: player.id }).state;
  return applyAction(ended, { type: 'discard', playerId: player.id, cardIds: discards }).state;
}

function nextPracticeTurn(state           ) {
  let next = closePracticeTurn(state);
  for (let passed = 0; next.activePlayerId !== 'p1' && passed < next.players.length; passed++) {
    if (next.phase !== 'draw') throw new Error('无法推进教学回合');
    next = closePracticeTurn(applyAction(next, { type: 'drawPhase' }).state);
  }
  if (next.activePlayerId !== 'p1' || next.phase !== 'draw') throw new Error('无法回到白羊的回合');
  return applyAction(next, { type: 'drawPhase' }).state;
}

export function nextTutorialCheckpoint(progress                  , previousStoryState            ) {
  if (progress.step === 'practice-result' && progress.objective === 'defeat-capricorn' && previousStoryState) {
    return { progress: { ...progress, step: 'practice'          }, state: nextPracticeTurn(previousStoryState) };
  }
  const following                                              = { welcome: 'attack', 'attack-result': 'defense', 'defense-result': 'skill', 'skill-result': 'rescue', 'rescue-result': 'practice' };
  const next = following[progress.step];
  if (!next) throw new Error('请先完成当前教学操作');
  const step = next                ;
  return { progress: { ...progress, step }, state: createTutorialCheckpoint(step, previousStoryState) };
}

export function applyTutorialAction(state           , progress                  , action        ) {
  const { step } = progress;
  const expected = 'playerId' in action && action.playerId === 'p1' && (
    (step === 'attack' && action.type === 'playCard' && action.cardId === 'fire-normal-1' && action.targetId === 'p4') ||
    (step === 'defense' && action.type === 'defend' && action.cardId === 'air-normal-1') ||
    (step === 'skill' && action.type === 'useSkill' && action.skillId === 'aries.ram' && action.targetId === 'p4' && action.cardIds?.length === 1 && action.cardIds[0] === 'fire-normal-1') ||
    (step === 'rescue' && action.type === 'playCard' && action.cardId === 'sun' && action.mode === 'rescue' && action.targetId === 'p2') ||
    (step === 'practice' && action.type === 'playCard' && state.players[0].hand.some(card => card.id === action.cardId && card.kind === 'normalAttack') && ['p3', 'p4'].includes(action.targetId || ''))
  );
  if (!expected) throw new Error('请按教学提示完成当前操作；也可随时跳过教学');
  let result = applyAction(state, action).state;
  // The teaching opponent deliberately declines defense; no AI or timer can
  // run past the result before the learner has read it.
  if (step === 'attack' || step === 'practice') {
    while (result.phase === 'response' && result.pendingAttack) {
      result = applyAction(result, { type: 'skipDefense', playerId: result.pendingAttack.currentTargetId }).state;
    }
  }
  if (step === 'practice' && progress.objective === 'defeat-capricorn') {
    while (result.pendingRescue) {
      result = applyAction(result, { type: 'skipRescue', playerId: result.pendingRescue.currentResponderId }).state;
    }
    const guard = result.players.find(player => player.id === 'p4') ;
    const next               = guard.hp === 0 && guard.eliminated ? 'finish' : 'practice-result';
    return { state: result, progress: { ...progress, step: next } };
  }
  return { state: result, progress: { ...progress, step: (step === 'practice' ? 'finish' : step + '-result')                 } };
}
