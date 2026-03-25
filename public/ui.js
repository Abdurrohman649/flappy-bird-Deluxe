import { W, H } from './config.js';
import { IMG } from './assets.js';

export const FONT = {
  ' ': [0,0,0,0,0,0,0],

  // LATIN
  'A': [0x4,0xA,0x11,0x1F,0x11,0x11,0x11],
  'B': [0x1E,0x11,0x11,0x1E,0x11,0x11,0x1E],
  'C': [0xE,0x11,0x10,0x10,0x10,0x11,0xE],
  'D': [0x1E,0x11,0x11,0x11,0x11,0x11,0x1E],
  'E': [0x1F,0x10,0x10,0x1E,0x10,0x10,0x1F],
  'F': [0x1F,0x10,0x10,0x1E,0x10,0x10,0x10],
  'G': [0xE,0x11,0x10,0x17,0x11,0x11,0xE],
  'H': [0x11,0x11,0x11,0x1F,0x11,0x11,0x11],
  'I': [0xE,0x4,0x4,0x4,0x4,0x4,0xE],
  'J': [0x1F,0x2,0x2,0x2,0x2,0x12,0xC],
  'K': [0x11,0x12,0x14,0x18,0x14,0x12,0x11],
  'L': [0x10,0x10,0x10,0x10,0x10,0x10,0x1F],
  'M': [0x11,0x1B,0x15,0x15,0x11,0x11,0x11],
  'N': [0x11,0x11,0x19,0x15,0x13,0x11,0x11],
  'O': [0xE,0x11,0x11,0x11,0x11,0x11,0xE],
  'P': [0x1E,0x11,0x11,0x1E,0x10,0x10,0x10],
  'Q': [0xE,0x11,0x11,0x11,0x15,0x12,0xD],
  'R': [0x1E,0x11,0x11,0x1E,0x14,0x12,0x11],
  'S': [0xE,0x11,0x10,0xE,0x1,0x11,0xE],
  'T': [0x1F,0x4,0x4,0x4,0x4,0x4,0x4],
  'U': [0x11,0x11,0x11,0x11,0x11,0x11,0xE],
  'V': [0x11,0x11,0x11,0x11,0x11,0xA,0x4],
  'W': [0x11,0x11,0x11,0x15,0x15,0x15,0xA],
  'X': [0x11,0x11,0xA,0x4,0xA,0x11,0x11],
  'Y': [0x11,0x11,0xA,0x4,0x4,0x4,0x4],
  'Z': [0x1F,0x1,0x2,0x4,0x8,0x10,0x1F],

  // NUMBERS
  '0': [0xE,0x13,0x15,0x19,0x11,0x11,0xE],
  '1': [0x4,0xC,0x4,0x4,0x4,0x4,0xE],
  '2': [0xE,0x11,0x1,0x2,0x4,0x8,0x1F],
  '3': [0xE,0x11,0x1,0x6,0x1,0x11,0xE],
  '4': [0x2,0x6,0xA,0x12,0x1F,0x2,0x2],
  '5': [0x1F,0x10,0x1E,0x1,0x1,0x11,0xE],
  '6': [0x6,0x8,0x10,0x1E,0x11,0x11,0xE],
  '7': [0x1F,0x1,0x2,0x4,0x8,0x8,0x8],
  '8': [0xE,0x11,0x11,0xE,0x11,0x11,0xE],
  '9': [0xE,0x11,0x11,0xF,0x1,0x2,0xC],

  // SYMBOLS
  ':': [0,0,4,0,0,4,0],
  '.': [0,0,0,0,0,0,4],
  '!': [0x4,0x4,0x4,0x4,0x4,0,0x4],
  '?': [0xE,0x11,0x1,0x2,0x4,0,0x4],
  '-': [0,0,0,0x1F,0,0,0],
  '+': [0,0x4,0x4,0x1F,0x4,0x4,0],
  '/': [0x1,0x1,0x2,0x4,0x8,0x10,0x10],
  '[': [0xE,0x8,0x8,0x8,0x8,0x8,0xE],
  ']': [0xE,0x2,0x2,0x2,0x2,0x2,0xE],
  '#': [0xA,0xA,0x1F,0xA,0x1F,0xA,0xA],
  '<': [0x2,0x4,0x8,0x10,0x8,0x4,0x2],
  '>': [0x8,0x4,0x2,0x1,0x2,0x4,0x8],
  '%': [0x18,0x19,0x2,0x4,0x8,0x13,0x3],
  '*': [0,0x4,0x15,0xE,0x15,0x4,0],

  // CYRILLIC
  'А': [0x4,0xA,0x11,0x1F,0x11,0x11,0x11],
  'Б': [0x1F,0x10,0x10,0x1E,0x11,0x11,0x1E],
  'В': [0x1E,0x11,0x11,0x1E,0x11,0x11,0x1E],
  'Г': [0x1F,0x10,0x10,0x10,0x10,0x10,0x10],
  'Д': [0x6,0xA,0xA,0xA,0xA,0x1F,0x11],
  'Е': [0x1F,0x10,0x10,0x1E,0x10,0x10,0x1F],
  'Ё': [0xA,0x1F,0x10,0x1E,0x10,0x10,0x1F],
  'Ж': [0x15,0x15,0xE,0x4,0xE,0x15,0x15],
  'З': [0xE,0x11,0x1,0x6,0x1,0x11,0xE],
  'И': [0x11,0x11,0x13,0x15,0x19,0x11,0x11],
  'Й': [0xA,0x4,0x11,0x13,0x15,0x19,0x11],
  'К': [0x11,0x12,0x14,0x18,0x14,0x12,0x11],
  'Л': [0x7,0x9,0x9,0x9,0x9,0x9,0x11],
  'М': [0x11,0x1B,0x15,0x15,0x11,0x11,0x11],
  'Н': [0x11,0x11,0x11,0x1F,0x11,0x11,0x11],
  'О': [0xE,0x11,0x11,0x11,0x11,0x11,0xE],
  'П': [0x1F,0x11,0x11,0x11,0x11,0x11,0x11],
  'Р': [0x1E,0x11,0x11,0x1E,0x10,0x10,0x10],
  'С': [0xE,0x11,0x10,0x10,0x10,0x11,0xE],
  'Т': [0x1F,0x4,0x4,0x4,0x4,0x4,0x4],
  'У': [0x11,0x11,0xA,0x4,0x4,0x8,0x10],
  'Ф': [0x4,0xE,0x15,0x15,0xE,0x4,0x4],
  'Х': [0x11,0x11,0xA,0x4,0xA,0x11,0x11],
  'Ц': [0x12,0x12,0x12,0x12,0x12,0x1F,0x1],
  'Ч': [0x11,0x11,0x11,0xF,0x1,0x1,0x1],
  'Ш': [0x15,0x15,0x15,0x15,0x15,0x15,0x1F],
  'Щ': [0x15,0x15,0x15,0x15,0x15,0x1F,0x1],
  'Ъ': [0x18,0x8,0x8,0xE,0x9,0x9,0xE],
  'Ы': [0x11,0x11,0x11,0x19,0x15,0x15,0x19],
  'Ь': [0x10,0x10,0x10,0x1E,0x11,0x11,0x1E],
  'Э': [0xE,0x11,0x1,0x7,0x1,0x11,0xE],
  'Ю': [0x12,0x15,0x15,0x1D,0x15,0x15,0x12],
  'Я': [0xF,0x11,0x11,0xF,0x5,0x9,0x11]
};

