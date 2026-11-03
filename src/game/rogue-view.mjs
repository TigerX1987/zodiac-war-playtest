                                           
import {CHARACTERS} from '../content/characters.mjs?v=web-2f8ee550364ff823';

/** Private projection for the existing local card-table client. */
export function rogueTableView(input           , viewerId        )            {
  if(input.mode!=='rogue') return input;
  const state=structuredClone(input);
  const viewer=input.players.find(p=>p.id===viewerId);
  const decision=input.pendingSkillDecisions?.[0];
  state.seed=0;
  const canPeek=viewer?.rogue?.skills.includes('scorpio.peek') && input.activePlayerId===viewerId &&
    ((input.phase==='draw'&&!viewer.flags.usedScorpioPeek)||decision?.playerId===viewerId&&decision.kind==='scorpioEndPeek');
  const count=input.players.length>=5?5:input.players.length===4?4:3;
  state.deck=state.deck.map((c,i)=>canPeek&&i<count?c:({id:`deck-${i}`,name:'牌堆',kind:'hidden'}       ));
  const r=state.rogue ;
  r.rewards=[];r.growthQueue=[];r.opening=[];r.factionQueue=[];
  if(r.pending?.playerId!==viewerId && r.pending) r.pending={...r.pending,offer:[]};
  for(const p of state.players) {
    if(p.id===viewerId)continue;
    const privateHand=!input.pendingRescue&&decision?.playerId===viewerId&&decision.targetId===p.id&&['rogueSteal','scorpioPoisonTake'].includes(decision.kind);
    if(!privateHand)p.hand=p.hand.map((_,i)=>({id:`hidden:${p.id}:${i}`,name:'隐藏手牌',kind:'hidden'}       ));
    const revealed=p.rogue .revealed;
    const original=p.characterId;
    (p       ).rogueElement=p.rogue .elementRevealed?CHARACTERS[original].element:undefined;
    (p       ).roguePortrait= revealed[0]?.split('.')[0];
    p.characterId=`rogue-${p.id}`       ;
    p.rogue={pools:[],skills:[...revealed],revealed:[...revealed],elementRevealed:p.rogue .elementRevealed,faction:p.rogue .faction};
    p.rage=revealed.includes('capricorn.unyielding')?p.rage:0;
    // Public statuses/equipment are retained; private skill counters are not.
    // Counters already present for every role do not reveal ownership. Retain
    // their shape for shared targeting UI and public persistent effects.
  }
  if(decision?.playerId!==viewerId) state.pendingSkillDecisions=state.pendingSkillDecisions?.map(d=>({kind:d.kind,playerId:d.playerId}));
  state.log=state.log.map(e=>e.playerId!==viewerId&&e.message.includes('查看牌堆顶')?{type:e.type,playerId:e.playerId,message:'其他玩家发动窥星，私密整理牌堆'}:e);
  return state;
}

/** Resolve opaque card-back selections only for the legitimate discard decision. */
export function resolveRogueHiddenCards(state           , action     ) {
  if(state.mode!=='rogue'||!action.cardIds?.some((id        )=>id.startsWith('hidden:')))return action;
  const d=state.pendingSkillDecisions?.[0];
  if(action.type!=='resolveSkillDecision'||d?.kind!=='aquariusWindCut'||d.playerId!==action.playerId)throw Error('当前不能选择隐藏手牌');
  const target=state.players.find(p=>p.id===action.targetId);
  return {...action,cardIds:action.cardIds.map((id        )=>{
    const match=/^hidden:(p\d+):(\d+)$/.exec(id);
    if(!match||match[1]!==target?.id||!target.hand[Number(match[2])])throw Error('目标手牌已变化，请重新选择');
    return target.hand[Number(match[2])].id;
  })};
}
