import { createBaseDeck, createInfectionDeck, effectiveRitualCard, ELEMENT_LABELS, statusForElement } from '../content/cards.mjs?v=web-5e05b5f141922863';
import {
  CHARACTERS,
  DEFAULT_CHARACTER_PAIR,
  DEFAULT_DEMO_CHARACTERS,
  zodiacSeatIndices,
} from '../content/characters.mjs?v=web-5e05b5f141922863';
             
         
       
              
              
            
              
             
            
                        
                
               
                       
              
           
              
            
                     
import { randomFloat, shuffleWithSeed } from './random.mjs?v=web-5e05b5f141922863';

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
    scorpioPeekMissedWater: false,
    usedScorpioEndPeek: false,
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
    taurusGuardSetupDone: false,
    usedAriesBurnSoul: false,
    usedCapricornChargeThisRound: false,
    usedSagittariusSeek: false,
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
          taurusDrawnPlayerIds: state.pendingAttack.taurusDrawnPlayerIds
            ? [...state.pendingAttack.taurusDrawnPlayerIds]
            : undefined,
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

// Retain source templates at their call sites; never infer them from a finished log.
function messageTemplate(parts                      , ...values           ) {
  let key = parts[0];
  let message = parts[0];
  const params                                  = {};
  values.forEach((value, index) => {
    params['p' + index] = typeof value === 'number' ? value : String(value);
    key += String.fromCharCode(36) + '{p' + index + '}' + parts[index + 1];
    message += String(value) + parts[index + 1];
  });
  return { message, key, params };
}

function log(state           , entry                                                                                    , playerId         , type = 'info') {
  const localized = typeof entry === 'string' ? { message: entry, key: entry, params: {} } : entry;
  state.log.unshift({ type, ...localized, playerId });
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

function advanceTurnOrder(state           , previousPlayerId        ) {
  const order = orderedPlayerIdsFrom(state, state.players[0].id);
  const next = nextLivingPlayerAfter(state, previousPlayerId);
  state.activePlayerId = next.id;
  // The round boundary remains at the original first seat even after its owner
  // is eliminated. Compare the full seat order instead of requiring that turn.
  if (order.indexOf(next.id) > order.indexOf(previousPlayerId)) return;
  state.round += 1;
  for (const player of state.players) {
    player.flags.usedGeminiExtraTurnThisRound = false;
    player.flags.libraRoundElements = [];
    player.flags.usedCapricornChargeThisRound = false;
    player.flags.usedCancerRescueThisRound = false;
    player.flags.cancerTideBondDraws = 0;
    player.flags.usedAquariusWindCutThisRound = false;
    player.flags.usedVirgoDisciplineThisRound = false;
    player.flags.usedEarthArmorReductionThisRound = false;
  }
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
  log(state, messageTemplate`${player.name} 跨距离指定 ${target.name}，额外弃置 1 张距离费用`, player.id, 'card');
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
  log(state, messageTemplate`${player.name} pays ${payment.name} to ${leo.name} for Leo order`, player.id, 'skill');
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

  if (drawn > 0) log(state, messageTemplate`${player.name} 摸 ${drawn} 张牌`, player.id, 'draw');
}

function hasVirgoDomain(player             ) {
  return player.characterId === 'virgo' && player.flags.virgoDomainActive;
}

function virgoBlocksDebuff(state           , player             , label        ) {
  if (!hasVirgoDomain(player)) return false;
  log(state, messageTemplate`${player.name} 的净域免疫了 ${label}`, player.id, 'skill');
  return true;
}

function addStatus(state           , player             , status          , turns         ) {
  const isAbnormal = status !== 'shield' && status !== 'abnormalImmunity' && status !== 'sureHit';
  if (isAbnormal && virgoBlocksDebuff(state, player, STATUS_LABELS[status])) return;
  if (isAbnormal && player.statuses.shield) {
    delete player.statuses.shield;
    log(state, messageTemplate`${player.name} 的圣盾免疫了 ${STATUS_LABELS[status]}`, player.id, 'shield');
    return;
  }

  if (isAbnormal && player.statuses.abnormalImmunity) {
    delete player.statuses.abnormalImmunity;
    log(state, messageTemplate`${player.name} 的异常免疫抵消了 ${STATUS_LABELS[status]}`, player.id, 'status');
    return;
  }

  const retainThroughTurn = status === 'silence' ? player.statuses.silence?.retainThroughTurn : undefined;
  const expiresAtTurnStart = status === 'silence' ? player.statuses.silence?.expiresAtTurnStart : undefined;
  player.statuses[status] = { id: status, turns, ...(retainThroughTurn !== undefined ? {retainThroughTurn} : {}), ...(expiresAtTurnStart ? {expiresAtTurnStart} : {}) };
  if (isAbnormal) state.metrics.statusesApplied += 1;
  log(state, messageTemplate`${player.name} 获得 ${STATUS_LABELS[status]}`, player.id, 'status');
}

function removeOneRoundStatuses(state           , player             ) {
  for (const status of ['burn', 'frozen', 'silence']              ) {
    if (player.statuses[status]) {
      if (status === 'silence' && player.statuses.silence?.expiresAtTurnStart) continue;
      if (status === 'silence' && player.statuses.silence?.retainThroughTurn !== undefined &&
          state.metrics.turns <= player.statuses.silence.retainThroughTurn) continue;
      delete player.statuses[status];
      log(state, messageTemplate`${player.name} 的 ${STATUS_LABELS[status]} 消失`, player.id, 'status');
    }
  }
}

function removeTurnStartStatuses(state           , player             ) {
  if (!player.statuses.silence?.expiresAtTurnStart) return;
  delete player.statuses.silence;
  log(state, messageTemplate`${player.name} 的沉默在回合开始时消失`, player.id, 'status');
}

function isLeoHealingBlocked(state           , player             ) {
  return Boolean(player.statuses.burn && state.players.some(candidate => isAlive(candidate) && candidate.characterId === 'leo'));
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
    log(state, messageTemplate`${player.name} 受到月蚀感染影响，不能通过普通恢复回复生命`, player.id, 'infection');
    return;
  }
  if (!options.bypassLeoAura && isLeoHealingBlocked(state, player)) {
    log(state, messageTemplate`${player.name} is burning and cannot recover because Leo aura is active`, player.id, 'heal');
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
      log(state, messageTemplate`${cancer.name} 因共潮摸 1 张牌`, cancer.id, 'skill');
    }
    log(state, messageTemplate`${player.name} 回复 ${healed} 点生命`, player.id, 'heal');
  }
}

function rescueHeal(
  state           ,
  player             ,
  amount        ,
  source              ,
  options                                                         = {},
) {
  const before = player.hp;
  heal(state, player, amount, source, options);
  if (player.hp > before && player.hp <= 0) player.hp = Math.min(player.maxHp, 1);
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
  log(state, messageTemplate`${player.name} 因蓄怒${reason}获得 ${amount} 点怒气`, player.id, 'skill');
}

const NORMAL_ABNORMAL_STATUSES             = ['burn', 'frozen', 'blind', 'silence'];

function cleanseInfection(state           , player             , source              ) {
  if (!isInfectionMode(state) || !player.infected) return false;
  player.infected = false;
  state.infection .metrics.cleansed += 1;
  log(state, messageTemplate`${player.name} 的感染被净化`, source?.id ?? player.id, 'infection');
  return true;
}

