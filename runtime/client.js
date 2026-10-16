
const labels = {"aries":"白羊座","leo":"狮子座","sagittarius":"射手座","gemini":"双子座","libra":"天秤座","aquarius":"水瓶座","cancer":"巨蟹座","scorpio":"天蝎座","pisces":"双鱼座","taurus":"金牛座","virgo":"处女座","capricorn":"摩羯座"};
const skillDescriptions = {"aries.bloodRage":{"name":"血怒","text":"被动。从上个主动回合结束到当前主动回合开始前，若白羊因非神圣伤害减少过生命，则本回合下一次羊角冲伤害 +1；触发后消失，每个主动回合最多触发一次。"},"aries.ram":{"name":"羊角冲","text":"每回合一次。消耗 1 张火属性普通攻击或状态攻击牌，对一名角色造成 1 点不可防御技能伤害；若消耗的是火属性状态攻击牌，则目标同时获得灼烧。羊角冲不计入基础攻击次数，可被圣盾抵消，也会因致盲落空。"},"aries.burnSoul":{"name":"燃魂","text":"每回合限一次。你的非火普通攻击或状态攻击手牌可以视为火属性牌支付羊角冲费用；该牌只作为费用被消耗，不改变原本属性、类型和牌面效果。AOE、装备、功能、星能、太阳、月亮不能通过燃魂支付。"},"leo.aura":{"name":"狮威","text":"被动。狮子存活时，所有灼烧角色不能通过普通回复恢复生命。太阳不属于普通回复，不受狮威限制。"},"leo.roar":{"name":"狮吼","text":"每回合一次。弃 1 张火牌，指定最多 3 名角色，使其获得 1 轮灼烧；若目标已经灼烧，则不刷新持续时间。"},"leo.order":{"name":"王令","text":"弃 1 张任意牌指定一名角色。直到狮子下个回合开始前，该角色对狮子使用牌时，必须交给狮子 1 张牌，否则该牌失效。"},"sagittarius.bowcraft":{"name":"整弓","text":"被动。当你的装备被拆除、被替换或被其他角色获得时，摸 2 张牌。"},"sagittarius.seekEquipment":{"name":"寻器","text":"每回合一次。弃 1 张火属性牌和 1 张任意手牌，随机获得牌库中的 1 张武器或防具；若牌库没有装备，返还费用。"},"sagittarius.sharpshot":{"name":"神射","text":"被动。装备武器时，你每回合第一次火属性普通攻击伤害 +1；装备防具时，每次承受实际生命伤害后摸 1 张牌。"},"gemini.windForm":{"name":"双生","text":"被动。双子每减少 1 点生命，摸 1 张风牌；神圣伤害造成的生命减少不触发。"},"gemini.steal":{"name":"换影","text":"每回合一次。弃 2 张牌，或弃 1 张牌并失去 1 点生命；查看目标手牌和装备并选择获得其中 1 张。若获得的牌不是风属性，对目标造成 1 点伤害并附加致盲；若目标没有手牌和装备，改为造成 2 点伤害并附加致盲。换影无距离限制。"},"gemini.extraTurn":{"name":"连星","text":"被动。本回合使用第 3 张风属性牌后，获得 1 个额外回合；换影消耗的风牌可以计入。每轮最多触发一次。"},"libra.elementSense":{"name":"衡感","text":"被动。每轮内，每当你首次正式使用一种新属性牌时，摸 1 张牌，每轮最多 4 次；回合内外均可触发。太阳/月亮视为全属性，使用时为衡感选择一种基础属性。"},"libra.judgment":{"name":"审判","text":"被动。主动回合内，本回合首次正式使用第 3 种不同属性牌时，令一名角色获得致盲；首次正式使用第 4 种不同属性牌时触发完美审判，可选择抽取目标 1 张手牌或造成 1 点普通伤害。每项每回合最多一次。"},"libra.harmony":{"name":"裁衡","text":"每回合一次。选择两名其他存活角色，计算手牌差 D；若 D 小于 2 不能发动。天秤弃置 floor(D/2) 张风牌，并从多牌者的手牌或装备中选择等量牌交给少牌者。"},"aquarius.stormEye":{"name":"倾杯","text":"被动。水瓶受到非神圣的实际伤害后，摸 2 张牌，并可选择与至多 2 名其他存活角色交换至多 2 张等量手牌（每张交出须对应取回一张）。神酿献祭的 1 点生命会触发本被动，使水瓶额外摸 2 张牌。"},"aquarius.massHeal":{"name":"神酿","text":"每回合一次。献祭 1 点生命，并弃置 1 张风属性牌和 1 张任意牌；所有角色回复 1 点生命，受到普通恢复限制的角色不能回复。"},"aquarius.windCut":{"name":"断流","text":"被动，每轮一次。弃牌阶段一次弃置至少 2 张牌后，可以选择是否发动；若发动，选择一名其他存活角色并指定弃置其 2 张手牌，不足 2 张则弃置全部，然后对其造成 1 点伤害。"},"cancer.tideBond":{"name":"共潮","text":"被动。任意角色成功回复生命后，巨蟹摸 1 张牌；每轮最多触发 3 次。"},"cancer.heal":{"name":"疗潮","text":"每回合一次。弃 1 张任意手牌，令一名角色回复 1 点生命。"},"cancer.rescue":{"name":"蟹护","text":"每轮一次。回合外弃 1 张水牌，急救一名其他濒死角色，使其回复 1 点生命。"},"scorpio.freezeAoe":{"name":"蝎毒","text":"每回合限一次。使用 1 张水牌指定目标；若目标不能交给你 1 张水牌，你可以令其获得冰冻。若目标已冰冻且未交水牌，额外发动一次毒刺。"},"scorpio.peek":{"name":"伏击","text":"摸牌前发动。查看牌堆顶部若干张牌，并将这些牌按任意顺序放回牌顶或牌底。5 人及以上看 5 张，4 人看 4 张，少于 4 人看 3 张。"},"scorpio.spoils":{"name":"毒刺","text":"每回合一次。对一名冰冻角色发动，通常需弃 1 张手牌；若该目标因蝎毒且没有手牌可额外支付而被冰冻，则本次对该目标可不支付手牌。结算时优先移除 1 点护甲、圣盾或一件防具；若无可移除对象，则造成 1 点普通伤害。"},"pisces.observeTide":{"name":"观潮","text":"出牌阶段每回合一次，自行选择任意数量的手牌弃置，再摸等量牌。没有牌数上限，确认前可调整或取消选择。"},"pisces.balance":{"name":"平潮","text":"选择两名角色，弃等同生命差的水牌，双方生命调整为平均值向下取整；造成生命损耗会影响回梦补牌。"},"pisces.dream":{"name":"回梦","text":"被动。弃牌阶段结束后摸 1 张牌；若本回合平潮造成过生命变化，则改为摸 2 张牌。"},"taurus.guard":{"name":"牛守","text":"回合开始时，可以指定一名其他角色作为守护目标。直到你的下个回合开始前，该角色受到伤害时，你可以弃 1 张手牌，替其承担此次伤害。每轮限一次。"},"taurus.thickSkin":{"name":"厚皮","text":"被动。成功承伤后，摸 1 张牌；当你损失护甲时，可以弃 1 张牌，令伤害来源获得沉默。若来源已有沉默，则沉默部分不生效。"},"taurus.armor":{"name":"筑甲","text":"每回合一次。弃 1 张土牌，令自己获得 1 点护甲，不能超过护甲上限。"},"virgo.purify":{"name":"净化","text":"主动回合限一次。弃 1 张土牌指定角色：移除其全部普通异常；若其没有普通异常，则获得一次异常免疫。感染模式中可改为只移除感染。"},"virgo.domain":{"name":"净域","text":"被动。每回合一次，受到卡牌伤害后，可以选择发动；发动后，本回合剩余时间免疫所有卡牌伤害，技能伤害与神圣伤害仍正常结算。若本次不发动，之后再次满足条件时仍可选择。"},"virgo.discipline":{"name":"戒律","text":"被动。其他角色使用 AOE 或多目标牌/技能且你成为目标时，你可以对来源造成 1 点普通伤害。每次符合条件的结算均可选择发动，不设每回合次数限制。"},"infection.bossDrain":{"name":"月蚀汲取","text":"被动。Boss 主动回合首次对其他角色造成实际生命伤害后，回复 1 点生命并摸 1 张牌；满血时仍摸牌并消耗本回合触发次数。"},"infection.bossCommand":{"name":"蚀月战令","text":"Boss 开局额外摸 2 张牌。每个主动回合限一次，选择一项：本回合可额外使用 1 张基础攻击牌；或令本回合 1 张基础攻击牌额外指定 1 个目标。"},"infection.bossNoDistance":{"name":"月蚀领域","text":"被动。Boss 使用卡牌和技能无距离限制，不需要支付跨距离费用。"},"weapon.waterCodex":{"name":"潮汐法典","text":"每回合限一次，将任意 2 张手牌合成为 1 张本角色属性牌。攻击素材决定打击次数；武器素材令攻击必中且不可防御；防具素材令使用者获得 1 点护甲。"},"weapon.airCompass":{"name":"命运罗盘","text":"主动回合限一次。正式使用过 2 张不同属性牌后，选择一种属性，获得牌库中的 1 张该属性牌。"},"capricorn.unyielding":{"name":"蓄怒","text":"被动。摩羯对其他角色造成实际伤害，或承受来自其他角色的实际伤害时获得怒气；怒气没有上限。神圣伤害和自伤不增长怒气。"},"capricorn.wushuang":{"name":"重压","text":"被动。摩羯使用土属性普通攻击或土属性状态攻击时，目标需要 2 张有效防御牌才能抵消。非土牌、AOE、技能伤害、装备与功能牌伤害不触发。"},"capricorn.charge":{"name":"山崩","text":"每轮一次，弃 1 张土牌并消耗全部怒气。先令目标沉默：1 怒只沉默；3 怒再造成 1 点神圣伤害，摩羯弃全部手牌；5 怒再造成 2 点神圣伤害，双方弃全部手牌和装备。"}};
const serverVersion = "web-8fcc6163a4b8e28a";
const clientGameModes = {"test":{"seatCount":4,"playerCounts":[4],"randomCharacters":false,"characters":["aries","cancer","gemini","capricorn"],"controls":["human","ai","ai","ai"],"playerNames":["A队前锋","A队辅助","B队前锋","B队终结"]},"standard":{"seatCount":4,"playerCounts":[4,6],"randomCharacters":true,"characters":["aries","cancer","gemini","capricorn","taurus","aquarius"],"controls":["human","ai","ai","ai","ai","ai"],"playerNames":["A队前锋","A队辅助","B队前锋","B队终结"]},"infection":{"seatCount":4,"playerCounts":[4,5,6,7,8],"randomCharacters":true,"characters":["aries","cancer","aquarius","taurus","virgo","sagittarius","libra","pisces"],"controls":["human","ai","ai","ai","ai","ai","ai","ai"],"playerNames":["1号位","2号位","3号位","4号位","5号位","6号位","7号位","8号位"]}};
const allSeatIds = ['1', '2', '3', '4', '5', '6', '7', '8'];
const infoOnlySkills = new Set([
  'aries.bloodRage',
  'leo.aura',
  'gemini.extraTurn',
  'libra.elementSense',
  'libra.judgment',
  'aquarius.stormEye',
  'aquarius.windCut',
  'cancer.tideBond',
  'cancer.rescue',
  'scorpio.freezeAoe',
  'pisces.dream',
  'taurus.thickSkin',
  'gemini.windForm',
  'capricorn.unyielding',
  'capricorn.wushuang',
  'sagittarius.bowcraft',
  'sagittarius.sharpshot',
  'virgo.domain',
  'virgo.discipline',
  'infection.bossDrain',
  'infection.bossNoDistance'
]);
let state = null;
let config = { mode: "test", characters: ["aries","cancer","gemini","capricorn"], controls: ["human","ai","ai","ai"], playerCount: 4 };
let lobbyOpen = true;
let setupPaused = true;
let setupFateDrawn = false;
let setupRevealReady = false;
let setupRevealKey = '';
let setupRevealTimer = null;
const MULLIGAN_SECONDS = 8;
const MAIN_TOTAL_SECONDS = 65;
const MAIN_IDLE_SECONDS = 20;
const RESPONSE_TOTAL_SECONDS = 35;
const RESPONSE_IDLE_SECONDS = 10;
const TIMER_SPEEDUP = 5;
const FINAL_NORMAL_SECONDS = 3;
const AI_ACTION_DELAY_MS = 3000;
let mulliganDeadline = null;
let actionDeadline = null;
let actionStartedAt = null;
let finishingMulliganTimeout = false;
let mulliganChoiceInFlight = false;
let finishingActionTimeout = false;
let advancingAi = false;
let lastMulliganFocusId = '';
let error = '';
let visible = { p1: true, p2: false, p3: false, p4: false };
let selectedSkills = {};
let skillDecisionDrafts = {};
let libraHarmonyDrafts = {};
let piscesBalanceDrafts = {};
let skillInfoAutoHideTimer = null;
let ariesRamDrafts = {};
let leoRoarDrafts = {};
let leoOrderDrafts = {};
let taurusArmorDrafts = {};
let stealDrafts = {};
let aquariusChaliceDrafts = {};
let aquariusMassHealDrafts = {};
let sagittariusSeekDrafts = {};
let virgoPurifyDrafts = {};
let peekDrafts = {};
let spoilsDrafts = {};
let targetDrafts = {};
let selectedEquipment = {};
let inspectedPlayerId = '';
let inspectedSection = 'skills';
let waterCodexDrafts = {};
let piscesObserveTideDrafts = {};
let previousState = null;
let latestEffect = null;
let hitAudioContext = null;
let lastHitSoundKey = '';
let draggedCard = null;
let selectedCard = null;
let distanceCostDraft = null;
let leoOrderPaymentDraft = null;
let waterStealDraft = null;
let airDismantleDraft = null;
let discardDrafts = {};
let aiAdvanceNotBefore = 0;
let aiAdvanceDelayKey = '';
let localHumanPlayerId = "p1";
let settlementStatsExpanded = false;
let stageLogOpen = false;
let seatSkillTip = null;
let seatSkillTipTimer = null;
let clientMatchId = '';

function cardText(card) {
  const kinds = { normalAttack: '普攻', statusAttack: '状态', energy: '星能', utility: '功能', aoe: 'AOE', weapon: '武器', armor: '防具', sun: '太阳', moon: '月亮' };
  return card.name + ' · ' + kinds[card.kind];
}

function statuses(player) {
  const keys = Object.keys(player.statuses || {});
  return keys.length ? keys.join(' / ') : '无';
}

function shouldShowRage(player) {
  return player.characterId === 'capricorn';
}

function isBasicAttackCard(card) {
  return card.kind === 'normalAttack' || card.kind === 'statusAttack';
}

function basicAttackLimit(player) {
  const commandBonus = player.flags?.infectionBossCommandMode === 'extraAttack' ? 1 : 0;
  return player.equipment.weapon?.element === 'fire' ? Number.POSITIVE_INFINITY : 1 + commandBonus;
}

function canPlayMoreBasicAttacks(player) {
  return player.flags.basicAttackCount < basicAttackLimit(player);
}

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const ELEMENT_VISUALS = {
  fire: { label: '火', icon: '炎', className: 'fire', hint: '爆发伤害' },
  water: { label: '水', icon: '潮', className: 'water', hint: '冻结控制' },
  air: { label: '风', icon: '风', className: 'air', hint: '致盲机动' },
  earth: { label: '土', icon: '岩', className: 'earth', hint: '沉默防护' }
};
const FALLBACK_VISUALS = {
  utility: { label: '功能', icon: '策', className: 'utility', hint: '战术功能' },
  ritual: { label: '仪式', icon: '净', className: 'ritual', hint: '净化或感染' },
  aoe: { label: 'AOE', icon: '域', className: 'aoe', hint: '群体攻击' },
  weapon: { label: '武器', icon: '武', className: 'weapon', hint: '装备武器' },
  armor: { label: '防具', icon: '甲', className: 'armor', hint: '装备防具' },
  sun: { label: '太阳', icon: '日', className: 'sun', hint: '回血 · 急救 · 防御' },
  moon: { label: '月亮', icon: '月', className: 'moon', hint: '反击或完美防御' },
  energy: { label: '星能', icon: '星', className: 'energy', hint: '任意属性蓄能' }
};
const KIND_LABELS = {
  normalAttack: '普通攻击',
  statusAttack: '状态攻击',
  energy: '星能',
  ritual: '仪式',
  utility: '功能',
  aoe: 'AOE',
  weapon: '武器',
  armor: '防具',
  sun: '太阳',
  moon: '月亮'
};
const CHARACTER_ELEMENTS = {
  aries: 'fire',
  leo: 'fire',
  gemini: 'air',
  libra: 'air',
  aquarius: 'air',
  cancer: 'water',
  scorpio: 'water',
  pisces: 'water',
  taurus: 'earth',
  capricorn: 'earth',
  sagittarius: 'fire',
  virgo: 'earth'
};

function safeText(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => HTML_ESCAPES[char]);
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function assetUrl(folder, name, ext) {
  return '/zodiac-war-playtest/assets/' + folder + '/' + encodeURIComponent(name) + '.' + ext;
}

function assetUrls(folder, names) {
  // 优先 webp（cards/characters 已转 webp，体积约为原 PNG 的 1/7），其余扩展名作为回退。
  // 对未转换的目录（如 assets/ui，仍是 png）无副作用——首个地址 404 后由 onerror 回退。
  return uniqueValues(names).flatMap(name => ['webp', 'png', 'jpg', 'jpeg'].map(ext => assetUrl(folder, name, ext)));
}

function fallbackAssetImage(image) {
  const fallbacks = (image.dataset.fallbacks || '').split('|').filter(Boolean);
  const next = fallbacks.shift();
  if (next) {
    image.dataset.fallbacks = fallbacks.join('|');
    image.src = next;
    return;
  }
  image.remove();
}

function assetImageHtml(className, urls, altText) {
  const [first, ...fallbacks] = urls;
  if (!first) return '';
  return '<img class="' + safeText(className) + '" src="' + safeText(first) + '" data-fallbacks="' + safeText(fallbacks.join('|')) + '" alt="' + safeText(altText) + '" loading="lazy" onerror="fallbackAssetImage(this)" />';
}

function kindLabel(card) {
  return KIND_LABELS[card.kind] || card.kind;
}

function effectiveCardForView(player, card) {
  if (!player || card?.kind !== 'ritual' || state?.mode !== 'infection') return card;
  const infected = player.factionId === 'infected';
  return {
    ...card,
    name: (ELEMENT_VISUALS[card.element]?.label || '') + (infected ? '感染牌' : '净化仪式')
  };
}

function battleDisplayName(player) {
  const visual = characterVisual(player);
  if (state?.mode === 'infection') {
    return (player.factionId === 'infected' ? '感染方' : '幸存者') + visual.name;
  }
  return player.teamId + '队' + visual.name;
}

function visualForCard(card) {
  if (card.element && ELEMENT_VISUALS[card.element]) return ELEMENT_VISUALS[card.element];
  return FALLBACK_VISUALS[card.kind] || { label: '牌', icon: '牌', className: 'utility', hint: '按牌面结算' };
}

function cardAssetNames(card) {
  if (!card) return [];
  const kindSlug = {
    normalAttack: 'normal',
    statusAttack: 'status',
    energy: 'energy',
    ritual: 'ritual',
    aoe: 'aoe',
    utility: 'utility',
    weapon: 'weapon',
    armor: 'armor',
  }[card.kind];
  return uniqueValues([
    card.id,
    card.kind === 'sun' ? 'sun' : '',
    card.kind === 'moon' ? 'moon' : '',
    card.element && kindSlug ? card.element + '-' + kindSlug : '',
  ]);
}

function cardAssetUrls(card) {
  const textlessName = cardAssetNames(card).find(name => /^(sun|moon|(fire|water|air|earth)-(normal|status|energy|aoe|utility|weapon|armor))$/.test(name));
  if (textlessName) return [assetUrl('cards-textless-v1', textlessName, 'webp')];
  return uniqueValues(cardAssetNames(card).map(name => assetUrl('cards-v10', name, 'webp')).concat(assetUrls('cards', cardAssetNames(card))));
}

function characterAssetUrls(characterId) {
  return [assetUrl('portraits-v11', characterId + '-640', 'webp')];
}

function cardEffectText(card) {
  if (card.fusion) {
    const effects = [];
    if (card.fusion.attackCount >= 2) effects.push('包含 2 张攻击素材，命中时独立结算两次攻击与防御');
    if (card.fusion.grantsArmor) effects.push('使用时获得 1 点护甲');
    if (card.fusion.sureHit) {
      effects.push(card.fusion.attackCount > 0
        ? '本牌必中且不可防御，并无视致盲'
        : '本牌不造成攻击，改为获得持续“必中”；下次普通攻击必中且不可防御');
    }
    if (!card.fusion.sureHit && (card.kind === 'statusAttack' || card.kind === 'aoe')) {
      effects.push('只能用同属性普通攻击或太阳/月亮完美防御');
    }
    return '潮汐合成牌。' + effects.join('；') + '。';
  }
  if (card.kind === 'normalAttack') return '回合内发起攻击；回合外可作为防御牌。';
  if (card.kind === 'statusAttack') return '命中后造成伤害并附加异常；同属性防御可完美防御。';
  if (card.kind === 'energy') return '主动使用任意属性星能后，强化下一张同星能属性的普通攻击或状态攻击伤害；仅在角色濒死阶段可用于急救，阵亡判定后不能急救。';
  if (card.kind === 'ritual') return card.name.includes('感染牌')
    ? '无距离指定一名尚未感染的幸存者施加感染；目标可用太阳或净化仪式抵消。'
    : '无距离移除一名幸存者的感染；也可响应并抵消感染牌。';
  if (card.kind === 'aoe') return '对所有敌方角色结算一次属性攻击。';
  if (card.kind === 'weapon') return '装备到武器槽，提供攻击相关效果。';
  if (card.kind === 'armor') return '装备到防具槽，提供防御相关效果。';
  if (card.kind === 'sun') return '主动使用：指定角色回复 1 点并净化，自己摸 1 张本属性牌；仅在角色濒死阶段可用于急救，阵亡判定后不能急救；也可完美防御。';
  if (card.kind === 'moon') return '主动使用：弃目标 1 张牌并沉默；也可在自己攻击结算时令本次伤害 +1，或完美防御反击。';
  return '功能牌，按当前规则文本结算。';
}

function equipmentEffectText(card) {
  if (!card) return '未装备。';
  if (card.kind === 'weapon') {
    if (card.element === 'fire') return '流火机括：装备期间，主动回合打出普通攻击牌和状态攻击牌不受次数限制；装备武器后，跨距离输出不再支付额外手牌。';
    if (card.element === 'water') return '潮汐法典：每回合限一次，将任意 2 张手牌合成为 1 张本角色属性牌。攻击素材决定打击次数；武器素材令攻击必中且不可防御；防具素材令使用者获得 1 点护甲。';
    if (card.element === 'air') return '命运罗盘：主动回合限一次，正式使用过 2 张不同属性牌后，选择一种属性并获得牌库中的 1 张该属性牌。';
    if (card.element === 'earth') return '撼岳锤：主动回合限一次。首次普通攻击被防御时，目标须额外交出 1 张手牌，否则防御无效。';
  }
  if (card.kind === 'armor') {
    if (card.element === 'fire') return '火焰披风：每回合首次受到伤害后，伤害来源获得灼烧。';
    if (card.element === 'water') return '寒冰护甲：受到实际伤害后，限制伤害来源本回合继续输出。';
    if (card.element === 'air') return '飓风斗篷：受到首次实际伤害后，令伤害来源弃 1 张牌。';
    if (card.element === 'earth') return '石壁：单次伤害最多为 1；每轮首次受到伤害再减 1；离开装备区时，存活的装备者回复 1 点生命。';
  }
  return cardEffectText(card);
}

function renderHandCard(player, card, enabled, handler, dragAttrs = '', extraClass = '', inlineStyle = '') {
  card = effectiveCardForView(player, card);
  const visual = visualForCard(card);
  const elementText = card.element && ELEMENT_VISUALS[card.element] ? ELEMENT_VISUALS[card.element].label : visual.label;
  const cardImages = cardAssetUrls(card);
  const classes = ['card', visual.className, 'kind-' + card.kind, cardImages.length ? 'hasCardArt' : '', dragAttrs ? 'dragTarget' : '', extraClass].filter(Boolean).join(' ');
  const click = handler ? ' onclick="' + handler + '"' : '';
  const drag = dragAttrs ? ' ' + dragAttrs : '';
  const style = inlineStyle ? ' style="' + inlineStyle + '"' : '';
  return '<button class="' + classes + '" data-player-id="' + safeText(player.id) + '" data-card-id="' + safeText(card.id) + '"' + style + ' ' + (enabled ? '' : 'disabled') + drag + click + '>' +
    assetImageHtml('cardArt', cardImages, card.name) +
    '<div class="cardTop"><span>' + safeText(elementText) + '</span><span>' + safeText(kindLabel(card)) + '</span></div>' +
    '<div class="cardIcon">' + safeText(visual.icon) + '</div>' +
    '<div class="cardName">' + safeText(card.name) + '</div>' +
    '<div class="cardEffect">' + safeText(cardEffectText(card)) + '</div>' +
    '<div class="cardBottom"><span>' + safeText(visual.hint) + '</span></div>' +
    '</button>';
}

function cardNeedsDragTarget(card) {
  return cardNeedsTarget(card);
}

function cardNeedsTarget(card) {
  if (card.kind === 'weapon' || card.kind === 'armor') return false;
  if (card.kind === 'normalAttack' || card.kind === 'statusAttack') return true;
  if (card.kind === 'aoe') return true;
  if (card.kind === 'sun') return true;
  if (card.kind === 'moon') return true;
  if (card.kind === 'ritual') return true;
  if (card.kind === 'utility') return card.element !== 'earth';
  return false;
}

function selectedCardPlayer() {
  return selectedCard ? state?.players.find(candidate => candidate.id === selectedCard.playerId) : null;
}

function selectedCardObject() {
  const player = selectedCardPlayer();
  return player?.hand.find(candidate => candidate.id === selectedCard.cardId) || null;
}

function startCardDrag(event, playerId, cardId) {
  const rect = event.currentTarget.getBoundingClientRect();
  draggedCard = {
    playerId,
    cardId,
    startX: rect.left + rect.width / 2,
    startY: rect.top + rect.height / 2
  };
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify(draggedCard));
  }
  updateDropReadyTargets();
  updateDragGuide(event);
}

function clearCardDrag() {
  draggedCard = null;
  hideDragGuide();
  resetDropReadyTargets();
}

function resetDropReadyTargets() {
  document.querySelectorAll('.seatCard.dropReady, .seatCard.dropTarget, .stageFocusCard.dropReady, .stageFocusCard.dropTarget').forEach(el => {
    el.classList.remove('dropReady');
    el.classList.remove('dropTarget');
  });
}

function updateDropReadyTargets() {
  document.querySelectorAll('.seatCard[data-player-id], .stageFocusCard[data-player-id]').forEach(el => {
    if (canDropCardOnSeat(draggedCard, el.dataset.playerId)) {
      el.classList.add('dropReady');
    } else {
      el.classList.remove('dropReady');
    }
  });
}

function updateDragGuide(event) {
  if (!draggedCard) return;
  const layer = document.getElementById('dragGuideLayer');
  const line = document.getElementById('dragGuideLine');
  const halo = document.getElementById('dragGuideHalo');
  if (!layer || !line || !halo) return;
  layer.classList.add('active');
  const endX = event.clientX ?? draggedCard.startX;
  const endY = event.clientY ?? draggedCard.startY;
  line.setAttribute('x1', String(draggedCard.startX));
  line.setAttribute('y1', String(draggedCard.startY));
  line.setAttribute('x2', String(endX));
  line.setAttribute('y2', String(endY));
  halo.setAttribute('cx', String(endX));
  halo.setAttribute('cy', String(endY));
}

function hideDragGuide() {
  const layer = document.getElementById('dragGuideLayer');
  if (layer) layer.classList.remove('active');
  const line = document.getElementById('dragGuideLine');
  if (line) line.classList.remove('targeting');
}

function updateSelectedCardGuide(event) {
  if (window.TabletopV10) return hideDragGuide();
  if (!selectedCard) {
    if (!draggedCard) hideDragGuide();
    return;
  }
  const card = selectedCardObject();
  if (!card || card.kind === 'aoe' || !cardNeedsTarget(card)) return hideDragGuide();
  const source = document.querySelector('.card.selectedCard');
  const layer = document.getElementById('dragGuideLayer');
  const line = document.getElementById('dragGuideLine');
  const halo = document.getElementById('dragGuideHalo');
  if (!source || !layer || !line || !halo) return;
  const rect = source.getBoundingClientRect();
  const x1 = rect.left + rect.width / 2;
  const y1 = rect.top + rect.height / 2;
  const x2 = event.clientX ?? x1;
  const y2 = event.clientY ?? y1;
  layer.classList.add('active');
  line.classList.add('targeting');
  line.setAttribute('x1', String(x1));
  line.setAttribute('y1', String(y1));
  line.setAttribute('x2', String(x2));
  line.setAttribute('y2', String(y2));
  halo.setAttribute('cx', String(x2));
  halo.setAttribute('cy', String(y2));
}

