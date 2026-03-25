import { AVATARS, COLORS } from './config.js';
import { getProfile, saveProfile, getSingleRecords, getMultiRecords } from './storage.js';
import {
  Button,
  InputBox,
  drawAvatar,
  drawBadge,
  drawBird,
  drawCard,
  drawPanel,
  drawText,
  drawTextShadow
} from './ui.js';

export function createProfileState() {
  const profile = getProfile();

  return {
    profile,
    nameInput: new InputBox(44, 122, 200, 30, profile.name, 'ИМЯ'),
    buttons: []
  };
}

export function buildProfileButtons(state) {
  state.buttons = [
    new Button(18, 466, 80, 26, 'НАЗАД', 'back', 1.0, 'blue'),
    new Button(104, 466, 80, 26, 'СОХРАН', 'save-profile', 1.0, 'green'),
    new Button(190, 466, 80, 26, 'СБРОС', 'reset-profile', 1.0, 'gold')
  ];

  for (let i = 0; i < COLORS.length; i++) {
    const color = COLORS[i];
    const style = color === 'yellow' ? 'gold' : color === 'blue' ? 'blue' : 'green';
    state.buttons.push(
      new Button(28 + i * 80, 214, 72, 28, color.toUpperCase(), `color-${color}`, 1.0, style)
    );
  }

  for (let i = 0; i < AVATARS.length; i++) {
    state.buttons.push(
      new Button(
        28 + (i % 3) * 80,
        320 + Math.floor(i / 3) * 42,
        72,
        28,
        AVATARS[i],
        `avatar-${AVATARS[i]}`,
        0.95,
        i % 3 === 0 ? 'gold' : i % 3 === 1 ? 'blue' : 'green'
      )
    );
  }
}

export function drawProfile(ctx, state, W) {
  const profile = state.profile;

  drawPanel(ctx, 10, 16, 268, 480, 'ПРОФИЛЬ ИГРОКА', '#69d2ff');

  // Заголовок
  drawTextShadow(ctx, 'PROFILE', W / 2, 30, 2.1, '#d9ffff', '#083540', 'center');
  drawText(ctx, 'ЛОКАЛЬНЫЙ ИГРОВОЙ ПРОФИЛЬ', W / 2, 52, 1.0, '#d6f4f9', 'center');

  // Главная карточка персонажа
  drawCard(ctx, 22, 68, 244, 132, '#69d2ff');

  drawText(ctx, 'ИМЯ', W / 2, 92, 1.2, '#ffd166', 'center');
  state.nameInput.draw(ctx);

  // Персонаж
  drawBird(ctx, profile.color, W / 2 - 22, 160, 44, 32);
  drawAvatar(ctx, profile.avatar, W / 2 - 6, 192, 12, '#ffd166');

  drawText(ctx, profile.name || 'ИГРОК', W / 2, 176, 1.2, '#ffffff', 'center');

  // Бейджи
  drawBadge(ctx, 34, 168, profile.color.toUpperCase(), colorBadge(profile.color), '#fff');
  drawBadge(ctx, 188, 168, profile.avatar, '#8be9ff', '#003344');

  // Блок цвета
  drawTextShadow(ctx, 'ЦВЕТ ПТИЦЫ', W / 2, 250, 1.45, '#ffffff', '#0c2230', 'center');
  drawText(ctx, 'ВЫБЕРИ СВОЙ ОСНОВНОЙ ЦВЕТ', W / 2, 266, 1.0, '#cfe7ef', 'center');

  // Подсветка для активного цвета
  drawCard(ctx, 20, 205, 248, 48, '#4db6ac');

  // Блок аватарки
  drawTextShadow(ctx, 'АВАТАРКА', W / 2, 292, 1.45, '#ffffff', '#0c2230', 'center');
  drawText(ctx, 'ВЫБЕРИ ЗНАЧОК ПРОФИЛЯ', W / 2, 308, 1.0, '#cfe7ef', 'center');

  drawCard(ctx, 20, 312, 248, 100, '#ba68c8');

  // Иконки-подсказки поверх кнопок аватаров
  for (let i = 0; i < AVATARS.length; i++) {
    const x = 58 + (i % 3) * 80;
    const y = 328 + Math.floor(i / 3) * 42;
    drawAvatar(ctx, AVATARS[i], x, y, 12, '#ffd166');
  }

  // Низ — статистика
  drawCard(ctx, 22, 418, 244, 40, '#ffd166');
  const stats = getProfileStats(profile);
  drawText(ctx, `SINGLE BEST ${stats.bestSingle}`, 32, 430, 1.0, '#503000', 'left');
  drawText(ctx, `MULTI GAMES ${stats.multiGames}`, 258, 430, 1.0, '#503000', 'right');
  drawText(ctx, `TOTAL RECORDS ${stats.totalRecords}`, W / 2, 444, 1.0, '#503000', 'center');

  for (const b of state.buttons) {
    const active =
      b.id === `color-${profile.color}` ||
      b.id === `avatar-${profile.avatar}`;
    b.draw(ctx, active);
  }
}

export function handleProfileButton(state, id) {
  if (id === 'save-profile') {
    state.profile.name = state.nameInput.value.slice(0, 16) || state.profile.name;
    saveProfile(state.profile);
    return 'saved';
  }

  if (id === 'reset-profile') {
    state.profile.name = 'Игрок';
    state.profile.color = 'yellow';
    state.profile.avatar = 'STAR';
    state.nameInput.value = state.profile.name;
    saveProfile(state.profile);
    return 'saved';
  }

  if (id.startsWith('color-')) {
    state.profile.color = id.split('-')[1];
    saveProfile(state.profile);
  }

  if (id.startsWith('avatar-')) {
    state.profile.avatar = id.split('-')[1];
    saveProfile(state.profile);
  }

  return '';
}

function getProfileStats(profile) {
  const single = getSingleRecords();
  const multi = getMultiRecords();

  const bestSingle = single.length ? single[0].score : 0;
  const multiGames = multi.filter(r => r.name === profile.name).length || multi.length;
  const totalRecords = single.length + multi.length;

  return {
    bestSingle,
    multiGames,
    totalRecords
  };
}

function colorBadge(color) {
  if (color === 'yellow') return '#ffd166';
  if (color === 'blue') return '#8be9ff';
  if (color === 'red') return '#ff8a80';
  return '#cccccc';
}