export function drawChar(ctx, ch, x, y, size, color) {
  const up = (ch + '').toUpperCase();
  const data = FONT[up] || FONT[ch];
  if (!data) return;

  ctx.fillStyle = color;
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 5; col++) {
      if (data[row] & (0x10 >> col)) {
        ctx.fillRect(x + col * size, y + row * size, size, size);
      }
    }
  }
}

export function drawText(ctx, text, x, y, size, color, align = 'left') {
  text = String(text);
  const charW = size * 6;
  let sx = x;

  if (align === 'center') sx = x - (text.length * charW) / 2;
  else if (align === 'right') sx = x - text.length * charW;

  for (let i = 0; i < text.length; i++) {
    drawChar(ctx, text[i], sx + i * charW, y, size, color);
  }
}

export function drawTextShadow(ctx, text, x, y, size, color, shadowColor, align = 'left') {
  drawText(ctx, text, x + size, y + size, size, shadowColor, align);
  drawText(ctx, text, x, y, size, color, align);
}

export class Button {
  constructor(x, y, w, h, text, id = '', size = 1.3, style = 'gold') {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.id = id;
    this.size = size;
    this.style = style;
    this.hover = false;
  }

  contains(px, py) {
    return px >= this.x && px <= this.x + this.w &&
           py >= this.y && py <= this.y + this.h;
  }

