import { createBaseDeck, createInfectionDeck, effectiveRitualCard, ELEMENT_LABELS, statusForElement } from '../content/cards.mjs';
import {
  CHARACTERS,
  DEFAULT_CHARACTER_PAIR,
  DEFAULT_DEMO_CHARACTERS,
  zodiacSeatIndices,
} from '../content/characters.mjs';
             
         
       
              
              
            
              
             
            
                        
                
                       
              
           
              
            
                     
import { shuffleWithSeed } from './random.mjs';

const STATUS_LABELS                           = {
  burn: '灼烧',
  frozen: '冰冻',
  blind: '致盲',
  silence: '沉默',
  shield: '圣盾',
  abnormalImmunity: '异常免疫',
  sureHit: '必中',
};

function freshFlags()            {
  return {
    usedBasicAttack: false,
    basicAttackCount: 0,
    usedCardElements: [],
    libraRoundElements: [],
    airCardsUsed: 0,
    usedWeaponConvert: false,
    usedWindCompass: false,
    usedNormalAttackThisTurn: false,
    usedEarthArmorReductionThisRound: false,
    usedGeminiExtraTurnThisRound: false,
    usedLibraJudgmentThisTurn: false,
    usedLibraPerfectJudgmentThisTurn: false,
    usedLibraHarmony: false,
    usedGeminiWindForm: false,
    usedGeminiSteal: false,
    usedScorpioPeek: false,
    usedScorpioPoison: false,
    usedScorpioSting: false,
    scorpioFreeStingTargetIds: [],
    energyChargeElement: undefined,
    usedAquariusMassHeal: false,
    usedAquariusWindCutThisRound: false,
    usedCancerRescueThisRound: false,
    cancerTideBondDraws: 0,
    usedPiscesObserveTide: false,
    usedPiscesBalance: false,
    usedAriesRam: false,
    ariesBloodRageReady: false,
    ariesBloodRageUsed: false,
    usedLeoRoar: false,
    usedLeoOrder: false,
    leoOrderTargetId: undefined,
    usedCancerHeal: false,
    usedTaurusArmor: false,
    taurusGuardTargetId: undefined,
    usedTaurusGuardThisRound: false,
    usedAriesBurnSoul: false,
    usedCapricornChargeThisRound: false,
    usedSagittariusSeek: false,
    usedSagittariusFirstFireAttack: false,
    usedVirgoPurify: false,
    virgoDomainActive: false,
    usedVirgoDomainThisTurn: false,
    usedVirgoDisciplineThisRound: false,
    usedInfectionBossPassive: false,
    usedInfectionBossCommand: false,
    infectionBossCommandMode: undefined,
    usedInfectionBossExtraTarget: false,
    firstAttackDamageApplied: false,
    grantedExtraTurn: false,
    piscesBalanceLoss: 0,
    iceArmorBlockedTargetIds: [],
  };
}

function cloneState(state           )            {
  return {
    ...state,
    players: state.players.map((player) => ({
      ...player,
      hand: [...player.hand],
      equipment: { ...player.equipment },
      statuses: { ...player.statuses },
      flags: {
        ...player.flags,
        usedCardElements: [...player.flags.usedCardElements],
        libraRoundElements: [...player.flags.libraRoundElements],
        scorpioFreeStingTargetIds: [...player.flags.scorpioFreeStingTargetIds],
        iceArmorBlockedTargetIds: [...player.flags.iceArmorBlockedTargetIds],
      },
    })),
    deck: [...state.deck],
    discard: [...state.discard],
    mulliganPendingPlayerIds: [...state.mulliganPendingPlayerIds],
    openingFate: state.openingFate
      ? {
          ...state.openingFate,
          card: { ...state.openingFate.card },
        }
      : undefined,
    pendingAttack: state.pendingAttack
      ? {
          ...state.pendingAttack,
          targetIds: [...state.pendingAttack.targetIds],
          remainingTargetIds: [...state.pendingAttack.remainingTargetIds],
          scorpioPoisonTargetIds: state.pendingAttack.scorpioPoisonTargetIds
            ? [...state.pendingAttack.scorpioPoisonTargetIds]
            : undefined,
          scorpioPoisonPaidTargetIds: state.pendingAttack.scorpioPoisonPaidTargetIds
            ? [...state.pendingAttack.scorpioPoisonPaidTargetIds]
            : undefined,
        }
      : undefined,
    pendingSkillDecisions: state.pendingSkillDecisions?.map((decision) => ({
      ...decision,
      targetIds: decision.targetIds ? [...decision.targetIds] : undefined,
      damageOptions: decision.damageOptions ? { ...decision.damageOptions } : undefined,
    })),
    playedCards: state.playedCards
      ? {
          cards: state.playedCards.cards.map((display) => ({
            ...display,
            card: { ...display.card },
            targetIds: display.targetIds ? [...display.targetIds] : undefined,
          })),
          sideCards: state.playedCards.sideCards.map((display) => ({
            ...display,
            card: { ...display.card },
            targetIds: display.targetIds ? [...display.targetIds] : undefined,
          })),
        }
      : undefined,
    infection: state.infection
      ? {
          ...state.infection,
          pendingInfectionCard: state.infection.pendingInfectionCard
            ? {
                ...state.infection.pendingInfectionCard,
                card: { ...state.infection.pendingInfectionCard.card },
              }
            : undefined,
          pendingDying: state.infection.pendingDying
            ? {
                ...state.infection.pendingDying,
                eligibleResponderIds: [...state.infection.pendingDying.eligibleResponderIds],
                passedResponderIds: [...state.infection.pendingDying.passedResponderIds],
              }
            : undefined,
          pendingReward: state.infection.pendingReward
            ? { ...state.infection.pendingReward }
            : undefined,
          chainDeaths: state.infection.chainDeaths.map((death) => ({ ...death })),
          metrics: { ...state.infection.metrics },
        }
      : undefined,
    log: [...state.log],
    metrics: {
      ...state.metrics,
      damageBySource: { ...state.metrics.damageBySource },
      damageTaken: { ...state.metrics.damageTaken },
      healingBySource: { ...state.metrics.healingBySource },
      skillTriggers: { ...state.metrics.skillTriggers },
    },
  };
}

function makeMetrics()              {
  return {
    turns: 0,
    extraTurns: 0,
    damageBySource: {},
    damageTaken: {},
    heals: 0,
    healingBySource: {},
    statusesApplied: 0,
    skillTriggers: {},
  };
}

function log(state           , message        , playerId         , type = 'info') {
  state.log.unshift({ type, message, playerId });
}

function makePlayedCardDisplay(
  player             ,
  card      ,
  targetId         ,
  transientMs         ,
  targetIds           ,
) {
  return {
    playerId: player.id,
    teamId: player.teamId,
    card: { ...card },
    targetId,
    targetIds: targetIds ? [...targetIds] : undefined,
    transientMs,
  };
}

function rememberCenterPlayedCard(
  state           ,
  player             ,
  card      ,
  targetId         ,
  targetIds           ,
  replaceCurrentGroup = false,
) {
  const display = makePlayedCardDisplay(player, card, targetId, undefined, targetIds);
  const playedCards = state.playedCards || { cards: [], sideCards: [] };
  playedCards.cards = replaceCurrentGroup ? [display] : [...playedCards.cards, display].slice(-5);
  state.playedCards = playedCards;
}

function clearCenterPlayedCards(state           ) {
  if (!state.playedCards) return;
  state.playedCards.cards = [];
  if (state.playedCards.sideCards.length === 0) state.playedCards = undefined;
}

function rememberSidePlayedCard(state           , player             , card      ) {
  const display = makePlayedCardDisplay(player, card, undefined, 500);
  const playedCards = state.playedCards || { cards: [], sideCards: [] };
  playedCards.sideCards = [...playedCards.sideCards, display].slice(-4);
  state.playedCards = playedCards;
}

function clearPlayedCards(state           ) {
  state.playedCards = undefined;
}

function findPlayer(state           , playerId        ) {
  const player = state.players.find((candidate) => candidate.id === playerId);
  if (!player) throw new Error(`Unknown player: ${playerId}`);
  return player;
}

function isInfectionMode(state           ) {
  return state.mode === 'infection' && Boolean(state.infection);
}

function isAlive(player             ) {
  return !player.eliminated && player.hp > 0;
}

function isInfectedFaction(player             ) {
  return player.factionId === 'infected';
}

function sameFaction(state           , first             , second             ) {
  if (isInfectionMode(state)) return first.factionId === second.factionId;
  return first.teamId === second.teamId;
}

function effectiveCardForHolder(player             , card      ) {
  return effectiveRitualCard(card, isInfectedFaction(player));
}

function opponentOf(state           , playerId        ) {
  const player = findPlayer(state, playerId);
  const opponent =
    state.players.find((candidate) => !sameFaction(state, candidate, player) && isAlive(candidate)) ??
    state.players.find((candidate) => !sameFaction(state, candidate, player)) ??
    state.players.find((candidate) => candidate.id !== playerId);
  if (!opponent) throw new Error(`No opponent for player: ${playerId}`);
  return opponent;
}

function alliesOf(state           , playerId        ) {
  const player = findPlayer(state, playerId);
  return state.players.filter((candidate) => sameFaction(state, candidate, player) && isAlive(candidate));
}

function enemiesOf(state           , playerId        ) {
  const player = findPlayer(state, playerId);
  if (isInfectionMode(state)) {
    return state.players.filter((candidate) => candidate.id !== player.id && isAlive(candidate));
  }
  return state.players.filter((candidate) => candidate.teamId !== player.teamId && isAlive(candidate));
}

function playersInSeatOrder(state           ) {
  return [...state.players].sort(
    (left, right) => left.seatIndex - right.seatIndex || left.id.localeCompare(right.id),
  );
}

function nextLivingPlayerAfter(state           , playerId        ) {
  const seats = playersInSeatOrder(state);
  const currentIndex = seats.findIndex((candidate) => candidate.id === playerId);
  const direction = state.turnDirection ?? 1;
  for (let offset = 1; offset <= seats.length; offset += 1) {
    const candidateIndex = (currentIndex + offset * direction + seats.length) % seats.length;
    const candidate = seats[candidateIndex];
    if (isAlive(candidate)) return candidate;
  }
  return findPlayer(state, playerId);
}

function orderedPlayerIdsFrom(state           , startingPlayerId        ) {
  const seats = playersInSeatOrder(state);
  const startIndex = seats.findIndex((candidate) => candidate.id === startingPlayerId);
  const direction = state.turnDirection ?? 1;
  return seats.map((_, index) => {
    const playerIndex = (startIndex + index * direction + seats.length) % seats.length;
    return seats[playerIndex].id;
  });
}

function circularSeatDistance(state           , source             , target             ) {
  const seats = playersInSeatOrder(state).filter((candidate) => candidate.hp > 0);
  const sourceIndex = seats.findIndex((candidate) => candidate.id === source.id);
  const targetIndex = seats.findIndex((candidate) => candidate.id === target.id);
  if (sourceIndex < 0 || targetIndex < 0) return Number.POSITIVE_INFINITY;
  const direct = Math.abs(sourceIndex - targetIndex);
  return Math.min(direct, seats.length - direct);
}

function isCrossDistanceTarget(state           , source             , target             ) {
  if (state.players.length <= 2) return false;
  if (!isInfectionMode(state) && source.teamId === target.teamId) return false;
  return circularSeatDistance(state, source, target) > 1;
}

function isInitialInfectionBoss(state           , player             ) {
  return (
    isInfectionMode(state) &&
    player.infectionRole === 'initial' &&
    state.infection?.bossPlayerId === player.id
  );
}

function targetedCardNeedsDistanceCost(state           , source             , target             , card      ) {
  if (isInitialInfectionBoss(state, source)) return false;
  if (!isCrossDistanceTarget(state, source, target)) return false;
  if (source.equipment.weapon) return false;
  if (card.kind === 'normalAttack') return true;
  if (card.kind === 'statusAttack') return true;
  return false;
}

function assertWaterStealInRange(state           , source             , target             , card      ) {
  if (card.kind !== 'utility' || card.element !== 'water') return;
  if (isInitialInfectionBoss(state, source)) return;
  if (isCrossDistanceTarget(state, source, target)) throw new Error('潮汐窃取只能对距离 1 的目标使用');
}

function skillNeedsDistanceCost(state           , source             , target             , skillId        ) {
  if (isInitialInfectionBoss(state, source)) return false;
  if (!isCrossDistanceTarget(state, source, target)) return false;
  if (source.equipment.weapon) return false;
  return ['aries.ram', 'capricorn.charge'].includes(skillId);
}

function payDistanceCost(
  state           ,
  player             ,
  target             ,
  required         ,
  extraCostCardId                    ,
  reservedCardIds           = [],
) {
  if (!required) return;
  if (!extraCostCardId) throw new Error('跨距离需要支付 1 张距离费用');
  if (reservedCardIds.includes(extraCostCardId)) throw new Error('距离费用不能复用已支付的牌');
  const cost = takeCard(player, extraCostCardId);
  state.discard.push(cost);
  log(state, `${player.name} 跨距离指定 ${target.name}，额外弃置 1 张距离费用`, player.id, 'card');
}

function leoOrderReceiverForTargets(state           , source             , targets               ) {
  return state.players.find((candidate) =>
    candidate.characterId === 'leo' &&
    candidate.hp > 0 &&
    candidate.flags.leoOrderTargetId === source.id &&
    targets.some((target) => target.id === candidate.id),
  );
}

function payLeoOrderIfNeeded(
  state           ,
  player             ,
  targets               ,
  paymentCardId                    ,
  reservedCardIds           = [],
) {
  const leo = leoOrderReceiverForTargets(state, player, targets);
  if (!leo) return;
  if (!paymentCardId) throw new Error('Leo order requires one payment card');
  if (reservedCardIds.includes(paymentCardId)) throw new Error('Leo order payment cannot reuse another cost card');
  const payment = takeCard(player, paymentCardId);
  leo.hand.push(payment);
  log(state, `${player.name} pays ${payment.name} to ${leo.name} for Leo order`, player.id, 'skill');
}

function takeCard(player             , cardId        ) {
  const index = player.hand.findIndex((card) => card.id === cardId);
  if (index < 0) throw new Error(`${player.name} does not have card ${cardId}`);
  return player.hand.splice(index, 1)[0];
}

function findTransferableCard(player             , cardId        ) {
  const handCard = player.hand.find((card) => card.id === cardId);
  if (handCard) return handCard;
  if (player.equipment.weapon?.id === cardId) return player.equipment.weapon;
  if (player.equipment.armor?.id === cardId) return player.equipment.armor;
  return undefined;
}

function takeTransferableCard(player             , cardId        ) {
  const handIndex = player.hand.findIndex((card) => card.id === cardId);
  if (handIndex >= 0) return player.hand.splice(handIndex, 1)[0];
  if (player.equipment.weapon?.id === cardId) {
    const card = player.equipment.weapon;
    delete player.equipment.weapon;
    return card;
  }
  if (player.equipment.armor?.id === cardId) {
    const card = player.equipment.armor;
    delete player.equipment.armor;
    return card;
  }
  throw new Error(`${player.name} does not have transferable card ${cardId}`);
}

function transferCardBetweenPlayers(
  state           ,
  from             ,
  to             ,
  cardId        ,
) {
  const wasEquipment = from.equipment.weapon?.id === cardId || from.equipment.armor?.id === cardId;
  const card = takeTransferableCard(from, cardId);
  if (wasEquipment) triggerEquipmentLeftOwner(state, from, card);
  to.hand.push(card);
  return card;
}

function takeWaterStealableCard(player             , cardId         ) {
  if (!cardId) return player.hand.shift();
  const handIndex = player.hand.findIndex((card) => card.id === cardId);
  if (handIndex >= 0) return player.hand.splice(handIndex, 1)[0];
  if (player.equipment.weapon?.id === cardId || player.equipment.armor?.id === cardId) {
    throw new Error('Water steal can only steal hand cards');
  }
  throw new Error(`${player.name} does not have water-stealable card ${cardId}`);
}

function reshuffleDiscardIntoDeck(state           ) {
  if (state.deck.length > 0 || state.discard.length === 0) return false;
  const reshuffleSeed = state.seed + state.metrics.turns + state.log.length + state.discard.length;
  const shuffled = shuffleWithSeed(state.discard.splice(0), reshuffleSeed);
  state.deck = shuffled.items;
  state.seed = shuffled.seed;
  log(state, '牌库耗尽，弃牌堆重新洗入牌库', undefined, 'deck');
  return true;
}

function drawCards(state           , player             , count        , filter                          ) {
  let drawn = 0;
  while (drawn < count) {
    if (filter) {
      const index = state.deck.findIndex(filter);
      if (index >= 0) {
        player.hand.push(state.deck.splice(index, 1)[0]);
        drawn += 1;
        continue;
      }
      if (!reshuffleDiscardIntoDeck(state)) break;
      continue;
    }

    if (state.deck.length === 0 && !reshuffleDiscardIntoDeck(state)) break;
    const card = state.deck.shift();
    if (!card) break;
    player.hand.push(card);
    drawn += 1;
  }

  if (drawn > 0) log(state, `${player.name} 摸 ${drawn} 张牌`, player.id, 'draw');
}

function addStatus(state           , player             , status          , turns         ) {
  const isAbnormal = status !== 'shield' && status !== 'abnormalImmunity' && status !== 'sureHit';
  if (isAbnormal && player.statuses.shield) {
    delete player.statuses.shield;
    log(state, `${player.name} 的圣盾免疫了 ${STATUS_LABELS[status]}`, player.id, 'shield');
    return;
  }

  if (isAbnormal && player.statuses.abnormalImmunity) {
    delete player.statuses.abnormalImmunity;
    log(state, `${player.name} 的异常免疫抵消了 ${STATUS_LABELS[status]}`, player.id, 'status');
    return;
  }

  player.statuses[status] = { id: status, turns };
  if (isAbnormal) state.metrics.statusesApplied += 1;
  log(state, `${player.name} 获得 ${STATUS_LABELS[status]}`, player.id, 'status');
}

function removeOneRoundStatuses(state           , player             ) {
  for (const status of ['burn', 'frozen', 'silence']              ) {
    if (player.statuses[status]) {
      delete player.statuses[status];
      log(state, `${player.name} 的 ${STATUS_LABELS[status]} 消失`, player.id, 'status');
    }
  }
}

function heal(
  state           ,
  player             ,
  amount        ,
  source              ,
  options                                                         = {},
) {
  if (
    isInfectionMode(state) &&
    !options.bypassInfection &&
    (player.infected || isInfectedFaction(player))
  ) {
    log(state, `${player.name} 受到月蚀感染影响，不能通过普通恢复回复生命`, player.id, 'infection');
    return;
  }
  const leoAuraActive = state.players.some((candidate) => candidate.hp > 0 && candidate.characterId === 'leo');
  if (!options.bypassLeoAura && leoAuraActive && player.statuses.burn) {
    log(state, `${player.name} is burning and cannot recover because Leo aura is active`, player.id, 'heal');
    return;
  }
  const before = player.hp;
  player.hp = Math.min(player.maxHp, player.hp + amount);
  const healed = player.hp - before;
  if (healed > 0) {
    state.metrics.heals += healed;
    if (source) {
      state.metrics.healingBySource[source.id] = (state.metrics.healingBySource[source.id] ?? 0) + healed;
    }
    for (const cancer of state.players) {
      if (cancer.hp <= 0 || cancer.characterId !== 'cancer') continue;
      if (cancer.flags.cancerTideBondDraws >= 3) continue;
      cancer.flags.cancerTideBondDraws += 1;
      drawCards(state, cancer, 1);
      triggerSkillMetric(state, 'cancer.tideBond');
      log(state, `${cancer.name} 因共潮摸 1 张牌`, cancer.id, 'skill');
    }
    log(state, `${player.name} 回复 ${healed} 点生命`, player.id, 'heal');
  }
}

function rescueHeal(
  state           ,
  player             ,
  amount        ,
  source              ,
  options                                                         = {},
) {
  heal(state, player, amount, source, options);
  if (player.hp <= 0) player.hp = Math.min(player.maxHp, 1);
}

function triggerSkillMetric(state           , key        ) {
  state.metrics.skillTriggers[key] = (state.metrics.skillTriggers[key] ?? 0) + 1;
}

function isSilencedInOwnActionTurn(state           , player             ) {
  return Boolean(player.statuses.silence && state.activePlayerId === player.id);
}

function gainCapricornRage(state           , player                         , amount        , reason        ) {
  if (!player || player.characterId !== 'capricorn' || amount <= 0) return;
  player.rage += amount;
  triggerSkillMetric(state, 'capricorn.unyielding');
  log(state, `${player.name} 因蓄怒${reason}获得 ${amount} 点怒气`, player.id, 'skill');
}

