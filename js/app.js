/**
 * NamePicker Pro - Main Application Controller (app.js)
 * Enhanced with:
 * - Bilingual i18n support (VI / EN)
 * - Advanced Settings Modal with Wheel, Audio, Fonts & Language tabs
 * - Sound previews, palette selector & font selector
 * - Presets, History, and LocalStorage persistence
 */

(function (window, document) {
  'use strict';

  // --- Bilingual Presets Data ---
  const PRESETS = {
    vi: {
      class: [
        'Nguyễn Văn An', 'Trần Thị Bảo', 'Lê Hoàng Cúc', 'Phạm Minh Dũng',
        'Đặng Thanh Em', 'Vũ Quốc Hưng', 'Bùi Ngọc Lan', 'Đỗ Tiến Mạnh',
        'Hồ Thị Nga', 'Ngô Quang Phúc', 'Dương Thúy Quỳnh', 'Lý Gia Tuấn',
        'Võ Hải Yến', 'Trịnh Đức Trọng', 'Mai Diệu Linh'
      ],
      numbers: Array.from({ length: 20 }, (_, i) => `Số ${i + 1}`),
      minigame: [
        '🎁 Voucher 500k', '📱 Tai nghe Bluetooth', '☕ Bình giữ nhiệt',
        '👕 Áo thun phong cách', '🎟️ Vé xem phim', '⭐ Thêm 1 lượt quay',
        '🍀 Chúc may mắn lần sau', '🎒 Balo du lịch'
      ],
      teams: [
        '🚀 Đội Rồng Vàng', '⚡ Đội Tia Chớp', '🔥 Đội Lửa Thiêng', '🌊 Đội Sóng Xanh'
      ]
    },
    en: {
      class: [
        'Alexander Smith', 'Benjamin Johnson', 'Charlotte Williams', 'Daniel Brown',
        'Emma Jones', 'Franklin Garcia', 'Grace Miller', 'Henry Davis',
        'Isabella Rodriguez', 'James Martinez', 'Katherine Hernandez', 'Liam Lopez',
        'Mia Gonzalez', 'Noah Wilson', 'Olivia Anderson'
      ],
      numbers: Array.from({ length: 20 }, (_, i) => `Number ${i + 1}`),
      minigame: [
        '🎁 $50 Gift Card', '📱 Wireless Earbuds', '☕ Thermal Tumbler',
        '👕 Stylish T-Shirt', '🎟️ Movie Ticket', '⭐ +1 Extra Spin',
        '🍀 Better Luck Next Time', '🎒 Travel Backpack'
      ],
      teams: [
        '🚀 Golden Dragons', '⚡ Lightning Bolts', '🔥 Blazing Phoenix', '🌊 Ocean Waves'
      ]
    }
  };

  // --- App State ---
  let state = {
    names: [],
    duration: 5,
    lastWinnerIndex: -1,
    history: [],
    autoOpenModal: true,
    enableConfetti: true,
    hideLeft: false,
    hideRight: false
  };

  // --- DOM References ---
  const DOM = {
    appWorkspace: document.getElementById('appWorkspace'),
    leftPanel: document.getElementById('leftPanel'),
    rightPanel: document.getElementById('rightPanel'),
    toggleListBtn: document.getElementById('toggleListBtn'),
    toggleHistoryBtn: document.getElementById('toggleHistoryBtn'),
    collapseListBtn: document.getElementById('collapseListBtn'),
    collapseHistoryBtn: document.getElementById('collapseHistoryBtn'),
    namesInput: document.getElementById('namesInput'),
    namesCount: document.getElementById('namesCount'),
    durationSlider: document.getElementById('durationSlider'),
    durationDisplay: document.getElementById('durationDisplay'),
    spinBtn: document.getElementById('spinBtn'),
    wheelCanvas: document.getElementById('wheelCanvas'),
    wheelPointer: document.getElementById('wheelPointer'),
    historyList: document.getElementById('historyList'),
    historyEmpty: document.getElementById('historyEmpty'),
    historyCount: document.getElementById('historyCount'),
    winnerModal: document.getElementById('winnerModal'),
    modalWinnerName: document.getElementById('modalWinnerName'),
    settingsModal: document.getElementById('settingsModal'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIcon: document.getElementById('themeIcon'),
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    soundIcon: document.getElementById('soundIcon'),
    settingsBtn: document.getElementById('settingsBtn'),
    langToggleBtn: document.getElementById('langToggleBtn'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    toast: document.getElementById('toast'),
    toastMsg: document.getElementById('toastMsg'),
    toastIcon: document.getElementById('toastIcon')
  };

  // ==========================================================================
  // 1. Toast Notification Helper
  // ==========================================================================
  let toastTimer = null;
  function showToast(message, type = 'success', duration = 2500) {
    if (!DOM.toast) return;
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    if (DOM.toastIcon) DOM.toastIcon.textContent = icons[type] || '🔔';
    if (DOM.toastMsg) DOM.toastMsg.textContent = message;

    DOM.toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      DOM.toast.classList.remove('show');
    }, duration);
  }

  // ==========================================================================
  // 2. Name List & Input Parsing
  // ==========================================================================
  function parseNames() {
    const raw = DOM.namesInput.value;
    const list = raw
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    state.names = list;
    updateCounter();
    WheelEngine.setNames(list);
    saveList();
  }

  function updateCounter() {
    if (DOM.namesCount) {
      const unit = window.i18n ? (window.i18n.getLanguage() === 'vi' ? 'mục' : 'items') : 'mục';
      DOM.namesCount.textContent = `${state.names.length} ${unit}`;
    }
  }

  function setNamesToTextarea(list) {
    state.names = list;
    DOM.namesInput.value = list.join('\n');
    updateCounter();
    WheelEngine.setNames(list);
    saveList();
  }

  function saveList() {
    localStorage.setItem('np_names_list', DOM.namesInput.value);
  }

  function loadList() {
    const saved = localStorage.getItem('np_names_list');
    const lang = window.i18n ? window.i18n.getLanguage() : 'vi';
    if (saved !== null && saved.trim() !== '') {
      DOM.namesInput.value = saved;
    } else {
      DOM.namesInput.value = (PRESETS[lang] || PRESETS.vi).class.join('\n');
    }
    parseNames();
  }

  // ==========================================================================
  // 3. List Manipulation Actions
  // ==========================================================================
  function shuffleList() {
    if (state.names.length < 2) {
      showToast(window.i18n.t('toastNeedTwo'), 'warning');
      return;
    }
    const arr = [...state.names];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setNamesToTextarea(arr);
    showToast(window.i18n.t('toastShuffle'), 'success');
  }

  function sortListAZ() {
    if (state.names.length < 2) return;
    const lang = window.i18n ? window.i18n.getLanguage() : 'vi';
    const arr = [...state.names].sort((a, b) => a.localeCompare(b, lang, { sensitivity: 'base' }));
    setNamesToTextarea(arr);
    showToast(window.i18n.t('toastSort'), 'info');
  }

  function removeDuplicates() {
    const unique = Array.from(new Set(state.names));
    const removedCount = state.names.length - unique.length;
    if (removedCount > 0) {
      setNamesToTextarea(unique);
      showToast(window.i18n.t('toastDedupe', { count: removedCount }), 'success');
    } else {
      showToast(window.i18n.t('toastNoDedupe'), 'info');
    }
  }

  function clearList() {
    if (state.names.length === 0) return;
    setNamesToTextarea([]);
    showToast(window.i18n.t('toastClearList'), 'info');
  }

  function loadPreset(key) {
    const lang = window.i18n ? window.i18n.getLanguage() : 'vi';
    const dict = PRESETS[lang] || PRESETS.vi;
    if (dict[key]) {
      setNamesToTextarea(dict[key]);
      showToast(window.i18n.t('toastPreset'), 'success');
    }
  }

  // ==========================================================================
  // 4. Spin Controller & Winner Resolution
  // ==========================================================================
  function triggerSpin() {
    if (WheelEngine.isBusy()) return;

    if (!state.names || state.names.length === 0) {
      showToast(window.i18n.t('toastEmptyAlert'), 'error');
      DOM.namesInput.focus();
      return;
    }

    DOM.spinBtn.disabled = true;

    WheelEngine.spin(state.duration, (winnerName, winnerIndex) => {
      state.lastWinnerIndex = winnerIndex;
      DOM.spinBtn.disabled = false;

      // Play victory sound, voice announcement & confetti
      if (window.SoundEngine) window.SoundEngine.playWin();
      if (window.TTSEngine && window.TTSEngine.isEnabled()) {
        const lang = window.i18n ? window.i18n.getLanguage() : 'vi';
        window.TTSEngine.speakWinner(winnerName, lang);
      }
      if (state.enableConfetti && window.ConfettiEngine) window.ConfettiEngine.start();

      // Show Winner Modal
      if (state.autoOpenModal) {
        openWinnerModal(winnerName);
      }

      // Add to History
      addToHistory(winnerName);
    });
  }

  // ==========================================================================
  // 5. Winner Modal Actions
  // ==========================================================================
  function openWinnerModal(winnerName) {
    if (DOM.modalWinnerName) DOM.modalWinnerName.textContent = winnerName;
    if (DOM.winnerModal) {
      DOM.winnerModal.classList.remove('hidden');
    }
  }

  function closeWinnerModal() {
    if (DOM.winnerModal) {
      DOM.winnerModal.classList.add('hidden');
    }
    if (window.ConfettiEngine) {
      window.ConfettiEngine.stop();
    }
  }

  function handleRemoveWinner() {
    if (state.lastWinnerIndex >= 0 && state.lastWinnerIndex < state.names.length) {
      const removedName = state.names[state.lastWinnerIndex];
      const updated = [...state.names];
      updated.splice(state.lastWinnerIndex, 1);
      setNamesToTextarea(updated);
      showToast(window.i18n.t('toastRemoveWinner', { name: removedName }), 'info');
    }
    closeWinnerModal();
  }

  function handleKeepWinner() {
    closeWinnerModal();
  }

  // ==========================================================================
  // 6. Settings Modal Controller
  // ==========================================================================
  function openSettingsModal() {
    if (DOM.settingsModal) {
      DOM.settingsModal.classList.remove('hidden');
      syncSettingsUI();
    }
  }

  function closeSettingsModal() {
    if (DOM.settingsModal) {
      DOM.settingsModal.classList.add('hidden');
    }
  }

  function syncSettingsUI() {
    // 1. Duration
    const setDurationSlider = document.getElementById('setDurationSlider');
    const setDurationVal = document.getElementById('setDurationVal');
    if (setDurationSlider && setDurationVal) {
      setDurationSlider.value = state.duration;
      setDurationVal.textContent = `${state.duration}s`;
    }

    // 2. Wheel Palette
    const currentPal = WheelEngine.getPaletteKey();
    document.querySelectorAll('.palette-chip').forEach(chip => {
      if (chip.getAttribute('data-pal') === currentPal) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    // 3. Hub Icon
    const currentHub = WheelEngine.getHubIcon();
    document.querySelectorAll('.icon-btn').forEach(btn => {
      if (btn.getAttribute('data-icon') === currentHub) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 4. Sound Settings
    const soundState = SoundEngine.getState();
    const soundMasterCheck = document.getElementById('soundMasterCheck');
    const soundVolumeSlider = document.getElementById('soundVolumeSlider');
    const soundVolumeVal = document.getElementById('soundVolumeVal');
    const tickStyleSelect = document.getElementById('tickStyleSelect');
    const winStyleSelect = document.getElementById('winStyleSelect');

    if (soundMasterCheck) soundMasterCheck.checked = soundState.enabled;
    if (soundVolumeSlider) soundVolumeSlider.value = soundState.volume;
    if (soundVolumeVal) soundVolumeVal.textContent = `${soundState.volume}%`;
    if (tickStyleSelect) tickStyleSelect.value = soundState.tickStyle;
    if (winStyleSelect) winStyleSelect.value = soundState.winStyle;

    // TTS Voice Settings
    if (window.TTSEngine) {
      const ttsMasterCheck = document.getElementById('ttsMasterCheck');
      const ttsVoiceSelect = document.getElementById('ttsVoiceSelect');
      if (ttsMasterCheck) ttsMasterCheck.checked = TTSEngine.isEnabled();

      if (ttsVoiceSelect) {
        const lang = window.i18n ? window.i18n.getLanguage() : 'vi';
        const voices = TTSEngine.getVoicesForLanguage(lang);
        const currentURI = TTSEngine.getVoiceURI();
        const defaultLabel = lang === 'vi' ? '-- Mặc định Google / Hệ thống --' : '-- Default Google / System --';
        
        ttsVoiceSelect.innerHTML = `<option value="">${defaultLabel}</option>`;
        voices.forEach(v => {
          const opt = document.createElement('option');
          opt.value = v.voiceURI;
          opt.textContent = `${v.name} (${v.lang})`;
          if (v.voiceURI === currentURI) opt.selected = true;
          ttsVoiceSelect.appendChild(opt);
        });
      }
    }

    // 5. Font & Display Settings
    const fontSelect = document.getElementById('wheelFontSelect');
    if (fontSelect) fontSelect.value = WheelEngine.getFont();

    const autoModalCheck = document.getElementById('autoModalCheck');
    if (autoModalCheck) autoModalCheck.checked = state.autoOpenModal;

    const confettiCheck = document.getElementById('confettiCheck');
    if (confettiCheck) confettiCheck.checked = state.enableConfetti;

    // 6. Language Radio
    const currentLang = window.i18n ? window.i18n.getLanguage() : 'vi';
    const langRadio = document.querySelector(`input[name="appLang"][value="${currentLang}"]`);
    if (langRadio) langRadio.checked = true;
  }

  function bindSettingsEvents() {
    // Settings Tabs
    document.querySelectorAll('.settings-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetSection = tab.getAttribute('data-sec');
        document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.settings-section').forEach(s => s.classList.add('hidden'));

        tab.classList.add('active');
        const sec = document.getElementById(`sec_${targetSection}`);
        if (sec) sec.classList.remove('hidden');
      });
    });

    // Settings Duration Slider
    const setDurationSlider = document.getElementById('setDurationSlider');
    const setDurationVal = document.getElementById('setDurationVal');
    if (setDurationSlider) {
      setDurationSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        state.duration = val;
        setDurationVal.textContent = `${val}s`;
        DOM.durationSlider.value = val;
        DOM.durationDisplay.textContent = `${val}s`;
        localStorage.setItem('np_duration', val);
      });
    }

    // Palette Chips
    document.querySelectorAll('.palette-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const pal = chip.getAttribute('data-pal');
        WheelEngine.setPalette(pal);
        document.querySelectorAll('.palette-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    // Hub Icon Pickers
    document.querySelectorAll('.icon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const iconChar = btn.getAttribute('data-icon');
        WheelEngine.setHubIcon(iconChar);
        document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Sound Controls in Settings
    document.getElementById('soundMasterCheck')?.addEventListener('change', (e) => {
      if (SoundEngine.isEnabled() !== e.target.checked) {
        SoundEngine.toggle();
      }
    });

    const soundVolumeSlider = document.getElementById('soundVolumeSlider');
    const soundVolumeVal = document.getElementById('soundVolumeVal');
    if (soundVolumeSlider) {
      soundVolumeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        SoundEngine.setVolume(val);
        if (soundVolumeVal) soundVolumeVal.textContent = `${val}%`;
      });
    }

    document.getElementById('tickStyleSelect')?.addEventListener('change', (e) => {
      SoundEngine.setTickStyle(e.target.value);
      SoundEngine.playTick();
    });

    document.getElementById('winStyleSelect')?.addEventListener('change', (e) => {
      SoundEngine.setWinStyle(e.target.value);
    });

    document.getElementById('testTickBtn')?.addEventListener('click', () => {
      SoundEngine.playTick();
    });

    document.getElementById('testWinBtn')?.addEventListener('click', () => {
      SoundEngine.playWin();
    });

    // TTS Voice Controls
    document.getElementById('ttsMasterCheck')?.addEventListener('change', (e) => {
      if (window.TTSEngine) {
        TTSEngine.setEnabled(e.target.checked);
      }
    });

    document.getElementById('ttsVoiceSelect')?.addEventListener('change', (e) => {
      if (window.TTSEngine) {
        TTSEngine.setVoiceURI(e.target.value);
      }
    });

    document.getElementById('testTtsBtn')?.addEventListener('click', () => {
      if (window.TTSEngine) {
        const lang = window.i18n ? window.i18n.getLanguage() : 'vi';
        TTSEngine.test(lang);
      }
    });

    // Font Select
    document.getElementById('wheelFontSelect')?.addEventListener('change', (e) => {
      WheelEngine.setFont(e.target.value);
    });

    // Checkboxes
    document.getElementById('autoModalCheck')?.addEventListener('change', (e) => {
      state.autoOpenModal = e.target.checked;
      localStorage.setItem('np_auto_modal', state.autoOpenModal);
    });

    document.getElementById('confettiCheck')?.addEventListener('change', (e) => {
      state.enableConfetti = e.target.checked;
      localStorage.setItem('np_enable_confetti', state.enableConfetti);
    });

    // Language Radio Buttons
    document.querySelectorAll('input[name="appLang"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked && window.i18n) {
          window.i18n.setLanguage(e.target.value);
          updateCounter();
        }
      });
    });

    // Close Settings
    document.getElementById('closeSettingsBtn')?.addEventListener('click', closeSettingsModal);
    document.getElementById('saveSettingsBtn')?.addEventListener('click', closeSettingsModal);
    DOM.settingsModal?.addEventListener('click', (e) => {
      if (e.target === DOM.settingsModal) closeSettingsModal();
    });
  }

  // ==========================================================================
  // 7. History Management
  // ==========================================================================
  function addToHistory(name) {
    const lang = window.i18n ? window.i18n.getLanguage() : 'vi';
    const item = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      name: name,
      time: new Date().toLocaleTimeString(lang === 'vi' ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    state.history.unshift(item);
    saveHistory();
    renderHistory();
  }

  function deleteHistoryItem(id) {
    state.history = state.history.filter(item => item.id !== id);
    saveHistory();
    renderHistory();
    showToast(window.i18n.t('toastRemoveWinner', { name: '' }).replace('""', ''), 'info');
  }

  function clearAllHistory() {
    if (state.history.length === 0) return;
    state.history = [];
    saveHistory();
    renderHistory();
    showToast(window.i18n.t('toastClearHistory'), 'info');
  }

  function exportHistory() {
    if (state.history.length === 0) {
      showToast(window.i18n.t('toastNoHistory'), 'warning');
      return;
    }
    const content = state.history
      .map((item, idx) => `${idx + 1}. [${item.time}] ${item.name}`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `namepicker-winners-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(window.i18n.t('toastExportHistory'), 'success');
  }

  function saveHistory() {
    localStorage.setItem('np_history_list', JSON.stringify(state.history));
  }

  function loadHistory() {
    const saved = localStorage.getItem('np_history_list');
    if (saved) {
      try {
        state.history = JSON.parse(saved) || [];
      } catch (e) {
        state.history = [];
      }
    }
    renderHistory();
  }

  function renderHistory() {
    if (!DOM.historyList) return;

    if (DOM.historyCount) {
      DOM.historyCount.textContent = state.history.length;
    }

    if (state.history.length === 0) {
      if (DOM.historyEmpty) DOM.historyEmpty.classList.remove('hidden');
      DOM.historyList.innerHTML = '';
      return;
    }

    if (DOM.historyEmpty) DOM.historyEmpty.classList.add('hidden');
    DOM.historyList.innerHTML = '';

    state.history.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.innerHTML = `
        <span class="history-name">${escapeHtml(item.name)}</span>
        <div class="history-meta">
          <span class="history-time">${item.time}</span>
          <button class="btn-item-delete" title="Xóa mục này" data-del-id="${item.id}">✕</button>
        </div>
      `;
      DOM.historyList.appendChild(li);
    });

    DOM.historyList.querySelectorAll('[data-del-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-del-id');
        deleteHistoryItem(id);
      });
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ==========================================================================
  // 8. Theme & Fullscreen Controls
  // ==========================================================================
  const Theme = {
    STORAGE_KEY: 'pd_template_theme',

    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = saved || (prefersDark ? 'dark' : 'light');
      this.apply(initial);
    },

    apply(theme) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(this.STORAGE_KEY, theme);
      if (DOM.themeIcon) DOM.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
      WheelEngine.draw();
    },

    toggle() {
      const isDark = document.documentElement.classList.contains('dark');
      this.apply(isDark ? 'light' : 'dark');
    }
  };

  let savedStateBeforeFullscreen = null;

  function handleFullscreenChange() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (isFs) {
      // Save pre-fullscreen panel visibility and auto-hide both sidebars
      savedStateBeforeFullscreen = {
        hideLeft: state.hideLeft,
        hideRight: state.hideRight
      };
      setPanelVisibility('left', false);
      setPanelVisibility('right', false);
      if (DOM.fullscreenBtn) DOM.fullscreenBtn.classList.add('active');
    } else {
      // Restore pre-fullscreen panel visibility
      if (savedStateBeforeFullscreen) {
        setPanelVisibility('left', !savedStateBeforeFullscreen.hideLeft);
        setPanelVisibility('right', !savedStateBeforeFullscreen.hideRight);
        savedStateBeforeFullscreen = null;
      }
      if (DOM.fullscreenBtn) DOM.fullscreenBtn.classList.remove('active');
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const docEl = document.documentElement;
      const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen;
      if (req) {
        req.call(docEl).catch(() => {
          showToast('Cannot enter fullscreen', 'warning');
        });
      }
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) {
        exit.call(document);
      }
    }
  }

  // --- Panel Visibility Toggle Logic ---
  function setPanelVisibility(panel, isVisible) {
    const workspace = document.getElementById('appWorkspace') || DOM.appWorkspace;
    if (!workspace) return;

    if (panel === 'left') {
      state.hideLeft = !isVisible;
      localStorage.setItem('np_hide_left', state.hideLeft);
      if (state.hideLeft) {
        workspace.classList.add('hide-left');
        DOM.toggleListBtn?.classList.remove('active');
        if (DOM.collapseListBtn) DOM.collapseListBtn.textContent = '▶ Hiện';
      } else {
        workspace.classList.remove('hide-left');
        DOM.toggleListBtn?.classList.add('active');
        if (DOM.collapseListBtn) DOM.collapseListBtn.textContent = '◀ Ẩn';
      }
    } else if (panel === 'right') {
      state.hideRight = !isVisible;
      localStorage.setItem('np_hide_right', state.hideRight);
      if (state.hideRight) {
        workspace.classList.add('hide-right');
        DOM.toggleHistoryBtn?.classList.remove('active');
        if (DOM.collapseHistoryBtn) DOM.collapseHistoryBtn.textContent = 'Hiện ◀';
      } else {
        workspace.classList.remove('hide-right');
        DOM.toggleHistoryBtn?.classList.add('active');
        if (DOM.collapseHistoryBtn) DOM.collapseHistoryBtn.textContent = 'Ẩn ▶';
      }
    }

    setTimeout(() => {
      if (window.WheelEngine) window.WheelEngine.draw();
    }, 150);
  }

  function toggleLeftPanel() {
    setPanelVisibility('left', state.hideLeft);
  }

  function toggleRightPanel() {
    setPanelVisibility('right', state.hideRight);
  }

  // ==========================================================================
  // 9. Event Bindings & App Init
  // ==========================================================================
  function bindEvents() {
    // Textarea input
    let debounceTimer = null;
    DOM.namesInput.addEventListener('input', () => {
      if (WheelEngine.isBusy()) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(parseNames, 200);
    });

    // Duration slider
    DOM.durationSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.duration = val;
      DOM.durationDisplay.textContent = `${val}s`;
      localStorage.setItem('np_duration', val);
    });

    // Spin Button
    DOM.spinBtn.addEventListener('click', triggerSpin);

    // Center Hub click to spin
    const hub = document.getElementById('wheelHub');
    if (hub) hub.addEventListener('click', triggerSpin);

    // List Action buttons
    document.getElementById('shuffleBtn')?.addEventListener('click', shuffleList);
    document.getElementById('sortBtn')?.addEventListener('click', sortListAZ);
    document.getElementById('dedupeBtn')?.addEventListener('click', removeDuplicates);
    document.getElementById('clearListBtn')?.addEventListener('click', clearList);

    // Presets
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-preset');
        loadPreset(key);
      });
    });

    // Winner Modal buttons
    document.getElementById('removeWinnerBtn')?.addEventListener('click', handleRemoveWinner);
    document.getElementById('keepWinnerBtn')?.addEventListener('click', handleKeepWinner);
    DOM.winnerModal?.addEventListener('click', (e) => {
      if (e.target === DOM.winnerModal) closeWinnerModal();
    });

    // Settings Modal Open
    DOM.settingsBtn?.addEventListener('click', openSettingsModal);

    // Language Toggle Button on Topbar
    DOM.langToggleBtn?.addEventListener('click', () => {
      if (window.i18n) {
        window.i18n.toggleLanguage();
        updateCounter();
      }
    });

    // History buttons
    document.getElementById('clearHistoryBtn')?.addEventListener('click', clearAllHistory);
    document.getElementById('exportHistoryBtn')?.addEventListener('click', exportHistory);

    // Panel Visibility Toggles
    DOM.toggleListBtn?.addEventListener('click', toggleLeftPanel);
    DOM.toggleHistoryBtn?.addEventListener('click', toggleRightPanel);
    DOM.collapseListBtn?.addEventListener('click', toggleLeftPanel);
    DOM.collapseHistoryBtn?.addEventListener('click', toggleRightPanel);

    // Toolbar buttons
    DOM.themeToggleBtn?.addEventListener('click', () => Theme.toggle());
    DOM.soundToggleBtn?.addEventListener('click', () => SoundEngine.toggle());
    DOM.fullscreenBtn?.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    // Settings Dialog internal bindings
    bindSettingsEvents();

    // Keyboard Shortcuts: Space to spin, Escape to close modal
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && document.activeElement !== DOM.namesInput) {
        e.preventDefault();
        if (!DOM.winnerModal.classList.contains('hidden')) {
          closeWinnerModal();
        } else if (!DOM.settingsModal.classList.contains('hidden')) {
          closeSettingsModal();
        } else {
          triggerSpin();
        }
      } else if (e.key === 'Escape') {
        if (!DOM.winnerModal.classList.contains('hidden')) {
          closeWinnerModal();
        }
        if (!DOM.settingsModal.classList.contains('hidden')) {
          closeSettingsModal();
        }
      }
    });
  }

  function init() {
    // 1. Init i18n
    if (window.i18n) window.i18n.init();

    // 2. Init Wheel, Sound & TTS
    WheelEngine.init('wheelCanvas', '#wheelPointer');
    SoundEngine.init();
    if (window.TTSEngine) window.TTSEngine.init();

    // 3. Load Duration & Options
    const savedDuration = localStorage.getItem('np_duration');
    if (savedDuration) {
      state.duration = parseInt(savedDuration, 10);
      DOM.durationSlider.value = state.duration;
      DOM.durationDisplay.textContent = `${state.duration}s`;
    }

    const savedAutoModal = localStorage.getItem('np_auto_modal');
    if (savedAutoModal !== null) state.autoOpenModal = savedAutoModal === 'true';

    const savedConfetti = localStorage.getItem('np_enable_confetti');
    if (savedConfetti !== null) state.enableConfetti = savedConfetti === 'true';

    const savedHideLeft = localStorage.getItem('np_hide_left');
    if (savedHideLeft === 'true') setPanelVisibility('left', false);

    const savedHideRight = localStorage.getItem('np_hide_right');
    if (savedHideRight === 'true') setPanelVisibility('right', false);

    // 4. Load Theme
    Theme.init();

    // 5. Load List & History
    loadList();
    loadHistory();

    // 6. Bind Events
    bindEvents();
  }

  // Start app on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', init);

})(window, document);
