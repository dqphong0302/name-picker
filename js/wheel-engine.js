/**
 * NamePicker Pro - High-Precision Canvas Wheel Engine (wheel-engine.js)
 * Enhanced with:
 * - 6 Curated Sector Color Palettes
 * - Multi-Font Engine (Inter, Montserrat, Playfair, Quicksand, JetBrains Mono, Oswald)
 * - Custom Center Hub Icons
 * - Real-time angular velocity tick sounds & pointer kicks
 */

const WheelEngine = (function () {
  'use strict';

  let canvas = null;
  let ctx = null;
  let pointerEl = null;

  let names = [];
  let currentRotation = 0; // In degrees (0..360)
  let isSpinning = false;
  let animationFrameId = null;
  let lastTickIndex = -1;

  const BASE_SIZE = 800;
  const RADIUS = 380;
  const CENTER = BASE_SIZE / 2;

  // Curated Color Palettes
  const PALETTES = {
    rainbow: [
      '#1e40af', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
      '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1'
    ],
    cyberpunk: [
      '#06b6d4', '#ec4899', '#8b5cf6', '#eab308', '#3b82f6', '#f43f5e', '#10b981'
    ],
    pastel: [
      '#60a5fa', '#f87171', '#4ade80', '#facc15', '#c084fc', '#f472b6', '#2dd4bf', '#fb923c'
    ],
    royal: [
      '#1e3a8a', '#d97706', '#047857', '#b45309', '#4338ca', '#be123c', '#0f766e'
    ],
    sunset: [
      '#e11d48', '#f97316', '#f59e0b', '#fb7185', '#ea580c', '#c026d3'
    ],
    ocean: [
      '#1e40af', '#0891b2', '#1e3a8a', '#06b6d4', '#2563eb', '#3b82f6'
    ]
  };

  let currentPaletteKey = 'rainbow';
  let currentFontFamily = 'Inter';
  let hubIcon = '★';

  function normDeg(d) {
    return ((d % 360) + 360) % 360;
  }

  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }

  function init(canvasId, pointerSelector) {
    canvas = document.getElementById(canvasId);
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    pointerEl = document.querySelector(pointerSelector);
    loadSettings();
    setupHighDPI();
  }

  function setupHighDPI() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = BASE_SIZE * dpr;
    canvas.height = BASE_SIZE * dpr;
    ctx.scale(dpr, dpr);
  }

  function loadSettings() {
    const savedPalette = localStorage.getItem('np_wheel_palette');
    if (savedPalette && PALETTES[savedPalette]) currentPaletteKey = savedPalette;

    const savedFont = localStorage.getItem('np_wheel_font');
    if (savedFont) currentFontFamily = savedFont;

    const savedHub = localStorage.getItem('np_hub_icon');
    if (savedHub) hubIcon = savedHub;
  }

  function setPalette(key) {
    if (PALETTES[key]) {
      currentPaletteKey = key;
      localStorage.setItem('np_wheel_palette', key);
      draw();
    }
  }

  function setFont(fontName) {
    currentFontFamily = fontName;
    localStorage.setItem('np_wheel_font', fontName);
    draw();
  }

  function setHubIcon(iconChar) {
    hubIcon = iconChar;
    localStorage.setItem('np_hub_icon', iconChar);
    const starEl = document.querySelector('.hub-star');
    if (starEl) starEl.textContent = iconChar;
  }

  function setNames(newList) {
    names = newList;
    draw();
  }

  function getNames() {
    return names;
  }

  function truncateText(text, maxWidth, font) {
    ctx.font = font;
    if (ctx.measureText(text).width <= maxWidth) return text;

    let truncated = text;
    while (truncated.length > 1 && ctx.measureText(truncated + '…').width > maxWidth) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + '…';
  }

  function getFontCSS() {
    switch (currentFontFamily) {
      case 'Montserrat': return 'Montserrat, sans-serif';
      case 'Playfair Display': return '"Playfair Display", serif';
      case 'Quicksand': return 'Quicksand, sans-serif';
      case 'JetBrains Mono': return '"JetBrains Mono", monospace';
      case 'Oswald': return 'Oswald, sans-serif';
      default: return 'Inter, -apple-system, sans-serif';
    }
  }

  function draw() {
    if (!ctx || isSpinning) return;

    ctx.clearRect(0, 0, BASE_SIZE, BASE_SIZE);

    const isDark = document.documentElement.classList.contains('dark');
    const colors = PALETTES[currentPaletteKey] || PALETTES.rainbow;
    const fontCSS = getFontCSS();

    // Empty State Wheel
    if (!names || names.length === 0) {
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
      ctx.stroke();

      ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
      ctx.font = `700 28px ${fontCSS}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(window.i18n ? window.i18n.t('emptyList') : 'Danh sách trống', CENTER, CENTER);
      return;
    }

    const n = names.length;
    const arcSize = (2 * Math.PI) / n;

    ctx.save();
    ctx.translate(CENTER, CENTER);
    // Rotate canvas -90 deg so slice 0 starts at 12 o'clock (pointer position)
    ctx.rotate(-Math.PI / 2);
    ctx.translate(-CENTER, -CENTER);

    // Draw Sectors
    for (let i = 0; i < n; i++) {
      const startAngle = i * arcSize;
      const endAngle = startAngle + arcSize;

      // Sector slice path
      ctx.beginPath();
      ctx.moveTo(CENTER, CENTER);
      ctx.arc(CENTER, CENTER, RADIUS, startAngle, endAngle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      // Sector border line
      ctx.lineWidth = n > 30 ? 1.5 : 2.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.stroke();

      // Text rendering
      ctx.save();
      ctx.translate(CENTER, CENTER);
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      // Dynamic Font Size calculation
      let fontSize = 24;
      if (n > 40) fontSize = 13;
      else if (n > 24) fontSize = 15;
      else if (n > 14) fontSize = 18;
      else if (n > 8) fontSize = 22;

      const fontStr = `700 ${fontSize}px ${fontCSS}`;
      const maxTextWidth = RADIUS - 100;
      const displayText = truncateText(names[i], maxTextWidth, fontStr);

      ctx.font = fontStr;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.fillText(displayText, RADIUS - 35, 0);
      ctx.restore();
    }

    // Outer Decorative Rim Dots (LED light bulbs)
    const dotCount = Math.max(24, Math.min(60, n * 2));
    const dotRadius = RADIUS - 10;
    for (let d = 0; d < dotCount; d++) {
      const dotAngle = (d * 2 * Math.PI) / dotCount;
      const dx = CENTER + dotRadius * Math.cos(dotAngle);
      const dy = CENTER + dotRadius * Math.sin(dotAngle);

      ctx.beginPath();
      ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = d % 2 === 0 ? '#ffffff' : '#fde047';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fill();
    }

    ctx.restore();
  }

  function spin(durationSec, onComplete) {
    if (isSpinning || !names.length) return;

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    isSpinning = true;
    const duration = durationSec * 1000;
    const sliceAngle = 360 / names.length;

    // Minimum revolutions for thrilling visual effect
    const minRevolutions = Math.max(5, durationSec * 2.2);
    // Random angle with offset safe from exact boundary
    const randomDegree = (Math.floor(Math.random() * names.length) * sliceAngle) + (sliceAngle * 0.5) + ((Math.random() - 0.5) * sliceAngle * 0.6);
    const totalRotate = (minRevolutions * 360) + randomDegree;

    const startAngle = currentRotation;
    const targetAngle = startAngle + totalRotate;

    let startTime = null;
    lastTickIndex = -1;

    function finish() {
      currentRotation = normDeg(targetAngle);
      canvas.style.transform = `rotate(${currentRotation}deg)`;

      isSpinning = false;
      animationFrameId = null;

      // Pointer angle resolution
      const pointerAngle = normDeg(360 - currentRotation);
      const winnerIndex = Math.floor(pointerAngle / sliceAngle) % names.length;
      const winnerName = names[winnerIndex];

      if (typeof onComplete === 'function') {
        onComplete(winnerName, winnerIndex);
      }
    }

    function animate(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeOutQuart(progress);

      const angle = startAngle + (targetAngle - startAngle) * ease;
      canvas.style.transform = `rotate(${angle}deg)`;

      // Boundary Tick Detection during spin
      const currentNorm = normDeg(angle);
      const currentPointerAngle = normDeg(360 - currentNorm);
      const currentSliceIndex = Math.floor(currentPointerAngle / sliceAngle) % names.length;

      if (currentSliceIndex !== lastTickIndex) {
        lastTickIndex = currentSliceIndex;
        if (window.SoundEngine) {
          window.SoundEngine.playTick();
        }
        if (pointerEl) {
          pointerEl.classList.remove('tick');
          void pointerEl.offsetWidth; // Trigger reflow
          pointerEl.classList.add('tick');
        }
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        finish();
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  function isBusy() {
    return isSpinning;
  }

  const API = {
    init: init,
    setNames: setNames,
    getNames: getNames,
    setPalette: setPalette,
    setFont: setFont,
    setHubIcon: setHubIcon,
    getPaletteKey: () => currentPaletteKey,
    getFont: () => currentFontFamily,
    getHubIcon: () => hubIcon,
    draw: draw,
    spin: spin,
    isBusy: isBusy
  };

  window.WheelEngine = API;
  return API;
})();