const NORMAL_ABNORMAL_STATUSES             = ['burn', 'frozen', 'blind', 'silence'];

function cleanseInfection(state           , player             , source              ) {
  if (!isInfectionMode(state) || !player.infected) return false;
  player.infected = false;
  state.infection .metrics.cleansed += 1;
  log(state, `${player.name} 的感染被净化`, source?.id ?? player.id, 'infection');
  return true;
}

function applyInfection(state           , player             , source              , viaCard = false) {
  if (!isInfectionMode(state) || isInfectedFaction(player) || player.infected || !isAlive(player)) return false;
  player.infected = true;
  state.infection .metrics.applied += 1;
  log(
    state,
    `${player.name} 获得感染${viaCard ? '（感染牌）' : ''}`,
    source?.id ?? player.id,
    'infection',
  );
  return true;
}

function clearRoleResources(player             ) {
  player.statuses = {};
  player.flags = freshFlags();
  player.rage = 0;
  player.armor = 0;
}

function discardAllPlayerZones(state           , player             ) {
  state.discard.push(...player.hand.splice(0));
  if (player.equipment.weapon) state.discard.push(player.equipment.weapon);
  if (player.equipment.armor) state.discard.push(player.equipment.armor);
  player.equipment = {};
}

function recordInfectionDeath(state           , player             ) {
  if (!state.infection) return;
  state.infection.chainDeaths.push({
    playerId: player.id,
    factionId: player.factionId ?? 'survivor',
    role: player.infectionRole,
  });
}

function transformSurvivor(state           , player             ) {
  discardAllPlayerZones(state, player);
  clearRoleResources(player);
  player.factionId = 'infected';
  player.infectionRole = 'converted';
  player.infected = false;
  player.eliminated = false;
  player.maxHp = Math.max(1, (player.baseMaxHp ?? CHARACTERS[player.characterId].maxHp) - 1);
  player.hp = 1;
  state.infection .metrics.transformed += 1;
  log(state, `${player.name} 转化为月蚀感染者，以 1 点生命复活`, player.id, 'transform');
  const boss = state.players.find((candidate) => candidate.id === state.infection .bossPlayerId);
  if (boss && isAlive(boss)) {
    drawCards(state, boss, 2);
    triggerSkillMetric(state, 'infection.bossConversionReward');
    log(state, `${boss.name} 因幸存者转化摸 2 张牌`, boss.id, 'infection');
  }
}

function eligibleRescuers(state           , target             , willTransform         ) {
  return state.players
    .filter((candidate) => candidate.factionId === 'survivor' && !candidate.eliminated)
    .filter((candidate) => {
      const hasSun = candidate.hand.some((card) => card.kind === 'sun');
      if (hasSun) return true;
      if (willTransform) return false;
      return (
        candidate.characterId === 'cancer' &&
        candidate.id !== target.id &&
        state.activePlayerId !== candidate.id &&
        candidate.hp > 0 &&
        !candidate.flags.usedCancerRescueThisRound &&
        candidate.hand.some((card) => card.element === 'water')
      );
    })
    .map((candidate) => candidate.id);
}

function nextRescueResponder(state           ) {
  const pending = state.infection?.pendingDying;
  if (!pending) return undefined;
  return pending.eligibleResponderIds.find((playerId) => !pending.passedResponderIds.includes(playerId));
}

function continueAfterInfectionInterruption(
  state           ,
  resumePhase       ,
  interruptedPlayerId         ,
  endTurnAfterResolution = false,
) {
  if (state.phase === 'gameOver') return;
  if (state.pendingAttack) {
    state.phase = 'response';
    clearPendingOrNextTarget(state);
    return;
  }
  state.phase = resumePhase;
  if (endTurnAfterResolution && interruptedPlayerId) {
    const interrupted = findPlayer(state, interruptedPlayerId);
    endTurn(state, interrupted, true);
  }
}

function resolutionIsPending(state           ) {
  return Boolean(
    state.pendingRescue || (isInfectionMode(state) &&
    (
      state.infection?.pendingDying ||
      state.infection?.pendingReward ||
      state.infection?.pendingInfectionCard ||
      state.phase === 'rescue' ||
      state.phase === 'reward' ||
      state.phase === 'infectionResponse'
    ))
  );
}

function queueInfectionReward(
  state           ,
  killer                         ,
  defeated             ,
  resumePhase       ,
  interruptedPlayerId         ,
  endTurnAfterResolution = false,
) {
  if (
    !state.infection ||
    !killer ||
    killer.factionId !== 'survivor' ||
    !isAlive(killer) ||
    defeated.factionId !== 'infected'
  ) {
    continueAfterInfectionInterruption(
      state,
      resumePhase,
      interruptedPlayerId,
      endTurnAfterResolution,
    );
    return;
  }
  state.infection.pendingReward = {
    playerId: killer.id,
    defeatedPlayerId: defeated.id,
    resumePhase,
    interruptedPlayerId,
    endTurnAfterResolution,
  };
  state.phase = 'reward';
  log(state, `${killer.name} 击杀感染者，可立即选择一项奖励`, killer.id, 'reward');
}

function eliminateInfectionPlayer(
  state           ,
  player             ,
  killer                         ,
  resumePhase       ,
  interruptedPlayerId         ,
  endTurnAfterResolution = false,
) {
  const defeatedFaction = player.factionId;
  player.hp = 0;
  player.eliminated = true;
  player.infected = false;
  discardAllPlayerZones(state, player);
  clearRoleResources(player);
  recordInfectionDeath(state, player);
  if (player.infectionRole === 'initial') {
    state.infection .damageSpreadEnabled = false;
    log(state, `${player.name} 作为初始感染者阵亡，伤害型感染传播停止`, player.id, 'eliminate');
  } else {
    log(state, `${player.name} 永久出局`, player.id, 'eliminate');
  }
  if (defeatedFaction === 'infected') {
    queueInfectionReward(
      state,
      killer,
      player,
      resumePhase,
      interruptedPlayerId,
      endTurnAfterResolution,
    );
  } else {
    continueAfterInfectionInterruption(
      state,
      resumePhase,
      interruptedPlayerId,
      endTurnAfterResolution,
    );
  }
}

function finalizePendingDying(state           ) {
  const pending = state.infection?.pendingDying;
  if (!pending) return;
  const target = findPlayer(state, pending.targetId);
  const source = pending.sourceId ? findPlayer(state, pending.sourceId) : undefined;
  delete state.infection .pendingDying;
  if (pending.willTransform) {
    transformSurvivor(state, target);
    continueAfterInfectionInterruption(
      state,
      pending.resumePhase,
      target.id,
      pending.endActiveTurnAfterResolution || pending.endTurnAfterResolution,
    );
    return;
  }
  eliminateInfectionPlayer(
    state,
    target,
    source,
    pending.resumePhase,
    target.id,
    pending.endActiveTurnAfterResolution || pending.endTurnAfterResolution,
  );
}

function beginInfectionDying(
  state           ,
  target             ,
  source              ,
  resumePhase        = state.phase,
  endTurnAfterResolution = false,
) {
  if (!isInfectionMode(state) || target.hp > 0 || target.eliminated) return;
  if (isInfectedFaction(target)) {
    eliminateInfectionPlayer(
      state,
      target,
      source,
      resumePhase,
      target.id,
      endTurnAfterResolution || state.activePlayerId === target.id,
    );
    return;
  }

  const willTransform = Boolean(target.infected);
  const eligibleResponderIds = eligibleRescuers(state, target, willTransform);
  state.infection .pendingDying = {
    targetId: target.id,
    sourceId: source?.id,
    willTransform,
    resumePhase,
    eligibleResponderIds,
    passedResponderIds: [],
    endTurnAfterResolution,
    endActiveTurnAfterResolution: state.activePlayerId === target.id && resumePhase !== 'response',
  };
  const responder = nextRescueResponder(state);
  if (!responder) {
    finalizePendingDying(state);
    return;
  }
  state.infection .pendingDying.currentResponderId = responder;
  state.phase = 'rescue';
  log(
    state,
    `${target.name} 濒死，等待太阳急救${willTransform ? '；未获救将转化' : ''}`,
    target.id,
    'rescue',
  );
}

function resolveInfectionReward(
  state           ,
  player             ,
  option                       ,
  statusId                         ,
) {
  const pending = state.infection?.pendingReward;
  if (!pending || pending.playerId !== player.id) throw new Error('当前没有该角色的感染者击杀奖励');
  if (option === 'draw2') {
    drawCards(state, player, 2);
  } else if (option === 'heal1') {
    if (player.infected || player.hp >= player.maxHp) throw new Error('当前不能选择回复生命奖励');
    heal(state, player, 1, player);
  } else if (option === 'cleanse') {
    if (statusId === 'infection') {
      if (!cleanseInfection(state, player, player)) throw new Error('角色没有感染可移除');
    } else {
      const chosen = statusId ?? NORMAL_ABNORMAL_STATUSES.find((id) => player.statuses[id]);
      if (!chosen || !player.statuses[chosen]) throw new Error('角色没有可移除的异常状态');
      delete player.statuses[chosen];
      log(state, `${player.name} 通过击杀奖励移除异常`, player.id, 'reward');
    }
  } else {
    drawCards(
      state,
      player,
      1,
      (card) => card.element === CHARACTERS[player.characterId].element,
    );
  }
  log(state, `${player.name} 结算感染者击杀奖励：${option}`, player.id, 'reward');
  delete state.infection .pendingReward;
  continueAfterInfectionInterruption(
    state,
    pending.resumePhase,
    pending.interruptedPlayerId,
    pending.endTurnAfterResolution,
  );
}

function checkInfectionVictory(state           ) {
  if (!isInfectionMode(state) || state.phase === 'gameOver') return;
  if (
    state.infection .pendingDying ||
    state.infection .pendingReward ||
    state.infection .pendingInfectionCard ||
    state.pendingAttack
  ) {
    return;
  }
  const livingSurvivors = state.players.filter(
    (player) => player.factionId === 'survivor' && isAlive(player),
  );
  const livingInfected = state.players.filter(
    (player) => player.factionId === 'infected' && isAlive(player),
  );
  const latent = livingSurvivors.filter((player) => player.infected);

  let winner                                     ;
  if (livingSurvivors.length === 0) {
    const deaths = state.infection .chainDeaths;
    const simultaneousConvertedDeath =
      livingInfected.length === 0 &&
      deaths.some((death) => death.factionId === 'survivor') &&
      deaths.some((death) => death.role === 'converted');
    winner = simultaneousConvertedDeath ? 'survivor' : 'infected';
  } else if (livingInfected.length === 0 && latent.length === 0) {
    winner = 'survivor';
  }
  if (!winner) return;
  state.infection .winnerFactionId = winner;
  state.phase = 'gameOver';
  state.winnerTeamId = winner === 'survivor' ? 'A' : 'B';
  state.winnerId = state.players.find(
    (player) => player.factionId === winner && isAlive(player),
  )?.id;
  clearPlayedCards(state);
  log(state, `${winner === 'survivor' ? '幸存者' : '感染者'}阵营获胜`, state.winnerId, 'gameOver');
}

function findTaurusGuardianFor(state           , target             ) {
  return state.players.find(
    (candidate) =>
      candidate.hp > 0 &&
      candidate.characterId === 'taurus' &&
      sameFaction(state, candidate, target) &&
      candidate.id !== target.id &&
      candidate.flags.taurusGuardTargetId === target.id &&
      !candidate.flags.usedTaurusGuardThisRound &&
      candidate.hand.length > 0,
  );
}

function queueSkillDecision(state           , decision                      ) {
  state.pendingSkillDecisions ??= [];
  state.pendingSkillDecisions.push(decision);
}

function resumeAfterSkillDecisions(state           ) {
  if (state.pendingSkillDecisions?.length || state.pendingRescue) return;
  state.pendingSkillDecisions = undefined;
  const resume = state.pendingSkillResume;
  state.pendingSkillResume = undefined;
  if (resume === 'finishAttack' && state.pendingAttack) {
    const source = findPlayer(state, state.pendingAttack.sourceId);
    if (!moveTurnAfterDyingActivePlayer(state, source)) finishCurrentHit(state);
    return;
  }
  if (resume === 'endTurn') {
    const active = findPlayer(state, state.activePlayerId);
    endTurn(state, active);
  }
}

function resolveSkillDecision(
  state           ,
  action                                                   ,
) {
  const decision = state.pendingSkillDecisions?.[0];
  if (!decision) throw new Error('No skill decision pending');
  if (decision.playerId !== action.playerId) throw new Error('Wrong player for skill decision');
  state.pendingSkillDecisions .shift();
  const player = findPlayer(state, decision.playerId);
  const source = decision.sourceId ? findPlayer(state, decision.sourceId) : undefined;

  if (decision.kind === 'taurusGuard') {
    const target = findPlayer(state, decision.targetId );
    if (action.activate) {
      const cardIds = [...new Set(action.cardIds ?? [])];
      if (cardIds.length !== 1) throw new Error('牛守需要选择弃置 1 张手牌');
      const cost = takeCard(player, cardIds[0]);
      state.discard.push(cost);
      player.flags.usedTaurusGuardThisRound = true;
      triggerSkillMetric(state, 'taurus.guard');
      log(state, `${player.name} 弃置 ${cost.name}，为 ${target.name} 承受伤害`, player.id, 'skill');
      applyDamage(state, player, source, decision.amount ?? 0, {
        ...decision.damageOptions,
        guarded: true,
      });
      if (state.phase !== 'gameOver' && player.hp > 0) drawCards(state, player, 1);
    } else {
      applyDamage(state, target, source, decision.amount ?? 0, {
        ...decision.damageOptions,
        guarded: true,
      });
    }
  }

  if (decision.kind === 'taurusThickSkin' && action.activate) {
    const cardIds = [...new Set(action.cardIds ?? [])];
    if (cardIds.length !== 1) throw new Error('厚皮需要选择弃置 1 张手牌');
    const discarded = takeCard(player, cardIds[0]);
    state.discard.push(discarded);
    if (source && source.hp > 0) addStatus(state, source, 'silence', 1);
    triggerSkillMetric(state, 'taurus.thickSkin');
    log(state, `${player.name} 弃置 ${discarded.name} 发动厚皮，令 ${source?.name ?? '伤害来源'} 沉默`, player.id, 'skill');
  }

  if (decision.kind === 'virgoDomain' && action.activate && player.hp > 0) {
    player.flags.usedVirgoDomainThisTurn = true;
    player.flags.virgoDomainActive = true;
    triggerSkillMetric(state, 'virgo.domain');
    log(state, `${player.name} 发动净域，本回合后续卡牌伤害无效`, player.id, 'skill');
  }

  if (decision.kind === 'virgoDiscipline' && action.activate && source?.hp && source.hp > 0) {
    applyDamage(state, source, player, 1, { skillKey: 'virgo.discipline' });
    triggerSkillMetric(state, 'virgo.discipline');
    log(state, `${player.name} 发动戒律，对 ${source.name} 造成 1 点普通伤害`, player.id, 'skill');
  }

  if (decision.kind === 'aquariusWindCut' && action.activate) {
    const target = action.targetId ? findPlayer(state, action.targetId) : undefined;
    if (!target || target.id === player.id || target.hp <= 0) {
      throw new Error('断流需要选择另一名存活角色');
    }
    assertNotIceArmorBlocked(player, target);
    const cardIds = [...new Set(action.cardIds ?? [])];
    const requiredCount = Math.min(2, target.hand.length);
    if (cardIds.length !== requiredCount) throw new Error(`断流需要选择目标 ${requiredCount} 张手牌`);
    if (cardIds.some((cardId) => !target.hand.some((card) => card.id === cardId))) {
      throw new Error('断流只能选择目标的手牌');
    }
    const discarded = cardIds.map((cardId) => takeCard(target, cardId));
    state.discard.push(...discarded);
    player.flags.usedAquariusWindCutThisRound = true;
    applyDamage(state, target, player, 1);
    triggerSkillMetric(state, 'aquarius.windCut');
    log(state, `${player.name} 发动断流，弃置 ${target.name} ${discarded.length} 张牌并造成 1 点伤害`, player.id, 'skill');
  }

  if (decision.kind === 'aquariusChalice' && action.activate) {
    // 倾杯换牌：水瓶与至多 2 名玩家交换至多 2 张等量手牌（每张给出须对应取回一张）。
    const giveIds = action.cardIds ?? [];
    const takeIds = action.selectedCardIds ?? [];
    const targetIds = decision.targetIds ?? action.targetIds ?? [];
    if (new Set(targetIds).size > 2) throw new Error('倾杯最多与 2 名玩家交换');
    if (giveIds.length > 2 || takeIds.length > 2) throw new Error('倾杯单次最多交换 2 张牌');
    if (giveIds.length !== takeIds.length) throw new Error('倾杯交出的牌与取回的牌数量必须一致');
    if (new Set(giveIds).size !== giveIds.length || new Set(takeIds).size !== takeIds.length) {
      throw new Error('倾杯选择的牌不能重复');
    }
    // 每张 give/take 必须能映射到一名合法目标（targetIds 给出顺序对应）。
    if (targetIds.length !== giveIds.length) throw new Error('倾杯每张交换牌都需要对应一名目标');
    const perTarget = giveIds.length;
    for (let i = 0; i < perTarget; i += 1) {
      const target = findPlayer(state, targetIds[i]);
      if (!target || target.id === player.id || target.hp <= 0) {
        throw new Error('倾杯只能与其他存活角色交换');
      }
      const giveCard = player.hand.find((card) => card.id === giveIds[i]);
      const takeCardObj = target.hand.find((card) => card.id === takeIds[i]);
      if (!giveCard) throw new Error('倾杯只能交出水瓶的手牌');
      if (!takeCardObj) throw new Error('倾杯只能交换目标的手牌');
    }
    for (let i = 0; i < perTarget; i += 1) {
      const target = findPlayer(state, targetIds[i]) ;
      const giveCard = takeCard(player, giveIds[i]) ;
      const takeCardObj = takeCard(target, takeIds[i]) ;
      target.hand.push(giveCard);
      player.hand.push(takeCardObj);
    }
    triggerSkillMetric(state, 'aquarius.stormEye');
    log(state, `${player.name} 发动倾杯，与 ${new Set(targetIds).size} 名玩家交换 ${perTarget} 张手牌`, player.id, 'skill');
  }

  if (decision.kind === 'libraJudgment') {
    const target = action.targetId ? findPlayer(state, action.targetId) : undefined;
    if (!target || target.hp <= 0) throw new Error('审判需要选择一名存活角色');
    assertNotIceArmorBlocked(player, target);
    addStatus(state, target, 'blind', 1);
    triggerSkillMetric(state, 'libra.judgment');
    log(state, `${player.name} 发动审判，令 ${target.name} 获得致盲`, player.id, 'skill');
  }

  if (decision.kind === 'libraPerfectJudgment') {
    const target = action.targetId ? findPlayer(state, action.targetId) : undefined;
    if (!target || target.hp <= 0) throw new Error('完美审判需要选择一名存活角色');
    assertNotIceArmorBlocked(player, target);
    if (action.option === 'damage') {
      applyDamage(state, target, player, 1);
      log(state, `${player.name} 发动完美审判，对 ${target.name} 造成 1 点普通伤害`, player.id, 'skill');
    } else if (action.option === 'steal') {
      if (!action.selectedCardId || !target.hand.some((card) => card.id === action.selectedCardId)) {
        throw new Error('完美审判需要选择目标 1 张手牌');
      }
      const stolen = takeCard(target, action.selectedCardId);
      player.hand.push(stolen);
      log(state, `${player.name} 发动完美审判，获得 ${target.name} 的 1 张手牌`, player.id, 'skill');
    } else {
      throw new Error('完美审判需要选择伤害或获得手牌');
    }
    triggerSkillMetric(state, 'libra.perfectJudgment');
  }

  resumeAfterSkillDecisions(state);
}