function canDropCardOnSeat(payload, targetId) {
  if (!payload || !state || state.phase !== 'main') return false;
  const player = state.players.find(candidate => candidate.id === payload.playerId);
  const target = state.players.find(candidate => candidate.id === targetId);
  const card = player?.hand.find(candidate => candidate.id === payload.cardId);
  if (!player || !target || !card) return false;
  if (player.id !== state.activePlayerId) return false;
  if (target.hp <= 0 || target.eliminated) return false;
  if (card.kind === 'sun') {
    if (state.mode === 'infection') return target.id === player.id && canClickHandCard(player, card, true, false, false);
    return canClickHandCard(player, card, true, false, false);
  }
  if (card.kind === 'ritual' && state.mode === 'infection') {
    const validTarget = player.factionId === 'infected'
      ? target.factionId === 'survivor' && !target.infected
      : target.factionId === 'survivor' && target.infected;
    return validTarget && canClickHandCard(player, card, true, false, false);
  }
  if (state.mode === 'infection') {
    if (target.id === player.id) return false;
  } else if (target.teamId === player.teamId) {
    return false;
  }
  if (card.kind === 'utility' && card.element === 'water' && !canWaterStealTarget(player, target)) return false;
  return cardNeedsTarget(card) && canClickHandCard(player, card, true, false, false);
}

function targetIdsForSelectedCard() {
  const player = selectedCardPlayer();
  const card = selectedCardObject();
  if (!player || !card) return [];
  if (card.kind === 'aoe') {
    return enemiesOf(player).filter(enemy => canDropCardOnSeat(selectedCard, enemy.id)).map(enemy => enemy.id);
  }
  if (canBossBasicAttackAddTarget(player, card)) return selectedCard?.targetIds || [];
  return [];
}

function canBossBasicAttackAddTarget(player, card) {
  return Boolean(
    isInitialInfectionBoss(player) &&
    (card?.kind === 'normalAttack' || card?.kind === 'statusAttack') &&
    player.flags?.infectionBossCommandMode === 'extraTarget' &&
    !player.flags?.usedInfectionBossExtraTarget
  );
}

function circularSeatDistance(player, target) {
  if (!state || !player || !target) return Number.POSITIVE_INFINITY;
  const seats = state.players.filter(candidate => candidate.hp > 0).sort(
    (left, right) => left.seatIndex - right.seatIndex || left.id.localeCompare(right.id)
  );
  const playerIndex = seats.findIndex(candidate => candidate.id === player.id);
  const targetIndex = seats.findIndex(candidate => candidate.id === target.id);
  if (playerIndex < 0 || targetIndex < 0) return Number.POSITIVE_INFINITY;
  const direct = Math.abs(playerIndex - targetIndex);
  return Math.min(direct, seats.length - direct);
}

function isCrossDistanceTarget(player, target) {
  if (!state || state.players.length <= 2 || !player || !target) return false;
  if (state.mode !== 'infection' && player.teamId === target.teamId) return false;
  return circularSeatDistance(player, target) > 1;
}

function isInitialInfectionBoss(player) {
  return Boolean(
    state?.mode === 'infection' &&
    player?.infectionRole === 'initial' &&
    state.infection?.bossPlayerId === player.id
  );
}

function canWaterStealTarget(player, target) {
  if (isInitialInfectionBoss(player)) return true;
  return !isCrossDistanceTarget(player, target);
}

function needsDistanceCostForTarget(player, card, target) {
  if (!player || !card || !target) return false;
  if (isInitialInfectionBoss(player)) return false;
  if (!isCrossDistanceTarget(player, target)) return false;
  if (player.equipment.weapon) return false;
  if (card.kind === 'utility' && card.element === 'water') return false;
  if (card.kind === 'normalAttack') return true;
  if (card.kind === 'statusAttack') return true;
  return false;
}

function leoOrderReceiverForTargets(player, targets) {
  if (!state || !player || !targets?.length) return null;
  return state.players.find(candidate =>
    candidate.characterId === 'leo' &&
    candidate.hp > 0 &&
    candidate.flags?.leoOrderTargetId === player.id &&
    targets.some(target => target.id === candidate.id)
  ) || null;
}

function targetsForCardPlay(player, card, targetId, targetIds = []) {
  if (!player || !card) return [];
  if (card.kind === 'aoe') {
    return enemiesOf(player).filter(enemy => enemy.hp > 0 && !player.flags?.iceArmorBlockedTargetIds?.includes(enemy.id));
  }
  const requestedIds = targetIds.length > 0 ? targetIds : [targetId];
  return [...new Set(requestedIds)]
    .map(id => state.players.find(candidate => candidate.id === id))
    .filter(Boolean);
}

function needsLeoOrderPayment(player, card, targets) {
  return Boolean(leoOrderReceiverForTargets(player, targets));
}

function leoOrderPaymentCandidates(player, reservedCardIds = []) {
  return player.hand.filter(card => !reservedCardIds.includes(card.id));
}

function beginLeoOrderPaymentDraft(player, card, targetId, extraCostCardId = '', selectedCardId = '', targetIds = []) {
  const targets = targetsForCardPlay(player, card, targetId, targetIds);
  const receiver = leoOrderReceiverForTargets(player, targets);
  if (!receiver) return false;
  const reservedCardIds = [card.id, extraCostCardId].filter(Boolean);
  const candidates = leoOrderPaymentCandidates(player, reservedCardIds);
  if (candidates.length === 0) {
    error = '王令要求先交给狮子 1 张牌，但当前没有可支付的手牌。';
    clearSelectedCard();
    render();
    return true;
  }
  leoOrderPaymentDraft = {
    playerId: player.id,
    cardId: card.id,
    targetId,
    extraCostCardId,
    selectedCardId,
    targetIds,
    receiverId: receiver.id,
    reservedCardIds
  };
  clearSelectedCard();
  render();
  return true;
}

function needsSkillDistanceCost(player, skillId, target) {
  if (!player || !target) return false;
  if (isInitialInfectionBoss(player)) return false;
  if (!isCrossDistanceTarget(player, target)) return false;
  if (player.equipment.weapon) return false;
  return ['aries.ram', 'capricorn.charge'].includes(skillId);
}

function distanceCostCandidates(player, cardOrDraft) {
  if (!player) return [];
  const reserved = new Set();
  if (cardOrDraft?.id) reserved.add(cardOrDraft.id);
  (cardOrDraft?.cardIds || []).forEach(id => reserved.add(id));
  return player.hand.filter(card => !reserved.has(card.id));
}

function waterStealTargets(target) {
  if (!target) return [];
  return target.hand.map((card, index) => ({
    id: card.id,
    label: '手牌 ' + (index + 1),
    detail: '卡背'
  }));
}

function needsWaterStealChoice(card, target) {
  return card?.kind === 'utility' && card.element === 'water' && waterStealTargets(target).length > 0;
}

function airDismantleTargets(target) {
  if (!target) return [];
  const handTargets = target.hand.map((card, index) => ({
    id: card.id,
    label: '手牌 ' + (index + 1),
    detail: '卡背'
  }));
  const equipmentTargets = [];
  if (target.equipment.weapon) {
    equipmentTargets.push({
      id: target.equipment.weapon.id,
      label: '武器',
      detail: target.equipment.weapon.name
    });
  }
  if (target.equipment.armor) {
    equipmentTargets.push({
      id: target.equipment.armor.id,
      label: '防具',
      detail: target.equipment.armor.name
    });
  }
  return [...handTargets, ...equipmentTargets];
}

function needsAirDismantleChoice(card, target) {
  return card?.kind === 'utility' && card.element === 'air' && airDismantleTargets(target).length > 0;
}

function canReleaseSelectedCardOnSeat(targetId) {
  const card = selectedCardObject();
  if (!card || card.kind === 'aoe') return false;
  return canDropCardOnSeat(selectedCard, targetId);
}

function canReleaseSkillCostOnSeat(playerId, targetId) {
  const player = state?.players.find(candidate => candidate.id === playerId);
  const target = state?.players.find(candidate => candidate.id === targetId);
  const draft = activeSkillCostDraft(player);
  if (!player || !target || !draft?.requiresTarget) return false;
  if (draft.skillId === 'leo.roar') {
    return draft.costCardIds.length === 1 && target.hp > 0 && !target.eliminated && target.id !== player.id;
  }
  if (!draft.ready) return false;
  if (draft.skillId === 'aries.ram' || draft.skillId === 'aries.burnSoul') {
    return target.hp > 0 && (state.mode === 'infection' ? target.id !== player.id : target.teamId !== player.teamId);
  }
  if (draft.skillId === 'leo.order') {
    return target.hp > 0 && target.id !== player.id;
  }
  if (draft.skillId === 'virgo.purify') {
    return target.hp > 0 && !target.eliminated;
  }
  return false;
}

function releaseSkillCostOnSeat(playerId, targetId) {
  if (!canReleaseSkillCostOnSeat(playerId, targetId)) return;
  const player = state.players.find(candidate => candidate.id === playerId);
  if (activeSkillCostDraft(player)?.skillId === 'leo.roar') {
    return toggleLeoRoarTarget(playerId, targetId);
  }
  return confirmActiveSkillCost(playerId, targetId);
}

function isLeoRoarTargetSelected(playerId, targetId) {
  return Boolean(leoRoarDrafts[playerId]?.targetIds?.includes(targetId));
}

function toggleLeoRoarTarget(playerId, targetId) {
  if (!canReleaseSkillCostOnSeat(playerId, targetId)) return;
  const player = state.players.find(candidate => candidate.id === playerId);
  const draft = activeSkillCostDraft(player);
  if (!player || draft?.skillId !== 'leo.roar') return;
  const selected = draft.targetIds || [];
  const targetIds = selected.includes(targetId)
    ? selected.filter(id => id !== targetId)
    : selected.length < 3
      ? [...selected, targetId]
      : selected;
  if (!selected.includes(targetId) && selected.length >= 3) {
    error = '狮吼最多选择 3 个目标；可先取消一个已选目标。';
  } else {
    error = '';
  }
  leoRoarDrafts[playerId] = { costCardIds: draft.costCardIds, targetIds };
  render();
}

function clearSelectedCard() {
  selectedCard = null;
  hideDragGuide();
  requestAnimationFrame(updatePersistentActionGuide);
}

function selectCardForTarget(playerId, cardId) {
  const player = state?.players.find(candidate => candidate.id === playerId);
  const card = player?.hand.find(candidate => candidate.id === cardId);
  if (!player || !card) return;
  if (selectedCard?.playerId === playerId && selectedCard?.cardId === cardId && card.kind === 'aoe') {
    return releaseSelectedAoeCard();
  }
  selectedCard = { playerId, cardId, targetIds: [] };
  render();
  requestAnimationFrame(updatePersistentActionGuide);
}

function releaseSelectedCardOnSeat(targetId) {
  return window.TabletopV10.queueTarget(targetId);
}

function commitSelectedCardOnSeat(targetId) {
  if (!canReleaseSelectedCardOnSeat(targetId)) return;
  const player = selectedCardPlayer();
  const card = selectedCardObject();
  const target = state.players.find(candidate => candidate.id === targetId);
  if (canBossBasicAttackAddTarget(player, card)) {
    const legalTargets = enemiesOf(player).filter(candidate => canDropCardOnSeat(selectedCard, candidate.id));
    if (legalTargets.length >= 2) {
      const chosenTargetIds = selectedCard?.targetIds || [];
      if (chosenTargetIds.includes(targetId)) {
        selectedCard = { ...selectedCard, targetIds: [] };
        render();
        requestAnimationFrame(updatePersistentActionGuide);
        return;
      }
      if (chosenTargetIds.length === 0) {
        selectedCard = { ...selectedCard, targetIds: [targetId] };
        render();
        requestAnimationFrame(updatePersistentActionGuide);
        return;
      }
      const targetIds = [chosenTargetIds[0], targetId];
      clearSelectedCard();
      return play(player.id, card, targetIds[0], '', '', '', targetIds);
    }
  }
  if (needsWaterStealChoice(card, target)) {
    waterStealDraft = { playerId: player.id, cardId: card.id, targetId };
    clearSelectedCard();
    render();
    return;
  }
  if (needsDistanceCostForTarget(player, card, target)) {
    const candidates = distanceCostCandidates(player, card);
    if (candidates.length === 0) {
      error = '跨距离需要额外弃 1 张手牌，但当前没有可支付的手牌。';
      clearSelectedCard();
      render();
      return;
    }
    distanceCostDraft = { type: 'playCard', playerId: player.id, cardId: card.id, targetId };
    clearSelectedCard();
    render();
    return;
  }
  if (needsAirDismantleChoice(card, target)) {
    airDismantleDraft = { playerId: player.id, cardId: card.id, targetId };
    clearSelectedCard();
    render();
    return;
  }
  clearSelectedCard();
  return play(player.id, card, targetId);
}

function handleSeatEquipmentClick(playerId) {
  if (canReleaseSelectedCardOnSeat(playerId)) return releaseSelectedCardOnSeat(playerId);
  const active = state?.players.find(candidate => candidate.id === state.activePlayerId);
  if (active && canReleaseSkillCostOnSeat(active.id, playerId)) {
    return releaseSkillCostOnSeat(active.id, playerId);
  }
  return openPlayerInspector(playerId, 'equipment');
}

function releaseSelectedAoeCard() {
  const player = selectedCardPlayer();
  const card = selectedCardObject();
  const targetId = targetIdsForSelectedCard()[0];
  if (!player || !card || !targetId) return;
  clearSelectedCard();
  return play(player.id, card, targetId);
}

function allowCardDrop(event, targetId) {
  if (!canDropCardOnSeat(draggedCard, targetId)) return;
  event.preventDefault();
  event.currentTarget.classList.add('dropReady');
  event.currentTarget.classList.add('dropTarget');
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  updateDragGuide(event);
}

function leaveCardDrop(event) {
  event.currentTarget.classList.remove('dropTarget');
}

function dropCardOnSeat(event, targetId) {
  event.preventDefault();
  event.currentTarget.classList.remove('dropTarget');
  let payload = draggedCard;
  if (!payload && event.dataTransfer) {
    try {
      payload = JSON.parse(event.dataTransfer.getData('text/plain'));
    } catch {
      payload = null;
    }
  }
  if (!canDropCardOnSeat(payload, targetId)) {
    clearCardDrag();
    return;
  }
  const player = state.players.find(candidate => candidate.id === payload.playerId);
  const card = player.hand.find(candidate => candidate.id === payload.cardId);
  clearCardDrag();
  return play(player.id, card, targetId);
}

function characterVisual(player) {
  const elementKey = CHARACTER_ELEMENTS[player.characterId] || 'fire';
  const element = ELEMENT_VISUALS[elementKey];
  const name = labels[player.characterId] || player.characterId;
  return {
    className: element.className,
    elementLabel: element.label,
    sigil: name.slice(0, 2),
    name
  };
}

function hpPips(player) {
  let output = '';
  for (let index = 0; index < player.maxHp; index += 1) {
    output += '<span class="pip ' + (index < player.hp ? 'filled' : '') + '"></span>';
  }
  return output;
}

function seatRelationLabel(player, perspective) {
  if (state?.mode === 'infection') {
    return perspective && player.factionId !== perspective.factionId ? '敌' : '友';
  }
  return perspective && player.teamId !== perspective.teamId ? '敌' : '友';
}

function miniHpDrops(player) {
  let output = '';
  for (let index = 0; index < player.maxHp; index += 1) {
    output += '<span class="hpDrop ' + (index < player.hp ? 'filled' : 'empty') + '"></span>';
  }
  return '<span class="hpDrops" aria-label="生命 ' + player.hp + '/' + player.maxHp + '">' + output + '</span>';
}

function armorShield(player) {
  const armor = Math.max(0, player.armor || 0);
  return '<span class="armorShield ' + (armor > 0 ? 'filled' : 'empty') + '" aria-label="护甲 ' + armor + '">' + armor + '</span>';
}

function statusIconSvg(statusId) {
  const labels = {
    clean: '无异常',
    burn: '灼烧',
    frozen: '冰冻',
    blind: '致盲',
    silence: '沉默',
    shield: '圣盾',
    abnormalImmunity: '异常免疫',
    sureHit: '必中',
    infection: '感染'
  };
  const bodies = {
    clean: '<circle cx="12" cy="12" r="9"></circle><path d="m8 12 2.5 2.5L16.5 8.5"></path>',
    burn: '<path d="M13 2s1 4-2 6c-2 1.4-3.5 3.1-3.5 5.6A4.5 4.5 0 0 0 12 18a4.5 4.5 0 0 0 4.5-4.4c0-2.6-1.5-4.6-3.5-6.1.2 2-1 3-2 3.5"></path>',
    frozen: '<path d="M12 2v20M4 7l16 10M20 7 4 17M8 4l4 2 4-2M8 20l4-2 4 2"></path>',
    blind: '<path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5Z"></path><path d="m4 4 16 16"></path>',
    silence: '<path d="M5 10v4h3l4 3V7L8 10H5Z"></path><path d="m16 9 5 5m0-5-5 5"></path>',
    shield: '<path d="M12 2 4.5 5v6c0 5 3.2 8.5 7.5 11 4.3-2.5 7.5-6 7.5-11V5L12 2Z"></path>',
    abnormalImmunity: '<path d="M12 2 4.5 5v6c0 5 3.2 8.5 7.5 11 4.3-2.5 7.5-6 7.5-11V5L12 2Z"></path><path d="m8.5 12 2.2 2.2 4.8-5"></path>',
    sureHit: '<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="4"></circle><path d="M12 2v4M12 18v4M2 12h4M18 12h4"></path>',
    infection: '<path d="M16.5 3.5A8.5 8.5 0 1 0 20 17a7 7 0 0 1-3.5-13.5Z"></path><circle cx="15.5" cy="12" r="1.5"></circle>'
  };
  const label = labels[statusId] || statusId;
  const body = bodies[statusId] || bodies.clean;
  return '<span class="statusIcon ' + safeText(statusId) + '" title="' + safeText(label) + '" aria-label="' + safeText(label) + '">' +
    '<svg viewBox="0 0 24 24" aria-hidden="true">' + body + '</svg>' +
  '</span>';
}

function renderStatusIcons(player) {
  const ids = Object.keys(player.statuses || {}).filter((statusId) => player.statuses?.[statusId]);
  if (player.infected) ids.push('infection');
  if (ids.length === 0) ids.push('clean');
  return '<span class="statusIcons">' + ids.map(statusIconSvg).join('') + '</span>';
}

function actionTimeoutTargetId() {
  if (!state || !actionDeadline || setupPaused) return '';
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

function effectiveRemainingSeconds(startedAt, phase) {
  const profile = timerProfileForPhase(phase);
  if (!startedAt || profile.total <= 0) return 0;
  const elapsed = Math.max(0, (Date.now() - startedAt) / 1000);
  if (elapsed <= profile.idle) return Math.ceil(Math.max(0, profile.total - elapsed));
  const acceleratedSpan = Math.max(0, profile.total - profile.idle - FINAL_NORMAL_SECONDS);
  const acceleratedElapsed = Math.min(acceleratedSpan, (elapsed - profile.idle) * TIMER_SPEEDUP);
  const remainingBeforeFinal = profile.total - profile.idle - acceleratedElapsed;
  if (remainingBeforeFinal > FINAL_NORMAL_SECONDS) return Math.ceil(remainingBeforeFinal);
  const finalStart = profile.idle + acceleratedSpan / TIMER_SPEEDUP;
  return Math.ceil(Math.max(0, FINAL_NORMAL_SECONDS - Math.max(0, elapsed - finalStart)));
}

function actionTimerRemainingSeconds() {
  if (!actionDeadline) return 0;
  return effectiveRemainingSeconds(actionStartedAt, state?.phase);
}

function renderActionCountdown(player) {
  if (actionTimeoutTargetId() !== player.id) return '';
  const remaining = actionTimerRemainingSeconds();
  if (remaining <= 0 || remaining > 3) return '';
  return '<div class="turnCountdownBadge countdownUrgent" data-countdown-player-id="' + player.id + '">' + remaining + '</div>';
}

function actionPrompt(active, activeOpponent, attackSource, defenseTarget) {
  if (!state) return '';
  const skillDecision = state.pendingSkillDecisions?.[0];
  if (skillDecision) {
    const owner = state.players.find(player => player.id === skillDecision.playerId);
    return (owner?.name || '角色') + ' 正在进行技能选择，请先完成上方选择。';
  }
  if (state.phase === 'gameOver' && !state.winnerTeamId) {
    const rescuer = aiRescueReviewPlayer() || rescueReviewPlayer();
    return rescuer
      ? rescuer.name + ' 正在进行急救复核，将使用太阳或星能急救。'
      : '正在完成胜负复核。';
  }
  if (state.phase === 'mulligan') return '开局换牌：所有角色有 8 秒同时确认；未操作默认保留起手牌。';
  if (state.phase === 'draw') return active.name + ' 回合开始后，摸牌阶段前：先处理回合开始技能，再摸牌。';
  if (state.phase === 'main') {
    const skillDraft = activeSkillCostDraft(active);
    if (skillDraft?.skillId === 'leo.roar') {
      if (!skillDraft.costCardIds.length) return '狮吼：先选择 1 张火牌作为费用，再选择 1–3 名其他存活角色。';
      const names = skillDraft.targetIds.map(id => state.players.find(player => player.id === id)?.name).filter(Boolean);
      return names.length ? '狮吼：已选 ' + names.join('、') + '（' + names.length + '/3），再次点击狮吼发动。' : '狮吼：点击 1–3 名其他存活角色，再次点击狮吼发动。';
    }
    if (selectedCardObject()?.kind === 'sun' && selectedCard?.playerId === active.id) {
      const targetNames = (selectedCard.targetIds || []).map(id => state.players.find(player => player.id === id)?.name).filter(Boolean);
      return '太阳回血：' + (targetNames.length ? '已选 ' + targetNames.join('、') + '，点击确认出牌。' : state.mode === 'infection' ? '请选择自己，再确认出牌。' : '请选择回血目标（可选自己），再确认出牌。');
    }
    return active.name + ' 的出牌阶段：当前指向敌方 ' + (activeOpponent?.name || '无') + '。';
  }
  if (state.phase === 'response') {
    const pending = state.pendingAttack;
    const hitText = pending && pending.hitsPerTarget > 1
      ? '（第 ' + (pending.hitsPerTarget - pending.hitsRemaining + 1) + '/' + pending.hitsPerTarget + ' 次打击）'
      : '';
    return (defenseTarget?.name || '目标') + ' 正在响应来自 ' + (attackSource?.name || '攻击者') + ' 的攻击' + hitText + '。';
  }
  if (state.phase === 'infectionResponse') {
    const pending = state.infection?.pendingInfectionCard;
    const source = state.players.find(player => player.id === pending?.sourceId);
    const target = state.players.find(player => player.id === pending?.targetId);
    return (target?.name || '目标') + ' 正在响应 ' + (source?.name || '感染者') + ' 的感染牌。';
  }
  if (state.phase === 'rescue') {
    const pending = (state.pendingRescue || state.infection?.pendingDying);
    const target = state.players.find(player => player.id === pending?.targetId);
    const responder = state.players.find(player => player.id === pending?.currentResponderId);
    return (responder?.name || '角色') + ' 可使用太阳急救濒死的 ' + (target?.name || '幸存者') + '。';
  }
  if (state.phase === 'reward') {
    const pending = state.infection?.pendingReward;
    const rewarded = state.players.find(player => player.id === pending?.playerId);
    return (rewarded?.name || '幸存者') + ' 正在选择击杀感染者奖励。';
  }
  if (state.phase === 'hammerBreak') return (defenseTarget?.name || '防御者') + ' 需为撼岳锤额外交出 1 张手牌，否则本次防御无效。';
  if (state.phase === 'discard') return active.name + ' 的弃牌阶段：将手牌弃至体力值。';
  return active.name + ' 正在行动。';
}

function deriveLatestEffect() {
  if (!state || !previousState) return null;
  const damage = state.players
    .map(player => {
      const before = previousState.players.find(candidate => candidate.id === player.id);
      if (!before || player.hp >= before.hp) return null;
      return { targetId: player.id, amount: before.hp - player.hp };
    })
    .find(Boolean);
  if (damage) {
    return {
      sourceId: previousState.pendingAttack?.sourceId || state.pendingAttack?.sourceId || previousState.activePlayerId || state.activePlayerId,
      targetId: damage.targetId,
      text: '-' + damage.amount,
      kind: 'damage',
      at: Date.now()
    };
  }
  const healing = state.players
    .map(player => {
      const before = previousState.players.find(candidate => candidate.id === player.id);
      if (!before || player.hp <= before.hp) return null;
      return { targetId: player.id, amount: player.hp - before.hp };
    })
    .find(Boolean);
  if (healing) {
    return {
      sourceId: previousState.activePlayerId || state.activePlayerId,
      targetId: healing.targetId,
      text: '+' + healing.amount,
      kind: 'heal',
      at: Date.now()
    };
  }
  const armorChange = state.players
    .map(player => {
      const before = previousState.players.find(candidate => candidate.id === player.id);
      if (!before || player.armor === before.armor) return null;
      return { targetId: player.id, amount: Math.abs(player.armor - before.armor), gained: player.armor > before.armor };
    })
    .find(Boolean);
  if (armorChange) {
    return {
      sourceId: previousState.activePlayerId || state.activePlayerId,
      targetId: armorChange.targetId,
      text: armorChange.gained ? '+' + armorChange.amount + ' 护甲' : '护甲吸收 ' + armorChange.amount,
      kind: armorChange.gained ? 'armorGain' : 'armorBlock',
      at: Date.now()
    };
  }
  const previousAttack = previousState.pendingAttack;
  if (previousAttack && (!state.pendingAttack || state.phase !== previousState.phase)) {
    return {
      sourceId: previousAttack.sourceId,
      targetId: previousAttack.currentTargetId,
      text: '防御',
      kind: 'defense',
      at: Date.now()
    };
  }
  return null;
}

function playHitSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    hitAudioContext = hitAudioContext || new AudioContextClass();
    const audio = hitAudioContext;
    const now = audio.currentTime;
    const sampleCount = Math.max(1, Math.floor(audio.sampleRate * 0.055));
    const buffer = audio.createBuffer(1, sampleCount, audio.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < sampleCount; index += 1) {
      const fade = 1 - index / sampleCount;
      samples[index] = (Math.random() * 2 - 1) * fade;
    }
    const noise = audio.createBufferSource();
    const filter = audio.createBiquadFilter();
    const noiseGain = audio.createGain();
    noise.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.Q.setValueAtTime(0.8, now);
    noiseGain.gain.setValueAtTime(0.16, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audio.destination);
    noise.start(now);
    noise.stop(now + 0.06);
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(180, now);
    oscillator.frequency.exponentialRampToValueAtTime(72, now + 0.07);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.11);
  } catch (_error) {
    // Audio is feedback only; browser autoplay limits must not block game flow.
  }
}

function playPositiveEffectSound(kind) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    hitAudioContext = hitAudioContext || new AudioContextClass();
    const audio = hitAudioContext;
    const now = audio.currentTime;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = kind === 'heal' ? 'sine' : 'triangle';
    oscillator.frequency.setValueAtTime(kind === 'heal' ? 420 : 240, now);
    oscillator.frequency.exponentialRampToValueAtTime(kind === 'heal' ? 720 : 360, now + 0.13);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.17);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.18);
  } catch (_error) {
    // Audio is feedback only; browser autoplay limits must not block game flow.
  }
}

function playLatestEffectSound() {
  if (!latestEffect || !['damage', 'heal', 'armorGain', 'armorBlock'].includes(latestEffect.kind)) return;
  const key = [latestEffect.targetId, latestEffect.text, latestEffect.at].join(':');
  if (key === lastHitSoundKey) return;
  lastHitSoundKey = key;
  if (latestEffect.kind === 'damage') playHitSound();
  else playPositiveEffectSound(latestEffect.kind);
}

function effectFeedbackFor(player) {
  if (!latestEffect || latestEffect.targetId !== player.id) return { className: '', markup: '' };
  if (latestEffect.kind === 'damage') {
    return {
      className: ' damageHit',
      markup: '<div class="damageFlash"></div><div class="slashMark"></div><div class="floatText damageText">' + safeText(latestEffect.text) + '</div>'
    };
  }
  if (latestEffect.kind === 'heal') {
    return {
      className: ' healHit',
      markup: '<div class="healFlash"></div><div class="healPulseMark"></div><div class="floatText healText">' + safeText(latestEffect.text) + '</div>'
    };
  }
  if (latestEffect.kind === 'armorGain' || latestEffect.kind === 'armorBlock') {
    return {
      className: ' armorHit',
      markup: '<div class="armorFlash"></div><div class="armorPulseMark">盾</div><div class="floatText armorText">' + safeText(latestEffect.text) + '</div>'
    };
  }
  return { className: '', markup: '' };
}

