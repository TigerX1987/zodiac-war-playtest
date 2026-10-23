/* One voice at a time. Successful engine events, never card selection or render. */
(function (global) {
  'use strict';
  const DEFAULTS = {mode: 'compact', voice: 55, effects: 60, music: 18};
  const STORAGE_KEY = 'zodiac-audio-v1';
  const CATALOG_URL = '/zodiac-war-playtest/assets/audio/manifest.json';
  const finiteVolume = (value, fallback) => Number.isFinite(Number(value)) ? Math.max(0, Math.min(100, Number(value))) : fallback;

  function collectCandidates(state, previous, events, catalog, localId) {
    const candidates = [];
    const players = state.players || [];
    const byId = id => players.find(p => p.id === id);
    const byName = name => players.find(p => p.name === name);
    const playedCard = (player, name) => catalog.cardNames[name] || state.playedCards?.cards.find(display => display.playerId === player?.id && display.card.name === name)?.card;
    const add = (player, id, category, priority, variants) => {
      if (!player) return;
      const qualify = cue => !catalog.characters || cue.startsWith(player.characterId + '.') ? cue : player.characterId + '.card.' + cue;
      const cueId = qualify(id);
      if (!catalog.cues[cueId] || catalog.cues[cueId].characterId && catalog.cues[cueId].characterId !== player.characterId) return;
      const existing = candidates.findIndex(c => c.playerId === player.id && c.cueId === cueId);
      if (existing >= 0 && candidates[existing].priority >= priority) return;
      if (existing >= 0) candidates.splice(existing, 1);
      candidates.push({playerId: player.id, cueId, category, priority, variants:variants?.map(qualify).filter(cue => catalog.cues[cue]),
        local: player.id === localId, turnKey: [state.round, state.activePlayerId, state.metrics?.turns].join(':')});
    };
    const cardCue = (player, card, defending = false) => {
      if (!card) return;
      if (defending) return add(player, card.kind === 'sun' || card.kind === 'moon' ? card.kind + '.defense' : 'defense.' + card.element, 'ordinary', 20);
      const prefix = {normalAttack:'normal', statusAttack:'status', aoe:'aoe', energy:'energy', utility:'utility'}[card.kind];
      if (card.fusion) add(player, 'fusion.support', 'major', 60);
      else if (prefix) add(player, prefix + '.' + card.element, card.kind === 'aoe' ? 'major' : 'ordinary', card.kind === 'aoe' ? 65 : 25);
      else if (card.kind === 'weapon' || card.kind === 'armor') add(player, 'equip.' + card.element + '-' + card.kind, 'equipment', 30);
    };
    for (const e of events) {
      const key = e.key || '';
      const params = e.params || {};
      const player = byId(e.playerId);
      if (e.type === 'skill' && key.includes('发动羊角冲')) {
        add(player, params.p1 ? 'aries.burnSoul' : 'aries.ram', 'major', 80);
      } else if ((e.type === 'sun' || e.type === 'card') && (key.includes('使用太阳急救') || key.includes('使用星能急救'))) {
        const self = params.p1 === player?.name;
        const cue = (e.type === 'sun' ? 'sun' : 'energy') + '.rescue.' + (self ? 'self' : 'other');
        add(player, cue, 'critical', self ? 115 : 100, self ? undefined : [cue, player?.characterId + '.rescue_given']);
      } else if (e.type === 'attack' && key === '${p0} 对 ${p1} 使用 ${p2}') {
        const card = playedCard(player, params.p2);
        cardCue(player, card);
        if (player?.characterId === 'capricorn' && card?.element === 'earth' && ['normalAttack','statusAttack'].includes(card.kind)) add(player, 'capricorn.wushuang', 'major', 75);
      } else if (e.type === 'equipment' && key === '${p0} 装备 ${p1}') {
        cardCue(player, catalog.cardNames[params.p1]);
      } else if (e.type === 'card' && key.includes('蓄能：下一张')) {
        cardCue(player, catalog.cardNames[params.p1]);
      } else if (e.type === 'equipment' && key === '${p0} 使用 ${p1}${p2}') {
        cardCue(player, {...playedCard(player, params.p1), fusion: true});
      } else if (e.type === 'card') {
        const element = key.includes('发动元素对决') ? 'fire' : key.includes('发动潮汐窃取') ? 'water' : key.includes('发动风之制裁') ? 'air' : key.includes('发动石之宝藏') ? 'earth' : '';
        if (element) add(player, 'utility.' + element, 'ordinary', 25);
      } else if (e.type === 'defense') {
        let card;
        if (key.includes('使用太阳完美防御')) card = {kind:'sun'};
        else if (key.includes('使用月亮完美防御')) card = {kind:'moon'};
        else {
          const old = previous?.players.find(p => p.id === player?.id);
          const removed = old?.hand.filter(c => !player.hand.some(n => n.id === c.id)) || [];
          // A Hammer fee can remove several cards; do not guess its element.
          card = removed.length === 1 && ['normalAttack','statusAttack','aoe'].includes(removed[0].kind) ? removed[0] : null;
        }
        cardCue(player, card, true);
      } else if (e.type === 'sun' && key.includes('使用太阳：')) add(player, 'sun.active', 'ordinary', 35);
      else if (e.type === 'moon') add(player, key.includes('使用月亮增伤') ? 'moon.amplify' : 'moon.curse', 'ordinary', 35);
      else if (e.type === 'infection' && key.includes('使用${p2}感染牌')) add(player, player?.factionId === 'infected' ? 'ritual.infect' : 'ritual.cleanse', 'major', 60);
      else if (e.type === 'infection' && key.includes('抵消感染牌')) add(player, 'ritual.counter', 'major', 60);
      else if (e.type === 'equipment') {
        const equipment = [
          ['发动潮汐法典','gear.waterCodex'], ['发动命运罗盘','gear.airCompass'],
          ['撼岳锤生效','gear.earthHammer'], ['的烈焰披风令','gear.fireArmor'],
          ['的寒冰护甲限制','gear.waterArmor'], ['的飓风斗篷令','gear.airArmor'],
          ['的石壁令','gear.earthArmor'], ['的石壁离开装备区','gear.earthArmorLeave']
        ].find(([text]) => key.includes(text));
        // Hammer's engine event belongs to the defender; its owner is p0.
        if (equipment && (equipment[1] !== 'gear.earthArmorLeave' || player?.hp > previous?.players.find(p=>p.id===player.id)?.hp)) add(key.includes('撼岳锤生效') ? byName(params.p0) : player, equipment[1], 'equipment', 40);
      }
      if (e.type === 'heal' && key.includes('cannot recover because Leo aura is active')) {
        const lions = players.filter(p => p.characterId === 'leo' && p.hp > 0 && !p.eliminated);
        if (lions.length === 1) add(lions[0], 'leo.aura', 'reaction', 35);
      }
    }
    // Metrics change only after successful engine resolution. Prompts, skipped
    // choices and cancelled selections must never announce a skill.
    const passive = new Set(['taurus.thickSkin','gemini.windForm','cancer.tideBond','libra.elementSense','scorpio.peek','sagittarius.bowcraft','aquarius.stormEye','pisces.dream']);
    for (const [metric, count] of Object.entries(state.metrics?.skillTriggers || {})) {
      if (count <= (previous?.metrics?.skillTriggers?.[metric] || 0) || metric.startsWith('aries.') || metric.startsWith('weapon.') || metric.startsWith('infection.')) continue;
      const id = metric === 'sagittarius.extraAttack' || metric === 'sagittarius.resupply' ? 'sagittarius.sharpshot' : metric === 'libra.perfectJudgment' ? 'libra.judgment' : metric === 'pisces.dreamExtra' ? 'pisces.dream' : metric;
      const owners = players.filter(p => p.characterId === id.split('.')[0]);
      if (owners.length !== 1) continue;
      const player = owners[0], old = previous?.players.find(p => p.id === player.id);
      if (id === 'capricorn.unyielding' && ![3,5].some(level => (old?.rage || 0) < level && player.rage >= level)) continue;
      // Passive draws stay quiet; an explicitly confirmed counter/exchange can
      // receive the normal skill priority. Rage speaks only at key thresholds.
      const confirmed = events.some(e => e.playerId === player.id && e.type === 'skill' &&
        (id === 'taurus.thickSkin' && e.key?.includes('弃置') && e.key.includes('发动厚皮') || id === 'aquarius.stormEye' && e.key?.startsWith('${p0} 发动倾杯，与')));
      const low = id === 'capricorn.unyielding' || passive.has(id) && !confirmed || id === 'sagittarius.sharpshot' && (metric === 'sagittarius.resupply' || old?.hp > player.hp);
      add(player, id, id === 'cancer.rescue' ? 'critical' : low ? 'reaction' : 'major', id === 'cancer.rescue' ? 100 : low ? 35 : id === 'gemini.extraTurn' ? 70 : 80);
    }
    for (const player of players) {
      const old = previous?.players.find(p => p.id === player.id);
      if (!old) continue;
      const role = player.characterId;
      if (old.hp > 0 && player.hp <= 0 && !player.eliminated) add(player, role + '.dying', 'critical', 105);
      else if (old.hp <= 0 && player.hp > 0 && old.factionId === player.factionId) add(player, role + '.rescued', 'critical', 110);
      else if (old.hp > player.hp && player.hp > 0) add(player, role === 'aries' && !old.flags?.ariesBloodRageReady && player.flags?.ariesBloodRageReady ? 'aries.bloodRage' : role + '.hurt', 'reaction', 35);
      if (state.phase === 'main' && previous.phase === 'draw' && state.activePlayerId === player.id) add(player, role + '.turn_start', 'turn', 10);
      if (player.equipment?.weapon?.element === 'fire' && (player.flags?.basicAttackCount || 0) > 1 && player.flags.basicAttackCount > (old.flags?.basicAttackCount || 0)) add(player, 'gear.fireRepeat', 'equipment', 30);
    }
    return candidates;
  }

  function createAudioController(options = {}) {
    const now = options.now || (() => Date.now());
    const random = options.random || Math.random;
    const visible = options.visible || (() => !global.document?.hidden);
    const fetcher = options.fetch || global.fetch?.bind(global);
    const storage = options.storage || (() => {try {return global.localStorage;} catch (_) {return null;}})();
    let saved;
    try {saved = JSON.parse(storage?.getItem(STORAGE_KEY) || '{}');} catch (_) {saved = {};}
    saved ||= {};
    const settings = {...DEFAULTS, mode: ['compact','full','off'].includes(saved.mode) ? saved.mode : DEFAULTS.mode};
    for (const key of ['voice','effects','music']) settings[key] = finiteVolume(saved[key] ?? DEFAULTS[key], DEFAULTS[key]);
    let catalog = options.catalog || null;
    let context = null, voiceGain, effectsGain, musicGain, voice = null, music = null;
    let active = false, token = 0, musicToken = 0, matchId = null, logCount = null, previous = null;
    let lastVoiceEnd = -Infinity;
    const lastSpeaker = new Map(), lowTurn = new Set(), buffers = new Map(), trace = [];
    const record = (event, values = {}) => {trace.push({at:now(), event, ...values}); if (trace.length > 300) trace.shift(); options.onChange?.();};
    const persist = () => {try {storage?.setItem(STORAGE_KEY, JSON.stringify(settings));} catch (_) {}};
    const absoluteAsset = file => new URL(file, new URL(CATALOG_URL, global.location?.href || 'http://localhost/')).href;
    const ready = catalog ? Promise.resolve(catalog) : fetcher?.(CATALOG_URL,{cache:'no-cache'}).then(r => {if (!r.ok) throw Error('catalog'); return r.json();}).then(data => (catalog = data)).catch(() => {record('catalog-error'); return null;});
    const setGain = (node, value) => {
      if (!node || !context) return;
      if (!value && node.gain.setValueAtTime) {node.gain.cancelScheduledValues(context.currentTime);node.gain.setValueAtTime(0,context.currentTime);}
      else node.gain.setTargetAtTime(value, context.currentTime, .05);
    };
    function mix() {
      const on = active && visible();
      setGain(voiceGain, on && settings.mode !== 'off' ? settings.voice / 100 : 0);
      setGain(effectsGain, on ? settings.effects / 100 * (voice ? .7 : 1) : 0);
      setGain(musicGain, on ? settings.music / 100 * (voice ? .25 : 1) : 0);
      options.onChange?.();
    }
    function stopVoice(reason) {
      token++;
      if (!voice) return;
      const old = voice;
      voice = null;
      try {old.node?.stop();} catch (_) {}
      lastVoiceEnd = now();
      record('voice-stop', {cueId:old.cueId, reason});
      mix();
    }
    function stopMusic() {
      musicToken++;
      try {music?.stop();} catch (_) {}
      music = null;
    }
    async function buffer(file) {
      if (buffers.has(file)) {const cached = buffers.get(file); buffers.delete(file); buffers.set(file,cached); return cached;}
      if (!buffers.has(file)) buffers.set(file, (async () => {
        const response = await fetcher(absoluteAsset(file));
        if (!response.ok) throw Error('audio ' + response.status);
        return context.decodeAudioData(await response.arrayBuffer());
      })().catch(error => {buffers.delete(file); throw error;}));
      // Twelve full packs are large when decoded to PCM. Keep a small LRU cache
      // rather than retaining every voice heard during a long match.
      if (buffers.size > 24) buffers.delete(buffers.keys().next().value);
      return buffers.get(file);
    }
    async function startMusic() {
      if (!context || context.state !== 'running' || !active || !visible() || !settings.music || music || !catalog?.music) return;
      const mine = ++musicToken;
      try {
        const audioBuffer = await buffer(catalog.music.file);
        if (mine !== musicToken || music || !active || !visible() || !settings.music) return;
        music = context.createBufferSource(); music.buffer = audioBuffer; music.loop = true;
        music.connect(musicGain); music.start(); record('music-start');
      } catch (_) {record('music-error');}
    }
    async function unlock() {
      try {
        if (!context || context.state === 'closed') {
          const AudioContextClass = global.AudioContext || global.webkitAudioContext;
          context = options.createContext ? options.createContext() : AudioContextClass ? new AudioContextClass() : null;
          if (!context) return;
          voiceGain = context.createGain(); effectsGain = context.createGain(); musicGain = context.createGain();
          const headroom = context.createGain(); headroom.gain.value = .8; headroom.connect(context.destination);
          for (const gain of [voiceGain,effectsGain,musicGain]) {gain.gain.value = 0; gain.connect(headroom);}
        }
        if (context.state !== 'running') await context.resume();
        await ready; mix(); startMusic();
      } catch (_) {record('unlock-blocked');}
    }
    async function offer(candidates) {
      if (!active || !visible() || !context || context.state !== 'running' || !catalog || !settings.voice || settings.mode === 'off') return;
      const candidate = candidates.filter(c => catalog.cues[c.cueId]).sort((a,b) => b.priority - a.priority || Number(b.local) - Number(a.local))[0];
      if (!candidate) return;
      const critical = candidate.category === 'critical';
      const compact = settings.mode === 'compact';
      const low = !['critical','major'].includes(candidate.category);
      const turn = candidate.playerId + ':' + candidate.turnKey;
      if (!critical) {
        const reason = voice ? 'busy' : now()-lastVoiceEnd < (compact ? 4000 : 1500) ? 'global-cooldown' : now()-(lastSpeaker.get(candidate.playerId) ?? -Infinity) < (compact ? 10000 : 4000) ? 'speaker-cooldown' : low && lowTurn.has(turn) ? 'turn-limit' : '';
        if (reason) {record('voice-drop',{reason,cueId:candidate.cueId}); return;}
        if (compact && low && (!candidate.local || random() >= (candidate.category === 'ordinary' ? .15 : .25))) {record('voice-drop',{reason:'compact-filter',cueId:candidate.cueId}); return;}
      } else if (voice && voice.priority >= candidate.priority) {record('voice-drop',{reason:'critical-busy',cueId:candidate.cueId}); return;}
      if (voice) stopVoice('critical-interrupt');
      const cueId = candidate.variants ? candidate.variants[Math.floor(random()*candidate.variants.length)] : candidate.cueId;
      const cue = catalog.cues[cueId];
      const mine = ++token, offeredAt = now();
      voice = {...candidate, cueId, token:mine, node:null};
      try {
        const data = await buffer(cue.file);
        if (mine !== token) return;
        if (!active || !visible() || !settings.voice || settings.mode === 'off' || now()-offeredAt > (critical ? 3500 : 1500)) {stopVoice('stale'); return;}
        const node = context.createBufferSource(); node.buffer = data; node.connect(voiceGain);
        voice.node = node;
        node.onended = () => {if (voice?.token === mine) {voice = null; lastVoiceEnd = now(); record('voice-end',{cueId}); mix();}};
        lastSpeaker.set(candidate.playerId,now());
        if (low) lowTurn.add(turn);
        if (lowTurn.size > 96) lowTurn.delete(lowTurn.values().next().value);
        mix(); node.start(); record('voice-start',{cueId,playerId:candidate.playerId,priority:candidate.priority,volume:settings.voice});
      } catch (_) {if (mine === token) {record('voice-error',{cueId}); stopVoice('load-error');}}
    }
    function syncSnapshot(snapshot) {
      const state = snapshot.state;
      if (!state?.players) return;
      const nextActive = !snapshot.lobbyOpen && !snapshot.setupPaused && state.phase !== 'gameOver' && !state.winnerId && !state.winnerTeamId;
      const changed = matchId !== snapshot.matchId;
      if (changed) {stopVoice('match-change'); stopMusic(); lastSpeaker.clear(); lowTurn.clear(); lastVoiceEnd = -Infinity;}
      active = nextActive; mix();
      if (!active || !visible()) {stopVoice('inactive'); stopMusic();}
      else startMusic();
      const count = state.log?.length || 0;
      if (!changed && logCount !== null && count > logCount && active) {
        // Consume first, including while hidden or muted. Never queue old lines.
        const events = state.log.slice(0, count-logCount).reverse();
        offer(collectCandidates(state,previous,events,catalog || {cues:{},cardNames:{}},snapshot.localPlayerId));
      }
      matchId = snapshot.matchId; logCount = count; previous = state;
    }
    function setVolume(channel,value) {
      if (!['voice','effects','music'].includes(channel)) return;
      settings[channel] = finiteVolume(value,settings[channel]); persist();
      record('volume',{channel,value:settings[channel]});
      if (channel === 'voice' && !settings.voice) stopVoice('muted');
      if (channel === 'music' && !settings.music) stopMusic();
      mix(); if (channel === 'music') startMusic();
    }
    function setMode(mode) {if (!['compact','full','off'].includes(mode)) return; settings.mode=mode; persist(); if (mode==='off') stopVoice('disabled'); mix();}
    function visibilityChanged() {if (!visible()) {stopVoice('hidden'); stopMusic();} mix(); if (visible()) startMusic();}
    function settingsMarkup() {
      const labels = {voice:'角色语音',effects:'战斗音效',music:'背景音乐'};
      return '<section class="zodiac-audio-settings" aria-label="声音设置"><label class="zodiac-audio-mode">语音模式<select aria-label="语音模式" onchange="ZodiacAudio.setMode(this.value)">' +
        [['compact','精简（推荐）'],['full','完整'],['off','关闭语音']].map(([id,name])=>'<option value="'+id+'" '+(settings.mode===id?'selected':'')+'>'+name+'</option>').join('')+'</select></label>'+
        Object.entries(labels).map(([channel,label])=>'<label class="zodiac-audio-volume"><span>'+label+'</span><input type="range" min="0" max="100" step="1" value="'+settings[channel]+'" aria-label="'+label+'音量" oninput="ZodiacAudio.setVolume(\''+channel+'\',this.value);this.nextElementSibling.value=this.value+\'%\'"><output>'+settings[channel]+'%</output></label>').join('')+
        '<small>精简语音优先技能、濒死和急救。十二角色均使用各自中文声线。</small></section>';
    }
    return {ready, unlock, syncSnapshot, setVolume, setMode, settingsMarkup, visibilityChanged,
      context:()=>context?.state==='running' && active && visible() ? context : null,
      effectsOutput:kind=>{if(kind && active && visible() && settings.effects) record('effect',{kind,volume:settings.effects,voiceActive:Boolean(voice)});return effectsGain;},
      diagnostics:()=>({settings:{...settings},active,voice:voice ? {cueId:voice.cueId,playerId:voice.playerId,loading:!voice.node} : null,musicPlaying:Boolean(music),cachedBuffers:buffers.size,contextState:context?.state || 'locked',gains:{voice:voiceGain?.gain.value,effects:effectsGain?.gain.value,music:musicGain?.gain.value},targetGains:{voice:active && visible() && settings.mode!=='off'?settings.voice/100:0,effects:active&&visible()?settings.effects/100*(voice ? .7 : 1):0,music:active&&visible()?settings.music/100*(voice ? .25 : 1):0},trace:[...trace]}),
      destroy:()=>{active=false;stopVoice('destroy');stopMusic();context?.close();}};
  }
  global.ZodiacAudioCore = {createAudioController,collectCandidates,DEFAULTS};
  if (global.document) {
    // DOM-readable status for local playback verification; no visible debug UI.
    const status = global.document.createElement('script');
    status.type = 'application/json'; status.id = 'zodiac-audio-diagnostics';
    global.document.body.appendChild(status);
    let runtime;
    const report = () => {if (!runtime) return; const value = JSON.stringify(runtime.diagnostics()); if (status.textContent !== value) status.textContent = value;};
    runtime = global.ZodiacAudio = createAudioController({onChange:report});
    report();
    const gesture = () => runtime.unlock();
    global.document.addEventListener('pointerdown',gesture,{capture:true,passive:true});
    global.document.addEventListener('keydown',gesture,{capture:true});
    global.document.addEventListener('visibilitychange',()=>runtime.visibilityChanged());
    global.addEventListener('pagehide',()=>runtime.destroy());
  }
})(globalThis);
