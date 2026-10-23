/* Guidance surrounds the normal table. All committed moves use /api/action. */
window.ZodiacTutorial = {
  step: '',
  responseCard: '',
  helper: false,
  copy: {
    welcome: ['约5分钟 · 不计时', '先打出你的第一手', '你使用白羊。绿色「友」是队友，红色「敌」是对手。体验攻防、金角冲和太阳急救；随时可以跳过。'],
    attack: ['1 / 3 · 基础攻防', '选牌 → 选敌人 → 确认', '点击火普通攻击，再点红框摩羯，最后点击「确认出牌」。本段对手不防御。'],
    'attack-result': ['攻击已结算', '摩羯失去1点生命', '普通攻击在出牌阶段可以攻击敌人；确认前可重选手牌和目标。'],
    defense: ['1 / 3 · 基础攻防', '同一类牌，也能防御', '摩羯使用了风普通攻击。选风普通攻击，再点「确认防御」。防御目标已锁定自己。'],
    'defense-result': ['防御成功', '白羊没有掉血', '普通攻击牌在回合外可以防御。本次普通攻击已被挡住，无需再选目标。'],
    skill: ['2 / 3 · 招牌技能', '先点手牌上方的「金角冲」', '再选火普通攻击作为费用，点击摩羯选择目标，最后点“确定”发动。技能模式下，费用牌不会当作普通攻击使用。'],
    'skill-result': ['金角冲已发动', '费用牌不同，效果也不同', '本次弃火普通攻击，造成1点不可防御技能伤害，不附灼烧；弃火状态攻击才额外附加灼烧。'],
    rescue: ['3 / 3 · 队友急救', '巨蟹濒死，先别放弃队友', '选择太阳，再点「确认急救」。急救目标已锁定巨蟹，无需另选；濒死仍有机会回到战场。'],
    'rescue-result': ['队友急救成功', '巨蟹：0 → 1点生命，并获圣盾', '太阳已经救回队友。巨蟹存活后，共潮自动摸牌；被动技能不需要手动点击。'],
    practice: ['最后一步 · 独立尝试', '自己向一名敌人出一张牌', '选一张普通攻击，选择红框敌人，再确认出牌。这里撤去高亮；需要时可再看提示。'],
    finish: ['入门完成', '你已掌握基本配合', '你完成了攻击、防御、金角冲和队友急救。接下来可以开始2v2练习，也可以返回大厅选择模式。']
  },
  controls() {
    if (!tutorial) return undefined;
    if (this.step !== tutorial.step) { this.step = tutorial.step; this.responseCard = ''; this.helper = false; }
    const step = tutorial.step;
    if (['defense', 'rescue'].includes(step)) {
      return '<div class="v10-actions"><button id="tutorial-confirm-response" ' + (this.responseCard ? '' : 'disabled') +
        ' onclick="ZodiacTutorial.confirmResponse()">' + (step === 'defense' ? '确认防御' : '确认急救') + '</button></div>';
    }
    if (['attack', 'practice'].includes(step)) return '<div class="v10-actions"><button id="v10-confirm-card" ' +
      (window.TabletopV10.canConfirmCard() ? '' : 'disabled') + ' onclick="TabletopV10.confirmCard()">确认出牌</button></div>';
    return '';
  },
  selectResponse(cardId) {
    this.responseCard = this.responseCard === cardId ? '' : cardId;
    render();
  },
  confirmResponse() {
    if (!this.responseCard || !tutorial) return;
    return action(tutorial.step === 'defense'
      ? { type: 'defend', playerId: 'p1', cardId: this.responseCard }
      : { type: 'playCard', playerId: 'p1', cardId: this.responseCard, targetId: 'p2', mode: 'rescue' });
  },
  sync(progress) {
    if (!progress) return;
    const table = document.querySelector('.v10-table');
    if (!table) return;
    const step = progress.step;
    const copy = this.copy[step];
    let title = copy[1];
    if (step === 'attack' && selectedCard?.cardId === 'fire-normal-1') title = selectedCard.targetIds?.length ? '点击「确认出牌」，完成攻击' : '再点红框摩羯，选择目标';
    if (step === 'skill' && selectedSkills.p1 === 'aries.ram') title = ariesRamDrafts.p1?.costCardIds?.length ? boardSkillSelection()?.targetIds.length ? '点击「确定」，发动金角冲' : '点击红框摩羯，选择目标' : '选择火普通攻击，支付技能费用';
    if (step === 'defense' && this.responseCard) title = '点击「确认防御」，挡住这一击';
    if (step === 'rescue' && this.responseCard) title = '点击「确认急救」，救回巨蟹';
    const guide = document.createElement('aside');
    guide.className = 'tutorial-guide';
    guide.dataset.step = step;
    guide.setAttribute('aria-label', '新手指引');
    guide.innerHTML = '<div class="tutorial-guide-top"><span>' + copy[0] + '</span><button onclick="tutorialCommand(\'skip\')">' +
      (step === 'finish' ? '返回大厅' : '跳过教学') + '</button></div><div class="tutorial-guide-copy" role="status" aria-live="polite"><h2>' + title + '</h2><p>' + copy[2] + '</p></div>' +
      '<div class="tutorial-guide-actions">' + (step === 'welcome' ? '<button class="tutorial-next" onclick="tutorialCommand(\'next\')">开始教学</button>' :
        step === 'finish' ? '<button class="tutorial-next" onclick="tutorialCommand(\'practice\')">进入2v2练习</button>' :
        step.endsWith('-result') ? '<button class="tutorial-next" onclick="tutorialCommand(\'next\')">' + ({'attack-result':'继续：试一次防御', 'defense-result':'继续：金角冲', 'skill-result':'继续：队友急救', 'rescue-result':'继续：自己试一次'}[step]) + '</button>' :
        step === 'practice' ? '<button onclick="ZodiacTutorial.helper=!ZodiacTutorial.helper;render()">' + (this.helper ? '收起提示' : '再看提示') + '</button>' : '<span>按提示操作牌桌即可继续</span>') + '</div>';
    table.appendChild(guide);
    const actionable = ['attack','defense','skill','rescue','practice'].includes(step);
    document.body.dataset.tutorialStep = step;
    const phase = table.querySelector('.v10-phase > span');
    if (phase) phase.textContent = step.endsWith('-result') || step === 'finish' ? '结算已完成，阅读后继续；教学不计时。' :
      step === 'welcome' ? '教学演练片段 · 不消耗正式对局资源' :
      step === 'defense' ? '防御对象：自己 · 选风普通攻击后确认防御' :
      step === 'rescue' ? '急救对象：友方巨蟹 · 选太阳后确认急救' :
      step === 'practice' ? '独立尝试 · 选择普通攻击和敌方目标' :
      step === 'skill' ? '技能模式：金角冲 · 费用：火普通攻击 · 目标：敌方摩羯' : '本段目标：敌方摩羯 · 选择火普通攻击';
    // Hide unrelated actions only in this teaching table. The normal game is unchanged.
    table.querySelectorAll('.v10-own-skills button').forEach(button => {
      const ram = button.getAttribute('onclick')?.includes('aries.ram');
      button.disabled = !(step === 'skill' && ram);
      if (step === 'skill' && ram) button.classList.add('tutorial-highlight');
    });
    table.querySelectorAll('.focusedHandCards > .card').forEach(button => {
      const id = button.dataset.cardId;
      const allowed = step === 'practice' ? /normal/.test(id) : id === ({attack:'fire-normal-1', defense:'air-normal-1', skill:'fire-normal-1', rescue:'sun'}[step]);
      button.disabled = !actionable || !allowed || (step === 'skill' && selectedSkills.p1 !== 'aries.ram');
      if (allowed && (step !== 'practice' || this.helper)) button.classList.add('tutorial-highlight');
      if (['defense','rescue'].includes(step) && allowed) {
        button.onclick = () => this.selectResponse(id);
        button.classList.toggle('tutorial-selected', this.responseCard === id);
        button.setAttribute('aria-pressed', String(this.responseCard === id));
      }
    });
    const target = table.querySelector('[data-player-id="' + (step === 'rescue' ? 'p2' : 'p4') + '"].seatCard');
    if (target && (['attack','skill','rescue'].includes(step) || (step === 'practice' && this.helper))) target.classList.add('tutorial-highlight');
    table.querySelectorAll('.v10-actions button').forEach(button => { if (!button.disabled && step !== 'practice') button.classList.add('tutorial-highlight'); });
    if (!actionable) table.querySelectorAll('.seatCard').forEach(seat => { seat.inert = true; });
    window.GameI18n?.localize(guide);
  }
};
