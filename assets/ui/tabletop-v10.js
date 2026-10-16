/* Approved round-table v10 presentation. Rules and card payment flows stay in the existing client/engine. */
window.TabletopV10 = {
  exitMenuOpen: false,
  settingsOpen: false,
  logOpen: false,
  confirmation: null,
  navigationBusy: false,
  resolutionKey: '',
  resolutionUntil: 0,
  resolutionTimer: null,
  zodiacOrder: ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'],
  inLandscapeFrame() {
    return window.name === 'zodiac-landscape-game' && window.parent !== window;
  },
  enterLandscape() {
    if (!this.inLandscapeFrame()) window.location.replace('/zodiac-war-playtest/assets/ui/landscape.html');
  },
  leaveLandscape() {
    if (this.inLandscapeFrame()) window.parent.location.replace('/zodiac-war-playtest/');
  },
  orientationPrompt() {
    return '<div class="v10-orientation-message" role="status"><strong>请横屏进行游戏</strong>' +
      '<span>请将手机横放。若页面没有跟随旋转，可点击下方按钮。<br>兼容横屏会保留当前对局。</span>' +
      '<button onclick="TabletopV10.enterLandscape()">进入兼容横屏</button>' +
      '<small>也可以从右上角菜单选择在系统浏览器中打开。</small></div>';
  },
  icon(name, label = '', className = '') {
    return '<img class="v10-icon ' + className + '" src="/zodiac-war-playtest/assets/icons-v10/' + name + '.svg" alt="' + safeText(label) + '"' + (label ? '' : ' aria-hidden="true"') + '>';
  },
  portrait(player, self = false) {
    const name = player.characterId;
    const eyePosition = { aries: 30, taurus: 24, gemini: 34, cancer: 26, leo: 24, virgo: 23, libra: 22, scorpio: 33, sagittarius: 29, capricorn: 31, aquarius: 26, pisces: 27 }[name] ?? 30;
    const base = '/zodiac-war-playtest/assets/portraits-v11/' + name;
    const size = self ? 640 : 320;
    const responsive = self ? '' : ' srcset="' + base + '-320.webp 320w, ' + base + '-640.webp 640w" sizes="(max-height: 600px) 13vw, (min-width: 1678px) 235px, (max-width: 885px) 124px, 14vw"';
    return '<img class="v10-person-image" style="--v11-portrait-eye:' + eyePosition + '%" src="' + base + '-' + size + '.webp"' + responsive +
      ' width="' + size + '" height="' + size + '" alt="' + safeText(labels[name]) + '" decoding="async" loading="eager" fetchpriority="' + (self ? 'high' : 'auto') + '">';
  },
  identity(player) {
    if (player.eliminated) return '已出局';
    if ((state.pendingRescue || state.infection?.pendingDying)?.targetId === player.id) return '濒死待救';
    if (state.mode === 'infection') return player.infectionRole === 'initial' ? '初始感染者' : player.factionId === 'infected' ? '感染者' : '幸存者';
    return player.teamId + ' 队';
  },
  relation(player) {
    const local = localHumanPlayer();
    const side = state.mode === 'infection' ? 'factionId' : 'teamId';
    return player[side] === local?.[side] ? '友' : '敌';
  },
  statuses(player) {
    const names = { burn: '灼烧', frozen: '冰冻', blind: '致盲', silence: '沉默', shield: '圣盾', abnormalImmunity: '异常免疫', sureHit: '必中', infection: '感染' };
    const artwork = { shield: 'shield', abnormalImmunity: 'immunity', sureHit: 'hit' };
    const ids = Object.keys(player.statuses || {}).filter(id => player.statuses[id]);
    if (player.infected) ids.push('infection');
    const guardian = state.players.find(candidate => candidate.characterId === 'taurus' && candidate.id !== player.id && candidate.hp > 0 && !candidate.eliminated && candidate.flags.taurusGuardTargetId === player.id);
    if (guardian) {
      ids.push('taurusGuard');
      names.taurusGuard = '牛守：由金牛座守护，可选择代承攻击';
      artwork.taurusGuard = 'guard';
    }
    const unique = [...new Set(ids)];
    const allLabels = unique.map(id => names[id] || id).join('、');
    return unique.map(id => {
      const turns = player.statuses?.[id]?.turns;
      const label = (names[id] || id) + (Number.isFinite(turns) ? '，剩余 ' + turns + ' 回合' : '');
      return '<span class="v10-status" title="' + safeText(label) + '">' + this.icon(artwork[id] || id, label) +
        (Number.isFinite(turns) ? '<small>' + turns + '</small>' : '') + '</span>';
    }).join('') + (unique.length > 7 ? '<span class="v10-status-overflow pc" title="' + safeText(allLabels) + '" aria-label="' + safeText(allLabels) + '">+' + (unique.length - 7) + '</span>' : '') +
      (unique.length > 3 ? '<span class="v10-status-overflow mobile" title="' + safeText(allLabels) + '" aria-label="' + safeText(allLabels) + '">+' + (unique.length - 3) + '</span>' : '');
  },
  vitals(player) {
    return '<div class="v10-vitals">' +
      '<span aria-label="生命 ' + player.hp + '/' + player.maxHp + '">' + this.icon('heart') + player.hp + '/' + player.maxHp + '</span>' +
      '<span aria-label="护甲 ' + player.armor + '">' + this.icon('shield') + player.armor + '</span>' +
      '<span aria-label="手牌 ' + player.hand.length + '">' + this.icon('cards') + player.hand.length + '</span>' +
      '</div>';
  },
  equipment(player, slot) {
    const card = player.equipment[slot];
    const label = slot === 'weapon' ? '武器' : '防具';
    const skillId = slot === 'weapon' && card?.element === 'water' ? 'weapon.waterCodex' :
      slot === 'weapon' && card?.element === 'air' ? 'weapon.airCompass' : '';
    const local = localHumanPlayer()?.id === player.id;
    const ready = local && skillId && canActivateEquipmentSkill(player, skillId);
    return '<button class="v10-equipment ' + (ready ? 'ready' : '') + (card ? '' : ' empty') + '" ' +
      (card ? 'onclick="event.stopPropagation();TabletopV10.clickEquipment(\'' + player.id + '\',\'' + slot + '\')"' : 'disabled') +
      ' aria-label="' + safeText(label + '：' + (card?.name || '空') + (ready ? '，可以发动' : '')) + '" title="' +
      safeText(card?.name || label + '槽为空') + '">' +
      (card ? assetImageHtml('v10-equipment-image', cardAssetUrls(card), card.name) : this.icon(slot === 'weapon' ? 'sword' : 'guard')) +
      '<span>' + label + (card ? '' : '·空') + '</span>' + (ready ? '<small>可发动</small>' : '') + '</button>';
  },
  clickEquipment(playerId, slot) {
    const player = state.players.find(candidate => candidate.id === playerId);
    if (!player?.equipment[slot]) return;
    const card = player.equipment[slot];
    const id = slot === 'weapon' && card.element === 'water' ? 'weapon.waterCodex' :
      slot === 'weapon' && card.element === 'air' ? 'weapon.airCompass' : '';
    if (localHumanPlayer()?.id === player.id && id && canActivateEquipmentSkill(player, id)) return beginEquipmentAction(player.id, id);
    selectEquipmentInfo(player.id, slot);
  },
  equipmentReason(player, id) {
    if (!id) return '被动装备满足条件时自动结算，无需手动发动。';
    if (player.id !== localHumanPlayer()?.id) return '其他角色的装备只能查看。';
    if (setupPaused || state.phase !== 'main' || state.activePlayerId !== player.id) return '仅限自己的出牌阶段发动。';
    if (player.statuses?.silence) return '沉默期间无法发动。';
    if (id === 'weapon.waterCodex') {
      if (player.flags.usedWeaponConvert) return '本回合已发动。';
      if (player.hand.length < 2) return '至少需要 2 张手牌作为素材。';
    }
    if (id === 'weapon.airCompass') {
      if (player.flags.usedWindCompass) return '本回合已发动。';
      if (new Set(player.flags.usedCardElements).size < 2) return '本回合需先正式使用 2 张不同属性的牌。';
      if (!state.deck.some(card => card.element)) return '牌堆中没有可以检索的属性牌。';
    }
    return '当前可以发动。';
  },
  skillArtwork(id) {
    const names = { bloodRage: 'flame', ram: 'ram', burnSoul: 'power', heal: 'heal', tideBond: 'wind', rescue: 'guard', aura: 'sun', roar: 'power', order: 'sword',
      windForm: 'wind', steal: 'hand', extraTurn: 'power', elementSense: 'eye', judgment: 'scales', harmony: 'scales', stormEye: 'wind', massHeal: 'heal',
      windCut: 'sword', freezeAoe: 'frozen', spoils: 'sword', peek: 'eye', observeTide: 'eye', balance: 'scales', dream: 'moon', guard: 'guard',
      thickSkin: 'shield', armor: 'guard', unyielding: 'power', wushuang: 'sword', charge: 'ram', bowcraft: 'bow', seekEquipment: 'hand', sharpshot: 'hit',
      purify: 'sun', domain: 'guard', discipline: 'scales', bossDrain: 'moon', bossCommand: 'sword', bossNoDistance: 'eye' };
    return names[id.split('.')[1]] || 'power';
  },
  ownSkills(player) {
    const canAct = !setupPaused && state.phase === 'main' && state.activePlayerId === player.id && player.control === 'human';
    return '<nav class="v10-own-skills" aria-label="角色技能">' + characterSkillEntries(player).filter(item => !item.id.startsWith('infection.')).map(item => {
      const passive = infoOnlySkills.has(item.id);
      const available = !passive && isSkillUsable(player, item.id, canAct);
      return '<button class="v10-skill ' + (available ? 'ready' : '') + (selectedSkills[player.id] === item.id ? ' selected' : '') +
        '" onclick="event.stopPropagation();skill(state.players.find(p=>p.id===\'' + player.id + '\'),\'' + item.id + '\',event)" aria-label="' +
        safeText(item.label + (passive ? '，被动技能，查看说明' : available ? '，可以发动' : '，当前不可发动，查看说明')) + '" title="' + safeText(item.description) + '">' +
        this.icon(this.skillArtwork(item.id)) + '<span>' + safeText(item.label) + '</span>' + (passive ? '<small>被动</small>' : '') + '</button>';
    }).join('') + '</nav>';
  },
  playerCard(player, active, focus, self = false) {
    const canTarget = canReleaseSelectedCardOnSeat(player.id);
    const canSkill = active && canReleaseSkillCostOnSeat(active.id, player.id);
    const queued = selectedCard?.targetIds?.includes(player.id);
    const roarSelected = active && selectedSkills[active.id] === 'leo.roar' && isLeoRoarTargetSelected(active.id, player.id);
    const feedback = effectFeedbackFor(player);
    const classes = ['seatCard', self ? 'v10-self stageFocusCard' : 'v10-seat', state.mode === 'infection' && player.infectionRole === 'initial' ? 'v10-boss' : '', state.activePlayerId === player.id ? 'current' : '',
      queued ? 'target' : '', roarSelected ? 'multiSkillTargetSelected' : '', canTarget || canSkill ? 'selectedCardTarget' : '', player.eliminated || player.hp <= 0 ? 'dead' : '', feedback.className].filter(Boolean).join(' ');
    return '<article class="' + classes + '" data-player-id="' + player.id + '" tabindex="0" aria-label="' + safeText(labels[player.characterId] + '，' + this.identity(player) + (roarSelected ? '，狮吼已选目标' : '')) +
      '" onclick="TabletopV10.clickPlayer(\'' + player.id + '\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();TabletopV10.clickPlayer(\'' + player.id + '\')}"' +
      ' onpointerenter="TabletopV10.hoverPlayer(\'' + player.id + '\',event)" onpointerleave="TabletopV10.hideHover()"' +
      ' onfocusin="TabletopV10.hoverPlayer(\'' + player.id + '\',event)" onfocusout="TabletopV10.hideHover()"' +
      ' ondragover="allowCardDrop(event,\'' + player.id + '\')" ondrop="dropCardOnSeat(event,\'' + player.id + '\')">' +
      '<div class="v10-portrait">' + this.portrait(player, self) + '<header class="v10-player-heading"><strong>' + safeText(labels[player.characterId]) +
      '</strong><span class="' + (player.infectionRole === 'initial' ? 'boss' : '') + '">' + this.relation(player) + '</span></header>' +
      '<div class="v10-statuses">' + this.statuses(player) + '</div>' +
      (shouldShowRage(player) ? '<span class="v10-rage" title="怒气">' + this.icon('power') + player.rage + '</span>' : '') +
      '</div>' + this.vitals(player) + '<div class="v10-equipment-row">' + this.equipment(player, 'weapon') + this.equipment(player, 'armor') + '</div>' +
      (self ? this.ownSkills(player) : '') + feedback.markup + renderActionCountdown(player) + '</article>';
  },
  orderedOthers(focus) {
    const ordered = [...state.players].sort((a, b) => a.seatIndex - b.seatIndex || a.id.localeCompare(b.id));
    const index = ordered.findIndex(player => player.id === focus.id);
    return ordered.slice(index + 1).concat(ordered.slice(0, index));
  },
  seats(active, focus) {
    const others = this.orderedOthers(focus);
    const left = others[0];
    const right = others[others.length - 1];
    const top = others.slice(1, -1);
    return '<div class="v10-seat-layer" aria-label="按黄道顺序排列的席位">' +
      '<div class="v10-top-seats" style="--top-count:' + top.length + '">' + top.map(player => this.playerCard(player, active, focus)).join('') + '</div>' +
      '<div class="v10-left-seat">' + this.playerCard(left, active, focus) + '</div>' +
      '<div class="v10-right-seat">' + this.playerCard(right, active, focus) + '</div>' + '</div>';
  },
  compass() {
    const present = new Set(state.players.map(player => player.characterId));
    const reverse = state.turnDirection === -1;
    const direction = reverse ? '逆时针' : '顺时针';
    return '<aside class="v10-compass" aria-label="十二星座罗盘，在场星座点亮">' +
      '<img src="/zodiac-war-playtest/assets/ui/fate-compass-v10.webp" alt="" aria-hidden="true">' +
      this.zodiacOrder.map((id, index) => {
        const angle = index * Math.PI / 6 - Math.PI / 2;
        return '<span class="v10-zodiac ' + (present.has(id) ? 'present' : '') + '" style="left:' + (50 + Math.cos(angle) * 40) + '%;top:' +
          (50 + Math.sin(angle) * 40) + '%" aria-label="' + labels[id] + (present.has(id) ? '，在场' : '，未在场') + '">' + labels[id].replace('座', '') + '</span>';
      }).join('') + '<span class="v10-turn-direction' + (reverse ? ' reverse' : '') + '" role="img" aria-label="出牌方向：' + direction + '">' +
      '<svg viewBox="0 0 80 80" aria-hidden="true"><defs><marker id="v10-turn-arrow" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto"><path d="M0 0L4 2L0 4Z" fill="currentColor"/></marker></defs>' +
      '<path d="M58 22A26 26 0 1 1 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" marker-end="url(#v10-turn-arrow)"/></svg>' +
      '<b aria-hidden="true">' + direction + '</b></span><small>十二星座罗盘</small></aside>';
  },
  clickPlayer(id) {
    if (canReleaseSelectedCardOnSeat(id)) return releaseSelectedCardOnSeat(id);
    const active = state.players.find(player => player.id === state.activePlayerId);
    if (active && canReleaseSkillCostOnSeat(active.id, id)) return releaseSkillCostOnSeat(active.id, id);
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) openPlayerInspector(id);
  },
  hoverPlayer(id, event) {
    const active = state.players.find(candidate => candidate.id === state.activePlayerId);
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || selectedCard || seatSkillTip ||
      state.pendingSkillDecisions?.length || (active && selectedSkills[active.id] && !isReadOnlySkillSelection(active)) ||
      inspectedPlayerId || this.logOpen || this.confirmation) return this.hideHover();
    const player = state.players.find(candidate => candidate.id === id);
    const panel = document.getElementById('v10-skill-hover');
    if (!player || !panel) return;
    panel.innerHTML = '<strong>' + safeText(labels[player.characterId]) + ' · 技能</strong>' + characterSkillEntries(player).map(item =>
      '<div><b>' + safeText(item.label) + '</b><span>' + safeText(item.description) + '</span></div>').join('');
    panel.hidden = false;
    panel.classList.toggle('v10-hover-wide', characterSkillEntries(player).length > 3 && window.innerHeight < 620);
    const rect = event.currentTarget.getBoundingClientRect();
    const width = Math.min(characterSkillEntries(player).length > 3 && window.innerHeight < 620 ? 620 : 350, window.innerWidth - 24);
    panel.style.width = width + 'px';
    const height = Math.min(panel.scrollHeight, window.innerHeight - 80);
    const left = rect.right + width + 12 < window.innerWidth ? rect.right + 8 : Math.max(12, rect.left - width - 8);
    panel.style.left = left + 'px';
    panel.style.top = Math.max(60, Math.min(rect.top, window.innerHeight - height - 12)) + 'px';
  },
  hideHover() {
    const panel = document.getElementById('v10-skill-hover');
    if (panel) panel.hidden = true;
  },
  captureSkillPanelView() {
    const panel = document.querySelector('.v10-skill-action-overlay');
    if (!panel) return null;
    const focused = document.activeElement;
    return {key: panel.dataset.skillPanelKey, top: panel.querySelector('.skillChoiceBody')?.scrollTop || 0,
      action: focused && panel.contains(focused) ? focused.getAttribute('onclick') : ''};
  },
  restoreSkillPanelView(saved) {
    const panel = document.querySelector('.v10-skill-action-overlay');
    if (!panel) return;
    const summary = panel.querySelector('.skillChoiceSummary');
    if (summary) {
      const labels = [...panel.querySelectorAll('.choiceCard.selected')].map(button => button.textContent?.trim()).filter(Boolean);
      summary.textContent = labels.length ? '已选：' + labels.join('；') : '尚未选择';
    }
    if (!saved || panel.dataset.skillPanelKey !== saved.key) return;
    const body = panel.querySelector('.skillChoiceBody');
    if (body) body.scrollTop = saved.top;
    if (saved.action) [...panel.querySelectorAll('button')].find(button => button.getAttribute('onclick') === saved.action)?.focus({preventScroll: true});
  },
  queueTarget(targetId) {
    if (!canReleaseSelectedCardOnSeat(targetId)) return;
    const player = selectedCardPlayer();
    const card = selectedCardObject();
    const double = canBossBasicAttackAddTarget(player, card) && enemiesOf(player).filter(target => canDropCardOnSeat(selectedCard, target.id)).length >= 2;
    const targets = selectedCard.targetIds || [];
    selectedCard.targetIds = double ? targets.includes(targetId) ? targets.filter(id => id !== targetId) : [...targets.slice(0, 1), targetId] : [targetId];
    render();
  },
  canConfirmCard() {
    if (state.pendingSkillDecisions?.length) return false;
    const player = selectedCardPlayer();
    const card = selectedCardObject();
    if (!player || !card || setupPaused || state.phase !== 'main' || state.activePlayerId !== player.id) return false;
    if (card.kind === 'aoe') return targetIdsForSelectedCard().length > 0;
    const targets = selectedCard.targetIds || [];
    const double = canBossBasicAttackAddTarget(player, card) && enemiesOf(player).filter(target => canDropCardOnSeat(selectedCard, target.id)).length >= 2;
    return targets.length === (double ? 2 : 1) && targets.every(id => canReleaseSelectedCardOnSeat(id));
  },
  confirmCard() {
    if (!this.canConfirmCard()) return;
    if (selectedCardObject().kind === 'aoe') return releaseSelectedAoeCard();
    const targets = [...selectedCard.targetIds];
    selectedCard.targetIds = targets.length > 1 ? [targets[0]] : [];
    return commitSelectedCardOnSeat(targets[targets.length - 1]);
  },
  handHint(player) {
    if (!player.hand.length) return '没有手牌了：点击「结束回合」继续。';
    const card = selectedCard?.playerId === player.id ? selectedCardObject() : null;
    if (!card) return '点选手牌和目标后，点击「确认出牌」；装备牌点选后直接装备。';
    if (card.kind === 'aoe') return '群攻牌已选定，点击「确认出牌」释放。';
    const targets = (selectedCard.targetIds || []).map(id => labels[state.players.find(player => player.id === id)?.characterId]).filter(Boolean);
    if (!targets.length && card.kind === 'sun') return state.mode === 'infection'
      ? '太阳：选择自己，再确认出牌，回复 1 点、净化并摸本属性牌。'
      : '太阳：选择回血目标（可选自己），再点击「确认出牌」。';
    if (!targets.length) return '请选择高亮目标，再点击「确认出牌」。';
    return '已选目标：' + targets.join('、') + '。' + (this.canConfirmCard() ? '点击「确认出牌」释放。' : '请选择另一名高亮角色，再确认出牌。');
  },
  controls(handFocus, controls) {
    if (state.pendingSkillDecisions?.length) return '';
    const main = !setupPaused && state.phase === 'main' && state.activePlayerId === handFocus.id && handFocus.control === 'human';
    const draft = main ? activeSkillCostDraft(handFocus) : null;
    const synthesizing = draft?.skillId === 'weapon.waterCodex';
    const observing = draft?.skillId === 'pisces.observeTide';
    const confirmingSkill = synthesizing || observing;
    const canConfirm = confirmingSkill ? draft.ready && (synthesizing ? canActivateEquipmentSkill(handFocus, draft.skillId) : isSkillUsable(handFocus, draft.skillId, main)) : this.canConfirmCard();
    const confirmHandler = confirmingSkill ? "confirmActiveSkillCost('" + handFocus.id + "')" : 'TabletopV10.confirmCard()';
    const many = (controls.match(/<button/g) || []).length > 2;
    return '<div class="v10-actions' + (many ? ' v10-actions-options' : '') + '">' + (main ? '<button id="v10-confirm-card" class="v10-confirm-card" ' +
      (canConfirm ? '' : 'disabled') + ' onclick="' + confirmHandler + '">' + (synthesizing ? '确认合成' : observing ? '确认观潮' : '确认出牌') + '</button>' : '') +
      controls.replace('结束出牌', '结束回合').replace('自动弃至体力', '自动弃牌') + '</div>';
  },
  header() {
    const name = state.mode === 'infection' ? '月蚀' : currentMode() === 'standard' ? '标准' : '测试';
    return '<header class="v10-header"><button class="v10-report-button" onclick="TabletopV10.logOpen=true;render()">' + this.icon('report') + '战报</button>' +
      '<div class="v10-title"><strong><span class="v10-title-full">十二星座·四象战争</span><span class="v10-title-short">十二星座</span></strong>' +
      '<span>' + name + ' · ' + state.players.length + ' 人局</span><span>第 ' + state.round + ' 轮</span>' +
      '<span class="v10-deck-count" aria-label="牌堆剩余 ' + state.deck.length + ' 张，本局共 ' + state.totalCards + ' 张">牌堆 <b>' + state.deck.length + '/' + state.totalCards + '</b></span></div>' +
      '<nav class="v10-nav" aria-label="对局操作"><button id="v10-exit-menu" aria-expanded="' + this.exitMenuOpen + '" onclick="TabletopV10.toggleMenu()">' +
      this.icon('exit') + '退出' + this.icon('down', '', 'v10-chevron') + '</button>' +
      '<button aria-label="设置" onclick="TabletopV10.settingsOpen=!TabletopV10.settingsOpen;TabletopV10.exitMenuOpen=false;render()">' +
      this.icon('settings') + '<span class="v10-settings-label">设置</span></button>' +
      (this.exitMenuOpen ? '<div class="v10-exit-menu"><button onclick="TabletopV10.requestNavigation(\'exit\')">' + this.icon('exit') + '退出游戏</button>' +
      '<button class="v10-surrender" ' + (setupPaused || state.winnerTeamId ? 'disabled' : '') + ' onclick="TabletopV10.requestNavigation(\'surrender\')">' +
      this.icon('surrender') + '投降本局</button></div>' : '') +
      (this.settingsOpen ? '<div class="v10-settings-menu">' + renderEntrustButton() +
        (this.inLandscapeFrame() ? '<button onclick="TabletopV10.leaveLandscape()">恢复普通显示</button>' : '') +
        '<span>本地试玩 · 当前席位 ' + safeText(labels[localHumanPlayer()?.characterId] || '') + '</span></div>' : '') +
      '</nav></header>';
  },
  toggleMenu() { this.exitMenuOpen = !this.exitMenuOpen; this.settingsOpen = false; this.hideHover(); render(); },
  requestNavigation(kind) {
    if (!['exit', 'surrender'].includes(kind) || this.navigationBusy) return;
    if (kind === 'surrender' && (setupPaused || state.winnerTeamId)) return;
    const player = localHumanPlayer();
    this.confirmation = { kind, matchId: clientMatchId, faction: state.mode === 'infection' ? player?.factionId : player?.teamId };
    this.exitMenuOpen = false;
    this.settingsOpen = false;
    render();
    requestAnimationFrame(() => document.getElementById('v10-cancel-navigation')?.focus());
  },
  cancelNavigation() {
    if (this.navigationBusy) return;
    this.confirmation = null;
    render();
    const trigger = state.winnerTeamId
      ? document.querySelector('.gameOverActions button[onclick="exitToCleanStart()"]')
      : document.getElementById('v10-exit-menu');
    trigger?.focus();
  },
  async confirmNavigation() {
    const confirmation = this.confirmation;
    if (!confirmation || this.navigationBusy) return;
    this.navigationBusy = true;
    render();
    try {
      await api(confirmation.kind === 'exit' ? '/api/exit' : '/api/surrender', {
        confirmed: true, matchId: confirmation.matchId, faction: confirmation.faction
      });
      this.confirmation = null;
    } finally {
      this.navigationBusy = false;
      this.syncNavigationDialog();
      render();
    }
  },
  navigationDialog() {
    const confirmation = this.confirmation;
    if (!confirmation) return '';
    const surrender = confirmation.kind === 'surrender';
    const faction = state.mode === 'infection' ? confirmation.faction === 'infected' ? '感染者阵营' : '幸存者阵营' : confirmation.faction + ' 队';
    return '<div class="v10-dialog-backdrop" onclick="if(event.target===this)TabletopV10.cancelNavigation()">' +
      '<section class="v10-dialog" role="dialog" aria-modal="true" aria-labelledby="v10-navigation-title" aria-describedby="v10-navigation-copy">' +
      '<h2 id="v10-navigation-title">' + (surrender ? '确认投降本局？' : '确认退出游戏？') + '</h2>' +
      '<p id="v10-navigation-copy">' + (surrender ? '你所在的' + safeText(faction) + '将认输，整局立即结束并进入结算。' : '退出将结束当前本地对局并返回模式选择。当前对局不会保存。') + '</p>' +
      '<div><button id="v10-cancel-navigation" ' + (this.navigationBusy ? 'disabled' : '') + ' onclick="TabletopV10.cancelNavigation()">继续游戏</button>' +
      '<button class="' + (surrender ? 'v10-surrender' : '') + '" ' + (this.navigationBusy ? 'disabled' : '') +
      ' onclick="TabletopV10.confirmNavigation()">' + (this.navigationBusy ? '处理中…' : surrender ? '确认投降' : '确认退出') + '</button></div></section></div>';
  },
  syncNavigationDialog() {
    const html = lobbyOpen ? '' : this.navigationDialog();
    let root = document.getElementById('v10-navigation-root');
    if (!root && html) {
      root = document.createElement('div');
      root.id = 'v10-navigation-root';
      document.body.appendChild(root);
    }
    if (root) root.innerHTML = html;
  },
  report() {
    if (!this.logOpen) return '<div id="log" hidden></div>';
    return '<div class="v10-log-backdrop" onclick="if(event.target===this){TabletopV10.logOpen=false;render()}">' +
      '<aside class="v10-log-panel" role="dialog" aria-modal="true" aria-label="战报"><header><h2>战报</h2>' +
      '<button aria-label="关闭战报" onclick="TabletopV10.logOpen=false;render()">' + this.icon('close') + '</button></header>' +
      '<div class="v10-report-summary">' + renderStageStats() + '</div><div id="log"></div><button onclick="downloadLog()">导出战报</button></aside></div>';
  },
  renderBattleStage(active, opponent, source, target, controls, handFocus) {
    this.syncNavigationDialog();
    const focus = handFocus || localHumanPlayer() || active || state.players[0];
    const skillPanel = state.pendingRescue ? '' : renderPendingSkillDecisionPanel(focus) || renderActiveSkillPanel(focus);
    const skillPanelKey = clientMatchId + ':' + focus.id + ':' + (state.pendingSkillDecisions?.length ? skillDecisionKey(state.pendingSkillDecisions[0]) : selectedSkills[focus.id]);
    const prompt = active ? actionPrompt(active, opponent, source, target) : '等待牌局开始';
    return '<section class="arena v10-arena mode' + state.players.length + '">' + this.header() +
      '<div class="v10-table">' + this.seats(active, focus) + this.compass() +
      '<div class="v10-center">' + renderSetupPause(active) + renderMulliganCountdown() + renderPlayedCards() + '</div>' +
      (skillPanel ? '<div class="v10-skill-action-overlay" data-skill-panel-key="' + safeText(skillPanelKey) + '">' + skillPanel + '</div>' : '') +
      '<div class="v10-self-dock">' + this.playerCard(focus, active, focus, true) + '</div>' +
      '<section class="v10-hand-dock" aria-label="自己的手牌"><div class="v10-phase"><span>' + safeText(formatLogMessage(prompt)) +
      '</span><b id="v10-round-clock"></b></div>' + renderFocusedHand(focus, '') + '</section>' + this.controls(focus, controls) + '</div>' +
      '<svg id="actionGuideLayer" aria-hidden="true"><g id="actionGuideBeams"></g></svg>' +
      '<aside id="v10-skill-hover" class="v10-skill-hover" role="tooltip" hidden></aside>' +
      renderPlayerInspector() + renderSeatSkillTip() + this.report() +
      this.orientationPrompt() +
      '<div id="effectLayer"></div></section>';
  }
};
document.body.classList.add('tabletopV10');
if (window.TabletopV10.inLandscapeFrame()) {
  const back = document.createElement('button');
  back.className = 'v10-landscape-return';
  back.textContent = '恢复普通显示';
  back.onclick = () => window.TabletopV10.leaveLandscape();
  document.body.appendChild(back);
}
document.addEventListener('keydown', event => {
  const ui = window.TabletopV10;
  if (event.key === 'Escape') {
    if (ui.confirmation) ui.cancelNavigation();
    else if (inspectedPlayerId) closePlayerInspector();
    else if (ui.logOpen || ui.exitMenuOpen || ui.settingsOpen) { ui.logOpen = false; ui.exitMenuOpen = false; ui.settingsOpen = false; render(); }
    ui.hideHover();
  }
  if (event.key === 'Tab' && ui.confirmation) {
    const buttons = [...document.querySelectorAll('.v10-dialog button:not(:disabled)')];
    if (!buttons.length) return event.preventDefault();
    const index = buttons.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) { event.preventDefault(); buttons[buttons.length - 1].focus(); }
    else if (!event.shiftKey && index === buttons.length - 1) { event.preventDefault(); buttons[0].focus(); }
  }
});
