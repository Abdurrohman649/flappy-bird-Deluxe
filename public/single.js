import { DIFFS, GROUND_Y, H, W } from './config.js';
import { addSingleRecord, getSingleRecords, getSingleSettings, saveSingleSettings } from './storage.js';
import {
  Button,
  drawBadge,
  drawBird,
  drawCard,
  drawPanel,
  drawPipes,
  drawText,
  drawTextShadow
} from './ui.js';
import { IMG, playSound } from './assets.js';

export function createSingleState(profile) {
  return {
    settings: getSingleSettings(),
    recordsScroll: 0,
    menuButtons: [],
    recordButtons: [],
    profile,
    game: {
      state: 'idle',
      score: 0,
      overTimer: 0,
      pipeTimer: 0,
      pipes: [],
      bird: {
        x: 60,
        y: H / 2 - 30,
        w: 34,
        h: 24,
        vel: 0,
        rot: 0,
        anim: 0,
        animT: 0
      },
      pulse: 0
    }
  };
}

export function buildSingleMenuButtons(state) {
  state.menuButtons = [
    new Button(18, 466, 80, 26, 'НАЗАД', 'back', 1.0, 'blue'),
    new Button(104, 466, 80, 26, 'ИГРАТЬ', 'single-start', 1.0, 'green'),
    new Button(190, 466, 80, 26, 'РЕКОРДЫ', 'single-records', 0.95, 'gold'),

    new Button(18, 138, 78, 24, 'EASY', 'sdiff-easy', 1.0, 'green'),
    new Button(105, 138, 78, 24, 'NORMAL', 'sdiff-normal', 1.0, 'gold'),
    new Button(192, 138, 78, 24, 'HARD', 'sdiff-hard', 1.0, 'blue'),

    new Button(28, 214, 100, 24, 'DAY', 'sbg-day', 1.0, 'blue'),
    new Button(160, 214, 100, 24, 'NIGHT', 'sbg-night', 1.0, 'blue'),

    new Button(28, 286, 100, 24, 'GREEN', 'spipe-green', 1.0, 'green'),
    new Button(160, 286, 100, 24, 'RED', 'spipe-red', 1.0, 'gold')
  ];
}

export function buildSingleRecordButtons(state) {
  state.recordButtons = [
    new Button(18, 466, 80, 26, 'НАЗАД', 'back', 1.0, 'blue'),
    new Button(104, 466, 80, 26, 'UP', 'up', 1.0, 'blue'),
    new Button(190, 466, 80, 26, 'DOWN', 'down', 1.0, 'blue')
  ];
}

