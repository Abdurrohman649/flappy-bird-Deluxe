import { W } from './config.js';

export const IMG = {};
export const SND = {};

let loadedCount = 0;
let totalCount = 0;
let started = false;

const imageList = [
  ['pipe-green', 'sprites/pipe-green.png'],
  ['pipe-red', 'sprites/pipe-red.png'],
  ['bg-day', 'sprites/background-day.png'],
  ['bg-night', 'sprites/background-night.png'],
  ['base', 'sprites/base.png'],
  ['gameover', 'sprites/gameover.png'],
  ['message', 'sprites/message.png'],

  ['yellow-downflap', 'sprites/yellowbird-downflap.png'],
  ['yellow-midflap', 'sprites/yellowbird-midflap.png'],
  ['yellow-upflap', 'sprites/yellowbird-upflap.png'],

  ['blue-downflap', 'sprites/bluebird-downflap.png'],
  ['blue-midflap', 'sprites/bluebird-midflap.png'],
  ['blue-upflap', 'sprites/bluebird-upflap.png'],

  ['red-downflap', 'sprites/redbird-downflap.png'],
  ['red-midflap', 'sprites/redbird-midflap.png'],
  ['red-upflap', 'sprites/redbird-upflap.png'],

  ['d0', 'sprites/0.png'],
  ['d1', 'sprites/1.png'],
  ['d2', 'sprites/2.png'],
  ['d3', 'sprites/3.png'],
  ['d4', 'sprites/4.png'],
  ['d5', 'sprites/5.png'],
  ['d6', 'sprites/6.png'],
  ['d7', 'sprites/7.png'],
  ['d8', 'sprites/8.png'],
  ['d9', 'sprites/9.png']
];

const soundList = [
  ['wing', 'audio/wing.ogg', 'audio/wing.wav'],
  ['point', 'audio/point.ogg', 'audio/point.wav'],
  ['hit', 'audio/hit.ogg', 'audio/hit.wav'],
  ['die', 'audio/die.ogg', 'audio/die.wav'],
  ['swoosh', 'audio/swoosh.ogg', 'audio/swoosh.wav']
];

function markLoaded() {
  loadedCount++;
  if (loadedCount > totalCount) loadedCount = totalCount;
}

export function getLoadingProgress() {
  return {
    loaded: loadedCount,
    total: totalCount,
    done: totalCount > 0 && loadedCount >= totalCount
  };
}

export function loadAssets() {
  if (started) return;
  started = true;

  totalCount = imageList.length + soundList.length;

  for (const [name, src] of imageList) {
    loadImage(name, src);
  }

  for (const [name, ogg, wav] of soundList) {
    loadSound(name, ogg, wav);
  }
}

function loadImage(name, src) {
  const img = new Image();

  img.onload = () => {
    IMG[name] = img;
    markLoaded();
  };

  img.onerror = () => {
    console.warn(`[ASSETS] Не удалось загрузить изображение: ${src}`);
    markLoaded();
  };

  img.src = src;
}

function loadSound(name, ogg, wav) {
  const audio = new Audio();
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    markLoaded();
  };

  try {
    const source = audio.canPlayType('audio/ogg') ? ogg : wav;
    audio.src = source;
    audio.preload = 'auto';

    audio.addEventListener('canplaythrough', finish, { once: true });
    audio.addEventListener('error', finish, { once: true });

    setTimeout(finish, 4000);
    SND[name] = audio;
  } catch (err) {
    console.warn(`[ASSETS] Не удалось инициализировать звук: ${name}`, err);
    finish();
  }
}

export function playSound(name, volume = 0.35) {
  const base = SND[name];
  if (!base) return;

  try {
    const clone = base.cloneNode();
    clone.volume = Math.max(0, Math.min(1, volume));
    clone.play().catch(() => {});
  } catch (err) {
    console.warn(`[ASSETS] Ошибка воспроизведения звука: ${name}`, err);
  }
}

export function getBirdImage(color, flap = 'midflap') {
  return IMG[`${color}-${flap}`] || null;
}

export function getPipeImage(pipeType = 'green') {
  return IMG[`pipe-${pipeType}`] || null;
}

export function getBackgroundImage(bg = 'day') {
  return IMG[`bg-${bg}`] || null;
}

export function getDigitImage(digit) {
  return IMG['d' + digit] || null;
}

export function drawSpriteScore(ctx, score, y = 20, scale = 1) {
  const s = String(score);
  const dw = 24 * scale;
  const dh = 36 * scale;
  const totalWidth = s.length * dw;
  let x = (W - totalWidth) / 2;

  for (let i = 0; i < s.length; i++) {
    const img = getDigitImage(s[i]);
    if (img) ctx.drawImage(img, x + i * dw, y, dw, dh);
  }
}

export function drawLoadingBar(ctx, x, y, w, h, progress) {
  ctx.fillStyle = '#0b1118';
  roundedRect(ctx, x, y, w, h, 8);
  ctx.fill();

  const innerW = Math.max(0, (w - 4) * progress);
  const grad = ctx.createLinearGradient(x, y, x + w, y);
  grad.addColorStop(0, '#67d8ff');
  grad.addColorStop(0.5, '#8be9ff');
  grad.addColorStop(1, '#ffd166');

  ctx.fillStyle = grad;
  roundedRect(ctx, x + 2, y + 2, innerW, h - 4, 6);
  ctx.fill();

  ctx.strokeStyle = '#d9f7ff';
  ctx.lineWidth = 2;
  roundedRect(ctx, x, y, w, h, 8);
  ctx.stroke();
}

function roundedRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}