function applyInfection(state           , player             , source              , viaCard = false) {
  if (!isInfectionMode(state) || isInfectedFaction(player) || player.infected || !isAlive(player)) return false;
  if (virgoBlocksDebuff(state, player, '感染')) return false;
  player.infected = true;
  state.infection .metrics.applied += 1;
  log(
    state,
    messageTemplate`${player.name} 获得感染${viaCard ? '（感染牌）' : ''}`,
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
  log(state, messageTemplate`${player.name} 转化为月蚀感染者，以 1 点生命复活`, player.id, 'transform');
  const boss = state.players.find((candidate) => candidate.id === state.infection .bossPlayerId);
  if (boss && isAlive(boss)) {
    drawCards(state, boss, 2);
    triggerSkillMetric(state, 'infection.bossConversionReward');
    log(state, messageTemplate`${boss.name} 因幸存者转化摸 2 张牌`, boss.id, 'infection');
  }
}

function eligibleRescuers(state           , target             , willTransform         ) {
  return state.players
    .filter((candidate) => candidate.factionId === 'survivor' && !candidate.eliminated)
    .filter((candidate) => {
      const hasSun = candidate.hand.some((card) => card.kind === 'sun');
      if (hasSun) return true;
      if (willTransform || isLeoHealingBlocked(state, target)) return false;
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
  if (state.pendingSkillDecisions?.length) {
    state.phase = resumePhase;
    if (state.pendingAttack) state.pendingSkillResume ??= 'finishAttack';
    else if (endTurnAfterResolution) state.pendingSkillResume ??= 'endTurnAfterRescue';
    return;
  }
  if (state.pendingSkillResume) {
    state.phase = resumePhase;
    resumeAfterSkillDecisions(state);
    return;
  }
  if (state.pendingAttack) {
    state.phase = 'response';
    if (endTurnAfterResolution && interruptedPlayerId === state.activePlayerId) {
      const interrupted = findPlayer(state, interruptedPlayerId);
      if (moveTurnAfterDyingActivePlayer(state, interrupted)) return;
    }
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
  log(state, messageTemplate`${killer.name} 击杀感染者，可立即选择一项奖励`, killer.id, 'reward');
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
    log(state, messageTemplate`${player.name} 作为初始感染者阵亡，伤害型感染传播停止`, player.id, 'eliminate');
  } else {
    log(state, messageTemplate`${player.name} 永久出局`, player.id, 'eliminate');
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
    messageTemplate`${target.name} 濒死，等待太阳急救${willTransform ? '；未获救将转化' : ''}`,
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
      log(state, messageTemplate`${player.name} 通过击杀奖励移除异常`, player.id, 'reward');
    }
  } else {
    drawCards(
      state,
      player,
      1,
      (card) => card.element === CHARACTERS[player.characterId].element,
    );
  }
  log(state, messageTemplate`${player.name} 结算感染者击杀奖励：${option}`, player.id, 'reward');
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
  log(state, messageTemplate`${winner === 'survivor' ? '幸存者' : '感染者'}阵营获胜`, state.winnerId, 'gameOver');
}

function findTaurusGuardianFor(state           , target             ) {
  return state.players.find(
    (candidate) =>
      isAlive(candidate) &&
      candidate.characterId === 'taurus' &&
      candidate.id !== target.id &&
      candidate.flags.taurusGuardTargetId === target.id,
  );
}

function queueSkillDecision(state           , decision                      ) {
  state.pendingSkillDecisions ??= [];
  state.pendingSkillDecisions.push(decision);
}

function offerVirgoDiscipline(state           , source             , targets               , isAoe = false) {
  if ((!isAoe && targets.length < 2) || !isAlive(source)) return;
  for (const target of new Set(targets)) {
    if (target.id !== source.id && target.characterId === 'virgo' && isAlive(target)) {
      queueSkillDecision(state, { kind: 'virgoDiscipline', playerId: target.id, sourceId: source.id });
    }
  }
}

function offerTaurusGuardSetup(state           ) {
  const player = findPlayer(state, state.activePlayerId);
  if (state.phase !== 'draw' || player.characterId !== 'taurus' || !isAlive(player) ||
      player.flags.taurusGuardSetupDone || isSilencedInOwnActionTurn(state, player)) return;
  if (state.pendingSkillDecisions?.some(decision => decision.kind === 'taurusGuardSetup' && decision.playerId === player.id)) return;
  const previous = state.players.find(candidate => candidate.id === player.flags.taurusGuardTargetId);
  if (previous && !isAlive(previous)) player.flags.taurusGuardTargetId = undefined;
  queueSkillDecision(state, {kind:'taurusGuardSetup',playerId:player.id});
  log(state, messageTemplate`${player.name} 回合开始，可弃 1 张牌设置或更换牛守目标，也可延续原守护`, player.id, 'skill');
}

function setTaurusGuardTarget(state           , player             , targetId                    , cardIds          ) {
  if (player.flags.taurusGuardSetupDone) throw new Error('牛守每个自己的回合开始只能设置或更换一次');
  const target = state.players.find(candidate => candidate.id === targetId);
  if (!target || target.id === player.id || !isAlive(target)) throw new Error('牛守需要选择一名其他存活角色');
  if (cardIds.length !== 1) throw new Error('设置或更换牛守目标需要弃置 1 张手牌');
  const cost = takeCard(player, cardIds[0]);
  state.discard.push(cost);
  player.flags.taurusGuardTargetId = target.id;
  player.flags.taurusGuardSetupDone = true;
  triggerSkillMetric(state, 'taurus.guard');
  log(state, messageTemplate`${player.name} 弃置 ${cost.name}，将牛守目标设为 ${target.name}`, player.id, 'skill');
}

function drawTaurusForCardAttack(state           , target             ) {
  if (target.characterId !== 'taurus' || !isAlive(target)) return;
  drawCards(state, target, 1);
  triggerSkillMetric(state, 'taurus.thickSkin');
  log(state, messageTemplate`${target.name} 因厚皮受到卡牌攻击，摸 1 张牌`, target.id, 'skill');
}

function triggerTaurusCardAttackDraw(state           ) {
  const pending = state.pendingAttack;
  if (!pending || !['normalAttack', 'statusAttack'].includes(pending.card.kind)) return;
  const target = findPlayer(state, pending.currentTargetId);
  if (target.characterId !== 'taurus' || !isAlive(target) || pending.taurusDrawnPlayerIds?.includes(target.id)) return;
  (pending.taurusDrawnPlayerIds ??= []).push(target.id);
  drawTaurusForCardAttack(state, target);
}

function offerTaurusGuardInterception(state           ) {
  const pending = state.pendingAttack;
  if (!pending || pending.taurusGuardChecked || pending.scorpioPoisonStep) return;
  pending.taurusGuardChecked = true;
  const target = findPlayer(state, pending.currentTargetId);
  if (!isAlive(target)) return;
  const guardian = findTaurusGuardianFor(state, target);
  if (!guardian || guardian.id === pending.sourceId) {
    triggerTaurusCardAttackDraw(state);
    return;
  }
  queueSkillDecision(state, {kind:'taurusGuard',playerId:guardian.id,sourceId:pending.sourceId,targetId:target.id});
  log(state, messageTemplate`${guardian.name} 可以发动牛守，替代 ${target.name} 成为 ${pending.card.name} 的目标`, guardian.id, 'skill');
}

function resumeAfterSkillDecisions(state           ) {
  if (state.pendingSkillDecisions?.length || resolutionIsPending(state) || state.phase === 'gameOver') return;
  state.pendingSkillDecisions = undefined;
  const resume = state.pendingSkillResume;
  state.pendingSkillResume = undefined;
  if (resume === 'finishAttack' && state.pendingAttack) {
    const source = findPlayer(state, state.pendingAttack.sourceId);
    if (!moveTurnAfterDyingActivePlayer(state, source)) finishCurrentHit(state);
    resolveUnavoidableAttack(state);
    return;
  }
  if (resume === 'endTurn' || resume === 'endTurnAfterRescue') {
    const active = findPlayer(state, state.activePlayerId);
    endTurn(state, active, resume === 'endTurnAfterRescue');
  }
  resolveUnavoidableAttack(state);
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

  if (decision.kind === 'sagittariusResupply' && action.activate) {
    const target = state.players.find(candidate => candidate.id === action.targetId);
    if (!isAlive(player) || !target || !isAlive(target)) throw new Error('补给需要存活的射手和目标');
    const count = Math.max(0, Math.min(4, target.maxHp) - target.hand.length);
    const before = target.hand.length;
    drawCards(state, target, count);
    triggerSkillMetric(state, 'sagittarius.resupply');
    for (let n = before; n < target.hand.length; n++) triggerSkillMetric(state, 'sagittarius.resupplyCards');
    log(state, messageTemplate`${player.name} 为 ${target.name} 补给 ${target.hand.length - before} 张牌`, player.id, 'skill');
  }

  if (decision.kind === 'scorpioEndPeek') {
    if (player.characterId !== 'scorpio' || !isAlive(player) || state.activePlayerId !== player.id || state.phase !== 'discard') {
      throw new Error('当前不能结算回合结束伏击');
    }
    if (action.activate) {
      arrangeScorpioPeek(state, player, action.topCardIds, action.bottomCardIds);
      triggerSkillMetric(state, 'scorpio.endPeek');
    }
  }

  if (decision.kind === 'scorpioPoisonTake') {
    const target = decision.targetId ? findPlayer(state, decision.targetId) : undefined;
    if (player.characterId !== 'scorpio' || !isAlive(player) || !target || !isAlive(target)) throw new Error('蝎毒夺牌目标已失效');
    if (!action.activate) throw new Error('蝎毒必须获得目标的 1 张手牌');
    const selectedId = action.selectedCardId ?? (action.cardIds?.length === 1 ? action.cardIds[0] : undefined);
    const selected = target.hand.find(card => card.id === selectedId);
    if (!selected) throw new Error('蝎毒只能选择目标的 1 张手牌，不能选择装备');
    player.hand.push(takeCard(target, selected.id));
    log(state, messageTemplate`${player.name} 因蝎毒获得 ${target.name} 的手牌 ${selected.name}`, player.id, 'skill');
  }

  if (decision.kind === 'taurusGuardSetup') {
    if (state.phase !== 'draw' || state.activePlayerId !== player.id || player.characterId !== 'taurus') throw new Error('牛守只能在自己的回合开始设置');
    if (action.activate) {
      if (isSilencedInOwnActionTurn(state, player)) throw new Error('沉默期间不能设置牛守目标');
      setTaurusGuardTarget(state, player, action.targetId, action.cardIds ?? []);
    } else {
      player.flags.taurusGuardSetupDone = true;
      const target = state.players.find(candidate => candidate.id === player.flags.taurusGuardTargetId && isAlive(candidate));
      log(state, target ? messageTemplate`${player.name} 延续对 ${target.name} 的牛守` : messageTemplate`${player.name} 本回合不设置牛守目标`, player.id, 'skill');
    }
  }

  if (decision.kind === 'taurusGuard') {
    const target = findPlayer(state, decision.targetId );
    const pending = state.pendingAttack;
    if (!pending || pending.currentTargetId !== target.id || pending.sourceId !== decision.sourceId) throw new Error('当前攻击已变化，请重新选择牛守');
    if (action.activate) {
      if (!isAlive(player) || player.flags.taurusGuardTargetId !== target.id) throw new Error('当前牛守关系无效');
      pending.currentTargetId = player.id;
      pending.remainingTargetIds[0] = player.id;
      pending.targetIds = pending.targetIds.map(id => id === target.id ? player.id : id);
      if (pending.moonAmplifiedTargetId === target.id) pending.moonAmplifiedTargetId = player.id;
      triggerSkillMetric(state, 'taurus.guard');
      rememberCenterPlayedCard(state, source , pending.card, player.id, pending.targetIds, true);
      log(state, messageTemplate`${player.name} 发动牛守，替代 ${target.name} 成为攻击目标，可以正常防御`, player.id, 'skill');
    } else {
      log(state, messageTemplate`${player.name} 本次不代承，${target.name} 仍为攻击目标`, player.id, 'skill');
    }
    state.phase = 'response';
    triggerTaurusCardAttackDraw(state);
  }

  if (decision.kind === 'taurusThickSkin' && action.activate) {
    const cardIds = action.cardIds ?? [];
    if (cardIds.length !== 1) throw new Error('厚皮需要选择弃置 1 张手牌');
    if (!source || !isAlive(source) || source.id === player.id || !isAlive(player)) throw new Error('厚皮需要有效的其他伤害来源');
    const discarded = takeCard(player, cardIds[0]);
    state.discard.push(discarded);
    triggerSkillMetric(state, 'taurus.thickSkin');
    if (source.statuses.silence) {
      applyDamage(state, source, player, 1, {skillKey:'taurus.thickSkin'});
      log(state, messageTemplate`${player.name} 弃置 ${discarded.name} 发动厚皮，对已沉默的 ${source.name} 造成 1 点伤害`, player.id, 'skill');
    } else {
      addStatus(state, source, 'silence', 1);
      if (source.statuses.silence) source.statuses.silence.expiresAtTurnStart = true;
      log(state, messageTemplate`${player.name} 弃置 ${discarded.name} 发动厚皮，令 ${source.name} 沉默`, player.id, 'skill');
    }
  }

  if (decision.kind === 'virgoDiscipline' && action.activate && source?.hp && source.hp > 0) {
    applyDamage(state, source, player, 1, { skillKey: 'virgo.discipline' });
    triggerSkillMetric(state, 'virgo.discipline');
    log(state, messageTemplate`${player.name} 发动戒律，对 ${source.name} 造成 1 点普通伤害`, player.id, 'skill');
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
    log(state, messageTemplate`${player.name} 发动断流，弃置 ${target.name} ${discarded.length} 张牌并造成 1 点伤害`, player.id, 'skill');
  }

  if (decision.kind === 'aquariusChalice' && action.activate) {
    // 倾杯换牌：水瓶与至多 2 名玩家交换至多 2 张等量手牌（每张给出须对应取回一张）。
    const giveIds = action.cardIds ?? [];
    const takeIds = action.selectedCardIds ?? [];
    const targetIds = decision.targetIds ?? action.targetIds ?? [];
    if (new Set(targetIds).size > 2) throw new Error('倾杯最多与 2 名玩家交换');
    if (giveIds.length > 2 || takeIds.length > 2) throw new Error('倾杯单次最多交换 2 张牌');
    if (giveIds.length !== takeIds.length) throw new Error('倾杯交出的牌与取回的牌数量必须一致');
    const visibleTakeIds = takeIds.filter(Boolean);
    if (new Set(giveIds).size !== giveIds.length || new Set(visibleTakeIds).size !== visibleTakeIds.length) {
      throw new Error('倾杯选择的牌不能重复');
    }
    // 每张 give/take 必须能映射到一名合法目标（targetIds 给出顺序对应）。
    if (targetIds.length !== giveIds.length) throw new Error('倾杯每张交换牌都需要对应一名目标');
    const perTarget = giveIds.length;
    const requestedCounts = new Map                ();
    for (let i = 0; i < perTarget; i += 1) {
      const target = findPlayer(state, targetIds[i]);
      if (!target || target.id === player.id || target.hp <= 0) {
        throw new Error('倾杯只能与其他存活角色交换');
      }
      const giveCard = player.hand.find((card) => card.id === giveIds[i]);
      if (!giveCard) throw new Error('倾杯只能交出水瓶的手牌');
      if (sameFaction(state, player, target)) {
        if (!target.hand.some((card) => card.id === takeIds[i])) throw new Error('倾杯只能交换目标的手牌');
      } else if (takeIds[i] !== '') {
        throw new Error('倾杯敌方手牌只能随机交换，不能指定牌');
      }
      const count = (requestedCounts.get(target.id) ?? 0) + 1;
      requestedCounts.set(target.id, count);
      if (count > target.hand.length) throw new Error('倾杯目标的手牌不足以完成交换');
    }
    // 在交牌前，从原始手牌中一次性确定取牌，避免取回刚交出的牌。
    const pools = new Map                ();
    const resolvedTakeIds = targetIds.map((targetId, index) => {
      const target = findPlayer(state, targetId);
      if (sameFaction(state, player, target)) return takeIds[index];
      const pool = pools.get(targetId) ?? [...target.hand];
      const random = randomFloat(state.seed);
      state.seed = random.seed;
      const [selected] = pool.splice(Math.floor(random.value * pool.length), 1);
      pools.set(targetId, pool);
      return selected.id;
    });
    for (let i = 0; i < perTarget; i += 1) {
      const target = findPlayer(state, targetIds[i]) ;
      const giveCard = takeCard(player, giveIds[i]) ;
      const takeCardObj = takeCard(target, resolvedTakeIds[i]) ;
      target.hand.push(giveCard);
      player.hand.push(takeCardObj);
    }
    triggerSkillMetric(state, 'aquarius.stormEye');
    log(state, messageTemplate`${player.name} 发动倾杯，与 ${new Set(targetIds).size} 名玩家交换 ${perTarget} 张手牌`, player.id, 'skill');
  }

  if (decision.kind === 'libraJudgment') {
    const target = action.targetId ? findPlayer(state, action.targetId) : undefined;
    if (!target || target.hp <= 0) throw new Error('审判需要选择一名存活角色');
    assertNotIceArmorBlocked(player, target);
    addStatus(state, target, 'blind', 1);
    triggerSkillMetric(state, 'libra.judgment');
    log(state, messageTemplate`${player.name} 发动审判，令 ${target.name} 获得致盲`, player.id, 'skill');
  }

  if (decision.kind === 'libraPerfectJudgment') {
    const target = action.targetId ? findPlayer(state, action.targetId) : undefined;
    if (!target || target.hp <= 0) throw new Error('完美审判需要选择一名存活角色');
    assertNotIceArmorBlocked(player, target);
    if (action.option === 'damage') {
      applyDamage(state, target, player, 1);
      log(state, messageTemplate`${player.name} 发动完美审判，对 ${target.name} 造成 1 点普通伤害`, player.id, 'skill');
    } else if (action.option === 'steal') {
      if (!action.selectedCardId || !target.hand.some((card) => card.id === action.selectedCardId)) {
        throw new Error('完美审判需要选择目标 1 张手牌');
      }
      const stolen = takeCard(target, action.selectedCardId);
      player.hand.push(stolen);
      log(state, messageTemplate`${player.name} 发动完美审判，获得 ${target.name} 的 1 张手牌`, player.id, 'skill');
    } else {
      throw new Error('完美审判需要选择伤害或获得手牌');
    }
    triggerSkillMetric(state, 'libra.perfectJudgment');
  }

  resumeAfterSkillDecisions(state);
}

function triggerHpLossSkills(state           , target             , damage                                           ) {
  if (!isAlive(target) || damage.hpLost <= 0) return;
  const source = damage.sourceId ? findPlayer(state, damage.sourceId) : undefined;
  if (source && source.id !== target.id) gainCapricornRage(state, target, 1, '承受实际伤害');
  if (target.characterId === 'aries' && damage.outOfTurn) {
    target.flags.ariesBloodRageReady = true;
    triggerSkillMetric(state, 'aries.bloodRageReady');
  }
  if (target.characterId === 'gemini') {
    drawCards(state, target, damage.hpLost, (card) => card.element === 'air');
    triggerSkillMetric(state, 'gemini.windForm');
    log(state, messageTemplate`${target.name} 因双生摸 ${damage.hpLost} 张风牌`, target.id, 'skill');
  }
  if (target.characterId === 'sagittarius' && damage.hadArmor) {
    queueSkillDecision(state, {kind: 'sagittariusResupply', playerId: target.id});
    triggerSkillMetric(state, 'sagittarius.resupplyOffer');
  }
}

function triggerWoundedChoices(state           , target             , damage                                           ) {
  if (!isAlive(target)) return;
  const source = damage.sourceId ? findPlayer(state, damage.sourceId) : undefined;
  if ((damage.hpLost > 0 || damage.armorLost) && target.characterId === 'virgo' && !target.flags.usedVirgoDomainThisTurn) {
    target.flags.usedVirgoDomainThisTurn = true;
    target.flags.virgoDomainActive = true;
    triggerSkillMetric(state, 'virgo.domain');
    log(state, messageTemplate`${target.name} 自动发动净域，本回合免疫后续非神圣伤害和新增负面状态`, target.id, 'skill');
  }
  if (damage.hpLost > 0 && target.characterId === 'aquarius') {
    drawCards(state, target, 2);
    triggerSkillMetric(state, 'aquarius.stormEye');
    log(state, messageTemplate`${target.name} 的倾杯触发，摸 2 张牌`, target.id, 'skill');
    const others = state.players.filter((candidate) => candidate.id !== target.id && candidate.hp > 0);
    if (others.length > 0 && target.hand.length > 0) {
      queueSkillDecision(state, { kind: 'aquariusChalice', playerId: target.id });
      log(state, messageTemplate`${target.name} 可以选择发动倾杯，与至多 2 名玩家交换至多 2 张等量手牌`, target.id, 'skill');
    }
  }
  if (target.characterId === 'taurus' && (damage.armorLost || damage.hpLost > 0)) {
    if (source && source.id !== target.id && isAlive(source) && target.hand.length > 0) {
      queueSkillDecision(state, {kind:'taurusThickSkin',playerId:target.id,sourceId:source.id});
      log(state, messageTemplate`${target.name} 可以弃 1 张牌发动厚皮，${source.statuses.silence ? '对已沉默的来源造成 1 点伤害' : '令伤害来源沉默'}`, target.id, 'skill');
    }
  }
}

function resolveRescuedDamageSkills(state           , pending              ) {
  const damage = pending.damageSkills;
  delete pending.damageSkills;
  if (!damage) return;
  const target = findPlayer(state, pending.targetId);
  triggerHpLossSkills(state, target, damage);
  triggerWoundedChoices(state, target, damage);
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
  const ignoresArmor = Boolean(options.trueDamage || options.sacredDamage || options.hpCost);

  if (
    amount > 0 &&
    !options.hpCost &&
    hasVirgoDomain(target) &&
    !sacredDamage
  ) {
    log(state, messageTemplate`${target.name} 的净域免疫了本次伤害`, target.id, 'skill');
    return;
  }

  if (!options.hpCost && target.statuses.shield && (amount > 0 || options.status)) {
    delete target.statuses.shield;
    log(state, messageTemplate`${target.name} 的圣盾免疫了本次伤害或状态`, target.id, 'shield');
    return;
  }

  let damage = amount;
  const armorCard = target.equipment.armor;
  if (!ignoresArmor && armorCard?.element === 'earth') {
    damage = Math.min(damage, 1);
    if (damage > 0 && !target.flags.usedEarthArmorReductionThisRound) {
      target.flags.usedEarthArmorReductionThisRound = true;
      damage = Math.max(0, damage - 1);
      log(state, messageTemplate`${target.name} 的石壁令本轮首次伤害额外 -1`, target.id, 'equipment');
    }
  }

  const armorBefore = target.armor;
  if (!ignoresArmor && target.armor > 0 && damage > 0) {
    const blocked = Math.min(target.armor, damage);
    target.armor -= blocked;
    damage -= blocked;
    log(state, messageTemplate`${target.name} 的护甲抵消 ${blocked} 点伤害`, target.id, 'armor');
  }

  const damageSkills                                            = {
    sourceId: source?.id,
    hpLost: Math.max(0, damage),
    armorLost: armorBefore > target.armor,
    hadArmor: Boolean(armorCard),
    cardDamage: Boolean(options.cardDamage),
    outOfTurn: state.activePlayerId !== target.id,
  };

  if (damage > 0) {
    target.hp -= damage;
    state.metrics.damageTaken[target.id] = (state.metrics.damageTaken[target.id] ?? 0) + damage;
    if (source) {
      state.metrics.damageBySource[source.id] = (state.metrics.damageBySource[source.id] ?? 0) + damage;
      if (source.id !== target.id) gainCapricornRage(state, source, 1, sacredDamage ? '造成神圣伤害' : '造成实际伤害');
    }
    log(state, messageTemplate`${target.name} 受到 ${damage} 点${sacredDamage ? '神圣' : options.trueDamage ? '真实' : ''}伤害`, target.id, 'damage');
    if (!sacredDamage) triggerHpLossSkills(state, target, damageSkills);
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
      log(state, messageTemplate`${source.name} 触发月蚀汲取：回复生命并摸 1 张牌`, source.id, 'infection');
    }
  }
  if (!sacredDamage) triggerWoundedChoices(state, target, damageSkills);

  if (
    damage > 0 && isInfectionMode(state) && source && source.id !== target.id &&
    isInfectedFaction(source) && target.factionId === 'survivor' && state.infection .damageSpreadEnabled
  ) {
    applyInfection(state, target, source);
  }

  if (options.status) addStatus(state, target, options.status, 1);

  if (damage > 0 && source && !ignoresArmor) triggerArmorAfterDamage(state, target, source);
  if (isInfectionMode(state)) {
    if (target.hp <= 0) beginInfectionDying(state, target, source);
  } else {
    checkDefeat(state);
  }
  const dying = state.pendingRescue ?? state.infection?.pendingDying;
  if (!sacredDamage && dying?.targetId === target.id && !isAlive(target)) dying.damageSkills = damageSkills;
}

function triggerArmorAfterDamage(state           , target             , source             ) {
  const armor = target.equipment.armor;
  if (!armor) return;

  if (armor.element === 'fire' && !target.flags.firstAttackDamageApplied) {
    target.flags.firstAttackDamageApplied = true;
    addStatus(state, source, 'burn', 1);
    log(state, messageTemplate`${target.name} 的烈焰披风令 ${source.name} 获得灼烧`, target.id, 'equipment');
  }
  if (armor.element === 'water') {
    if (!virgoBlocksDebuff(state, source, '寒冰护甲')) {
      if (!source.flags.iceArmorBlockedTargetIds.includes(target.id)) source.flags.iceArmorBlockedTargetIds.push(target.id);
      log(state, messageTemplate`${target.name} 的寒冰护甲限制 ${source.name} 本回合继续输出`, target.id, 'equipment');
    }
  }
  if (armor.element === 'air' && !target.flags.firstAttackDamageApplied) {
    target.flags.firstAttackDamageApplied = true;
    if (source.hand.length > 0) {
      state.discard.push(source.hand.shift() );
      log(state, messageTemplate`${target.name} 的飓风斗篷令 ${source.name} 弃 1 张牌`, target.id, 'equipment');
    }
  }
}

function standardRescuers(state           , target             ) {
  const ordinaryAllowed = !isLeoHealingBlocked(state, target);
  return state.players.filter(candidate => !candidate.eliminated && (
    candidate.hand.some(card => card.kind === 'sun' || (ordinaryAllowed && card.kind === 'energy')) ||
    (ordinaryAllowed && candidate.characterId === 'cancer' && candidate.id !== target.id && candidate.hp > 0 &&
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
  resolveRescuedDamageSkills(state, pending);
  if (state.pendingSkillDecisions?.length) {
    if (state.pendingAttack && state.pendingAttack.sourceId !== target.id && ['response', 'hammerBreak'].includes(pending.resumePhase)) {
      state.pendingSkillResume ??= 'finishAttack';
    } else if (pending.resumePhase === 'discard' && target.id === state.activePlayerId) {
      state.pendingSkillResume ??= 'endTurnAfterRescue';
    }
  }
  if (state.pendingSkillResume) {
    resumeAfterSkillDecisions(state);
  } else if (state.pendingAttack && ['response', 'hammerBreak'].includes(pending.resumePhase)) {
    const attack = state.pendingAttack;
    if (attack.sourceId === target.id) {
      if (target.hp <= 0) moveTurnAfterDyingActivePlayer(state, target);
      else if (attack.defensesRemaining > 0) {
        state.phase = 'response';
        offerTaurusGuardInterception(state);
      }
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
    log(state, messageTemplate`${target.name} 濒死，等待太阳、星能或蟹护急救`, target.id, 'rescue');
    return;
  }
  const defeatedTeams = defeatedTeamIds(state);
  const finalizeDeathsOutsideTeamDefeat = () => {
    for (const player of state.players) {
      if (player.hp > 0 || player.eliminated || defeatedTeams.includes(player.teamId)) continue;
      player.eliminated = true;
      log(state, messageTemplate`${player.name} 阵亡，退出行动序列`, player.id, 'defeat');
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
    log(state, messageTemplate`${rescueReviewTeams.join('/')} 队进入急救复核，可使用太阳或星能急救`, undefined, 'defeat');
    return;
  }
  const winner = state.players.find((player) => !defeatedTeams.includes(player.teamId) && player.hp > 0);
  state.winnerId = winner?.id;
  state.winnerTeamId = winner?.teamId;
  state.phase = 'gameOver';
  log(state, messageTemplate`${defeatedTeams.join('/')} 队全员濒死，${winner?.teamId ?? '对方'} 队获胜`, winner?.id, 'gameOver');
}

function moveTurnAfterDyingActivePlayer(state           , player             ) {
  if (state.phase === 'gameOver' || player.hp > 0 || state.activePlayerId !== player.id) return false;
  state.pendingAttack = undefined;
  clearPlayedCards(state);
  advanceTurnOrder(state, player.id);
  state.phase = 'draw';
  state.firstTurn = false;
  removeTurnStartStatuses(state, findPlayer(state, state.activePlayerId));
  log(state, messageTemplate`${player.name} 濒死，行动立即结束`, player.id, 'defeat');
  offerTaurusGuardSetup(state);
  return true;
}

function settleDyingActivePlayer(state           ) {
  if (state.phase === 'gameOver' || resolutionIsPending(state) || state.pendingSkillDecisions?.length) return;
  const active = findPlayer(state, state.activePlayerId);
  moveTurnAfterDyingActivePlayer(state, active);
}

function elementForFormalUse(player             , card      , chosenElement              )                          {
  if (card.element) return card.element;
  if (card.kind === 'sun' || card.kind === 'moon') return chosenElement ?? CHARACTERS[player.characterId].element;
  return undefined;
}

function recordAirUse(state           , player             , count = 1) {
  if (count <= 0) return;
  player.flags.airCardsUsed += count;
  if (player.characterId === 'gemini' && player.flags.airCardsUsed >= 3 && !player.flags.usedGeminiExtraTurnThisRound) {
    player.flags.usedGeminiExtraTurnThisRound = true;
    player.flags.grantedExtraTurn = true;
    triggerSkillMetric(state, 'gemini.extraTurn');
    log(state, messageTemplate`${player.name} 的连星准备额外回合`, player.id, 'skill');
  }
}

function recordCardElement(state           , player             , card      , chosenElement              ) {
  const element = elementForFormalUse(player, card, chosenElement);
  if (!element) return;
  if (element === 'air') recordAirUse(state, player);

  if (!player.flags.usedCardElements.includes(element)) {
    player.flags.usedCardElements.push(element);
  }

  if (player.characterId === 'libra' && state.activePlayerId === player.id && !player.flags.libraRoundElements.includes(element)) {
    player.flags.libraRoundElements.push(element);
    drawCards(state, player, 1);
    triggerSkillMetric(state, 'libra.elementSense');
    log(state, messageTemplate`${player.name} 的衡感触发，首次正式使用${element}属性牌`, player.id, 'skill');
  }

  const turnElementCount = player.flags.usedCardElements.length;
  const canTriggerLibraJudgment = player.characterId === 'libra' && state.activePlayerId === player.id && state.phase === 'main';

  if (canTriggerLibraJudgment && turnElementCount >= 3 && !player.flags.usedLibraJudgmentThisTurn) {
    player.flags.usedLibraJudgmentThisTurn = true;
    queueSkillDecision(state, { kind: 'libraJudgment', playerId: player.id });
    log(state, messageTemplate`${player.name} 的审判触发，等待选择目标`, player.id, 'skill');
  }

  if (canTriggerLibraJudgment && turnElementCount >= 4 && !player.flags.usedLibraPerfectJudgmentThisTurn) {
    player.flags.usedLibraPerfectJudgmentThisTurn = true;
    queueSkillDecision(state, { kind: 'libraPerfectJudgment', playerId: player.id });
    log(state, messageTemplate`${player.name} 的完美审判触发，等待选择效果和目标`, player.id, 'skill');
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
  const equipmentCount = Number(Boolean(player.equipment.weapon)) + Number(Boolean(player.equipment.armor));
  const extraAvailable = player.characterId === 'sagittarius' && Boolean(player.equipment.weapon) &&
    (player.flags.usedSagittariusExtraAttacks ?? 0) < equipmentCount;
  return player.flags.basicAttackCount < limit || extraAvailable;
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

function consumeEnergyCharge(player             , card      ) {
  const charged =
    (card.kind === 'normalAttack' || card.kind === 'statusAttack') &&
    Boolean(player.flags.energyChargeElement);
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
    (state.pendingAttack?.unavoidable || state.pendingAttack?.unblockable) &&
    !state.pendingSkillDecisions?.length &&
    !state.pendingAttack.scorpioPoisonStep &&
    state.phase !== 'gameOver' &&
    !resolutionIsPending(state)
  ) {
    const pending = state.pendingAttack;
    const progressKey = `${pending.currentTargetId}:${pending.hitsRemaining}:${pending.remainingTargetIds.length}`;
    resolveFailedDefense(state);
    const next = state.pendingAttack;
    if (!next || state.phase === 'gameOver' || state.pendingSkillDecisions?.length || resolutionIsPending(state)) return;
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
    log(state, messageTemplate`${defender.name} 无牌支付撼岳锤的额外防御费用，防御无效`, defender.id, 'equipment');
    triggerSkillMetric(state, 'weapon.earthHammer');
    resolveFailedDefense(state);
    return true;
  }
  state.phase = 'hammerBreak';
  log(state, messageTemplate`${source.name} 的撼岳锤生效：${defender.name} 需额外弃 1 张手牌完成防御`, defender.id, 'equipment');
  return true;
}

function applySuccessfulDefenseOutcome(state           ) {
  const pending = state.pendingAttack;
  if (!pending) throw new Error('No pending attack');
  const defender = findPlayer(state, pending.currentTargetId);

  if (pending.card.kind === 'statusAttack' && pending.statusToApply && !pending.statusDefensePerfect) {
    addStatus(state, defender, pending.statusToApply, 1);
    log(state, messageTemplate`${defender.name} 异属性防御：抵消伤害，但未抵消异常`, defender.id, 'defense');
  } else {
    log(state, messageTemplate`${defender.name} 完美防御成功`, defender.id, 'defense');
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

function isCapricornWushuangAttack(source             , card      ) {
  return (
    source.characterId === 'capricorn' &&
    card.element === 'earth' &&
    (card.kind === 'normalAttack' || card.kind === 'statusAttack')
  );
}

function isValidDefense(pending               , defender             , defenseCard      ) {
  if (pending.scorpioPoisonStep) return true;
  if (pending.unavoidable || pending.unblockable) return false;
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
    log(state, messageTemplate`${pending.card.name} 还需结算第 ${pending.hitsPerTarget - pending.hitsRemaining + 1} 次打击`, pending.sourceId, 'attack');
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
    log(state, messageTemplate`${target.name} must pay 1 water card to avoid Scorpio poison freeze`, target.id, 'skill');
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
    log(state, messageTemplate`${defender.name} gives ${card.name} to ${source.name} to avoid Scorpio poison freeze`, defender.id, 'skill');
  } else {
    addStatus(state, defender, 'frozen', 1);
    log(state, messageTemplate`${defender.name} gives ${card.name} to ${source.name} and is frozen by Scorpio poison`, defender.id, 'skill');
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
  log(state, messageTemplate`${target.name} failed to pay water and is frozen by Scorpio poison`, target.id, 'skill');
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
    log(state, messageTemplate`${defender.name} 使用太阳完美防御并摸 1 张牌`, defender.id, 'defense');
    if (pending.defensesRemaining > 0) {
      log(state, messageTemplate`${defender.name} defended once and still needs ${pending.defensesRemaining} defense card`, defender.id, 'defense');
      return;
    }
    if (offerEarthHammerBreak(state, pending)) return;
    finishCurrentHit(state);
    return;
  }

  if (defenseCard.kind === 'moon') {
    log(state, messageTemplate`${defender.name} 使用月亮完美防御并反击`, defender.id, 'defense');
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
      log(state, messageTemplate`${defender.name} defended once and still needs ${pending.defensesRemaining} defense card`, defender.id, 'defense');
      return;
    }
    if (offerEarthHammerBreak(state, pending)) return;
    finishCurrentHit(state);
    return;
  }

  pending.defensesRemaining -= 1;
  if (pending.defensesRemaining > 0) {
    log(state, messageTemplate`${defender.name} 防御成功 1 张，还需 ${pending.defensesRemaining} 张防御牌`, defender.id, 'defense');
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
    offerVirgoDiscipline(state, findPlayer(state, pending.sourceId),
      pending.targetIds.map(id => findPlayer(state, id)), pending.card.kind === 'aoe');
  } else {
    pending.scorpioPoisonStep = false;
    pending.currentTargetId = pending.remainingTargetIds[0];
    const source = findPlayer(state, pending.sourceId);
    pending.hitsRemaining = pending.hitsPerTarget;
    pending.defensesRemaining = isCapricornWushuangAttack(source, pending.card) ? 2 : 1;
    pending.statusDefensePerfect = true;
    pending.taurusGuardChecked = false;
    offerTaurusGuardInterception(state);
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
      log(state, messageTemplate`${source.name} 的必中抵消了致盲影响`, source.id, 'status');
    } else {
      damage = 0;
      status = undefined;
      log(state, messageTemplate`${source.name} 因致盲，本次攻击落空`, source.id, 'status');
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
    log(state, messageTemplate`${defender.name} 放弃支付撼岳锤额外费用，防御无效`, defender.id, 'equipment');
    triggerSkillMetric(state, 'weapon.earthHammer');
    resolveFailedDefense(state);
    return;
  }

  const card = takeCard(defender, action.cardId);
  state.discard.push(card);
  triggerSkillMetric(state, 'weapon.earthHammer');
  log(state, messageTemplate`${defender.name} 额外弃置 ${card.name}，完成对撼岳锤攻击的防御`, defender.id, 'equipment');
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
    log(state, messageTemplate`${player.name} 因感染在回合结束时失去 1 点生命`, player.id, 'infection');
    if (player.hp <= 0) {
      beginInfectionDying(state, player, undefined, 'discard', true);
      if (state.phase === 'gameOver' || resolutionIsPending(state)) return;
      if (player.eliminated || player.infectionRole === 'converted') return;
    }
  }

  if (state.phase === 'gameOver') return;
  if (state.pendingSkillDecisions?.some(decision => decision.kind === 'sagittariusResupply')) {state.pendingSkillResume = 'endTurnAfterRescue';return;}
  removeOneRoundStatuses(state, player);

  if (player.characterId === 'scorpio' && isAlive(player) && player.flags.usedScorpioPeek &&
      player.flags.scorpioPeekMissedWater && !player.flags.usedScorpioEndPeek) {
    player.flags.usedScorpioEndPeek = true;
    queueSkillDecision(state, { kind: 'scorpioEndPeek', playerId: player.id });
    state.pendingSkillResume = 'endTurnAfterRescue';
    log(state, messageTemplate`${player.name} 开局伏击未找到水牌，可以在回合结束时再次发动伏击`, player.id, 'skill');
    return;
  }

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
    };
  }

  if (!extraTurn) {
    advanceTurnOrder(state, player.id);
  }

  state.phase = 'draw';
  state.firstTurn = false;
  const nextActive = findPlayer(state, state.activePlayerId);
  removeTurnStartStatuses(state, nextActive);
  if (nextActive.characterId === 'leo') nextActive.flags.leoOrderTargetId = undefined;
  offerTaurusGuardSetup(state);
}

function triggerEquipmentLeftOwner(
  state           ,
  owner             ,
  card      ,
) {
  if (card.kind === 'armor' && card.element === 'earth' && isAlive(owner)) {
    heal(state, owner, 1, owner);
    log(state, messageTemplate`${owner.name} 的石壁离开装备区`, owner.id, 'equipment');
  }
  if (owner.characterId !== 'sagittarius' || !isAlive(owner)) return;
  drawCards(state, owner, 2);
  triggerSkillMetric(state, 'sagittarius.bowcraft');
  log(state, messageTemplate`${owner.name} 的整弓触发：${card.name} 离开装备区，摸 2 张牌`, owner.id, 'skill');
}

function continueCapricornSpread(state           ) {
  const pending = state.pendingCapricornSpread;
  if (!pending) return;
  if (state.phase === 'gameOver') {
    delete state.pendingCapricornSpread;
    return;
  }
  if (resolutionIsPending(state) || state.pendingSkillDecisions?.length) return;
  const source = findPlayer(state, pending.sourceId);
  while (pending.targetIds.length) {
    const target = findPlayer(state, pending.targetIds.shift() );
    if (!isAlive(target)) continue;
    applyDamage(state, target, source, 1, { sacredDamage: true, status: 'silence' });
    const discardOwners = pending.discardSource ? [source, target] : [target];
    pending.discardSource = false;
    for (const owner of discardOwners) {
      state.discard.push(...owner.hand.splice(0));
      const equipment = Object.values(owner.equipment);
      owner.equipment = {};
      for (const card of equipment) {
        state.discard.push(card);
        triggerEquipmentLeftOwner(state, owner, card);
      }
    }
    // A later hit must not replace the current rescue or Eclipse reward.
    if (state.phase === 'gameOver') break;
    if (resolutionIsPending(state) || state.pendingSkillDecisions?.length) return;
  }
  delete state.pendingCapricornSpread;
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
  log(state, messageTemplate`${player.name} 装备 ${card.name}`, player.id, 'equipment');
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
    log(state, messageTemplate`${player.name} 更换起手牌，弃 ${replaceCount} 张并重摸 ${replaceCount} 张`, player.id, 'setup');
  } else {
    log(state, messageTemplate`${player.name} 保留起手牌`, player.id, 'setup');
  }

  state.mulliganPendingPlayerIds.splice(pendingIndex, 1);
  if (state.mulliganPendingPlayerIds.length > 0) {
    state.activePlayerId = state.startingPlayerId;
    return;
  }

  state.activePlayerId = state.startingPlayerId;
  state.phase = 'draw';
  log(state, messageTemplate`起手选择完成，轮到 ${findPlayer(state, state.activePlayerId).name} 摸牌`, state.activePlayerId, 'setup');
  offerTaurusGuardSetup(state);
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
  log(state, messageTemplate`${target.name} 通过${rescueName}急救成功，牌局继续`, target.id, event);
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
  log(state, messageTemplate`${player.name} 使用太阳急救 ${target.name}`, player.id, 'sun');
  resolveRescuedDamageSkills(state, pending);
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
    log(state, messageTemplate`${player.name} 使用太阳急救 ${target.name}`, player.id, 'sun');
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
  log(state, messageTemplate`${player.name} 使用太阳：获得本属性牌、回复并净化`, player.id, 'sun');
}

function playEnergyRescue(state           , player             , card      , targetId         ) {
  if (isInfectionMode(state)) throw new Error('感染模式没有星能急救');
  const target = targetId ? findPlayer(state, targetId) : player;
  requireStandardDyingRescuer(player, '星能急救');
  requireStandardDyingRescueTarget(state, target, '星能急救');
  if (isLeoHealingBlocked(state, target)) throw new Error('狮威禁止普通急救，请使用太阳');
  state.discard.push(card);
  rescueHeal(state, target, 1, player);
  log(state, messageTemplate`${player.name} 使用星能急救 ${target.name}`, player.id, 'card');
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
    log(state, messageTemplate`${player.name} 对 ${target.name} 使用${card.element ?? ''}感染牌`, player.id, 'infection');
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
  log(state, messageTemplate`${target.name} 使用${responseCard.name}抵消感染牌`, target.id, 'infection');
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
    log(state, messageTemplate`${findPlayer(state, action.playerId).name} 放弃急救 ${findPlayer(state, pending.targetId).name}`, action.playerId, 'rescue');
    const next = pending.eligibleResponderIds.find(id => !pending.passedResponderIds.includes(id));
    if (next) pending.currentResponderId = next;
    else {
      const target = findPlayer(state, pending.targetId);
      target.eliminated = true;
      log(state, messageTemplate`${target.name} 未获急救，阵亡并退出行动序列`, target.id, 'defeat');
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
    log(state, messageTemplate`${player.name} 使用月亮增伤：本次对 ${target.name} 的伤害 +1`, player.id, 'moon');
    return;
  }
  state.discard.push(card);
  if (mode !== 'curse') throw new Error('主动回合月亮目前支持 curse 模式');
  const target = targetId ? findPlayer(state, targetId) : opponentOf(state, player.id);
  const discarded = target.hand.shift();
  if (discarded) state.discard.push(discarded);
  addStatus(state, target, 'silence', 1);
  log(state, messageTemplate`${player.name} 使用月亮窥视与诅咒：弃 ${target.name} 1 张牌并施加沉默`, player.id, 'moon');
}

function handleCancerRescue(state           , action                                       , player             ) {
  if (player.characterId !== 'cancer') throw new Error('Only Cancer can use Crab Guard');
  if (!isAlive(player)) throw new Error('濒死或已出局的巨蟹不能发动蟹护');
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
  if (target.eliminated) throw new Error('阵亡判定后不能通过蟹护急救');
  if (isLeoHealingBlocked(state, target)) throw new Error('狮威禁止普通急救，请使用太阳');
  if (action.cardIds?.length !== 1) throw new Error('蟹护需要恰好 1 张水牌');
  const cardId = action.cardIds?.[0];
  if (!cardId) throw new Error('蟹护需要弃 1 张水牌');
  const card = takeCard(player, cardId);
  if (card.element !== 'water') throw new Error('蟹护只能弃水牌');
  state.discard.push(card);
  player.flags.usedCancerRescueThisRound = true;
  rescueHeal(state, target, 1, player);
  triggerSkillMetric(state, action.skillId);
  log(state, messageTemplate`${player.name} 发动蟹护急救 ${target.name}`, player.id, 'skill');
  if (state.pendingRescue) return finishStandardRescue(state);
  if (isInfectionMode(state) && infectionPending) {
    delete state.infection .pendingDying;
    resolveRescuedDamageSkills(state, infectionPending);
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
      log(state, messageTemplate`${player.name} 的合成牌获得 ${player.armor - armorBefore} 点护甲`, player.id, 'equipment');
    }
    if (card.fusion.attackCount === 0) {
      clearCenterPlayedCards(state);
      rememberCenterPlayedCard(state, player, card, player.id, [player.id], true);
      state.discard.push(card);
      if (card.fusion.sureHit) addStatus(state, player, 'sureHit');
      log(
        state,
        messageTemplate`${player.name} 使用 ${card.name}${card.fusion.sureHit ? '，下一张普通攻击必中且不可防御' : ''}`,
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
    log(state, messageTemplate`${player.name} 使用${card.name}蓄能：本回合下一张任意属性的普通攻击或状态攻击伤害 +1`, player.id, 'card');
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
      drawTaurusForCardAttack(state, target);
      applyDamage(state, target, player, 1, { cardDamage: true });
      log(state, messageTemplate`${player.name} 发动元素对决，${target.name} 失去 1 点生命`, player.id, 'card');
    } else if (card.element === 'water') {
      const stolen = takeWaterStealableCard(target, action.selectedCardId);
      if (stolen) {
        player.hand.push(stolen);
        log(state, messageTemplate`${player.name} 发动潮汐窃取，获得 ${target.name} 1 张手牌`, player.id, 'card');
      } else {
        log(state, messageTemplate`${player.name} 发动潮汐窃取，但 ${target.name} 没有手牌`, player.id, 'card');
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
        log(state, messageTemplate`${player.name} 发动风之制裁，弃置 ${target.name} 1 张手牌`, player.id, 'card');
      } else {
        addStatus(state, target, 'blind', 1);
        log(state, messageTemplate`${player.name} 发动风之制裁，${target.name} 没有手牌并获得致盲`, player.id, 'card');
      }
    } else {
      drawCards(state, player, 2);
      log(state, messageTemplate`${player.name} 发动石之宝藏，摸 2 张牌`, player.id, 'card');
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
    const energyCharged = consumeEnergyCharge(player, card);
    let attackDamage = energyCharged ? 2 : 1;
    const usesStoredSureHit = card.kind === 'normalAttack' && Boolean(player.statuses.sureHit);
    if (usesStoredSureHit) delete player.statuses.sureHit;
    state.pendingAttack = makePendingAttack(
      state,
      player,
      card,
      targets.map((candidate) => candidate.id),
      attackDamage,
    );
    if (player.characterId === 'sagittarius' && player.equipment.weapon &&
        (card.kind === 'normalAttack' || card.kind === 'statusAttack') &&
        player.flags.basicAttackCount > 1 + (player.flags.infectionBossCommandMode === 'extraAttack' ? 1 : 0) &&
        (player.flags.usedSagittariusExtraAttacks ?? 0) < Number(Boolean(player.equipment.weapon)) + Number(Boolean(player.equipment.armor))) {
      player.flags.usedSagittariusExtraAttacks = (player.flags.usedSagittariusExtraAttacks ?? 0) + 1;
      state.pendingAttack.unblockable = card.element === 'fire';
      triggerSkillMetric(state, 'sagittarius.extraAttack');
      log(state, messageTemplate`${player.name} 的神射发动额外攻击，${card.element === 'fire' ? '火牌不可防御但仍受致盲影响' : '非火牌可以防御'}`, player.id, 'skill');
    }
    if (usesStoredSureHit) state.pendingAttack.unavoidable = true;
    if (isFirstNormalAttackThisTurn && player.equipment.weapon?.element === 'earth') {
      state.pendingAttack.earthHammerCostRequired = true;
    }
    if (energyCharged) {
      log(state, messageTemplate`${player.name} 的星能蓄能强化了本次攻击`, player.id, 'card');
    }
    log(state, messageTemplate`${player.name} 对 ${targets.map((candidate) => candidate.name).join('、')} 使用 ${card.name}`, player.id, 'attack');
    const dying = state.pendingRescue;
    if (dying) {
      dying.resumePhase = 'response';
      state.phase = 'rescue';
      return;
    }
    state.phase = 'response';
    offerTaurusGuardInterception(state);
    if (state.pendingAttack.unavoidable || state.pendingAttack.unblockable) {
      log(state, messageTemplate`${card.name} 不可防御，直接结算`, player.id, 'attack');
      resolveUnavoidableAttack(state);
    } else {
      state.phase = 'response';
    }
  }
}

function scorpioDisarmOptions(player             , target             ) {
  const options                                              = [];
  if (target.armor > 0 && player.armor < player.maxArmor) options.push({option:'armor'});
  if (target.statuses.shield) options.push({option:'shield'});
  if (target.equipment.weapon) options.push({option:'weapon',selectedCardId:target.equipment.weapon.id});
  if (target.equipment.armor) options.push({option:'armorEquipment',selectedCardId:target.equipment.armor.id});
  if (!target.armor && !target.statuses.shield && !target.equipment.weapon && !target.equipment.armor) options.push({option:'damage'});
  return options;
}

function resolveScorpioDisarm(state           , player             , target             , option        ) {
  if (option === 'armor') {
    target.armor -= 1;
    player.armor += 1;
    log(state, messageTemplate`${player.name} 发动缴械，转移 ${target.name} 的 1 点护甲给自己`, player.id, 'skill');
  } else if (option === 'shield') {
    player.statuses.shield = target.statuses.shield;
    delete target.statuses.shield;
    log(state, messageTemplate`${player.name} 发动缴械，转移 ${target.name} 的圣盾给自己`, player.id, 'skill');
  } else if (option === 'weapon' || option === 'armorEquipment') {
    const slot = option === 'weapon' ? 'weapon' : 'armor';
    const equipment = target.equipment[slot] ;
    delete target.equipment[slot];
    triggerEquipmentLeftOwner(state, target, equipment);
    playEquipment(state, player, equipment);
    log(state, messageTemplate`${player.name} 发动缴械，夺取并装备 ${target.name} 的 ${equipment.name}`, player.id, 'skill');
  } else {
    log(state, messageTemplate`${player.name} 发动缴械，目标 ${target.name} 无可转移资源，造成 1 点伤害`, player.id, 'skill');
    applyDamage(state, target, player, 1);
  }
}

function scorpioPeekCards(state           ) {
  const count = state.players.length >= 5 ? 5 : state.players.length === 4 ? 4 : 3;
  return state.deck.slice(0, count);
}

function scorpioWaterPeekOrder(state           ) {
  const cards = scorpioPeekCards(state);
  return {
    topCardIds: cards.filter(card => card.element === 'water').map(card => card.id),
    bottomCardIds: cards.filter(card => card.element !== 'water').map(card => card.id),
  };
}

function arrangeScorpioPeek(state           , player             , topIds           , bottomIds           ) {
  const peeked = scorpioPeekCards(state);
  const topCardIds = topIds ?? peeked.map(card => card.id);
  const bottomCardIds = bottomIds ?? [];
  const orderedIds = [...topCardIds, ...bottomCardIds];
  const uniqueIds = new Set(orderedIds);
  const peekedIds = new Set(peeked.map(card => card.id));
  if (orderedIds.length !== peeked.length || uniqueIds.size !== peeked.length) {
    throw new Error('伏击需要安排所有查看到的牌，且不能重复');
  }
  for (const id of orderedIds) {
    if (!peekedIds.has(id)) throw new Error('伏击只能安排查看到的牌');
  }
  const byId = new Map(peeked.map(card => [card.id, card]));
  const topCards = topCardIds.map(id => byId.get(id) );
  const bottomCards = bottomCardIds.map(id => byId.get(id) );
  state.deck = [...topCards, ...state.deck.slice(peeked.length), ...bottomCards];
  log(state, messageTemplate`${player.name} 查看牌堆顶 ${peeked.length} 张；牌顶：${topCards.map(card => card.name).join('、') || '无'}；牌底：${bottomCards.map(card => card.name).join('、') || '无'}`, player.id, 'skill');
  triggerSkillMetric(state, 'scorpio.peek');
  return peeked;
}

function handleSkill(state           , action                                       ) {
  const player = findPlayer(state, action.playerId);
  if (action.skillId.includes('.') && action.skillId.split('.')[0] in CHARACTERS &&
      action.skillId.split('.')[0] !== player.characterId) throw new Error('不能发动其他星座的技能');
  if (action.skillId === 'cancer.rescue') {
    handleCancerRescue(state, action, player);
    return;
  }
  if (!isAlive(player)) throw new Error('濒死或已出局角色不能发动主动技能');
  if (player.id !== state.activePlayerId) throw new Error('Only active player can use active skills');
  if (action.skillId !== 'scorpio.peek' && isSilencedInOwnActionTurn(state, player)) throw new Error(`${player.name} is silenced`);
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
      messageTemplate`${player.name} 发动蚀月战令：${action.option === 'extraAttack' ? '本回合可额外使用 1 张基础攻击牌' : '本回合 1 张基础攻击牌可额外指定 1 个目标'}`,
      player.id,
      'infection',
    );
    return;
  }
  const target = action.targetId ? findPlayer(state, action.targetId) : opponentOf(state, player.id);
  if (action.targetId && !isAlive(target)) throw new Error(action.skillId === 'cancer.heal' ? '疗潮不能治疗濒死角色' : '技能只能选择存活角色');
  if (['aries.ram', 'leo.roar', 'leo.order', 'cancer.heal', 'taurus.armor', 'virgo.purify'].includes(action.skillId) &&
      action.cardIds?.length !== 1) throw new Error('该技能需要恰好 1 张费用牌');
  if (action.skillId === 'scorpio.spoils' && action.cardIds?.length !== 1) throw new Error('缴械需要弃置 1 张手牌');

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
      messageTemplate`${player.name} 发动潮汐法典，将 ${materials.map((card) => card.name).join('、')} 合成为 ${fusionCard.name}`,
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
    log(state, messageTemplate`${player.name} 发动命运罗盘，获得 1 张${element}属性牌`, player.id, 'equipment');
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
      log(state, messageTemplate`${player.name} 因致盲，羊角冲落空`, player.id, 'status');
    } else {
      applyDamage(state, target, player, damage, { status: card.kind === 'statusAttack' && card.element === 'fire' ? 'burn' : undefined });
    }
    triggerSkillMetric(state, action.skillId);
    log(state, messageTemplate`${player.name}${usedBurnSoul ? ' 以燃魂' : ''}发动羊角冲，对 ${target.name} 造成不可防御伤害`, player.id, 'skill');
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
    for (const candidate of leoTargets) assertNotIceArmorBlocked(player, candidate);
    state.discard.push(fireCost);
    player.flags.usedLeoRoar = true;
    for (const candidate of leoTargets) {
      if (!candidate.statuses.burn) addStatus(state, candidate, 'burn', 1);
    }
    offerVirgoDiscipline(state, player, leoTargets);
    triggerSkillMetric(state, action.skillId);
    log(state, messageTemplate`${player.name} uses Leo roar on ${leoTargets.map((candidate) => candidate.name).join(', ')}`, player.id, 'skill');
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
    if (!virgoBlocksDebuff(state, target, '王令')) player.flags.leoOrderTargetId = target.id;
    triggerSkillMetric(state, action.skillId);
    log(state, messageTemplate`${player.name} uses Leo order on ${target.name}`, player.id, 'skill');
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
    log(state, messageTemplate`${player.name} 发动疗潮，治疗 ${target.name}`, player.id, 'skill');
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
    log(state, messageTemplate`${player.name} 发动筑甲，${target.name} 护甲 ${before} -> ${target.armor}`, player.id, 'skill');
    return;
  }

  if (action.skillId === 'taurus.guard') {
    if (player.characterId !== 'taurus') throw new Error('Only Taurus can use guard');
    if (player.flags.taurusGuardSetupDone) throw new Error('牛守每个自己的回合开始只能设置或更换一次');
    if (!action.targetId) offerTaurusGuardSetup(state);
    else setTaurusGuardTarget(state, player, action.targetId, action.cardIds ?? []);
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
      const costs = costIds.map(id => takeCard(player, id));
      state.discard.push(...costs);
      recordAirUse(state, player, costs.filter(card => card.element === 'air').length);
      if (costIds.length === 1) applyDamage(state, player, player, 1, { hpCost: true });
      if (state.phase === 'gameOver') return;
      applyDamage(state, target, player, 1, { status: 'blind' });
      player.flags.usedGeminiSteal = true;
      triggerSkillMetric(state, action.skillId);
      log(state, messageTemplate`${player.name} 发动换影，${target.name} 没有手牌和装备，受到 1 点伤害并获得致盲`, player.id, 'skill');
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
    const costs = costIds.map(id => takeCard(player, id));
    state.discard.push(...costs);
    recordAirUse(state, player, costs.filter(card => card.element === 'air').length);
    if (costIds.length === 1) applyDamage(state, player, player, 1, { hpCost: true });
    if (state.phase === 'gameOver') return;
    if (stolen) {
      player.hand.push(stolen);
      if (stolen.element !== 'air') applyDamage(state, target, player, 1);
    }
    player.flags.usedGeminiSteal = true;
    triggerSkillMetric(state, action.skillId);
    log(state, messageTemplate`${player.name} 发动换影，获得 ${target.name} 的${sourceText} ${stolen.name}`, player.id, 'skill');
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
    offerVirgoDiscipline(state, player, targets);
    triggerSkillMetric(state, action.skillId);
    log(
      state,
      messageTemplate`${player.name} 发动裁衡，${richer.name} 将 ${transferred.map((card) => card.name).join('、')} 交给 ${poorer.name}`,
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
    if (costs.every((card) => card.element === 'air')) {
      heal(state, player, 1, player);
    }
    // 神酿献祭 1 点生命走正常受伤流程，使水瓶的被动「倾杯」被触发（受伤→摸 2 牌），实现与 2 技能的联动。
    applyDamage(state, player, player, 1, { skillKey: 'aquarius.massHeal', hpCost: true });
    log(state, messageTemplate`${player.name} 发动神酿，献祭 1 点生命`, player.id, 'skill');
    for (const candidate of state.players) {
      if (candidate.hp > 0 && candidate.hp < candidate.maxHp) heal(state, candidate, 1, player);
    }
    offerVirgoDiscipline(state, player, state.players.filter(isAlive));
    triggerSkillMetric(state, action.skillId);
    log(state, messageTemplate`${player.name} 发动神酿，所有角色回复 1 点生命`, player.id, 'skill');
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
    log(state, messageTemplate`${player.name} 发动观潮，弃 ${ids.length} 张牌，摸 ${ids.length} 张牌`, player.id, 'skill');
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
    offerVirgoDiscipline(state, player, targets);
    triggerSkillMetric(state, action.skillId);
    log(
      state,
      messageTemplate`${player.name} 对 ${first.name}、${second.name} 发动平潮，双方生命变为 ${average}`,
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
    const equipmentIndices = state.deck.flatMap((card, index) => card.kind === 'weapon' || card.kind === 'armor' ? [index] : []);
    if (equipmentIndices.length === 0) {
      log(state, messageTemplate`${player.name} 发动寻器但牌库中没有装备，资源返还`, player.id, 'skill');
      return;
    }
    const random = randomFloat(state.seed);
    state.seed = random.seed;
    const equipmentIndex = equipmentIndices[Math.floor(random.value * equipmentIndices.length)];
    for (const id of costIds) state.discard.push(takeCard(player, id));
    const equipment = state.deck.splice(equipmentIndex, 1)[0];
    player.hand.push(equipment);
    player.flags.usedSagittariusSeek = true;
    triggerSkillMetric(state, action.skillId);
    log(state, messageTemplate`${player.name} 发动寻器，获得 ${equipment.name}`, player.id, 'skill');
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
        log(state, messageTemplate`${player.name} 净化 ${target.name} 的全部异常状态`, player.id, 'skill');
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
    const peeked = arrangeScorpioPeek(state, player, action.topCardIds, action.bottomCardIds);
    player.flags.usedScorpioPeek = true;
    player.flags.scorpioPeekMissedWater = !peeked.some(card => card.element === 'water');
    return;
  }

  if (action.skillId === 'scorpio.freezeAoe') {
    if (player.characterId !== 'scorpio') throw new Error('只有天蝎可以发动蝎毒');
    if (player.flags.usedScorpioPoison) throw new Error('蝎毒每回合限一次');
    if (!action.targetId || target.id === player.id || target.hp <= 0 || target.eliminated) throw new Error('蝎毒需要指定一名其他存活角色');
    assertNotIceArmorBlocked(player, target);
    const ids = action.cardIds ?? [];
    const costs = ids.map(id => player.hand.find(card => card.id === id));
    if (ids.length !== 2 || new Set(ids).size !== 2 || costs.some(card => !card) || !costs.some(card => card?.element === 'water')) {
      throw new Error('蝎毒需要弃置两张不同手牌：1 张水牌和 1 张任意牌');
    }
    for (const id of ids) state.discard.push(takeCard(player, id));
    player.flags.usedScorpioPoison = true;
    triggerSkillMetric(state, action.skillId);
    log(state, messageTemplate`${player.name} 弃置 ${costs.map(card => card .name).join('、')} 对 ${target.name} 发动蝎毒`, player.id, 'skill');
    addStatus(state, target, 'frozen', 1);
    if (target.hand.length) queueSkillDecision(state, {kind:'scorpioPoisonTake',playerId:player.id,sourceId:player.id,targetId:target.id});
    else applyDamage(state, target, player, 1);
    return;
  }

  if (action.skillId === 'scorpio.spoils') {
    if (player.characterId !== 'scorpio') throw new Error('只有天蝎可以发动缴械');
    if (player.flags.usedScorpioSting) throw new Error('缴械每回合限一次');
    if (!action.targetId || target.id === player.id || !isAlive(target)) throw new Error('缴械需要指定一名其他存活角色');
    assertNotIceArmorBlocked(player, target);
    const cost = player.hand.find(card => card.id === action.cardIds [0]);
    if (!cost) throw new Error('缴械需要弃置自己的 1 张手牌');
    const options = scorpioDisarmOptions(player, target);
    const option = options.find(candidate => candidate.option === (action.option ?? (options[0]?.option === 'damage' ? 'damage' : undefined)));
    if (!option || (option.selectedCardId && action.selectedCardId !== option.selectedCardId)) throw new Error('缴械需要选择当前可转移的一项资源；护甲已满时不能选择护甲');
    state.discard.push(takeCard(player, cost.id));
    player.flags.usedScorpioSting = true;
    resolveScorpioDisarm(state, player, target, option.option);
    triggerSkillMetric(state, action.skillId);
    return;
  }

  if (action.skillId === 'capricorn.charge') {
    if (player.flags.usedCapricornChargeThisRound) throw new Error('山崩每轮一次');
    if (player.rage <= 0) throw new Error('山崩至少需要 1 点怒气');
    const option = action.option ?? 'single';
    if (option !== 'single' && option !== 'spread') throw new Error('山崩需要选择单体重击或分散打击');
    if (option === 'spread' && player.rage < 5) throw new Error('山崩分散打击至少需要 5 点怒气');
    const targetIds = action.targetIds ?? (option === 'spread' ? (action.targetId ? [action.targetId] : []) : [target.id]);
    const maxTargets = option === 'spread' ? 3 : 1;
    if (targetIds.length < 1 || targetIds.length > maxTargets || new Set(targetIds).size !== targetIds.length) {
      throw new Error(option === 'spread' ? '山崩分散打击需要选择 1 至 3 名不同目标' : '山崩单体重击只能选择 1 名目标');
    }
    if (action.targetId && action.targetId !== targetIds[0]) throw new Error('山崩首个目标与目标列表不一致');
    const chargeTargets = targetIds.map(id => findPlayer(state, id));
    for (const candidate of chargeTargets) {
      if (candidate.id === player.id || !isAlive(candidate)) throw new Error('山崩需要选择其他存活角色');
      assertNotIceArmorBlocked(player, candidate);
    }
    const distanceTarget = chargeTargets.find(candidate => skillNeedsDistanceCost(state, player, candidate, action.skillId));
    payDistanceCost(
      state,
      player,
      distanceTarget ?? chargeTargets[0],
      Boolean(distanceTarget),
      action.extraCostCardId,
      [],
    );
    const spent = player.rage;
    player.rage = 0;
    player.flags.usedCapricornChargeThisRound = true;
    const chargeTarget = chargeTargets[0];
    if (option === 'spread') {
      state.pendingCapricornSpread = {sourceId: player.id, targetIds: [...targetIds], discardSource: true};
    } else if (spent >= 5) {
      applyDamage(state, chargeTarget, player, 2, { sacredDamage: true, status:'silence' });
      state.discard.push(...player.hand.splice(0), ...chargeTarget.hand.splice(0));
      if (player.equipment.weapon) {
        state.discard.push(player.equipment.weapon);
        triggerEquipmentLeftOwner(state, player, player.equipment.weapon);
      }
      if (player.equipment.armor) {
        state.discard.push(player.equipment.armor);
        triggerEquipmentLeftOwner(state, player, player.equipment.armor);
      }
      if (chargeTarget.equipment.weapon) {
        state.discard.push(chargeTarget.equipment.weapon);
        triggerEquipmentLeftOwner(state, chargeTarget, chargeTarget.equipment.weapon);
      }
      if (chargeTarget.equipment.armor) {
        state.discard.push(chargeTarget.equipment.armor);
        triggerEquipmentLeftOwner(state, chargeTarget, chargeTarget.equipment.armor);
      }
      player.equipment = {};
      chargeTarget.equipment = {};
    } else if (spent >= 3) {
      applyDamage(state, chargeTarget, player, 1, { sacredDamage: true, status:'silence' });
      state.discard.push(...player.hand.splice(0));
    } else {
      addStatus(state, chargeTarget, 'silence', 1);
    }
    triggerSkillMetric(state, action.skillId);
    log(state, messageTemplate`${player.name} 消耗 ${spent} 怒发动山崩`, player.id, 'skill');
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
    totalCards: shuffled.items.length,
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
    log(state, messageTemplate`${firstPlayer.name} 抽到命运牌 ${openingFateCard.name}，确定${directionText}行动，并将命运牌交给末位 ${lastPlayer.name}`, firstPlayer.id, 'setup');
  }
  const first = findPlayer(state, state.activePlayerId);
  log(state, messageTemplate`星盘先确定出牌次序：${first.name} 先手；随后 8 秒内所有角色同时确认是否更换起手牌`, first.id, 'setup');
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
    totalCards: shuffled.items.length,
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
  log(state, messageTemplate`${boss.name} 的蚀月战令令其开局额外摸 2 张牌`, boss.id, 'infection');
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
      messageTemplate`初始感染者 ${boss.name}（摩羯座）公开并先手，抽到命运牌 ${openingFateCard.name}，确定${directionText}行动；命运牌交给末位 ${lastPlayer.name}`,
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
    delete state.pendingCapricornSpread;
    delete state.pendingSkillDecisions;
    delete state.pendingSkillResume;
    state.mulliganPendingPlayerIds = [];
    state.phase = 'gameOver';
    log(state, messageTemplate`${player.name} 确认投降，所在${isInfectionMode(state) ? '阵营' : '队伍'}认输`, player.id, 'gameOver');
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
    continueCapricornSpread(state);
    return { state, events: state.log.slice(0, state.log.length - beforeLogLength) };
  }
  if (state.pendingSkillDecisions?.length) {
    if (action.type !== 'resolveSkillDecision') {
      throw new Error('请先完成当前技能选择');
    }
    resolveSkillDecision(state, action);
    continueCapricornSpread(state);
    if (isInfectionMode(state)) checkInfectionVictory(state);
    settleDyingActivePlayer(state);
    return { state, events: state.log.slice(0, state.log.length - beforeLogLength) };
  }
  if (action.type === 'resolveSkillDecision') throw new Error('当前没有待处理的技能选择');

  if (action.type === 'mulligan') handleMulligan(state, action);

  if (action.type === 'drawPhase') {
    if (state.phase !== 'draw') throw new Error('Not in draw phase');
    const player = findPlayer(state, state.activePlayerId);
    if (player.characterId === 'scorpio' && !player.flags.usedScorpioPeek) {
      throw new Error('请先完成锁定技伏击，再进入摸牌阶段');
    }
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
      log(state, messageTemplate`${player.name} 可以选择是否发动断流`, player.id, 'skill');
    } else {
      endTurn(state, player);
    }
  }

  if (action.type === 'useSkill') handleSkill(state, action);

  continueCapricornSpread(state);
  if (isInfectionMode(state)) checkInfectionVictory(state);
  settleDyingActivePlayer(state);

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
    .filter((ally) => ally.hp < ally.maxHp && !isLeoHealingBlocked(state, ally) && !(isInfectionMode(state) && (ally.infected || isInfectedFaction(ally))))
    .sort((a, b) => (b.maxHp - b.hp) - (a.maxHp - a.hp))[0];
}

