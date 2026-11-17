                                                  
import {applyAction as reduceAction,applySingleAiAction as reduceAi,chooseAiAction} from '../game/engine.mjs?v=web-707d5b82f1a73e9b';

/** Display-only, public source/targets. Never stored in the game or checkpoint. */
                                                                                                                                 
const guides=new WeakMap                       ();
let sequence=0;
const targetedSkills=new Set(['aries.ram','leo.roar','leo.order','cancer.heal','cancer.rescue',
  'gemini.steal','libra.harmony','pisces.balance','virgo.purify','scorpio.freezeAoe','scorpio.spoils','capricorn.charge']);
const targetedDecisions=new Set(['taurusThickSkin','virgoDiscipline','aquariusWindCut','libraJudgment',
  'libraPerfectJudgment','sagittariusResupply']);

function remember(before          ,after          ,action       ){
 const previous=guides.get(before);if(previous)guides.set(after,previous);
 let sourceId='',targets         =[],kind                    ='skill';
 if(action.type==='playCard'){
  const display=after.playedCards?.cards.findLast(item=>item.playerId===action.playerId&&item.card.id===action.cardId);
  if(display){sourceId=action.playerId;targets=display.targetIds??(display.targetId?[display.targetId]:[]);kind='card';}
 }else if(action.type==='useSkill'&&targetedSkills.has(action.skillId)){
  sourceId=action.playerId;targets=action.targetIds??(action.targetId?[action.targetId]:[]);
 }else if(action.type==='useSkill'&&action.skillId==='aquarius.massHeal'){
  sourceId=action.playerId;targets=before.players.filter(p=>p.hp>0&&!p.eliminated).map(p=>p.id);
 }else if(action.type==='resolveSkillDecision'&&action.activate){
  const decision=before.pendingSkillDecisions?.[0];
  if(decision?.kind==='taurusGuard'&&after.pendingAttack){
   sourceId=after.pendingAttack.sourceId;targets=after.pendingAttack.targetIds;kind='card';
  }else if(decision&&targetedDecisions.has(decision.kind)){
   sourceId=action.playerId;
   targets=action.targetIds??(action.targetId?[action.targetId]:decision.targetId?[decision.targetId]:decision.sourceId?[decision.sourceId]:[]);
  }
 }
 // Deliberately omit private deck arrangement and hand-exchange choices/costs.
 targets=[...new Set(targets)].filter(id=>id!==sourceId&&before.players.some(p=>p.id===id));
 if(!sourceId||!targets.length||!before.players.some(p=>p.id===sourceId))return;
 const createdAt=Date.now();guides.set(after,{id:`${createdAt}-${++sequence}`,sourceId,targetIds:targets,kind,createdAt,expiresAt:createdAt+1800});
}
export function combatGuideFor(state          )                  {
 const guide=guides.get(state);return guide?{...guide,targetIds:[...guide.targetIds]}:null;
}
export function applyActionWithGuide(state          ,action       )                                {
 const result=reduceAction(state,action);remember(state,result.state,action);return result;
}
export function applySingleAiActionWithGuide(state          )                            {
 const action=chooseAiAction(structuredClone(state));
 const result=reduceAi(state);
 // The original reducer still owns AI selection, errors, and every rule outcome.
 if(action&&result.state!==state&&!result.events.some(entry=>entry.type==='ai'))remember(state,result.state,action);
 return result;
}