export function drawSingleMenu(ctx, state, W) {
  drawPanel(ctx, 10, 16, 268, 480, 'ОДИНОЧНАЯ ИГРА', '#81c784');

  drawTextShadow(ctx, 'SINGLE MODE', W / 2, 32, 2.0, '#e6ffe0', '#234100', 'center');
  drawText(ctx, 'ТРЕНИРУЙСЯ И БЕЙ СВОЙ РЕКОРД', W / 2, 52, 1.0, '#ddf7d3', 'center');

  // Главная карточка режима
  drawCard(ctx, 20, 70, 248, 52, '#81c784');
  drawBird(ctx, state.profile.color, 34, 82, 34, 24);
  drawText(ctx, state.profile.name.slice(0, 14), 82, 92, 1.2, '#fff', 'left');
  drawText(ctx, `BEST ${getBestSingle()}`, 258, 92, 1.2, '#fff', 'right');

  // Блок сложности
  drawCard(ctx, 20, 126, 248, 50, '#81c784');
  drawText(ctx, 'СЛОЖНОСТЬ', W / 2, 116 + 18, 1.2, '#ffd166', 'center');
  drawText(ctx, 'ВЛИЯЕТ НА GAP / SPEED / GRAVITY', W / 2, 170, 0.95, '#d8f2cf', 'center');

  // Блок фона
  drawCard(ctx, 20, 202, 248, 48, '#6bb8d6');
  drawText(ctx, 'ФОН', W / 2, 198 + 18, 1.2, '#ffd166', 'center');
  drawText(ctx, state.settings.bg === 'day' ? 'СВЕТЛЫЙ И ЧИСТЫЙ ДЕНЬ' : 'ТЁМНАЯ НОЧНАЯ АТМОСФЕРА', W / 2, 244, 0.95, '#d8f2ff', 'center');

  // Блок труб
  drawCard(ctx, 20, 274, 248, 48, '#ffd166');
  drawText(ctx, 'ТРУБЫ', W / 2, 270 + 18, 1.2, '#684400', 'center');
  drawText(ctx, state.settings.pipe === 'green' ? 'КЛАССИЧЕСКИЕ ЗЕЛЁНЫЕ ТРУБЫ' : 'АЛЬТЕРНАТИВНЫЕ КРАСНЫЕ ТРУБЫ', W / 2, 316, 0.95, '#684400', 'center');

  // Низ
  drawCard(ctx, 20, 340, 248, 64, '#5ca9c9');
  drawText(ctx, 'ПОДСКАЗКА', W / 2, 352, 1.2, '#fff', 'center');
  drawText(ctx, 'SPACE / TAP = FLAP', W / 2, 370, 1.0, '#dff6ff', 'center');
  drawText(ctx, 'РЕКОРДЫ СОХРАНЯЮТСЯ ЛОКАЛЬНО', W / 2, 386, 1.0, '#dff6ff', 'center');

  for (const b of state.menuButtons) {
    const active =
      b.id === `sdiff-${state.settings.diff}` ||
      b.id === `sbg-${state.settings.bg}` ||
      b.id === `spipe-${state.settings.pipe}`;
    b.draw(ctx, active);
  }
}

export function handleSingleMenuButton(state, id) {
  if (id.startsWith('sdiff-')) state.settings.diff = id.split('-')[1];
  else if (id.startsWith('sbg-')) state.settings.bg = id.split('-')[1];
  else if (id.startsWith('spipe-')) state.settings.pipe = id.split('-')[1];

  saveSingleSettings(state.settings);
}

export function drawSingleRecords(ctx, state) {
  drawPanel(ctx, 10, 16, 268, 480, 'РЕКОРДЫ ОДИНОЧНОЙ', '#81c784');

  drawTextShadow(ctx, 'BEST SCORES', W / 2, 32, 1.9, '#e6ffe0', '#234100', 'center');
  drawText(ctx, 'ТОП ЛОКАЛЬНЫХ РЕЗУЛЬТАТОВ', W / 2, 52, 1.0, '#ddf7d3', 'center');

  const list = getSingleRecords();
  const start = Math.max(0, state.recordsScroll);

  if (!list.length) {
    drawCard(ctx, 22, 110, 244, 80, '#81c784');
    drawText(ctx, 'ПОКА ПУСТО', W / 2, 138, 1.6, '#fff', 'center');
    drawText(ctx, 'СЫГРАЙ ПЕРВЫЙ ЗАБЕГ', W / 2, 156, 1.0, '#ddf7d3', 'center');
  } else {
    for (let i = 0; i < 10 && start + i < list.length; i++) {
      const r = list[start + i];
      const y = 72 + i * 34;

      drawCard(ctx, 16, y, 256, 26, i === 0 && start === 0 ? '#ffd166' : '#81c784');

      drawText(ctx, `#${start + i + 1}`, 22, y + 7, 1.25, i === 0 && start === 0 ? '#5a3200' : '#fff', 'left');
      drawText(ctx, `${r.score}`, 64, y + 7, 1.35, i === 0 && start === 0 ? '#5a3200' : '#fff', 'left');

      drawBadge(ctx, 106, y + 5, r.diff.toUpperCase(), diffBadge(r.diff), '#fff');
      drawBadge(ctx, 170, y + 5, r.bg.toUpperCase(), '#8be9ff', '#003344');
      drawBadge(ctx, 224, y + 5, r.pipe.toUpperCase(), r.pipe === 'green' ? '#98d34d' : '#ff8a80', '#fff');
    }
  }

  drawCard(ctx, 22, 408, 244, 40, '#5ca9c9');
  drawText(ctx, `ПОКАЗАНО С ${start + 1} ПО ${Math.min(start + 10, list.length || 0)}`, W / 2, 422, 1.0, '#fff', 'center');
  drawText(ctx, `ВСЕГО ЗАПИСЕЙ ${list.length}`, W / 2, 436, 1.0, '#dff6ff', 'center');

  for (const b of state.recordButtons) b.draw(ctx);
}