function applyDamage(
  state           ,
  target             ,
  source                         ,
  amount        ,
  options   
                         
                           
                      
                      
                      
                         
    = {},
) {
  if (amount <= 0 && !options.status) return;
  const sacredDamage = Boolean(options.sacredDamage);
  const ignoresArmor = Boolean(options.trueDamage || options.sacredDamage);

  if (
    amount > 0 &&
    options.cardDamage &&
    target.characterId === 'virgo' &&
    target.flags.virgoDomainActive &&
    !sacredDamage
  ) {
    amount = 0;
    log(state, `${target.name} 的净域免疫了卡牌伤害`, target.id, 'skill');
  }

  if (!options.guarded && amount > 0) {
    const guardian = findTaurusGuardianFor(state, target);
    if (guardian) {
      queueSkillDecision(state, {
        kind: 'taurusGuard',
        playerId: guardian.id,
        sourceId: source?.id,
        targetId: target.id,
        amount,
        damageOptions: options,
      });
      log(state, `${guardian.name} 可以发动牛守，为 ${target.name} 承受伤害`, guardian.id, 'skill');
      return;
    }
  }

  if (target.statuses.shield && (amount > 0 || options.status)) {
    delete target.statuses.shield;
    log(state, `${target.name} 的圣盾免疫了本次伤害或状态`, target.id, 'shield');
    return;
  }

  let damage = amount;
  const armorCard = target.equipment.armor;
  if (!ignoresArmor && armorCard?.element === 'earth') {
    damage = Math.min(damage, 1);
    if (damage > 0 && !target.flags.usedEarthArmorReductionThisRound) {
      target.flags.usedEarthArmorReductionThisRound = true;
      damage = Math.max(0, damage - 1);
      log(state, `${target.name} 的石壁令本轮首次伤害额外 -1`, target.id, 'equipment');
    }
  }

  const armorBefore = target.armor;
  if (!ignoresArmor && target.armor > 0 && damage > 0) {
    const blocked = Math.min(target.armor, damage);
    target.armor -= blocked;
    damage -= blocked;
    log(state, `${target.name} 的护甲抵消 ${blocked} 点伤害`, target.id, 'armor');
  }

  if (
    source &&
    source.id !== target.id &&
    target.characterId === 'taurus' &&
    armorBefore > target.armor &&
    target.hand.length > 0
  ) {
    queueSkillDecision(state, {
      kind: 'taurusThickSkin',
      playerId: target.id,
      sourceId: source.id,
    });
    log(state, `${target.name} 可以弃 1 张牌发动厚皮，令 ${source.name} 沉默`, target.id, 'skill');
  }

  if (damage > 0) {
    target.hp -= damage;
    state.metrics.damageTaken[target.id] = (state.metrics.damageTaken[target.id] ?? 0) + damage;
    if (source) {
      state.metrics.damageBySource[source.id] = (state.metrics.damageBySource[source.id] ?? 0) + damage;
      if (source.id !== target.id && !sacredDamage) gainCapricornRage(state, source, 1, '造成实际伤害');
    }
    if (source && source.id !== target.id && !sacredDamage) gainCapricornRage(state, target, 1, '承受实际伤害');
    log(state, `${target.name} 受到 ${damage} 点${options.trueDamage ? '真实' : ''}伤害`, target.id, 'damage');
    if (target.characterId === 'aries' && !sacredDamage) {
      target.flags.ariesBloodRageReady = true;
      triggerSkillMetric(state, 'aries.bloodRageReady');
    }
    if (target.characterId === 'gemini' && !sacredDamage) {
      drawCards(state, target, 1, (card) => card.element === 'air');
      triggerSkillMetric(state, 'gemini.windForm');
      log(state, `${target.name} 因双生摸 1 张风牌`, target.id, 'skill');
    }
    if (target.characterId === 'sagittarius' && target.equipment.armor) {
      drawCards(state, target, 1);
      triggerSkillMetric(state, 'sagittarius.sharpshot');
      log(state, `${target.name} 的神射因装备防具并承受实际伤害，摸 1 张牌`, target.id, 'skill');
    }
    if (
      isInfectionMode(state) &&
      source &&
      source.id !== target.id &&
      source.infectionRole === 'initial' &&
      state.activePlayerId === source.id &&
      !source.flags.usedInfectionBossPassive
    ) {
      source.flags.usedInfectionBossPassive = true;
      const before = source.hp;
      heal(state, source, 1, source, { bypassLeoAura: true, bypassInfection: true });
      state.infection .metrics.bossPassiveHeals += source.hp - before;
      drawCards(state, source, 1);
      state.infection .metrics.bossPassiveDraws += 1;
      triggerSkillMetric(state, 'infection.bossDrain');
      log(state, `${source.name} 触发月蚀汲取：回复生命并摸 1 张牌`, source.id, 'infection');
    }
    if (
      isInfectionMode(state) &&
      source &&
      source.id !== target.id &&
      isInfectedFaction(source) &&
      target.factionId === 'survivor' &&
      state.infection .damageSpreadEnabled
    ) {
      applyInfection(state, target, source);
    }
    if (
      target.characterId === 'virgo' &&
      !target.flags.usedVirgoDomainThisTurn &&
      target.hp > 0
    ) {
      queueSkillDecision(state, { kind: 'virgoDomain', playerId: target.id });
      log(state, `${target.name} 可以发动净域，免疫本回合后续卡牌伤害`, target.id, 'skill');
    }
    if (target.characterId === 'aquarius' && !sacredDamage && target.hp > 0) {
      // 倾杯（被动）：水瓶受到非神圣的实际伤害后，摸 2 张牌，并可选择换牌。
      drawCards(state, target, 2);
      triggerSkillMetric(state, 'aquarius.stormEye');
      log(state, `${target.name} 的倾杯触发，摸 2 张牌`, target.id, 'skill');
      const others = state.players.filter((candidate) => candidate.id !== target.id && candidate.hp > 0);
      if (others.length > 0 && target.hand.length > 0) {
        queueSkillDecision(state, { kind: 'aquariusChalice', playerId: target.id });
        log(state, `${target.name} 可以选择发动倾杯，与至多 2 名玩家交换至多 2 张等量手牌`, target.id, 'skill');
      }
    }
  }

  if (options.status) addStatus(state, target, options.status, 1);

  if (damage > 0 && source && !ignoresArmor) triggerArmorAfterDamage(state, target, source);
  if (isInfectionMode(state)) {
    if (target.hp <= 0) beginInfectionDying(state, target, source);
  } else {
    checkDefeat(state);
  }
}

function triggerArmorAfterDamage(state           , target             , source             ) {
  const armor = target.equipment.armor;
  if (!armor) return;

  if (armor.element === 'fire' && !target.flags.firstAttackDamageApplied) {
    target.flags.firstAttackDamageApplied = true;
    addStatus(state, source, 'burn', 1);
    log(state, `${target.name} 的火焰披风令 ${source.name} 获得灼烧`, target.id, 'equipment');
  }
  if (armor.element === 'water') {
    if (!source.flags.iceArmorBlockedTargetIds.includes(target.id)) source.flags.iceArmorBlockedTargetIds.push(target.id);
    log(state, `${target.name} 的寒冰护甲限制 ${source.name} 本回合继续输出`, target.id, 'equipment');
  }
  if (armor.element === 'air' && !target.flags.firstAttackDamageApplied && source.hand.length > 0) {
    target.flags.firstAttackDamageApplied = true;
    state.discard.push(source.hand.shift() );
    log(state, `${target.name} 的飓风斗篷令 ${source.name} 弃 1 张牌`, target.id, 'equipment');
  }
}

function standardRescuers(state           , target             ) {
  return state.players.filter(candidate => !candidate.eliminated && (
    candidate.hand.some(card => card.kind === 'sun' || card.kind === 'energy') ||
    (candidate.characterId === 'cancer' && candidate.id !== target.id && candidate.hp > 0 &&
      state.activePlayerId !== candidate.id && !candidate.flags.usedCancerRescueThisRound &&
      candidate.hand.some(card => card.element === 'water'))
  )).sort((left, right) => {
    const priority = (player             ) => player.id === target.id ? 0 : player.teamId === target.teamId ? 1 : 2;
    return priority(left) - priority(right);
  });
}

function finishStandardRescue(state           ) {
  const pending = state.pendingRescue;
  if (!pending) return;
  delete state.pendingRescue;
  state.phase = pending.resumePhase;
  const target = findPlayer(state, pending.targetId);
  if (state.pendingSkillResume) {
    resumeAfterSkillDecisions(state);
  } else if (state.pendingAttack && ['response', 'hammerBreak'].includes(pending.resumePhase)) {
    const attack = state.pendingAttack;
    if (attack.sourceId === target.id) {
      if (target.hp <= 0) moveTurnAfterDyingActivePlayer(state, target);
      else if (attack.defensesRemaining > 0) state.phase = 'response';
      else if (!offerEarthHammerBreak(state, attack)) finishCurrentHit(state);
    } else if (target.hp > 0) {
      finishCurrentHit(state);
    } else {
      clearPendingOrNextTarget(state);
    }
    resolveUnavoidableAttack(state);
  } else if (pending.resumePhase === 'discard' && target.id === state.activePlayerId) {
    endTurn(state, target, true);
  }
  checkDefeat(state);
  settleDyingActivePlayer(state);
}

function checkDefeat(state           ) {
  if (isInfectionMode(state)) {
    checkInfectionVictory(state);
    return;
  }
  if (state.phase === 'gameOver' || state.pendingRescue) return;
  const defeated = state.players.find((player) => player.hp <= 0);
  if (!defeated) return;
  for (const target of state.players.filter(player => player.hp <= 0 && !player.eliminated)) {
    const eligibleResponderIds = standardRescuers(state, target).map(player => player.id);
    if (!eligibleResponderIds.length) continue;
    state.pendingRescue = {
      targetId: target.id, willTransform: false, resumePhase: state.phase,
      eligibleResponderIds, passedResponderIds: [], currentResponderId: eligibleResponderIds[0],
    };
    state.phase = 'rescue';
    log(state, `${target.name} 濒死，等待太阳、星能或蟹护急救`, target.id, 'rescue');
    return;
  }
  const defeatedTeams = defeatedTeamIds(state);
  const finalizeDeathsOutsideTeamDefeat = () => {
    for (const player of state.players) {
      if (player.hp > 0 || player.eliminated || defeatedTeams.includes(player.teamId)) continue;
      player.eliminated = true;
      log(state, `${player.name} 阵亡，退出行动序列`, player.id, 'defeat');
    }
  };
  if (defeatedTeams.length === 0) {
    finalizeDeathsOutsideTeamDefeat();
    return;
  }
  finalizeDeathsOutsideTeamDefeat();
  const rescueReviewTeams = defeatedTeams.filter((teamId) => teamHasRescueReview(state, teamId));
  if (rescueReviewTeams.length > 0) {
    state.phase = 'gameOver';
    state.winnerId = undefined;
    state.winnerTeamId = undefined;
    log(state, `${rescueReviewTeams.join('/')} 队进入急救复核，可使用太阳或星能急救`, undefined, 'defeat');
    return;
  }
  const winner = state.players.find((player) => !defeatedTeams.includes(player.teamId) && player.hp > 0);
  state.winnerId = winner?.id;
  state.winnerTeamId = winner?.teamId;
  state.phase = 'gameOver';
  log(state, `${defeatedTeams.join('/')} 队全员濒死，${winner?.teamId ?? '对方'} 队获胜`, winner?.id, 'gameOver');
}

function moveTurnAfterDyingActivePlayer(state           , player             ) {
  if (state.phase === 'gameOver' || player.hp > 0 || state.activePlayerId !== player.id) return false;
  state.pendingAttack = undefined;
  clearPlayedCards(state);
  state.activePlayerId = nextLivingPlayerAfter(state, player.id).id;
  const enteredNewRound = state.activePlayerId === state.players[0].id;
  state.round += enteredNewRound ? 1 : 0;
  state.phase = 'draw';
  state.firstTurn = false;
  log(state, `${player.name} 濒死，行动立即结束`, player.id, 'defeat');
  return true;
}

function settleDyingActivePlayer(state           ) {
  if (state.phase === 'gameOver' || state.pendingRescue) return;
  const active = findPlayer(state, state.activePlayerId);
  moveTurnAfterDyingActivePlayer(state, active);
}

function elementForFormalUse(player             , card      , chosenElement              )                          {
  if (card.element) return card.element;
  if (card.kind === 'sun' || card.kind === 'moon') return chosenElement ?? CHARACTERS[player.characterId].element;
  return undefined;
}

function recordCardElement(state           , player             , card      , chosenElement              ) {
  const element = elementForFormalUse(player, card, chosenElement);
  if (!element) return;
  if (element === 'air') player.flags.airCardsUsed += 1;

  if (!player.flags.usedCardElements.includes(element)) {
    player.flags.usedCardElements.push(element);
  }

  if (player.characterId === 'libra' && !player.flags.libraRoundElements.includes(element)) {
    player.flags.libraRoundElements.push(element);
    drawCards(state, player, 1);
    triggerSkillMetric(state, 'libra.elementSense');
    log(state, `${player.name} 的衡感触发，首次正式使用${element}属性牌`, player.id, 'skill');
  }

  const turnElementCount = player.flags.usedCardElements.length;
  const canTriggerLibraJudgment = player.characterId === 'libra' && state.activePlayerId === player.id && state.phase === 'main';

  if (canTriggerLibraJudgment && turnElementCount >= 3 && !player.flags.usedLibraJudgmentThisTurn) {
    player.flags.usedLibraJudgmentThisTurn = true;
    queueSkillDecision(state, { kind: 'libraJudgment', playerId: player.id });
    log(state, `${player.name} 的审判触发，等待选择目标`, player.id, 'skill');
  }

  if (canTriggerLibraJudgment && turnElementCount >= 4 && !player.flags.usedLibraPerfectJudgmentThisTurn) {
    player.flags.usedLibraPerfectJudgmentThisTurn = true;
    queueSkillDecision(state, { kind: 'libraPerfectJudgment', playerId: player.id });
    log(state, `${player.name} 的完美审判触发，等待选择效果和目标`, player.id, 'skill');
  }

  if (
    player.characterId === 'gemini' &&
    element === 'air' &&
    player.flags.airCardsUsed >= 3 &&
    !player.flags.usedGeminiExtraTurnThisRound
  ) {
    player.flags.usedGeminiExtraTurnThisRound = true;
    player.flags.grantedExtraTurn = true;
    triggerSkillMetric(state, 'gemini.extraTurn');
    log(state, `${player.name} 的连星准备额外回合`, player.id, 'skill');
  }

}

function canUseHandCard(player             , card      , mode         ) {
  if (!player.statuses.frozen) return true;
  return card.kind !== 'normalAttack' && card.kind !== 'statusAttack' && card.kind !== 'aoe';
}

function canUseBasicAttack(player             ) {
  const commandBonus = player.flags.infectionBossCommandMode === 'extraAttack' ? 1 : 0;
  const limit = player.equipment.weapon?.element === 'fire'
    ? Number.POSITIVE_INFINITY
    : 1 + commandBonus;
  return player.flags.basicAttackCount < limit;
}

function isIceArmorBlocked(player             , target             ) {
  return player.flags.iceArmorBlockedTargetIds.includes(target.id);
}

function assertNotIceArmorBlocked(player             , target             ) {
  if (isIceArmorBlocked(player, target)) {
    throw new Error(`${target.name} 的寒冰护甲限制继续输出`);
  }
}

function consumeBasicAttackAllowance(player             ) {
  player.flags.usedBasicAttack = true;
  player.flags.basicAttackCount += 1;
}

function consumeMatchingEnergyCharge(player             , card      ) {
  const charged =
    (card.kind === 'normalAttack' || card.kind === 'statusAttack') &&
    card.element === player.flags.energyChargeElement;
  if (charged) player.flags.energyChargeElement = undefined;
  return charged;
}

function isAttackCard(card      ) {
  return card.kind === 'normalAttack' || card.kind === 'statusAttack' || card.kind === 'aoe';
}

function fusionKind(materials        )               {
  if (materials.some((card) => card.kind === 'aoe')) return 'aoe';
  if (materials.some((card) => card.kind === 'statusAttack')) return 'statusAttack';
  if (materials.some((card) => card.kind === 'normalAttack')) return 'normalAttack';
  return 'utility';
}

function createWaterCodexFusion(state           , player             , materials        )       {
  const element = CHARACTERS[player.characterId].element;
  const kind = fusionKind(materials);
  return {
    id: `water-codex-${state.seed}-${state.round}-${state.metrics.turns}-${player.id}`,
    name: `${ELEMENT_LABELS[element]}合成牌`,
    kind,
    element,
    fusion: {
      materials: materials.map(({ id, name, kind: materialKind, element: materialElement }) => ({
        id,
        name,
        kind: materialKind,
        element: materialElement,
      })),
      attackCount: materials.filter(isAttackCard).length,
      armorGain: materials.filter((card) => card.kind === 'armor').length,
      sureHit: materials.some((card) => card.kind === 'weapon'),
    },
  };
}

function resolveUnavoidableAttack(state           ) {
  while (
    state.pendingAttack?.unavoidable &&
    !state.pendingAttack.scorpioPoisonStep &&
    state.phase !== 'gameOver' &&
    !resolutionIsPending(state)
  ) {
    const pending = state.pendingAttack;
    const progressKey = `${pending.currentTargetId}:${pending.hitsRemaining}:${pending.remainingTargetIds.length}`;
    resolveFailedDefense(state);
    const next = state.pendingAttack;
    if (!next || state.phase === 'gameOver' || resolutionIsPending(state)) return;
    const nextKey = `${next.currentTargetId}:${next.hitsRemaining}:${next.remainingTargetIds.length}`;
    if (next.scorpioPoisonStep || nextKey === progressKey) return;
  }
}

function offerEarthHammerBreak(state           , pending               ) {
  if (!pending.earthHammerCostRequired) return false;
  pending.earthHammerCostRequired = false;
  const source = findPlayer(state, pending.sourceId);
  const defender = findPlayer(state, pending.currentTargetId);
  if (defender.hand.length === 0) {
    log(state, `${defender.name} 无牌支付撼岳锤的额外防御费用，防御无效`, defender.id, 'equipment');
    triggerSkillMetric(state, 'weapon.earthHammer');
    resolveFailedDefense(state);
    return true;
  }
  state.phase = 'hammerBreak';
  log(state, `${source.name} 的撼岳锤生效：${defender.name} 需额外弃 1 张手牌完成防御`, defender.id, 'equipment');
  return true;
}

function applySuccessfulDefenseOutcome(state           ) {
  const pending = state.pendingAttack;
  if (!pending) throw new Error('No pending attack');
  const defender = findPlayer(state, pending.currentTargetId);

  if (pending.card.kind === 'statusAttack' && pending.statusToApply && !pending.statusDefensePerfect) {
    addStatus(state, defender, pending.statusToApply, 1);
    log(state, `${defender.name} 异属性防御：抵消伤害，但未抵消异常`, defender.id, 'defense');
  } else {
    log(state, `${defender.name} 完美防御成功`, defender.id, 'defense');
  }
  finishCurrentHit(state);
}

function makePendingAttack(state           , source             , card      , targetIds          , baseDamage = 1)                {
  const hitsPerTarget = Math.max(1, card.fusion?.attackCount ?? 1);
  return {
    sourceId: source.id,
    targetIds,
    card,
    baseDamage,
    statusToApply: card.kind === 'statusAttack' && card.element ? statusForElement(card.element) : undefined,
    unavoidable: Boolean(card.fusion?.sureHit),
    trueDamage: false,
    remainingTargetIds: [...targetIds],
    currentTargetId: targetIds[0],
    hitsPerTarget,
    hitsRemaining: hitsPerTarget,
    defensesRemaining: isCapricornWushuangAttack(source, card) ? 2 : 1,
    statusDefensePerfect: true,
  };
}

function isScorpioPoisonAttack(source             , card      ) {
  return (
    source.characterId === 'scorpio' &&
    !source.flags.usedScorpioPoison &&
    card.element === 'water' &&
    (card.kind === 'normalAttack' || card.kind === 'statusAttack' || card.kind === 'aoe')
  );
}

function isCapricornWushuangAttack(source             , card      ) {
  return (
    source.characterId === 'capricorn' &&
    card.element === 'earth' &&
    (card.kind === 'normalAttack' || card.kind === 'statusAttack')
  );
}

function isValidDefense(pending               , defender             , defenseCard      ) {
  if (pending.scorpioPoisonStep) return true;
  if (pending.unavoidable) return false;
  if (defenseCard.kind === 'sun' || defenseCard.kind === 'moon') return true;
  if (defenseCard.kind !== 'normalAttack') return false;
  if (pending.card.kind === 'aoe') {
    return defenseCard.element === pending.card.element;
  }
  if (
    pending.card.fusion &&
    pending.card.kind === 'statusAttack'
  ) {
    return defenseCard.element === pending.card.element;
  }
  return pending.card.kind === 'normalAttack' || pending.card.kind === 'statusAttack';
}

function finishCurrentHit(state           ) {
  const pending = state.pendingAttack;
  if (!pending) return;
  if (pending.hitsRemaining > 1) {
    pending.hitsRemaining -= 1;
    const source = findPlayer(state, pending.sourceId);
    pending.defensesRemaining = isCapricornWushuangAttack(source, pending.card) ? 2 : 1;
    pending.statusDefensePerfect = true;
    state.phase = 'response';
    log(state, `${pending.card.name} 还需结算第 ${pending.hitsPerTarget - pending.hitsRemaining + 1} 次打击`, pending.sourceId, 'attack');
    return;
  }
  enterScorpioPoisonStepOrAdvance(state);
}