function targetIdsForDisplay(display) {
  if (!display) return [];
  if (Array.isArray(display.targetIds) && display.targetIds.length > 0) return display.targetIds;
  return display.targetId ? [display.targetId] : [];
}

function currentActionGuide() {
  if (!state || setupPaused || lobbyOpen || state.phase === 'mulligan' || state.phase === 'gameOver') return null;
  const selected = selectedCardObject();
  const selectedTargets = selected?.kind === 'aoe' ? targetIdsForSelectedCard() : (selectedCard?.targetIds || []);
  if (selected && selectedTargets.length > 0) {
    return {
      sourceId: selectedCard.playerId,
      targetIds: selectedTargets,
      isAoe: selected.kind === 'aoe' || selectedTargets.length > 1,
      preview: true
    };
  }
  const displays = state?.playedCards?.cards || [];
  const played = [...displays].reverse().find(display => targetIdsForDisplay(display).length > 0);
  if (played) {
    if (!state.pendingAttack && !state.infection?.pendingInfectionCard) {
      const key = played.playerId + ':' + played.card.id + ':' + targetIdsForDisplay(played).join(',');
      const ui = window.TabletopV10;
      if (ui.resolutionKey !== key) {
        ui.resolutionKey = key;
        ui.resolutionUntil = Date.now() + 1800;
        clearTimeout(ui.resolutionTimer);
        ui.resolutionTimer = setTimeout(updatePersistentActionGuide, 1810);
      }
      if (Date.now() > ui.resolutionUntil) return null;
    }
    return {
      sourceId: played.playerId,
      targetIds: targetIdsForDisplay(played),
      isAoe: played.card.kind === 'aoe'
    };
  }
  if (state?.pendingAttack) {
    const pendingTargets = state.pendingAttack.card.kind === 'aoe'
      ? state.pendingAttack.targetIds
      : [state.pendingAttack.currentTargetId];
    return {
      sourceId: state.pendingAttack.sourceId,
      targetIds: pendingTargets,
      isAoe: state.pendingAttack.card.kind === 'aoe'
    };
  }
  if (state?.infection?.pendingInfectionCard) {
    return {
      sourceId: state.infection.pendingInfectionCard.sourceId,
      targetIds: [state.infection.pendingInfectionCard.targetId],
      isAoe: false
    };
  }
  if (latestEffect?.kind === 'damage' && latestEffect?.sourceId && latestEffect?.targetId) {
    return { sourceId: latestEffect.sourceId, targetIds: [latestEffect.targetId], fromCenter: false, isAoe: false };
  }
  return null;
}

function quadraticPath(x1, y1, x2, y2, offset) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.max(1, Math.hypot(dx, dy));
  const curveX = midX - (dy / length) * offset;
  const curveY = midY + (dx / length) * offset;
  return 'M ' + x1 + ' ' + y1 + ' Q ' + curveX + ' ' + curveY + ' ' + x2 + ' ' + y2;
}

function rectCenter(rect, base) {
  return {
    x: rect.left + rect.width / 2 - base.left,
    y: rect.top + rect.height / 2 - base.top
  };
}

function rectEdgePoint(rect, towardX, towardY, base) {
  const center = rectCenter(rect, base);
  const dx = towardX - center.x;
  const dy = towardY - center.y;
  if (dx === 0 && dy === 0) return center;
  const halfWidth = Math.max(1, rect.width / 2);
  const halfHeight = Math.max(1, rect.height / 2);
  const scale = 1 / Math.max(Math.abs(dx) / halfWidth, Math.abs(dy) / halfHeight);
  return {
    x: center.x + dx * scale,
    y: center.y + dy * scale
  };
}

function playerGuideElement(playerId) {
  return document.querySelector(
    '.seatCard[data-player-id="' + playerId + '"], .stageFocusCard[data-player-id="' + playerId + '"]'
  );
}

function updatePersistentActionGuide() {
  const layer = document.getElementById('actionGuideLayer');
  const beamGroup = document.getElementById('actionGuideBeams');
  if (!layer || !beamGroup) return;
  document.querySelectorAll('.seatCard.guideTarget').forEach(card => card.classList.remove('guideTarget'));
  beamGroup.replaceChildren();
  const guide = currentActionGuide();
  if (!guide) {
    layer.classList.remove('active');
    return;
  }
  const originSelector = guide.preview ? '.card.selectedCard' : '.playedCardDisplay.actionOrigin';
  const source = document.querySelector(originSelector + '[data-player-id="' + guide.sourceId + '"]') || playerGuideElement(guide.sourceId);
  const targets = guide.targetIds
    .filter(targetId => targetId !== guide.sourceId)
    .map(targetId => playerGuideElement(targetId))
    .filter(Boolean);
  if (!source || targets.length === 0) {
    layer.classList.remove('active');
    return;
  }
  const base = layer.getBoundingClientRect();
  const sourceRect = source.getBoundingClientRect();
  const sourceCenter = rectCenter(sourceRect, base);
  const compact = window.matchMedia('(max-width: 1180px), (max-height: 600px)').matches;
  const beamHeight = compact ? (guide.isAoe ? 10 : 12) : (guide.isAoe ? 18 : 20);
  targets.forEach(target => {
    target.classList.add('guideTarget');
    const targetRect = target.getBoundingClientRect();
    const targetCenter = rectCenter(targetRect, base);
    const sourcePoint = rectEdgePoint(sourceRect, targetCenter.x, targetCenter.y, base);
    const targetPoint = rectEdgePoint(targetRect, sourceCenter.x, sourceCenter.y, base);
    const x1 = sourcePoint.x;
    const y1 = sourcePoint.y;
    const x2 = targetPoint.x;
    const y2 = targetPoint.y;
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const distance = Math.max(1, Math.hypot(deltaX, deltaY));
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    const beam = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    beam.setAttribute('href', '/zodiac-war-playtest/assets/ui/action-guide-meteor-v11.webp');
    beam.setAttribute('x', String(x1));
    beam.setAttribute('y', String(y1 - beamHeight / 2));
    beam.setAttribute('width', String(distance));
    beam.setAttribute('height', String(beamHeight));
    beam.setAttribute('preserveAspectRatio', 'none');
    beam.setAttribute('transform', 'rotate(' + angle + ' ' + x1 + ' ' + y1 + ')');
    beam.setAttribute('class', 'actionGuideBeamSprite' + (guide.isAoe ? ' aoe' : '') + (guide.preview ? ' preview' : ''));
    beamGroup.append(beam);
  });
  layer.classList.add('active');
}

function renderCombatant(player, roleLabel) {
  if (!player) return '<article class="combatant empty"><strong>暂无目标</strong></article>';
  const visual = characterVisual(player);
  const feedback = effectFeedbackFor(player);
  return '<article class="combatant ' + visual.className + feedback.className + '">' +
    '<div class="combatantTitle"><div><strong>' + safeText(player.name) + ' · ' + safeText(visual.name) + '</strong><small>' + safeText(roleLabel) + ' / ' + safeText(visual.elementLabel) + '象</small></div><span class="statPill">' + safeText(player.teamId) + '队</span></div>' +
    '<div class="portraitSigil">' + safeText(visual.sigil) + '</div>' +
    '<div class="combatStats">' +
    '<div class="hpPips">' + hpPips(player) + '</div>' +
    '<div class="statRow"><span class="statPill">生命 ' + player.hp + '/' + player.maxHp + '</span><span class="statPill">护甲 ' + player.armor + '</span><span class="statPill">怒气 ' + player.rage + '</span><span class="statPill">状态 ' + safeText(statuses(player)) + '</span></div>' +
    '</div>' +
    feedback.markup +
  '</article>';
}

function actionOrderIndex(player) {
  if (!setupFateDrawn || !state?.startingPlayerId) return null;
  const seats = [...state.players].sort(
    (left, right) => left.seatIndex - right.seatIndex || left.id.localeCompare(right.id)
  );
  const startIndex = seats.findIndex((candidate) => candidate.id === state.startingPlayerId);
  const playerIndex = seats.findIndex((candidate) => candidate.id === player.id);
  if (startIndex < 0 || playerIndex < 0) return null;
  const direction = state.turnDirection === -1 ? -1 : 1;
  return ((playerIndex - startIndex) * direction + seats.length) % seats.length;
}

function actionOrderBadge(player) {
  const orderIndex = actionOrderIndex(player);
  return orderIndex === null
    ? ''
    : '<span class="seatPosition" title="本局行动顺序">' + (orderIndex + 1) + '</span>';
}

function actionOrderLabel(player) {
  const orderIndex = actionOrderIndex(player);
  return orderIndex === null ? '' : (orderIndex + 1) + '号行动 · ';
}

function renderSeatCard(player, active, perspective) {
  const visual = characterVisual(player);
  const portrait = assetImageHtml('characterArt', characterAssetUrls(player.characterId), visual.name);
  const selectedEnemy = active ? selectedEnemyOf(active) : null;
  const selectedAoeTargetIds = targetIdsForSelectedCard();
  const canReleaseSelected = canReleaseSelectedCardOnSeat(player.id);
  const canReleaseSkillCost = active ? canReleaseSkillCostOnSeat(active.id, player.id) : false;
  const isSelectedLeoRoarTarget = active ? isLeoRoarTargetSelected(active.id, player.id) : false;
  const isSelectedAoeTarget = selectedAoeTargetIds.includes(player.id);
  const canPickEnemy = active && state.phase === 'main' &&
    (state.mode === 'infection' ? player.id !== active.id : player.teamId !== active.teamId) &&
    player.hp > 0 && !player.eliminated;
  const relationLabel = seatRelationLabel(player, perspective || active);
  const relationClass = relationLabel === '敌' ? 'enemy' : 'friend';
  const feedback = effectFeedbackFor(player);
  const classes = [
    'seatCard',
    visual.className,
    portrait ? 'hasCharacterArt' : '',
    player.hp <= 0 || player.eliminated ? 'dead' : '',
    player.factionId === 'infected' ? 'infectedFaction' : '',
    player.infected ? 'latentInfection' : '',
    player.infectionRole === 'converted' ? 'convertedInfected' : '',
    feedback.className.trim(),
    player.flags.energyChargeElement ? 'energyBoost' : '',
    state.activePlayerId === player.id ? 'current' : '',
    selectedEnemy?.id === player.id ? 'target' : '',
    state.pendingAttack?.sourceId === player.id ? 'source' : '',
    state.pendingAttack?.currentTargetId === player.id ? 'defense' : '',
    canReleaseSkillCost || canReleaseSelected || isSelectedAoeTarget ? 'selectedCardTarget' : '',
    isSelectedLeoRoarTarget ? 'multiSkillTargetSelected' : '',
    canReleaseSkillCost || canReleaseSelected || canPickEnemy ? 'clickable' : ''
  ].filter(Boolean).join(' ');
  const click = canReleaseSkillCost
    ? ' onclick="releaseSkillCostOnSeat(\'' + active.id + '\', \'' + player.id + '\')"'
    : canReleaseSelected
      ? ' onclick="releaseSelectedCardOnSeat(\'' + player.id + '\')"'
      : canPickEnemy ? ' onclick="setTarget(\'' + active.id + '\', \'enemy\', \'' + player.id + '\')"' : '';
  const dropAttrs = ' ondragover="allowCardDrop(event, \'' + player.id + '\')" ondragenter="allowCardDrop(event, \'' + player.id + '\')" ondragleave="leaveCardDrop(event)" ondrop="dropCardOnSeat(event, \'' + player.id + '\')"';
  const ragePill = shouldShowRage(player) ? '<span class="statPill">怒气 ' + player.rage + '</span>' : '';
  const infectionIdentity = state.mode === 'infection'
    ? '<div class="infectionIdentity">' +
        '<span class="statPill">' + (player.factionId === 'infected' ? '感染阵营' : '幸存者') + '</span>' +
        (player.infectionRole === 'initial' ? '<span class="statPill bossMark">初始感染者</span>' : '') +
        (player.infectionRole === 'converted' ? '<span class="statPill convertedMark">转化感染者</span>' : '') +
        (player.infected ? '<span class="statPill latentMark">感染</span>' : '') +
        (player.eliminated ? '<span class="statPill">永久出局</span>' : '') +
      '</div>'
    : '';
  return '<article class="' + classes + '" data-player-id="' + safeText(player.id) + '" aria-disabled="' + (player.hp <= 0 || player.eliminated ? 'true' : 'false') + '"' + click + dropAttrs + '>' +
    portrait +
    '<div class="seatCardName"><span class="seatRelation ' + relationClass + '">' + relationLabel + '</span>' + actionOrderBadge(player) + '<span class="seatZodiacName">' + safeText(visual.name) + '</span><span class="seatVitalIcons">' + miniHpDrops(player) + armorShield(player) + '</span></div>' +
    '<div class="seatCardRole">' + safeText(player.control === 'ai' ? 'AI 托管' : '真人操作') + ' · ' + safeText(visual.elementLabel) + '象</div>' +
    infectionIdentity +
    '<div class="seatSigil">' + safeText(visual.sigil) + '</div>' +
    '<div class="seatStats">' +
      (ragePill ? '<div class="statRow">' + ragePill + '</div>' : '') +
      '<div class="statRow"><span class="statPill statusPill">' + renderStatusIcons(player) + '</span><span class="statPill">手牌 ' + player.hand.length + '</span></div>' +
      '<div class="statRow"><button class="seatEquipmentButton weapon" onclick="event.stopPropagation(); handleSeatEquipmentClick(\'' + player.id + '\')">武器 ' + safeText(player.equipment.weapon?.name || '无') + '</button><button class="seatEquipmentButton armor" onclick="event.stopPropagation(); handleSeatEquipmentClick(\'' + player.id + '\')">防具 ' + safeText(player.equipment.armor?.name || '无') + '</button></div>' +
      '<div class="seatSkillList">' + characterSkillEntries(player).map(item =>
        '<button onclick="event.stopPropagation(); showSeatSkillTip(\'' + player.id + '\', \'' + item.id + '\', event)">' + safeText(item.label) + '</button>'
      ).join('') + '</div>' +
    '</div>' +
    feedback.markup +
    renderActionCountdown(player) +
  '</article>';
}

function renderStageLogPanel() {
  return '<details class="stageLogPanel" id="logPanel"' + (stageLogOpen ? ' open' : '') + ' ontoggle="stageLogOpen = this.open">' +
    '<summary><span>对局日志</span><small id="logSummary">暂无日志</small></summary>' +
    '<div id="log"></div>' +
    '</details>';
}

function formatLogMessage(message) {
  let formatted = String(message || '');
  const playersByNameLength = [...state.players].sort((left, right) => right.name.length - left.name.length);
  for (const player of playersByNameLength) {
    if (!player.name) continue;
    const zodiacName = labels[player.characterId] || player.characterId;
    formatted = formatted.split(player.name).join(zodiacName);
    formatted = formatted.split(zodiacName + '（' + zodiacName + '）').join(zodiacName);
  }
  return formatted;
}

function characterSkillEntries(player) {
  const map = {
    aries: [['aries.bloodRage', '血怒'], ['aries.ram', '羊角冲'], ['aries.burnSoul', '燃魂']],
    leo: [['leo.aura', '狮威'], ['leo.roar', '狮吼'], ['leo.order', '王令']],
    gemini: [['gemini.windForm', '双生'], ['gemini.steal', '换影'], ['gemini.extraTurn', '连星']],
    libra: [['libra.elementSense', '衡感'], ['libra.judgment', '审判'], ['libra.harmony', '裁衡']],
    aquarius: [['aquarius.stormEye', '倾杯'], ['aquarius.massHeal', '神酿'], ['aquarius.windCut', '断流']],
    cancer: [['cancer.tideBond', '共潮'], ['cancer.heal', '疗潮'], ['cancer.rescue', '蟹护']],
    scorpio: [['scorpio.freezeAoe', '蝎毒'], ['scorpio.spoils', '毒刺'], ['scorpio.peek', '伏击']],
    pisces: [['pisces.observeTide', '观潮'], ['pisces.balance', '平潮'], ['pisces.dream', '回梦']],
    taurus: [['taurus.guard', '牛守'], ['taurus.thickSkin', '厚皮'], ['taurus.armor', '筑甲']],
    capricorn: [['capricorn.unyielding', '蓄怒'], ['capricorn.wushuang', '重压'], ['capricorn.charge', '山崩']],
    sagittarius: [['sagittarius.bowcraft', '整弓'], ['sagittarius.seekEquipment', '寻器'], ['sagittarius.sharpshot', '神射']],
    virgo: [['virgo.purify', '净化'], ['virgo.domain', '净域'], ['virgo.discipline', '戒律']]
  };
  const bossSkills = isInitialInfectionBoss(player)
    ? [['infection.bossDrain', '月蚀汲取'], ['infection.bossCommand', '蚀月战令'], ['infection.bossNoDistance', '月蚀领域']]
    : [];
  return [...(map[player.characterId] || []), ...bossSkills].map(([id, label]) => ({
    id,
    label,
    description: skillDescriptions[id]?.text || '该技能尚未配置介绍。'
  }));
}

function showSeatSkillTip(playerId, skillId, event, preferredPlacement = '') {
  const player = state?.players.find(candidate => candidate.id === playerId);
  const item = player ? characterSkillEntries(player).find(candidate => candidate.id === skillId) : null;
  if (!item) return;
  const rect = event?.currentTarget?.getBoundingClientRect?.();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1200;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;
  const halfWidth = Math.min(180, Math.max(120, (viewportWidth - 20) / 2));
  const anchorX = rect ? rect.left + rect.width / 2 : viewportWidth / 2;
  const above = Boolean(rect && rect.top > 150);
  let x = Math.max(halfWidth + 10, Math.min(viewportWidth - halfWidth - 10, anchorX));
  let y = above ? rect.top - 8 : (rect?.bottom || 80) + 8;
  let placement = above ? 'above' : 'below';
  let width = Math.min(360, viewportWidth - 20);
  if (preferredPlacement === 'right' && rect) {
    const rightSpace = viewportWidth - rect.right - 10;
    const leftSpace = rect.left - 10;
    const placeRight = rightSpace >= 150 || rightSpace >= leftSpace;
    placement = placeRight ? 'right' : 'left';
    width = Math.min(240, Math.max(140, (placeRight ? rightSpace : leftSpace) - 8));
    x = placeRight ? rect.right + 8 : rect.left - 8;
    y = Math.max(64, Math.min(viewportHeight - 64, rect.top + rect.height / 2));
  }
  seatSkillTip = {
    playerId,
    skillId,
    label: item.label,
    description: item.description,
    x,
    y,
    width,
    placement
  };
  if (seatSkillTipTimer) clearTimeout(seatSkillTipTimer);
  render();
  seatSkillTipTimer = setTimeout(() => {
    seatSkillTip = null;
    seatSkillTipTimer = null;
    render();
  }, 3200);
}

function renderSeatSkillTip() {
  if (!seatSkillTip) return '';
  return '<aside class="seatSkillPopover ' + seatSkillTip.placement + '" style="left:' + Math.round(seatSkillTip.x) + 'px;top:' + Math.round(seatSkillTip.y) + 'px;width:' + Math.round(seatSkillTip.width || 360) + 'px" role="status">' +
    '<strong>' + safeText(seatSkillTip.label) + '</strong>' +
    '<span>' + safeText(seatSkillTip.description) + '</span>' +
  '</aside>';
}

function openPlayerInspector(playerId, section = 'skills') {
  inspectedPlayerId = playerId;
  inspectedSection = section === 'equipment' ? 'equipment' : 'skills';
  render();
}

function closePlayerInspector() {
  inspectedPlayerId = '';
  render();
}

function canActivateEquipmentSkill(player, skillId) {
  if (state.pendingSkillDecisions?.length) return false;
  if (!player || player.id !== localHumanPlayer()?.id || setupPaused || state.activePlayerId !== player.id || state.phase !== 'main' || player.statuses?.silence) return false;
  if (skillId === 'weapon.waterCodex') {
    return player.equipment.weapon?.element === 'water' && !player.flags.usedWeaponConvert && player.hand.length >= 2;
  }
  if (skillId === 'weapon.airCompass') {
    return player.equipment.weapon?.element === 'air' && !player.flags.usedWindCompass && new Set(player.flags.usedCardElements).size >= 2 && state.deck.some(card => card.element);
  }
  return false;
}

function renderPlayerInspector() {
  const player = state?.players.find(candidate => candidate.id === inspectedPlayerId);
  if (!player) return '';
  const visual = characterVisual(player);
  const skillItems = characterSkillEntries(player).map(item =>
    '<article class="playerInspectorItem"><strong>' + safeText(item.label) + '</strong><span>' + safeText(item.description) + '</span>' +
    (player.id === localHumanPlayer()?.id && !infoOnlySkills.has(item.id)
      ? '<button class="v10-inspector-action" ' + (!setupPaused && player.control === 'human' && isSkillUsable(player, item.id, state.activePlayerId === player.id && state.phase === 'main') ? '' : 'disabled') +
        ' onclick="inspectedPlayerId=\'\';skill(state.players.find(p=>p.id===\'' + player.id + '\'),\'' + item.id + '\',event)">发动' + safeText(item.label) + '</button>'
      : '') + '</article>'
  ).join('');
  const weaponActionId = player.equipment.weapon?.element === 'water'
    ? 'weapon.waterCodex'
    : player.equipment.weapon?.element === 'air'
      ? 'weapon.airCompass'
      : '';
  const weaponAction = weaponActionId
    ? '<button class="inspectorEquipmentAction" ' + (canActivateEquipmentSkill(player, weaponActionId) ? '' : 'disabled') +
      ' onclick="beginEquipmentAction(\'' + player.id + '\', \'' + weaponActionId + '\')">发动' + safeText(player.equipment.weapon?.name || '武器') + '</button>'
    : '';
  const equipmentItems =
    '<article class="playerInspectorItem equipmentDetail"><strong>武器 · ' + safeText(player.equipment.weapon?.name || '无') + '</strong><span>' + safeText(equipmentEffectText(player.equipment.weapon)) + '</span>' +
    (player.equipment.weapon ? '<small>' + safeText(window.TabletopV10.equipmentReason(player, weaponActionId)) + '</small>' : '') + weaponAction + '</article>' +
    '<article class="playerInspectorItem equipmentDetail"><strong>防具 · ' + safeText(player.equipment.armor?.name || '无') + '</strong><span>' + safeText(equipmentEffectText(player.equipment.armor)) + '</span></article>';
  return '<div class="playerInspectorBackdrop" onclick="closePlayerInspector()">' +
    '<aside class="playerInspectorPanel" role="dialog" aria-modal="true" aria-label="角色资料" onclick="event.stopPropagation()">' +
      '<header><div><small>' + safeText(player.name) + '</small><strong>' + safeText(visual.name) + '</strong></div><button class="inspectorClose" onclick="closePlayerInspector()" aria-label="关闭">×</button></header>' +
      '<div class="playerInspectorSummary"><span>' + miniHpDrops(player) + '</span><span>' + armorShield(player) + '</span><span>手牌 ' + player.hand.length + '</span><span>' + renderStatusIcons(player) + '</span></div>' +
      '<nav><button class="' + (inspectedSection === 'skills' ? 'selected' : '') + '" onclick="openPlayerInspector(\'' + player.id + '\', \'skills\')">星座技能</button><button class="' + (inspectedSection === 'equipment' ? 'selected' : '') + '" onclick="openPlayerInspector(\'' + player.id + '\', \'equipment\')">装备效果</button></nav>' +
      '<div class="playerInspectorContent">' + (inspectedSection === 'equipment' ? equipmentItems : skillItems) + '</div>' +
    '</aside>' +
  '</div>';
}

function renderSeatRail(side, active, perspective) {
  const seatOrder = [...state.players].sort((left, right) => left.seatIndex - right.seatIndex);
  const splitIndex = Math.ceil(seatOrder.length / 2);
  const players = side === 'left'
    ? seatOrder.slice(0, splitIndex).reverse()
    : seatOrder.slice(splitIndex);
  const title = side === 'left' ? '圆桌左席' : '圆桌右席';
  const playerCards = players
    .map(player => renderSeatCard(player, active, perspective || active))
    .join('');
  return '<div class="teamRail seatRail ' + side + 'SeatRail" style="--seat-count:' + Math.max(players.length, 1) + '">' +
    '<div class="teamRailTitle"><span>' + title + '</span><span>' + players.filter(player => player.hp > 0 && !player.eliminated).length + '/' + players.length + '</span></div>' +
    playerCards +
    '</div>';
}

function renderTableSeatRing(active, perspective) {
  const seatOrder = [...state.players].sort(
    (left, right) => left.seatIndex - right.seatIndex || left.id.localeCompare(right.id)
  );
  const focus = perspective || active || seatOrder[0];
  const focusIndex = Math.max(0, seatOrder.findIndex(player => player.id === focus?.id));
  const slotMap = seatOrder.length <= 4
    ? ['leftLower', 'leftUpper', 'rightUpper']
    : ['rightLower', 'rightUpper', 'topCenter', 'leftUpper', 'leftLower'];
  const seats = seatOrder
    .filter(player => player.id !== focus?.id)
    .map(player => {
      const playerIndex = seatOrder.findIndex(candidate => candidate.id === player.id);
      const relativeIndex = (playerIndex - focusIndex + seatOrder.length) % seatOrder.length;
      const slot = slotMap[Math.max(0, relativeIndex - 1)] || 'topCenter';
      return '<div class="ringSeat ringSeat-' + slot + '">' + renderSeatCard(player, active, focus) + '</div>';
    })
    .join('');
  return '<div class="tableSeatRing" aria-label="圆桌座位">' + seats + '</div>';
}

function renderFocusedSkillActions(player) {
  if (!player) return '';
  const canAct = state.activePlayerId === player.id && state.phase === 'main';
  return '<nav class="focusActionRail" aria-label="当前角色技能与装备技能">' +
    skillButtons(player, canAct) + equipmentTraitButtons(player) +
  '</nav>';
}

function renderFocusCard(player) {
  if (!player) return '<aside class="stageFocusCard"><strong>暂无当前角色</strong></aside>';
  const visual = characterVisual(player);
  const portrait = assetImageHtml('characterArt', characterAssetUrls(player.characterId), visual.name);
  const canReleaseSelected = canReleaseSelectedCardOnSeat(player.id);
  const active = state.players.find(candidate => candidate.id === state.activePlayerId);
  const canReleaseSkillCost = active ? canReleaseSkillCostOnSeat(active.id, player.id) : false;
  const feedback = effectFeedbackFor(player);
  const rageMeta = shouldShowRage(player) ? '<span>怒气 ' + player.rage + '</span>' : '';
  const infectionMeta = state.mode === 'infection'
    ? '<span>' + (player.factionId === 'infected' ? '感染阵营' : '幸存者') + '</span>' +
      (player.infected ? '<span>感染</span>' : '') +
      (player.infectionRole === 'initial' ? '<span>初始感染者</span>' : '') +
      (player.infectionRole === 'converted' ? '<span>转化感染者</span>' : '')
    : '';
  const equipmentButton = (slot, label, card) =>
    '<button class="equipmentButton" ' +
    (card ? 'onclick="selectEquipmentInfo(\'' + player.id + '\', \'' + slot + '\')"' : 'disabled') + '>' +
    safeText(label + '：' + (card?.name || '无')) +
    '</button>';
  const click = canReleaseSkillCost
    ? ' onclick="releaseSkillCostOnSeat(\'' + active.id + '\', \'' + player.id + '\')"'
    : canReleaseSelected ? ' onclick="releaseSelectedCardOnSeat(\'' + player.id + '\')"' : '';
  const dropAttrs = ' ondragover="allowCardDrop(event, \'' + player.id + '\')" ondragenter="allowCardDrop(event, \'' + player.id + '\')" ondragleave="leaveCardDrop(event)" ondrop="dropCardOnSeat(event, \'' + player.id + '\')"';
  return '<aside class="stageFocusCard ' + (portrait ? 'hasCharacterArt ' : '') + (player.hp <= 0 ? 'dead' : '') + ' ' + (player.flags.energyChargeElement ? 'energyBoost' : '') + feedback.className + (canReleaseSelected || canReleaseSkillCost ? ' selectedCardTarget clickable' : '') + '" data-player-id="' + safeText(player.id) + '"' + click + dropAttrs + '>' +
    portrait +
    '<div class="focusCardHeader">' +
      '<div class="focusCardName"><div class="focusNameLine">' + (actionOrderIndex(player) === null ? '' : '<span class="focusSeatPosition">' + actionOrderLabel(player).replace(' · ', '') + '</span>') + '<strong>' + safeText(visual.name) + '</strong><span class="focusVitalIcons">' + miniHpDrops(player) + armorShield(player) + '</span></div><small>' + safeText(player.control === 'ai' ? 'AI 托管' : '真人操作') + ' · ' + safeText(visual.elementLabel) + '象</small></div>' +
      '<div class="seatSigil">' + safeText(visual.sigil) + '</div>' +
    '</div>' +
    '<div class="focusMeta">' +
      rageMeta +
      infectionMeta +
      '<span class="statusPill">' + renderStatusIcons(player) + '</span>' +
      '<span>手牌 ' + player.hand.length + '</span>' +
    '</div>' +
    '<div class="focusEquip">' +
      equipmentButton('weapon', '武器', player.equipment.weapon) +
      equipmentButton('armor', '防具', player.equipment.armor) +
    '</div>' +
    feedback.markup +
    renderActionCountdown(player) +
  '</aside>';
}