function firstCost(player             , predicate                         ) {
  return player.hand.find(predicate);
}

function aiSupportCosts(player             ) {
  const value = (card      ) => {
    if (card.kind === 'normalAttack' || card.kind === 'statusAttack') {
      return (canUseHandCard(player, card) && canUseBasicAttack(player) ? 4 : 0)
        + (card.kind === 'statusAttack' ? 1 : 0)
        + (player.characterId === 'cancer' && card.element === 'water' ? 1 : 0);
    }
    if (card.kind === 'weapon' || card.kind === 'armor') return 2;
    if (card.kind === 'energy') return 6;
    if (card.kind === 'aoe') return 5;
    return 4;
  };
  return player.hand.filter(card => card.kind !== 'sun' && card.kind !== 'moon'
    && !(card.kind === 'weapon' && !player.equipment.weapon)
    && !(card.kind === 'armor' && !player.equipment.armor))
    .sort((a, b) => value(a) - value(b));
}

function taurusSilenceHasValue(state           , source             ) {
  if (state.activePlayerId !== source.id || hasVirgoDomain(source) || source.statuses.shield || source.statuses.abnormalImmunity) return false;
  // Only public cooldowns, equipment and hand counts are used; enemy card identities stay hidden.
  const count = source.hand.length, flags = source.flags;
  if (source.equipment.weapon?.element === 'water' && !flags.usedWeaponConvert && count >= 2) return true;
  if (isInitialInfectionBoss(state, source) && !flags.usedInfectionBossCommand) return true;
  switch (source.characterId) {
    case 'aries': return !flags.usedAriesRam && count >= 1;
    case 'leo': return count >= 1 && (!flags.usedLeoRoar || !flags.usedLeoOrder);
    case 'sagittarius': return !flags.usedSagittariusSeek && count >= 2 && (!source.equipment.weapon || !source.equipment.armor);
    case 'gemini': return !flags.usedGeminiSteal && count >= 2;
    case 'libra': return !flags.usedLibraHarmony && count >= 1 && state.players.some(rich =>
      isAlive(rich) && state.players.some(poor => isAlive(poor) && poor.id !== rich.id && rich.hand.length - poor.hand.length >= 2));
    case 'aquarius': return !flags.usedAquariusMassHeal && count >= 2 && alliesOf(state, source.id).some(ally => ally.hp < ally.maxHp);
    case 'cancer': return !flags.usedCancerHeal && count >= 1 && alliesOf(state, source.id).some(ally => ally.hp < ally.maxHp);
    case 'scorpio': return (!flags.usedScorpioPoison && count >= 2) || (!flags.usedScorpioSting && count >= 1);
    case 'pisces': return count >= 1 && (!flags.usedPiscesObserveTide || !flags.usedPiscesBalance);
    case 'taurus': return !flags.usedTaurusArmor && count >= 1 && source.armor < source.maxArmor;
    case 'virgo': return !flags.usedVirgoPurify && count >= 1;
    case 'capricorn': return !flags.usedCapricornChargeThisRound && source.rage > 0;
  }
}