function targetNeedsScorpioPoisonStep(state           , pending               ) {
  const target = findPlayer(state, pending.currentTargetId);
  return Boolean(
    pending.scorpioPoisonTargetIds?.includes(target.id) &&
    !pending.scorpioPoisonPaidTargetIds?.includes(target.id) &&
    target.hp > 0,
  );
}

function enterScorpioPoisonStepOrAdvance(state           ) {
  const pending = state.pendingAttack;
  if (!pending) return;
  if (targetNeedsScorpioPoisonStep(state, pending)) {
    const target = findPlayer(state, pending.currentTargetId);
    pending.scorpioPoisonStep = true;
    pending.defensesRemaining = 0;
    state.phase = 'response';
    log(state, `${target.name} must pay 1 water card to avoid Scorpio poison freeze`, target.id, 'skill');
    return;
  }
  clearPendingOrNextTarget(state);
}

function markFreeScorpioStingTarget(source             , target             ) {
  if (!source.flags.scorpioFreeStingTargetIds.includes(target.id)) {
    source.flags.scorpioFreeStingTargetIds.push(target.id);
  }
}

function resolveScorpioPoisonPayment(state           , defender             , card      ) {
  const pending = state.pendingAttack;
  if (!pending?.scorpioPoisonStep || pending.currentTargetId !== defender.id) {
    throw new Error('No Scorpio poison payment needed');
  }
  const source = findPlayer(state, pending.sourceId);
  source.hand.push(card);
  if (card.element === 'water') {
    pending.scorpioPoisonPaidTargetIds = [...(pending.scorpioPoisonPaidTargetIds ?? []), defender.id];
    log(state, `${defender.name} gives ${card.name} to ${source.name} to avoid Scorpio poison freeze`, defender.id, 'skill');
  } else {
    addStatus(state, defender, 'frozen', 1);
    log(state, `${defender.name} gives ${card.name} to ${source.name} and is frozen by Scorpio poison`, defender.id, 'skill');
  }
  pending.scorpioPoisonStep = false;
  rememberCenterPlayedCard(state, defender, card, pending.sourceId);
  clearPendingOrNextTarget(state);
}

function acceptScorpioPoisonFreeze(state           ) {
  const pending = state.pendingAttack;
  if (!pending?.scorpioPoisonStep) return false;
  const target = findPlayer(state, pending.currentTargetId);
  const source = findPlayer(state, pending.sourceId);
  if (target.hand.length === 0) markFreeScorpioStingTarget(source, target);
  addStatus(state, target, 'frozen', 1);
  pending.scorpioPoisonStep = false;
  log(state, `${target.name} failed to pay water and is frozen by Scorpio poison`, target.id, 'skill');
  clearPendingOrNextTarget(state);
  return true;
}

function resolveDefense(state           , defender             , defenseCard      ) {
  const pending = state.pendingAttack;
  if (!pending) throw new Error('No pending attack');
  const source = findPlayer(state, pending.sourceId);

  if (pending.scorpioPoisonStep) {
    resolveScorpioPoisonPayment(state, defender, defenseCard);
    return;
  }

  if (
    defenseCard.kind === 'normalAttack' &&
    (pending.card.kind === 'statusAttack' || pending.card.kind === 'aoe') &&
    defenseCard.element !== pending.card.element
  ) {
    pending.statusDefensePerfect = false;
  }

  state.discard.push(defenseCard);

  if (defenseCard.kind === 'sun') {
    drawCards(state, defender, 1);
    pending.defensesRemaining -= 1;
    log(state, `${defender.name} 使用太阳完美防御并摸 1 张牌`, defender.id, 'defense');
    if (pending.defensesRemaining > 0) {
      log(state, `${defender.name} defended once and still needs ${pending.defensesRemaining} defense card`, defender.id, 'defense');
      return;
    }
    if (offerEarthHammerBreak(state, pending)) return;
    finishCurrentHit(state);
    return;
  }

  if (defenseCard.kind === 'moon') {
    log(state, `${defender.name} 使用月亮完美防御并反击`, defender.id, 'defense');
    pending.defensesRemaining -= 1;
    applyDamage(state, source, defender, 1, { sacredDamage: true });
    if (state.phase === 'gameOver' || resolutionIsPending(state)) return;
    if (
      isInfectionMode(state) &&
      (!state.pendingAttack || state.pendingAttack.currentTargetId !== defender.id)
    ) {
      return;
    }
    if (moveTurnAfterDyingActivePlayer(state, source)) return;
    if (pending.defensesRemaining > 0) {
      log(state, `${defender.name} defended once and still needs ${pending.defensesRemaining} defense card`, defender.id, 'defense');
      return;
    }
    if (offerEarthHammerBreak(state, pending)) return;
    finishCurrentHit(state);
    return;
  }

  pending.defensesRemaining -= 1;
  if (pending.defensesRemaining > 0) {
    log(state, `${defender.name} 防御成功 1 张，还需 ${pending.defensesRemaining} 张防御牌`, defender.id, 'defense');
    return;
  }

  if (offerEarthHammerBreak(state, pending)) return;
  applySuccessfulDefenseOutcome(state);
}

function clearPendingOrNextTarget(state           ) {
  const pending = state.pendingAttack;
  if (!pending) return;
  pending.remainingTargetIds.shift();
  if (pending.remainingTargetIds.length === 0) {
    state.pendingAttack = undefined;
    state.phase = 'main';
    if (pending.card.kind === 'aoe' || pending.targetIds.length > 1) {
      const source = findPlayer(state, pending.sourceId);
      for (const targetId of pending.targetIds) {
        const virgo = findPlayer(state, targetId);
        if (virgo.characterId !== 'virgo' || !isAlive(virgo) || !isAlive(source)) {
          continue;
        }
        queueSkillDecision(state, {
          kind: 'virgoDiscipline',
          playerId: virgo.id,
          sourceId: source.id,
        });
      }
    }
  } else {
    pending.scorpioPoisonStep = false;
    pending.currentTargetId = pending.remainingTargetIds[0];
    const source = findPlayer(state, pending.sourceId);
    pending.hitsRemaining = pending.hitsPerTarget;
    pending.defensesRemaining = isCapricornWushuangAttack(source, pending.card) ? 2 : 1;
    pending.statusDefensePerfect = true;
  }
}

function resolveFailedDefense(state           ) {
  const pending = state.pendingAttack;
  if (!pending) throw new Error('No pending attack');
  const source = findPlayer(state, pending.sourceId);
  const target = findPlayer(state, pending.currentTargetId);

  let damage = pending.baseDamage + (pending.moonAmplifiedTargetId === target.id ? 1 : 0);
  let status = pending.statusToApply;

  if (source.statuses.blind) {
    delete source.statuses.blind;
    if (pending.unavoidable) {
      log(state, `${source.name} 的必中抵消了致盲影响`, source.id, 'status');
    } else {
      damage = 0;
      status = undefined;
      log(state, `${source.name} 因致盲，本次攻击落空`, source.id, 'status');
    }
  }

  applyDamage(state, target, source, damage, {
    status,
    trueDamage: pending.trueDamage,
    cardDamage: true,
  });
  if (state.phase === 'gameOver' || resolutionIsPending(state)) return;
  if (state.pendingSkillDecisions?.length) {
    state.pendingSkillResume = 'finishAttack';
    return;
  }
  if (
    isInfectionMode(state) &&
    (!state.pendingAttack || state.pendingAttack.currentTargetId !== target.id)
  ) {
    return;
  }
  if (moveTurnAfterDyingActivePlayer(state, source)) return;
  finishCurrentHit(state);
}

function handleEarthHammerBreak(state           , action                                               ) {
  if (state.phase !== 'hammerBreak' || !state.pendingAttack) throw new Error('No earth hammer break pending');
  const pending = state.pendingAttack;
  const defender = findPlayer(state, pending.currentTargetId);
  if (action.playerId !== defender.id) throw new Error('Only defender can resolve earth hammer cost');

  if (!action.cardId) {
    log(state, `${defender.name} 放弃支付撼岳锤额外费用，防御无效`, defender.id, 'equipment');
    triggerSkillMetric(state, 'weapon.earthHammer');
    resolveFailedDefense(state);
    return;
  }

  const card = takeCard(defender, action.cardId);
  state.discard.push(card);
  triggerSkillMetric(state, 'weapon.earthHammer');
  log(state, `${defender.name} 额外弃置 ${card.name}，完成对撼岳锤攻击的防御`, defender.id, 'equipment');
  applySuccessfulDefenseOutcome(state);
}

function endTurn(state           , player             , skipEndEffects = false) {
  clearPlayedCards(state);
  if (!skipEndEffects && player.statuses.burn) {
    applyDamage(state, player, undefined, 1);
    if (state.phase === 'gameOver' || resolutionIsPending(state)) return;
  }

  if (
    !skipEndEffects &&
    isInfectionMode(state) &&
    player.factionId === 'survivor' &&
    player.infected &&
    isAlive(player)
  ) {
    player.hp -= 1;
    state.infection .metrics.lifeLost += 1;
    log(state, `${player.name} 因感染在回合结束时失去 1 点生命`, player.id, 'infection');
    if (player.hp <= 0) {
      beginInfectionDying(state, player, undefined, 'discard', true);
      if (state.phase === 'gameOver' || resolutionIsPending(state)) return;
      if (player.eliminated || player.infectionRole === 'converted') return;
    }
  }

  if (state.phase === 'gameOver') return;
  removeOneRoundStatuses(state, player);

  if (player.characterId === 'pisces') {
    drawCards(state, player, 1 + (player.flags.piscesBalanceLoss > 0 ? 1 : 0));
    if (player.flags.piscesBalanceLoss > 0) triggerSkillMetric(state, 'pisces.dreamExtra');
  }

  const extraTurn = player.flags.grantedExtraTurn;
  if (extraTurn) state.metrics.extraTurns += 1;

  for (const candidate of state.players) {
    candidate.flags = {
      ...freshFlags(),
      usedGeminiExtraTurnThisRound: candidate.flags.usedGeminiExtraTurnThisRound,
      libraRoundElements: candidate.flags.libraRoundElements,
      usedCapricornChargeThisRound: candidate.flags.usedCapricornChargeThisRound,
      usedCancerRescueThisRound: candidate.flags.usedCancerRescueThisRound,
      cancerTideBondDraws: candidate.flags.cancerTideBondDraws,
      usedAquariusWindCutThisRound: candidate.flags.usedAquariusWindCutThisRound,
      usedVirgoDisciplineThisRound: candidate.flags.usedVirgoDisciplineThisRound,
      usedEarthArmorReductionThisRound: candidate.flags.usedEarthArmorReductionThisRound,
      ariesBloodRageReady: candidate.id === player.id ? false : candidate.flags.ariesBloodRageReady,
      leoOrderTargetId: candidate.flags.leoOrderTargetId,
      taurusGuardTargetId: candidate.flags.taurusGuardTargetId,
      usedTaurusGuardThisRound: candidate.flags.usedTaurusGuardThisRound,
    };
  }

  if (!extraTurn) {
    state.activePlayerId = nextLivingPlayerAfter(state, player.id).id;
    const enteredNewRound = state.activePlayerId === state.players[0].id;
    state.round += enteredNewRound ? 1 : 0;
    if (enteredNewRound) {
      for (const candidate of state.players) {
        candidate.flags.usedGeminiExtraTurnThisRound = false;
        candidate.flags.libraRoundElements = [];
        candidate.flags.usedCapricornChargeThisRound = false;
        candidate.flags.usedCancerRescueThisRound = false;
        candidate.flags.cancerTideBondDraws = 0;
        candidate.flags.usedAquariusWindCutThisRound = false;
        candidate.flags.usedTaurusGuardThisRound = false;
        candidate.flags.usedVirgoDisciplineThisRound = false;
        candidate.flags.usedEarthArmorReductionThisRound = false;
      }
    }
  }

  state.phase = 'draw';
  state.firstTurn = false;
  const nextActive = findPlayer(state, state.activePlayerId);
  if (nextActive.characterId === 'leo') nextActive.flags.leoOrderTargetId = undefined;
}

function triggerEquipmentLeftOwner(
  state           ,
  owner             ,
  card      ,
) {
  if (card.kind === 'armor' && card.element === 'earth' && isAlive(owner)) {
    heal(state, owner, 1, owner);
    log(state, `${owner.name} 的石壁离开装备区`, owner.id, 'equipment');
  }
  if (owner.characterId !== 'sagittarius' || !isAlive(owner)) return;
  drawCards(state, owner, 2);
  triggerSkillMetric(state, 'sagittarius.bowcraft');
  log(state, `${owner.name} 的整弓触发：${card.name} 离开装备区，摸 2 张牌`, owner.id, 'skill');
}

function playEquipment(state           , player             , card      ) {
  if (card.kind === 'weapon') {
    if (player.equipment.weapon) {
      const replaced = player.equipment.weapon;
      state.discard.push(replaced);
      triggerEquipmentLeftOwner(state, player, replaced);
    }
    player.equipment.weapon = card;
  }
  if (card.kind === 'armor') {
    if (player.equipment.armor) {
      const replaced = player.equipment.armor;
      state.discard.push(replaced);
      triggerEquipmentLeftOwner(state, player, replaced);
    }
    player.equipment.armor = card;
  }
  log(state, `${player.name} 装备 ${card.name}`, player.id, 'equipment');
}

function handleMulligan(state           , action                                       ) {
  if (state.phase !== 'mulligan') throw new Error('Not in mulligan phase');
  const pendingIndex = state.mulliganPendingPlayerIds.indexOf(action.playerId);
  if (pendingIndex < 0) throw new Error('Mulligan already chosen or not pending');

  const player = findPlayer(state, action.playerId);
  if (action.replace) {
    const replaceCount = player.hand.length;
    state.discard.push(...player.hand.splice(0));
    drawCards(state, player, replaceCount);
    log(state, `${player.name} 更换起手牌，弃 ${replaceCount} 张并重摸 ${replaceCount} 张`, player.id, 'setup');
  } else {
    log(state, `${player.name} 保留起手牌`, player.id, 'setup');
  }

  state.mulliganPendingPlayerIds.splice(pendingIndex, 1);
  if (state.mulliganPendingPlayerIds.length > 0) {
    state.activePlayerId = state.startingPlayerId;
    return;
  }

  state.activePlayerId = state.startingPlayerId;
  state.phase = 'draw';
  log(state, `起手选择完成，轮到 ${findPlayer(state, state.activePlayerId).name} 摸牌`, state.activePlayerId, 'setup');
}

function defeatedTeamIds(state           ) {
  const teams = [...new Set(state.players.map((player) => player.teamId))];
  return teams.filter((teamId) =>
    state.players.filter((player) => player.teamId === teamId).every((player) => player.hp <= 0),
  );
}

function isStandardDyingRescueTarget(state           , target             ) {
  return (
    !isInfectionMode(state) &&
    !state.winnerTeamId &&
    !state.winnerId &&
    target.hp <= 0 &&
    !target.eliminated
  );
}

function requireStandardDyingRescueTarget(state           , target             , cardName        ) {
  if (!isStandardDyingRescueTarget(state, target)) {
    throw new Error(`${cardName}只能在角色濒死阶段使用；阵亡判定后不能急救`);
  }
}

function requireStandardDyingRescuer(player             , cardName        ) {
  if (player.eliminated) {
    throw new Error(`已阵亡角色不能使用${cardName}`);
  }
}

function teamHasRescueReview(state           , teamId        ) {
  const hasDyingMember = state.players.some(
    (player) => player.teamId === teamId && player.hp <= 0 && !player.eliminated,
  );
  if (!hasDyingMember) return false;
  return state.players
    .filter((player) => player.teamId === teamId && !player.eliminated)
    .some((player) => player.hand.some((card) => card.kind === 'sun' || card.kind === 'energy'));
}

function reviveGameIfRescued(
  state           ,
  target             ,
  rescueName        ,
  event                    = 'sun',
) {
  if (state.phase !== 'gameOver') return;
  if (defeatedTeamIds(state).length > 0) return;
  state.phase = 'main';
  state.winnerId = undefined;
  state.winnerTeamId = undefined;
  log(state, `${target.name} 通过${rescueName}急救成功，牌局继续`, target.id, event);
}

function resolveInfectionRescueWithSun(
  state           ,
  player             ,
  card      ,
  targetId         ,
) {
  const pending = state.infection?.pendingDying;
  if (
    !isInfectionMode(state) ||
    state.phase !== 'rescue' ||
    !pending ||
    pending.currentResponderId !== player.id
  ) {
    throw new Error('当前没有该角色可处理的太阳急救');
  }
  const target = findPlayer(state, pending.targetId);
  if (targetId && targetId !== target.id) throw new Error('太阳急救目标与当前濒死角色不一致');
  state.discard.push(card);
  cleanseInfection(state, target, player);
  rescueHeal(state, target, 1, player, {
    bypassLeoAura: true,
    bypassInfection: true,
  });
  addStatus(state, target, 'shield');
  delete state.infection .pendingDying;
  log(state, `${player.name} 使用太阳急救 ${target.name}`, player.id, 'sun');
  continueAfterInfectionInterruption(
    state,
    pending.resumePhase,
    target.id,
    pending.endActiveTurnAfterResolution || pending.endTurnAfterResolution,
  );
}

function playSun(state           , player             , card      , targetId         , mode         ) {
  if (mode === 'rescue') {
    if (isInfectionMode(state)) {
      resolveInfectionRescueWithSun(state, player, card, targetId);
      return;
    }
    const target = targetId ? findPlayer(state, targetId) : player;
    requireStandardDyingRescuer(player, '太阳急救');
    requireStandardDyingRescueTarget(state, target, '太阳急救');
    state.discard.push(card);
    rescueHeal(state, target, 1, player, { bypassLeoAura: true });
    addStatus(state, target, 'shield');
    log(state, `${player.name} 使用太阳急救 ${target.name}`, player.id, 'sun');
    if (state.pendingRescue) return finishStandardRescue(state);
    reviveGameIfRescued(state, target, '太阳');
    if (state.phase !== 'gameOver') checkDefeat(state);
    return;
  }
  state.discard.push(card);
  if (mode !== 'active') throw new Error('主动回合太阳目前仅支持 active 模式');
  const target = targetId ? findPlayer(state, targetId) : player;
  if (isInfectionMode(state)) {
    if (target.id !== player.id) throw new Error('感染模式中太阳主动效果只能作用自己');
    if (isInfectedFaction(player) && player.infectionRole !== 'initial') {
      throw new Error('转化感染者不能通过太阳回复生命');
    }
    cleanseInfection(state, target, player);
  }
  drawCards(state, player, 1, (candidate) => candidate.element === CHARACTERS[player.characterId].element);
  heal(state, target, 1, player, {
    bypassLeoAura: true,
    bypassInfection: isInfectionMode(state),
  });
  for (const status of ['burn', 'frozen', 'blind', 'silence']              ) delete target.statuses[status];
  log(state, `${player.name} 使用太阳：获得本属性牌、回复并净化`, player.id, 'sun');
}

function playEnergyRescue(state           , player             , card      , targetId         ) {
  if (isInfectionMode(state)) throw new Error('感染模式没有星能急救');
  const target = targetId ? findPlayer(state, targetId) : player;
  requireStandardDyingRescuer(player, '星能急救');
  requireStandardDyingRescueTarget(state, target, '星能急救');
  state.discard.push(card);
  rescueHeal(state, target, 1, player);
  log(state, `${player.name} 使用星能急救 ${target.name}`, player.id, 'card');
  if (state.pendingRescue) return finishStandardRescue(state);
  reviveGameIfRescued(state, target, '星能', 'card');
  if (state.phase !== 'gameOver') checkDefeat(state);
}

function playRitual(
  state           ,
  player             ,
  card      ,
  targetId         ,
) {
  if (!isInfectionMode(state)) throw new Error('净化仪式只在月蚀感染模式使用');
  const target = targetId ? findPlayer(state, targetId) : player;
  if (isInfectedFaction(player)) {
    if (
      target.factionId !== 'survivor' ||
      target.infected ||
      !isAlive(target)
    ) {
      throw new Error('感染牌只能指定尚未感染的存活幸存者');
    }
    state.infection .pendingInfectionCard = {
      sourceId: player.id,
      targetId: target.id,
      card,
      resumePhase: 'main',
    };
    state.infection .metrics.infectionCardsPlayed += 1;
    state.phase = 'infectionResponse';
    rememberCenterPlayedCard(state, player, effectiveRitualCard(card, true), target.id);
    log(state, `${player.name} 对 ${target.name} 使用${card.element ?? ''}感染牌`, player.id, 'infection');
    return;
  }

  if (target.factionId !== 'survivor' || !isAlive(target)) {
    throw new Error('净化仪式只能指定存活幸存者');
  }
  if (!target.infected) throw new Error('目标当前没有感染');
  state.discard.push(card);
  cleanseInfection(state, target, player);
  rememberCenterPlayedCard(state, player, effectiveRitualCard(card, false), target.id);
}