function renderSkillChoiceContent(title, description, choices, actions, playerId = '') {
  return '<div class="skillInfo"><header class="skillChoiceHeader"><strong>' + safeText(title) + '</strong>' +
    (playerId ? '<button type="button" aria-label="取消' + safeText(title) + '" onclick="cancelActiveSkillCost(\'' + playerId + '\')">取消</button>' : '') +
    '</header><div class="skillChoiceBody">' +
    (description ? '<p class="skillChoiceDescription">' + safeText(description) + '</p>' : '') + choices +
    '</div>' + (actions ? '<footer class="skillChoiceActions">' +
      (choices.includes('choiceCard') ? '<span class="skillChoiceSummary" role="status"></span>' : '') + actions + '</footer>' : '') + '</div>';
}

function renderActiveSkillPanel(player) {
  if (!player || !selectedSkills[player.id]) return '';
  if (activeSkillCostDraft(player)) return '';
  if (isReadOnlySkillSelection(player)) return '';
  const info = skillInfo(player);
  if (!info) return '';
  return '<section class="activeSkillPanel" role="dialog" aria-label="' + safeText(skillDescriptions[selectedSkills[player.id]]?.name || '技能选择') + '">' + info + '</section>';
}

function skillDecisionKey(decision) {
  if (!decision) return '';
  return [
    decision.kind,
    decision.playerId,
    decision.sourceId || '',
    decision.targetId || '',
    state.round || 0
  ].join(':');
}

function skillDecisionDraft(decision) {
  const key = skillDecisionKey(decision);
  if (!skillDecisionDrafts[key]) skillDecisionDrafts[key] = {};
  return skillDecisionDrafts[key];
}

function setSkillDecisionDraft(field, value) {
  const decision = state.pendingSkillDecisions?.[0];
  if (!decision) return;
  const key = skillDecisionKey(decision);
  skillDecisionDrafts[key] = { ...skillDecisionDraft(decision), [field]: value };
  render();
}

function toggleSkillDecisionCard(cardId) {
  const decision = state.pendingSkillDecisions?.[0];
  if (!decision) return;
  const key = skillDecisionKey(decision);
  const draft = skillDecisionDraft(decision);
  const selected = draft.cardIds || [];
  const max = decision.kind === 'aquariusWindCut' ? Math.min(2, state.players.find(player => player.id === draft.targetId)?.hand.length || 0) : 1;
  const cardIds = selected.includes(cardId)
    ? selected.filter(id => id !== cardId)
    : max === 1
      ? [cardId]
      : selected.length < max
        ? [...selected, cardId]
        : [...selected.slice(1), cardId];
  skillDecisionDrafts[key] = { ...draft, cardIds };
  render();
}

function resolvePendingSkillDecision(activate) {
  const decision = state.pendingSkillDecisions?.[0];
  if (!decision) return;
  const key = skillDecisionKey(decision);
  const draft = skillDecisionDraft(decision);
  if (decision.kind === 'aquariusChalice' && activate) return confirmAquariusChalice(decision.playerId);
  delete skillDecisionDrafts[key];
  if (decision.kind === 'aquariusChalice') delete aquariusChaliceDrafts[decision.playerId];
  return action({
    type: 'resolveSkillDecision',
    playerId: decision.playerId,
    activate,
    targetId: draft.targetId,
    cardIds: draft.cardIds || [],
    selectedCardId: draft.selectedCardId || draft.cardIds?.[0],
    option: draft.option
  });
}

function renderPendingSkillDecisionPanel(player) {
  const decision = state.pendingSkillDecisions?.[0];
  if (!decision || !player || decision.playerId !== player.id || player.control !== 'human') return '';
  const draft = skillDecisionDraft(decision);
  const optionalKinds = new Set(['taurusGuard', 'taurusThickSkin', 'virgoDomain', 'virgoDiscipline', 'aquariusWindCut', 'aquariusChalice']);
  const titles = {
    taurusGuard: '是否发动牛守',
    taurusThickSkin: '是否发动厚皮',
    virgoDomain: '是否发动净域',
    virgoDiscipline: '是否发动戒律',
    aquariusWindCut: '是否发动断流',
    aquariusChalice: '倾杯触发：摸 2 牌（可选换牌）',
    libraJudgment: '审判：选择致盲目标',
    libraPerfectJudgment: '完美审判：选择目标与效果'
  };
  let chooser = '';
  let canConfirm = true;

  if (decision.kind === 'taurusGuard' || decision.kind === 'taurusThickSkin') {
    const options = player.hand.map(card =>
      '<button class="choiceCard ' + ((draft.cardIds || []).includes(card.id) ? 'selected' : '') + '" onclick="toggleSkillDecisionCard(\'' + card.id + '\')">' + cardText(card) + '</button>'
    ).join('');
    canConfirm = (draft.cardIds || []).length === 1;
    chooser = '<div class="chooserLabel">选择弃置的 1 张手牌</div><div class="choiceGrid">' + (options || '<div class="skillHint">没有手牌，不能发动。</div>') + '</div>';
  }

  if (decision.kind === 'aquariusWindCut') {
    const targets = state.players.filter(candidate => candidate.hp > 0 && candidate.id !== player.id);
    const target = targets.find(candidate => candidate.id === draft.targetId) || targets[0];
    if (!draft.targetId && target) draft.targetId = target.id;
    const targetOptions = targets.map(candidate =>
      '<button class="choiceCard ' + (target?.id === candidate.id ? 'selected' : '') + '" onclick="setSkillDecisionDraft(\'targetId\', \'' + candidate.id + '\'); setSkillDecisionDraft(\'cardIds\', [])">' + safeText(characterVisual(candidate).name) + ' · 手牌 ' + candidate.hand.length + '</button>'
    ).join('');
    const required = Math.min(2, target?.hand.length || 0);
    const cardBacks = target?.hand.map((card, index) =>
      '<button class="choiceCard ' + ((draft.cardIds || []).includes(card.id) ? 'selected' : '') + '" onclick="toggleSkillDecisionCard(\'' + card.id + '\')">目标手牌 ' + (index + 1) + '</button>'
    ).join('') || '<div class="skillHint">目标没有手牌；发动后仍会造成 1 点伤害。</div>';
    canConfirm = Boolean(target) && (draft.cardIds || []).length === required;
    chooser = '<div class="chooserLabel">选择断流目标</div><div class="choiceGrid">' + targetOptions + '</div>' +
      '<div class="chooserLabel">选择令其弃置的 ' + required + ' 张手牌</div><div class="choiceGrid">' + cardBacks + '</div>';
  }

  if (decision.kind === 'aquariusChalice') {
    const targets = state.players.filter(candidate => candidate.id !== player.id && candidate.hp > 0);
    const draft = aquariusChaliceDraft(player.id);
    const selectedTargets = draft.targets || [];
    const targetIds = selectedTargets.map(t => t.id);
    const totalGive = selectedTargets.reduce((sum, t) => sum + (t.giveCardIds || []).length, 0);
    const totalTake = selectedTargets.reduce((sum, t) => sum + (t.takeCardIds || []).length, 0);
    const ownHand = player.hand;
    const targetOptions = targets.map(candidate => {
      const inList = targetIds.includes(candidate.id);
      const atMax = targetIds.length >= 2 && !inList;
      return '<button class="choiceCard ' + (inList ? 'selected' : '') + '" ' + (atMax ? 'disabled' : '') + ' onclick="toggleAquariusChaliceTarget(\'' + player.id + '\', \'' + candidate.id + '\')">' + safeText(characterVisual(candidate).name) + ' · 手牌 ' + candidate.hand.length + (inList ? ' ✓' : '') + '</button>';
    }).join('');
    const perTargetBlocks = selectedTargets.map(t => {
      const target = targets.find(c => c.id === t.id);
      const giveCardIds = t.giveCardIds || [];
      const takeCardIds = t.takeCardIds || [];
      const giveOptions = ownHand.map(card =>
        '<button class="choiceCard ' + (giveCardIds.includes(card.id) ? 'selected' : '') + '" onclick="toggleAquariusChaliceGive(\'' + player.id + '\', \'' + t.id + '\', \'' + card.id + '\')">' + cardText(card) + '</button>'
      ).join('');
      const takeOptions = target && target.hand.length > 0
        ? target.hand.map(card =>
            '<button class="choiceCard ' + (takeCardIds.includes(card.id) ? 'selected' : '') + '" onclick="toggleAquariusChaliceTake(\'' + player.id + '\', \'' + t.id + '\', \'' + card.id + '\')">' + cardText(card) + '</button>'
          ).join('')
        : '<div class="skillHint">该目标没有手牌，不能交换。</div>';
      return '<div class="chaliceTargetBlock">' +
        '<div class="chooserLabel">与 ' + safeText(characterVisual(target).name) + ' 交换' +
        ' <button class="miniRemove" onclick="toggleAquariusChaliceTarget(\'' + player.id + '\', \'' + t.id + '\')">移除</button></div>' +
        '<div class="chooserLabel">你交出（' + giveCardIds.length + ' 张）</div><div class="choiceGrid">' + (giveOptions || '<div class="skillHint">你没有手牌。</div>') + '</div>' +
        '<div class="chooserLabel">你取回（' + takeCardIds.length + ' 张）</div><div class="choiceGrid">' + takeOptions + '</div>' +
        '</div>';
    }).join('');
    canConfirm = totalGive > 0 && totalGive === totalTake && totalGive <= 2 &&
      new Set(selectedTargets.flatMap(t => t.giveCardIds || [])).size === totalGive &&
      selectedTargets.every(t => (t.giveCardIds || []).length === (t.takeCardIds || []).length);
    chooser = '<div class="skillChooser">' +
      '<div><div class="chooserLabel">选择交换对象（0-2 名，可不选）</div><div class="choiceGrid">' + (targetOptions || '<div class="skillHint">没有可交换目标。</div>') + '</div></div>' +
      (perTargetBlocks || '') +
      '</div>';
  }

  if (decision.kind === 'libraJudgment' || decision.kind === 'libraPerfectJudgment') {
    const targets = state.players.filter(candidate => candidate.hp > 0);
    const target = targets.find(candidate => candidate.id === draft.targetId);
    const targetOptions = targets.map(candidate =>
      '<button class="choiceCard ' + (draft.targetId === candidate.id ? 'selected' : '') + '" onclick="setSkillDecisionDraft(\'targetId\', \'' + candidate.id + '\')">' + safeText(characterVisual(candidate).name) + '</button>'
    ).join('');
    chooser = '<div class="chooserLabel">选择目标</div><div class="choiceGrid">' + targetOptions + '</div>';
    canConfirm = Boolean(target);
    if (decision.kind === 'libraPerfectJudgment') {
      chooser += '<div class="chooserLabel">选择效果</div><div class="choiceGrid">' +
        '<button class="choiceCard ' + (draft.option === 'damage' ? 'selected' : '') + '" onclick="setSkillDecisionDraft(\'option\', \'damage\')">造成 1 点伤害</button>' +
        '<button class="choiceCard ' + (draft.option === 'steal' ? 'selected' : '') + '" onclick="setSkillDecisionDraft(\'option\', \'steal\')">获得目标 1 张手牌</button></div>';
      if (draft.option === 'steal' && target) {
        const cards = target.hand.map((card, index) =>
          '<button class="choiceCard ' + (draft.selectedCardId === card.id ? 'selected' : '') + '" onclick="setSkillDecisionDraft(\'selectedCardId\', \'' + card.id + '\')">目标手牌 ' + (index + 1) + '</button>'
        ).join('');
        chooser += '<div class="chooserLabel">选择获得的手牌</div><div class="choiceGrid">' + (cards || '<div class="skillHint">目标没有手牌，请改选造成伤害。</div>') + '</div>';
      }
      canConfirm = Boolean(target) && (draft.option === 'damage' || (draft.option === 'steal' && Boolean(draft.selectedCardId)));
    }
  }

  const confirmText = {
    taurusGuard: '弃牌代伤',
    taurusThickSkin: '弃牌并沉默伤害来源',
    virgoDomain: '发动净域',
    virgoDiscipline: '发动戒律',
    aquariusWindCut: '发动断流',
    aquariusChalice: '确认换牌',
    libraJudgment: '确认审判',
    libraPerfectJudgment: '确认完美审判'
  }[decision.kind] || '确认';
  const actions =
      (optionalKinds.has(decision.kind) ? '<button onclick="resolvePendingSkillDecision(false)">' + (decision.kind === 'aquariusChalice' ? '不交换' : '不发动') + '</button>' : '') +
      '<button ' + (!canConfirm ? 'disabled' : '') + ' onclick="resolvePendingSkillDecision(true)">' + confirmText + '</button>';
  const title = titles[decision.kind] || '技能选择';
  return '<section class="activeSkillPanel" role="dialog" aria-label="' + safeText(title) + '">' +
    renderSkillChoiceContent(title, '', chooser, actions) + '</section>';
}

function isReadOnlySkillSelection(player) {
  const id = player ? selectedSkills[player.id] : '';
  if (!id) return false;
  if (infoOnlySkills.has(id)) return true;
  const canAct = state.activePlayerId === player.id && state.phase === 'main';
  return isSkillDisabled(player, id, canAct);
}

function focusedHumanPlayer(active, attackSource, defenseTarget) {
  const decisionOwner = humanDecisionPlayer(active, attackSource, defenseTarget);
  if (decisionOwner) return decisionOwner;
  const local = localHumanPlayer();
  if (local) return local;
  return defenseTarget || attackSource || active;
}

function humanDecisionPlayer(active, attackSource, defenseTarget) {
  const pendingSkillDecision = state.pendingSkillDecisions?.[0];
  if (pendingSkillDecision) {
    const decisionOwner = state.players.find(player => player.id === pendingSkillDecision.playerId);
    if (decisionOwner?.control === 'human') return decisionOwner;
  }
  if (state.phase === 'gameOver' && !state.winnerTeamId) return rescueReviewPlayer();
  if (state.phase === 'mulligan') {
    const lastFocus = state.players.find(player => player.id === lastMulliganFocusId && player.control === 'human');
    const lastFocusStillPending = state.mulliganPendingPlayerIds.includes(lastMulliganFocusId);
    if (lastFocus && lastFocusStillPending) return lastFocus;
    const pending = state.mulliganPendingPlayerIds
      .map(id => state.players.find(player => player.id === id))
      .filter(Boolean);
    const local = localHumanPlayer();
    if (local && pending.some(player => player.id === local.id)) return local;
    return pending.find(player => player.control === 'human') || null;
  }
  if (state.phase === 'response' && defenseTarget?.control === 'human') return defenseTarget;
  if (state.phase === 'infectionResponse' && state.infection?.pendingInfectionCard) {
    const target = state.players.find(player => player.id === state.infection.pendingInfectionCard.targetId);
    if (target?.control === 'human') return target;
  }
  if (state.phase === 'rescue' && (state.pendingRescue || state.infection?.pendingDying)?.currentResponderId) {
    const responder = state.players.find(player => player.id === (state.pendingRescue || state.infection?.pendingDying).currentResponderId);
    if (responder?.control === 'human') return responder;
  }
  if (state.phase === 'reward' && state.infection?.pendingReward?.playerId) {
    const rewarded = state.players.find(player => player.id === state.infection.pendingReward.playerId);
    if (rewarded?.control === 'human') return rewarded;
  }
  if (state.phase === 'hammerBreak' && defenseTarget?.control === 'human') return defenseTarget;
  if (['draw', 'main', 'discard'].includes(state.phase) && active?.control === 'human') return active;
  return null;
}

function localHumanPlayer() {
  if (!state) return null;
  if (!localHumanPlayerId || !state.players.some(player => player.id === localHumanPlayerId)) {
    localHumanPlayerId = state.players.find(player => player.control === 'human')?.id || state.players[0]?.id || '';
  }
  return state.players.find(player => player.id === localHumanPlayerId) || null;
}

function rescueReviewPlayer() {
  if (!state) return null;
  return standardRescueReviewPlayers().find(player => player.control === 'human') || null;
}

function standardRescueReviewPlayers() {
  if (!state || state.mode === 'infection' || state.phase !== 'gameOver' || state.winnerTeamId || state.winnerId) return [];
  const defeatedTeams = [...new Set(state.players.map(player => player.teamId))]
    .filter(teamId => state.players.filter(player => player.teamId === teamId).every(player => player.hp <= 0));
  return state.players.filter(player =>
    defeatedTeams.includes(player.teamId) &&
    player.hand.some(card => card.kind === 'sun' || card.kind === 'energy')
  );
}

function aiRescueReviewPlayer() {
  return standardRescueReviewPlayers().find(player => player.control === 'ai') || null;
}

function renderFocusedHand(player, tableControls = '') {
  if (!player) return '';
  const pendingSkillDecision = !state.pendingRescue && Boolean(state.pendingSkillDecisions?.length);
  const opponent = selectedEnemyOf(player);
  const canAct = state.activePlayerId === player.id && state.phase === 'main';
  const canRespond = state.phase === 'response' && state.pendingAttack && state.pendingAttack.currentTargetId === player.id;
  const canRespondInfection = state.phase === 'infectionResponse' &&
    state.infection?.pendingInfectionCard?.targetId === player.id;
  const canRescue = state.phase === 'rescue' &&
    (state.pendingRescue || state.infection?.pendingDying)?.currentResponderId === player.id;
  const canHammerBreak = state.phase === 'hammerBreak' && state.pendingAttack && state.pendingAttack.currentTargetId === player.id;
  const canDiscard = state.phase === 'discard' && state.activePlayerId === player.id && player.control === 'human';
  const discardRequired = Math.max(0, player.hand.length - Math.max(0, player.hp));
  const selectedDiscardIds = (discardDrafts[player.id] || []).filter(cardId => player.hand.some(card => card.id === cardId)).slice(0, discardRequired);
  discardDrafts[player.id] = selectedDiscardIds;
  const distanceDraft = distanceCostDraft?.playerId === player.id ? distanceCostDraft : null;
  const leoOrderDraft = leoOrderPaymentDraft?.playerId === player.id ? leoOrderPaymentDraft : null;
  const waterDraft = waterStealDraft?.playerId === player.id ? waterStealDraft : null;
  const airDraft = airDismantleDraft?.playerId === player.id ? airDismantleDraft : null;
  const skillCostDraft = distanceDraft || leoOrderDraft || waterDraft || airDraft ? null : activeSkillCostDraft(player);
  const distanceCandidateIds = distanceDraft ? distanceCostCandidates(player, distanceDraft).map(card => card.id) : [];
  const leoOrderPaymentCandidateIds = leoOrderDraft ? leoOrderPaymentCandidates(player, leoOrderDraft.reservedCardIds || []).map(card => card.id) : [];
  const cards = player.hand.map((card, index) => {
    const skillCostMode = Boolean(skillCostDraft);
    const distanceCostMode = Boolean(distanceDraft);
    const leoOrderPaymentMode = Boolean(leoOrderDraft);
    const distanceCostCandidate = distanceCandidateIds.includes(card.id);
    const leoOrderPaymentCandidate = leoOrderPaymentCandidateIds.includes(card.id);
    const skillCostCandidate = skillCostDraft?.validCardIds.includes(card.id);
    const skillCostSelected = skillCostDraft?.costCardIds.includes(card.id);
    const candidateRescueTarget = canUseRescueCard(player, card) ? dyingRescueTargetOf(player) : null;
    const rescueTarget = shouldPlayCardAsRescue(player, card, candidateRescueTarget) ? candidateRescueTarget : null;
    const crabRescueCard = canRescue && player.characterId === 'cancer' && card.element === 'water' &&
      player.hp > 0 && state.activePlayerId !== player.id && !player.flags.usedCancerRescueThisRound &&
      !(state.pendingRescue || state.infection?.pendingDying)?.willTransform;
    const enabled = !pendingSkillDecision && (waterDraft || airDraft
      ? false
      : distanceCostMode
      ? distanceCostCandidate
      : leoOrderPaymentMode
      ? leoOrderPaymentCandidate
      : skillCostMode
      ? Boolean(skillCostCandidate)
      : canRespondInfection
        ? card.kind === 'sun' || card.kind === 'ritual'
      : canRescue
        ? card.kind === 'sun' || (state.mode !== 'infection' && card.kind === 'energy') || crabRescueCard
      : rescueTarget
        ? true
      : canDiscard
        ? discardRequired > 0
        : canClickHandCard(player, card, canAct, canRespond, canHammerBreak));
    const handler = distanceCostMode
      ? 'payDistanceCostCard(\'' + player.id + '\', \'' + card.id + '\')'
      : leoOrderPaymentMode
      ? 'payLeoOrderPaymentCard(\'' + player.id + '\', \'' + card.id + '\')'
      : skillCostMode
      ? 'toggleSkillCostCard(\'' + player.id + '\', \'' + card.id + '\')'
      : canDiscard
        ? 'toggleDiscardCard(\'' + player.id + '\', \'' + card.id + '\')'
        : canRespondInfection
          ? 'respondInfection(\'' + player.id + '\', \'' + card.id + '\')'
        : canRescue
          ? crabRescueCard && card.kind !== 'sun' && card.kind !== 'energy'
            ? 'rescueWithCrabGuard(\'' + player.id + '\', \'' + card.id + '\')'
            : 'play(\'' + player.id + '\', state.players.find(p=>p.id===\'' + player.id + '\').hand.find(c=>c.id===\'' + card.id + '\'), \'' + ((state.pendingRescue || state.infection?.pendingDying)?.targetId || '') + '\')'
        : rescueTarget
          ? 'play(\'' + player.id + '\', state.players.find(p=>p.id===\'' + player.id + '\').hand.find(c=>c.id===\'' + card.id + '\'), \'' + rescueTarget.id + '\')'
        : canRespond
          ? 'defend(\'' + player.id + '\', \'' + card.id + '\')'
          : canHammerBreak
            ? 'earthHammerBreak(\'' + player.id + '\', \'' + card.id + '\')'
            : canAmplifyPendingAttackWithMoon(player, card)
              ? 'play(\'' + player.id + '\', state.players.find(p=>p.id===\'' + player.id + '\').hand.find(c=>c.id===\'' + card.id + '\'), \'' + (state.pendingAttack?.currentTargetId || '') + '\')'
            : canAct && cardNeedsTarget(card)
                ? 'selectCardForTarget(\'' + player.id + '\', \'' + card.id + '\')'
                : 'play(\'' + player.id + '\', state.players.find(p=>p.id===\'' + player.id + '\').hand.find(c=>c.id===\'' + card.id + '\'), \'' + (opponent?.id || '') + '\')';
    const extraClass = [
      selectedCard?.playerId === player.id && selectedCard?.cardId === card.id ? 'selectedCard' : '',
      selectedDiscardIds.includes(card.id) ? 'discardSelected' : '',
      distanceCostCandidate ? 'skillCostCandidate' : '',
      leoOrderPaymentCandidate ? 'leoOrderPaymentCandidate skillCostCandidate' : '',
      skillCostCandidate ? 'skillCostCandidate' : '',
      skillCostSelected ? 'skillCostSelected' : ''
    ].filter(Boolean).join(' ');
    return renderHandCard(player, card, enabled, handler, '', extraClass, '--card-index:' + (index + 1));
  }).join('');
  const discardControls = canDiscard
    ? '<div class="response discardChooser"><span>弃牌阶段：已选 ' + selectedDiscardIds.length + ' / 需弃 ' + discardRequired + ' 张</span><button ' + (selectedDiscardIds.length === discardRequired ? '' : 'disabled') + ' onclick="confirmDiscard(\'' + player.id + '\')">确认弃牌</button><button onclick="clearDiscardSelection(\'' + player.id + '\')">清空选择</button></div>'
    : '';
  const response = canRespondInfection
    ? '<div class="response"><span>可用太阳或净化仪式抵消感染牌；响应牌会完整结算自身效果。</span><button onclick="respondInfection(\'' + player.id + '\')">不抵消感染</button></div>'
    : canRescue
      ? '<div class="response"><span>' + (state.mode === 'infection' ? '可用太阳急救，恢复至 1 点生命并移除感染。' : '可用太阳、星能或水牌蟹护急救，恢复至 1 点生命；太阳额外给予圣盾。') + '</span><button onclick="skipInfectionRescue(\'' + player.id + '\')">放弃急救</button></div>'
    : canRespond
    ? '<div class="response"><span>' + (state.pendingAttack.scorpioPoisonStep ? '蝎毒：交给天蝎 1 张牌；水牌免冰冻，非水牌会冰冻' : '需要响应：' + safeText(state.pendingAttack.card.name)) + '</span><button onclick="skipDefense(\'' + player.id + '\')">' + (state.pendingAttack.scorpioPoisonStep ? '不交牌' : '不出牌') + '</button></div>'
    : canHammerBreak
      ? '<div class="response"><span>撼岳锤：点击 1 张手牌作为额外防御费用</span><button onclick="skipEarthHammerBreak(\'' + player.id + '\')">不支付（防御失效）</button></div>'
      : '';
  const targetCardChoiceOverlay = renderWaterStealChoiceBar(player) + renderAirDismantleChoiceBar(player);
  const interactionOverlay = pendingSkillDecision ? '' : targetCardChoiceOverlay || (
    tableControls +
    operationHintForFocusedHand(player, canAct, canRespond, canHammerBreak, canRespondInfection, canRescue) +
    renderDistanceCostBar(player) +
    renderLeoOrderPaymentBar(player) +
    renderSkillCostBar(player) +
    discardControls +
    response
  );
  return '<div class="focusedHandBody">' +
    (interactionOverlay ? '<div class="handInteractionOverlay">' + interactionOverlay + '</div>' : '') +
    '<div class="hand focusedHandCards">' + cards + '</div>' +
    '</div>';
}

function operationHintForFocusedHand(player, canAct, canRespond, canHammerBreak, canRespondInfection = false, canRescue = false) {
  if (distanceCostDraft?.playerId === player.id) return '<div class="operationHint">跨距离需要额外弃 1 张手牌：点击一张高亮手牌支付距离费用。</div>';
  if (leoOrderPaymentDraft?.playerId === player.id) return '<div class="operationHint">王令触发：点击一张高亮手牌交给狮子，然后继续结算当前出牌。</div>';
  if (waterStealDraft?.playerId === player.id) return '<div class="operationHint">潮汐窃取目标已选：点击一个目标手牌卡背，选择具体偷哪一张。</div>';
  if (airDismantleDraft?.playerId === player.id) return '<div class="operationHint">风拆目标已选：点击目标手牌卡背或装备，选择具体拆哪一张。</div>';
  const skillCostDraft = activeSkillCostDraft(player);
  if (skillCostDraft) {
    const hint = skillCostDraft.skillId === 'pisces.observeTide'
      ? '观潮：已选 ' + skillCostDraft.costCardIds.length + ' 张；点击“确认观潮”弃牌并摸等量牌，再次点击手牌可取消选择。'
      : skillCostDraft.skillId === 'weapon.waterCodex'
      ? skillCostDraft.ready
        ? '素材已选 2/2：点击“确认合成”生成合成牌；再次点击素材可取消选择。'
        : '潮汐合成：点击任意 2 张高亮手牌作为素材，再点击“确认合成”。'
      : skillCostDraft.skillId === 'leo.roar'
      ? skillCostDraft.costCardIds.length === 0
        ? '狮吼：先点击 1 张高亮火牌作为费用。'
        : skillCostDraft.targetIds.length === 0
          ? '狮吼：依次点击战场上的 1–3 名其他存活角色。'
          : '狮吼：已选 ' + skillCostDraft.targetIds.length + '/3 个目标；可继续点选或取消目标，再次点击“狮吼”发动。'
      : skillCostDraft.ready && skillCostDraft.requiresTarget
        ? '费用已选：点击战场上发光的目标角色释放技能。'
        : '技能发动中：点击高亮手牌选择费用。';
    return '<div class="operationHint">' + hint + '</div>';
  }
  if (canRespond && state.pendingAttack?.scorpioPoisonStep) return '<div class="operationHint">点击一张手牌交给天蝎；交水牌可避免冰冻，交非水牌会被冰冻。没有手牌或不交牌时会被冰冻。</div>';
  if (canRespondInfection) return '<div class="operationHint">点击高亮的太阳或净化仪式抵消感染牌，也可以选择不抵消。</div>';
  if (canRescue) return '<div class="operationHint">点击高亮手牌急救当前濒死角色，也可以放弃急救。</div>';
  if (canRespond) return '<div class="operationHint">点击高亮牌进行响应；不想响应时点“不出牌”。</div>';
  if (canHammerBreak) return '<div class="operationHint">点击一张手牌支付撼岳锤的额外防御费用；不支付则本次防御无效。</div>';
  if (player.hand.some(card => canUseRescueCard(player, card))) return '<div class="operationHint">可点击太阳/星能急救濒死角色。</div>';
  if (state.phase === 'discard' && state.activePlayerId === player.id) return '<div class="operationHint">请选择要弃掉的牌，达到数量后点击“确认弃牌”。</div>';
  if (!canAct) return '';
  if (window.TabletopV10) return '<div class="operationHint">' + safeText(window.TabletopV10.handHint(player)) + '</div>';
  if (canAct && player.hand.length === 0) return '<div class="operationHint">没有手牌了：点击「结束出牌」进入弃牌阶段。</div>';
  if (selectedCard?.playerId === player.id && selectedCard?.targetIds?.length === 1) {
    const firstTarget = state.players.find(candidate => candidate.id === selectedCard.targetIds[0]);
    return '<div class="operationHint">蚀月战令已选择第一目标 ' + safeText(firstTarget?.name || '') + '；再点击另一名高亮角色释放这张基础攻击牌。再次点击第一目标可重选。</div>';
  }
  if (player.hand.some(card => canClickHandCard(player, card, true, false, false) && cardNeedsTarget(card))) {
    return '<div class="operationHint">点击要出的牌，移动鼠标查看虚线指引，再点击目标角色释放；AOE 再次点击该牌确认释放。</div>';
  }
  return '<div class="operationHint">点击装备牌可直接装备；点击可用功能牌或阶段按钮继续。</div>';
}

