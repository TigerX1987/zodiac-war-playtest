import {request, snapshot, restoreSnapshot} from './game.mjs?v=web-2f8ee550364ff823';
const storageKey = 'zodiac-playtest-session-v1';
try {restoreSnapshot(JSON.parse(sessionStorage.getItem(storageKey)));} catch (_) {}
const networkFetch = window.fetch.bind(window);
window.fetch = async (input, options = {}) => {
  const url = new URL(typeof input === 'string' ? input : input.url, location.href);
  if (url.origin !== location.origin || !url.pathname.startsWith('/api/')) return networkFetch(input, options);
  const response = await request(url.pathname + url.search, options);
  try {sessionStorage.setItem(storageKey, JSON.stringify(snapshot()));} catch (_) {}
  return response;
};
const script = document.createElement('script');
script.src = '/zodiac-war-playtest/runtime/client.js?v=web-2f8ee550364ff823';
script.onerror = () => {document.getElementById('web-load-status').textContent = '载入失败，请刷新重试。';};
script.onload = () => {
  const extension = document.createElement('script');
  extension.src = '/zodiac-war-playtest/assets/ui/rogue-mode.js?v=web-2f8ee550364ff823';
  extension.onerror = script.onerror;
  extension.onload = () => {
    syncStartControls();
    render();
    document.getElementById('web-load-status')?.remove();
  };
  document.body.appendChild(extension);
};
document.body.appendChild(script);