function handleInfectionResponse(
  state           ,
  action                                               ,
) {
  const pending = state.infection?.pendingInfectionCard;
  if (!isInfectionMode(state) || state.phase !== 'infectionResponse' || !pending) {
    throw new Error('当前没有感染牌需要响应');
  }
  if (action.playerId !== pending.targetId) throw new Error('只有感染牌目标可以响应');
  const target = findPlayer(state, pending.targetId);
  const source = findPlayer(state, pending.sourceId);
  state.discard.push(pending.card);

  if (!action.cardId) {
    applyInfection(state, target, source, true);
    delete state.infection .pendingInfectionCard;
    state.phase = pending.resumePhase;
    checkInfectionVictory(state);
    return;
  }

  const responseCard = takeCard(target, action.cardId);
  if (responseCard.kind !== 'sun' && responseCard.kind !== 'ritual') {
    throw new Error('感染牌只能用太阳或净化仪式抵消');
  }
  state.discard.push(responseCard);
  if (responseCard.kind === 'sun') {
    cleanseInfection(state, target, target);
    for (const status of ['burn', 'frozen', 'blind', 'silence']              ) {
      delete target.statuses[status];
    }
    heal(state, target, 1, target, {
      bypassLeoAura: true,
      bypassInfection: true,
    });
    drawCards(
      state,
      target,
      1,
      (candidate) => candidate.element === CHARACTERS[target.characterId].element,
    );
  } else {
    cleanseInfection(state, target, target);
  }
  state.infection .metrics.infectionCardsCountered += 1;
  rememberCenterPlayedCard(
    state,
    target,
    responseCard.kind === 'ritual'
      ? effectiveRitualCard(responseCard, false)
      : responseCard,
    source.id,
  );
  log(state, `${target.name} 使用${responseCard.name}抵消感染牌`, target.id, 'infection');
  delete state.infection .pendingInfectionCard;
  state.phase = pending.resumePhase;
  checkInfectionVictory(state);
}

function handleSkipRescue(
  state           ,
  action                                         ,
) {
  if (state.pendingRescue && state.phase === 'rescue') {
    const pending = state.pendingRescue;
    if (pending.currentResponderId !== action.playerId) throw new Error('当前不是该角色的急救时机');
    pending.passedResponderIds.push(action.playerId);
    log(state, `${findPlayer(state, action.playerId).name} 放弃急救 ${findPlayer(state, pending.targetId).name}`, action.playerId, 'rescue');
    const next = pending.eligibleResponderIds.find(id => !pending.passedResponderIds.includes(id));
    if (next) pending.currentResponderId = next;
    else {
      const target = findPlayer(state, pending.targetId);
      target.eliminated = true;
      log(state, `${target.name} 未获急救，阵亡并退出行动序列`, target.id, 'defeat');
      finishStandardRescue(state);
    }
    return;
  }
  const pending = state.infection?.pendingDying;
  if (!isInfectionMode(state) || state.phase !== 'rescue' || !pending) {
    throw new Error('当前没有濒死急救等待');
  }
  if (pending.currentResponderId !== action.playerId) throw new Error('当前不是该角色的急救时机');
  pending.passedResponderIds.push(action.playerId);
  const next = nextRescueResponder(state);
  if (next) {
    pending.currentResponderId = next;
    return;
  }
  finalizePendingDying(state);
}

function playMoon(state           , player             , card      , targetId         , mode         ) {
  if (mode === 'amplify') {
    const pending = state.pendingAttack;
    if (state.phase !== 'response' || !pending) throw new Error('月亮增伤只能在攻击响应结算中使用');
    if (pending.sourceId !== player.id) throw new Error('月亮增伤只能强化自己的攻击');
    if (pending.moonAmplifiedTargetId) throw new Error('本次攻击已经使用过月亮增伤');
    const target = findPlayer(state, pending.currentTargetId);
    pending.moonAmplifiedTargetId = target.id;
    state.discard.push(card);
    rememberCenterPlayedCard(state, player, card, target.id);
    log(state, `${player.name} 使用月亮增伤：本次对 ${target.name} 的伤害 +1`, player.id, 'moon');
    return;
  }
  state.discard.push(card);
  if (mode !== 'curse') throw new Error('主动回合月亮目前支持 curse 模式');
  const target = targetId ? findPlayer(state, targetId) : opponentOf(state, player.id);
  const discarded = target.hand.shift();
  if (discarded) state.discard.push(discarded);
  addStatus(state, target, 'silence', 1);
  log(state, `${player.name} 使用月亮窥视与诅咒：弃 ${target.name} 1 张牌并施加沉默`, player.id, 'moon');
}

function handleCancerRescue(state           , action                                       , player             ) {
  if (player.characterId !== 'cancer') throw new Error('Only Cancer can use Crab Guard');
  const infectionPending = state.infection?.pendingDying;
  if (
    isInfectionMode(state) &&
    (
      state.phase !== 'rescue' ||
      infectionPending?.currentResponderId !== player.id ||
      infectionPending.willTransform
    )
  ) {
    throw new Error('感染模式中蟹护只能处理当前未感染的濒死幸存者');
  }
  if (state.phase !== 'gameOver' && state.activePlayerId === player.id) throw new Error('蟹护只能在回合外急救');
  if (player.flags.usedCancerRescueThisRound) throw new Error('蟹护每轮限一次');
  const target = action.targetId ? findPlayer(state, action.targetId) : undefined;
  if (!target || target.id === player.id || target.hp > 0) throw new Error('蟹护只能急救其他濒死角色');
  const cardId = action.cardIds?.[0];
  if (!cardId) throw new Error('蟹护需要弃 1 张水牌');
  const card = takeCard(player, cardId);
  if (card.element !== 'water') throw new Error('蟹护只能弃水牌');
  state.discard.push(card);
  player.flags.usedCancerRescueThisRound = true;
  rescueHeal(state, target, 1, player);
  triggerSkillMetric(state, action.skillId);
  log(state, `${player.name} 发动蟹护急救 ${target.name}`, player.id, 'skill');
  if (state.pendingRescue) return finishStandardRescue(state);
  if (isInfectionMode(state) && infectionPending) {
    delete state.infection .pendingDying;
    continueAfterInfectionInterruption(
      state,
      infectionPending.resumePhase,
      target.id,
      infectionPending.endActiveTurnAfterResolution || infectionPending.endTurnAfterResolution,
    );
    return;
  }
  reviveGameIfRescued(state, target, '蟹护', 'skill');
  if (state.phase !== 'gameOver') checkDefeat(state);
}

function handlePlayCard(state           , action                                       ) {
  const player = findPlayer(state, action.playerId);
  const rescueCard = player.hand.find((candidate) => candidate.id === action.cardId);
  if (rescueCard?.kind === 'sun' && action.mode === 'rescue') {
    playSun(state, player, takeCard(player, action.cardId), action.targetId, action.mode);
    return;
  }
  if (rescueCard?.kind === 'energy' && action.mode === 'rescue') {
    playEnergyRescue(state, player, takeCard(player, action.cardId), action.targetId);
    return;
  }
  if (rescueCard?.kind === 'moon' && action.mode === 'amplify') {
    playMoon(state, player, takeCard(player, action.cardId), action.targetId, action.mode);
    return;
  }

  if (state.phase !== 'main') throw new Error('Cards can only be played in main phase');
  if (action.playerId !== state.activePlayerId) throw new Error('Only active player can play cards');
  const card = takeCard(player, action.cardId);
  if (!canUseHandCard(player, card, action.mode)) throw new Error(`${player.name} is frozen and cannot use attack or AOE cards`);

  recordCardElement(state, player, card, action.elementChoice);

  if (card.fusion) {
    if (card.fusion.armorGain > 0) {
      const armorBefore = player.armor;
      player.armor = Math.min(player.maxArmor, player.armor + card.fusion.armorGain);
      log(state, `${player.name} 的合成牌获得 ${player.armor - armorBefore} 点护甲`, player.id, 'equipment');
    }
    if (card.fusion.attackCount === 0) {
      clearCenterPlayedCards(state);
      rememberCenterPlayedCard(state, player, card, player.id, [player.id], true);
      state.discard.push(card);
      if (card.fusion.sureHit) addStatus(state, player, 'sureHit');
      log(
        state,
        `${player.name} 使用 ${card.name}${card.fusion.sureHit ? '，下一张普通攻击必中且不可防御' : ''}`,
        player.id,
        'equipment',
      );
      return;
    }
  }

  if (card.kind === 'weapon' || card.kind === 'armor') {
    clearCenterPlayedCards(state);
    rememberSidePlayedCard(state, player, card);
    playEquipment(state, player, card);
    return;
  }
  if (card.kind === 'sun') {
    playSun(state, player, card, action.targetId, action.mode);
    return;
  }
  if (card.kind === 'moon') {
    playMoon(state, player, card, action.targetId, action.mode);
    return;
  }
  if (card.kind === 'ritual') {
    playRitual(state, player, card, action.targetId);
    return;
  }

  if (card.kind === 'energy') {
    if (player.flags.energyChargeElement) throw new Error('本回合已有星能蓄能');
    if (!card.element) throw new Error('Star energy card is missing element');
    clearCenterPlayedCards(state);
    state.discard.push(card);
    player.flags.energyChargeElement = card.element;
    log(state, `${player.name} 使用${card.name}蓄能：下一张同属性普通攻击或状态攻击伤害 +1`, player.id, 'card');
    return;
  }

  if (card.kind === 'utility') {
    const target = action.targetId ? findPlayer(state, action.targetId) : opponentOf(state, player.id);
    assertWaterStealInRange(state, player, target, card);
    payDistanceCost(
      state,
      player,
      target,
      targetedCardNeedsDistanceCost(state, player, target, card),
      action.extraCostCardId,
      [card.id],
    );
    payLeoOrderIfNeeded(
      state,
      player,
      [target],
      action.leoOrderPaymentCardId,
      [card.id, action.extraCostCardId].filter(Boolean)            ,
    );
    rememberCenterPlayedCard(state, player, card, target.id, undefined, true);
    if (card.element === 'fire') assertNotIceArmorBlocked(player, target);
    state.discard.push(card);
    if (card.element === 'fire') {
      applyDamage(state, target, player, 1, { cardDamage: true });
      log(state, `${player.name} 发动元素对决，${target.name} 失去 1 点生命`, player.id, 'card');
    } else if (card.element === 'water') {
      const stolen = takeWaterStealableCard(target, action.selectedCardId);
      if (stolen) {
        player.hand.push(stolen);
        log(state, `${player.name} 发动潮汐窃取，获得 ${target.name} 1 张手牌`, player.id, 'card');
      } else {
        log(state, `${player.name} 发动潮汐窃取，但 ${target.name} 没有手牌`, player.id, 'card');
      }
    } else if (card.element === 'air') {
      const removableEquipment = [target.equipment.weapon, target.equipment.armor]
        .filter((candidate)                    => Boolean(candidate));
      const discarded = action.selectedCardId
        ? takeTransferableCard(target, action.selectedCardId)
        : target.hand.shift()
          || (target.equipment.weapon ? takeTransferableCard(target, target.equipment.weapon.id) : undefined)
          || (target.equipment.armor ? takeTransferableCard(target, target.equipment.armor.id) : undefined);
      if (discarded) {
        state.discard.push(discarded);
        const removedEquipment = removableEquipment.find((candidate) => candidate.id === discarded.id);
        if (removedEquipment) triggerEquipmentLeftOwner(state, target, removedEquipment);
        log(state, `${player.name} 发动风之制裁，弃置 ${target.name} 1 张手牌`, player.id, 'card');
      } else {
        addStatus(state, target, 'blind', 1);
        log(state, `${player.name} 发动风之制裁，${target.name} 没有手牌并获得致盲`, player.id, 'card');
      }
    } else {
      drawCards(state, player, 2);
      log(state, `${player.name} 发动石之宝藏，摸 2 张牌`, player.id, 'card');
    }
    return;
  }

  const isFirstNormalAttackThisTurn = card.kind === 'normalAttack' && !player.flags.usedNormalAttackThisTurn;
  if (card.kind === 'normalAttack') player.flags.usedNormalAttackThisTurn = true;
  if (card.kind === 'normalAttack' || card.kind === 'statusAttack') {
    if (!canUseBasicAttack(player)) throw new Error('Basic attack limit reached');
    consumeBasicAttackAllowance(player);
  }

  if (card.kind === 'normalAttack' || card.kind === 'statusAttack' || card.kind === 'aoe') {
    let targets               ;
    if (card.kind === 'aoe') {
      targets = enemiesOf(state, player.id).filter(
        (enemy) => !player.flags.iceArmorBlockedTargetIds.includes(enemy.id),
      );
    } else {
      const requestedTargetIds = [...new Set(
        action.targetIds?.length
          ? action.targetIds
          : [action.targetId ?? opponentOf(state, player.id).id],
      )];
      if (requestedTargetIds.length === 0) throw new Error('基础攻击至少需要一个目标');
      if (requestedTargetIds.length > 1) {
        if (
          !isInitialInfectionBoss(state, player) ||
          player.flags.infectionBossCommandMode !== 'extraTarget' ||
          player.flags.usedInfectionBossExtraTarget
        ) {
          throw new Error('当前不能为基础攻击指定额外目标');
        }
        if (requestedTargetIds.length > 2) throw new Error('蚀月战令最多额外指定 1 个目标');
        player.flags.usedInfectionBossExtraTarget = true;
        triggerSkillMetric(state, 'infection.bossCommandExtraTarget');
      }
      targets = requestedTargetIds.map((targetId) => findPlayer(state, targetId));
      for (const target of targets) {
        if (target.id === player.id) throw new Error('不能攻击自己');
        if (!isInfectionMode(state) && target.teamId === player.teamId) throw new Error('不能攻击队友');
        if (target.hp <= 0 || target.eliminated) throw new Error('不能攻击濒死角色');
        payDistanceCost(
          state,
          player,
          target,
          targetedCardNeedsDistanceCost(state, player, target, card),
          action.extraCostCardId,
          [card.id],
        );
        assertNotIceArmorBlocked(player, target);
      }
    }
    const target = targets[0];
    payLeoOrderIfNeeded(
      state,
      player,
      targets,
      action.leoOrderPaymentCardId,
      [card.id, action.extraCostCardId].filter(Boolean)            ,
    );
    if (targets.length === 0) throw new Error('没有可攻击目标');
    rememberCenterPlayedCard(state, player, card, target.id, targets.map((candidate) => candidate.id), true);
    state.discard.push(card);
    if (card.kind === 'aoe' && player.characterId === 'capricorn') {
      if (player.rage > 0) {
        player.rage -= 1;
        log(state, `${player.name} 使用 AOE 消耗 1 点怒气`, player.id, 'skill');
      } else {
        applyDamage(state, player, player, 1, { sacredDamage: true });
        if (state.phase === 'gameOver') return;
      }
    }
    const energyCharged = consumeMatchingEnergyCharge(player, card);
    let attackDamage = energyCharged ? 2 : 1;
    if (
      player.characterId === 'sagittarius' &&
      player.equipment.weapon &&
      card.kind === 'normalAttack' &&
      card.element === 'fire' &&
      !player.flags.usedSagittariusFirstFireAttack
    ) {
      player.flags.usedSagittariusFirstFireAttack = true;
      attackDamage += 1;
      triggerSkillMetric(state, 'sagittarius.sharpshot');
      log(state, `${player.name} 的神射令本回合首次火属性普通攻击伤害 +1`, player.id, 'skill');
    }
    const scorpioPoisonTargets = isScorpioPoisonAttack(player, card)
      ? targets.map((candidate) => candidate.id)
      : undefined;
    const usesStoredSureHit = card.kind === 'normalAttack' && Boolean(player.statuses.sureHit);
    if (usesStoredSureHit) delete player.statuses.sureHit;
    state.pendingAttack = makePendingAttack(
      state,
      player,
      card,
      targets.map((candidate) => candidate.id),
      attackDamage,
    );
    if (usesStoredSureHit) state.pendingAttack.unavoidable = true;
    if (isFirstNormalAttackThisTurn && player.equipment.weapon?.element === 'earth') {
      state.pendingAttack.earthHammerCostRequired = true;
    }
    if (scorpioPoisonTargets) {
      state.pendingAttack.scorpioPoisonTargetIds = scorpioPoisonTargets;
      player.flags.usedScorpioPoison = true;
      triggerSkillMetric(state, 'scorpio.freezeAoe');
      log(state, `${player.name} 的蝎毒触发：本次水牌命中的目标响应后需额外交给天蝎 1 张牌`, player.id, 'skill');
    }
    if (energyCharged) {
      log(state, `${player.name} 的星能蓄能强化了本次攻击`, player.id, 'card');
    }
    log(state, `${player.name} 对 ${targets.map((candidate) => candidate.name).join('、')} 使用 ${card.name}`, player.id, 'attack');
    if (state.pendingAttack.unavoidable) {
      log(state, `${card.name} 必中且不可防御，直接结算`, player.id, 'attack');
      resolveUnavoidableAttack(state);
    } else {
      state.phase = 'response';
    }
  }
}

function resolveScorpioStingEffect(state           , player             , target             ) {
  if (target.armor > 0) {
    target.armor = Math.max(0, target.armor - 1);
    log(state, `${player.name} uses Scorpio sting to remove 1 armor from ${target.name}`, player.id, 'skill');
    return;
  }
  if (target.statuses.shield) {
    delete target.statuses.shield;
    log(state, `${player.name} uses Scorpio sting to remove shield from ${target.name}`, player.id, 'skill');
    return;
  }
  if (target.equipment.armor) {
    const removedArmor = target.equipment.armor;
    state.discard.push(removedArmor);
    delete target.equipment.armor;
    triggerEquipmentLeftOwner(state, target, removedArmor);
    log(state, `${player.name} uses Scorpio sting to remove armor equipment from ${target.name}`, player.id, 'skill');
    return;
  }
  applyDamage(state, target, player, 1);
}

