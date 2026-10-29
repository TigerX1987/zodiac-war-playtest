import {request, snapshot, restoreSnapshot} from './game.mjs?v=web-a4a46edaa6755e2f';
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
script.src = '/zodiac-war-playtest/runtime/client.js?v=web-a4a46edaa6755e2f';
script.onerror = () => {document.getElementById('web-load-status').textContent = '载入失败，请刷新重试。';};
script.onload = () => {document.getElementById('web-load-status')?.remove();};
document.body.appendChild(script);
