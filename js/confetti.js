/**
 * NamePicker Pro - Lightweight Canvas Confetti Engine (confetti.js)
 * High-performance 2D particle burst celebration. Zero external libraries.
 */

const ConfettiEngine = (function () {
  'use strict';

  let canvas = null;
  let ctx = null;
  let particles = [];
  let animationId = null;

  const COLORS = [
    '#38bdf8', '#818cf8', '#f43f5e', '#10b981', '#f59e0b',
    '#ec4899', '#a855f7', '#06b6d4', '#eab308', '#ffffff'
  ];

  function resize() {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  function createParticles(count = 140) {
    particles = [];
    const w = canvas.width;
    const h = canvas.height;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: w * 0.5 + (Math.random() - 0.5) * 200,
        y: h * 0.4 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.7) * 22,
        size: Math.random() * 8 + 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 14,
        gravity: 0.42,
        drag: 0.96,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeCount = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.opacity <= 0.01) continue;

      activeCount++;
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      if (p.y > canvas.height * 0.6) {
        p.opacity -= 0.018;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    if (activeCount > 0) {
      animationId = requestAnimationFrame(render);
    } else {
      stop();
    }
  }

  function start() {
    if (!canvas) {
      canvas = document.getElementById('confettiCanvas');
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      window.addEventListener('resize', resize);
    }
    resize();
    if (animationId) cancelAnimationFrame(animationId);
    createParticles(160);
    render();
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return {
    start: start,
    stop: stop
  };
})();