function handleSkill(state           , action                                       ) {
  const player = findPlayer(state, action.playerId);
  if (action.skillId === 'cancer.rescue') {
    handleCancerRescue(state, action, player);
    return;
  }
  if (player.id !== state.activePlayerId) throw new Error('Only active player can use active skills');
  if (isSilencedInOwnActionTurn(state, player)) throw new Error(`${player.name} is silenced`);
  if (action.skillId === 'scorpio.peek' || action.skillId === 'taurus.guard') {
    if (state.phase !== 'draw') throw new Error('伏击只能在摸牌阶段前发动');
  } else if (state.phase !== 'main') {
    throw new Error('Skills can only be used in main phase');
  }

  if (action.skillId === 'infection.bossCommand') {
    if (!isInitialInfectionBoss(state, player)) throw new Error('只有月蚀初始感染者可以发动蚀月战令');
    if (player.flags.usedInfectionBossCommand) throw new Error('蚀月战令每个主动回合限一次');
    if (action.option !== 'extraAttack' && action.option !== 'extraTarget') {
      throw new Error('蚀月战令需要选择额外攻击或额外目标');
    }
    player.flags.usedInfectionBossCommand = true;
    player.flags.infectionBossCommandMode = action.option;
    triggerSkillMetric(state, action.skillId);
    log(
      state,
      `${player.name} 发动蚀月战令：${action.option === 'extraAttack' ? '本回合可额外使用 1 张基础攻击牌' : '本回合 1 张基础攻击牌可额外指定 1 个目标'}`,
      player.id,
      'infection',
    );
    return;
  }
  const target = action.targetId ? findPlayer(state, action.targetId) : opponentOf(state, player.id);

  if (action.skillId === 'weapon.waterCodex') {
    if (player.equipment.weapon?.element !== 'water') throw new Error('需要装备潮汐法典');
    if (player.flags.usedWeaponConvert) throw new Error('潮汐法典每回合限一次');
    const cardIds = [...new Set(action.cardIds ?? [])];
    if (cardIds.length !== 2) throw new Error('潮汐法典需要任意 2 张手牌');
    const materials = cardIds.map((cardId) => takeCard(player, cardId));
    const fusionCard = createWaterCodexFusion(state, player, materials);
    player.flags.usedWeaponConvert = true;
    player.hand.push(fusionCard);
    triggerSkillMetric(state, action.skillId);
    log(
      state,
      `${player.name} 发动潮汐法典，将 ${materials.map((card) => card.name).join('、')} 合成为 ${fusionCard.name}`,
      player.id,
      'equipment',
    );
    return;
  }

  if (action.skillId === 'weapon.airCompass') {
    if (player.equipment.weapon?.element !== 'air') throw new Error('需要装备命运罗盘');
    if (player.flags.usedWindCompass) throw new Error('命运罗盘每回合限一次');
    if (player.flags.usedCardElements.length < 2) throw new Error('本回合需先正式使用 2 张不同属性牌');
    const element = action.option                           ;
    if (!element || !['fire', 'water', 'air', 'earth'].includes(element)) {
      throw new Error('命运罗盘需要选择一种属性');
    }
    const before = player.hand.length;
    drawCards(state, player, 1, (candidate) => candidate.element === element);
    if (player.hand.length === before) throw new Error('牌库中没有所选属性牌');
    player.flags.usedWindCompass = true;
    triggerSkillMetric(state, action.skillId);
    log(state, `${player.name} 发动命运罗盘，获得 1 张${element}属性牌`, player.id, 'equipment');
    return;
  }

  if (action.skillId === 'aries.ram') {
    if (player.flags.usedAriesRam) throw new Error('羊角冲每回合限一次');
    const cardId = action.cardIds?.[0];
    if (!cardId) throw new Error('羊角冲需要消耗 1 张手牌');
    const card = takeCard(player, cardId);
    const usedBurnSoul = card.element !== 'fire';
    const isAttackCost = card.kind === 'normalAttack' || card.kind === 'statusAttack';
    if (usedBurnSoul) {
      if (!isAttackCost) throw new Error('Burn Soul can only use non-fire normal or status attack cards');
      if (player.flags.usedAriesBurnSoul) throw new Error('燃魂每回合限一次');
      player.flags.usedAriesBurnSoul = true;
    } else if (!isAttackCost) {
      throw new Error('Aries Ram requires a fire normal or status attack cost');
    }
    if (!isInfectionMode(state) && target.teamId === player.teamId) throw new Error('羊角冲不能指定队友');
    payDistanceCost(
      state,
      player,
      target,
      skillNeedsDistanceCost(state, player, target, action.skillId),
      action.extraCostCardId,
      [cardId],
    );
    assertNotIceArmorBlocked(player, target);
    state.discard.push(card);
    player.flags.usedAriesRam = true;
    let damage = 1;
    if (player.flags.ariesBloodRageReady && !player.flags.ariesBloodRageUsed) {
      damage += 1;
      player.flags.ariesBloodRageReady = false;
      player.flags.ariesBloodRageUsed = true;
      triggerSkillMetric(state, 'aries.bloodRage');
    }
    if (player.statuses.blind) {
      delete player.statuses.blind;
      log(state, `${player.name} 因致盲，羊角冲落空`, player.id, 'status');
    } else {
      applyDamage(state, target, player, damage, { status: card.kind === 'statusAttack' && card.element === 'fire' ? 'burn' : undefined });
    }
    triggerSkillMetric(state, action.skillId);
    log(state, `${player.name}${usedBurnSoul ? ' 以燃魂' : ''}发动羊角冲，对 ${target.name} 造成不可防御伤害`, player.id, 'skill');
    return;
  }

  if (action.skillId === 'leo.roar') {
    if (player.flags.usedLeoRoar) throw new Error('Leo roar can only be used once per turn');
    const fireCostId = action.cardIds?.[0];
    if (!fireCostId) throw new Error('Leo roar costs one fire card');
    const fireCost = takeCard(player, fireCostId);
    if (fireCost.element !== 'fire') throw new Error('Leo roar costs one fire card');
    const leoTargetIds = action.targetIds ?? (action.targetId ? [action.targetId] : []);
    if (leoTargetIds.length < 1 || leoTargetIds.length > 3) throw new Error('Leo roar targets one to three roles');
    if (new Set(leoTargetIds).size !== leoTargetIds.length) throw new Error('Leo roar targets distinct roles');
    const leoTargets = leoTargetIds.map((id) => findPlayer(state, id));
    if (leoTargets.some((candidate) => candidate.hp <= 0 || candidate.id === player.id)) {
      throw new Error('Leo roar targets living other roles');
    }
    state.discard.push(fireCost);
    player.flags.usedLeoRoar = true;
    for (const candidate of leoTargets) {
      if (!candidate.statuses.burn) addStatus(state, candidate, 'burn', 1);
    }
    triggerSkillMetric(state, action.skillId);
    log(state, `${player.name} uses Leo roar on ${leoTargets.map((candidate) => candidate.name).join(', ')}`, player.id, 'skill');
    return;
  }

  if (action.skillId === 'leo.order') {
    if (player.characterId !== 'leo') throw new Error('Only Leo can use order');
    if (player.flags.usedLeoOrder) throw new Error('Leo order can only be used once per turn');
    if (target.id === player.id || target.hp <= 0) throw new Error('Leo order targets one living other role');
    const costCardId = action.cardIds?.[0];
    if (!costCardId) throw new Error('Leo order costs one hand card');
    const costCard = takeCard(player, costCardId);
    state.discard.push(costCard);
    player.flags.usedLeoOrder = true;
    player.flags.leoOrderTargetId = target.id;
    triggerSkillMetric(state, action.skillId);
    log(state, `${player.name} uses Leo order on ${target.name}`, player.id, 'skill');
    return;
  }

  if (action.skillId === 'cancer.heal') {
    if (player.flags.usedCancerHeal) throw new Error('疗潮每回合限一次');
    if (target.hp <= 0) throw new Error('疗潮不能治疗濒死角色');
    const costCardId = action.cardIds?.[0];
    if (!costCardId) throw new Error('疗潮需要弃 1 张牌');
    const card = takeCard(player, costCardId);
    state.discard.push(card);
    player.flags.usedCancerHeal = true;
    heal(state, target, 1, player);
    triggerSkillMetric(state, action.skillId);
    log(state, `${player.name} 发动疗潮，治疗 ${target.name}`, player.id, 'skill');
    return;
  }

  if (action.skillId === 'taurus.armor') {
    if (player.flags.usedTaurusArmor) throw new Error('筑甲每回合限一次');
    const earthCardId = action.cardIds?.[0];
    if (!earthCardId) throw new Error('筑甲需要弃 1 张土牌');
    const card = takeCard(player, earthCardId);
    if (card.element !== 'earth') throw new Error('筑甲只能弃土牌');
    if (target.id !== player.id) throw new Error('Taurus Fortify can only target self');
    state.discard.push(card);
    player.flags.usedTaurusArmor = true;
    const before = target.armor;
    target.armor = Math.min(target.maxArmor, target.armor + 1);
    triggerSkillMetric(state, action.skillId);
    log(state, `${player.name} 发动筑甲，${target.name} 护甲 ${before} -> ${target.armor}`, player.id, 'skill');
    return;
  }

  if (action.skillId === 'taurus.guard') {
    if (player.characterId !== 'taurus') throw new Error('Only Taurus can use guard');
    if (!target || target.id === player.id || !sameFaction(state, target, player) || target.hp <= 0) {
      throw new Error('Taurus guard must target a living ally');
    }
    player.flags.taurusGuardTargetId = target.id;
    triggerSkillMetric(state, action.skillId);
    log(state, `${player.name} guards ${target.name}`, player.id, 'skill');
    return;
  }

  if (action.skillId === 'gemini.steal') {
    if (player.flags.usedGeminiSteal) throw new Error('换影每回合限一次');
    const costIds = action.cardIds ?? [];
    const uniqueCostIds = new Set(costIds);
    if ((costIds.length !== 1 && costIds.length !== 2) || uniqueCostIds.size !== costIds.length) {
      throw new Error('换影需要弃 2 张牌，或弃 1 张牌并失去 1 点生命');
    }
    for (const cardId of costIds) {
      if (!player.hand.some((card) => card.id === cardId)) throw new Error('换影选择的弃牌不存在');
    }
    if ((!isInfectionMode(state) && target.teamId === player.teamId) || target.id === player.id || target.hp <= 0) {
      throw new Error('换影必须指定另一名存活角色');
    }
    const equippedTargets = [target.equipment.weapon, target.equipment.armor].filter((card)               => Boolean(card));
    const hasStealableTarget = target.hand.length > 0 || equippedTargets.length > 0;
    if (!hasStealableTarget) {
      assertNotIceArmorBlocked(player, target);
      for (const cardId of costIds) state.discard.push(takeCard(player, cardId));
      if (costIds.length === 1) applyDamage(state, player, player, 1, { trueDamage: true });
      if (state.phase === 'gameOver') return;
      applyDamage(state, target, player, 2, { status: 'blind' });
      player.flags.usedGeminiSteal = true;
      triggerSkillMetric(state, action.skillId);
      log(state, `${player.name} 发动换影，${target.name} 没有手牌和装备，受到 2 点伤害并获得致盲`, player.id, 'skill');
      return;
    }
    if (!action.selectedCardId) throw new Error('换影需要选择目标手牌或装备中的 1 张');
    const stolenIndex = target.hand.findIndex((card) => card.id === action.selectedCardId);
    let stolen                  ;
    let sourceText = '手牌';
    if (stolenIndex >= 0) {
      stolen = target.hand[stolenIndex];
    } else if (target.equipment.weapon?.id === action.selectedCardId) {
      stolen = target.equipment.weapon;
      sourceText = '武器';
    } else if (target.equipment.armor?.id === action.selectedCardId) {
      stolen = target.equipment.armor;
      sourceText = '防具';
    } else {
      throw new Error('换影选择的目标手牌或装备不存在');
    }

    if (stolen.element !== 'air') assertNotIceArmorBlocked(player, target);
    payDistanceCost(
      state,
      player,
      target,
      skillNeedsDistanceCost(state, player, target, action.skillId),
      action.extraCostCardId,
      costIds,
    );
    if (stolenIndex >= 0) {
      target.hand.splice(stolenIndex, 1);
    } else if (target.equipment.weapon?.id === action.selectedCardId) {
      delete target.equipment.weapon;
      triggerEquipmentLeftOwner(state, target, stolen);
    } else if (target.equipment.armor?.id === action.selectedCardId) {
      delete target.equipment.armor;
      triggerEquipmentLeftOwner(state, target, stolen);
    }
    for (const cardId of costIds) state.discard.push(takeCard(player, cardId));
    if (costIds.length === 1) applyDamage(state, player, player, 1, { trueDamage: true });
    if (state.phase === 'gameOver') return;
    if (stolen) {
      player.hand.push(stolen);
      if (stolen.element !== 'air') applyDamage(state, target, player, 1, { status: 'blind' });
    }
    player.flags.usedGeminiSteal = true;
    triggerSkillMetric(state, action.skillId);
    log(state, `${player.name} 发动换影，获得 ${target.name} 的${sourceText} ${stolen.name}`, player.id, 'skill');
    return;
  }

  if (action.skillId === 'libra.harmony') {
    if (player.characterId !== 'libra') throw new Error('只有天秤可以发动裁衡');
    if (player.flags.usedLibraHarmony) throw new Error('裁衡每回合限一次');
    const targetIds = [...new Set(action.targetIds ?? [])];
    if (targetIds.length !== 2 || targetIds.includes(player.id)) {
      throw new Error('裁衡需要选择两名其他存活角色');
    }
    const targets = targetIds.map((targetId) => findPlayer(state, targetId));
    if (targets.some((candidate) => candidate.hp <= 0)) {
      throw new Error('裁衡只能选择存活角色');
    }
    const [first, second] = targets;
    const difference = Math.abs(first.hand.length - second.hand.length);
    if (difference < 2) throw new Error('两名目标的手牌差少于 2，不能发动裁衡');
    const richer = first.hand.length > second.hand.length ? first : second;
    const poorer = richer.id === first.id ? second : first;
    const transferCount = Math.floor(difference / 2);
    const costIds = [...new Set(action.cardIds ?? [])];
    const selectedCardIds = [...new Set(action.selectedCardIds ?? [])];
    if (costIds.length !== transferCount) {
      throw new Error(`裁衡需要弃置 ${transferCount} 张风牌`);
    }
    if (selectedCardIds.length !== transferCount) {
      throw new Error(`裁衡需要选择富方 ${transferCount} 张手牌或装备`);
    }
    if (
      costIds.some((cardId) => {
        const card = player.hand.find((candidate) => candidate.id === cardId);
        return !card || card.element !== 'air';
      })
    ) {
      throw new Error('裁衡费用只能选择自己的风属性手牌');
    }
    if (selectedCardIds.some((cardId) => !findTransferableCard(richer, cardId))) {
      throw new Error('裁衡只能选择富方现有的手牌或装备');
    }
    for (const cardId of costIds) state.discard.push(takeCard(player, cardId));
    const transferred = selectedCardIds.map((cardId) =>
      transferCardBetweenPlayers(state, richer, poorer, cardId),
    );
    player.flags.usedLibraHarmony = true;
    triggerSkillMetric(state, action.skillId);
    log(
      state,
      `${player.name} 发动裁衡，${richer.name} 将 ${transferred.map((card) => card.name).join('、')} 交给 ${poorer.name}`,
      player.id,
      'skill',
    );
    return;
  }

  if (action.skillId === 'aquarius.massHeal') {
    if (player.flags.usedAquariusMassHeal) throw new Error('神酿每回合限一次');
    const costIds = action.cardIds ?? [];
    const uniqueCostIds = new Set(costIds);
    if (costIds.length !== 2 || uniqueCostIds.size !== 2) throw new Error('神酿需要弃 1 张风牌和 1 张任意牌');
    const costs = costIds.map((id) => {
      const found = player.hand.find((card) => card.id === id);
      if (!found) throw new Error('神酿选择的费用牌不存在');
      return found;
    });
    if (!costs.some((card) => card.element === 'air')) throw new Error('神酿需要至少 1 张风牌');
    for (const id of costIds) state.discard.push(takeCard(player, id));
    player.flags.usedAquariusMassHeal = true;
    // 神酿献祭 1 点生命走正常受伤流程，使水瓶的被动「倾杯」被触发（受伤→摸 2 牌），实现与 2 技能的联动。
    applyDamage(state, player, player, 1, { skillKey: 'aquarius.massHeal' });
    log(state, `${player.name} 发动神酿，献祭 1 点生命`, player.id, 'skill');
    for (const candidate of state.players) {
      if (candidate.hp > 0 && candidate.hp < candidate.maxHp) heal(state, candidate, 1, player);
    }
    triggerSkillMetric(state, action.skillId);
    log(state, `${player.name} 发动神酿，所有角色回复 1 点生命`, player.id, 'skill');
    return;
  }

  if (action.skillId === 'pisces.observeTide') {
    if (player.flags.usedPiscesObserveTide) throw new Error('观潮每回合限一次');
    const ids = action.cardIds ?? [];
    if (new Set(ids).size !== ids.length || ids.some(id => !player.hand.some(card => card.id === id))) {
      throw new Error('观潮只能选择自己手牌中不重复的牌');
    }
    for (const id of ids) state.discard.push(takeCard(player, id));
    player.flags.usedPiscesObserveTide = true;
    drawCards(state, player, ids.length);
    triggerSkillMetric(state, action.skillId);
    log(state, `${player.name} 发动观潮，弃 ${ids.length} 张牌，摸 ${ids.length} 张牌`, player.id, 'skill');
    return;
  }

  if (action.skillId === 'pisces.balance') {
    if (player.flags.usedPiscesBalance) throw new Error('平潮每回合限一次');
    const targetIds = [...new Set(action.targetIds ?? [])];
    if (targetIds.length !== 2) throw new Error('平潮需要选择两名不同的存活角色');
    const targets = targetIds.map((targetId) => findPlayer(state, targetId));
    if (targets.some((candidate) => candidate.hp <= 0)) {
      throw new Error('平潮只能选择存活角色');
    }
    const [first, second] = targets;
    const diff = Math.abs(first.hp - second.hp);
    const waterCardIds = [...new Set(action.cardIds ?? [])];
    if (waterCardIds.length !== diff) throw new Error('平潮需要弃等同生命差的水牌');
    if (
      waterCardIds.some((cardId) => {
        const card = player.hand.find((candidate) => candidate.id === cardId);
        return !card || card.element !== 'water';
      })
    ) {
      throw new Error('平潮只能弃自己的水属性手牌');
    }
    for (const cardId of waterCardIds) state.discard.push(takeCard(player, cardId));
    const average = Math.floor((first.hp + second.hp) / 2);
    const beforeHp = new Map(targets.map((candidate) => [candidate.id, candidate.hp]));
    for (const candidate of targets) {
      if (candidate.hp > average) candidate.hp = average;
      if (candidate.hp < average) heal(state, candidate, average - candidate.hp, player);
    }
    player.flags.piscesBalanceLoss = targets.some(
      (candidate) => candidate.hp !== beforeHp.get(candidate.id),
    )
      ? 1
      : 0;
    player.flags.usedPiscesBalance = true;
    triggerSkillMetric(state, action.skillId);
    log(
      state,
      `${player.name} 对 ${first.name}、${second.name} 发动平潮，双方生命变为 ${average}`,
      player.id,
      'skill',
    );
    return;
  }

  if (action.skillId === 'sagittarius.seekEquipment') {
    if (player.characterId !== 'sagittarius') throw new Error('只有射手可以发动寻器');
    if (player.flags.usedSagittariusSeek) throw new Error('寻器每回合限一次');
    const costIds = action.cardIds ?? [];
    if (costIds.length !== 2 || new Set(costIds).size !== 2) {
      throw new Error('寻器需要弃 1 张火牌和 1 张任意手牌');
    }
    const costs = costIds.map((id) => {
      const card = player.hand.find((candidate) => candidate.id === id);
      if (!card) throw new Error('寻器费用牌不在手牌中');
      return card;
    });
    if (!costs.some((card) => card.element === 'fire')) {
      throw new Error('寻器费用中必须包含 1 张火属性牌');
    }
    const equipmentIndex = state.deck.findIndex(
      (card) => card.kind === 'weapon' || card.kind === 'armor',
    );
    if (equipmentIndex < 0) {
      log(state, `${player.name} 发动寻器但牌库中没有装备，资源返还`, player.id, 'skill');
      return;
    }
    for (const id of costIds) state.discard.push(takeCard(player, id));
    const equipment = state.deck.splice(equipmentIndex, 1)[0];
    player.hand.push(equipment);
    player.flags.usedSagittariusSeek = true;
    triggerSkillMetric(state, action.skillId);
    log(state, `${player.name} 发动寻器，获得 ${equipment.name}`, player.id, 'skill');
    return;
  }

  if (action.skillId === 'virgo.purify') {
    if (player.characterId !== 'virgo') throw new Error('只有处女可以发动净化');
    if (player.flags.usedVirgoPurify) throw new Error('净化每回合限一次');
    const costId = action.cardIds?.[0];
    if (!costId) throw new Error('净化需要弃 1 张土牌');
    const cost = player.hand.find((card) => card.id === costId);
    if (!cost || cost.element !== 'earth') throw new Error('净化只能弃土牌');
    if (action.option === 'infection') {
      if (!isInfectionMode(state) || !target.infected) {
        throw new Error('当前目标没有可移除的感染');
      }
      state.discard.push(takeCard(player, costId));
      cleanseInfection(state, target, player);
    } else {
      state.discard.push(takeCard(player, costId));
      const abnormalities = NORMAL_ABNORMAL_STATUSES.filter((status) => target.statuses[status]);
      if (abnormalities.length > 0) {
        for (const status of abnormalities) delete target.statuses[status];
        log(state, `${player.name} 净化 ${target.name} 的全部异常状态`, player.id, 'skill');
      } else {
        addStatus(state, target, 'abnormalImmunity');
      }
    }
    player.flags.usedVirgoPurify = true;
    triggerSkillMetric(state, action.skillId);
    return;
  }

  if (action.skillId === 'scorpio.peek') {
    if (player.characterId !== 'scorpio') throw new Error('只有天蝎可以发动伏击');
    if (player.flags.usedScorpioPeek) throw new Error('伏击每回合限一次');
    const count = state.players.length >= 5 ? 5 : state.players.length === 4 ? 4 : 3;
    const peeked = state.deck.slice(0, count);
    const topCardIds = action.topCardIds ?? peeked.map((card) => card.id);
    const bottomCardIds = action.bottomCardIds ?? [];
    const orderedIds = [...topCardIds, ...bottomCardIds];
    const uniqueIds = new Set(orderedIds);
    const peekedIds = new Set(peeked.map((card) => card.id));

    if (orderedIds.length !== peeked.length || uniqueIds.size !== peeked.length) {
      throw new Error('伏击需要安排所有查看到的牌，且不能重复');
    }
    for (const id of orderedIds) {
      if (!peekedIds.has(id)) throw new Error('伏击只能安排查看到的牌');
    }

    const byId = new Map(peeked.map((card) => [card.id, card]));
    const topCards = topCardIds.map((id) => byId.get(id) );
    const bottomCards = bottomCardIds.map((id) => byId.get(id) );
    const rest = state.deck.slice(peeked.length);
    state.deck = [...topCards, ...rest, ...bottomCards];

    log(
      state,
      `${player.name} 查看牌堆顶 ${peeked.length} 张；牌顶：${topCards.map((card) => card.name).join('、') || '无'}；牌底：${bottomCards.map((card) => card.name).join('、') || '无'}`,
      player.id,
      'skill',
    );
    player.flags.usedScorpioPeek = true;
    triggerSkillMetric(state, action.skillId);
    return;
  }

  if (action.skillId === 'scorpio.freezeAoe') {
    throw new Error('蝎毒是被动技能，只在本回合首次打出水属性攻击牌后触发');
  }

  if (action.skillId === 'scorpio.spoils') {
    if (player.characterId !== 'scorpio') throw new Error('Only Scorpio can use sting');
    if (player.flags.usedScorpioSting) throw new Error('Scorpio sting can only be used once per turn');
    if (!target.statuses.frozen) throw new Error('Scorpio sting requires a frozen target');
    const stingCostId = action.cardIds?.[0];
    const freeSting = player.flags.scorpioFreeStingTargetIds.includes(target.id);
    if (!stingCostId && !freeSting) throw new Error('Scorpio sting costs one hand card');
    if (stingCostId) {
      const stingCost = takeCard(player, stingCostId);
      state.discard.push(stingCost);
    }
    player.flags.usedScorpioSting = true;
    player.flags.scorpioFreeStingTargetIds = player.flags.scorpioFreeStingTargetIds.filter((id) => id !== target.id);
    resolveScorpioStingEffect(state, player, target);
    triggerSkillMetric(state, action.skillId);
    return;
  }

  if (action.skillId === 'capricorn.charge') {
    if (player.flags.usedCapricornChargeThisRound) throw new Error('山崩每轮一次');
    assertNotIceArmorBlocked(player, target);
    const earthCardId = action.cardIds?.[0];
    if (!earthCardId) throw new Error('山崩需要弃 1 张土牌');
    const card = takeCard(player, earthCardId);
    if (card.element !== 'earth') throw new Error('山崩需要土牌');
    payDistanceCost(
      state,
      player,
      target,
      skillNeedsDistanceCost(state, player, target, action.skillId),
      action.extraCostCardId,
      [earthCardId],
    );
    state.discard.push(card);
    const spent = player.rage;
    if (spent <= 0) throw new Error('山崩至少需要 1 点怒气');
    player.rage = 0;
    player.flags.usedCapricornChargeThisRound = true;
    addStatus(state, target, 'silence', 1);
    if (spent >= 5) {
      applyDamage(state, target, player, 2, { sacredDamage: true });
      state.discard.push(...player.hand.splice(0), ...target.hand.splice(0));
      if (player.equipment.weapon) {
        state.discard.push(player.equipment.weapon);
        triggerEquipmentLeftOwner(state, player, player.equipment.weapon);
      }
      if (player.equipment.armor) {
        state.discard.push(player.equipment.armor);
        triggerEquipmentLeftOwner(state, player, player.equipment.armor);
      }
      if (target.equipment.weapon) {
        state.discard.push(target.equipment.weapon);
        triggerEquipmentLeftOwner(state, target, target.equipment.weapon);
      }
      if (target.equipment.armor) {
        state.discard.push(target.equipment.armor);
        triggerEquipmentLeftOwner(state, target, target.equipment.armor);
      }
      player.equipment = {};
      target.equipment = {};
    } else if (spent >= 3) {
      applyDamage(state, target, player, 1, { sacredDamage: true });
      state.discard.push(...player.hand.splice(0));
    }
    triggerSkillMetric(state, action.skillId);
    log(state, `${player.name} 消耗 ${spent} 怒发动山崩`, player.id, 'skill');
    return;
  }

  throw new Error(`Unsupported skill: ${action.skillId}`);
}