function chooseAiTaurusCounter(state           , player             , source                         )         {
  const decline         = {type:'resolveSkillDecision',playerId:player.id,activate:false,cardIds:[]};
  if (!source || !isAlive(player) || !isAlive(source) || sameFaction(state, source, player) || hasVirgoDomain(source)) return decline;
  const earthReduction = source.equipment.armor?.element === 'earth' && !source.flags.usedEarthArmorReductionThisRound;
  if (source.statuses.silence) {
    if (earthReduction && !source.statuses.shield) return decline;
  } else if (!taurusSilenceHasValue(state, source)) return decline;
  const costs = aiSupportCosts(player).filter(card => card.kind !== 'energy' && !(card.kind === 'ritual' && player.infected));
  const lethal = Boolean(source.statuses.silence && source.hp <= 1 && source.armor === 0 && !source.statuses.shield && !earthReduction);
  const cost = costs[0] ?? (lethal ? player.hand.find(card => card.kind === 'weapon' || card.kind === 'armor') : undefined);
  return cost ? {...decline,activate:true,cardIds:[cost.id]} : decline;
}

function aquariusAiBrewCosts(state           , player             ) {
  const costs = aiSupportCosts(player);
  const air = costs.find(card => card.element === 'air');
  const other = costs.find(card => card.id !== air?.id && card.element === 'air')
    ?? costs.find(card => card.id !== air?.id);
  if (!air || !other) return undefined;
  const canRecover = (target             ) => !isLeoHealingBlocked(state, target)
    && !(isInfectionMode(state) && (target.infected || isInfectedFaction(target)));
  const selfCanRecover = canRecover(player);
  const beforeSacrifice = selfCanRecover && other.element === 'air' ? Math.min(player.maxHp, player.hp + 1) : player.hp;
  if (beforeSacrifice <= 1) return undefined;
  const afterSacrifice = beforeSacrifice - 1;
  const afterBrew = selfCanRecover ? Math.min(player.maxHp, afterSacrifice + 1) : afterSacrifice;
  // Compare visible health changes; a point of recovery at one HP has greater urgency.
  let benefit = (afterBrew - player.hp) * (player.hp === 1 ? 2 : 1);
  for (const target of state.players) {
    if (target.id === player.id || !isAlive(target) || target.hp >= target.maxHp || !canRecover(target)) continue;
    benefit += (sameFaction(state, player, target) ? 1 : -1) * (target.hp === 1 ? 2 : 1);
  }
  return benefit > 0 ? [air.id, other.id] : undefined;
}

