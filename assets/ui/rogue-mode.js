/* Local roguelike presentation, sharing the published lobby and TabletopV10. */
(() => {
  const lobby=document.getElementById('startScreen'),modeArea=lobby?.querySelector('.mode-area');
  if(modeArea){modeArea.classList.add('rogue-lobby-mode-tray');lobby.insertBefore(modeArea,lobby.querySelector('.action-dock'));}
  const isRogue=()=>state?.mode==='rogue';
  const factionNames={fire:'火之势力',water:'水之势力',air:'风之势力',earth:'土之势力',outcast:'离誓者'};
  const oldEntries=characterSkillEntries;
  characterSkillEntries=function(player){
    if(!player?.rogue)return oldEntries(player);
    return player.rogue.skills.map(id=>({id,label:skillDescriptions[id]?.name||id,description:skillDescriptions[id]?.summary||skillDescriptions[id]?.text||''}));
  };
  const oldFormat=formatLogMessage;
  formatLogMessage=function(message){return isRogue()?String(message||''):oldFormat(message)};
  const oldVisual=characterVisual;
  characterVisual=function(player){
    if(!isRogue()||!player?.rogue)return oldVisual(player);
    const element=player.id===localHumanPlayerId?CHARACTER_ELEMENTS[player.characterId]:player.rogueElement;
    return {name:player.name,className:element?ELEMENT_VISUALS[element].className:'rogueUnknown',elementLabel:element?ELEMENT_VISUALS[element].label:'未揭示',sigil:element?'✦':'✧'};
  };
  const oldIdentity=TabletopV10.identity;
  TabletopV10.identity=function(player){
    if(!isRogue())return oldIdentity.call(this,player);
    const faction=player.rogue?.faction;
    return (factionNames[faction]||(player.rogue?.elementRevealed?'势力待选':'身份未亮明'))+(player.eliminated?' · 已淘汰':'');
  };
  const oldPortrait=TabletopV10.portrait;
  TabletopV10.portrait=function(player,self=false){
    if(!isRogue())return oldPortrait.call(this,player,self);
    const own=player.id===localHumanPlayerId;
    const zodiac=own&&player.rogue.skills.length?player.characterId:player.roguePortrait;
    if(zodiac)return oldPortrait.call(this,{...player,characterId:zodiac},self);
    return '<div class="rogue-hidden-portrait"><img class="v10-person-image" src="/zodiac-war-playtest/assets/ui/card-back.jpg" alt="尚未揭示的星座旅者"></div>';
  };
  const oldPlayerCard=TabletopV10.playerCard;
  const oldHeader=TabletopV10.header;
  TabletopV10.header=function(){const html=oldHeader.call(this);return isRogue()?html.replace('测试 ·','星座乱斗 ·'):html;};
  TabletopV10.playerCard=function(player,...args){
    const html=oldPlayerCard.call(this,player,...args);
    if(!isRogue())return html;
    const oldName=safeText(labels[player.characterId]||'');
    return html.replace('<strong>'+oldName+'</strong>','<strong>'+safeText(player.name)+'</strong>');
  };
  const oldDisabled=isSkillDisabled;
  isSkillDisabled=function(player,id,canAct){
    if(isRogue()&&id.split('.')[0] in CHARACTER_ELEMENTS&&!player.rogue.skills.includes(id))return true;
    if(isRogue()&&state.rogue.pending&&!infoOnlySkills.has(id))return true;
    if(isRogue()&&id==='aries.burnSoul'&&!clientOwnsSkill(player,'aries.ram'))return true;
    return oldDisabled(player,id,canAct);
  };
  const oldEquipment=canActivateEquipmentSkill;
  canActivateEquipmentSkill=function(player,id){
    if(isRogue()&&id==='weapon.airCompass')return Boolean(!state.rogue.pending&&!state.pendingSkillDecisions?.length&&player?.id===localHumanPlayerId&&!setupPaused&&state.activePlayerId===player.id&&state.phase==='main'&&!player.statuses?.silence&&player.equipment.weapon?.element==='air'&&!player.flags.usedWindCompass&&new Set(player.flags.usedCardElements).size>=2&&state.deck.length);
    return oldEquipment(player,id);
  };
  const oldHuman=humanDecisionPlayer;
  humanDecisionPlayer=function(...args){
    if(isRogue())return state.players.find(p=>p.id===localHumanPlayerId);
    return oldHuman(...args);
  };
  const oldPrompt=actionPrompt;
  actionPrompt=function(...args){
    if(isRogue()&&state.rogue.pending){const pending=state.rogue.pending,p=state.players.find(p=>p.id===pending.playerId);return p.name+'正在'+({opening:'选择初始技能',openingExtra:'选择先手额外技能',growth:'选择成长技能',loot:'领取击杀奖励',faction:'亮明身份并选择势力'}[pending.kind]||'选择技能');}
    return oldPrompt(...args);
  };
  const oldControls=renderTableControls;
  renderTableControls=function(...args){return isRogue()&&state.rogue.pending?'':oldControls(...args)};
  const oldConfirmSteal=confirmSteal;
  confirmSteal=function(playerId){
    if(!isRogue())return oldConfirmSteal(playerId);
    const player=state.players.find(p=>p.id===playerId),target=selectedEnemyOf(player);
    const cardIds=stealDrafts[playerId]?.costCardIds||[];
    if(!target||![1,2].includes(cardIds.length))return;
    delete selectedSkills[playerId];delete stealDrafts[playerId];
    return action({type:'useSkill',playerId,skillId:'gemini.steal',targetId:target.id,cardIds});
  };
  const oldSetup=renderSetupPause;
  renderSetupPause=function(active){
    if(!isRogue())return oldSetup(active);
    const previous=state.openingFate;
    state.openingFate={card:{id:'rogue-direction',kind:state.turnDirection===1?'sun':'moon',name:state.turnDirection===1?'太阳':'月亮'},recipientId:null};
    const html=oldSetup(active);state.openingFate=previous;
    return html.replace(/<span>末位[\s\S]*?<\/span>/,'<span>全员起手4牌；随后选择初始技能</span>').replace('确认结果，开始换牌','确认星盘，选择技能');
  };
  const oldBoardPanel=renderBoardSkillPanel;
  renderBoardSkillPanel=function(...args){
    if(isRogue()&&state.pendingSkillDecisions?.[0]?.kind==='rogueSteal')return undefined;
    return oldBoardPanel(...args);
  };
  const oldPending=renderPendingSkillDecisionPanel;
  renderPendingSkillDecisionPanel=function(player,...args){
    const d=state?.pendingSkillDecisions?.[0];
    if(!isRogue()||d?.kind!=='rogueSteal'||d.playerId!==player?.id)return oldPending(player,...args);
    const target=state.players.find(p=>p.id===d.targetId);
    const cards=[...target.hand,...Object.values(target.equipment)];
    return '<section class="activeSkillPanel rogue-steal"><header><h3>换影 · 选择夺取</h3><p>费用已支付，选择一张手牌或装备。非风牌额外造成1点伤害。</p></header><div class="rogue-take-grid">'+cards.map(c=>'<button class="choiceCard" onclick="RogueTable.take(\''+c.id+'\')">'+assetImageHtml('rogue-take-art',cardAssetUrls(c),c.name)+'<strong>'+safeText(c.name)+'</strong></button>').join('')+'</div></section>';
  };
  const oldStage=TabletopV10.renderBattleStage;
  TabletopV10.renderBattleStage=function(...args){
    let html=oldStage.apply(this,args);if(!isRogue())return html;
    html+='<div class="rogue-round-tag">星座乱斗 <span>第'+state.round+'轮 · '+(state.round%2?'下一轮结束成长':'本轮结束成长')+'</span></div>';
    const p=state.rogue.pending;
    if(!setupPaused&&p&&p.playerId===localHumanPlayerId&&state.players.find(x=>x.id===p.playerId)?.control==='human')html+=RogueTable.choices(p);
    return html;
  };
  const oldWinner=renderGameOverOverlay;
  const oldNavigation=TabletopV10.navigationDialog;
  TabletopV10.navigationDialog=function(){
    const html=oldNavigation.call(this);
    return isRogue()&&this.confirmation?.kind==='surrender'?html.replace(/<p id="v10-navigation-copy">[\s\S]*?<\/p>/,'<p id="v10-navigation-copy">你将退出本局并淘汰，其他玩家继续争夺胜利。</p>'):html;
  };
  renderGameOverOverlay=function(){
    if(!isRogue())return oldWinner();if(state.phase!=='gameOver')return '';
    const ids=state.rogue.winnerIds||[state.winnerId],win=ids.includes(localHumanPlayerId);
    const names=state.players.filter(p=>ids.includes(p.id)).map(p=>p.name).join('、')||'无人';
    const faction=state.rogue.winnerFaction;
    const result=faction&&faction!=='outcast'?factionNames[faction]+'获胜：'+names:names+(state.winnerId?'成为最后存活者。':'获胜。');
    return '<div class="gameOverBackdrop"><div class="gameOverOverlay '+(win?'victory':'defeat')+'" role="dialog" aria-modal="true"><h2>'+(win?'星辰凯旋':'本次征途结束')+'</h2><p>'+safeText(result)+'</p><div class="gameOverActions"><button onclick="exitToCleanStart()">返回大厅</button></div></div></div>';
  };
  const oldRender=render;
  render=function(){
    if(isRogue())for(const p of state.players)if(p.characterId.startsWith('rogue-'))labels[p.characterId]=p.name;
    oldRender();
    document.body.classList.toggle('rogue-match',isRogue()&&!lobbyOpen);
    const help=document.getElementById('lobbyModeHelp');
    if(currentMode()==='rogue'&&help)help.textContent='四象结盟 · 离誓独行 · 技能独占 · 击杀掠夺';
    document.getElementById('startModeRogue')?.setAttribute('aria-pressed',String(currentMode()==='rogue'));
    for(let i=1;i<allSeatIds.length;i++){const select=document.getElementById('m'+allSeatIds[i]);if(select)select.disabled=currentMode()==='rogue';}
    if(currentMode()==='rogue'){const hint=document.getElementById('modeSettingHint');if(hint)hint.textContent='首次亮明选择势力，每势力至多两人；离誓者额外摸2牌，独自求胜。';}
  };
  window.RogueTable={
    busy:false,reward:'draw2',
    choices(pending){
      const me=state.players.find(p=>p.id===pending.playerId);
      if(pending.kind==='faction')return this.factionChoices(me);
      const title={opening:'选择你的第一颗星',openingExtra:'公开先手 · 额外技能',growth:'星辰觉醒 · 三选一',loot:'击杀战利品 · 掠夺技能'}[pending.kind];
      const hint=pending.kind==='opening'?'你的独占星座池：'+me.rogue.pools.map(id=>labels[id]).join(' / ')+'。首个技能决定固定属性。':pending.kind==='openingExtra'?'此技能开局永久公开，其他玩家将知道你的优势。':pending.kind==='growth'?'从已解锁星座池中获得一个技能，未发动前继续隐藏。':'选择死者的一个已有技能，同时解锁其星座技能池。';
      const loot=pending.kind==='loot';
      const reward=loot?'<div class="rogue-rewards" role="group" aria-label="击杀补给"><button aria-pressed="'+(this.reward==='draw2')+'" onclick="RogueTable.reward=\'draw2\';render()">'+TabletopV10.icon('cards')+'摸2张牌</button><button '+(me.hp>=me.maxHp||isOrdinaryRescueBlocked(me)?'disabled':'')+' aria-pressed="'+(this.reward==='heal1')+'" onclick="RogueTable.reward=\'heal1\';render()">'+TabletopV10.icon('heart')+'恢复1点生命</button></div>':'';
      if(me.hp>=me.maxHp||isOrdinaryRescueBlocked(me))this.reward='draw2';
      const cards=pending.offer.map(id=>{const s=skillDescriptions[id],star=id.split('.')[0];return '<button class="rogue-skill-card" '+(this.busy?'disabled':'')+' onclick="RogueTable.choose(\''+id+'\')"><div class="rogue-choice-portrait"><img src="/zodiac-war-playtest/assets/portraits-v11/'+star+'-640.webp" alt="'+safeText(labels[star])+'"><span>'+safeText(labels[star])+'</span></div><div class="rogue-choice-copy"><span class="rogue-skill-type">'+TabletopV10.icon(TabletopV10.skillArtwork(id))+safeText(s.tag||'技能')+'</span><strong>'+safeText(s.name)+'</strong><p>'+safeText(s.summary||s.text)+'</p><span class="rogue-choice-cta">'+(this.busy?'正在获取…':'获得此技能 →')+'</span></div></button>'}).join('');
      return '<div class="rogue-draft-backdrop"><section class="rogue-draft" role="dialog" aria-modal="true" aria-labelledby="rogue-draft-title"><header><span class="rogue-eyebrow">ZODIAC · FOUR ELEMENTS</span><h2 id="rogue-draft-title">'+title+'</h2><p>'+safeText(hint)+'</p></header>'+reward+'<div class="rogue-choice-grid '+(pending.offer.length>3?'opening':'')+'">'+cards+'</div>'+(!pending.offer.length?'<button class="rogue-empty-loot" onclick="RogueTable.choose()">无可掠夺技能，领取补给</button>':'')+'<p class="rogue-draft-note">星座池独占 · 已学技能不重复出现 · 未发动技能保持隐藏</p></section></div>';
    },
    factionChoices(me){
      const element=CHARACTER_ELEMENTS[me.characterId],label=factionNames[element];
      const members=state.players.filter(p=>p.id!==me.id&&!p.eliminated&&p.rogue?.faction===element);
      const full=members.length>=2,disabled=this.busy?'disabled':'';
      return '<div class="rogue-draft-backdrop"><section class="rogue-draft rogue-faction-draft" role="dialog" aria-modal="true" aria-labelledby="rogue-faction-title"><header><span class="rogue-eyebrow">ZODIAC · OATH</span><h2 id="rogue-faction-title">亮明身份 · 选择势力</h2><p>你的固定属性：'+safeText(ELEMENT_VISUALS[element].label)+'。势力选定后，本局不可更换。</p></header><div class="rogue-choice-grid rogue-faction-grid"><button class="rogue-skill-card" data-faction="element" '+(full?'disabled':disabled)+' onclick="RogueTable.faction(\'element\')"><div class="rogue-choice-portrait"><img src="/zodiac-war-playtest/assets/portraits-v11/'+me.characterId+'-640.webp" alt="'+safeText(label)+'"></div><div class="rogue-choice-copy"><strong>加入'+safeText(label)+'</strong><p>在场成员 '+members.length+'/2'+(members.length?'：'+safeText(members.map(p=>p.name).join('、')):'')+'。<br>与同势力共同获胜；没有额外摸牌。</p><span class="rogue-choice-cta">'+(full?'名额已满，须成为离誓者':'立誓结盟 →')+'</span></div></button><button class="rogue-skill-card" data-faction="outcast" '+disabled+' onclick="RogueTable.faction(\'outcast\')"><div class="rogue-choice-portrait"><img src="/zodiac-war-playtest/assets/ui/card-back.jpg" alt="离誓者"></div><div class="rogue-choice-copy"><strong>成为离誓者</strong><p>首次亮明额外摸2张牌，整段结算结束后领取。<br>每名离誓者各自为战，必须成为最后存活者。</p><span class="rogue-choice-cta">'+(full?'名额已满 · 确认独行 →':'选择独行 →')+'</span></div></button></div><p class="rogue-draft-note">属性不会改变 · 未使用技能继续隐藏 · 势力整局锁定</p></section></div>';
    },
    async faction(faction){if(this.busy)return;this.busy=true;render();try{await action({type:'rogueFaction',playerId:state.rogue.pending.playerId,faction});}finally{this.busy=false;render();}},
    async choose(skillId){if(this.busy)return;this.busy=true;render();try{await action({type:'rogueChoose',playerId:state.rogue.pending.playerId,skillId,option:this.reward});}finally{this.busy=false;render();}},
    take(id){return action({type:'resolveSkillDecision',playerId:state.pendingSkillDecisions[0].playerId,activate:true,selectedCardId:id});}
  };
})();