export function handleSingleRecordButton(state, id) {
  const list = getSingleRecords();
  if (id === 'up') state.recordsScroll = Math.max(0, state.recordsScroll - 1);
  if (id === 'down') state.recordsScroll = Math.min(Math.max(0, list.length - 10), state.recordsScroll + 1);
}

export function resetSingleGame(state) {
  state.game.state = 'idle';
  state.game.score = 0;
  state.game.overTimer = 0;
  state.game.pipeTimer = 0;
  state.game.pipes = [];
  state.game.pulse = 0;

  Object.assign(state.game.bird, {
    x: 60,
    y: H / 2 - 30,
    vel: 0,
    rot: 0,
    anim: 0,
    animT: 0
  });
}

export function updateSingleGame(state) {
  const P = DIFFS[state.settings.diff];
  const b = state.game.bird;

  b.animT++;
  if (b.animT >= 8) {
    b.animT = 0;
    b.anim = (b.anim + 1) % 3;
  }

  state.game.pulse += 0.06;

  if (state.game.state === 'idle') {
    b.y += Math.sin(Date.now() / 250) * 0.3;
    return;
  }

  if (state.game.state === 'over') {
    state.game.overTimer++;
    return;
  }

  state.game.pipeTimer++;
  if (state.game.pipeTimer >= P.spawnRate) {
    state.game.pipeTimer = 0;
    const minTop = 60;
    const maxTop = GROUND_Y - P.gap - 60;
    const topH = minTop + Math.random() * (maxTop - minTop);
    state.game.pipes.push({
      x: W,
      topH,
      botY: topH + P.gap,
      w: 52,
      scored: false
    });
  }

  b.vel += P.gravity;
  b.y += b.vel;
  b.rot = b.vel < 0 ? Math.max(-30, b.vel * 4) : Math.min(90, b.rot + 3);

  for (let i = state.game.pipes.length - 1; i >= 0; i--) {
    const p = state.game.pipes[i];
    p.x -= P.speed;

    if (!p.scored && p.x + p.w < b.x) {
      p.scored = true;
      state.game.score++;
      playSound('point', 0.25);
    }

    if (p.x + p.w < -10) state.game.pipes.splice(i, 1);
  }

  const bb = { x: b.x + 3, y: b.y + 3, w: b.w - 6, h: b.h - 6 };

  if (bb.y + bb.h >= GROUND_Y) {
    b.y = GROUND_Y - b.h;
    state.game.state = 'over';
    addSingleRecord(state.game.score, state.settings);
    playSound('hit', 0.3);
    return;
  }

  for (const p of state.game.pipes) {
    const top = { x: p.x, y: 0, w: p.w, h: p.topH };
    const bot = { x: p.x, y: p.botY, w: p.w, h: H - p.botY };

    const hitTop =
      bb.x < top.x + top.w &&
      bb.x + bb.w > top.x &&
      bb.y < top.y + top.h &&
      bb.y + bb.h > top.y;

    const hitBottom =
      bb.x < bot.x + bot.w &&
      bb.x + bb.w > bot.x &&
      bb.y < bot.y + bot.h &&
      bb.y + bb.h > bot.y;

    if (hitTop || hitBottom) {
      state.game.state = 'over';
      addSingleRecord(state.game.score, state.settings);
      playSound('hit', 0.3);
      return;
    }
  }
}