function renderDistanceCostBar(player) {
  const draft = distanceCostDraft?.playerId === player.id ? distanceCostDraft : null;
  if (!draft) return '';
  const target = state.players.find(candidate => candidate.id === draft.targetId);
  const cardName = draft.type === 'playCard'
    ? player.hand.find(card => card.id === draft.cardId)?.name || '当前牌'
    : draft.skillId === 'gemini.steal'
      ? '换影'
      : draft.skillId === 'aries.ram'
        ? '羊角冲'
        : draft.skillId === 'capricorn.charge'
          ? '山崩'
          : '技能';
  return '<div class="skillCostBar">' +
    '<span><strong>跨距离费用</strong>：' + safeText(cardName) + ' 指向 ' + safeText(target?.name || '目标') + '，跨距离需要额外弃 1 张手牌。</span>' +
    '<div class="skillCostActions"><button onclick="cancelDistanceCost()">取消</button></div>' +
    '</div>';
}

function renderLeoOrderPaymentBar(player) {
  const draft = leoOrderPaymentDraft?.playerId === player.id ? leoOrderPaymentDraft : null;
  if (!draft) return '';
  const receiver = state.players.find(candidate => candidate.id === draft.receiverId);
  const card = player.hand.find(candidate => candidate.id === draft.cardId);
  return '<div class="skillCostBar leoOrderPaymentBar">' +
    '<span><strong>王令</strong>：' + safeText(card?.name || '当前牌') + ' 会影响 ' + safeText(receiver?.name || '狮子') + '，先点击 1 张高亮手牌交给狮子。</span>' +
    '<div class="skillCostActions"><button onclick="cancelLeoOrderPayment()">取消</button></div>' +
    '</div>';
}

function renderWaterStealChoiceBar(player) {
  const draft = waterStealDraft?.playerId === player.id ? waterStealDraft : null;
  if (!draft) return '';
  const target = state.players.find(candidate => candidate.id === draft.targetId);
  const card = player.hand.find(candidate => candidate.id === draft.cardId);
  const choices = waterStealTargets(target);
  if (!target || !card || choices.length === 0) return '';
  const options = choices.map(choice =>
    '<button class="choiceCard cardBackChoice hasCardBackArt" onclick="chooseWaterStealTarget(\'' + player.id + '\', \'' + choice.id + '\')">' +
      assetImageHtml('cardBackArt', ['/zodiac-war-playtest/assets/ui/card-back.jpg'], '手牌背面') +
      '<strong>' + safeText(choice.label) + '</strong><span>' + safeText(choice.detail) + '</span>' +
    '</button>'
  ).join('');
  return '<div class="skillCostBar waterStealBar">' +
    '<span><strong>潮汐窃取</strong>：只能偷目标手牌。目标每有 1 张手牌，就显示 1 张卡背供你选择。</span>' +
    '<div class="choiceGrid">' + options + '</div>' +
    '<div class="skillCostActions"><button onclick="cancelWaterStealChoice()">取消</button></div>' +
    '</div>';
}

function renderAirDismantleChoiceBar(player) {
  const draft = airDismantleDraft?.playerId === player.id ? airDismantleDraft : null;
  if (!draft) return '';
  const target = state.players.find(candidate => candidate.id === draft.targetId);
  const card = player.hand.find(candidate => candidate.id === draft.cardId);
  const choices = airDismantleTargets(target);
  if (!target || !card || choices.length === 0) return '';
  const options = choices.map(choice =>
    '<button class="choiceCard cardBackChoice hasCardBackArt" onclick="chooseAirDismantleTarget(\'' + player.id + '\', \'' + choice.id + '\')">' +
      assetImageHtml('cardBackArt', ['/zodiac-war-playtest/assets/ui/card-back.jpg'], '手牌背面') +
      '<strong>' + safeText(choice.label) + '</strong><span>' + safeText(choice.detail) + '</span>' +
    '</button>'
  ).join('');
  return '<div class="skillCostBar airDismantleBar">' +
    '<span><strong>风之制裁</strong>：选择要拆掉的目标牌。手牌只显示卡背，装备显示名称。</span>' +
    '<div class="choiceGrid">' + options + '</div>' +
    '<div class="skillCostActions"><button onclick="cancelAirDismantleChoice()">取消</button></div>' +
    '</div>';
}

function canUseDefenseCard(player, card) {
  const defenseCard = card;
  const pending = state.pendingAttack;
  if (!pending) return false;
  if (pending.scorpioPoisonStep) return true;
  if (defenseCard.kind === 'sun' || defenseCard.kind === 'moon') return true;
  if (defenseCard.kind !== 'normalAttack') return false;
  if (pending.card.kind === 'aoe') return defenseCard.element === pending.card.element;
  if (pending.card.fusion && pending.card.kind === 'statusAttack') {
    return defenseCard.element === pending.card.element;
  }
  return pending.card.kind === 'normalAttack' || pending.card.kind === 'statusAttack';
}

function renderPlayedCardDisplay(display, extraClass = '') {
  const player = state.players.find(candidate => candidate.id === display.playerId);
  const displayCard = effectiveCardForView(player, display.card);
  const visual = visualForCard(displayCard);
  const cardImages = cardAssetUrls(displayCard);
  return '<div class="playedCardDisplay ' + extraClass + ' ' + visual.className + ' ' + (cardImages.length ? 'hasCardArt' : '') + '">' +
    assetImageHtml('playedCardArt', cardImages, displayCard.name) +
    '<div class="playedCardOwner">' + safeText(player ? battleDisplayName(player) : display.playerId) + '</div>' +
    '<div class="cardIcon">' + safeText(visual.icon) + '</div>' +
    '<div class="playedCardName">' + safeText(displayCard.name) + '</div>' +
    '<div class="playedCardKind">' + safeText(kindLabel(displayCard)) + '</div>' +
    '</div>';
}

function renderPlayedCardActionLine(display) {
  const targetIds = targetIdsForDisplay(display);
  if (!display || targetIds.length === 0) return '';
  const source = state.players.find(candidate => candidate.id === display.playerId);
  const targets = targetIds
    .map(targetId => state.players.find(candidate => candidate.id === targetId))
    .filter(Boolean);
  if (!source || targets.length === 0) return '';
  const targetText = targets.length > 1 ? targets.map(battleDisplayName).join('、') : battleDisplayName(targets[0]);
  return '<div class="playedCardActionLine" aria-label="' + safeText(battleDisplayName(source) + ' 对 ' + targetText) + '">' +
    '<span class="actionSourceLabel">' + safeText(battleDisplayName(source)) + '</span>' +
    '<span class="line" aria-hidden="true"></span>' +
    '<span class="actionTargetLabel">' + safeText(targetText) + '</span>' +
    '</div>';
}

function renderPlayedCards() {
  const playedCards = state.playedCards || { cards: [], sideCards: [] };
  const centerDisplays = playedCards.cards || [];
  const idle = centerDisplays.length === 0 && (!playedCards.sideCards || playedCards.sideCards.length === 0);
  const lineDisplay = [...centerDisplays].reverse().find((display) => targetIdsForDisplay(display).length > 0);
  const hasAoeImpact = Boolean(lineDisplay && lineDisplay.card.kind === 'aoe');
  const layerClass = hasAoeImpact ? 'playedCardsLayer aoeImpact' : 'playedCardsLayer';
  const actionLine = renderPlayedCardActionLine(lineDisplay);
  const cards = centerDisplays
    .map((display) => renderPlayedCardDisplay(display, display === lineDisplay ? 'actionOrigin' : ''))
    .join('');
  const sideCards = (playedCards.sideCards || [])
    .map((display) => renderPlayedCardDisplay(display, 'playedCardEquipSide ' + (display.teamId === 'A' ? 'left' : 'right')))
    .join('');
  if (idle) {
    return '<div class="playedCardsLayer idle"><div class="centerIdlePanel"><strong>等待出牌或响应</strong><small>这里会显示当前出牌、响应牌和攻击指向。</small><div class="centerIdleSteps"><span>点手牌</span><span>点目标</span><span>看中央结算</span></div></div></div>';
  }
  return '<div class="' + layerClass + '">' + actionLine + '<div class="playedCardsCenter">' + cards + '</div>' + sideCards + '</div>';
}

function renderSettlementStats() {
  const rows = state.players.map((player) => {
    const visual = characterVisual(player);
    const damage = state.metrics.damageBySource[player.id] ?? 0;
    const taken = state.metrics.damageTaken[player.id] ?? 0;
    const healing = state.metrics.healingBySource[player.id] ?? 0;
    return '<div class="settlementRow">' +
      '<strong>' + safeText(player.name) + ' · ' + safeText(visual.name) + '</strong>' +
      '<span>造成伤害 ' + damage + '</span>' +
      '<span>承受伤害 ' + taken + '</span>' +
      '<span>治疗量 ' + healing + '</span>' +
      '</div>';
  }).join('');
  const infectionSummary = state.mode === 'infection' && state.infection?.metrics
    ? '<div class="infectionSettlementSummary">' +
        '<span>传播 ' + state.infection.metrics.applied + '</span>' +
        '<span>净化 ' + state.infection.metrics.cleansed + '</span>' +
        '<span>转化 ' + state.infection.metrics.transformed + '</span>' +
        '<span>感染流失 ' + state.infection.metrics.lifeLost + '</span>' +
        '<span>Boss 吸血 ' + state.infection.metrics.bossPassiveHeals + '</span>' +
        '<span>Boss 摸牌 ' + state.infection.metrics.bossPassiveDraws + '</span>' +
        '<span>感染牌 ' + state.infection.metrics.infectionCardsPlayed + '</span>' +
        '<span>抵消 ' + state.infection.metrics.infectionCardsCountered + '</span>' +
      '</div>'
    : '';
  return '<div class="settlementTable">' +
    '<div class="settlementRow header"><strong>角色</strong><span>造成伤害</span><span>承受伤害</span><span>治疗量</span></div>' +
    rows +
    infectionSummary +
    '</div>';
}

function renderGameOverOverlay() {
  if (!state?.winnerTeamId) return '';
  const viewer = localHumanPlayer() || state.players[0];
  const winnerFaction = state.infection?.winnerFactionId;
  const viewerWon = state.mode === 'infection'
    ? viewer?.factionId === winnerFaction
    : viewer?.teamId === state.winnerTeamId;
  const outcome = viewerWon ? '胜利' : '失败';
  const className = viewerWon ? 'victory' : 'defeat';
  const body = settlementStatsExpanded
    ? renderSettlementStats()
    : state.mode === 'infection'
      ? '<p>你的阵营：' + (viewer?.factionId === 'infected' ? '感染者' : '幸存者') +
        '；胜利阵营：' + (winnerFaction === 'infected' ? '感染者' : '幸存者') + '。</p>'
      : '<p>你的阵营：' + safeText(viewer?.teamId || '未知') + ' 队；胜利队伍：' + safeText(state.winnerTeamId) + ' 队。</p>';
  const confirmButton = settlementStatsExpanded ? '' : '<button class="confirm" onclick="showSettlementStats()">确认</button>';
  return '<div class="gameOverBackdrop" role="presentation">' +
    '<div class="gameOverOverlay ' + className + '" role="dialog" aria-modal="true" aria-labelledby="gameOverTitle">' +
      '<h2 id="gameOverTitle">' + outcome + '</h2>' +
      body +
      '<div class="gameOverActions">' + confirmButton + '<button onclick="exitToCleanStart()">退出</button></div>' +
    '</div>' +
  '</div>';
}

function renderZodiacMat(source, target, active) {
  return '<div class="zodiacMat">' +
    renderSetupPause(active) +
    renderMulliganCountdown() +
    renderPlayedCards() +
    '<div class="playSlots">' +
      '<div class="playSlot">星位</div>' +
      '<div class="playSlot">太阳</div>' +
      '<div class="playSlot">战区</div>' +
      '<div class="playSlot">月亮</div>' +
      '<div class="playSlot">命运</div>' +
    '</div>' +
    '<div class="duelLine"><div class="attackBeam"></div></div>' +
  '</div>';
}

function renderLegacyTargetPicker(active) {
  if (!active || state.phase !== 'main') return '';
  const enemies = enemiesOf(active);
  if (enemies.length === 0) return '';
  const selected = selectedEnemyOf(active);
  const buttons = enemies.map(enemy => {
    const visual = characterVisual(enemy);
    const selectedClass = selected?.id === enemy.id ? ' selected' : '';
    const lowHpClass = enemy.hp <= 1 ? ' lowHp' : '';
    return '<button class="legacyTargetButton ' + visual.className + selectedClass + lowHpClass + '" onclick="setTarget(\'' + active.id + '\', \'enemy\', \'' + enemy.id + '\')">' +
      '<span>敌方目标</span>' +
      '<strong>' + safeText(enemy.name) + ' · ' + safeText(visual.name) + '</strong>' +
      '<small>生命 ' + enemy.hp + '/' + enemy.maxHp + ' · 状态 ' + safeText(statuses(enemy)) + '</small>' +
      '</button>';
  }).join('');
  return '<div class="legacyTargetPicker">' +
    '<div class="legacyTargetHeader"><span>选择攻击目标</span><small>可选择任一存活敌人，不限默认目标</small></div>' +
    '<div class="legacyTargetChoices">' + buttons + '</div>' +
    '</div>';
}

function renderStageStats() {
  const infectionStats = state.mode === 'infection'
    ? '<span>潜伏感染 ' + state.players.filter(player => player.factionId === 'survivor' && player.infected && !player.eliminated).length + '</span>' +
      '<span>转化 ' + (state.infection?.metrics?.transformed || 0) + '</span>'
    : '';
  return '<div class="stageStats">' +
    '<span>牌堆 ' + state.deck.length + '</span>' +
    '<span>弃牌堆 ' + state.discard.length + '</span>' +
    '<span>额外回合 ' + state.metrics.extraTurns + '</span>' +
    '<span>状态命中 ' + state.metrics.statusesApplied + '</span>' +
    infectionStats +
    '</div>';
}

function renderSetupPause(active) {
  if (!setupPaused || !active) return '';
  const visual = characterVisual(active);
  const orderedPlayers = state.mulliganPendingPlayerIds
    .map((id) => state.players.find((player) => player.id === id))
    .filter(Boolean);
  const order = orderedPlayers.map((player) => characterVisual(player).name).join(' → ');
  const seatOrder = [...state.players].sort((left, right) => left.seatIndex - right.seatIndex);
  const activeIndex = seatOrder.findIndex((player) => player.id === active.id);
  const activeAngle = -90 + activeIndex * (360 / seatOrder.length);
  const pointerAngle = activeAngle + 90;
  const wheelSeats = seatOrder.map((player, index) => {
    const angle = (-90 + index * (360 / seatOrder.length)) * Math.PI / 180;
    const left = 50 + Math.cos(angle) * 40;
    const top = 50 + Math.sin(angle) * 40;
    const selectedClass = player.id === active.id ? ' selected' : '';
    return '<span class="openingWheelSeat' + selectedClass + '" style="--seat-left:' + left.toFixed(2) + '%;--seat-top:' + top.toFixed(2) + '%">' +
      safeText(characterVisual(player).name) +
    '</span>';
  }).join('');
  const fate = state.openingFate;
  const fateCard = fate?.card;
  const recipient = fate ? state.players.find((player) => player.id === fate.recipientId) : null;
  const directionText = state.turnDirection === -1 ? '逆时针' : '顺时针';
  const fateCardHtml = setupFateDrawn && fateCard
    ? '<div class="openingFateCard">' +
        assetImageHtml('openingFateArt', cardAssetUrls(fateCard), fateCard.name) +
        '<span>' + safeText(fateCard.name) + '</span>' +
      '</div>'
    : '<div class="openingFateCard cardBack">' +
        assetImageHtml('openingFateArt', ['/zodiac-war-playtest/assets/ui/card-back.jpg'], '命运牌背面') +
        '<span>命运牌</span>' +
      '</div>';
  const boss = state.mode === 'infection'
    ? state.players.find(player => player.id === state.infection?.bossPlayerId)
    : null;
  const fateSummaryHtml = setupFateDrawn
    ? '<span>命运牌决定 <b>' + directionText + '</b> 行动</span>' +
      '<span>末位 <b>' + safeText(recipient ? characterVisual(recipient).name : '未知') + '</b> 获得该命运牌</span>' +
      '<span>行动顺序：' + safeText(order) + '</span>'
    : '<span>请由先手 <b>' + safeText(visual.name) + '</b> 抽取命运牌</span>' +
      '<span>太阳决定顺时针，月亮决定逆时针；翻牌前不显示行动方向</span>';
  const buttonText = !setupRevealReady
    ? '星盘旋转中...'
    : setupFateDrawn
      ? '确认结果，开始换牌'
      : '由' + visual.name + '抽命运牌';
  const buttonAction = setupFateDrawn ? 'confirmSetup()' : 'drawOpeningFate()';
  return '<div class="setupPause ' + (setupFateDrawn ? 'fateDrawn' : 'awaitingFate') + '">' +
    '<div class="openingWheelStage" aria-label="命运罗盘">' +
      assetImageHtml('openingWheelArt', ['/zodiac-war-playtest/assets/ui/fate-compass.png'], '命运罗盘') +
      '<div class="openingWheelRing"></div>' +
      '<div class="openingWheelPointer" style="--pointer-angle:' + pointerAngle.toFixed(2) + 'deg"></div>' +
      wheelSeats +
      '<div class="openingWheelCore">命运罗盘</div>' +
    '</div>' +
    '<div class="openingFatePanel">' +
      '<strong>' + (boss
        ? '月蚀感染揭晓：' + safeText(characterVisual(boss).name) + ' 为初始感染者并先手'
        : '星盘决定：' + safeText(visual.name) + ' 先手') + '</strong>' +
      fateCardHtml +
      '<div class="openingFateSummary">' + fateSummaryHtml + '</div>' +
      '<button id="confirmSetupButton" ' + (setupRevealReady ? '' : 'disabled') + ' onclick="' + buttonAction + '">' + safeText(buttonText) + '</button>' +
    '</div>' +
  '</div>';
}

function renderMulliganCountdown() {
  if (setupPaused || state.phase !== 'mulligan' || !mulliganDeadline) return '';
  const remaining = Math.max(0, Math.ceil((mulliganDeadline - Date.now()) / 1000));
  const pendingNames = state.mulliganPendingPlayerIds
    .map(id => state.players.find(player => player.id === id))
    .filter(Boolean)
    .map(player => characterVisual(player).name)
    .join(' / ');
  return '<div class="mulliganTimer"><strong>全员同时确认起手牌</strong><div><b id="mulliganTimerSeconds">' + remaining + '</b> 秒</div><small>时间到后，未操作角色默认保留起手。待确认：' + safeText(pendingNames || '无') + '</small></div>';
}

function renderEntrustButton() {
  const localPlayer = localHumanPlayer();
  if (!localPlayer || setupPaused || state.phase === 'gameOver') return '';
  const entrusted = localPlayer.control === 'ai';
  return '<button class="entrustControl primaryAction" aria-pressed="' + (entrusted ? 'true' : 'false') + '" onclick="toggleEntrust()">' +
    (entrusted ? '取消托管' : '托管') +
    '</button>';
}

function renderTableControls(active, activeOpponent, activeAlly, attackSource, defenseTarget, handFocus) {
  if (state.pendingSkillDecisions?.length) return '';
  const mulliganPlayer = handFocus || active;
  const canMulligan = !setupPaused && state.phase === 'mulligan' && mulliganPlayer && state.mulliganPendingPlayerIds.includes(mulliganPlayer.id);
  const isFocusedActionPlayer = !setupPaused && handFocus?.control === 'human' && active?.id === handFocus?.id;
  const phaseButtons = [];
  if (canMulligan) {
    phaseButtons.push('<button onclick="mulligan(false, \'' + (mulliganPlayer?.id || '') + '\')">保留起手牌</button>');
    phaseButtons.push('<button onclick="mulligan(true, \'' + (mulliganPlayer?.id || '') + '\')">更换起手牌</button>');
  }
  if (state.phase === 'draw' && isFocusedActionPlayer) {
    phaseButtons.push('<button onclick="drawPhase()">摸牌阶段</button>');
  }
  if (state.phase === 'main' && isFocusedActionPlayer) {
    const emptyHand = handFocus && Array.isArray(handFocus.hand) && handFocus.hand.length === 0;
    phaseButtons.push('<button' + (emptyHand ? ' class="endMainEmpty"' : '') + ' onclick="endMain()">结束出牌</button>');
  }
  if (state.phase === 'discard' && isFocusedActionPlayer) {
    phaseButtons.push('<button onclick="autoDiscard()">自动弃至体力</button>');
  }
  if (state.phase === 'infectionResponse' && state.infection?.pendingInfectionCard?.targetId === handFocus?.id) {
    phaseButtons.push('<button onclick="respondInfection(\'' + handFocus.id + '\')">不抵消感染</button>');
  }
  if (state.phase === 'rescue' && (state.pendingRescue || state.infection?.pendingDying)?.currentResponderId === handFocus?.id) {
    phaseButtons.push('<button onclick="skipInfectionRescue(\'' + handFocus.id + '\')">放弃急救</button>');
  }
  if (state.phase === 'reward' && state.infection?.pendingReward?.playerId === handFocus?.id) {
    const canRewardHeal = handFocus.hp < handFocus.maxHp && !handFocus.infected;
    const canRewardCleanse = handFocus.infected || ['burn', 'frozen', 'blind', 'silence'].some(status => handFocus.statuses?.[status]);
    phaseButtons.push('<button onclick="chooseInfectionReward(\'' + handFocus.id + '\', \'draw2\')">摸 2 张</button>');
    phaseButtons.push('<button ' + (canRewardHeal ? '' : 'disabled') + ' onclick="chooseInfectionReward(\'' + handFocus.id + '\', \'heal1\')">回复 1 点</button>');
    phaseButtons.push('<button ' + (canRewardCleanse ? '' : 'disabled') + ' onclick="chooseInfectionReward(\'' + handFocus.id + '\', \'cleanse\')">移除状态/感染</button>');
    phaseButtons.push('<button onclick="chooseInfectionReward(\'' + handFocus.id + '\', \'elementCard\')">获得本元素牌</button>');
  }
  if (phaseButtons.length === 0) return '';
  const controlsClass = canMulligan ? 'stageHandControls table mulliganControls' : 'stageHandControls table';
  return '<div class="' + controlsClass + '">' + phaseButtons.join('') + '</div>';
}

function renderBattleStage(active, activeOpponent, attackSource, defenseTarget, tableControls = '', handFocus = null) {
  return window.TabletopV10.renderBattleStage(active, activeOpponent, attackSource, defenseTarget, tableControls, handFocus);
}

function renderLegacyBattleStage(active, activeOpponent, attackSource, defenseTarget, tableControls = '', handFocus = null) {
  const source = attackSource || active;
  const target = defenseTarget || activeOpponent || (source ? selectedEnemyOf(source) : null);
  const focus = handFocus || active;
  const prompt = active ? actionPrompt(active, activeOpponent, attackSource, defenseTarget) : '等待牌局开始';
  const focusHand = renderFocusedHand(focus, tableControls);
  const activeSkillPanel = renderActiveSkillPanel(focus);
  const pendingSkillPanel = renderPendingSkillDecisionPanel(focus);
  return '<section class="arena mode' + state.players.length + ' ' + (latestEffect ? 'animating' : '') + '">' +
    '<svg id="actionGuideLayer" aria-hidden="true"><g id="actionGuideBeams"></g></svg>' +
    '<div class="arenaTopBar"><div class="arenaStatusLine"><button onclick="exitToCleanStart()">退出</button>' +
    renderEntrustButton() +
    renderStageLogPanel() +
    '<div class="stagePrompt">' + safeText(formatLogMessage(prompt)) + '</div></div>' + renderStageStats() + '</div>' +
    '<div class="battleStage">' +
    renderZodiacMat(source, target, active) +
    renderTableSeatRing(active, focus) +
    (pendingSkillPanel ? '<div class="skillActionOverlay">' + pendingSkillPanel + '</div>' : activeSkillPanel ? '<div class="skillActionOverlay">' + activeSkillPanel + '</div>' : '') +
    '</div>' +
    '<div class="stageHand"><div class="stageHandLayout"><div class="stageHandMain">' + focusHand + '</div><div class="focusCharacterDock">' + renderFocusedSkillActions(focus) + renderFocusCard(focus) + '</div></div></div>' +
    renderPlayerInspector() +
    renderSeatSkillTip() +
    '<div id="effectLayer"></div>' +
    '</section>';
}

function canClickHandCard(player, card, canAct, canRespond, canHammerBreak) {
  if (shouldPlayCardAsRescue(player, card, dyingRescueTargetOf(player))) return true;
  if (canRespond) return canUseDefenseCard(player, card);
  if (canHammerBreak) return true;
  if (canAmplifyPendingAttackWithMoon(player, card)) return true;
  if (!canAct) return false;
  if (isBasicAttackCard(card) && !canPlayMoreBasicAttacks(player)) return false;
  if (!player.statuses?.frozen) return true;
  return card.kind !== 'normalAttack' && card.kind !== 'statusAttack' && card.kind !== 'aoe';
}

function stealTargetsOf(player) {
  if (!player) return [];
  const targets = player.hand.map(card => ({ card, source: '手牌' }));
  if (player.equipment.weapon) targets.push({ card: player.equipment.weapon, source: '武器' });
  if (player.equipment.armor) targets.push({ card: player.equipment.armor, source: '防具' });
  return targets;
}

function defaultGeminiStealCostIds(player) {
  const air = player.hand.find(card => card.element === 'air');
  const other = player.hand.find(card => card.id !== air?.id);
  return air && other ? [air.id, other.id] : player.hand.slice(0, 2).map(card => card.id);
}

function enemiesOf(player) {
  if (state.mode === 'infection') {
    return state.players.filter(candidate => candidate.id !== player.id && candidate.hp > 0 && !candidate.eliminated);
  }
  return state.players.filter(candidate => candidate.teamId !== player.teamId && candidate.hp > 0);
}

function alliesOf(player) {
  if (state.mode === 'infection') {
    return state.players.filter(candidate => candidate.factionId === player.factionId && candidate.hp > 0 && !candidate.eliminated);
  }
  return state.players.filter(candidate => candidate.teamId === player.teamId && candidate.hp > 0);
}

function dyingRescueTargetOf(player) {
  if (!state || !player) return null;
  if (state.pendingRescue) return state.players.find(candidate => candidate.id === state.pendingRescue.targetId) || null;
  if (state.mode === 'infection') {
    const pending = (state.pendingRescue || state.infection?.pendingDying);
    if (!pending) return null;
    return state.players.find(candidate =>
      candidate.id === pending.targetId && candidate.hp <= 0 && !candidate.eliminated
    ) || null;
  }
  if (state.winnerTeamId || state.winnerId) return null;
  const dying = state.players.filter(candidate => candidate.hp <= 0 && !candidate.eliminated);
  return dying.find(candidate => candidate.teamId === player.teamId) || dying[0] || null;
}