function chooseAiCapricornCharge(state           , player             , lethalOnly         )                     {
  if (player.rage < 3 || player.flags.usedCapricornChargeThisRound) return undefined;
  const damage = player.rage >= 5 ? 2 : 1;
  const targets = aiHostilePlayers(state, player)
    .filter(target => !isIceArmorBlocked(player, target) && !target.statuses.shield)
    .sort((a, b) => a.hp - b.hp);
  for (const target of targets) {
    const lethal = target.hp <= damage;
    if (lethalOnly && !lethal) continue;
    const needsCost = skillNeedsDistanceCost(state, player, target, 'capricorn.charge');
    const extraCost = needsCost
      ? aiSupportCosts(player)[0] ?? player.hand.find(card => card.kind !== 'sun' && card.kind !== 'moon') ?? (lethal ? player.hand[0] : undefined)
      : undefined;
    if (needsCost && !extraCost) continue;
    const remainingHand = player.hand.filter(card => card.id !== extraCost?.id);
    if (!lethal) {
      if (remainingHand.some(card => card.kind === 'sun' || card.kind === 'moon')) continue;
      if (player.rage < 5 && remainingHand.length > 0) continue;
      const ownResources = remainingHand.length + Number(Boolean(player.equipment.weapon)) + Number(Boolean(player.equipment.armor));
      const enemyResources = target.hand.length + Number(Boolean(target.equipment.weapon)) + Number(Boolean(target.equipment.armor));
      if (player.rage >= 5 && ownResources > enemyResources) continue;
    }
    return { type: 'useSkill', playerId: player.id, skillId: 'capricorn.charge', targetId: target.id,
      ...(extraCost ? { extraCostCardId: extraCost.id } : {}) };
  }
  return undefined;
}