  draw(ctx, active = false, disabled = false) {
    ctx.save();
    if (disabled) ctx.globalAlpha = 0.45;

    const palette = getButtonPalette(this.style, active, this.hover);

    ctx.fillStyle = palette.shadow;
    roundRect(ctx, this.x + 2, this.y + 3, this.w, this.h, 7);
    ctx.fill();

    ctx.fillStyle = palette.outer;
    roundRect(ctx, this.x, this.y, this.w, this.h, 7);
    ctx.fill();

    ctx.fillStyle = palette.inner;
    roundRect(ctx, this.x + 2, this.y + 2, this.w - 4, this.h - 4, 6);
    ctx.fill();

    ctx.fillStyle = palette.highlight;
    roundRect(ctx, this.x + 3, this.y + 3, this.w - 6, 7, 5);
    ctx.fill();

    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 2;
    roundRect(ctx, this.x, this.y, this.w, this.h, 7);
    ctx.stroke();

    drawTextShadow(
      ctx,
      this.text,
      this.x + this.w / 2,
      this.y + this.h / 2 - this.size * 3.4,
      this.size,
      palette.text,
      palette.textShadow,
      'center'
    );

    ctx.restore();
  }
}

export class InputBox {
  constructor(x, y, w, h, value = '', placeholder = '') {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.value = value;
    this.placeholder = placeholder;
    this.active = false;
    this.maxLength = 24;
    this.password = false;
  }

  contains(px, py) {
    return px >= this.x && px <= this.x + this.w &&
           py >= this.y && py <= this.y + this.h;
  }

  draw(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    roundRect(ctx, this.x + 2, this.y + 3, this.w, this.h, 6);
    ctx.fill();

    ctx.fillStyle = '#17303f';
    roundRect(ctx, this.x, this.y, this.w, this.h, 6);
    ctx.fill();

    ctx.fillStyle = '#214558';
    roundRect(ctx, this.x + 2, this.y + 2, this.w - 4, this.h - 4, 5);
    ctx.fill();

    ctx.strokeStyle = this.active ? '#ffd166' : '#6bb8d6';
    ctx.lineWidth = 2;
    roundRect(ctx, this.x, this.y, this.w, this.h, 6);
    ctx.stroke();

    const shown = this.password ? '*'.repeat(this.value.length) : this.value;
    const text = shown || this.placeholder;
    const col = shown ? '#ffffff' : '#b7d5df';

    drawText(ctx, text, this.x + 8, this.y + this.h / 2 - 5, 1.2, col, 'left');

    if (this.active && ((Date.now() / 500 | 0) % 2 === 0)) {
      const tx = this.x + 8 + shown.length * 1.2 * 6;
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(tx, this.y + 6, 2, this.h - 12);
    }
  }
}