function takeFateCardFromDeck(state           ) {
  const index = state.deck.findIndex((card) => card.kind === 'sun' || card.kind === 'moon');
  if (index < 0) return undefined;
  return state.deck.splice(index, 1)[0];
}

export function createGame(options   
                
                             
                         
                           
                                         
  = {})            {
  const initialSeed = options.seed ?? 20260602;
  const shuffled = shuffleWithSeed(createBaseDeck(), initialSeed);
  const characters = options.characters ?? DEFAULT_CHARACTER_PAIR;
  const seatIndices = zodiacSeatIndices(characters);
  const teamSplit = characters.length >= 4 ? Math.ceil(characters.length / 2) : 1;
  const balancedPartition = (seatIndex        ) => {
    if (characters.length === 4) return seatIndex === 0 || seatIndex === 3 ? 0 : 1;
    return seatIndex % 2;
  };
  const localPartition = balancedPartition(seatIndices[0]);
  const players                = characters.map((characterId, index) => {
    const character = CHARACTERS[characterId];
    if (!character) throw new Error(`Unknown character: ${characterId}`);
    const isTwoTeamDemo = characters.length >= 4;
    const teamId = isTwoTeamDemo && options.teamLayout === 'balanced'
      ? (balancedPartition(seatIndices[index]) === localPartition ? 'A' : 'B')
      : isTwoTeamDemo
        ? (index < teamSplit ? 'A' : 'B')
        : (index === 0 ? 'A' : 'B');
    return {
      id: `p${index + 1}`,
      name: options.teamLayout === 'balanced'
        ? `${teamId}队${seatIndices[index] + 1}号位`
        : options.playerNames?.[index] ?? `玩家 ${index + 1}`,
      teamId,
      seatIndex: seatIndices[index],
      control: options.controls?.[index] ?? 'human',
      characterId,
      hp: character.maxHp,
      maxHp: character.maxHp,
      armor: character.initialArmor ?? 0,
      maxArmor: character.maxArmor ?? 2,
      hand: [],
      equipment: {},
      statuses: {},
      flags: freshFlags(),
      rage: 0,
      baseMaxHp: character.maxHp,
    };
  });

  const state            = {
    mode: 'standard',
    seed: shuffled.seed,
    round: 1,
    startingPlayerId: `p${(shuffled.seed % players.length) + 1}`,
    turnDirection: 1,
    activePlayerId: `p${(shuffled.seed % players.length) + 1}`,
    phase: 'mulligan',
    firstTurn: true,
    mulliganPendingPlayerIds: [],
    players,
    deck: shuffled.items,
    discard: [],
    log: [],
    metrics: makeMetrics(),
  };

  const openingFateCard = players.length > 2 ? takeFateCardFromDeck(state) : undefined;
  state.turnDirection = openingFateCard?.kind === 'moon' ? -1 : 1;
  state.mulliganPendingPlayerIds = orderedPlayerIdsFrom(state, state.startingPlayerId);
  for (const player of players) drawCards(state, player, 4);
  if (openingFateCard && players.length > 2) {
    const firstPlayer = findPlayer(state, state.startingPlayerId);
    const lastPlayer = findPlayer(state, state.mulliganPendingPlayerIds[state.mulliganPendingPlayerIds.length - 1]);
    lastPlayer.hand.push(openingFateCard);
    state.openingFate = {
      card: { ...openingFateCard },
      recipientId: lastPlayer.id,
    };
    const directionText = state.turnDirection === 1 ? '顺时针' : '逆时针';
    log(state, `${firstPlayer.name} 抽到命运牌 ${openingFateCard.name}，确定${directionText}行动，并将命运牌交给末位 ${lastPlayer.name}`, firstPlayer.id, 'setup');
  }
  const first = findPlayer(state, state.activePlayerId);
  log(state, `星盘先确定出牌次序：${first.name} 先手；随后 8 秒内所有角色同时确认是否更换起手牌`, first.id, 'setup');
  return state;
}

export function createDemo2v2Game(options   
                
                             
                           
  = {}) {
  return createGame({
    seed: options.seed,
    characters: options.characters ?? DEFAULT_DEMO_CHARACTERS,
    controls: options.controls ?? ['human', 'ai', 'ai', 'ai'],
    playerNames: ['A队前锋', 'A队辅助', 'B队前锋', 'B队终结'],
  });
}

const DEFAULT_INFECTION_SURVIVORS                = [
  'virgo',
  'aries',
  'cancer',
  'aquarius',
  'taurus',
  'libra',
  'leo',
  'scorpio',
];

export function createInfectionGame(options   
                
                       
                             
                           
                         
  = {})            {
  const playerCount = options.playerCount ?? options.characters?.length ?? 4;
  if (!Number.isInteger(playerCount) || playerCount < 4 || playerCount > 8) throw new Error('月蚀感染模式仅支持 4–8 人');
  const controls = Array.from(
    { length: playerCount },
    (_, index) => options.controls?.[index] ?? (index === 0 ? 'human' : 'ai'),
  );
  if (!controls.includes('human')) throw new Error('月蚀感染模式至少需要一名真人');

  const initialSeed = options.seed ?? Date.now();
  const bossSeatIndex = Math.abs(initialSeed) % playerCount;
  const selectedCharacters = Array.from({ length: playerCount }, (_, seatIndex) => {
    if (seatIndex === bossSeatIndex) return 'capricorn'               ;
    return options.characters?.[seatIndex]
      ?? DEFAULT_INFECTION_SURVIVORS[
        seatIndex < bossSeatIndex ? seatIndex : seatIndex - 1
      ];
  });
  const configuredSurvivors = selectedCharacters.filter((_, index) => index !== bossSeatIndex);
  if (configuredSurvivors.includes('capricorn')) {
    throw new Error('初始感染者已锁定摩羯，幸存者不能重复选择摩羯');
  }
  if (new Set(configuredSurvivors).size !== configuredSurvivors.length) {
    throw new Error('月蚀感染模式的幸存者星座不能重复');
  }
  if (!configuredSurvivors.includes('virgo')) {
    const requiredVirgoIndex = Array.from(
      { length: playerCount },
      (_, index) => playerCount - index - 1,
    ).find((index) => index !== bossSeatIndex) ;
    selectedCharacters[requiredVirgoIndex] = 'virgo';
  }
  const seatIndices = zodiacSeatIndices(selectedCharacters);

  const shuffled = shuffleWithSeed(createInfectionDeck(), initialSeed);
  const bossHpBonus = playerCount <= 5 ? 4 : 5;
  const players                = selectedCharacters.map((characterId, index) => {
    const character = CHARACTERS[characterId];
    const isBoss = index === bossSeatIndex;
    return {
      id: `p${index + 1}`,
      name: options.playerNames?.[index] && !/^\d+号位$/.test(options.playerNames[index])
        ? options.playerNames[index]
        : `${seatIndices[index] + 1}号位`,
      teamId: isBoss ? 'B' : 'A',
      seatIndex: seatIndices[index],
      control: controls[index],
      characterId,
      hp: character.maxHp + (isBoss ? bossHpBonus : 0),
      maxHp: character.maxHp + (isBoss ? bossHpBonus : 0),
      baseMaxHp: character.maxHp,
      armor: character.initialArmor ?? 0,
      maxArmor: character.maxArmor ?? 2,
      hand: [],
      equipment: {},
      statuses: {},
      flags: freshFlags(),
      rage: 0,
      factionId: isBoss ? 'infected' : 'survivor',
      infectionRole: isBoss ? 'initial' : undefined,
      infected: false,
      eliminated: false,
    };
  });
  const boss = players[bossSeatIndex];
  const state            = {
    mode: 'infection',
    seed: shuffled.seed,
    round: 1,
    startingPlayerId: boss.id,
    turnDirection: 1,
    activePlayerId: boss.id,
    phase: 'mulligan',
    firstTurn: true,
    mulliganPendingPlayerIds: [],
    players,
    deck: shuffled.items,
    discard: [],
    log: [],
    metrics: makeMetrics(),
    infection: {
      bossPlayerId: boss.id,
      damageSpreadEnabled: true,
      chainDeaths: [],
      metrics: {
        applied: 0,
        cleansed: 0,
        transformed: 0,
        lifeLost: 0,
        bossPassiveHeals: 0,
        bossPassiveDraws: 0,
        infectionCardsPlayed: 0,
        infectionCardsCountered: 0,
      },
    },
  };

  const openingFateCard = takeFateCardFromDeck(state);
  state.turnDirection = openingFateCard?.kind === 'moon' ? -1 : 1;
  state.mulliganPendingPlayerIds = orderedPlayerIdsFrom(state, boss.id);
  for (const player of players) drawCards(state, player, 4);
  drawCards(state, boss, 2);
  triggerSkillMetric(state, 'infection.bossCommandOpening');
  log(state, `${boss.name} 的蚀月战令令其开局额外摸 2 张牌`, boss.id, 'infection');
  if (openingFateCard) {
    const lastPlayer = findPlayer(
      state,
      state.mulliganPendingPlayerIds[state.mulliganPendingPlayerIds.length - 1],
    );
    lastPlayer.hand.push(openingFateCard);
    state.openingFate = {
      card: { ...openingFateCard },
      recipientId: lastPlayer.id,
    };
    const directionText = state.turnDirection === 1 ? '顺时针' : '逆时针';
    log(
      state,
      `初始感染者 ${boss.name}（摩羯座）公开并先手，抽到命运牌 ${openingFateCard.name}，确定${directionText}行动；命运牌交给末位 ${lastPlayer.name}`,
      boss.id,
      'setup',
    );
  }
  log(state, '所有角色有 8 秒同时确认是否更换起手牌；未操作默认保留', boss.id, 'setup');
  return state;
}

export function applyAction(input           , action        )                                            {
  const state = cloneState(input);
  const beforeLogLength = state.log.length;
  if (action.type === 'surrender') {
    const player = findPlayer(state, action.playerId);
    if (state.winnerTeamId || state.infection?.winnerFactionId) return { state, events: [] };
    if (isInfectionMode(state)) {
      const winnerFactionId = player.factionId === 'infected' ? 'survivor' : 'infected';
      state.infection .winnerFactionId = winnerFactionId;
      state.winnerTeamId = winnerFactionId === 'survivor' ? 'A' : 'B';
      state.winnerId = state.players.find(candidate => candidate.factionId === winnerFactionId)?.id;
      delete state.infection .pendingDying;
      delete state.infection .pendingReward;
      delete state.infection .pendingInfectionCard;
    } else {
      state.winnerTeamId = player.teamId === 'A' ? 'B' : 'A';
      state.winnerId = state.players.find(candidate => candidate.teamId === state.winnerTeamId)?.id;
    }
    delete state.pendingAttack;
    delete state.pendingRescue;
    delete state.pendingSkillDecisions;
    delete state.pendingSkillResume;
    state.mulliganPendingPlayerIds = [];
    state.phase = 'gameOver';
    log(state, `${player.name} 确认投降，所在${isInfectionMode(state) ? '阵营' : '队伍'}认输`, player.id, 'gameOver');
    return { state, events: state.log.slice(0, state.log.length - beforeLogLength) };
  }
  if (
    isInfectionMode(state) &&
    !state.pendingAttack &&
    !state.infection?.pendingInfectionCard &&
    !state.infection?.pendingDying &&
    !state.infection?.pendingReward
  ) {
    state.infection .chainDeaths = [];
  }

  if (
    state.phase === 'gameOver' &&
    !(
      action.type === 'playCard' &&
      action.mode === 'rescue' &&
      !state.winnerTeamId &&
      !state.winnerId
    ) &&
    !(action.type === 'useSkill' && action.skillId === 'cancer.rescue')
  ) {
    return { state, events: [] };
  }

  if (state.pendingRescue) {
    const pending = state.pendingRescue;
    if (!('playerId' in action) || action.playerId !== pending.currentResponderId) throw new Error('请等待当前角色完成急救响应');
    if (action.type === 'skipRescue') handleSkipRescue(state, action);
    else if (action.type === 'playCard' && action.mode === 'rescue') {
      if (action.targetId && action.targetId !== pending.targetId) throw new Error('急救目标与当前濒死角色不一致');
      handlePlayCard(state, {...action, targetId:pending.targetId});
    } else if (action.type === 'useSkill' && action.skillId === 'cancer.rescue' && action.targetId === pending.targetId) {
      handleSkill(state, action);
    } else throw new Error('请使用急救牌或选择放弃急救');
    return { state, events: state.log.slice(0, state.log.length - beforeLogLength) };
  }
  if (state.pendingSkillDecisions?.length) {
    if (action.type !== 'resolveSkillDecision') {
      throw new Error('请先完成当前技能选择');
    }
    resolveSkillDecision(state, action);
    if (isInfectionMode(state)) checkInfectionVictory(state);
    else settleDyingActivePlayer(state);
    return { state, events: state.log.slice(0, state.log.length - beforeLogLength) };
  }
  if (action.type === 'resolveSkillDecision') throw new Error('当前没有待处理的技能选择');

  if (action.type === 'mulligan') handleMulligan(state, action);

  if (action.type === 'drawPhase') {
    if (state.phase !== 'draw') throw new Error('Not in draw phase');
    const player = findPlayer(state, state.activePlayerId);
    state.metrics.turns += 1;
    drawCards(state, player, state.firstTurn ? 1 : 2);
    state.phase = 'main';
  }

  if (action.type === 'playCard') handlePlayCard(state, action);

  if (action.type === 'respondInfection') handleInfectionResponse(state, action);

  if (action.type === 'skipRescue') handleSkipRescue(state, action);

  if (action.type === 'chooseInfectionReward') {
    const player = findPlayer(state, action.playerId);
    resolveInfectionReward(state, player, action.option, action.statusId);
  }

  if (action.type === 'defend') {
    if (state.phase !== 'response' || !state.pendingAttack) throw new Error('No response needed');
    const defender = findPlayer(state, action.playerId);
    if (defender.id !== state.pendingAttack.currentTargetId) throw new Error('Wrong defender');
    const card = takeCard(defender, action.cardId);
    if (!isValidDefense(state.pendingAttack, defender, card)) throw new Error('Invalid defense card');
    if (!state.pendingAttack.scorpioPoisonStep) {
      recordCardElement(state, defender, card, action.elementChoice);
      rememberCenterPlayedCard(state, defender, card, state.pendingAttack.sourceId);
    }
    resolveDefense(state, defender, card);
  }

  if (action.type === 'skipDefense') {
    if (state.phase !== 'response' || !state.pendingAttack) throw new Error('No response needed');
    if (action.playerId !== state.pendingAttack.currentTargetId) throw new Error('Wrong defender');
    if (state.pendingAttack.scorpioPoisonStep) acceptScorpioPoisonFreeze(state);
    else resolveFailedDefense(state);
  }

  if (action.type === 'earthHammerBreak') handleEarthHammerBreak(state, action);

  if (action.type === 'endMain') {
    if (state.phase !== 'main') throw new Error('Not in main phase');
    if (action.playerId !== state.activePlayerId) throw new Error('Only active player can end main');
    state.phase = 'discard';
  }

  if (action.type === 'discard') {
    if (state.phase !== 'discard') throw new Error('Not in discard phase');
    const player = findPlayer(state, action.playerId);
    if (player.id !== state.activePlayerId) throw new Error('Only active player can discard');
    for (const cardId of action.cardIds) state.discard.push(takeCard(player, cardId));
    const handLimit = Math.max(0, player.hp);
    if (player.hand.length > handLimit) throw new Error('Hand must be discarded down to current HP');
    const canOfferWindCut =
      player.characterId === 'aquarius' &&
      action.cardIds.length >= 2 &&
      !player.flags.usedAquariusWindCutThisRound &&
      state.players.some((candidate) => candidate.id !== player.id && candidate.hp > 0);
    if (canOfferWindCut) {
      queueSkillDecision(state, { kind: 'aquariusWindCut', playerId: player.id });
      state.pendingSkillResume = 'endTurn';
      log(state, `${player.name} 可以选择是否发动断流`, player.id, 'skill');
    } else {
      endTurn(state, player);
    }
  }

  if (action.type === 'useSkill') handleSkill(state, action);

  if (isInfectionMode(state)) checkInfectionVictory(state);
  else settleDyingActivePlayer(state);

  return { state, events: state.log.slice(0, state.log.length - beforeLogLength) };
}

export function autoDiscardToHp(state           , playerId        )           {
  const player = findPlayer(state, playerId);
  const handLimit = Math.max(0, player.hp);
  const overflow = Math.max(0, player.hand.length - handLimit);
  return player.hand.slice(0, overflow).map((card) => card.id);
}

function aiHostilePlayers(state           , player             ) {
  if (isInfectionMode(state)) {
    return state.players.filter(
      (candidate) =>
        candidate.id !== player.id &&
        !sameFaction(state, candidate, player) &&
        isAlive(candidate),
    );
  }
  return enemiesOf(state, player.id);
}

function lowestHpEnemy(state           , player             , predicate                                  = () => true) {
  return aiHostilePlayers(state, player)
    .filter(predicate)
    .sort((a, b) => a.hp - b.hp || a.hand.length - b.hand.length)[0];
}

function mostDamagedAlly(state           , player             ) {
  return alliesOf(state, player.id)
    .filter((ally) => ally.hp < ally.maxHp)
    .sort((a, b) => (b.maxHp - b.hp) - (a.maxHp - a.hp))[0];
}

