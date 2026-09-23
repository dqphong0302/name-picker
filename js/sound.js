/**
 * NamePicker Pro - Advanced Web Audio Synthetic Sound Engine (sound.js)
 * Zero external audio files required. Multi-preset acoustic & retro synths with volume control.
 */

const SoundEngine = (function () {
  'use strict';

  let audioCtx = null;
  let masterGain = null;

  let state = {
    enabled: true,
    volume: 80, // 0 - 100
    tickStyle: 'mechanical', // mechanical | wood | bell | retro | soft
    winStyle: 'fanfare' // fanfare | chime | applause | retro_win
  };

  function getContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        masterGain = audioCtx.createGain();
        masterGain.connect(audioCtx.destination);
        updateMasterVolume();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function updateMasterVolume() {
    if (masterGain && audioCtx) {
      const volFraction = (state.volume / 100) * (state.enabled ? 1 : 0);
      masterGain.gain.setValueAtTime(volFraction, audioCtx.currentTime);
    }
  }

  function save() {
    localStorage.setItem('np_sound_settings', JSON.stringify(state));
  }

  function load() {
    const saved = localStorage.getItem('np_sound_settings');
    if (saved) {
      try {
        state = Object.assign(state, JSON.parse(saved));
      } catch (e) {}
    }
  }

  const API = {
    init() {
      load();
      this.updateUI();
    },

    getState() {
      return state;
    },

    isEnabled() {
      return state.enabled;
    },

    toggle() {
      state.enabled = !state.enabled;
      save();
      updateMasterVolume();
      this.updateUI();
      if (state.enabled) {
        this.playTick();
      }
      return state.enabled;
    },

    setVolume(val) {
      state.volume = Math.max(0, Math.min(100, parseInt(val, 10)));
      save();
      updateMasterVolume();
    },

    setTickStyle(style) {
      state.tickStyle = style;
      save();
    },

    setWinStyle(style) {
      state.winStyle = style;
      save();
    },

    updateUI() {
      const soundBtn = document.getElementById('soundToggleBtn');
      const soundIcon = document.getElementById('soundIcon');
      if (soundBtn && soundIcon) {
        if (state.enabled) {
          soundBtn.classList.add('active');
          soundIcon.innerHTML = '<svg class="pd-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z"/><path d="M16 9a5 5 0 0 1 0 6M19.4 18.4a9 9 0 0 0 0-12.7"/></svg>';
          soundBtn.setAttribute('title', 'Tắt âm thanh');
        } else {
          soundBtn.classList.remove('active');
          soundIcon.innerHTML = '<svg class="pd-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z"/><path d="m22 9-6 6M16 9l6 6"/></svg>';
          soundBtn.setAttribute('title', 'Bật âm thanh');
        }
      }
    },

    playTick() {
      if (!state.enabled) return;
      const ctx = getContext();
      if (!ctx || !masterGain) return;

      const now = ctx.currentTime;
      const style = state.tickStyle;

      if (style === 'wood') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.045);
      } else if (style === 'bell') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.085);
      } else if (style === 'retro') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.setValueAtTime(290, now + 0.02);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.045);
      } else if (style === 'soft') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.035);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(130, now + 0.035);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    },

    playWin() {
      if (!state.enabled) return;
      const ctx = getContext();
      if (!ctx || !masterGain) return;

      const now = ctx.currentTime;
      const style = state.winStyle;

      if (style === 'chime') {
        const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22];
        notes.forEach((freq, i) => {
          const noteTime = now + (i * 0.08);
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteTime);
          gain.gain.setValueAtTime(0, noteTime);
          gain.gain.linearRampToValueAtTime(0.28, noteTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.9);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(noteTime);
          osc.stop(noteTime + 0.95);
        });
      } else if (style === 'applause') {
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.45));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, now);
        filter.Q.setValueAtTime(1.5, now);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.4);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        noise.start(now);
      } else if (style === 'retro_win') {
        const melody = [
          { f: 440, d: 0.08 }, { f: 554.37, d: 0.08 }, { f: 659.25, d: 0.08 },
          { f: 880, d: 0.16 }, { f: 659.25, d: 0.08 }, { f: 880, d: 0.35 }
        ];
        let offset = 0;
        melody.forEach(n => {
          const t = now + offset;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(n.f, t);
          gain.gain.setValueAtTime(0.22, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(t);
          osc.stop(t + n.d);
          offset += n.d * 0.9;
        });
      } else {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, index) => {
          const noteTime = now + (index * 0.09);
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteTime);
          gain.gain.setValueAtTime(0, noteTime);
          gain.gain.linearRampToValueAtTime(0.32, noteTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.85);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(noteTime);
          osc.stop(noteTime + 0.9);
        });
      }
    }
  };

  window.SoundEngine = API;
  return API;
})();