export function drawPanel(ctx, x, y, w, h, title = '', accent = '#4fc3f7') {
  ctx.fillStyle = 'rgba(0,0,0,0.24)';
  roundRect(ctx, x + 3, y + 4, w, h, 10);
  ctx.fill();

  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, 'rgba(24,56,72,0.88)');
  grad.addColorStop(1, 'rgba(16,35,50,0.90)');
  ctx.fillStyle = grad;
  roundRect(ctx, x, y, w, h, 10);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  roundRect(ctx, x + 3, y + 3, w - 6, 20, 8);
  ctx.fill();

  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 10);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  roundRect(ctx, x + 3, y + 3, w - 6, h - 6, 8);
  ctx.stroke();

  if (title) {
    drawTextShadow(ctx, title, x + w / 2, y + 10, 1.4, accent, '#0b151d', 'center');
  }
}

export function drawBird(ctx, color, x, y, w = 32, h = 24, flap = 'midflap') {
  const img = IMG[`${color}-${flap}`];
  if (img) ctx.drawImage(img, x, y, w, h);
}

export function drawAvatar(ctx, avatar, x, y, size = 12, color = '#ffd166') {
  ctx.save();
  ctx.fillStyle = color;

  if (avatar === 'STAR') {
    ctx.fillRect(x + 4, y, 4, 12);
    ctx.fillRect(x, y + 4, 12, 4);
    ctx.fillRect(x + 2, y + 2, 8, 8);
  } else if (avatar === 'CROWN') {
    ctx.fillRect(x, y + 8, 12, 4);
    ctx.fillRect(x, y + 4, 2, 4);
    ctx.fillRect(x + 5, y + 2, 2, 6);
    ctx.fillRect(x + 10, y + 4, 2, 4);
  } else if (avatar === 'BOLT') {
    ctx.fillRect(x + 6, y, 2, 5);
    ctx.fillRect(x + 4, y + 4, 4, 2);
    ctx.fillRect(x + 2, y + 6, 4, 2);
    ctx.fillRect(x + 4, y + 8, 2, 4);
  } else if (avatar === 'HEART') {
    ctx.fillRect(x + 2, y + 2, 3, 3);
    ctx.fillRect(x + 7, y + 2, 3, 3);
    ctx.fillRect(x + 1, y + 4, 10, 3);
    ctx.fillRect(x + 2, y + 7, 8, 2);
    ctx.fillRect(x + 4, y + 9, 4, 2);
  } else if (avatar === 'MOON') {
    ctx.fillRect(x + 4, y, 4, 12);
    ctx.clearRect(x + 6, y + 2, 4, 8);
  } else if (avatar === 'SKULL') {
    ctx.fillRect(x + 2, y + 1, 8, 7);
    ctx.fillRect(x + 4, y + 8, 4, 2);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 4, y + 3, 1, 1);
    ctx.fillRect(x + 7, y + 3, 1, 1);
  }

  ctx.restore();
}