function canUseRescueCard(player, card) {
  const legalKind = state.mode === 'infection' ? card.kind === 'sun' : card.kind === 'sun' || card.kind === 'energy';
  return legalKind && Boolean(dyingRescueTargetOf(player));
}

function shouldPlayCardAsRescue(player, card, target) {
  if (!player || !card || !target) return false;
  if (card.kind !== 'sun' && card.kind !== 'energy') return false;
  if (target.hp > 0) return false;
  const isOwnMainTurn = state.phase === 'main' && state.activePlayerId === player.id;
  if (isOwnMainTurn) return false;
  return true;
}

function canAmplifyPendingAttackWithMoon(player, card) {
  return Boolean(
    player &&
    card?.kind === 'moon' &&
    state.phase === 'response' &&
    state.pendingAttack &&
    state.pendingAttack.sourceId === player.id &&
    !state.pendingAttack.moonAmplifiedTargetId
  );
}

function isAriesRamCostCard(player, card, skillId) {
  if (!player || !card) return false;
  const isAttackCost = card.kind === 'normalAttack' || card.kind === 'statusAttack';
  if (!isAttackCost) return false;
  if (skillId === 'aries.ram') return card.element === 'fire';
  if (skillId === 'aries.burnSoul') return card.element !== 'fire' && !player.flags.usedAriesBurnSoul;
  return false;
}

function isAquariusMassHealCostCard(player, card) {
  if (!player || !card) return false;
  return player.hand.includes(card);
}

function activeSkillCostDraft(player) {
  if (!player || state.activePlayerId !== player.id || state.phase !== 'main') return null;
  const id = selectedSkills[player.id];
  if (id === 'pisces.observeTide') {
    const costCardIds = (piscesObserveTideDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId));
    piscesObserveTideDrafts[player.id] = { costCardIds };
    return {
      skillId: id,
      skillName: '观潮',
      costCardIds,
      validCardIds: player.hand.map(card => card.id),
      ready: costCardIds.length > 0,
      requiresTarget: false,
      autoConfirm: false,
      hint: '点击要替换的手牌，数量不限；选好后点击“确认观潮”，弃几张摸几张。'
    };
  }
  if (id === 'aries.ram' || id === 'aries.burnSoul') {
    const costCardIds = (ariesRamDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId));
    ariesRamDrafts[player.id] = { costCardIds };
    const validCardIds = player.hand
      .filter(card => isAriesRamCostCard(player, card, id))
      .map(card => card.id);
    return {
      skillId: id,
      skillName: id === 'aries.burnSoul' ? '燃魂' : '羊角冲',
      costCardIds,
      validCardIds,
      ready: costCardIds.length === 1,
      requiresTarget: true,
      autoConfirm: false,
      hint: id === 'aries.burnSoul'
        ? '点击 1 张非火普通攻击或状态攻击作为燃魂费用；选好后点击战场上的发光敌方目标释放。AOE、装备、功能、星能、太阳和月亮不能支付羊角冲。'
        : '点击 1 张火普通攻击或状态攻击作为羊角冲费用；选好后点击战场上的发光敌方目标释放。AOE、装备、功能、星能、太阳和月亮不能支付羊角冲。'
    };
  }
  if (id === 'aquarius.massHeal') {
    const costCardIds = (aquariusMassHealDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId))
      .slice(0, 2);
    aquariusMassHealDrafts[player.id] = { costCardIds };
    const hasAir = costCardIds.some(cardId => player.hand.find(card => card.id === cardId)?.element === 'air');
    return {
      skillId: id,
      skillName: '神酿',
      costCardIds,
      validCardIds: player.hand.filter(card => isAquariusMassHealCostCard(player, card)).map(card => card.id),
      ready: costCardIds.length === 2 && hasAir,
      requiresTarget: false,
      autoConfirm: true,
      hint: '点击 2 张高亮手牌作为费用，其中至少 1 张必须是风牌；发动后先失去 1 点生命，再触发倾杯。'
    };
  }
  if (id === 'weapon.waterCodex') {
    const costCardIds = (waterCodexDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId))
      .slice(0, 2);
    waterCodexDrafts[player.id] = { costCardIds };
    return {
      skillId: id,
      skillName: '潮汐合成',
      costCardIds,
      validCardIds: player.hand.map(card => card.id),
      ready: costCardIds.length === 2,
      requiresTarget: false,
      autoConfirm: false,
      hint: '点击任意 2 张高亮手牌作为素材，确认后生成 1 张本角色属性合成牌，再从手牌中正常使用。'
    };
  }
  if (id === 'leo.roar') {
    const stored = leoRoarDrafts[player.id] || { costCardIds: [], targetIds: [] };
    const costCardIds = stored.costCardIds
      .filter(cardId => player.hand.some(card => card.id === cardId && card.element === 'fire'))
      .slice(0, 1);
    const targetIds = [...new Set(stored.targetIds || [])]
      .filter(targetId => state.players.some(candidate =>
        candidate.id === targetId && candidate.id !== player.id && candidate.hp > 0 && !candidate.eliminated
      ))
      .slice(0, 3);
    leoRoarDrafts[player.id] = { costCardIds, targetIds };
    return {
      skillId: id,
      skillName: '狮吼',
      costCardIds,
      targetIds,
      validCardIds: player.hand.filter(card => card.element === 'fire').map(card => card.id),
      ready: costCardIds.length === 1 && targetIds.length >= 1 && targetIds.length <= 3,
      requiresTarget: true,
      autoConfirm: false,
      hint: '点击 1 张火牌作为费用，再依次点击 1–3 名其他存活角色；选好后再次点击“狮吼”发动。'
    };
  }
  if (id === 'leo.order') {
    const costCardIds = (leoOrderDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId))
      .slice(0, 1);
    leoOrderDrafts[player.id] = { costCardIds };
    return {
      skillId: id,
      skillName: '王令',
      costCardIds,
      validCardIds: player.hand.map(card => card.id),
      ready: costCardIds.length === 1,
      requiresTarget: true,
      autoConfirm: false,
      hint: '点击 1 张任意手牌作为王令费用；选好后点击战场上的目标角色。'
    };
  }
  if (id === 'taurus.armor') {
    const costCardIds = (taurusArmorDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId))
      .slice(0, 1);
    taurusArmorDrafts[player.id] = { costCardIds };
    return {
      skillId: id,
      skillName: '筑甲',
      costCardIds,
      validCardIds: player.hand.filter(card => card.element === 'earth').map(card => card.id),
      ready: costCardIds.length === 1,
      requiresTarget: false,
      autoConfirm: true,
      hint: '点击 1 张土牌作为筑甲费用；选中后立即为自己叠 1 点护甲。'
    };
  }
  if (id === 'sagittarius.seekEquipment') {
    const costCardIds = (sagittariusSeekDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId))
      .slice(0, 2);
    sagittariusSeekDrafts[player.id] = { costCardIds };
    const hasFire = costCardIds.some(cardId => player.hand.find(card => card.id === cardId)?.element === 'fire');
    return {
      skillId: id,
      skillName: '寻器',
      costCardIds,
      validCardIds: player.hand.map(card => card.id),
      ready: costCardIds.length === 2 && hasFire,
      requiresTarget: false,
      autoConfirm: true,
      hint: '点击 2 张手牌，其中至少 1 张是火牌；若牌库没有装备，费用原样返还。'
    };
  }
  if (id === 'virgo.purify') {
    const costCardIds = (virgoPurifyDrafts[player.id]?.costCardIds || [])
      .filter(cardId => player.hand.some(card => card.id === cardId))
      .slice(0, 1);
    virgoPurifyDrafts[player.id] = { costCardIds };
    return {
      skillId: id,
      skillName: '净化',
      costCardIds,
      validCardIds: player.hand.filter(card => card.element === 'earth').map(card => card.id),
      ready: costCardIds.length === 1,
      requiresTarget: true,
      autoConfirm: false,
      hint: '点击 1 张土牌，再点击任一存活角色。感染模式中，感染目标优先移除感染。'
    };
  }
  return null;
}

function toggleSkillCostCard(playerId, cardId) {
  const player = state.players.find(candidate => candidate.id === playerId);
  const draft = activeSkillCostDraft(player);
  if (!draft || !draft.validCardIds.includes(cardId)) return;
  if (draft.skillId === 'pisces.observeTide') {
    const selected = draft.costCardIds;
    piscesObserveTideDrafts[player.id] = { costCardIds: selected.includes(cardId) ? selected.filter(id => id !== cardId) : [...selected, cardId] };
    render();
    return;
  }
  if (draft.skillId === 'aries.ram' || draft.skillId === 'aries.burnSoul') {
    const costCardIds = draft.costCardIds.includes(cardId) ? [] : [cardId];
    ariesRamDrafts[player.id] = { costCardIds };
    render();
    return;
  }
  if (draft.skillId === 'leo.roar') {
    const costCardIds = draft.costCardIds.includes(cardId) ? [] : [cardId];
    leoRoarDrafts[player.id] = { costCardIds, targetIds: draft.targetIds || [] };
    render();
    return;
  }
  if (draft.skillId === 'taurus.armor') {
    taurusArmorDrafts[player.id] = { costCardIds: [cardId] };
    return confirmActiveSkillCost(player.id);
  }
  if (draft.skillId === 'aquarius.massHeal') {
    const selected = draft.costCardIds;
    const costCardIds = selected.includes(cardId)
      ? selected.filter(id => id !== cardId)
      : selected.length < 2
        ? [...selected, cardId]
        : [selected[1], cardId];
    aquariusMassHealDrafts[player.id] = { costCardIds };
    const nextDraft = activeSkillCostDraft(player);
    if (nextDraft?.ready && nextDraft.autoConfirm) return confirmActiveSkillCost(player.id);
    render();
    return;
  }
  if (draft.skillId === 'weapon.waterCodex') {
    const selected = draft.costCardIds;
    const costCardIds = selected.includes(cardId)
      ? selected.filter(id => id !== cardId)
      : selected.length < 2
        ? [...selected, cardId]
        : [selected[1], cardId];
    waterCodexDrafts[player.id] = { costCardIds };
    const nextDraft = activeSkillCostDraft(player);
    if (nextDraft?.ready && nextDraft.autoConfirm) return confirmActiveSkillCost(player.id);
    render();
    return;
  }
  if (draft.skillId === 'leo.order') {
    leoOrderDrafts[player.id] = { costCardIds: draft.costCardIds.includes(cardId) ? [] : [cardId] };
    render();
  }
  if (draft.skillId === 'sagittarius.seekEquipment') {
    const selected = draft.costCardIds;
    const costCardIds = selected.includes(cardId)
      ? selected.filter(id => id !== cardId)
      : selected.length < 2
        ? [...selected, cardId]
        : [selected[1], cardId];
    sagittariusSeekDrafts[player.id] = { costCardIds };
    const nextDraft = activeSkillCostDraft(player);
    if (nextDraft?.ready) return confirmActiveSkillCost(player.id);
    render();
  }
  if (draft.skillId === 'virgo.purify') {
    virgoPurifyDrafts[player.id] = { costCardIds: draft.costCardIds.includes(cardId) ? [] : [cardId] };
    render();
  }
}

function cancelActiveSkillCost(playerId) {
  delete piscesObserveTideDrafts[playerId];
  delete ariesRamDrafts[playerId];
  delete leoRoarDrafts[playerId];
  delete leoOrderDrafts[playerId];
  delete aquariusMassHealDrafts[playerId];
  delete waterCodexDrafts[playerId];
  delete taurusArmorDrafts[playerId];
  delete sagittariusSeekDrafts[playerId];
  delete virgoPurifyDrafts[playerId];
  delete selectedSkills[playerId];
  render();
}

function confirmActiveSkillCost(playerId, targetId = '') {
  const player = state.players.find(candidate => candidate.id === playerId);
  const draft = activeSkillCostDraft(player);
  const opponent = player ? selectedEnemyOf(player) : null;
  const target = targetId ? state.players.find(candidate => candidate.id === targetId) : opponent;
  if (!player || !draft || !draft.ready) return;
  if (draft.skillId === 'pisces.observeTide') {
    if (setupPaused || !isSkillUsable(player, draft.skillId, true)) return;
    delete piscesObserveTideDrafts[playerId];
    delete selectedSkills[playerId];
    return action({ type: 'useSkill', playerId, skillId: draft.skillId, cardIds: draft.costCardIds });
  }
  if ((draft.skillId === 'aries.ram' || draft.skillId === 'aries.burnSoul') && target) {
    if (needsSkillDistanceCost(player, 'aries.ram', target)) {
      const distanceDraft = { type: 'useSkill', playerId, skillId: 'aries.ram', targetId: target.id, cardIds: draft.costCardIds };
      const candidates = distanceCostCandidates(player, distanceDraft);
      if (candidates.length === 0) {
        error = '跨距离需要额外弃 1 张手牌，但当前没有可支付的手牌。';
        render();
        return;
      }
      distanceCostDraft = distanceDraft;
      delete selectedSkills[playerId];
      render();
      return;
    }
    delete ariesRamDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'aries.ram',
      targetId: target.id,
      cardIds: draft.costCardIds
    });
  }
  if (draft.skillId === 'taurus.armor') {
    delete taurusArmorDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'taurus.armor',
      targetId: playerId,
      cardIds: draft.costCardIds
    });
  }
  if (draft.skillId === 'aquarius.massHeal') {
    delete aquariusMassHealDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'aquarius.massHeal',
      targetId: opponent?.id,
      cardIds: draft.costCardIds
    });
  }
  if (draft.skillId === 'weapon.waterCodex') {
    if (!canActivateEquipmentSkill(player, draft.skillId)) return;
    delete waterCodexDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'weapon.waterCodex',
      cardIds: draft.costCardIds
    });
  }
  if (draft.skillId === 'leo.roar') {
    delete leoRoarDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'leo.roar',
      targetId: draft.targetIds[0],
      targetIds: draft.targetIds,
      cardIds: draft.costCardIds
    });
  }
  if (draft.skillId === 'leo.order' && target) {
    delete leoOrderDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'leo.order',
      targetId: target.id,
      cardIds: draft.costCardIds
    });
  }
  if (draft.skillId === 'sagittarius.seekEquipment') {
    delete sagittariusSeekDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'sagittarius.seekEquipment',
      targetId: playerId,
      cardIds: draft.costCardIds
    });
  }
  if (draft.skillId === 'virgo.purify' && target) {
    delete virgoPurifyDrafts[playerId];
    delete selectedSkills[playerId];
    return action({
      type: 'useSkill',
      playerId,
      skillId: 'virgo.purify',
      targetId: target.id,
      option: state.mode === 'infection' && target.infected ? 'infection' : 'normal',
      cardIds: draft.costCardIds
    });
  }
}

function renderSkillCostBar(player) {
  const draft = activeSkillCostDraft(player);
  if (!draft) return '';
  const selectedCards = draft.costCardIds
    .map(cardId => player.hand.find(card => card.id === cardId))
    .filter(Boolean)
    .map(cardText)
    .join(' / ') || '未选择';
  const selectedTargets = draft.skillId === 'leo.roar'
    ? (draft.targetIds || [])
      .map(targetId => state.players.find(candidate => candidate.id === targetId))
      .filter(Boolean)
      .map(battleDisplayName)
      .join('、') || '未选择'
    : '';
  const isRoar = draft.skillId === 'leo.roar';
  const costLabel = draft.skillId === 'pisces.observeTide' ? '弃牌（' + draft.costCardIds.length + ' 张）：' : draft.skillId === 'weapon.waterCodex' ? '素材（' + draft.costCardIds.length + '/2）：' : '费用：';
  const hint = isRoar ? (draft.ready ? '再次点击狮吼发动；点已选角色可取消。' : draft.costCardIds.length ? '选择 1–3 名其他角色。' : '先选择 1 张火牌。') : draft.hint;
  return '<div class="skillCostBar' + (isRoar ? ' leoRoarCost' : '') + '">' +
    '<span><strong>' + safeText(draft.skillName) + '</strong>：' + safeText(hint) + '<br>' + costLabel + safeText(selectedCards) +
      (draft.skillId === 'leo.roar' ? '<br>目标：' + safeText(selectedTargets) + '（' + draft.targetIds.length + '/3）' : '') + '</span>' +
    '<div class="skillCostActions"><button onclick="cancelActiveSkillCost(\'' + player.id + '\')">取消技能</button></div>' +
    '</div>';
}

function selectedEnemyOf(player) {
  const enemies = enemiesOf(player);
  return enemies.find(candidate => targetDrafts[player.id]?.enemyId === candidate.id) || enemies[0];
}

function selectedAllyOf(player) {
  const allies = alliesOf(player);
  return allies.find(candidate => targetDrafts[player.id]?.allyId === candidate.id) || allies[0];
}

function setTarget(playerId, kind, targetId) {
  targetDrafts[playerId] = { ...(targetDrafts[playerId] || {}), [kind + 'Id']: targetId };
  render();
}

function selectEquipmentInfo(playerId, slot) {
  selectedEquipment[playerId] = slot;
  openPlayerInspector(playerId, 'equipment');
}

function beginEquipmentAction(playerId, skillId) {
  const player = state?.players.find(candidate => candidate.id === playerId);
  if (!player || !canActivateEquipmentSkill(player, skillId)) return;
  inspectedPlayerId = '';
  skill(player, skillId);
}

function confirmAirCompass(playerId, element) {
  delete selectedSkills[playerId];
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'weapon.airCompass',
    option: element
  });
}

function modeSeatCount(nextMode = currentMode()) {
  const normalizedMode = nextMode === 'infection' ? 'infection' : nextMode === 'standard' ? 'standard' : 'test';
  const modeConfig = clientGameModes[normalizedMode];
  const allowed = modeConfig.playerCounts || [modeConfig.seatCount];
  const inputCount = Number(document.getElementById('playerCount')?.value);
  const configuredCount = Number(config.playerCount);
  if (allowed.includes(inputCount)) return inputCount;
  if (allowed.includes(configuredCount)) return configuredCount;
  return allowed[0];
}

function currentMode() {
  if (config.mode === 'infection') return 'infection';
  return config.mode === 'standard' ? 'standard' : 'test';
}

function activeSeatIds(nextMode = currentMode()) {
  return allSeatIds.slice(0, modeSeatCount(nextMode));
}

function updateSeatControlVisibility() {
  const selectedMode = currentMode();
  const customCharacters = selectedMode === 'test';
  const activeIds = new Set(activeSeatIds());
  config.playerCount = activeIds.size;
  for (const id of allSeatIds) {
    const visible = activeIds.has(id);
    const seatConfig = document.getElementById('seat' + id + 'Config');
    if (seatConfig) seatConfig.style.display = visible ? '' : 'none';
    const characterSelect = document.getElementById('c' + id);
    const controlSelect = document.getElementById('m' + id);
    const randomCharacterNote = seatConfig?.querySelector('.randomCharacterNote');
    if (characterSelect) characterSelect.style.display = visible && customCharacters ? '' : 'none';
    if (controlSelect) controlSelect.style.display = visible ? '' : 'none';
    if (randomCharacterNote) randomCharacterNote.style.display = visible && !customCharacters ? 'flex' : 'none';
  }
  const playerCountField = document.getElementById('playerCountField');
  if (playerCountField) playerCountField.style.display = selectedMode === 'test' ? 'none' : '';
  const hint = document.getElementById('modeSettingHint');
  if (hint) {
    hint.textContent = selectedMode === 'test'
      ? '测试模式可配置每名玩家的星座与控制方式；进入牌桌后按黄道顺序生成座位。'
      : selectedMode === 'standard'
        ? '标准模式仅设置人数与真人/AI；本局星座由系统随机且不重复。'
        : '月蚀模式仅设置人数与真人/AI；初始感染者锁定摩羯，其余星座随机且不重复。';
  }
}

function setMode(nextMode) {
  const normalizedMode = nextMode === 'infection' ? 'infection' : nextMode === 'standard' ? 'standard' : 'test';
  const defaults = clientGameModes[normalizedMode];
  config.mode = normalizedMode;
  config.playerCount = defaults.playerCounts[0];
  config.characters = [...defaults.characters];
  config.controls = [...defaults.controls];
  render();
}

function syncStartControls() {
  config.mode = config.mode || (state.mode === 'infection' ? 'infection' : 'test');
  const current = currentMode();
  const modeInput = document.getElementById('mode');
  if (modeInput) modeInput.value = current;
  const playerCountInput = document.getElementById('playerCount');
  if (playerCountInput) {
    const allowed = clientGameModes[current].playerCounts || [clientGameModes[current].seatCount];
    const configuredCount = Number(config.playerCount || state.players.length || allowed[0]);
    const selectedCount = allowed.includes(configuredCount) ? configuredCount : allowed[0];
    playerCountInput.innerHTML = allowed
      .map(count => '<option value="' + count + '">' + count + ' 人</option>')
      .join('');
    playerCountInput.value = String(selectedCount);
    config.playerCount = selectedCount;
  }
  allSeatIds.forEach((id, index) => {
    const characterSelect = document.getElementById('c' + id);
    const controlSelect = document.getElementById('m' + id);
    if (characterSelect) characterSelect.value = config.characters[index] || clientGameModes[current].characters[index] || 'aries';
    if (controlSelect) controlSelect.value = config.controls[index] || clientGameModes[current].controls[index] || 'ai';
  });
  document.getElementById('startModeTest')?.classList.toggle('selected', current === 'test');
  document.getElementById('startModeStandard')?.classList.toggle('selected', current === 'standard');
  document.getElementById('startModeInfection')?.classList.toggle('selected', current === 'infection');
  updateSeatControlVisibility();
}