function firstCost(player             , predicate                         ) {
  return player.hand.find(predicate);
}

function distanceCostCardId(player             , reservedCardIds           = []) {
  return player.hand.find((card) => !reservedCardIds.includes(card.id))?.id;
}

function findLeoOrderPaymentCardId(state           , player             , targets               , reservedCardIds           = []) {
  if (!leoOrderReceiverForTargets(state, player, targets)) return undefined;
  return player.hand.find((card) => !reservedCardIds.includes(card.id))?.id;
}

function withDistanceCost(
  action        ,
  state           ,
  player             ,
  target             ,
  required         ,
  reservedCardIds          ,
) {
  if (!required) return action;
  const extraCostCardId = distanceCostCardId(player, reservedCardIds);
  return extraCostCardId ? { ...action, extraCostCardId }           : undefined;
}

function withLeoOrderPayment(
  action        ,
  state           ,
  player             ,
  targets               ,
  reservedCardIds          ,
) {
  const leo = leoOrderReceiverForTargets(state, player, targets);
  if (!leo) return action;
  const leoOrderPaymentCardId = findLeoOrderPaymentCardId(state, player, targets, reservedCardIds);
  return leoOrderPaymentCardId ? { ...action, leoOrderPaymentCardId }           : undefined;
}

function chooseAiCancerRescueAction(state           )                     {
  if (state.pendingRescue) return undefined;
  if (isInfectionMode(state)) {
    const pending = state.infection?.pendingDying;
    if (state.phase !== 'rescue' || !pending?.currentResponderId) return undefined;
    const cancer = findPlayer(state, pending.currentResponderId);
    if (
      cancer.control !== 'ai' ||
      cancer.characterId !== 'cancer' ||
      pending.willTransform ||
      cancer.flags.usedCancerRescueThisRound
    ) {
      return undefined;
    }
    const water = cancer.hand.find((card) => card.element === 'water');
    return water
      ? {
          type: 'useSkill',
          playerId: cancer.id,
          skillId: 'cancer.rescue',
          targetId: pending.targetId,
          cardIds: [water.id],
        }
      : undefined;
  }
  for (const cancer of state.players) {
    if (cancer.control !== 'ai') continue;
    if (cancer.characterId !== 'cancer') continue;
    if (cancer.hp <= 0) continue;
    if (cancer.flags.usedCancerRescueThisRound) continue;
    if (state.activePlayerId === cancer.id) continue;
    const water = cancer.hand.find((card) => card.element === 'water');
    if (!water) continue;
    const dyingAlly = state.players
      .find((ally) => sameFaction(state, ally, cancer) && ally.id !== cancer.id && ally.hp <= 0);
    if (!dyingAlly) continue;
    return {
      type: 'useSkill',
      playerId: cancer.id,
      skillId: 'cancer.rescue',
      targetId: dyingAlly.id,
      cardIds: [water.id],
    };
  }
  return undefined;
}

function chooseAiStandardRescueAction(state           )                     {
  if (state.pendingRescue) {
    const pending = state.pendingRescue;
    const player = findPlayer(state, pending.currentResponderId );
    if (player.control !== 'ai') return undefined;
    const target = findPlayer(state, pending.targetId);
    if (player.teamId !== target.teamId) return {type:'skipRescue',playerId:player.id};
    const card = player.hand.find(card => card.kind === 'sun' || card.kind === 'energy');
    if (card) return {type:'playCard',playerId:player.id,cardId:card.id,targetId:target.id,mode:'rescue'};
    const water = player.hand.find(card => card.element === 'water');
    if (player.characterId === 'cancer' && water) return {type:'useSkill',playerId:player.id,skillId:'cancer.rescue',targetId:target.id,cardIds:[water.id]};
    return {type:'skipRescue',playerId:player.id};
  }
  if (isInfectionMode(state) || state.phase !== 'gameOver' || state.winnerTeamId || state.winnerId) return undefined;
  const defeatedTeams = defeatedTeamIds(state);
  for (const player of state.players) {
    if (player.control !== 'ai' || player.eliminated || !defeatedTeams.includes(player.teamId)) continue;
    const rescueCard = player.hand.find((card) => card.kind === 'sun' || card.kind === 'energy');
    if (!rescueCard) continue;
    const target = state.players.find((candidate) =>
      candidate.id === player.id && candidate.hp <= 0 && !candidate.eliminated
    ) ?? state.players.find((candidate) =>
      candidate.teamId === player.teamId && candidate.hp <= 0 && !candidate.eliminated
    );
    if (!target) continue;
    return {
      type: 'playCard',
      playerId: player.id,
      cardId: rescueCard.id,
      targetId: target.id,
      mode: 'rescue',
    };
  }
  return undefined;
}

export function chooseAiAction(state           )                     {
  const cancerRescue = chooseAiCancerRescueAction(state);
  if (cancerRescue) return cancerRescue;

  const standardRescue = chooseAiStandardRescueAction(state);
  if (standardRescue) return standardRescue;

  if (state.phase === 'gameOver') return undefined;

  const skillDecision = state.pendingSkillDecisions?.[0];
  if (skillDecision) {
    const player = findPlayer(state, skillDecision.playerId);
    if (player.control !== 'ai') return undefined;
    const preferredTarget = aiHostilePlayers(state, player)
      .find((candidate) => !isIceArmorBlocked(player, candidate));
    // Judgment is mandatory and permits self-targeting even when all enemies
    // are protected. Optional hostile skills may instead be declined.
    const judgmentTarget = preferredTarget ?? [player, ...state.players]
      .find((candidate) => isAlive(candidate) && !isIceArmorBlocked(player, candidate));

    if (skillDecision.kind === 'taurusGuard' || skillDecision.kind === 'taurusThickSkin') {
      const cost = player.hand[0];
      return {
        type: 'resolveSkillDecision',
        playerId: player.id,
        activate: Boolean(cost),
        cardIds: cost ? [cost.id] : [],
      };
    }

    if (skillDecision.kind === 'virgoDomain' || skillDecision.kind === 'virgoDiscipline') {
      return { type: 'resolveSkillDecision', playerId: player.id, activate: true };
    }

    if (skillDecision.kind === 'aquariusWindCut') {
      const target = preferredTarget;
      if (!target) return { type: 'resolveSkillDecision', playerId: player.id, activate: false };
      const count = Math.min(2, target.hand.length);
      return {
        type: 'resolveSkillDecision',
        playerId: player.id,
        activate: true,
        targetId: target.id,
        cardIds: target.hand.slice(0, count).map((card) => card.id),
      };
    }

    if (skillDecision.kind === 'aquariusChalice') {
      // 受伤触发倾杯：AI 已自动摸 2 牌，换牌为可选增值；默认不主动换牌以保持稳健。
      return { type: 'resolveSkillDecision', playerId: player.id, activate: false };
    }

    if (skillDecision.kind === 'libraJudgment') {
      return judgmentTarget
        ? {
            type: 'resolveSkillDecision',
            playerId: player.id,
            activate: true,
            targetId: judgmentTarget.id,
          }
        : { type: 'resolveSkillDecision', playerId: player.id, activate: false };
    }

    if (skillDecision.kind === 'libraPerfectJudgment') {
      const ownCard = judgmentTarget?.id === player.id ? player.hand[0] : undefined;
      return judgmentTarget
        ? {
            type: 'resolveSkillDecision',
            playerId: player.id,
            activate: true,
            targetId: judgmentTarget.id,
            option: ownCard ? 'steal' : 'damage',
            ...(ownCard ? {selectedCardId: ownCard.id} : {}),
          }
        : { type: 'resolveSkillDecision', playerId: player.id, activate: false };
    }
  }

  if (state.phase === 'infectionResponse' && state.infection?.pendingInfectionCard) {
    const target = findPlayer(state, state.infection.pendingInfectionCard.targetId);
    if (target.control !== 'ai') return undefined;
    const counter = target.hand.find((card) => card.kind === 'ritual')
      ?? target.hand.find((card) => card.kind === 'sun');
    return {
      type: 'respondInfection',
      playerId: target.id,
      cardId: counter?.id,
    };
  }

  if (state.phase === 'rescue' && state.infection?.pendingDying) {
    const responderId = state.infection.pendingDying.currentResponderId;
    if (!responderId) return undefined;
    const responder = findPlayer(state, responderId);
    if (responder.control !== 'ai') return undefined;
    const sun = responder.hand.find((card) => card.kind === 'sun');
    return sun
      ? {
          type: 'playCard',
          playerId: responder.id,
          cardId: sun.id,
          targetId: state.infection.pendingDying.targetId,
          mode: 'rescue',
        }
      : { type: 'skipRescue', playerId: responder.id };
  }

  if (state.phase === 'reward' && state.infection?.pendingReward) {
    const rewarded = findPlayer(state, state.infection.pendingReward.playerId);
    if (rewarded.control !== 'ai') return undefined;
    if (rewarded.infected) {
      return {
        type: 'chooseInfectionReward',
        playerId: rewarded.id,
        option: 'cleanse',
        statusId: 'infection',
      };
    }
    const abnormal = NORMAL_ABNORMAL_STATUSES.find((status) => rewarded.statuses[status]);
    if (abnormal) {
      return {
        type: 'chooseInfectionReward',
        playerId: rewarded.id,
        option: 'cleanse',
        statusId: abnormal,
      };
    }
    if (rewarded.hp < rewarded.maxHp) {
      return {
        type: 'chooseInfectionReward',
        playerId: rewarded.id,
        option: 'heal1',
      };
    }
    return {
      type: 'chooseInfectionReward',
      playerId: rewarded.id,
      option: 'draw2',
    };
  }

  if (state.phase === 'mulligan') {
    const player = state.mulliganPendingPlayerIds
      .map((playerId) => findPlayer(state, playerId))
      .find((candidate) => candidate.control === 'ai');
    if (!player) return undefined;
    return { type: 'mulligan', playerId: player.id, replace: false };
  }

  if (state.phase === 'response' && state.pendingAttack) {
    const defender = findPlayer(state, state.pendingAttack.currentTargetId);
    if (defender.control !== 'ai') return undefined;
    const defense = state.pendingAttack.scorpioPoisonStep
      ? defender.hand.find((card) => card.element === 'water') ?? defender.hand[0]
      : defender.hand.find((card) => isValidDefense(state.pendingAttack , defender, card));
    return defense
      ? { type: 'defend', playerId: defender.id, cardId: defense.id }
      : { type: 'skipDefense', playerId: defender.id };
  }

  if (state.phase === 'hammerBreak' && state.pendingAttack) {
    const defender = findPlayer(state, state.pendingAttack.currentTargetId);
    if (defender.control !== 'ai') return undefined;
    return {
      type: 'earthHammerBreak',
      playerId: defender.id,
      cardId: defender.hand[0]?.id,
    };
  }

  const player = findPlayer(state, state.activePlayerId);
  if (player.control !== 'ai') return undefined;

  if (state.phase === 'draw') return { type: 'drawPhase' };
  if (state.phase === 'discard') return { type: 'discard', playerId: player.id, cardIds: autoDiscardToHp(state, player.id) };
  if (state.phase !== 'main') return undefined;

  const ritual = player.hand.find((card) => card.kind === 'ritual');
  if (ritual && isInfectionMode(state)) {
    if (isInfectedFaction(player)) {
      const infectionTarget = state.players.find(
        (candidate) =>
          candidate.factionId === 'survivor' &&
          !candidate.infected &&
          isAlive(candidate),
      );
      if (infectionTarget) {
        return {
          type: 'playCard',
          playerId: player.id,
          cardId: ritual.id,
          targetId: infectionTarget.id,
        };
      }
    } else {
      const cleanseTarget = state.players.find(
        (candidate) =>
          candidate.factionId === 'survivor' &&
          candidate.infected &&
          isAlive(candidate),
      );
      if (cleanseTarget) {
        return {
          type: 'playCard',
          playerId: player.id,
          cardId: ritual.id,
          targetId: cleanseTarget.id,
        };
      }
    }
  }

  const enemy = lowestHpEnemy(state, player);
  if (!enemy) return { type: 'endMain', playerId: player.id };
  const outputEnemy = lowestHpEnemy(state, player, (candidate) => !isIceArmorBlocked(player, candidate));
  const canUseActiveSkill = !isSilencedInOwnActionTurn(state, player);

  if (
    canUseActiveSkill &&
    isInitialInfectionBoss(state, player) &&
    !player.flags.usedInfectionBossCommand
  ) {
    const legalTargets = aiHostilePlayers(state, player).filter(
      (candidate) => !isIceArmorBlocked(player, candidate),
    );
    return {
      type: 'useSkill',
      playerId: player.id,
      skillId: 'infection.bossCommand',
      option: legalTargets.length >= 2 ? 'extraTarget' : 'extraAttack',
    };
  }

  if (canUseActiveSkill && player.characterId === 'cancer' && !player.flags.usedCancerHeal) {
    const ally = mostDamagedAlly(state, player);
    const cost = player.hand[0];
    if (ally && cost) return { type: 'useSkill', playerId: player.id, skillId: 'cancer.heal', targetId: ally.id, cardIds: [cost.id] };
  }

  if (canUseActiveSkill && player.characterId === 'aquarius' && !player.flags.usedAquariusMassHeal && player.hp > 1) {
    const hasDamagedCharacter = state.players.some((candidate) => candidate.hp > 0 && candidate.hp < candidate.maxHp);
    const air = firstCost(player, (card) => card.element === 'air');
    const other = player.hand.find((card) => card.id !== air?.id);
    if (hasDamagedCharacter && air && other) {
      return { type: 'useSkill', playerId: player.id, skillId: 'aquarius.massHeal', targetId: enemy.id, cardIds: [air.id, other.id] };
    }
  }

  if (canUseActiveSkill && player.characterId === 'taurus' && !player.flags.usedTaurusArmor) {
    const earth = firstCost(player, (card) => card.element === 'earth');
    if (earth && player.armor < player.maxArmor) {
      return { type: 'useSkill', playerId: player.id, skillId: 'taurus.armor', targetId: player.id, cardIds: [earth.id] };
    }
  }

  if (canUseActiveSkill && player.characterId === 'aries' && !player.flags.usedAriesRam) {
    const fireAttack = firstCost(player, (card) => card.element === 'fire' && (card.kind === 'normalAttack' || card.kind === 'statusAttack'));
    if (fireAttack && outputEnemy) {
      const action         = { type: 'useSkill', playerId: player.id, skillId: 'aries.ram', targetId: outputEnemy.id, cardIds: [fireAttack.id] };
      const withCost = withDistanceCost(action, state, player, outputEnemy, skillNeedsDistanceCost(state, player, outputEnemy, 'aries.ram'), [fireAttack.id]);
      if (withCost) return withCost;
    }
  }

  if (canUseActiveSkill && player.characterId === 'leo' && !player.flags.usedLeoRoar) {
    const fire = firstCost(player, (card) => card.element === 'fire');
    const roarTargets = aiHostilePlayers(state, player)
      .filter((candidate) => !candidate.statuses.burn)
      .slice(0, 3);
    if (fire && roarTargets.length > 0) {
      return {
        type: 'useSkill',
        playerId: player.id,
        skillId: 'leo.roar',
        targetId: roarTargets[0].id,
        targetIds: roarTargets.map((candidate) => candidate.id),
        cardIds: [fire.id],
      };
    }
  }

  if (canUseActiveSkill && player.characterId === 'capricorn' && player.rage >= 3 && !player.flags.usedCapricornChargeThisRound) {
    const earth = firstCost(player, (card) => card.element === 'earth');
    if (earth && outputEnemy) {
      const action         = { type: 'useSkill', playerId: player.id, skillId: 'capricorn.charge', targetId: outputEnemy.id, cardIds: [earth.id] };
      const withCost = withDistanceCost(action, state, player, outputEnemy, skillNeedsDistanceCost(state, player, outputEnemy, 'capricorn.charge'), [earth.id]);
      if (withCost) return withCost;
    }
  }

  const equipment = player.hand.find((card) => card.kind === 'weapon' || card.kind === 'armor');
  if (equipment) return { type: 'playCard', playerId: player.id, cardId: equipment.id };

  const aoe = player.hand.find((card) => card.kind === 'aoe' && canUseHandCard(player, card));
  const livingFriendlyTargets = isInfectionMode(state)
    ? state.players.filter(
        (candidate) =>
          candidate.id !== player.id &&
          sameFaction(state, candidate, player) &&
          isAlive(candidate),
      )
    : [];
  if (
    aoe &&
    outputEnemy &&
    livingFriendlyTargets.length === 0 &&
    aiHostilePlayers(state, player).some((candidate) => !isIceArmorBlocked(player, candidate))
  ) {
    const targets = aiHostilePlayers(state, player).filter((candidate) => !isIceArmorBlocked(player, candidate));
    const action         = { type: 'playCard', playerId: player.id, cardId: aoe.id, targetId: outputEnemy.id };
    const withOrder = withLeoOrderPayment(action, state, player, targets, [aoe.id]);
    if (withOrder) return withOrder;
  }

  const energy = player.hand.find((card) =>
    card.kind === 'energy' &&
    Boolean(card.element) &&
    !player.flags.energyChargeElement &&
    player.hand.some((candidate) =>
      (candidate.kind === 'normalAttack' || candidate.kind === 'statusAttack') &&
      candidate.element === card.element,
    ),
  );
  if (energy) return { type: 'playCard', playerId: player.id, cardId: energy.id };

  const attack = player.hand.find((card) =>
    (card.kind === 'normalAttack' || card.kind === 'statusAttack') && canUseHandCard(player, card) && canUseBasicAttack(player),
  );
  if (attack && outputEnemy) {
    const bossExtraTargets = isInitialInfectionBoss(state, player) &&
      player.flags.infectionBossCommandMode === 'extraTarget' &&
      !player.flags.usedInfectionBossExtraTarget
      ? aiHostilePlayers(state, player)
          .filter((candidate) => !isIceArmorBlocked(player, candidate))
          .sort((first, second) => first.hp - second.hp)
          .slice(0, 2)
      : [];
    const action         = {
      type: 'playCard',
      playerId: player.id,
      cardId: attack.id,
      targetId: outputEnemy.id,
      ...(bossExtraTargets.length >= 2
        ? { targetIds: bossExtraTargets.map((candidate) => candidate.id) }
        : {}),
    };
    const withCost = withDistanceCost(action, state, player, outputEnemy, targetedCardNeedsDistanceCost(state, player, outputEnemy, attack), [attack.id]);
    if (withCost) {
      const reservedCardIds = [attack.id, (withCost                                         ).extraCostCardId].filter(Boolean)            ;
      const attackTargets = bossExtraTargets.length >= 2 ? bossExtraTargets : [outputEnemy];
      const withOrder = withLeoOrderPayment(withCost, state, player, attackTargets, reservedCardIds);
      if (withOrder) return withOrder;
    }
  }

  const utility = player.hand.find((card) => card.kind === 'utility');
  if (utility) {
    const target = utility.element === 'fire'
      ? outputEnemy
      : utility.element === 'water'
        ? lowestHpEnemy(state, player, (candidate) => !isCrossDistanceTarget(state, player, candidate))
        : enemy;
    if (target) {
      const action         = { type: 'playCard', playerId: player.id, cardId: utility.id, targetId: target.id };
      const withCost = withDistanceCost(action, state, player, target, targetedCardNeedsDistanceCost(state, player, target, utility), [utility.id]);
      if (withCost) {
        const reservedCardIds = [utility.id, (withCost                                         ).extraCostCardId].filter(Boolean)            ;
        const withOrder = withLeoOrderPayment(withCost, state, player, [target], reservedCardIds);
        if (withOrder) return withOrder;
      }
    }
  }

  return { type: 'endMain', playerId: player.id };
}

export function applyAiActions(input           , limit = 40)                                            {
  let state = input;
  const beforeLogLength = state.log.length;
  for (let i = 0; i < limit; i += 1) {
    const action = chooseAiAction(state);
    if (!action) break;
    const result = applySingleAiAction(state);
    state = result.state;
    if (result.events.some((event) => event.type === 'ai')) break;
  }
  return { state, events: state.log.slice(0, state.log.length - beforeLogLength) };
}

export function applySingleAiAction(input           )                                            {
  const action = chooseAiAction(input);
  if (!action) return { state: input, events: [] };
  try {
    return applyAction(input, action);
  } catch (error) {
    const next = cloneState(input);
    log(next, `AI 托管停止：${error instanceof Error ? error.message : String(error)}`, next.activePlayerId, 'ai');
    return { state: next, events: next.log.slice(0, next.log.length - input.log.length) };
  }
}

export function applyActionWithAi(state           , action        )                                            {
  const result = applyAction(state, action);
  const settled = applyAiActions(result.state);
  return { state: settled.state, events: [...result.events, ...settled.events] };
}
