import {ART_SIZE, FULLBODY_SIZE, ANCHORS, SCALES_LAYER, EYELID_LAYERS, LEO_SIGIL_LAYER, LEO_PENDANT_LAYER, ZODIAC_SIGNS, DIAL_SLOT_CENTERS, DIAL_SYMBOL_RATIO, blinkFrames, scaleAngle, fitGuardians, mapHitArea} from './portal-motion-model.mjs?v=web-9f5a6f776579d6db';
import {DIAL_PERIOD_MS, dialSpeedStep} from './portal-motion-model.mjs?v=web-9f5a6f776579d6db';

const root = document.getElementById('portalEntry');
if (root) attach(root);
function attach(root) {
  const image = root.querySelector('.portal-guardians');
  image.src='/zodiac-war-playtest/assets/lobby-entry/guardians-whole-leo-v5-upper.webp';
  const fullbody=document.createElement('img');fullbody.className='portal-guardians-fullbody';fullbody.src='/zodiac-war-playtest/assets/lobby-entry/guardians-whole-leo-v5.webp';fullbody.alt='';fullbody.setAttribute('aria-hidden','true');image.after(fullbody);
  const pendant=document.createElement('img');pendant.id='portalLeoPendant';pendant.className='portal-leo-pendant';pendant.src='/zodiac-war-playtest/assets/lobby-entry/leo-pendant.webp';pendant.alt='';pendant.setAttribute('aria-hidden','true');root.append(pendant);
  const pendantButton=document.createElement('button');pendantButton.type='button';pendantButton.className='portal-art-hotspot portal-art-pendant';pendantButton.id='portalPendantButton';pendantButton.append(document.createElement('span'));root.append(pendantButton);
  const orbit=root.querySelector('.portal-orbit');
  const dial=orbit.querySelector('.portal-astrolabe');dial.src='/zodiac-war-playtest/assets/lobby-entry/astrolabe-astronomy.webp';
  const assembly=document.createElement('div');assembly.className='portal-astrolabe-assembly';orbit.append(assembly);assembly.append(dial);
  const core=document.createElement('img');core.className='portal-armillary-core';core.src='/zodiac-war-playtest/assets/lobby-entry/armillary-core.webp';core.alt='';core.setAttribute('aria-hidden','true');orbit.append(core);
  const needle=document.createElement('img');needle.className='portal-dial-needle';needle.src='/zodiac-war-playtest/assets/lobby-entry/compass-needle.png';needle.alt='';needle.setAttribute('aria-hidden','true');orbit.append(needle);
  const glyphs=document.createElement('div');glyphs.className='portal-zodiac-glyphs';glyphs.setAttribute('aria-hidden','true');assembly.append(glyphs);
  for(const [index,[id,glyph]]of ZODIAC_SIGNS.entries()){
    const sign=document.createElement('span');sign.dataset.zodiac=id;sign.textContent=glyph+'\uFE0E';
    const [x,y]=DIAL_SLOT_CENTERS[index];
    sign.style.left=(100*x/1254)+'%';sign.style.top=(100*y/1254)+'%';glyphs.append(sign);
  }
  const scales = document.createElement('img');
  scales.id = 'portalScalesLayer';
  scales.className = 'portal-scales-layer';
  scales.src = '/zodiac-war-playtest/assets/lobby-entry/scales-isolated.webp';
  scales.alt = ''; scales.setAttribute('aria-hidden','true');
  image.after(scales);
  const eyelids = new Map(), blinkAnimations = new Map(), blinkTimers = new Map();
  for(const role of ['leo','libra']){
    const lid=document.createElement('img');lid.className='portal-eyelid-layer';lid.id='portalEyelid-'+role;
    lid.src='/zodiac-war-playtest/assets/lobby-entry/'+role+'-eyelid.png';lid.alt='';lid.setAttribute('aria-hidden','true');
    root.append(lid);eyelids.set(role,lid);
  }
  const sigil=document.createElement('div');sigil.id='portalLeoSigil';sigil.className='portal-leo-highlight';
  sigil.setAttribute('aria-hidden','true');
  const shoulder=document.createElement('img');shoulder.src=image.getAttribute('src');shoulder.alt='';sigil.append(shoulder);root.append(sigil);
  const sigilButton=document.createElement('button');sigilButton.type='button';sigilButton.className='portal-art-hotspot portal-art-sigil';sigilButton.id='portalLeoSigilButton';
  sigilButton.append(document.createElement('span'));root.append(sigilButton);
  const report = document.createElement('output');
  report.id = 'portalMotionStatus'; report.hidden = true; root.append(report);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const dialSpin=assembly.animate([{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}],{duration:DIAL_PERIOD_MS,iterations:Infinity,easing:'linear'});
  dialSpin.pause();
  const dialButton=document.createElement('button');dialButton.type='button';dialButton.className='portal-dial-button';orbit.append(dialButton);
  let dialFrame=0,dialLast=0,dialBoostUntil=0;
  function settleDial(now){
    const dt=Math.min((now-dialLast)/1000,.1);dialLast=now;
    const target=now<dialBoostUntil?8:1;
    const rate=dialSpeedStep(dialSpin.playbackRate,target,dt);
    dialSpin.updatePlaybackRate(rate);
    if(target===1&&Math.abs(rate-1)<.002){dialSpin.updatePlaybackRate(1);dialFrame=0;return;}
    dialFrame=requestAnimationFrame(settleDial);
  }
  dialButton.addEventListener('click',()=>{
    if(!ready||root.hidden||document.hidden||reduced.matches)return;
    dialBoostUntil=performance.now()+1500;
    if(!dialFrame){dialLast=performance.now();dialFrame=requestAnimationFrame(settleDial);}
  });
  let direction = 1, pendantDirection=1, scaleAnimation = null, pendantAnimation=null, sigilAnimation = null, ready = false;
  const hotspots = new Map();
  const copy = {
    'zh-CN': ['触碰天秤','狮子座','天秤座','关闭','试着触碰天秤，或两侧的守护者','天秤回应了你的触碰'],
    'zh-TW': ['觸碰天秤','獅子座','天秤座','關閉','試著觸碰天秤，或兩側的守護者','天秤回應了你的觸碰'],
    en: ['Touch the scales','Leo','Libra','Close','Touch the scales, or either guardian.','The scales answer your touch.'],
    ja: ['天秤に触れる','獅子座','天秤座','閉じる','天秤や守護者に触れてみよう','天秤があなたに応えた'],
    fr: ['Toucher la balance','Lion','Balance','Fermer','Touchez la balance ou un gardien.','La balance répond à votre geste.'],
    ru: ['Коснуться весов','Лев','Весы','Закрыть','Коснитесь весов или одного из стражей.','Весы отвечают на касание.'],
    es: ['Tocar la balanza','Leo','Libra','Cerrar','Toca la balanza o a un guardián.','La balanza responde a tu toque.']
  };
  const words = () => copy[window.GameI18n?.language] || copy['zh-CN'];
  const t = value => window.GameI18n?.t(value) || value;
  const lionCopy={
    'zh-CN':['触碰狮徽','狮徽亮起'], 'zh-TW':['觸碰獅徽','獅徽亮起'],
    en:['Touch the lion crest','The lion crest glows.'],ja:['獅子の威を呼び覚ます','獅子の威があなたに応えた'],
    fr:['Éveiller le Lion','Le Lion répond à votre geste.'],ru:['Пробудить мощь Льва','Лев отвечает на касание.'],es:['Despertar al León','El León responde a tu toque.']
  };
  const lionWords=()=>lionCopy[window.GameI18n?.language]||lionCopy['zh-CN'];
  const note = document.createElement('p'); note.className = 'portal-feedback'; note.setAttribute('role','status');
  root.append(note);
  for (const key of ['leo','libra','scales']) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'portal-art-hotspot portal-art-' + key;
    button.dataset.guardian = key;
    const label = document.createElement('span'); button.append(label);
    button.addEventListener('click', () => {
      if (key === 'scales') { swing(); note.textContent = words()[5]; }
      else {
        if(key==='leo')reactLeo();else {blink('libra');swing();}
      }
    });
    root.append(button); hotspots.set(key, button);
  }
  function localize() {
    dialButton.setAttribute('aria-label',window.GameI18n?.language==='zh-CN'?'拨动星盘':window.GameI18n?.language==='zh-TW'?'撥動星盤':'Spin the astrolabe');
    const w = words();
    for (const [key, index] of [['scales',0],['leo',1],['libra',2]]) {
      const button = hotspots.get(key); button.setAttribute('aria-label',w[index]); button.querySelector('span').textContent = w[index];
    }
    note.textContent = '';
    sigilButton.setAttribute('aria-label',lionWords()[0]);sigilButton.querySelector('span').textContent=lionWords()[0];
    const pendantNames={'zh-CN':'拨动挂坠','zh-TW':'撥動掛墜',en:'Swing the pendant',ja:'ペンダントに触れる',fr:'Toucher le pendentif',ru:'Коснуться подвески',es:'Tocar el colgante'};
    const name=pendantNames[window.GameI18n?.language]||pendantNames['zh-CN'];pendantButton.setAttribute('aria-label',name);pendantButton.querySelector('span').textContent=name;
  }
  function layout() {
    glyphs.style.fontSize=assembly.clientWidth*DIAL_SYMBOL_RATIO+'px';
    const b=image.getBoundingClientRect(), r=root.getBoundingClientRect();
    if(!b.width || !b.height)return;
    const fit=fitGuardians({x:b.left-r.left,y:b.top-r.top,width:b.width,height:b.height},getComputedStyle(image).objectFit);
    for(const [key,button] of hotspots){
      for(const [name,value] of Object.entries(mapHitArea(ANCHORS[key],fit)))button.style[name]=value+'px';
    }
    for(const [name,value] of Object.entries(mapHitArea(SCALES_LAYER,fit)))scales.style[name]=value+'px';
    fullbody.style.left=fit.x+'px';fullbody.style.top=fit.y+'px';fullbody.style.width=FULLBODY_SIZE[0]*fit.scale+'px';fullbody.style.height=FULLBODY_SIZE[1]*fit.scale+'px';
    for(const node of [pendant,pendantButton])for(const [name,value]of Object.entries(mapHitArea(LEO_PENDANT_LAYER,fit)))node.style[name]=value+'px';
    for(const [role,lid]of eyelids)for(const [name,value]of Object.entries(mapHitArea(EYELID_LAYERS[role],fit)))lid.style[name]=value+'px';
    for(const node of [sigil,sigilButton])for(const [name,value]of Object.entries(mapHitArea(LEO_SIGIL_LAYER,fit)))node.style[name]=value+'px';
    shoulder.style.width=ART_SIZE[0]*fit.scale+'px';shoulder.style.height=ART_SIZE[1]*fit.scale+'px';
    shoulder.style.left=-(LEO_SIGIL_LAYER[0]-LEO_SIGIL_LAYER[2])*fit.scale+'px';
    shoulder.style.top=-(LEO_SIGIL_LAYER[1]-LEO_SIGIL_LAYER[3])*fit.scale+'px';
  }
  function publish(){
    report.textContent=JSON.stringify({ready,layered:true,deformation:false,animatedElements:['portalScalesLayer','portalLeoPendant','portalLeoSigil','portalEyelid-leo','portalEyelid-libra'],paused:root.hidden||document.hidden||reduced.matches,running:scaleAnimation?.playState==='running',pendantRunning:pendantAnimation?.playState==='running',leoReaction:sigilAnimation?.playState==='running'});
  }
  function stopScale(){scaleAnimation?.cancel();scaleAnimation=null;}
  function stop(){
    dialSpin.pause();cancelAnimationFrame(dialFrame);dialFrame=0;dialBoostUntil=0;dialSpin.updatePlaybackRate(1);
    stopScale();pendantAnimation?.cancel();pendantAnimation=null;sigilAnimation?.cancel();sigilAnimation=null;
    for(const timer of blinkTimers.values())clearTimeout(timer);blinkTimers.clear();
    for(const animation of blinkAnimations.values())animation.cancel();blinkAnimations.clear();publish();
  }
  function blink(role){
    if(!ready||root.hidden||document.hidden||reduced.matches)return;
    blinkAnimations.get(role)?.cancel();
    const animation=eyelids.get(role).animate(blinkFrames(),{duration:240,easing:'linear',fill:'none'});
    blinkAnimations.set(role,animation);
  }
  function scheduleBlink(role,delay){
    clearTimeout(blinkTimers.get(role));
    if(!ready||root.hidden||document.hidden||reduced.matches)return;
    blinkTimers.set(role,setTimeout(()=>{blink(role);scheduleBlink(role,4100+Math.random()*2300);},delay));
  }
  function resume(){if(ready&&!root.hidden&&!document.hidden&&!reduced.matches){dialSpin.play();scheduleBlink('leo',1400);scheduleBlink('libra',3100);}publish();}
  function reactLeo(){
    blink('leo');swingPendant();note.textContent=lionWords()[1];sigilAnimation?.cancel();
    if(reduced.matches)return;
    sigilAnimation=sigil.animate([{opacity:0,offset:0},{opacity:1,offset:.28},{opacity:.65,offset:.55},{opacity:0,offset:1}],{duration:720,easing:'ease-in-out',fill:'none'});
    sigilAnimation.addEventListener('finish',publish,{once:true});publish();
  }
  sigilButton.addEventListener('click',reactLeo);
  function swingPendant(){
    pendantAnimation?.cancel();pendantDirection*=-1;
    if(reduced.matches)return;
    const frames=Array.from({length:61},(_,i)=>({offset:i/60,transform:'rotate('+(i===60?0:scaleAngle(i*.05,pendantDirection)*180/Math.PI)+'deg)'}));
    pendantAnimation=pendant.animate(frames,{duration:3000,easing:'linear',fill:'none'});
    pendantAnimation.addEventListener('finish',publish,{once:true});publish();
  }
  pendantButton.addEventListener('click',()=>{swingPendant();blink('leo');});
  function swing(){
    stopScale();direction*=-1;
    if(reduced.matches){publish();return;}
    const frames=Array.from({length:61},(_,i)=>({offset:i/60,transform:'rotate('+(i===60?0:scaleAngle(i*.05,direction)*180/Math.PI)+'deg)'}));
    scaleAnimation=scales.animate(frames,{duration:3000,easing:'linear',fill:'none'});
    scaleAnimation.addEventListener('finish',publish,{once:true});publish();
  }
  localize();
  window.addEventListener('game-language-change',localize);
  new ResizeObserver(layout).observe(image);
  new MutationObserver(()=>{layout();if(root.hidden)stop();else resume();}).observe(root,{attributes:true,attributeFilter:['hidden']});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else resume();});
  reduced.addEventListener('change',()=>{stop();resume();});
  Promise.all([image.decode(),fullbody.decode(),scales.decode(),pendant.decode(),dial.decode(),core.decode(),shoulder.decode(),...[...eyelids.values()].map(lid=>lid.decode())]).then(()=>{
    ready=image.naturalWidth===ART_SIZE[0]&&image.naturalHeight===ART_SIZE[1]&&fullbody.naturalWidth===FULLBODY_SIZE[0]&&fullbody.naturalHeight===FULLBODY_SIZE[1];image.style.visibility='hidden';layout();resume();
  }).catch(()=>{fullbody.hidden=true;image.style.visibility='';publish();});
}
