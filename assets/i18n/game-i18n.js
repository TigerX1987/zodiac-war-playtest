/* Display-only localization. Game IDs, payments, targets and saved rules remain canonical. */
(function (global) {
  'use strict';
  const languages = [
    ['zh-CN', '简体中文'], ['zh-TW', '繁體中文'], ['en', 'English'],
    ['ja', '日本語'], ['fr', 'Français'], ['ru', 'Русский'], ['es', 'Español']
  ];
  const storageKey = 'zodiac-war-language-v1';
  const canonicalMessages = {
    '${p0} pays ${p1} to ${p2} for Leo order': '${p0} 因王令将 ${p1} 交给 ${p2}',
    '${p0} is burning and cannot recover because Leo aura is active': '${p0} 因灼烧和狮威不能普通回复',
    '${p0} must pay 1 water card to avoid Scorpio poison freeze': '${p0} 须交 1 张水牌以避免蝎毒冰冻',
    '${p0} gives ${p1} to ${p2} to avoid Scorpio poison freeze': '${p0} 将 ${p1} 交给 ${p2}，避免蝎毒冰冻',
    '${p0} gives ${p1} to ${p2} and is frozen by Scorpio poison': '${p0} 将 ${p1} 交给 ${p2}，被蝎毒冰冻',
    '${p0} failed to pay water and is frozen by Scorpio poison': '${p0} 未交水牌，被蝎毒冰冻',
    '${p0} defended once and still needs ${p1} defense card': '${p0} 已防御一次，仍需 ${p1} 张防御牌',
    '${p0} uses Scorpio sting to remove 1 armor from ${p1}': '${p0} 发动毒刺，移除 ${p1} 的 1 点护甲',
    '${p0} uses Scorpio sting to remove shield from ${p1}': '${p0} 发动毒刺，移除 ${p1} 的圣盾',
    '${p0} uses Scorpio sting to remove armor equipment from ${p1}': '${p0} 发动毒刺，移除 ${p1} 的防具',
    '${p0} uses Leo roar on ${p1}': '${p0} 对 ${p1} 发动狮吼',
    '${p0} uses Leo order on ${p1}': '${p0} 对 ${p1} 发动王令'
  };
  const dictionaries = new Map([['zh-CN', canonicalMessages]]);
  const sources = new WeakMap();
  const missing = new Set();
  const document = global.document;
  const scriptUrl = document?.currentScript?.src || '';
  const originalTitle = document?.title || '';
  let language = 'zh-CN';
  let requested = 0;
  let observer;
  let lexicon = [];
  let patterns = [];
  const punctuation = {'，': ', ', '。': '. ', '；': '; ', '：': ': ', '、': ', ', '（': ' (', '）': ')', '「': '“', '」': '”'};
  const escapeRegex = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function normalize(value) {
    const code = String(value || '').toLowerCase();
    if (['zh-tw', 'zh-hk', 'zh-hant'].includes(code)) return 'zh-TW';
    if (code.startsWith('zh')) return 'zh-CN';
    return languages.find(([id]) => code === id || code.startsWith(id + '-'))?.[0] || 'zh-CN';
  }
  function dictionary() { return dictionaries.get(language) || {}; }
  function rebuild() {
    const entries = {...(dictionaries.get('en') || {}), ...dictionary()};
    lexicon = Object.keys(entries).filter(key => /[\u3400-\u9fff]/u.test(key) && !/\$\{|\{\d+\}/.test(key)).sort((a, b) => b.length - a.length).map(key => [key, entries[key]]);
    patterns = Object.entries(entries).filter(([key]) => /\{\d+\}/.test(key)).sort(([a], [b]) => b.replace(/\{\d+\}/g, '').length - a.replace(/\{\d+\}/g, '').length).map(([key, value]) => {
      const slots = [];
      const pieces = key.split(/(\{\d+\})/g).map(piece => /^\{\d+\}$/.test(piece) ? (slots.push(piece), '(.*?)') : escapeRegex(piece));
      return {key, value, slots, regex: new RegExp('^' + pieces.join('') + '$', 'u')};
    });
  }
  function t(source, params) {
    const text = String(source ?? '');
    if (params) {
      const template = dictionary()[text] || (language === 'zh-CN' ? text : dictionaries.get('en')?.[text] || text);
      return template.replace(/\$\{([^}]+)\}|\{(\d+)\}/g, (token, named, index) => Object.hasOwn(params, named ?? index) ? t(params[named ?? index]) : token);
    }
    if (!text) return text;
    if (language === 'zh-CN') return dictionary()[text] || text;
    if (Object.hasOwn(dictionary(), text)) return dictionary()[text];
    if (Object.hasOwn(dictionaries.get('en') || {}, text)) return dictionaries.get('en')[text];
    const trimmed = text.trim();
    if (trimmed !== text) return text.slice(0, text.indexOf(trimmed)) + t(trimmed) + text.slice(text.indexOf(trimmed) + trimmed.length);
    for (const item of patterns) {
      const match = text.match(item.regex);
      if (match) return item.value.replace(/\{\d+\}/g, slot => t(match[item.slots.indexOf(slot) + 1]));
    }
    if (!/[\u3400-\u9fff]/u.test(text)) return text;
    // UI labels are often assembled from finite names and counters. Translate those
    // explicit source fragments, without touching HTML, attributes or game objects.
    let output = '', index = 0;
    while (index < text.length) {
      const entry = lexicon.find(([key]) => text.startsWith(key, index));
      if (entry) { output += entry[1]; index += entry[0].length; }
      else { output += language === 'zh-TW' || language === 'ja' ? text[index] : punctuation[text[index]] || text[index]; index++; }
    }
    if (language !== 'zh-TW' && language !== 'ja' && /[\u3400-\u9fff]/u.test(output)) missing.add(text);
    return output;
  }
  function log(event, nameFormatter = value => value) {
    if (!event?.key || !event.params) return t(nameFormatter(event?.message || ''));
    const params = Object.fromEntries(Object.entries(event.params).map(([key, value]) => [key, typeof value === 'string' ? nameFormatter(value) : value]));
    return t(event.key, params);
  }
  function translateValue(node, field, current, write) {
    let saved = sources.get(node);
    if (!saved) { saved = new Map(); sources.set(node, saved); }
    const old = saved.get(field);
    const source = old && old.translated === current ? old.source : current;
    const translated = t(source);
    saved.set(field, {source, translated});
    if (translated !== current) write(translated);
  }
  function localize(root = document?.body) {
    if (!document || !root) return;
    const visit = node => {
      if (node.nodeType === 3) {
        if (node.parentElement?.closest('script,style,code,textarea,[data-i18n-skip]')) return;
        translateValue(node, 'text', node.nodeValue, value => { node.nodeValue = value; });
      } else if (node.nodeType === 1 && !node.closest('[data-i18n-skip]')) {
        for (const attribute of ['title', 'aria-label', 'aria-description', 'placeholder', 'alt']) {
          if (node.hasAttribute(attribute)) translateValue(node, attribute, node.getAttribute(attribute), value => node.setAttribute(attribute, value));
        }
      }
    };
    visit(root);
    const walker = document.createTreeWalker(root, 5);
    while (walker.nextNode()) visit(walker.currentNode);
  }
  function selector(id = 'game-language') {
    return '<label class="game-language" data-i18n-skip><span>Language</span><select id="' + id + '" aria-label="Language" onchange="GameI18n.setLanguage(this.value)">' +
      languages.map(([code, label]) => '<option value="' + code + '"' + (code === language ? ' selected' : '') + '>' + label + '</option>').join('') + '</select></label>';
  }
  function syncSelectors() {
    document?.querySelectorAll('.game-language select').forEach(select => { select.value = language; });
  }
  async function load(code) {
    if (dictionaries.has(code)) return;
    const base = new URL(scriptUrl, global.location?.href || 'http://localhost/');
    const url = new URL(code + '.json' + base.search, base);
    const response = await global.fetch(url.href);
    if (!response.ok) throw new Error('Language download failed');
    const entries = await response.json();
    if (!entries || Array.isArray(entries) || typeof entries !== 'object' || Object.values(entries).some(value => typeof value !== 'string')) throw new Error('Invalid language dictionary');
    dictionaries.set(code, entries);
  }
  async function setLanguage(value) {
    const code = normalize(value);
    const ticket = ++requested;
    try {
      if (code !== 'zh-CN') await Promise.all([load('en'), load(code)]);
      if (ticket !== requested) return false;
      language = code;
      rebuild();
      try { global.localStorage?.setItem(storageKey, code); } catch (_) {}
      if (document) {
        document.documentElement.lang = code;
        document.documentElement.dataset.language = code;
        document.title = t(originalTitle);
        global.dispatchEvent(new CustomEvent('game-language-change', {detail: {language: code}}));
        localize(document.body);
        syncSelectors();
        document.getElementById('game-language-error')?.remove();
      }
      return true;
    } catch (_) {
      if (ticket !== requested) return false;
      syncSelectors();
      if (document && !document.getElementById('game-language-error')) {
        const status = document.createElement('p');
        status.id = 'game-language-error'; status.role = 'alert';
        status.textContent = '语言加载失败，请重新选择。 Language download failed. Please select again.';
        document.querySelector('.game-language')?.appendChild(status);
      }
      return false;
    }
  }
  global.GameI18n = {languages, storageKey, t, log, localize, selector, setLanguage, normalize,
    get language() {return language;}, get missing() {return [...missing];},
    canonicalMessages,
    register(code, entries) {dictionaries.set(normalize(code), entries); rebuild();}
  };
  if (document) {
    const start = () => {
      const host = document.getElementById('lobby-language');
      if (host) host.innerHTML = selector('lobby-language-select');
      observer = new MutationObserver(records => {
        const roots = new Set();
        for (const record of records) {
          if (record.type === 'characterData' || record.type === 'attributes') roots.add(record.target);
          else record.addedNodes.forEach(node => roots.add(node));
        }
        for (const root of roots) if (root.isConnected) localize(root);
      });
      observer.observe(document.body, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['title', 'aria-label', 'aria-description', 'placeholder', 'alt']});
      let saved = 'zh-CN';
      try { saved = global.localStorage?.getItem(storageKey) || saved; } catch (_) {}
      setLanguage(saved);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
    else start();
  }
})(typeof window === 'undefined' ? globalThis : window);
