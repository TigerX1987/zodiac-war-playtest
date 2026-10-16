                                                          

export const ZODIAC_CHARACTER_ORDER                         = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
];

const ZODIAC_ORDER_INDEX = new Map(
  ZODIAC_CHARACTER_ORDER.map((characterId, index) => [characterId, index]),
);

export function zodiacSeatIndices(characterIds                        ) {
  const seats = new Array        (characterIds.length);
  characterIds
    .map((characterId, sourceIndex) => ({
      characterId,
      sourceIndex,
      zodiacIndex: ZODIAC_ORDER_INDEX.get(characterId) ?? Number.MAX_SAFE_INTEGER,
    }))
    .sort((left, right) => left.zodiacIndex - right.zodiacIndex || left.sourceIndex - right.sourceIndex)
    .forEach(({ sourceIndex }, seatIndex) => {
      seats[sourceIndex] = seatIndex;
    });
  return seats;
}

export const CHARACTERS                                 = {
  aries: {
    id: 'aries',
    name: '白羊座',
    element: 'fire',
    maxHp: 3,
    role: '强攻 / 点杀 / 灼烧',
    skills: ['血怒', '羊角冲', '燃魂'],
  },
  leo: {
    id: 'leo',
    name: '狮子座',
    element: 'fire',
    maxHp: 3,
    role: '灼烧压制 / 禁疗 / 群体施压',
    skills: ['狮威', '狮吼', '王令'],
  },
  sagittarius: {
    id: 'sagittarius',
    name: '射手座',
    element: 'fire',
    maxHp: 4,
    role: '装备成长 / 持续输出 / 残局收割',
    skills: ['整弓', '寻器', '神射'],
  },
  gemini: {
    id: 'gemini',
    name: '双子座',
    element: 'air',
    maxHp: 3,
    role: '失血补风 / 换牌偷取 / 额外回合',
    skills: ['双生', '换影', '连星'],
  },
  libra: {
    id: 'libra',
    name: '天秤座',
    element: 'air',
    maxHp: 3,
    role: '元素平衡 / 控制 / 资源裁决',
    skills: ['衡感', '审判', '裁衡'],
  },
  aquarius: {
    id: 'aquarius',
    name: '水瓶座',
    element: 'air',
    maxHp: 3,
    role: '换牌 / 群体回复 / 弃牌惩罚',
    skills: ['倾杯', '神酿', '断流'],
  },
  cancer: {
    id: 'cancer',
    name: '巨蟹座',
    element: 'water',
    maxHp: 3,
    role: '治疗 / 急救 / 团队续航',
    skills: ['共潮', '疗潮', '蟹护'],
  },
  scorpio: {
    id: 'scorpio',
    name: '天蝎座',
    element: 'water',
    maxHp: 3,
    role: '冰冻压制 / 资源拆解 / 牌堆运营',
    skills: ['蝎毒', '毒刺', '伏击'],
  },
  pisces: {
    id: 'pisces',
    name: '双鱼座',
    element: 'water',
    maxHp: 3,
    role: '滤牌 / 生命平衡 / 弃牌后补牌',
    skills: ['观潮', '平潮', '回梦'],
  },
  taurus: {
    id: 'taurus',
    name: '金牛座',
    element: 'earth',
    maxHp: 3,
    initialArmor: 1,
    maxArmor: 2,
    role: '承伤 / 护卫 / 筑甲',
    skills: ['牛守', '厚皮', '筑甲'],
  },
  virgo: {
    id: 'virgo',
    name: '处女座',
    element: 'earth',
    maxHp: 3,
    role: '净化 / 拒战 / 多目标反制',
    skills: ['净化', '净域', '戒律'],
  },
  capricorn: {
    id: 'capricorn',
    name: '摩羯座',
    element: 'earth',
    maxHp: 4,
    role: '怒气 / 双防御需求 / 终局压制',
    skills: ['蓄怒', '重压', '山崩'],
  },
};

export const DEFAULT_CHARACTER_PAIR                             = ['gemini', 'capricorn'];
export const DEFAULT_DEMO_CHARACTERS                                                       = [
  'aries',
  'cancer',
  'gemini',
  'capricorn',
];
