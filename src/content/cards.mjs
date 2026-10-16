                                                               

export const ELEMENT_LABELS                              = {
  fire: '火',
  water: '水',
  air: '风',
  earth: '土',
};

const ELEMENTS                = ['fire', 'water', 'air', 'earth'];

const weaponNames                              = {
  fire: '流火机括',
  water: '潮汐法典',
  air: '命运罗盘',
  earth: '撼岳锤',
};

const armorNames                              = {
  fire: '烈焰披风',
  water: '寒冰护甲',
  air: '飓风斗篷',
  earth: '磐石壁垒',
};

const utilityNames                              = {
  fire: '元素对决',
  water: '潮汐窃取',
  air: '风之制裁',
  earth: '石之宝藏',
};

export function createBaseDeck()         {
  const cards         = [];

  for (const element of ELEMENTS) {
    for (let i = 1; i <= 7; i += 1) {
      cards.push({
        id: `${element}-normal-${i}`,
        name: `${ELEMENT_LABELS[element]}普通攻击`,
        kind: 'normalAttack',
        element,
      });
    }

    cards.push({
      id: `${element}-status-1`,
      name: `${ELEMENT_LABELS[element]}状态攻击`,
      kind: 'statusAttack',
      element,
    });

    cards.push({
      id: `${element}-energy`,
      name: `${ELEMENT_LABELS[element]}星能`,
      kind: 'energy',
      element,
    });

    cards.push({
      id: `${element}-aoe-1`,
      name: `${ELEMENT_LABELS[element]}AOE`,
      kind: 'aoe',
      element,
    });

    cards.push({
      id: `${element}-utility`,
      name: utilityNames[element],
      kind: 'utility',
      element,
    });

    cards.push({
      id: `${element}-weapon`,
      name: weaponNames[element],
      kind: 'weapon',
      element,
    });

    cards.push({
      id: `${element}-armor`,
      name: armorNames[element],
      kind: 'armor',
      element,
    });
  }

  cards.push({ id: 'sun', name: '太阳', kind: 'sun' });
  cards.push({ id: 'moon', name: '月亮', kind: 'moon' });

  return cards;
}

export function createInfectionDeck()         {
  return createBaseDeck().map((card) => {
    if (card.kind !== 'energy' || !card.element) return card;
    return {
      id: `${card.element}-ritual`,
      name: `${ELEMENT_LABELS[card.element]}净化仪式`,
      kind: 'ritual',
      element: card.element,
    };
  });
}

export function effectiveRitualCard(card      , holderIsInfectedFaction         )       {
  if (card.kind !== 'ritual') return card;
  return {
    ...card,
    name: holderIsInfectedFaction
      ? `${card.element ? ELEMENT_LABELS[card.element] : ''}感染牌`
      : `${card.element ? ELEMENT_LABELS[card.element] : ''}净化仪式`,
  };
}

export function statusForElement(element             )           {
  if (element === 'fire') return 'burn';
  if (element === 'water') return 'frozen';
  if (element === 'air') return 'blind';
  return 'silence';
}
