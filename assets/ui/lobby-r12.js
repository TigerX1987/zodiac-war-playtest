/* Approved lobby presentation uses the standalone client's existing configuration and APIs. */
window.ZodiacLobby = {
  saved: null,
  previousFocus: null,
  text(value) { return window.GameI18n?.t(value) || value; },
  sync() {
    const root = document.getElementById('startScreen');
    if (!root) return;
    const current = currentMode();
    root.dataset.mode = current;
    for (const [id, value] of [['startModeStandard', 'standard'], ['startModeInfection', 'infection'], ['startModeTest', 'test']]) {
      document.getElementById(id)?.setAttribute('aria-pressed', String(current === value));
    }
    document.getElementById('lobbyTitle').textContent = this.text('十二星座');
    document.getElementById('lobbySubtitle').textContent = this.text('四象战争');
    root.querySelector('.brand')?.setAttribute('aria-label', this.text('十二星座·四象战争'));
    const language = document.getElementById('lobby-language-select');
    language?.setAttribute('aria-label', this.text('界面语言'));
    const help = current === 'standard' ? '4/6人 · 队伍对抗' : current === 'infection' ? '4–8人 · 幸存者与感染者' : '4人 · 自定义角色与控制';
    document.getElementById('lobbyModeHelp').textContent = this.text(help);
    const allowed = clientGameModes[current].playerCounts;
    const host = document.getElementById('lobbyCountOptions');
    const selected = modeSeatCount(current);
    // Keep the selected button connected when focus returns or language changes.
    if (host.dataset.mode !== current) {
      host.replaceChildren(...allowed.map(count => {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'count-option'; button.dataset.count = String(count);
        button.appendChild(document.createElement('span'));
        button.addEventListener('click', () => this.setCount(count));
        return button;
      }));
      host.dataset.mode = current;
    }
    const usePeopleSuffix = /^(zh|ja)/.test(window.GameI18n?.language || 'zh-CN');
    for (const button of host.querySelectorAll('button')) {
      const count = Number(button.dataset.count);
      button.setAttribute('aria-pressed', String(selected === count));
      button.setAttribute('aria-label', this.text('人数') + ' ' + count);
      button.firstElementChild.textContent = String(count) + (usePeopleSuffix ? '人' : '');
    }
    document.getElementById('lobbySettingsMode').textContent = this.text(current === 'standard' ? '标准对战' : current === 'infection' ? '月蚀模式' : '自定义练习') + ' · ' + selected;
  },
  setCount(count) {
    if (!clientGameModes[currentMode()].playerCounts.includes(count)) return;
    document.getElementById('playerCount').value = String(count);
    updateSeatControlVisibility();
    this.sync();
  },
  capture() {
    return { ...config, characters: allSeatIds.map(id => document.getElementById('c' + id).value), controls: allSeatIds.map(id => document.getElementById('m' + id).value) };
  },
  readDraft() {
    config = this.capture();
    config.playerCount = modeSeatCount();
  },
  openSettings(nextMode) {
    if (!lobbyOpen || this.saved) return;
    this.previousFocus = document.activeElement;
    this.saved = this.capture();
    if (nextMode === 'test') setMode('test');
    document.getElementById('debugPanel').open = true;
    document.getElementById('lobbySettingsError').textContent = '';
    document.getElementById('lobby-audio-settings').innerHTML = window.ZodiacAudio?.settingsMarkup() || '';
    const dialog = document.getElementById('lobbySettingsDialog');
    dialog.showModal();
    window.GameI18n?.localize(dialog);
  },
  closeSettings(save) {
    if (!this.saved) return;
    if (save) {
      this.readDraft();
      if (!config.controls.slice(0, modeSeatCount()).includes('human')) {
        document.getElementById('lobbySettingsError').textContent = this.text('至少需要保留一个真人座位');
        return;
      }
    } else config = this.saved;
    this.saved = null;
    document.getElementById('lobbySettingsDialog').close();
    document.getElementById('lobby-audio-settings').replaceChildren();
    render();
    this.previousFocus?.focus();
  },
  closeForMatch() {
    const dialog = document.getElementById('lobbySettingsDialog');
    if (dialog?.open) dialog.close();
    document.getElementById('lobby-audio-settings')?.replaceChildren();
    this.saved = null;
  }
};
document.getElementById('lobbySettingsDialog').addEventListener('cancel', event => {
  event.preventDefault(); window.ZodiacLobby.closeSettings(false);
});
document.getElementById('debugPanel').addEventListener('change', event => {
  if (event.target.matches('select')) {
    window.ZodiacLobby.readDraft();
    window.ZodiacLobby.sync();
  }
});