export function drawBackground(ctx, bgName) {
  const img = IMG[`bg-${bgName}`];
  if (img) {
    ctx.drawImage(img, 0, 0, W, H);
  } else {
    ctx.fillStyle = '#4ec0ca';
    ctx.fillRect(0, 0, W, H);
  }

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(255,255,255,0.03)');
  grad.addColorStop(1, 'rgba(0,0,0,0.08)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

export function drawGround(ctx, x, groundY) {
  const img = IMG['base'];
  if (!img) return;
  ctx.drawImage(img, x, groundY);
  ctx.drawImage(img, x + img.width, groundY);
  ctx.drawImage(img, x + img.width * 2, groundY);
}

export function drawPipes(ctx, pipeType, pipes, H) {
  const img = IMG[`pipe-${pipeType}`];
  if (!img) return;

  for (const p of pipes) {
    ctx.save();
    ctx.translate(p.x + p.w / 2, p.topH);
    ctx.scale(1, -1);
    ctx.drawImage(img, -p.w / 2, 0, p.w, p.topH + 20);
    ctx.restore();

    ctx.drawImage(img, p.x, p.botY, p.w, H - p.botY);
  }
}

export function drawBadge(ctx, x, y, text, bg = '#ffd166', color = '#3b2c00') {
  const w = text.length * 7 + 10;

  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  roundRect(ctx, x + 1, y + 2, w, 14, 4);
  ctx.fill();

  ctx.fillStyle = bg;
  roundRect(ctx, x, y, w, 14, 4);
  ctx.fill();

  ctx.strokeStyle = 'rgba(0,0,0,0.22)';
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, 14, 4);
  ctx.stroke();

  drawText(ctx, text, x + w / 2, y + 4, 1, color, 'center');
}

export function drawCard(ctx, x, y, w, h, accent = '#6bb8d6') {
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  roundRect(ctx, x + 2, y + 3, w, h, 8);
  ctx.fill();

  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, 'rgba(27,53,68,0.88)');
  grad.addColorStop(1, 'rgba(17,34,46,0.92)');
  ctx.fillStyle = grad;
  roundRect(ctx, x, y, w, h, 8);
  ctx.fill();

  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, h, 8);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  roundRect(ctx, x + 2, y + 2, w - 4, 10, 6);
  ctx.fill();
}

function getButtonPalette(style, active, hover) {
  if (style === 'blue') {
    if (active) {
      return {
        shadow: '#0f3d53',
        outer: '#73d2f6',
        inner: '#4db6e7',
        highlight: 'rgba(255,255,255,0.35)',
        border: '#d8f7ff',
        text: '#083447',
        textShadow: '#ffffff'
      };
    }
    if (hover) {
      return {
        shadow: '#14384c',
        outer: '#5ec0e8',
        inner: '#3f9ec7',
        highlight: 'rgba(255,255,255,0.28)',
        border: '#bfefff',
        text: '#ffffff',
        textShadow: '#0d2230'
      };
    }
    return {
      shadow: '#122d3c',
      outer: '#4aa6cc',
      inner: '#2f7e9f',
      highlight: 'rgba(255,255,255,0.20)',
      border: '#9fdcf6',
      text: '#ffffff',
      textShadow: '#081923'
    };
  }

  if (style === 'green') {
    if (active) {
      return {
        shadow: '#3c5418',
        outer: '#c9ef7a',
        inner: '#98d34d',
        highlight: 'rgba(255,255,255,0.35)',
        border: '#efffd0',
        text: '#284100',
        textShadow: '#fff'
      };
    }
    if (hover) {
      return {
        shadow: '#375118',
        outer: '#a9df5a',
        inner: '#74ba36',
        highlight: 'rgba(255,255,255,0.25)',
        border: '#dff9b7',
        text: '#fff',
        textShadow: '#233600'
      };
    }
    return {
      shadow: '#2c4213',
      outer: '#89c53f',
      inner: '#5c9c22',
      highlight: 'rgba(255,255,255,0.18)',
      border: '#c9ef7a',
      text: '#fff',
      textShadow: '#203000'
    };
  }

  // gold
  if (active) {
    return {
      shadow: '#7a4f12',
      outer: '#ffe082',
      inner: '#f6c34c',
      highlight: 'rgba(255,255,255,0.40)',
      border: '#fff4c2',
      text: '#533000',
      textShadow: '#ffffff'
    };
  }
  if (hover) {
    return {
      shadow: '#70440f',
      outer: '#f7dc6f',
      inner: '#e9ae35',
      highlight: 'rgba(255,255,255,0.28)',
      border: '#ffe7a0',
      text: '#ffffff',
      textShadow: '#5d3300'
    };
  }
  return {
    shadow: '#5a360d',
    outer: '#e0a93c',
    inner: '#c8841f',
    highlight: 'rgba(255,255,255,0.18)',
    border: '#f7dc6f',
    text: '#ffffff',
    textShadow: '#5a3200'
  };
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}