async function api(path, body) {
  let json;
  try {
    const res = await fetch(path, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
    json = await res.json();
  } catch (_error) {
    error = '本地服务连接失败：请刷新页面；如果仍失败，请重启游戏服务。';
    render();
    return;
  }
  previousState = state ? JSON.parse(JSON.stringify(state)) : null;
  state = json.state;
  clientMatchId = json.matchId || clientMatchId;
  config = json.config || config;
  lobbyOpen = Boolean(json.lobbyOpen);
  localHumanPlayerId = json.localPlayerId || localHumanPlayerId;
  setupPaused = Boolean(json.setupPaused);
  setupFateDrawn = Boolean(json.setupFateDrawn);
  syncSetupReveal();
  mulliganDeadline = json.mulliganDeadline ?? null;
  actionDeadline = json.actionDeadline ?? null;
  actionStartedAt = json.actionStartedAt ?? null;
  if (path === '/api/restart' || path === '/api/exit' || state?.phase !== 'gameOver') settlementStatsExpanded = false;
  if (state?.phase !== 'mulligan') lastMulliganFocusId = '';
  error = json.error || '';
  latestEffect = setupPaused || lobbyOpen ? null : deriveLatestEffect();
  normalizeTransientSelections();
  render();
  playLatestEffectSound();
  if (path !== '/api/state') closeDebugPanel();
  if (path !== '/api/ai') {
    aiAdvanceDelayKey = '';
    aiAdvanceNotBefore = 0;
  }
  maybeAutoAdvanceAi();
}

function closeDebugPanel() {
  const panel = document.getElementById('debugPanel');
  if (panel) panel.open = false;
}

function action(body) { return api('/api/action', body); }
function focusedMulliganPlayerId() {
  if (!state || state.phase !== 'mulligan') return state?.activePlayerId;
  const pending = state.mulliganPendingPlayerIds || [];
  const pendingHuman = pending
    .map(id => state.players.find(player => player.id === id))
    .find(player => player?.control === 'human');
  return pendingHuman?.id || pending[0] || state.activePlayerId;
}
function finishMulliganTimeout() {
  if (finishingMulliganTimeout || mulliganChoiceInFlight || !state || state.phase !== 'mulligan' || setupPaused) return;
  finishingMulliganTimeout = true;
  return api('/api/mulligan-timeout', {}).finally(() => {
    finishingMulliganTimeout = false;
  });
}
function finishActionTimeout() {
  if (finishingActionTimeout || !state || !actionDeadline || setupPaused) return;
  finishingActionTimeout = true;
  return api('/api/action-timeout', {}).finally(() => {
    finishingActionTimeout = false;
  });
}
function restart() {
  const selectedModeValue = document.getElementById('mode')?.value;
  const selectedMode = selectedModeValue === 'infection'
    ? 'infection'
    : selectedModeValue === 'standard'
      ? 'standard'
      : 'test';
  config.mode = selectedMode;
  const seatIds = activeSeatIds(selectedMode);
  const selectedControls = seatIds.map(id => document.getElementById('m' + id).value);
  if (!selectedControls.includes('human')) {
    error = '至少需要保留一个真人座位';
    render();
    return Promise.resolve();
  }
  return api('/api/restart', {
    mode: selectedMode,
    playerCount: modeSeatCount(selectedMode),
    characters: selectedMode === 'test'
      ? seatIds.map(id => document.getElementById('c' + id).value)
      : undefined,
    controls: selectedControls
  });
}
function restartDemo(nextMode = currentMode()) {
  const normalizedMode = nextMode === 'infection' ? 'infection' : nextMode === 'standard' ? 'standard' : 'test';
  const defaults = clientGameModes[normalizedMode];
  const nextPlayerCount = defaults.playerCounts[0];
  return api('/api/restart', {
    mode: normalizedMode,
    playerCount: nextPlayerCount,
    characters: normalizedMode === 'test' ? defaults.characters.slice(0, nextPlayerCount) : undefined,
    controls: defaults.controls.slice(0, nextPlayerCount)
  });
}
function showSettlementStats() {
  settlementStatsExpanded = true;
  render();
}
function exitToCleanStart() {
  return window.TabletopV10.requestNavigation('exit');
}
function toggleEntrust() {
  return api('/api/toggle-entrust', {});
}
function syncSetupReveal() {
  const fateId = state?.openingFate?.card?.id || 'no-fate';
  const nextKey = setupPaused && state ? state.seed + ':' + state.startingPlayerId + ':' + fateId : '';
  if (!nextKey) {
    if (setupRevealTimer) clearTimeout(setupRevealTimer);
    setupRevealTimer = null;
    setupRevealKey = '';
    setupRevealReady = false;
    return;
  }
  if (nextKey === setupRevealKey) return;
  if (setupRevealTimer) clearTimeout(setupRevealTimer);
  setupRevealKey = nextKey;
  setupRevealReady = false;
  setupRevealTimer = setTimeout(() => {
    if (!setupPaused || setupRevealKey !== nextKey) return;
    setupRevealReady = true;
    const button = document.getElementById('confirmSetupButton');
    if (button) {
      button.disabled = false;
      const firstPlayer = state.players.find(player => player.id === state.startingPlayerId);
      button.textContent = setupFateDrawn
        ? '确认结果，开始换牌'
        : '由' + (firstPlayer ? characterVisual(firstPlayer).name : '先手玩家') + '抽命运牌';
    }
  }, 3000);
}
function confirmSetup() {
  if (!setupRevealReady || !setupFateDrawn) return;
  return api('/api/start', {});
}
function drawOpeningFate() {
  if (!setupRevealReady || setupFateDrawn) return;
  return api('/api/draw-opening-fate', {});
}
function advanceAi() { return api('/api/ai', {}); }
function autoDiscard() { return api('/api/auto-discard', {}); }

function normalizeTransientSelections() {
  if (selectedCard) {
    const player = state?.players.find(candidate => candidate.id === selectedCard.playerId);
    const cardExists = player?.hand.some(candidate => candidate.id === selectedCard.cardId);
    if (!player || !cardExists || state.phase !== 'main' || state.activePlayerId !== selectedCard.playerId) clearSelectedCard();
  }
  if (distanceCostDraft) {
    const player = state?.players.find(candidate => candidate.id === distanceCostDraft.playerId);
    const target = state?.players.find(candidate => candidate.id === distanceCostDraft.targetId);
    const cardExists = distanceCostDraft.type === 'playCard'
      ? player?.hand.some(candidate => candidate.id === distanceCostDraft.cardId)
      : true;
    const costCardsStillExist = (distanceCostDraft.cardIds || []).every(cardId => player?.hand.some(card => card.id === cardId));
    if (!player || !target || !cardExists || !costCardsStillExist || state.phase !== 'main' || state.activePlayerId !== distanceCostDraft.playerId) {
      distanceCostDraft = null;
    }
  }
  if (leoOrderPaymentDraft) {
    const player = state?.players.find(candidate => candidate.id === leoOrderPaymentDraft.playerId);
    const target = state?.players.find(candidate => candidate.id === leoOrderPaymentDraft.targetId);
    const card = player?.hand.find(candidate => candidate.id === leoOrderPaymentDraft.cardId);
    const receiver = state?.players.find(candidate => candidate.id === leoOrderPaymentDraft.receiverId);
    const candidates = player ? leoOrderPaymentCandidates(player, leoOrderPaymentDraft.reservedCardIds || []) : [];
    if (!player || !target || !card || !receiver || candidates.length === 0 || state.phase !== 'main' || state.activePlayerId !== leoOrderPaymentDraft.playerId) {
      leoOrderPaymentDraft = null;
    }
  }
  if (waterStealDraft) {
    const player = state?.players.find(candidate => candidate.id === waterStealDraft.playerId);
    const target = state?.players.find(candidate => candidate.id === waterStealDraft.targetId);
    const card = player?.hand.find(candidate => candidate.id === waterStealDraft.cardId);
    if (!player || !target || !card || state.phase !== 'main' || state.activePlayerId !== waterStealDraft.playerId || !needsWaterStealChoice(card, target)) {
      waterStealDraft = null;
    }
  }
  if (airDismantleDraft) {
    const player = state?.players.find(candidate => candidate.id === airDismantleDraft.playerId);
    const target = state?.players.find(candidate => candidate.id === airDismantleDraft.targetId);
    const card = player?.hand.find(candidate => candidate.id === airDismantleDraft.cardId);
    if (!player || !target || !card || state.phase !== 'main' || state.activePlayerId !== airDismantleDraft.playerId || !needsAirDismantleChoice(card, target)) {
      airDismantleDraft = null;
    }
  }
  Object.keys(discardDrafts).forEach(playerId => {
    const player = state?.players.find(candidate => candidate.id === playerId);
    if (!player || state.phase !== 'discard' || state.activePlayerId !== playerId) {
      delete discardDrafts[playerId];
      return;
    }
    const required = Math.max(0, player.hand.length - Math.max(0, player.hp));
    discardDrafts[playerId] = (discardDrafts[playerId] || [])
      .filter(cardId => player.hand.some(card => card.id === cardId))
      .slice(0, required);
  });
}

function toggleDiscardCard(playerId, cardId) {
  const player = state?.players.find(candidate => candidate.id === playerId);
  if (!player || state.phase !== 'discard' || state.activePlayerId !== playerId) return;
  const required = Math.max(0, player.hand.length - Math.max(0, player.hp));
  const current = discardDrafts[playerId] || [];
  if (current.includes(cardId)) {
    discardDrafts[playerId] = current.filter(id => id !== cardId);
  } else if (current.length < required) {
    discardDrafts[playerId] = [...current, cardId];
  }
  render();
}

function clearDiscardSelection(playerId) {
  discardDrafts[playerId] = [];
  render();
}

function confirmDiscard(playerId) {
  const player = state?.players.find(candidate => candidate.id === playerId);
  if (!player || state.phase !== 'discard' || state.activePlayerId !== playerId) return;
  const required = Math.max(0, player.hand.length - Math.max(0, player.hp));
  const cardIds = (discardDrafts[playerId] || []).filter(cardId => player.hand.some(card => card.id === cardId));
  if (cardIds.length !== required) return;
  discardDrafts[playerId] = [];
  return action({ type: 'discard', playerId, cardIds });
}

function currentActionOwner() {
  if (!state || setupPaused) return null;
  if (state.phase === 'rescue') return state.players.find(player => player.id === (state.pendingRescue || state.infection?.pendingDying)?.currentResponderId) || null;
  const skillDecision = state.pendingSkillDecisions?.[0];
  if (skillDecision) return state.players.find(player => player.id === skillDecision.playerId) || null;
  if (state.phase === 'gameOver' && !state.winnerTeamId) {
    return aiRescueReviewPlayer() || rescueReviewPlayer();
  }
  if (state.phase === 'response' && state.pendingAttack) {
    return state.players.find(player => player.id === state.pendingAttack.currentTargetId) || null;
  }
  if (state.phase === 'hammerBreak' && state.pendingAttack) {
    return state.players.find(player => player.id === state.pendingAttack.currentTargetId) || null;
  }
  return state.players.find(player => player.id === state.activePlayerId) || null;
}

function shouldAutoAdvanceAi() {
  if (!state || lobbyOpen || setupPaused || state.winnerTeamId || state.phase === 'mulligan') return false;
  const owner = currentActionOwner();
  return owner?.control === 'ai';
}

function aiAdvanceDelayKeyForState() {
  const owner = currentActionOwner();
  if (!state || !owner) return '';
  const pending = state.pendingAttack
    ? [state.pendingAttack.sourceId, state.pendingAttack.currentTargetId, state.pendingAttack.card.id, state.pendingAttack.hitsRemaining, state.pendingAttack.defensesRemaining, state.pendingAttack.remainingTargetIds.join(',')].join(':')
    : '';
  return [state.phase, owner.id, state.activePlayerId, state.round, state.metrics.turns, state.log.length, pending].join('|');
}

function aiAdvanceDelayForState() {
  const owner = currentActionOwner();
  // Entering an AI draw phase should feel continuous. The normal three-second
  // presentation pause still applies after the cards are drawn and before play.
  if (state?.phase === 'draw' && owner?.control === 'ai') return 0;
  return AI_ACTION_DELAY_MS;
}

function maybeAutoAdvanceAi() {
  if (advancingAi) return;
  if (!shouldAutoAdvanceAi()) {
    aiAdvanceDelayKey = '';
    aiAdvanceNotBefore = 0;
    return;
  }
  if (Date.now() < aiAdvanceNotBefore) return;
  advancingAi = true;
  advanceAi().finally(() => {
    aiAdvanceDelayKey = aiAdvanceDelayKeyForState();
    aiAdvanceNotBefore = Date.now() + aiAdvanceDelayForState();
    advancingAi = false;
  });
}

function drawPhase() { return action({ type: 'drawPhase' }); }
function mulligan(replace, playerId = focusedMulliganPlayerId()) {
  if (!playerId || mulliganChoiceInFlight) return;
  lastMulliganFocusId = playerId;
  mulliganChoiceInFlight = true;
  return action({ type: 'mulligan', playerId, replace }).finally(() => {
    mulliganChoiceInFlight = false;
  });
}
function endMain() { return action({ type: 'endMain', playerId: state.activePlayerId }); }
function skipDefense(playerId) { return action({ type: 'skipDefense', playerId }); }
function defend(playerId, cardId) { return action({ type: 'defend', playerId, cardId }); }
function respondInfection(playerId, cardId = '') {
  return action({ type: 'respondInfection', playerId, ...(cardId ? { cardId } : {}) });
}
function skipInfectionRescue(playerId) { return action({ type: 'skipRescue', playerId }); }
function rescueWithCrabGuard(playerId, cardId) {
  const pending = state.pendingRescue || state.infection?.pendingDying;
  if (!pending || pending.currentResponderId !== playerId) return;
  return action({type:'useSkill',playerId,skillId:'cancer.rescue',targetId:pending.targetId,cardIds:[cardId]});
}
function chooseInfectionReward(playerId, option) {
  const player = state.players.find(candidate => candidate.id === playerId);
  const statusId = option === 'cleanse' && player?.infected ? 'infection' : undefined;
  return action({ type: 'chooseInfectionReward', playerId, option, ...(statusId ? { statusId } : {}) });
}
function chooseInfectionBossCommand(playerId, option) {
  delete selectedSkills[playerId];
  return action({ type: 'useSkill', playerId, skillId: 'infection.bossCommand', option });
}
function earthHammerBreak(playerId, cardId) { return action({ type: 'earthHammerBreak', playerId, cardId }); }
function skipEarthHammerBreak(playerId) { return action({ type: 'earthHammerBreak', playerId }); }
function play(playerId, card, targetId, extraCostCardId = '', selectedCardId = '', leoOrderPaymentCardId = '', targetIds = []) {
  const player = state.players.find(candidate => candidate.id === playerId);
  if (!player || !card) return;
  if (!leoOrderPaymentCardId && beginLeoOrderPaymentDraft(player, card, targetId, extraCostCardId, selectedCardId, targetIds)) return;
  const body = { type: 'playCard', playerId, cardId: card.id, targetId };
  if (targetIds.length > 0) body.targetIds = targetIds;
  if (extraCostCardId) body.extraCostCardId = extraCostCardId;
  if (leoOrderPaymentCardId) body.leoOrderPaymentCardId = leoOrderPaymentCardId;
  if (selectedCardId) body.selectedCardId = selectedCardId;
  if (card.kind === 'sun' || card.kind === 'energy') {
    const target = state.players.find(player => player.id === targetId);
    if (shouldPlayCardAsRescue(player, card, target)) body.mode = 'rescue';
    else if (card.kind === 'sun') body.mode = 'active';
  }
  if (card.kind === 'moon') body.mode = canAmplifyPendingAttackWithMoon(player, card) ? 'amplify' : 'curse';
  return action(body);
}

function cancelLeoOrderPayment() {
  leoOrderPaymentDraft = null;
  render();
}

function cancelDistanceCost() {
  distanceCostDraft = null;
  render();
}

function cancelWaterStealChoice() {
  waterStealDraft = null;
  render();
}

function chooseWaterStealTarget(playerId, selectedCardId) {
  const draft = waterStealDraft;
  const player = state?.players.find(candidate => candidate.id === playerId);
  const target = state?.players.find(candidate => candidate.id === draft?.targetId);
  const card = player?.hand.find(candidate => candidate.id === draft?.cardId);
  if (!draft || !player || !target || !card || draft.playerId !== playerId) return;
  const candidates = waterStealTargets(target).map(item => item.id);
  if (!candidates.includes(selectedCardId)) return;
  if (!canWaterStealTarget(player, target)) {
    waterStealDraft = null;
    error = '潮汐窃取只能对距离 1 的目标使用。';
    render();
    return;
  }
  waterStealDraft = null;
  return play(player.id, card, target.id, '', selectedCardId);
}

function cancelAirDismantleChoice() {
  airDismantleDraft = null;
  render();
}

function chooseAirDismantleTarget(playerId, selectedCardId) {
  const draft = airDismantleDraft;
  const player = state?.players.find(candidate => candidate.id === playerId);
  const target = state?.players.find(candidate => candidate.id === draft?.targetId);
  const card = player?.hand.find(candidate => candidate.id === draft?.cardId);
  if (!draft || !player || !target || !card || draft.playerId !== playerId) return;
  const candidates = airDismantleTargets(target).map(item => item.id);
  if (!candidates.includes(selectedCardId)) return;
  airDismantleDraft = null;
  return play(player.id, card, target.id, '', selectedCardId);
}

function payLeoOrderPaymentCard(playerId, cardId) {
  const draft = leoOrderPaymentDraft;
  const player = state?.players.find(candidate => candidate.id === playerId);
  const card = player?.hand.find(candidate => candidate.id === draft?.cardId);
  if (!draft || !player || !card || draft.playerId !== playerId) return;
  const candidates = leoOrderPaymentCandidates(player, draft.reservedCardIds || []).map(candidate => candidate.id);
  if (!candidates.includes(cardId)) return;
  leoOrderPaymentDraft = null;
  return play(player.id, card, draft.targetId, draft.extraCostCardId || '', draft.selectedCardId || '', cardId, draft.targetIds || []);
}

function payDistanceCostCard(playerId, extraCostCardId) {
  const draft = distanceCostDraft;
  const player = state?.players.find(candidate => candidate.id === playerId);
  if (!draft || !player || draft.playerId !== playerId) return;
  const reserved = distanceCostCandidates(player, draft).map(card => card.id);
  if (!reserved.includes(extraCostCardId)) return;
  distanceCostDraft = null;
  if (draft.type === 'playCard') {
    const card = player.hand.find(candidate => candidate.id === draft.cardId);
    if (!card) return render();
    return play(player.id, card, draft.targetId, extraCostCardId, draft.selectedCardId || '');
  }
  if (draft.type === 'useSkill') {
    const body = {
      type: 'useSkill',
      playerId,
      skillId: draft.skillId,
      targetId: draft.targetId,
      cardIds: draft.cardIds,
      selectedCardId: draft.selectedCardId,
      extraCostCardId
    };
    delete selectedSkills[playerId];
    delete ariesRamDrafts[playerId];
    delete stealDrafts[playerId];
    return action(body);
  }
  render();
}

function scheduleSkillInfoAutoHide(playerId, id) {
  if (skillInfoAutoHideTimer) clearTimeout(skillInfoAutoHideTimer);
  skillInfoAutoHideTimer = null;
  if (!infoOnlySkills.has(id)) return;
  skillInfoAutoHideTimer = setTimeout(() => {
    if (selectedSkills[playerId] === id) {
      delete selectedSkills[playerId];
      skillInfoAutoHideTimer = null;
      render();
    }
  }, 2800);
}

function shouldConfirmBurnSoulRam(player, id) {
  if (!player) return false;
  return id === 'aries.ram' &&
    selectedSkills[player.id] === 'aries.burnSoul' &&
    Boolean(activeSkillCostDraft(player)?.ready);
}

function shouldKeepBurnSoulCostSelection(player, id) {
  if (!player) return false;
  return id === 'aries.ram' &&
    selectedSkills[player.id] === 'aries.burnSoul' &&
    !activeSkillCostDraft(player)?.ready;
}

function shouldConfirmLeoRoar(player, id) {
  return Boolean(
    player &&
    id === 'leo.roar' &&
    selectedSkills[player.id] === 'leo.roar' &&
    activeSkillCostDraft(player)?.ready
  );
}

function shouldKeepLeoRoarSelection(player, id) {
  return Boolean(player && id === 'leo.roar' && selectedSkills[player.id] === 'leo.roar');
}

function skill(player, id, event) {
  if (!player) return;
  if (id === 'pisces.observeTide' && selectedSkills[player.id] === id && activeSkillCostDraft(player)) {
    render();
    return;
  }
  if (shouldConfirmBurnSoulRam(player, id)) return confirmActiveSkillCost(player.id);
  if (shouldKeepBurnSoulCostSelection(player, id)) {
    render();
    return;
  }
  if (shouldConfirmLeoRoar(player, id)) return confirmActiveSkillCost(player.id);
  if (shouldKeepLeoRoarSelection(player, id)) {
    render();
    return;
  }
  if (id === 'weapon.waterCodex' && selectedSkills[player.id] === id) {
    render();
    return;
  }
  selectedSkills[player.id] = id;
  scheduleSkillInfoAutoHide(player.id, id);
  const canUseMainSkill = state.activePlayerId === player.id && state.phase === 'main';
  const clickedSkillDisabled = !infoOnlySkills.has(id) && isSkillDisabled(player, id, canUseMainSkill);
  if (infoOnlySkills.has(id) || clickedSkillDisabled) {
    showSeatSkillTip(player.id, id, event, 'right');
    return;
  }
  if (selectedCard) clearSelectedCard();
  const opponent = selectedEnemyOf(player);
  const ally = selectedAllyOf(player);
  const first = player.hand[0];
  const earth = player.hand.find(c => c.element === 'earth');
  const water = player.hand.filter(c => c.element === 'water');
  if (id === 'pisces.observeTide') {
    piscesObserveTideDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'weapon.waterCodex') {
    if (skillInfoAutoHideTimer) clearTimeout(skillInfoAutoHideTimer);
    skillInfoAutoHideTimer = null;
    waterCodexDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'weapon.airCompass') {
    render();
    return;
  }
  if (id === 'aries.ram' || id === 'aries.burnSoul') {
    selectedSkills[player.id] = id;
    ariesRamDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'infection.bossCommand') {
    render();
    return;
  }
  if (id === 'gemini.steal') {
    const stealTargets = stealTargetsOf(opponent);
    stealDrafts[player.id] = {
      costCardIds: defaultGeminiStealCostIds(player),
      targetCardId: stealTargets[0]?.card.id || ''
    };
    render();
    return;
  }
  if (id === 'aquarius.massHeal') {
    aquariusMassHealDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'libra.harmony') {
    libraHarmonyDrafts[player.id] = { targetIds: [], costCardIds: [], selectedCardIds: [] };
    render();
    return;
  }
  if (id === 'pisces.balance') {
    piscesBalanceDrafts[player.id] = { targetIds: [], costCardIds: [] };
    render();
    return;
  }
  if (id === 'sagittarius.seekEquipment') {
    sagittariusSeekDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'virgo.purify') {
    virgoPurifyDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'scorpio.peek') {
    const count = state.players.length >= 5 ? 5 : state.players.length === 4 ? 4 : 3;
    peekDrafts[player.id] = {
      topCardIds: state.deck.slice(0, count).map(card => card.id),
      bottomCardIds: []
    };
    render();
    return;
  }
  if (id === 'scorpio.spoils') {
    spoilsDrafts[player.id] = {
      costCardId: player.hand[0]?.id || '',
      targetId: enemiesOf(player).find(enemy => enemy.statuses?.frozen)?.id || opponent?.id || ''
    };
    render();
    return;
  }
  if (id === 'scorpio.freezeAoe') {
    render();
    return;
  }
  if (id === 'taurus.guard') {
    const guardTarget = alliesOf(player).find(candidate => candidate.id !== player.id);
    if (guardTarget) return action({ type: 'useSkill', playerId: player.id, skillId: id, targetId: guardTarget.id });
    render();
    return;
  }
  if (id === 'taurus.armor') {
    taurusArmorDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'leo.order') {
    leoOrderDrafts[player.id] = { costCardIds: [] };
    render();
    return;
  }
  if (id === 'leo.roar') {
    clearSelectedCard();
    leoRoarDrafts[player.id] = { costCardIds: [], targetIds: [] };
    render();
    return;
  }
  if (id === 'cancer.heal' && first && ally) return action({ type: 'useSkill', playerId: player.id, skillId: id, targetId: ally.id, cardIds: [first.id] });
  if (id === 'capricorn.charge' && earth && opponent) {
    if (needsSkillDistanceCost(player, id, opponent)) {
      const nextDraft = { type: 'useSkill', playerId: player.id, skillId: id, targetId: opponent.id, cardIds: [earth.id] };
      const candidates = distanceCostCandidates(player, nextDraft);
      if (candidates.length === 0) {
        error = '跨距离需要额外弃 1 张手牌，但当前没有可支付的手牌。';
        render();
        return;
      }
      distanceCostDraft = nextDraft;
      delete selectedSkills[player.id];
      render();
      return;
    }
    return action({ type: 'useSkill', playerId: player.id, skillId: id, targetId: opponent.id, cardIds: [earth.id] });
  }
  render();
}

function setStealDraft(playerId, field, value) {
  stealDrafts[playerId] = { ...(stealDrafts[playerId] || {}), [field]: value };
  render();
}

function setAriesRamDraft(playerId, value) {
  ariesRamDrafts[playerId] = { ...(ariesRamDrafts[playerId] || {}), costCardId: value };
  render();
}

function setTaurusArmorDraft(playerId, field, value) {
  taurusArmorDrafts[playerId] = { ...(taurusArmorDrafts[playerId] || {}), [field]: value };
  render();
}

function confirmAriesRam(playerId) {
  const draft = ariesRamDrafts[playerId] || {};
  const player = state.players.find(p => p.id === playerId);
  const opponent = selectedEnemyOf(player);
  if (!draft.costCardId || !opponent) return;
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'aries.ram',
    targetId: opponent.id,
    cardIds: [draft.costCardId]
  });
}

function confirmTaurusArmor(playerId) {
  const draft = taurusArmorDrafts[playerId] || {};
  if (!draft.costCardId) return;
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'taurus.armor',
    targetId: playerId,
    cardIds: [draft.costCardId]
  });
}

function toggleStealCost(playerId, cardId) {
  const draft = stealDrafts[playerId] || {};
  const selected = draft.costCardIds || [];
  const costCardIds = selected.includes(cardId)
    ? selected.filter(id => id !== cardId)
    : selected.length < 2
      ? [...selected, cardId]
      : [selected[1], cardId];
  stealDrafts[playerId] = { ...draft, costCardIds };
  render();
}

function confirmSteal(playerId) {
  const player = state.players.find(p => p.id === playerId);
  const opponent = selectedEnemyOf(player);
  if (!player || !opponent) return;
  const stealTargets = opponent ? stealTargetsOf(opponent) : [];
  const draft = stealDrafts[playerId] || {};
  const costCardIds = draft.costCardIds || [];
  const validCost = (costCardIds.length === 1 || costCardIds.length === 2)
    && new Set(costCardIds).size === costCardIds.length
    && costCardIds.every(id => player.hand.some(card => card.id === id));
  if (!validCost || (stealTargets.length > 0 && !draft.targetCardId)) return;
  delete selectedSkills[playerId];
  delete stealDrafts[playerId];
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'gemini.steal',
    targetId: opponent.id,
    cardIds: costCardIds,
    selectedCardId: draft.targetCardId
  });
}

function aquariusChaliceEntries(player) {
  if (!player) return [];
  return player.hand.map(card => ({ card, source: '手牌' }));
}

function aquariusChaliceDraft(playerId) {
  const decision = state.pendingSkillDecisions?.[0];
  const decisionKey = clientMatchId + ':' + skillDecisionKey(decision) + ':' + (state.metrics.skillTriggers['aquarius.stormEye'] || 0);
  if (aquariusChaliceDrafts[playerId]?.decisionKey !== decisionKey) {
    aquariusChaliceDrafts[playerId] = { decisionKey, targets: [] };
  }
  return aquariusChaliceDrafts[playerId];
}

function toggleAquariusChaliceTarget(playerId, targetId) {
  const draft = aquariusChaliceDraft(playerId);
  const targets = draft.targets || [];
  const exists = targets.some(t => t.id === targetId);
  let nextTargets;
  if (exists) {
    nextTargets = targets.filter(t => t.id !== targetId);
  } else {
    if (targets.length >= 2) return; // 上限 2 名
    nextTargets = [...targets, { id: targetId, giveCardIds: [], takeCardIds: [] }];
  }
  aquariusChaliceDrafts[playerId] = { ...draft, targets: nextTargets };
  render();
}

function toggleAquariusChaliceGive(playerId, targetId, cardId) {
  const draft = aquariusChaliceDraft(playerId);
  const targets = (draft.targets || []).map(t => ({ ...t }));
  const entry = targets.find(t => t.id === targetId);
  if (!entry) return;
  if (targets.some(t => t.id !== targetId && (t.giveCardIds || []).includes(cardId))) return;
  const selected = entry.giveCardIds || [];
  const totalOther = targets.reduce((sum, t) => sum + (t.id === targetId ? 0 : (t.giveCardIds || []).length), 0);
  const giveCardIds = selected.includes(cardId)
    ? selected.filter(id => id !== cardId)
    : (selected.length + totalOther < 2 ? [...selected, cardId] : selected);
  const takeCardIds = (entry.takeCardIds || []).slice(0, giveCardIds.length);
  const updated = targets.map(t => t.id === targetId ? { ...t, giveCardIds, takeCardIds } : t);
  aquariusChaliceDrafts[playerId] = { ...draft, targets: updated };
  render();
}

function toggleAquariusChaliceTake(playerId, targetId, cardId) {
  const draft = aquariusChaliceDraft(playerId);
  const targets = (draft.targets || []).map(t => ({ ...t }));
  const entry = targets.find(t => t.id === targetId);
  if (!entry) return;
  const giveLimit = Math.min((entry.giveCardIds || []).length, 2);
  const selected = entry.takeCardIds || [];
  const takeCardIds = selected.includes(cardId)
    ? selected.filter(id => id !== cardId)
    : (selected.length < giveLimit ? [...selected, cardId] : selected);
  const updated = targets.map(t => t.id === targetId ? { ...t, takeCardIds } : t);
  aquariusChaliceDrafts[playerId] = { ...draft, targets: updated };
  render();
}

function confirmAquariusChalice(playerId) {
  const player = state.players.find(candidate => candidate.id === playerId);
  const draft = aquariusChaliceDraft(playerId);
  const targets = draft.targets || [];
  if (!player || state.pendingSkillDecisions?.[0]?.kind !== 'aquariusChalice' || state.pendingSkillDecisions[0].playerId !== playerId) return;
  const totalGive = targets.reduce((sum, t) => sum + (t.giveCardIds || []).length, 0);
  const totalTake = targets.reduce((sum, t) => sum + (t.takeCardIds || []).length, 0);
  if (totalGive !== totalTake || totalGive > 2) return;
  const targetIds = [];
  const cardIds = [];
  const selectedCardIds = [];
  for (const t of targets) {
    const g = t.giveCardIds || [];
    const tk = t.takeCardIds || [];
    if (g.length !== tk.length) return;
    for (let i = 0; i < g.length; i += 1) {
      targetIds.push(t.id);
      cardIds.push(g[i]);
      selectedCardIds.push(tk[i]);
    }
  }
  if (new Set(cardIds).size !== cardIds.length) return;
  delete aquariusChaliceDrafts[playerId];
  // 倾杯已改为被动（受伤触发摸 2 牌）；此处只处理可选的换牌，通过技能决策提交。
  return action({
    type: 'resolveSkillDecision',
    playerId,
    activate: true,
    targetIds,
    cardIds,
    selectedCardIds
  });
}

function movePeekCard(playerId, cardId, destination) {
  const draft = peekDrafts[playerId] || { topCardIds: [], bottomCardIds: [] };
  const topCardIds = draft.topCardIds.filter(id => id !== cardId);
  const bottomCardIds = draft.bottomCardIds.filter(id => id !== cardId);
  if (destination === 'top') topCardIds.push(cardId);
  else bottomCardIds.push(cardId);
  peekDrafts[playerId] = { topCardIds, bottomCardIds };
  render();
}

function reorderPeekCard(playerId, cardId, group, direction) {
  const draft = peekDrafts[playerId] || { topCardIds: [], bottomCardIds: [] };
  const list = [...draft[group + 'CardIds']];
  const index = list.indexOf(cardId);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= list.length) return;
  [list[index], list[nextIndex]] = [list[nextIndex], list[index]];
  peekDrafts[playerId] = { ...draft, [group + 'CardIds']: list };
  render();
}

function confirmScorpioPeek(playerId) {
  const draft = peekDrafts[playerId] || { topCardIds: [], bottomCardIds: [] };
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'scorpio.peek',
    topCardIds: draft.topCardIds,
    bottomCardIds: draft.bottomCardIds
  });
}

function setSpoilsDraft(playerId, field, value) {
  spoilsDrafts[playerId] = { ...(spoilsDrafts[playerId] || {}), [field]: value };
  render();
}

function confirmScorpioSpoils(playerId) {
  const draft = spoilsDrafts[playerId] || {};
  const player = state.players.find(p => p.id === playerId);
  const freeTarget = player?.flags?.scorpioFreeStingTargetIds?.includes(draft.targetId);
  if (!draft.targetId || (!freeTarget && !draft.costCardId)) return;
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'scorpio.spoils',
    targetId: draft.targetId,
    cardIds: freeTarget && !draft.costCardId ? [] : [draft.costCardId]
  });
}

function isSkillDisabled(player, id, canAct) {
  if (state.pendingSkillDecisions?.length && !infoOnlySkills.has(id)) return true;
  const canUseTurnStartSkill = state.activePlayerId === player.id && state.phase === 'draw';
  const silencedInOwnActionTurn = Boolean(player.statuses?.silence && state.activePlayerId === player.id);
  const ramCosts = player.hand.filter(card => card.kind === 'normalAttack' || card.kind === 'statusAttack');
  const freeStingTargets = player.flags?.scorpioFreeStingTargetIds || [];
  let disabled = false;
  if (infoOnlySkills.has(id)) disabled = false;
  else if (id === 'scorpio.peek') disabled = silencedInOwnActionTurn || !canUseTurnStartSkill || player.flags.usedScorpioPeek;
  else if (id === 'taurus.guard') disabled = silencedInOwnActionTurn || !canUseTurnStartSkill;
  else if (id === 'weapon.waterCodex') disabled = !canActivateEquipmentSkill(player, id);
  else if (id === 'weapon.airCompass') disabled = !canActivateEquipmentSkill(player, id);
  else if (id === 'infection.bossCommand') disabled = !isInitialInfectionBoss(player) || player.flags.usedInfectionBossCommand || silencedInOwnActionTurn || !canAct;
  else if (silencedInOwnActionTurn || !canAct) disabled = true;
  else if (id === 'aries.ram') disabled = player.flags.usedAriesRam || !ramCosts.some(card => card.element === 'fire');
  else if (id === 'aries.burnSoul') disabled = player.flags.usedAriesRam || player.flags.usedAriesBurnSoul || !ramCosts.some(card => card.element !== 'fire');
  else if (id === 'aquarius.massHeal') {
    const air = player.hand.find(card => card.element === 'air');
    const other = player.hand.find(card => card.id !== air?.id);
    disabled = player.flags.usedAquariusMassHeal || !air || !other;
  }
  else if (id === 'gemini.steal') disabled = player.flags.usedGeminiSteal;
  else if (id === 'pisces.observeTide') disabled = player.flags.usedPiscesObserveTide || player.hand.length === 0;
  else if (id === 'scorpio.spoils') disabled = player.flags.usedScorpioSting || (freeStingTargets.length === 0 && player.hand.length === 0) || !enemiesOf(player).some(enemy => enemy.statuses?.frozen);
  else if (id === 'leo.roar') disabled = player.flags.usedLeoRoar || !player.hand.some(card => card.element === 'fire');
  else if (id === 'leo.order') disabled = player.flags.usedLeoOrder || player.hand.length === 0;
  else if (id === 'sagittarius.seekEquipment') {
    disabled = player.flags.usedSagittariusSeek || player.hand.length < 2 || !player.hand.some(card => card.element === 'fire');
  }
  else if (id === 'virgo.purify') {
    disabled = player.flags.usedVirgoPurify || !player.hand.some(card => card.element === 'earth');
  }
  return disabled;
}