export function drawSingleGame(ctx, state, drawBG, drawGroundFn, drawMobileFlapButton) {
  drawBG(state.settings.bg);
  drawPipes(ctx, state.settings.pipe, state.game.pipes, H);
  drawGroundFn();

  const flaps = ['downflap', 'midflap', 'upflap'];
  const b = state.game.bird;
  const img = IMG[`${state.profile.color}-${flaps[b.anim]}`];

  if (img) {
    ctx.save();
    ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
    ctx.rotate(b.rot * Math.PI / 180);
    ctx.drawImage(img, -b.w / 2, -b.h / 2, b.w, b.h);
    ctx.restore();
  }

  drawTextShadow(ctx, 'SINGLE', W / 2, 12, 2, '#ffd166', '#000', 'center');
  drawTextShadow(ctx, String(state.game.score), W / 2, 40, 3, '#fff', '#000', 'center');
  drawMobileFlapButton(ctx);

  // Мини-плашки сверху
  drawBadge(ctx, 12, 12, state.settings.diff.toUpperCase(), diffBadge(state.settings.diff), '#fff');
  drawBadge(ctx, 212, 12, state.settings.pipe.toUpperCase(), state.settings.pipe === 'green' ? '#98d34d' : '#ff8a80', '#fff');

  if (state.game.state === 'idle') {
    drawPanel(ctx, 34, 126, 220, 108, 'СТАРТ', '#81c784');
    drawText(ctx, 'НАЖМИ НА ЭКРАН', W / 2, 162, 1.5, '#fff', 'center');
    drawText(ctx, 'ПРОЛЕТАЙ МЕЖДУ ТРУБАМИ', W / 2, 182, 1.0, '#ddf7d3', 'center');
    drawText(ctx, `BEST ${getBestSingle()}`, W / 2, 200, 1.2, '#ffd166', 'center');
  }

  if (state.game.state === 'over') {
    const medal = getMedal(state.game.score);

    drawPanel(ctx, 28, 118, 232, 166, 'GAME OVER', '#ff8a80');
    drawText(ctx, `СЧЕТ ${state.game.score}`, W / 2, 154, 1.8, '#fff', 'center');
    drawText(ctx, `ЛУЧШИЙ ${getBestSingle()}`, W / 2, 176, 1.2, '#ffd7d7', 'center');

    drawCard(ctx, 70, 190, 148, 36, medal.bg);
    drawText(ctx, medal.label, W / 2, 202, 1.2, medal.text, 'center');
    drawText(ctx, medal.sub, W / 2, 216, 1.0, medal.text, 'center');

    drawText(ctx, 'TAP = СЫГРАТЬ СНОВА', W / 2, 244, 1.1, '#ffffff', 'center');
    drawText(ctx, 'ESC = НАЗАД В МЕНЮ', W / 2, 258, 1.0, '#ffd7d7', 'center');
  }
}

function getBestSingle() {
  const list = getSingleRecords();
  return list.length ? list[0].score : 0;
}

function getMedal(score) {
  if (score >= 50) {
    return {
      label: 'LEGEND',
      sub: 'НЕВЕРОЯТНЫЙ РЕЗУЛЬТАТ',
      bg: '#ffd166',
      text: '#5a3200'
    };
  }
  if (score >= 30) {
    return {
      label: 'MASTER',
      sub: 'ОТЛИЧНАЯ ИГРА',
      bg: '#8be9ff',
      text: '#003344'
    };
  }
  if (score >= 15) {
    return {
      label: 'PRO',
      sub: 'ХОРОШИЙ ПРОГРЕСС',
      bg: '#98d34d',
      text: '#1f3600'
    };
  }
  if (score >= 5) {
    return {
      label: 'ROOKIE',
      sub: 'УЖЕ НЕПЛОХО',
      bg: '#ffcc80',
      text: '#5a3200'
    };
  }
  return {
    label: 'TRY AGAIN',
    sub: 'ЕЩЁ ОДИН ЗАБЕГ?',
    bg: '#d7dde2',
    text: '#263238'
  };
}

function diffBadge(diff) {
  if (diff === 'easy') return '#81c784';
  if (diff === 'normal') return '#ffd166';
  return '#64b5f6';
}