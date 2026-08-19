/**
 * NamePicker Pro - Bilingual i18n System (i18n.js)
 * Comprehensive English & Vietnamese localization dictionary.
 */

const i18n = (function () {
  'use strict';

  const DICTIONARY = {
    vi: {
      brandSub: 'Vòng quay may mắn & Chọn tên',
      timeLabel: 'Thời gian:',
      soundToggleTitle: 'Bật / Tắt âm thanh',
      themeToggleTitle: 'Chuyển chế độ Sáng / Tối',
      settingsBtnTitle: 'Cài đặt hệ thống',
      fullscreenBtnTitle: 'Toàn màn hình',
      btnToggleList: 'Ẩn / Hiện Danh Sách',
      btnToggleHistory: 'Ẩn / Hiện Lịch Sử',
      btnHideList: 'Ẩn danh sách',
      btnHideHistory: 'Ẩn lịch sử',
      
      listTitle: 'Danh Sách',
      listPlaceholder: 'Nhập mỗi tên trên một dòng...',
      btnShuffle: 'Xáo trộn',
      btnSort: 'Xếp A-Z',
      btnDedupe: 'Lọc trùng',
      btnClear: 'Xóa hết',
      presetsTitle: 'Danh sách mẫu (Presets)',
      presetClass: '🎓 Lớp học',
      presetNumbers: '🔢 Số 1-20',
      presetMinigame: '🎁 Mini Game',
      presetTeams: '🛡️ 4 Đội nhóm',

      btnSpin: 'QUAY NGAY',
      spinHintPrefix: 'Nhấn nút hoặc bấm',
      spinHintKey: 'Phím Space',
      spinHintSuffix: 'để quay',
      emptyList: 'Danh sách trống',
      hubTitle: 'Nhấn vào tâm để quay',

      historyTitle: 'Lịch Sử Trúng',
      historyEmptyTitle: 'Chưa có lượt quay',
      historyEmptySub: 'Kết quả trúng thưởng sẽ hiển thị tại đây.',
      btnExport: 'Xuất File',
      btnClearHistory: 'Xóa lịch sử',

      modalTitle: '🎉 KẾT QUẢ BỐC THĂM',
      modalSubtitle: 'Người may mắn trúng thưởng:',
      modalBtnRemove: '✕ Xóa khỏi DS',
      modalBtnKeep: '✓ Giữ lại tên',
      modalBtnSpinAgain: '🚀 Quay Lượt Tiếp Theo',

      settingsTitle: '⚙️ Cài Đặt Hệ Thống',
      tabWheel: '🎡 Vòng quay',
      tabAudio: '🔊 Âm thanh',
      tabFont: '🔤 Phông & Màu',
      tabLang: '🌐 Ngôn ngữ',

      settingDuration: 'Thời gian quay (giây):',
      settingPalette: 'Bảng màu vòng quay:',
      settingHubIcon: 'Biểu tượng trục tâm:',
      settingAutoModal: 'Tự động hiển thị chúc mừng khi quay xong',
      settingConfetti: 'Hiệu ứng pháo hoa chúc mừng',

      settingSoundMaster: 'Bật âm thanh hiệu ứng',
      settingVolume: 'Âm lượng tổng:',
      settingTickStyle: 'Kiểu tiếng tạch tạch (Tick sound):',
      settingWinStyle: 'Kiểu tiếng thắng (Victory sound):',
      btnTestSound: 'Thử âm thanh',

      settingTtsSection: '🗣️ Giọng đọc xướng tên người thắng (TTS)',
      settingTtsEnable: 'Tự động đọc tên người trúng thưởng (Giọng Google / AI)',
      settingTtsVoice: 'Chọn giọng đọc:',
      btnTestTts: 'Thử giọng đọc',
      ttsDefaultVoice: 'Mặc định của hệ thống / Google',

      settingFont: 'Phông chữ vòng quay:',
      btnSaveSettings: 'Đóng & Áp dụng',

      toastShuffle: 'Đã xáo trộn danh sách ngẫu nhiên!',
      toastSort: 'Đã sắp xếp danh sách từ A đến Z!',
      toastDedupe: 'Đã loại bỏ {count} mục trùng lặp!',
      toastNoDedupe: 'Không có mục nào trùng lặp',
      toastClearList: 'Đã xóa toàn bộ danh sách',
      toastPreset: 'Đã nạp danh sách mẫu thành công!',
      toastEmptyAlert: 'Vui lòng nhập ít nhất 1 tên vào danh sách!',
      toastRemoveWinner: 'Đã loại "{name}" khỏi danh sách',
      toastClearHistory: 'Đã xóa sạch lịch sử quay!',
      toastExportHistory: 'Đã tải xuống danh sách kết quả!',
      toastNoHistory: 'Chưa có lịch sử để xuất file',
      toastNeedTwo: 'Cần ít nhất 2 mục để xáo trộn'
    },

    en: {
      brandSub: 'Lucky Wheel & Random Name Picker',
      timeLabel: 'Duration:',
      soundToggleTitle: 'Toggle Sound',
      themeToggleTitle: 'Toggle Dark / Light Theme',
      settingsBtnTitle: 'System Settings',
      fullscreenBtnTitle: 'Toggle Fullscreen',
      btnToggleList: 'Toggle Participants Panel',
      btnToggleHistory: 'Toggle History Panel',
      btnHideList: 'Hide list',
      btnHideHistory: 'Hide history',

      listTitle: 'Participants',
      listPlaceholder: 'Enter one name per line...',
      btnShuffle: 'Shuffle',
      btnSort: 'Sort A-Z',
      btnDedupe: 'Deduplicate',
      btnClear: 'Clear All',
      presetsTitle: 'Preset Templates',
      presetClass: '🎓 Classroom',
      presetNumbers: '🔢 Numbers 1-20',
      presetMinigame: '🎁 Mini Game',
      presetTeams: '🛡️ 4 Teams',

      btnSpin: 'SPIN NOW',
      spinHintPrefix: 'Click button or press',
      spinHintKey: 'Space key',
      spinHintSuffix: 'to spin',
      emptyList: 'List is empty',
      hubTitle: 'Click hub to spin',

      historyTitle: 'Winners History',
      historyEmptyTitle: 'No winners yet',
      historyEmptySub: 'Lucky winners will appear right here.',
      btnExport: 'Export TXT',
      btnClearHistory: 'Clear History',

      modalTitle: '🎉 LUCKY WINNER',
      modalSubtitle: 'The fortunate winner is:',
      modalBtnRemove: '✕ Remove Winner',
      modalBtnKeep: '✓ Keep Winner',
      modalBtnSpinAgain: '🚀 Spin Next Round',

      settingsTitle: '⚙️ System Settings',
      tabWheel: '🎡 Wheel',
      tabAudio: '🔊 Sound',
      tabFont: '🔤 Fonts & Colors',
      tabLang: '🌐 Language',

      settingDuration: 'Spin Duration (seconds):',
      settingPalette: 'Wheel Color Palette:',
      settingHubIcon: 'Center Hub Icon:',
      settingAutoModal: 'Auto-open celebration popup on win',
      settingConfetti: 'Confetti fireworks animation',

      settingSoundMaster: 'Enable Sound Effects',
      settingVolume: 'Master Volume:',
      settingTickStyle: 'Tick sound style:',
      settingWinStyle: 'Victory sound style:',
      btnTestSound: 'Preview Sound',

      settingTtsSection: '🗣️ Winner Voice Announcement (TTS)',
      settingTtsEnable: 'Auto-announce winner with voice (Google / AI Voice)',
      settingTtsVoice: 'Select voice:',
      btnTestTts: 'Test Voice',
      ttsDefaultVoice: 'Default System / Google Voice',

      settingFont: 'Wheel Font Family:',
      btnSaveSettings: 'Close & Apply',

      toastShuffle: 'Names shuffled randomly!',
      toastSort: 'Sorted alphabetically from A to Z!',
      toastDedupe: 'Removed {count} duplicate names!',
      toastNoDedupe: 'No duplicate names found',
      toastClearList: 'Cleared all names from list',
      toastPreset: 'Preset template loaded successfully!',
      toastEmptyAlert: 'Please enter at least 1 name in the list!',
      toastRemoveWinner: 'Removed "{name}" from the list',
      toastClearHistory: 'Cleared all history records!',
      toastExportHistory: 'Downloaded results text file!',
      toastNoHistory: 'No history records to export',
      toastNeedTwo: 'Need at least 2 names to shuffle'
    }
  };

  let currentLang = 'vi';

  function init() {
    const saved = localStorage.getItem('np_language');
    if (saved && (saved === 'vi' || saved === 'en')) {
      currentLang = saved;
    }
    apply();
  }

  function setLanguage(lang) {
    if (lang === 'vi' || lang === 'en') {
      currentLang = lang;
      localStorage.setItem('np_language', lang);
      apply();
      if (window.WheelEngine) window.WheelEngine.draw();
    }
  }

  function toggleLanguage() {
    setLanguage(currentLang === 'vi' ? 'en' : 'vi');
  }

  function getLanguage() {
    return currentLang;
  }

  function t(key, replacements = {}) {
    let str = (DICTIONARY[currentLang] && DICTIONARY[currentLang][key]) || (DICTIONARY.vi && DICTIONARY.vi[key]) || key;
    Object.keys(replacements).forEach(placeholder => {
      str = str.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), replacements[placeholder]);
    });
    return str;
  }

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (DICTIONARY[currentLang] && DICTIONARY[currentLang][key]) {
        el.textContent = DICTIONARY[currentLang][key];
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (DICTIONARY[currentLang] && DICTIONARY[currentLang][key]) {
        el.setAttribute('title', DICTIONARY[currentLang][key]);
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (DICTIONARY[currentLang] && DICTIONARY[currentLang][key]) {
        el.setAttribute('placeholder', DICTIONARY[currentLang][key]);
      }
    });

    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
      langBtn.textContent = currentLang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN';
    }
  }

  const API = {
    init: init,
    setLanguage: setLanguage,
    toggleLanguage: toggleLanguage,
    getLanguage: getLanguage,
    t: t,
    apply: apply
  };

  window.i18n = API;
  return API;
})();
