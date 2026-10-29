/* A separate entry scene. Opening the lobby does not start or reset a match. */
(() => {
  const main = document.querySelector('body > main');
  if (!main || document.getElementById('portalEntry')) return;
  const scene = document.createElement('section');
  scene.id = 'portalEntry';
  scene.dataset.i18nSkip = '';
  scene.setAttribute('aria-labelledby', 'portalTitle');
  scene.innerHTML = `
    <img class="portal-environment" src="/zodiac-war-playtest/assets/lobby-entry/portal-environment.webp" alt="" fetchpriority="high">
    <img class="portal-guardians" src="/zodiac-war-playtest/assets/lobby-entry/guardians-no-scales.webp" alt="" aria-hidden="true">
    <div class="portal-orbit"><img class="portal-astrolabe" src="/zodiac-war-playtest/assets/lobby-entry/astrolabe-astronomy.webp" alt="" aria-hidden="true"></div>
    <header class="portal-brand"><p class="portal-eyebrow" hidden>ZODIAC · ELEMENTAL WAR</p><h1 id="portalTitle"></h1><p id="portalSubtitle"></p><p class="portal-tagline" id="portalTagline" hidden></p></header>
    <nav class="portal-utilities" aria-label="入口设置"><button id="portalLanguage" type="button" aria-expanded="false" aria-controls="portalLanguagePanel"></button><button id="portalSound" type="button" aria-haspopup="dialog"></button></nav>
    <div id="portalLanguagePanel" hidden><label for="portal-language-select" id="portalLanguageLabel"></label><div id="portalLanguageSelect"></div></div>
    <div class="portal-actions"><div class="portal-elements" role="group" id="portalElements"></div><p id="portalElementStatus" class="portal-sr-only" aria-live="polite"></p>
      <form id="portalLoginForm" novalidate>
        <div class="portal-login-field"><label id="portalAccountLabel" for="portalAccount"></label><input id="portalAccount" name="username" type="text" autocomplete="username" maxlength="80" spellcheck="false" autocapitalize="none" aria-describedby="portalLoginMessage"></div>
        <div class="portal-login-field"><label id="portalPasswordLabel" for="portalPassword"></label><input id="portalPassword" name="password" type="password" autocomplete="off" maxlength="128" aria-describedby="portalLoginMessage"><button id="portalPasswordToggle" type="button" aria-pressed="false"></button></div>
        <p class="portal-demo-note" id="portalDemoNote"></p><p id="portalLoginMessage" role="alert" hidden></p>
        <button class="portal-enter" id="portalEnter" type="submit"></button>
      </form><p class="portal-footnote" id="portalFootnote" hidden></p></div>
    <dialog id="portalSoundDialog" aria-labelledby="portalSoundTitle"><div class="portal-dialog-heading"><h2 id="portalSoundTitle"></h2><button id="portalSoundClose" type="button"></button></div><div id="portalSoundControls"></div></dialog>`;
  document.body.append(scene);
  main.inert = true;
  main.setAttribute('aria-hidden', 'true');
  const $ = id => scene.querySelector('#' + id);
  const text = value => window.GameI18n?.t(value) || value;
  const copy = {
    'zh-CN': ['语言', '声音设置', '进入游戏', '十二星辰 · 四象交锋', '进入星门，开启你的星座之旅', ['火', '水', '风', '土'], '关闭', '返回星门', '四象共鸣'],
    'zh-TW': ['語言', '聲音設定', '進入遊戲', '十二星辰 · 四象交鋒', '進入星門，開啟你的星座之旅', ['火', '水', '風', '土'], '關閉', '返回星門', '四象共鳴'],
    en: ['Language', 'Sound Settings', 'Enter Game', 'Twelve signs. Four elements. One destiny.', 'Step through the gate. Begin your zodiac journey.', ['Fire', 'Water', 'Air', 'Earth'], 'Close', 'Return to Gate', 'Elemental resonance'],
    ja: ['言語', 'サウンド設定', 'ゲーム開始', '十二の星座 · 四元素の戦い', '星の門をくぐり、旅を始めよう', ['火', '水', '風', '土'], '閉じる', '星の門へ', '四元素の共鳴'],
    fr: ['Langue', 'Réglages audio', 'Jouer', 'Douze signes. Quatre éléments. Un destin.', 'Franchissez la porte des étoiles.', ['Feu', 'Eau', 'Air', 'Terre'], 'Fermer', 'Retour au portail', 'Résonance élémentaire'],
    ru: ['Язык', 'Настройки звука', 'Войти в игру', 'Двенадцать знаков. Четыре стихии.', 'Шагните во врата звёзд.', ['Огонь', 'Вода', 'Воздух', 'Земля'], 'Закрыть', 'К звёздным вратам', 'Резонанс стихий'],
    es: ['Idioma', 'Ajustes de sonido', 'Jugar', 'Doce signos. Cuatro elementos. Un destino.', 'Cruza el portal de las estrellas.', ['Fuego', 'Agua', 'Aire', 'Tierra'], 'Cerrar', 'Volver al portal', 'Resonancia elemental']
  };
  const keys = ['fire', 'water', 'air', 'earth'];
  const loginCopy = {
    'zh-CN':['账号','密码','输入演示账号','输入演示密码','显示','隐藏','试玩入口 · 暂无需账号验证','请输入账号','请输入密码','登录并进入'],
    'zh-TW':['帳號','密碼','輸入示範帳號','輸入示範密碼','顯示','隱藏','試玩入口 · 暫無需帳號驗證','請輸入帳號','請輸入密碼','登入並進入'],
    en:['Account','Password','Demo account','Demo password','Show','Hide','Playtest · No account verification required','Enter an account','Enter a password','Sign in & enter'],
    ja:['アカウント','パスワード','デモアカウント','デモパスワード','表示','隠す','体験版 · アカウント認証は不要です','アカウントを入力してください','パスワードを入力してください','ログイン'],
    fr:['Compte','Mot de passe','Compte de démonstration','Mot de passe de démonstration','Voir','Masquer','Démo · Aucun compte requis','Saisissez un compte','Saisissez un mot de passe','Se connecter'],
    ru:['Аккаунт','Пароль','Демоаккаунт','Демопароль','Показать','Скрыть','Демо · Проверка аккаунта не требуется','Введите аккаунт','Введите пароль','Войти'],
    es:['Cuenta','Contraseña','Cuenta de prueba','Contraseña de prueba','Ver','Ocultar','Demo · No se requiere verificación','Introduce una cuenta','Introduce una contraseña','Iniciar sesión']
  };
  const loginWords=()=>loginCopy[window.GameI18n?.language]||loginCopy['zh-CN'];
  let loginError='';
  function showLoginError(field){
    loginError=field;
    $('portalAccount').setAttribute('aria-invalid',String(field==='account'));
    $('portalPassword').setAttribute('aria-invalid',String(field==='password'));
    $('portalLoginMessage').hidden=!field;
    $('portalLoginMessage').textContent=field?loginWords()[field==='account'?7:8]:'';
  }
  for(const id of ['portalAccount','portalPassword'])$(id).addEventListener('input',()=>showLoginError(''));
  $('portalPasswordToggle').addEventListener('click',()=>{
    const visible=$('portalPassword').type==='password';
    $('portalPassword').type=visible?'text':'password';
    $('portalPasswordToggle').setAttribute('aria-pressed',String(visible));
    $('portalPasswordToggle').textContent=loginWords()[visible?5:4];
  });
  let selected = 'fire', entering = false;
  const words = () => copy[window.GameI18n?.language] || copy['zh-CN'];
  function preview(element) {
    scene.dataset.element = element;
    $('portalElementStatus').textContent = words()[5][keys.indexOf(element)] + ' · ' + words()[8];
  }
  keys.forEach((element, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.element = element;
    button.innerHTML = '<img src="/zodiac-war-playtest/assets/cards-v10/' + element + '-energy.webp" alt=""><span></span>';
    button.addEventListener('pointerenter', () => preview(element));
    button.addEventListener('pointerleave', () => preview(selected));
    button.addEventListener('focus', () => preview(element));
    button.addEventListener('blur', () => preview(selected));
    button.addEventListener('click', () => { selected = element; localize(); });
    $('portalElements').append(button);
  });
  $('portalLanguageSelect').innerHTML = window.GameI18n?.selector('portal-language-select') || '';
  $('portalLanguage').addEventListener('click', () => {
    const open = $('portalLanguagePanel').hidden;
    $('portalLanguagePanel').hidden = !open;
    $('portalLanguage').setAttribute('aria-expanded', String(open));
    if (open) scene.querySelector('select')?.focus();
  });
  scene.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !$('portalLanguagePanel').hidden) {
      $('portalLanguagePanel').hidden = true;
      $('portalLanguage').setAttribute('aria-expanded', 'false');
      $('portalLanguage').focus();
    }
  });
  const sound = $('portalSoundDialog');
  $('portalSound').addEventListener('click', () => {
    $('portalSoundControls').innerHTML = window.ZodiacAudio?.settingsMarkup() || '';
    window.GameI18n?.localize($('portalSoundControls'));
    sound.showModal();
  });
  const closeSound = () => { sound.close(); $('portalSoundControls').replaceChildren(); $('portalSound').focus(); };
  $('portalSoundClose').addEventListener('click', closeSound);
  sound.addEventListener('cancel', event => { event.preventDefault(); closeSound(); });
  $('portalLoginForm').addEventListener('submit', event => {
    event.preventDefault();
    if (entering) return;
    showLoginError('');
    // Demonstration only: no network request or credential persistence.
    $('portalPassword').value='';$('portalPassword').type='password';
    $('portalPasswordToggle').setAttribute('aria-pressed','false');
    $('portalPasswordToggle').textContent=loginWords()[4];
    entering = true;
    $('portalEnter').disabled = true;
    scene.classList.add('portal-departing');
    $('portalLanguagePanel').hidden = true;
    setTimeout(() => {
      scene.hidden = true;
      main.inert = false;
      main.removeAttribute('aria-hidden');
      document.getElementById('lobbyStartGame')?.focus();
      entering = false;
      $('portalEnter').disabled = false;
      scene.classList.remove('portal-departing');
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650);
  });
  const back = document.createElement('button');
  back.type = 'button';
  back.id = 'portalReturn';
  back.className = 'outline-button';
  back.dataset.i18nSkip = '';
  back.addEventListener('click', () => { window.ZodiacLobby?.closeSettings(false); main.inert = true; main.setAttribute('aria-hidden', 'true'); scene.hidden = false; $('portalEnter').focus(); });
  document.querySelector('#lobbySettingsDialog .dialog-footer')?.prepend(back);
  function localize() {
    const w = words();
    scene.lang = window.GameI18n?.language || 'zh-CN';
    $('portalTitle').textContent = text('十二星座');
    $('portalSubtitle').textContent = text('四象战争');
    $('portalTagline').textContent = w[3];
    $('portalLanguage').textContent = w[0] === 'Language' ? w[0] : w[0] + ' / Language';
    scene.querySelector('.portal-utilities').setAttribute('aria-label', w[0] + ' · ' + w[1]);
    $('portalLanguageLabel').textContent = w[0];
    $('portalSound').textContent = w[1];
    $('portalSoundTitle').textContent = w[1];
    $('portalSoundClose').textContent = w[6];
    const l=loginWords();
    $('portalAccountLabel').textContent=l[0];$('portalPasswordLabel').textContent=l[1];
    $('portalAccount').placeholder=l[2];$('portalPassword').placeholder=l[3];
    $('portalPasswordToggle').textContent=l[$('portalPassword').type==='text'?5:4];
    $('portalDemoNote').textContent=l[6];
    $('portalEnter').textContent = l[9];
    showLoginError(loginError);
    $('portalFootnote').textContent = w[4];
    back.textContent = w[7];
    $('portalElements').setAttribute('aria-label', w[8]);
    [...$('portalElements').children].forEach((button, index) => {
      button.querySelector('span').textContent = w[5][index];
      button.setAttribute('aria-label', w[5][index] + ' · ' + w[8]);
      button.setAttribute('aria-pressed', String(keys[index] === selected));
    });
    preview(selected);
  }
  window.addEventListener('game-language-change', localize);
  localize();
  // Figma capture is loaded only for an explicitly requested capture URL.
  if (location.hash.includes('figmacapture=')) {
    const capture = document.createElement('script');
    capture.src = 'https://mcp.figma.com/mcp/html-to-design/capture.js';
    capture.async = true;
    document.head.append(capture);
  }
})();
