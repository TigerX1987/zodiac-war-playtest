import { createBaseDeck } from '../content/cards.mjs?v=web-2ef96cd1fdaac619';
import { applyAction, createGame } from './engine.mjs?v=web-2ef96cd1fdaac619';
                                                     

// Fixed teaching checkpoints use the production engine, not simulated HP changes.
export const TUTORIAL_STEPS = ['welcome', 'attack', 'attack-result', 'defense', 'defense-result', 'skill', 'skill-result', 'rescue', 'rescue-result', 'practice', 'finish']         ;
                                                         
                                                      

const teachingCard = (id        ) => {
  const card = createBaseDeck().find(candidate => candidate.id === id);
  if (!card) throw new Error('Unknown tutorial card: ' + id);
  return { ...card };
};

export function createTutorialCheckpoint(step              )            {
  let state = createGame({ seed: 42, characters: ['aries', 'cancer', 'gemini', 'capricorn'], controls: ['human', 'ai', 'ai', 'ai'] });
  state.phase = 'main';
  state.activePlayerId = 'p1';
  state.firstTurn = false;
  state.mulliganPendingPlayerIds = [];
  state.log = [];
  state.players.forEach(player => { player.hand = []; player.armor = 0; player.equipment = {}; player.statuses = {}; });
  const self = state.players[0];
  const enemy = state.players[3];
  self.hand = ['fire-normal-1', 'air-normal-1', 'water-normal-1', 'sun'].map(teachingCard);
  if (step === 'skill') enemy.hp -= 1;
  if (step === 'defense') {
    state.activePlayerId = enemy.id;
    enemy.hand = [teachingCard('air-normal-2')];
  }
  if (step === 'rescue') {
    state.activePlayerId = enemy.id;
    state.players[1].hp = 1;
    enemy.hand = [teachingCard('air-normal-2')];
  }
  const dealt = new Set(state.players.flatMap(player => player.hand.map(card => card.id)));
  state.deck = createBaseDeck().filter(card => !dealt.has(card.id));
  if (step === 'defense' || step === 'rescue') {
    state = applyAction(state, { type: 'playCard', playerId: enemy.id, cardId: 'air-normal-2', targetId: step === 'defense' ? self.id : 'p2' }).state;
    if (step === 'rescue') state = applyAction(state, { type: 'skipDefense', playerId: 'p2' }).state;
  }
  return state;
}

export function nextTutorialCheckpoint(progress                  ) {
  const following                                              = { welcome: 'attack', 'attack-result': 'defense', 'defense-result': 'skill', 'skill-result': 'rescue', 'rescue-result': 'practice' };
  const next = following[progress.step];
  if (!next) throw new Error('请先完成当前教学操作');
  const step = next                ;
  return { progress: { step }, state: createTutorialCheckpoint(step) };
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
  return { state: result, progress: { step: (step === 'practice' ? 'finish' : step + '-result')                 } };
}
