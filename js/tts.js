/**
 * NamePicker Pro - Text-to-Speech (TTS) Voice Engine (tts.js)
 * Uses browser native Web Speech API (Google / System voices).
 * 100% Free, zero-dependency, works offline or online.
 * Default: OFF (can be enabled via Settings modal).
 */

(function (window) {
  'use strict';

  const STORAGE_KEY_ENABLED = 'np_tts_enabled';
  const STORAGE_KEY_VOICE = 'np_tts_voice_uri';

  let voices = [];
  let isReady = false;

  const state = {
    enabled: false, // Default is OFF as requested
    voiceURI: '',
    rate: 1.0,
    pitch: 1.0
  };

  function isSupported() {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  function loadSettings() {
    const savedEnabled = localStorage.getItem(STORAGE_KEY_ENABLED);
    // Default is strictly false unless explicitly enabled by user
    state.enabled = savedEnabled === 'true';

    const savedVoice = localStorage.getItem(STORAGE_KEY_VOICE);
    if (savedVoice) {
      state.voiceURI = savedVoice;
    }
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY_ENABLED, state.enabled ? 'true' : 'false');
    if (state.voiceURI) {
      localStorage.setItem(STORAGE_KEY_VOICE, state.voiceURI);
    }
  }

  function populateVoices() {
    if (!isSupported()) return;
    voices = window.speechSynthesis.getVoices() || [];
    if (voices.length > 0) {
      isReady = true;
    }
  }

  function init() {
    if (!isSupported()) {
      console.warn('[TTSEngine] SpeechSynthesis API not supported by browser.');
      return;
    }

    loadSettings();
    populateVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        populateVoices();
      };
    }
  }

  function getVoices() {
    if (voices.length === 0 && isSupported()) {
      voices = window.speechSynthesis.getVoices() || [];
    }
    return voices;
  }

  /**
   * Filter voices matching target language (vi or en)
   */
  function getVoicesForLanguage(lang = 'vi') {
    const all = getVoices();
    const prefix = lang.toLowerCase() === 'vi' ? 'vi' : 'en';
    const filtered = all.filter(v => v.lang && v.lang.toLowerCase().startsWith(prefix));
    return filtered.length > 0 ? filtered : all;
  }

  /**
   * Find best voice matching current language or preferred voiceURI
   */
  function findBestVoice(lang = 'vi') {
    const all = getVoices();
    if (all.length === 0) return null;

    // 1. Try exact voiceURI match
    if (state.voiceURI) {
      const match = all.find(v => v.voiceURI === state.voiceURI);
      if (match) return match;
    }

    // 2. Look for Google / Natural / Premium voice for language
    const langPrefix = lang.toLowerCase() === 'vi' ? 'vi' : 'en';
    const langVoices = all.filter(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix));

    if (langVoices.length > 0) {
      // Prioritize Google voices if available
      const googleVoice = langVoices.find(v => v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural'));
      return googleVoice || langVoices[0];
    }

    // 3. Fallback to default voice
    return all.find(v => v.default) || all[0];
  }

  /**
   * Speak a text string
   */
  function speak(text, lang = 'vi') {
    if (!isSupported()) return;

    // Cancel any active speech
    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = lang.toLowerCase() === 'vi' ? 'vi-VN' : 'en-US';
    utterance.lang = targetLang;
    utterance.rate = state.rate;
    utterance.pitch = state.pitch;

    const voice = findBestVoice(lang);
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Announce winner name
   */
  function speakWinner(name, lang = 'vi') {
    if (!state.enabled || !isSupported()) return;

    let phrase = '';
    if (lang.toLowerCase() === 'vi') {
      phrase = `Xin chúc mừng, ${name}!`;
    } else {
      phrase = `Congratulations, ${name}!`;
    }

    // Delay slightly so it doesn't overlap immediately with fanfare attack
    setTimeout(() => {
      speak(phrase, lang);
    }, 450);
  }

  /**
   * Test current voice settings
   */
  function test(lang = 'vi') {
    const sample = lang.toLowerCase() === 'vi' ? 'Xin chúc mừng, Nguyễn Văn An!' : 'Congratulations, Alexander Smith!';
    speak(sample, lang);
  }

  const API = {
    init,
    isSupported,
    isEnabled: () => state.enabled,
    setEnabled: (val) => {
      state.enabled = !!val;
      saveSettings();
    },
    getVoiceURI: () => state.voiceURI,
    setVoiceURI: (uri) => {
      state.voiceURI = uri || '';
      saveSettings();
    },
    getVoices,
    getVoicesForLanguage,
    findBestVoice,
    speak,
    speakWinner,
    test
  };

  window.TTSEngine = API;
  return API;
})(window);