function isSkillUsable(player, id, canAct) {
  return !infoOnlySkills.has(id) && !isSkillDisabled(player, id, canAct);
}

function skillButtons(player, canAct) {
  const map = {
    aries: [['aries.bloodRage', '血怒'], ['aries.ram', '羊角冲'], ['aries.burnSoul', '燃魂']],
    leo: [['leo.aura', '狮威'], ['leo.roar', '狮吼'], ['leo.order', '王令']],
    gemini: [['gemini.windForm', '双生'], ['gemini.steal', '换影'], ['gemini.extraTurn', '连星']],
    libra: [['libra.elementSense', '衡感'], ['libra.judgment', '审判'], ['libra.harmony', '裁衡']],
    aquarius: [['aquarius.stormEye', '倾杯'], ['aquarius.massHeal', '神酿'], ['aquarius.windCut', '断流']],
    cancer: [['cancer.tideBond', '共潮'], ['cancer.heal', '疗潮'], ['cancer.rescue', '蟹护']],
    scorpio: [['scorpio.freezeAoe', '蝎毒'], ['scorpio.spoils', '毒刺'], ['scorpio.peek', '伏击']],
    pisces: [['pisces.observeTide', '观潮'], ['pisces.balance', '平潮'], ['pisces.dream', '回梦']],
    taurus: [['taurus.guard', '牛守'], ['taurus.thickSkin', '厚皮'], ['taurus.armor', '筑甲']],
    capricorn: [['capricorn.unyielding', '蓄怒'], ['capricorn.wushuang', '重压'], ['capricorn.charge', '山崩']],
    sagittarius: [['sagittarius.bowcraft', '整弓'], ['sagittarius.seekEquipment', '寻器'], ['sagittarius.sharpshot', '神射']],
    virgo: [['virgo.purify', '净化'], ['virgo.domain', '净域'], ['virgo.discipline', '戒律']]
  };
  const bossSkills = isInitialInfectionBoss(player)
    ? [['infection.bossDrain', '月蚀汲取'], ['infection.bossCommand', '蚀月战令'], ['infection.bossNoDistance', '月蚀领域']]
    : [];
  return [...(map[player.characterId] || []), ...bossSkills].map(([id, text]) => {
    const disabled = !infoOnlySkills.has(id) && isSkillDisabled(player, id, canAct);
    const selectedClass = selectedSkills[player.id] === id ? 'selected' : '';
    const usableClass = isSkillUsable(player, id, canAct) ? 'usableSkill' : '';
    const disabledClass = disabled ? 'disabledSkill' : '';
    const classes = [selectedClass, usableClass, disabledClass].filter(Boolean).join(' ');
    return '<button class="' + classes + '" aria-disabled="' + (disabled ? 'true' : 'false') + '" onclick="skill(state.players.find(p=>p.id===\'' + player.id + '\'), \'' + id + '\', event)">' + text + '</button>';
  }).join('');
}

function equipmentTraitButtons(player) {
  const buttons = [];
  const weapon = player?.equipment?.weapon;
  const armor = player?.equipment?.armor;
  if (weapon) {
    const actionId = weapon.element === 'water'
      ? 'weapon.waterCodex'
      : weapon.element === 'air'
        ? 'weapon.airCompass'
        : '';
    const label = actionId === 'weapon.waterCodex'
      ? '潮汐合成'
      : actionId === 'weapon.airCompass'
        ? '罗盘检索'
        : weapon.name;
    const usable = actionId && canActivateEquipmentSkill(player, actionId);
    const handler = usable
      ? 'beginEquipmentAction(\'' + player.id + '\', \'' + actionId + '\')'
      : 'selectEquipmentInfo(\'' + player.id + '\', \'weapon\')';
    buttons.push('<button class="equipmentTraitButton ' + (usable ? 'usableSkill' : 'disabledSkill') + '" aria-disabled="' + (!usable) + '" onclick="event.stopPropagation(); ' + handler + '">' + safeText(label) + '</button>');
  }
  if (armor) {
    buttons.push('<button class="equipmentTraitButton disabledSkill" aria-disabled="true" onclick="event.stopPropagation(); selectEquipmentInfo(\'' + player.id + '\', \'armor\')">' + safeText(armor.name) + '</button>');
  }
  return buttons.join('');
}

function toggleLibraHarmonyTarget(playerId, targetId) {
  const draft = libraHarmonyDrafts[playerId] || { targetIds: [], costCardIds: [], selectedCardIds: [] };
  const selected = draft.targetIds || [];
  const targetIds = selected.includes(targetId)
    ? selected.filter(id => id !== targetId)
    : selected.length < 2
      ? [...selected, targetId]
      : [selected[1], targetId];
  libraHarmonyDrafts[playerId] = { targetIds, costCardIds: [], selectedCardIds: [] };
  render();
}

function libraHarmonyRequirement(playerId) {
  const draft = libraHarmonyDrafts[playerId] || {};
  const targets = (draft.targetIds || []).map(id => state.players.find(player => player.id === id)).filter(Boolean);
  if (targets.length !== 2) return { targets, required: 0, richer: null, poorer: null, valid: false };
  const firstIsRicher = targets[0].hand.length >= targets[1].hand.length;
  const richer = firstIsRicher ? targets[0] : targets[1];
  const poorer = firstIsRicher ? targets[1] : targets[0];
  const difference = richer.hand.length - poorer.hand.length;
  return { targets, required: Math.floor(difference / 2), richer, poorer, valid: difference >= 2 };
}

function toggleLibraHarmonyCard(playerId, field, cardId) {
  const draft = libraHarmonyDrafts[playerId] || { targetIds: [], costCardIds: [], selectedCardIds: [] };
  const required = libraHarmonyRequirement(playerId).required;
  const selected = draft[field] || [];
  const next = selected.includes(cardId)
    ? selected.filter(id => id !== cardId)
    : selected.length < required
      ? [...selected, cardId]
      : required > 0
        ? [...selected.slice(1), cardId]
        : [];
  libraHarmonyDrafts[playerId] = { ...draft, [field]: next };
  render();
}

function confirmLibraHarmony(playerId) {
  const player = state.players.find(candidate => candidate.id === playerId);
  const draft = libraHarmonyDrafts[playerId] || {};
  const requirement = libraHarmonyRequirement(playerId);
  const costCardIds = draft.costCardIds || [];
  const selectedCardIds = draft.selectedCardIds || [];
  const validCosts = requirement.valid && costCardIds.length === requirement.required && costCardIds.every(cardId => player?.hand.some(card => card.id === cardId && card.element === 'air'));
  const validTransfers = requirement.valid && selectedCardIds.length === requirement.required && selectedCardIds.every(cardId => stealTargetsOf(requirement.richer).some(entry => entry.card.id === cardId));
  if (!player || !validCosts || !validTransfers) return;
  delete libraHarmonyDrafts[playerId];
  delete selectedSkills[playerId];
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'libra.harmony',
    targetIds: draft.targetIds,
    cardIds: costCardIds,
    selectedCardIds
  });
}

function togglePiscesBalanceTarget(playerId, targetId) {
  const draft = piscesBalanceDrafts[playerId] || { targetIds: [], costCardIds: [] };
  const selected = draft.targetIds || [];
  const targetIds = selected.includes(targetId)
    ? selected.filter(id => id !== targetId)
    : selected.length < 2
      ? [...selected, targetId]
      : [selected[1], targetId];
  piscesBalanceDrafts[playerId] = { targetIds, costCardIds: [] };
  render();
}

function piscesBalanceRequirement(playerId) {
  const draft = piscesBalanceDrafts[playerId] || {};
  const targets = (draft.targetIds || []).map(id => state.players.find(player => player.id === id)).filter(Boolean);
  return { targets, required: targets.length === 2 ? Math.abs(targets[0].hp - targets[1].hp) : 0 };
}

function togglePiscesBalanceCost(playerId, cardId) {
  const draft = piscesBalanceDrafts[playerId] || { targetIds: [], costCardIds: [] };
  const required = piscesBalanceRequirement(playerId).required;
  const selected = draft.costCardIds || [];
  const costCardIds = selected.includes(cardId)
    ? selected.filter(id => id !== cardId)
    : selected.length < required
      ? [...selected, cardId]
      : required > 0
        ? [...selected.slice(1), cardId]
        : [];
  piscesBalanceDrafts[playerId] = { ...draft, costCardIds };
  render();
}

function confirmPiscesBalance(playerId) {
  const player = state.players.find(candidate => candidate.id === playerId);
  const draft = piscesBalanceDrafts[playerId] || {};
  const requirement = piscesBalanceRequirement(playerId);
  const costCardIds = draft.costCardIds || [];
  const valid = Boolean(player) && requirement.targets.length === 2 && costCardIds.length === requirement.required && costCardIds.every(cardId => player.hand.some(card => card.id === cardId && card.element === 'water'));
  if (!valid) return;
  delete piscesBalanceDrafts[playerId];
  delete selectedSkills[playerId];
  return action({
    type: 'useSkill',
    playerId,
    skillId: 'pisces.balance',
    targetIds: draft.targetIds,
    cardIds: costCardIds
  });
}

function skillInfo(player) {
  const id = selectedSkills[player.id];
  if (!id || !skillDescriptions[id]) return '';
  const item = skillDescriptions[id];
  const opponent = selectedEnemyOf(player);
  let chooser = '';
  let actions = '';
  if (id === 'libra.harmony' && state.activePlayerId === player.id && state.phase === 'main') {
    const draft = libraHarmonyDrafts[player.id] || { targetIds: [], costCardIds: [], selectedCardIds: [] };
    const candidates = state.players.filter(candidate => candidate.hp > 0 && candidate.id !== player.id);
    const targetOptions = candidates.map(candidate =>
      '<button class="choiceCard ' + ((draft.targetIds || []).includes(candidate.id) ? 'selected' : '') + '" onclick="toggleLibraHarmonyTarget(\'' + player.id + '\', \'' + candidate.id + '\')">' + safeText(characterVisual(candidate).name) + ' · 手牌 ' + candidate.hand.length + '</button>'
    ).join('');
    const requirement = libraHarmonyRequirement(player.id);
    const costOptions = player.hand.filter(card => card.element === 'air').map(card =>
      '<button class="choiceCard ' + ((draft.costCardIds || []).includes(card.id) ? 'selected' : '') + '" onclick="toggleLibraHarmonyCard(\'' + player.id + '\', \'costCardIds\', \'' + card.id + '\')">' + cardText(card) + '</button>'
    ).join('');
    const transferOptions = requirement.richer ? stealTargetsOf(requirement.richer).map(entry =>
      '<button class="choiceCard ' + ((draft.selectedCardIds || []).includes(entry.card.id) ? 'selected' : '') + '" onclick="toggleLibraHarmonyCard(\'' + player.id + '\', \'selectedCardIds\', \'' + entry.card.id + '\')">' + safeText(entry.source) + '：' + cardText(entry.card) + '</button>'
    ).join('') : '';
    const ready = requirement.valid && (draft.costCardIds || []).length === requirement.required && (draft.selectedCardIds || []).length === requirement.required;
    chooser = '<div class="skillChooser">' +
      '<div class="chooserLabel">选择两名其他角色</div><div class="choiceGrid">' + targetOptions + '</div>' +
      (requirement.targets.length === 2 && !requirement.valid ? '<div class="skillHint">两名角色手牌差不足 2，不能发动裁衡。</div>' : '') +
      (requirement.valid ? '<div class="chooserLabel">弃置 ' + requirement.required + ' 张风牌</div><div class="choiceGrid">' + (costOptions || '<div class="skillHint">没有足够风牌。</div>') + '</div>' +
        '<div class="chooserLabel">从手牌较多的 ' + safeText(characterVisual(requirement.richer).name) + ' 处选择转移的 ' + requirement.required + ' 张牌或装备</div><div class="choiceGrid">' + transferOptions + '</div>' : '') +
      '</div>';
    actions = '<button ' + (!ready ? 'disabled' : '') + ' onclick="confirmLibraHarmony(\'' + player.id + '\')">发动裁衡</button>';
  }
  if (id === 'pisces.balance' && state.activePlayerId === player.id && state.phase === 'main') {
    const draft = piscesBalanceDrafts[player.id] || { targetIds: [], costCardIds: [] };
    const candidates = state.players.filter(candidate => candidate.hp > 0);
    const targetOptions = candidates.map(candidate =>
      '<button class="choiceCard ' + ((draft.targetIds || []).includes(candidate.id) ? 'selected' : '') + '" onclick="togglePiscesBalanceTarget(\'' + player.id + '\', \'' + candidate.id + '\')">' + safeText(characterVisual(candidate).name) + ' · 生命 ' + candidate.hp + '/' + candidate.maxHp + '</button>'
    ).join('');
    const requirement = piscesBalanceRequirement(player.id);
    const costOptions = player.hand.filter(card => card.element === 'water').map(card =>
      '<button class="choiceCard ' + ((draft.costCardIds || []).includes(card.id) ? 'selected' : '') + '" onclick="togglePiscesBalanceCost(\'' + player.id + '\', \'' + card.id + '\')">' + cardText(card) + '</button>'
    ).join('');
    const ready = requirement.targets.length === 2 && (draft.costCardIds || []).length === requirement.required;
    chooser = '<div class="skillChooser">' +
      '<div class="chooserLabel">选择任意两名存活角色</div><div class="choiceGrid">' + targetOptions + '</div>' +
      (requirement.targets.length === 2 ? '<div class="chooserLabel">弃置 ' + requirement.required + ' 张水牌</div><div class="choiceGrid">' + (requirement.required ? (costOptions || '<div class="skillHint">没有足够水牌。</div>') : '<div class="skillHint">生命相同，无需弃牌。</div>') + '</div>' : '') +
      '</div>';
    actions = '<button ' + (!ready ? 'disabled' : '') + ' onclick="confirmPiscesBalance(\'' + player.id + '\')">发动平潮</button>';
  }
  if (id === 'weapon.airCompass' && state.activePlayerId === player.id && state.phase === 'main') {
    const options = [
      ['fire', '火'],
      ['water', '水'],
      ['air', '风'],
      ['earth', '土']
    ].map(([element, label]) =>
      '<button class="choiceCard" onclick="confirmAirCompass(\'' + player.id + '\', \'' + element + '\')">获得 1 张' + label + '属性牌</button>'
    ).join('');
    chooser = '<div class="skillChooser"><div class="chooserLabel">选择要检索的属性</div><div class="choiceGrid">' + options + '</div></div>';
  }
  if (id === 'infection.bossCommand' && state.activePlayerId === player.id && state.phase === 'main') {
    chooser = '<div class="skillChooser">' +
      '<div class="chooserLabel">选择本回合的战令效果</div>' +
      '<div class="choiceGrid">' +
        '<button class="choiceCard" onclick="chooseInfectionBossCommand(\'' + player.id + '\', \'extraAttack\')"><strong>连袭</strong><span>本回合可额外使用 1 张基础攻击牌。</span></button>' +
        '<button class="choiceCard" onclick="chooseInfectionBossCommand(\'' + player.id + '\', \'extraTarget\')"><strong>扩袭</strong><span>本回合 1 张基础攻击牌可额外指定 1 个目标。</span></button>' +
      '</div>' +
    '</div>';
  }
  if (id === 'gemini.steal' && state.activePlayerId === player.id && state.phase === 'main') {
    const draft = stealDrafts[player.id] || {};
    const costCardIds = draft.costCardIds || [];
    const validStealCost = (costCardIds.length === 1 || costCardIds.length === 2)
      && new Set(costCardIds).size === costCardIds.length
      && costCardIds.every(cardId => player.hand.some(card => card.id === cardId));
    const stealTargets = opponent ? stealTargetsOf(opponent) : [];
    const ownOptions = player.hand.map(card =>
      '<button class="choiceCard ' + (costCardIds.includes(card.id) ? 'selected' : '') + '" onclick="toggleStealCost(\'' + player.id + '\', \'' + card.id + '\')">' + cardText(card) + '</button>'
    ).join('');
    const targetOptions = stealTargets.map(item =>
      '<button class="choiceCard ' + (draft.targetCardId === item.card.id ? 'selected' : '') + '" onclick="setStealDraft(\'' + player.id + '\', \'targetCardId\', \'' + item.card.id + '\')">' + item.source + '：' + cardText(item.card) + '</button>'
    ).join('');
    const targetChooser = stealTargets.length > 0
      ? '<div><div class="chooserLabel">选择对手手牌或装备</div><div class="choiceGrid">' + targetOptions + '</div></div>'
      : '<div class="skillHint">目标没有手牌和装备：发动后对目标造成 2 点伤害并附加致盲。</div>';
    chooser = '<div class="skillChooser">' +
      '<div><div class="chooserLabel">选择费用：弃 2 张牌，或弃 1 张牌并失去 1 点生命</div><div class="choiceGrid">' + ownOptions + '</div></div>' +
      '<div class="skillHint">选择 1 张费用牌时，发动后失去 1 点生命。换影无距离限制。</div>' +
      targetChooser +
      '</div>';
    actions = '<button ' + (!validStealCost || (stealTargets.length > 0 && !draft.targetCardId) ? 'disabled' : '') + ' onclick="confirmSteal(\'' + player.id + '\')">发动换影</button>';
  }

  if (id === 'scorpio.peek' && state.activePlayerId === player.id && state.phase === 'draw') {
    const count = state.players.length >= 5 ? 5 : state.players.length === 4 ? 4 : 3;
    const draft = peekDrafts[player.id] || { topCardIds: state.deck.slice(0, count).map(card => card.id), bottomCardIds: [] };
    const peeked = state.deck.slice(0, count);
    const byId = Object.fromEntries(peeked.map(card => [card.id, card]));
    const renderPeekCard = (cardId, group) => {
      const card = byId[cardId];
      if (!card) return '';
      const other = group === 'top' ? 'bottom' : 'top';
      const otherText = group === 'top' ? '放牌底' : '放牌顶';
      return '<div class="choiceStack"><button class="choiceCard selected">' + cardText(card) + '</button>' +
        '<div class="miniActions">' +
        '<button onclick="reorderPeekCard(\'' + player.id + '\', \'' + cardId + '\', \'' + group + '\', -1)">上移</button>' +
        '<button onclick="reorderPeekCard(\'' + player.id + '\', \'' + cardId + '\', \'' + group + '\', 1)">下移</button>' +
        '<button onclick="movePeekCard(\'' + player.id + '\', \'' + cardId + '\', \'' + other + '\')">' + otherText + '</button>' +
        '</div></div>';
    };
    const topCards = draft.topCardIds.map(cardId => renderPeekCard(cardId, 'top')).join('');
    const bottomCards = draft.bottomCardIds.length > 0
      ? draft.bottomCardIds.map(cardId => renderPeekCard(cardId, 'bottom')).join('')
      : '<div class="skillHint">暂无放入牌底的牌。</div>';
    chooser = '<div class="skillChooser">' +
      '<div><div class="chooserLabel">牌顶顺序</div><div class="choiceGrid">' + topCards + '</div></div>' +
      '<div><div class="chooserLabel">牌底顺序</div><div class="choiceGrid">' + bottomCards + '</div></div>' +
      '</div>';
    actions = '<button onclick="confirmScorpioPeek(\'' + player.id + '\')">确认伏击</button>';
  }
  if (id === 'scorpio.spoils' && state.activePlayerId === player.id && state.phase === 'main') {
    const freeTargets = player.flags?.scorpioFreeStingTargetIds || [];
    const draft = spoilsDrafts[player.id] || {
      costCardId: player.hand[0]?.id || '',
      targetId: enemiesOf(player).find(enemy => freeTargets.includes(enemy.id))?.id || enemiesOf(player).find(enemy => enemy.statuses?.frozen)?.id || ''
    };
    const frozenTargets = enemiesOf(player).filter(enemy => enemy.statuses?.frozen);
    const costOptions = player.hand.map(card =>
      '<button class="choiceCard ' + (draft.costCardId === card.id ? 'selected' : '') + '" onclick="setSpoilsDraft(\'' + player.id + '\', \'costCardId\', \'' + card.id + '\')">' + cardText(card) + '</button>'
    ).join('');
    const targetOptions = frozenTargets.map(target =>
      '<button class="choiceCard ' + (draft.targetId === target.id ? 'selected' : '') + '" onclick="setSpoilsDraft(\'' + player.id + '\', \'targetId\', \'' + target.id + '\')">' + safeText(target.name) + ' · ' + statuses(target) + (freeTargets.includes(target.id) ? ' · 免费毒刺' : '') + '</button>'
    ).join('');
    const selectedTargetIsFree = freeTargets.includes(draft.targetId);
    chooser = '<div class="skillChooser">' +
      '<div><div class="chooserLabel">选择毒刺费用：普通目标弃 1 张手牌；免费毒刺目标可不支付</div><div class="choiceGrid">' + (costOptions || '<div class="skillHint">没有手牌时，只能对免费毒刺目标发动。</div>') + '</div></div>' +
      '<div><div class="chooserLabel">选择冰冻目标</div><div class="choiceGrid">' + (targetOptions || '<div class="skillHint">没有冰冻敌人，不能发动毒刺。</div>') + '</div></div>' +
      '</div>';
    actions = '<button ' + (!draft.targetId || (!selectedTargetIsFree && !draft.costCardId) ? 'disabled' : '') + ' onclick="confirmScorpioSpoils(\'' + player.id + '\')">发动毒刺</button>';
  }
  return renderSkillChoiceContent(item.name, item.text, chooser, actions, player.id);
}

function syncHandStacking() {
  const hand = document.querySelector('.focusedHandCards');
  if (!hand) return;
  const cards = Array.from(hand.querySelectorAll('.card'));
  hand.classList.remove('stackedHand');
  hand.style.removeProperty('--hand-overlap');
  if (cards.length <= 1) return;
  const style = window.getComputedStyle(hand);
  const gap = Number.parseFloat(style.columnGap || style.gap || '0') || 0;
  const cardWidth = cards[0]?.getBoundingClientRect().width || 148;
  const horizontalPadding = (Number.parseFloat(style.paddingLeft) || 0) + (Number.parseFloat(style.paddingRight) || 0);
  const handWidth = Math.max(0, hand.clientWidth - horizontalPadding);
  const cardsWidth = cards.length * cardWidth + Math.max(0, cards.length - 1) * gap;
  const needsStacking = cardsWidth > handWidth;
  hand.classList.toggle('stackedHand', needsStacking);
  if (needsStacking) {
    const availableStep = Math.max(0, (handWidth - cardWidth) / Math.max(1, cards.length - 1));
    const overlap = Math.max(0, Math.min(cardWidth - 6, cardWidth + gap - availableStep));
    hand.style.setProperty('--hand-overlap', overlap.toFixed(2) + 'px');
  }
}

function render() {
  if (!state) return;
  const skillPanelView = window.TabletopV10?.captureSkillPanelView();
  syncStartControls();
  document.documentElement.classList.toggle('matchOpen', !lobbyOpen);
  document.body.classList.toggle('matchOpen', !lobbyOpen);
  const startScreen = document.getElementById('startScreen');
  const board = document.getElementById('board');
  document.getElementById('error').innerHTML = error ? '<div class="error">' + error + '</div>' : '';
  if (lobbyOpen) {
    document.getElementById('subtitle').textContent = '选择模式与席位配置';
    document.getElementById('winner').innerHTML = '';
    startScreen.hidden = false;
    board.hidden = true;
    board.innerHTML = '';
    return;
  }
  startScreen.hidden = true;
  board.hidden = false;
  const active = state.players.find(p => p.id === state.activePlayerId);
  document.getElementById('subtitle').textContent = '阶段：' + state.phase + ' · 第 ' + state.round + ' 轮 · 行动者：' + (active ? characterVisual(active).name : '等待');
  document.getElementById('winner').innerHTML = renderGameOverOverlay();
  const localPlayer = localHumanPlayer();
  const entrustButton = document.getElementById('entrustButton');
  if (entrustButton) {
    const entrusted = localPlayer?.control === 'ai';
    entrustButton.textContent = entrusted ? '取消托管' : '托管';
    entrustButton.setAttribute('aria-pressed', entrusted ? 'true' : 'false');
  }
  const activeOpponent = active ? selectedEnemyOf(active) : null;
  const activeAlly = active ? selectedAllyOf(active) : null;
  const attackSource = state.pendingAttack ? state.players.find(player => player.id === state.pendingAttack.sourceId) : null;
  const defenseTarget = state.pendingAttack ? state.players.find(player => player.id === state.pendingAttack.currentTargetId) : null;
  const handFocus = focusedHumanPlayer(active, attackSource, defenseTarget);
  const tableControls = renderTableControls(active, activeOpponent, activeAlly, attackSource, defenseTarget, handFocus);
  board.innerHTML = renderBattleStage(active, activeOpponent, attackSource, defenseTarget, tableControls, handFocus);
  window.TabletopV10?.restoreSkillPanelView(skillPanelView);
  requestAnimationFrame(() => {
    updatePersistentActionGuide();
    syncHandStacking();
  });

  const visibleLog = setupPaused && !setupFateDrawn
    ? state.log.filter(event => !event.message.includes('命运牌'))
    : state.log;
  const logSummary = document.getElementById('logSummary');
  if (logSummary) {
    logSummary.textContent = visibleLog.slice(0, 3).map(e => formatLogMessage(e.message)).join(' / ') || '暂无日志';
  }
  document.getElementById('log').innerHTML = visibleLog.slice(0, 80).map(e => '<div>' + safeText(formatLogMessage(e.message)) + '</div>').join('');
}

function setupSelectors() {
  for (const id of allSeatIds.map(value => 'c' + value)) {
    const el = document.getElementById(id);
    el.innerHTML = Object.entries(labels).map(([value, text]) => '<option value="' + value + '">' + text + '</option>').join('');
  }
}

function downloadLog() {
  const displayLog = state.log.map(event => ({ ...event, message: formatLogMessage(event.message) }));
  const blob = new Blob([JSON.stringify({ metrics: state.metrics, log: displayLog }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'zodiac-war-log.json';
  a.click();
  URL.revokeObjectURL(url);
}

setInterval(async () => {
  try {
    const res = await fetch('/api/version', { cache: 'no-store' });
    const json = await res.json();
    if (json.version && json.version !== serverVersion) location.reload();
  } catch (_error) {
    // The dev watcher may restart the server between polls.
  }
}, 1000);

setInterval(() => {
  if (!state || setupPaused || state.phase !== 'mulligan' || !mulliganDeadline) return;
  const remaining = Math.max(0, Math.ceil((mulliganDeadline - Date.now()) / 1000));
  const timer = document.getElementById('mulliganTimerSeconds');
  if (timer) timer.textContent = String(remaining);
  if (remaining <= 0) finishMulliganTimeout();
}, 250);

function updateActionTimer() {
  const clock = document.getElementById('v10-round-clock');
  if (clock) {
    const remaining = state?.phase === 'mulligan' && mulliganDeadline
      ? Math.max(0, Math.ceil((mulliganDeadline - Date.now()) / 1000))
      : actionDeadline ? actionTimerRemainingSeconds() : null;
    clock.textContent = remaining === null ? '' : String(Math.floor(remaining / 60)).padStart(2, '0') + ':' + String(remaining % 60).padStart(2, '0');
  }
  if (!state || setupPaused || !actionDeadline) return;
  const remaining = actionTimerRemainingSeconds();
  const targetId = actionTimeoutTargetId();
  const badge = document.querySelector('[data-countdown-player-id="' + targetId + '"]');
  if (remaining > 0 && remaining <= 3) {
    if (badge) {
      badge.textContent = String(remaining);
      badge.classList.add('countdownUrgent');
    }
    else render();
  }
  if (remaining <= 0) finishActionTimeout();
}

setInterval(updateActionTimer, 250);
setInterval(maybeAutoAdvanceAi, 500);

document.addEventListener('dragover', updateDragGuide);
document.addEventListener('mousemove', updateSelectedCardGuide);
document.addEventListener('click', (event) => {
  if (!selectedCard) return;
  if (event.target.closest('.card') || event.target.closest('.seatCard')) return;
  if (event.target.closest('.v10-nav, .v10-report-button, .v10-dialog-backdrop, .v10-log-backdrop, .playerInspectorBackdrop')) return;
  clearSelectedCard();
});
document.addEventListener('drop', clearCardDrag);
document.addEventListener('dragend', clearCardDrag);
window.addEventListener('resize', () => {
  updatePersistentActionGuide();
  syncHandStacking();
});

setupSelectors();
api('/api/state');