function chooseAiAquariusChalice(state           , player             )                                                  {
  const decline                                                  = {
    type: 'resolveSkillDecision', playerId: player.id, activate: false,
  };
  if (!isAlive(player)) return decline;
  const ownHand = [...player.hand];
  const cardIds           = [];
  const targetIds           = [];
  const selectedCardIds           = [];
  const isFate = (card      ) => card.kind === 'sun' || card.kind === 'moon';
  const allies = state.players
    .filter(target => target.id !== player.id && isAlive(target) && sameFaction(state, player, target))
    .map(target => ({target, element: CHARACTERS[target.characterId].element, hand: [...target.hand]}));

  // 队友手牌可见：先送同系牌，再按队友属性确定取牌优先级。
  while (cardIds.length < 2) {
    let best                                                                                                   ;
    for (const ally of allies) {
      const giveIndex = ownHand.findIndex(card => card.element === ally.element);
      if (giveIndex < 0) continue;
      for (let takeIndex = 0; takeIndex < ally.hand.length; takeIndex += 1) {
        const take = ally.hand[takeIndex];
        const priority = ally.element === 'air'
          ? take.element !== 'air' && !isFate(take) ? 1 : 2
          : take.element === 'air' || isFate(take) ? 0 : take.element !== ally.element ? 1 : 2;
        if (!best || priority < best.priority) best = {ally, giveIndex, takeIndex, priority};
      }
    }
    if (!best) break;
    const [give] = ownHand.splice(best.giveIndex, 1);
    const [take] = best.ally.hand.splice(best.takeIndex, 1);
    cardIds.push(give.id);
    targetIds.push(best.ally.target.id);
    selectedCardIds.push(take.id);
  }

  // 敌方只用公开属性与手牌数量筛选；具体取回哪张牌交给引擎随机决定。
  const enemies = state.players.filter(target => target.id !== player.id && isAlive(target) && !sameFaction(state, player, target));
  while (cardIds.length < 2) {
    let found = false;
    for (const enemy of enemies) {
      const count = targetIds.filter(id => id === enemy.id).length;
      if (count >= enemy.hand.length) continue;
      const element = CHARACTERS[enemy.characterId].element;
      const giveIndex = ownHand.findIndex(card =>
        ['normalAttack', 'statusAttack', 'energy', 'ritual'].includes(card.kind) &&
        Boolean(card.element) && card.element !== 'air' && card.element !== element);
      if (giveIndex < 0) continue;
      const [give] = ownHand.splice(giveIndex, 1);
      cardIds.push(give.id);
      targetIds.push(enemy.id);
      selectedCardIds.push('');
      found = true;
      break;
    }
    if (!found) break;
  }
  return cardIds.length ? {...decline, activate: true, cardIds, targetIds, selectedCardIds} : decline;
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
      isLeoHealingBlocked(state, findPlayer(state, pending.targetId)) ||
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
    if (!isAlive(cancer)) continue;
    if (cancer.flags.usedCancerRescueThisRound) continue;
    if (state.activePlayerId === cancer.id) continue;
    const water = cancer.hand.find((card) => card.element === 'water');
    if (!water) continue;
    const dyingAlly = state.players
      .find((ally) => sameFaction(state, ally, cancer) && ally.id !== cancer.id && ally.hp <= 0 && !ally.eliminated && !isLeoHealingBlocked(state, ally));
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
    const card = player.hand.find(card => card.kind === 'sun' || (card.kind === 'energy' && !isLeoHealingBlocked(state, target)));
    if (card) return {type:'playCard',playerId:player.id,cardId:card.id,targetId:target.id,mode:'rescue'};
    const water = player.hand.find(card => card.element === 'water');
    if (player.characterId === 'cancer' && water && !isLeoHealingBlocked(state, target)) return {type:'useSkill',playerId:player.id,skillId:'cancer.rescue',targetId:target.id,cardIds:[water.id]};
    return {type:'skipRescue',playerId:player.id};
  }
  if (isInfectionMode(state) || state.phase !== 'gameOver' || state.winnerTeamId || state.winnerId) return undefined;
  const defeatedTeams = defeatedTeamIds(state);
  for (const player of state.players) {
    if (player.control !== 'ai' || player.eliminated || !defeatedTeams.includes(player.teamId)) continue;
    const target = state.players.find((candidate) =>
      candidate.id === player.id && candidate.hp <= 0 && !candidate.eliminated
    ) ?? state.players.find((candidate) =>
      candidate.teamId === player.teamId && candidate.hp <= 0 && !candidate.eliminated
    );
    if (!target) continue;
    const rescueCard = player.hand.find(card => card.kind === 'sun' || (card.kind === 'energy' && !isLeoHealingBlocked(state, target)));
    if (!rescueCard) continue;
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

function scorpioPoisonHasEffect(target             ) {
  return target.hand.length > 0 || !hasVirgoDomain(target);
}

function scorpioAiSkillCost(player             , poison         , reservedIds           = []) {
  const priority = (card      ) => {
    if (card.kind === 'weapon') return player.equipment.weapon ? 65 : 100;
    if (card.kind === 'armor') return player.equipment.armor ? 65 : 100;
    if (card.kind === 'aoe') return 80;
    if (card.kind === 'utility') return 70;
    if (card.kind === 'energy' || card.kind === 'ritual') return player.hp <= 1 ? 85 : 35;
    if (card.kind === 'statusAttack' && card.element === 'water' && player.flags.basicAttackCount === 0 && !player.statuses.frozen) return 75;
    return (card.kind === 'statusAttack' ? 25 : 10) + (!poison && card.element === 'water' ? 20 : 0);
  };
  return player.hand
    .filter(card => card.kind !== 'sun' && card.kind !== 'moon' && !reservedIds.includes(card.id) && (!poison || card.element === 'water'))
    .sort((first, second) => priority(first) - priority(second))[0];
}

function scorpioAiDisarm(state           , player             , target             , reservedIds           = [])                     {
  if (player.flags.usedScorpioSting) return undefined;
  const cost = scorpioAiSkillCost(player, false, reservedIds);
  if (!cost) return undefined;
  const options = scorpioDisarmOptions(player, target);
  const choice = options.find(option => option.option === 'shield' && !player.statuses.shield)
    ?? options.find(option => option.option === 'weapon' && !player.equipment.weapon)
    ?? options.find(option => option.option === 'armorEquipment' && !player.equipment.armor)
    ?? options.find(option => option.option === 'armor')
    ?? options.find(option => option.option !== 'damage' || !hasVirgoDomain(target));
  return choice ? {type:'useSkill',playerId:player.id,skillId:'scorpio.spoils',targetId:target.id,cardIds:[cost.id],...choice} : undefined;
}

function chooseAiAdditionalSkill(state           , player             )                     {
  const enemies = aiHostilePlayers(state, player).filter(target => !isIceArmorBlocked(player, target));
  const enemy = enemies.sort((a, b) => a.hp - b.hp)[0];
  const allies = state.players.filter(target => isAlive(target) && sameFaction(state, player, target));
  const costs = player.hand.filter(card => card.kind !== 'sun' && card.kind !== 'moon');
  const use = (skillId        , extra                                                 = {})         => ({
    type: 'useSkill', playerId: player.id, skillId, ...extra,
  });

  if (player.equipment.weapon?.element === 'air' && !player.flags.usedWindCompass && player.flags.usedCardElements.length >= 2) {
    const element = state.deck.find(card => card.element === CHARACTERS[player.characterId].element)?.element
      ?? state.deck.find(card => card.element)?.element;
    if (element) return use('weapon.airCompass', { option: element });
  }
  if (player.characterId === 'virgo' && !player.flags.usedVirgoPurify) {
    const earth = costs.find(card => card.element === 'earth');
    const target = allies.find(target => target.infected || NORMAL_ABNORMAL_STATUSES.some(status => target.statuses[status]));
    if (earth && target) return use('virgo.purify', { targetId: target.id, cardIds: [earth.id], ...(target.infected ? { option: 'infection' } : {}) });
  }
  if (player.characterId === 'gemini' && !player.flags.usedGeminiSteal && enemy && (costs.length >= 2 || (costs.length && player.hp > 1))) {
    const selected = enemy.equipment.weapon ?? enemy.equipment.armor ?? enemy.hand[0];
    return use('gemini.steal', { targetId: enemy.id, cardIds: costs.slice(0, 2).map(card => card.id), ...(selected ? { selectedCardId: selected.id } : {}) });
  }
  if (player.characterId === 'scorpio' && !player.flags.usedScorpioSting) {
    for (const target of enemies) {
      const action = scorpioAiDisarm(state, player, target);
      if (action) return action;
    }
  }
  if (player.characterId === 'aries' && !player.flags.usedAriesRam && !player.flags.usedAriesBurnSoul && enemy) {
    const cost = costs.find(card => card.element !== 'fire' && (card.kind === 'normalAttack' || card.kind === 'statusAttack'));
    if (cost) {
      const action = use('aries.ram', { targetId: enemy.id, cardIds: [cost.id] });
      const paid = withDistanceCost(action, state, player, enemy, skillNeedsDistanceCost(state, player, enemy, 'aries.ram'), [cost.id]);
      if (paid) return paid;
    }
  }
  if (player.characterId === 'libra' && !player.flags.usedLibraHarmony) {
    const air = costs.filter(card => card.element === 'air');
    for (const rich of enemies) {
      for (const poor of allies.filter(target => target.id !== player.id)) {
        const count = Math.floor((rich.hand.length - poor.hand.length) / 2);
        if (count > 0 && air.length >= count) return use('libra.harmony', {
          targetIds: [rich.id, poor.id], cardIds: air.slice(0, count).map(card => card.id),
          selectedCardIds: rich.hand.slice(0, count).map(card => card.id),
        });
      }
    }
  }
  if (player.characterId === 'pisces' && !player.flags.usedPiscesBalance) {
    const water = costs.filter(card => card.element === 'water');
    for (const target of enemies) {
      const ally = allies.find(ally => target.hp > ally.hp && target.hp - ally.hp <= water.length);
      if (ally) return use('pisces.balance', { targetIds: [ally.id, target.id], cardIds: water.slice(0, target.hp - ally.hp).map(card => card.id) });
    }
  }
  if (player.characterId === 'sagittarius' && !player.flags.usedSagittariusSeek && (!player.equipment.weapon || !player.equipment.armor)) {
    const fire = costs.find(card => card.element === 'fire');
    const other = costs.find(card => card.id !== fire?.id);
    if (fire && other && state.deck.some(card => card.kind === 'weapon' || card.kind === 'armor')) {
      return use('sagittarius.seekEquipment', { cardIds: [fire.id, other.id] });
    }
  }
  if (player.characterId === 'leo' && !player.flags.usedLeoOrder && enemy && costs.length) {
    return use('leo.order', { targetId: enemy.id, cardIds: [costs[0].id] });
  }
  if (player.equipment.weapon?.element === 'water' && !player.flags.usedWeaponConvert && costs.length >= 2) {
    const attack = costs.find(card => isAttackCard(card) && canUseHandCard(player, card) &&
      (card.kind === 'aoe' || canUseBasicAttack(player)));
    const armor = costs.find(card => card.kind === 'armor' && player.armor < player.maxArmor);
    const weapon = costs.find(card => card.kind === 'weapon');
    const first = enemy ? attack ?? armor ?? weapon : armor ?? weapon;
    const second = first && (costs.find(card => card.id !== first.id && isAttackCard(card) && attack)
      ?? costs.find(card => card.id !== first.id));
    if (first && second && (attack || (!isAttackCard(first) && !isAttackCard(second)))) {
      return use('weapon.waterCodex', { cardIds: [first.id, second.id] });
    }
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
    if (skillDecision.kind === 'sagittariusResupply') {
      const target = state.players.filter(candidate => isAlive(candidate) && sameFaction(state, player, candidate))
        .sort((a, b) => Math.max(0, Math.min(4, b.maxHp) - b.hand.length) - Math.max(0, Math.min(4, a.maxHp) - a.hand.length) ||
          Number(b.id === player.id) - Number(a.id === player.id) || a.hp / a.maxHp - b.hp / b.maxHp)[0];
      const activate = isAlive(player) && Boolean(target && target.hand.length < Math.min(4, target.maxHp));
      return {type: 'resolveSkillDecision', playerId: player.id, activate, targetId: activate ? target .id : undefined};
    }
    if (skillDecision.kind === 'scorpioEndPeek') {
      return { type: 'resolveSkillDecision', playerId: player.id, activate: true, ...scorpioWaterPeekOrder(state) };
    }
    if (skillDecision.kind === 'scorpioPoisonTake') {
      const target = findPlayer(state, skillDecision.targetId );
      const value = (card      ) => card.kind === 'sun' ? 100 : card.kind === 'moon' ? 95 :
        card.kind === 'weapon' ? (player.equipment.weapon ? 55 : 85) :
        card.kind === 'armor' ? (player.equipment.armor ? 55 : 85) :
        card.element === 'water' ? 75 : card.kind === 'aoe' ? 65 : card.kind === 'utility' ? 60 : 30;
      const selected = [...target.hand].sort((a,b) => value(b)-value(a))[0];
      return {type:'resolveSkillDecision',playerId:player.id,activate:true,selectedCardId:selected?.id};
    }
    const preferredTarget = aiHostilePlayers(state, player)
      .find((candidate) => !isIceArmorBlocked(player, candidate));
    // Judgment is mandatory and permits self-targeting even when all enemies
    // are protected. Optional hostile skills may instead be declined.
    const judgmentTarget = preferredTarget ?? [player, ...state.players]
      .find((candidate) => isAlive(candidate) && !isIceArmorBlocked(player, candidate));

    if (skillDecision.kind === 'taurusGuardSetup') {
      const previous = state.players.find(candidate => candidate.id === player.flags.taurusGuardTargetId && isAlive(candidate) && sameFaction(state, candidate, player));
      const target = state.players.filter(candidate => candidate.id !== player.id && isAlive(candidate) && sameFaction(state, candidate, player)).sort((a,b) => a.hp-b.hp)[0];
      const cost = player.hand[0];
      const activate = !previous && Boolean(target && cost);
      return {type:'resolveSkillDecision',playerId:player.id,activate,targetId:activate?target.id:undefined,cardIds:activate?[cost.id]:[]};
    }
    if (skillDecision.kind === 'taurusGuard') {
      const target = state.players.find(candidate => candidate.id === skillDecision.targetId);
      return {type:'resolveSkillDecision',playerId:player.id,activate:isAlive(player) && Boolean(target && sameFaction(state, player, target))};
    }
    if (skillDecision.kind === 'taurusThickSkin') {
      const source = state.players.find(candidate => candidate.id === skillDecision.sourceId);
      return chooseAiTaurusCounter(state, player, source);
    }

    if (skillDecision.kind === 'virgoDiscipline') {
      const source = state.players.find(candidate => candidate.id === skillDecision.sourceId);
      return { type: 'resolveSkillDecision', playerId: player.id, activate: Boolean(source && isAlive(source) && !sameFaction(state, player, source)) };
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
      return chooseAiAquariusChalice(state, player);
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

  if (state.phase === 'draw') {
    if (player.characterId === 'taurus' && !player.flags.taurusGuardSetupDone && !isSilencedInOwnActionTurn(state, player)) {
      return {type:'useSkill',playerId:player.id,skillId:'taurus.guard'};
    }
    if (player.characterId === 'scorpio' && !player.flags.usedScorpioPeek) {
      return { type: 'useSkill', playerId: player.id, skillId: 'scorpio.peek', ...scorpioWaterPeekOrder(state) };
    }
    return { type: 'drawPhase' };
  }
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

  if (canUseActiveSkill && player.characterId === 'scorpio' && !player.flags.usedScorpioPoison && outputEnemy) {
    const water = scorpioAiSkillCost(player, true);
    const extra = water && scorpioAiSkillCost(player, false, [water.id]);
    const target = aiHostilePlayers(state, player)
      .filter(candidate => !isIceArmorBlocked(player, candidate) && scorpioPoisonHasEffect(candidate))
      .sort((first, second) => first.hp - second.hp || first.hand.length - second.hand.length)[0];
    if (water && extra && target) {
      const opening = target.statuses.shield && scorpioAiDisarm(state, player, target, [water.id, extra.id]);
      if (opening) return opening;
      return {type:'useSkill',playerId:player.id,skillId:'scorpio.freezeAoe',targetId:target.id,cardIds:[water.id, extra.id]};
    }
  }

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
    const cost = aiSupportCosts(player)[0];
    if (ally && cost) return { type: 'useSkill', playerId: player.id, skillId: 'cancer.heal', targetId: ally.id, cardIds: [cost.id] };
  }

  if (canUseActiveSkill && player.characterId === 'aquarius' && !player.flags.usedAquariusMassHeal) {
    const cardIds = aquariusAiBrewCosts(state, player);
    if (cardIds) {
      return { type: 'useSkill', playerId: player.id, skillId: 'aquarius.massHeal', targetId: enemy.id, cardIds };
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
      .filter((candidate) => !candidate.statuses.burn && !isIceArmorBlocked(player, candidate))
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

  if (canUseActiveSkill && player.characterId === 'capricorn') {
    const charge = chooseAiCapricornCharge(state, player, true);
    if (charge) return charge;
  }

  if (canUseActiveSkill) {
    const additionalSkill = chooseAiAdditionalSkill(state, player);
    if (additionalSkill) return additionalSkill;
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
      canUseHandCard(player, candidate) && canUseBasicAttack(player),
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

  if (canUseActiveSkill && player.characterId === 'pisces' && !player.flags.usedPiscesObserveTide) {
    const cards = player.hand.filter(card => card.kind !== 'sun' && card.kind !== 'moon');
    if (cards.length) return { type: 'useSkill', playerId: player.id, skillId: 'pisces.observeTide', cardIds: cards.map(card => card.id) };
  }
  if (canUseActiveSkill && player.characterId === 'capricorn') {
    const charge = chooseAiCapricornCharge(state, player, false);
    if (charge) return charge;
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
    log(next, messageTemplate`AI 托管停止：${error instanceof Error ? error.message : String(error)}`, next.activePlayerId, 'ai');
    return { state: next, events: next.log.slice(0, next.log.length - input.log.length) };
  }
}

export function applyActionWithAi(state           , action        )                                            {
  const result = applyAction(state, action);
  const settled = applyAiActions(result.state);
  return { state: settled.state, events: [...result.events, ...settled.events] };
}
