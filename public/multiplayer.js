import { Button, InputBox, drawAvatar, drawBadge, drawBird, drawCard, drawPanel, drawText, drawTextShadow } from './ui.js';
import { addMultiRecord, getMultiRecords } from './storage.js';
import { H, W } from './config.js';

export function createMultiplayerState(profile) {
  return {
    publicRooms: [],
    roomScroll: 0,
    chatScroll: 0,
    multiRecordScroll: 0,
    roomState: null,
    lobbySettingsDraft: null,
    profile,
    buttons: [],
    chatInput: new InputBox(16, 462, 194, 28, '', 'СООБЩЕНИЕ...'),
    createPasswordInput: new InputBox(44, 210, 200, 28, '', 'ПАРОЛЬ')
  };
}

export function buildMultiMenuButtons(state) {
  state.buttons = [
    new Button(18, 466, 80, 26, 'НАЗАД', 'back', 1.1, 'blue'),
    new Button(104, 466, 80, 26, 'СОЗДАТЬ', 'multi-create', 1.1, 'gold'),
    new Button(190, 466, 80, 26, 'JOIN', 'multi-join', 1.1, 'green'),

    new Button(18, 434, 80, 24, 'UP', 'rooms-up', 1.1, 'blue'),
    new Button(190, 434, 80, 24, 'DOWN', 'rooms-down', 1.1, 'blue')
  ];
}

export function buildCreateRoomButtons(state) {
  state.buttons = [
    new Button(18, 466, 80, 26, 'НАЗАД', 'back', 1.1, 'blue'),
    new Button(104, 466, 80, 26, 'СОЗДАТЬ', 'create-room', 1.1, 'green'),
    new Button(190, 466, 80, 26, 'СОХРАН', 'save-room-settings', 1.0, 'gold'),

    new Button(28, 140, 110, 28, 'PUBLIC', 'cr-public', 1.1, 'blue'),
    new Button(150, 140, 110, 28, 'PRIVATE', 'cr-private', 1.1, 'gold'),

    new Button(28, 186, 110, 28, 'PLAYER', 'cr-player', 1.1, 'green'),
    new Button(150, 186, 110, 28, 'SPECTATOR', 'cr-spectator', 1.0, 'blue'),

    new Button(18, 266, 78, 24, 'EASY', 'cr-diff-easy', 1.0, 'green'),
    new Button(105, 266, 78, 24, 'NORMAL', 'cr-diff-normal', 1.0, 'gold'),
    new Button(192, 266, 78, 24, 'HARD', 'cr-diff-hard', 1.0, 'blue'),

    new Button(28, 314, 100, 24, 'DAY', 'cr-bg-day', 1.0, 'blue'),
    new Button(160, 314, 100, 24, 'NIGHT', 'cr-bg-night', 1.0, 'blue'),

    new Button(28, 354, 100, 24, 'GREEN', 'cr-pipe-green', 1.0, 'green'),
    new Button(160, 354, 100, 24, 'RED', 'cr-pipe-red', 1.0, 'gold'),

    new Button(18, 396, 36, 22, '-', 'cr-max-down', 1.4, 'gold'),
    new Button(234, 396, 36, 22, '+', 'cr-max-up', 1.4, 'green'),

    new Button(18, 424, 36, 22, '-', 'cr-bot-down', 1.4, 'gold'),
    new Button(234, 424, 36, 22, '+', 'cr-bot-up', 1.4, 'green')
  ];

  state.createPasswordInput.password = true;
}

export function buildLobbyButtons(state, me, isHost) {
  state.buttons = [
    new Button(14, 430, 64, 24, me?.ready ? 'НЕ ГОТ' : 'ГОТОВ', 'ready', 1.0, 'green'),
    new Button(84, 430, 58, 24, 'КОД', 'copy-code', 1.0, 'gold'),
    new Button(148, 430, 58, 24, 'ССЫЛ', 'copy-link', 1.0, 'blue'),
    new Button(212, 430, 62, 24, 'ВЫХОД', 'leave', 1.0, 'gold'),

    new Button(18, 88, 78, 22, 'YELLOW', 'lp-yellow', 1.0, 'gold'),
    new Button(105, 88, 78, 22, 'BLUE', 'lp-blue', 1.0, 'blue'),
    new Button(192, 88, 78, 22, 'RED', 'lp-red', 1.0, 'green'),

    new Button(218, 462, 54, 28, 'SEND', 'chat-send', 1.0, 'green'),

    new Button(218, 396, 54, 24, 'CHAT+', 'chat-up', 0.9, 'blue'),
    new Button(218, 368, 54, 24, 'CHAT-', 'chat-down', 0.9, 'blue')
  ];

  if (isHost) {
    state.buttons.push(new Button(84, 398, 120, 26, 'СТАРТ', 'start', 1.2, 'green'));
    state.buttons.push(new Button(210, 398, 62, 26, 'SET', 'lobby-settings', 1.1, 'gold'));
  }
}

export function buildLobbySettingsButtons(state) {
  state.buttons = [
    new Button(18, 466, 80, 26, 'НАЗАД', 'back', 1.1, 'blue'),
    new Button(104, 466, 80, 26, 'СОХРАН', 'save-lobby-settings', 1.0, 'green'),
    new Button(190, 466, 80, 26, 'ПАРОЛЬ', 'edit-pass', 1.0, 'gold'),

    new Button(18, 110, 78, 24, 'EASY', 'ls-diff-easy', 1.0, 'green'),
    new Button(105, 110, 78, 24, 'NORMAL', 'ls-diff-normal', 1.0, 'gold'),
    new Button(192, 110, 78, 24, 'HARD', 'ls-diff-hard', 1.0, 'blue'),

    new Button(28, 160, 100, 24, 'DAY', 'ls-bg-day', 1.0, 'blue'),
    new Button(160, 160, 100, 24, 'NIGHT', 'ls-bg-night', 1.0, 'blue'),

    new Button(28, 210, 100, 24, 'GREEN', 'ls-pipe-green', 1.0, 'green'),
    new Button(160, 210, 100, 24, 'RED', 'ls-pipe-red', 1.0, 'gold'),

    new Button(18, 260, 36, 24, '-', 'ls-max-down', 1.4, 'gold'),
    new Button(234, 260, 36, 24, '+', 'ls-max-up', 1.4, 'green'),

    new Button(18, 310, 36, 24, '-', 'ls-bot-down', 1.4, 'gold'),
    new Button(234, 310, 36, 24, '+', 'ls-bot-up', 1.4, 'green'),

    new Button(18, 360, 36, 24, '-', 'ls-rounds-down', 1.4, 'gold'),
    new Button(234, 360, 36, 24, '+', 'ls-rounds-up', 1.4, 'green'),

    new Button(28, 410, 100, 24, 'PUBLIC', 'ls-public', 1.0, 'blue'),
    new Button(160, 410, 100, 24, 'PRIVATE', 'ls-private', 1.0, 'gold')
  ];
}

export function buildResultsButtons(state, isHost, roomState) {
  state.buttons = [
    new Button(18, 466, 80, 26, 'ВЫЙТИ', 'leave', 1.0, 'gold'),
    new Button(104, 466, 80, 26, 'РЕКОРДЫ', 'multi-records', 0.95, 'blue'),
    new Button(190, 466, 80, 26, 'КОД', 'copy-code', 1.0, 'green')
  ];

  if (isHost) {
    if (roomState.status === 'results') {
      state.buttons.push(new Button(84, 432, 120, 24, 'СЛЕД. РАУНД', 'next-round', 1.0, 'green'));
    }
    if (roomState.status === 'finished') {
      state.buttons.push(new Button(84, 432, 120, 24, 'НОВЫЙ МАТЧ', 'restart-match', 1.0, 'gold'));
    }
  }
}

export function buildMultiRecordButtons(state) {
  state.buttons = [
    new Button(18, 466, 80, 26, 'НАЗАД', 'back', 1.0, 'blue'),
    new Button(104, 466, 80, 26, 'UP', 'up', 1.1, 'blue'),
    new Button(190, 466, 80, 26, 'DOWN', 'down', 1.0, 'blue')
  ];
}

export function drawMultiMenu(ctx, state) {
  drawPanel(ctx, 10, 16, 268, 480, 'КОМНАТЫ', '#4db6ac');

  drawTextShadow(ctx, 'MULTIPLAYER', W / 2, 32, 2.1, '#d9ffff', '#083540', 'center');
  drawText(ctx, 'ПУБЛИЧНЫЕ КОМНАТЫ', W / 2, 52, 1.0, '#d6f4f9', 'center');

  const visible = state.publicRooms.slice(state.roomScroll, state.roomScroll + 5);

  if (!visible.length) {
    drawCard(ctx, 22, 92, 244, 80, '#4db6ac');
    drawText(ctx, 'КОМНАТ НЕТ', W / 2, 120, 1.5, '#fff', 'center');
    drawText(ctx, 'СОЗДАЙ ПЕРВУЮ КОМНАТУ', W / 2, 138, 1, '#cdebf0', 'center');
  } else {
    for (let i = 0; i < visible.length; i++) {
      const r = visible[i];
      const y = 78 + i * 68;

      drawCard(ctx, 18, y, 252, 60, '#4db6ac');

      drawText(ctx, `${r.code}`, 30, y + 10, 1.45, '#ffd166', 'left');
      if (r.protected) drawBadge(ctx, 82, y + 6, 'LOCK', '#ffcc80', '#503000');
      drawBadge(ctx, 214, y + 6, r.status.toUpperCase(), statusColor(r.status), '#fff');

      drawText(ctx, `HOST ${r.hostName}`.slice(0, 20), 30, y + 25, 1.05, '#fff', 'left');
      drawText(ctx, `P ${r.players}/${r.maxPlayers}   S ${r.spectators}   B ${r.bots}`, 30, y + 38, 1, '#cfe7ef', 'left');
      drawText(ctx, `${r.diff.toUpperCase()}   R${r.round}/${r.roundsToWin}`, 30, y + 50, 1, '#9be7ff', 'left');

      drawText(ctx, 'JOIN', 256, y + 25, 1.35, '#7dff91', 'right');
    }
  }

  drawText(ctx, `ВСЕГО КОМНАТ: ${state.publicRooms.length}`, W / 2, 420, 1.0, '#d8f0f5', 'center');

  for (const b of state.buttons) b.draw(ctx);
}

export function drawCreateRoom(ctx, state) {
  const s = state.createSettings;

  drawPanel(ctx, 10, 16, 268, 480, 'СОЗДАНИЕ КОМНАТЫ', '#4db6ac');

  drawTextShadow(ctx, 'CREATE ROOM', W / 2, 32, 2.0, '#d9ffff', '#083540', 'center');
  drawText(ctx, 'НАСТРОЙ КОМНАТУ ПЕРЕД СТАРТОМ', W / 2, 52, 1.0, '#d6f4f9', 'center');

  drawText(ctx, 'ВИДИМОСТЬ', W / 2, 120, 1.15, '#ffd166', 'center');
  drawText(ctx, 'РОЛЬ ПРИ ВХОДЕ', W / 2, 166, 1.15, '#ffd166', 'center');
  drawText(ctx, 'ПАРОЛЬ', W / 2, 198, 1.15, '#ffd166', 'center');

  state.createPasswordInput.draw(ctx);

  drawText(ctx, 'СЛОЖНОСТЬ', W / 2, 246, 1.15, '#ffd166', 'center');
  drawText(ctx, 'ФОН', W / 2, 294, 1.15, '#ffd166', 'center');
  drawText(ctx, 'ТРУБЫ', W / 2, 334, 1.15, '#ffd166', 'center');

  drawCard(ctx, 70, 384, 148, 26, '#6bb8d6');
  drawText(ctx, `MAX PLAYERS ${s.maxPlayers}`, W / 2, 392, 1.05, '#fff', 'center');

  drawCard(ctx, 70, 414, 148, 26, '#81c784');
  drawText(ctx, `BOTS ${s.botCount}`, W / 2, 422, 1.05, '#fff', 'center');

  for (const b of state.buttons) {
    const active =
      (b.id === (s.isPublic ? 'cr-public' : 'cr-private')) ||
      (b.id === (s.spectator ? 'cr-spectator' : 'cr-player')) ||
      (b.id === `cr-diff-${s.diff}`) ||
      (b.id === `cr-bg-${s.bg}`) ||
      (b.id === `cr-pipe-${s.pipe}`);
    b.draw(ctx, active);
  }
}

export function drawLobby(ctx, state, roomState, myId, pingMs) {
  drawPanel(ctx, 8, 8, 272, 496, 'ЛОББИ', '#4db6ac');

  drawBadge(ctx, 18, 18, roomState.code, '#ffe082', '#503000');
  drawBadge(ctx, 206, 18, `PING ${pingMs}`, '#8be9ff', '#003344');

  drawText(ctx, roomState.public ? 'PUBLIC ROOM' : 'PRIVATE ROOM', W / 2, 44, 1.1, roomState.public ? '#8cff9b' : '#ffcc80', 'center');
  drawText(ctx, `ROUND ${roomState.round}/${roomState.roundsToWin}`, W / 2, 58, 1.0, '#d9f3f8', 'center');

  const me = roomState.players.find(p => p.id === myId);
  if (me) {
    drawText(ctx, 'ТВОЙ ПЕРСОНАЖ', W / 2, 74, 1.1, '#ffd166', 'center');
    drawBird(ctx, me.color, W / 2 - 18, 88, 36, 26);
    drawAvatar(ctx, me.avatar, W / 2 - 6, 116, 12, '#ffd166');
  }

  drawTextShadow(ctx, 'ИГРОКИ', W / 2, 136, 1.6, '#ffffff', '#0a2631', 'center');

  let y = 150;
  const participants = roomState.players.filter(x => !x.spectator);

  for (const p of participants) {
    drawCard(ctx, 16, y, 256, 22, p.id === myId ? '#ffd166' : '#6bb8d6');

    drawBird(ctx, p.color, 20, y + 3, 18, 14);
    drawAvatar(ctx, p.avatar, 42, y + 5, 10, '#ffd166');

    let label = p.name;
    if (p.isHost) label += ' [H]';
    if (p.id === myId) label += ' [YOU]';
    if (p.bot) label += ' [BOT]';

    drawText(ctx, label.slice(0, 24), 58, y + 7, 1, p.connected === false ? '#ff8a80' : '#fff', 'left');

    const status = p.bot ? 'BOT' : (p.ready ? 'READY' : 'WAIT');
    const statusColorText = p.bot ? '#9be7ff' : p.ready ? '#8cff9b' : '#ffb3a7';
    drawText(ctx, status, 266, y + 7, 1, statusColorText, 'right');

    y += 26;
  }

  const spectators = roomState.players.filter(x => x.spectator);
  if (spectators.length) {
    drawText(ctx, 'НАБЛЮДАТЕЛИ', W / 2, y + 8, 1.15, '#d8b4ff', 'center');
    y += 18;

    for (const p of spectators) {
      drawCard(ctx, 16, y, 256, 20, '#ba68c8');
      drawAvatar(ctx, p.avatar, 20, y + 4, 10, '#ba68c8');

      let label = p.name;
      if (p.id === myId) label += ' [YOU]';

      drawText(ctx, label.slice(0, 26), 36, y + 6, 1, '#e8dcff', 'left');
      drawText(ctx, 'SPEC', 266, y + 6, 1, '#d8b4ff', 'right');
      y += 24;
    }
  }

  drawPanel(ctx, 16, 350, 256, 104, 'ЧАТ', '#4db6ac');

  const chat = roomState.chat || [];
  const start = Math.max(0, chat.length - 5 - state.chatScroll);
  const visible = chat.slice(start, start + 5);

  for (let i = 0; i < visible.length; i++) {
    const m = visible[i];
    const text = m.system ? `[SYS] ${m.text}` : `${m.from}: ${m.text}`;
    drawText(ctx, text.slice(0, 36), 22, 370 + i * 15, 1, m.system ? '#9be7ff' : '#fff', 'left');
  }

  state.chatInput.draw(ctx);

  const meColor = me?.color || state.profile.color;

  for (const b of state.buttons) {
    const active = b.id === `lp-${meColor}`;
    b.draw(ctx, active);
  }
}

export function drawLobbySettings(ctx, state) {
  const s = state.lobbySettingsDraft;

  drawPanel(ctx, 10, 16, 268, 480, 'НАСТРОЙКИ КОМНАТЫ', '#ba68c8');

  drawTextShadow(ctx, 'ROOM SETTINGS', W / 2, 32, 1.8, '#f0d8ff', '#240836', 'center');
  drawText(ctx, 'УПРАВЛЕНИЕ ТОЛЬКО ДЛЯ ХОСТА', W / 2, 52, 1.0, '#ead8ff', 'center');

  drawText(ctx, 'СЛОЖНОСТЬ', W / 2, 94, 1.1, '#ffd166', 'center');
  drawText(ctx, 'ФОН', W / 2, 144, 1.1, '#ffd166', 'center');
  drawText(ctx, 'ТРУБЫ', W / 2, 194, 1.1, '#ffd166', 'center');

  drawCard(ctx, 68, 246, 152, 26, '#6bb8d6');
  drawText(ctx, `MAX PLAYERS ${s.maxPlayers}`, W / 2, 254, 1.05, '#fff', 'center');

  drawCard(ctx, 68, 296, 152, 26, '#81c784');
  drawText(ctx, `BOTS ${s.botCount}`, W / 2, 304, 1.05, '#fff', 'center');

  drawCard(ctx, 68, 346, 152, 26, '#ffd166');
  drawText(ctx, `ROUNDS ${s.roundsToWin}`, W / 2, 354, 1.05, '#503000', 'center');

  drawText(ctx, `VISIBILITY ${s.isPublic ? 'PUBLIC' : 'PRIVATE'}`, W / 2, 394, 1.1, '#fff', 'center');
  state.createPasswordInput.draw(ctx);

  for (const b of state.buttons) {
    const active =
      b.id === `ls-diff-${s.diff}` ||
      b.id === `ls-bg-${s.bg}` ||
      b.id === `ls-pipe-${s.pipe}` ||
      b.id === (s.isPublic ? 'ls-public' : 'ls-private');
    b.draw(ctx, active);
  }
}

export function drawResults(ctx, state, roomState, myId) {
  const titleColor = roomState.status === 'finished' ? '#ffd166' : '#69d2ff';
  drawPanel(ctx, 10, 16, 268, 480, roomState.status === 'finished' ? 'МАТЧ ЗАВЕРШЕН' : 'РЕЗУЛЬТАТЫ', titleColor);

  const winner = roomState.players.find(p => p.id === roomState.winnerId);
  if (winner) {
    drawBird(ctx, winner.color, W / 2 - 18, 42, 36, 26);
    drawAvatar(ctx, winner.avatar, W / 2 - 6, 72, 12, '#ffd166');
    drawTextShadow(ctx, `ПОБЕДИЛ ${winner.name}`.slice(0, 24), W / 2, 92, 1.35, '#fff', '#000', 'center');
  } else {
    drawTextShadow(ctx, 'НИЧЬЯ', W / 2, 72, 2, '#fff', '#000', 'center');
  }

  const rows = roomState.placements || [];
  for (let i = 0; i < rows.length; i++) {
    const p = rows[i];
    const y = 116 + i * 36;

    drawCard(ctx, 16, y, 256, 28, i === 0 ? '#ffd166' : '#5ca9c9');

    drawText(ctx, `#${p.place}`, 22, y + 8, 1.4, i === 0 ? '#503000' : '#fff', 'left');
    drawBird(ctx, p.color, 50, y + 7, 18, 12);
    drawAvatar(ctx, p.avatar, 70, y + 7, 10, '#ffd166');

    let label = p.name;
    if (p.isHost) label += ' [H]';
    if (p.id === myId) label += ' [YOU]';
    if (p.bot) label += ' [BOT]';

    drawText(ctx, label.slice(0, 16), 86, y + 9, 1, '#fff', 'left');
    drawText(ctx, `S:${p.score}`, 198, y + 9, 1, '#9be7ff', 'left');
    drawText(ctx, `W:${p.wins}`, 236, y + 9, 1, '#8cff9b', 'left');
  }

  if (winner) {
    drawBadge(ctx, 92, 402, 'WINNER', '#ffd166', '#503000');
  }

  for (const b of state.buttons) b.draw(ctx);
}

export function drawMultiRecords(ctx, state) {
  drawPanel(ctx, 10, 16, 268, 480, 'РЕКОРДЫ МУЛЬТИ', '#4db6ac');
  drawTextShadow(ctx, 'MULTI RECORDS', W / 2, 32, 1.8, '#d9ffff', '#083540', 'center');

  const list = getMultiRecords();
  const start = Math.max(0, state.multiRecordScroll);

  if (!list.length) {
    drawCard(ctx, 24, 100, 240, 70, '#4db6ac');
    drawText(ctx, 'ПОКА ПУСТО', W / 2, 126, 1.6, '#fff', 'center');
    drawText(ctx, 'СЫГРАЙ МАТЧ И РЕЗУЛЬТАТ ПОЯВИТСЯ', W / 2, 144, 1, '#d5eef5', 'center');
  } else {
    for (let i = 0; i < 10 && start + i < list.length; i++) {
      const r = list[start + i];
      const y = 50 + i * 38;

      drawCard(ctx, 16, y, 256, 28, i === 0 && start === 0 ? '#ffd166' : '#5ca9c9');

      drawText(ctx, `#${start + i + 1}`, 22, y + 8, 1.35, i === 0 && start === 0 ? '#503000' : '#fff', 'left');
      drawText(ctx, `${r.name}`.slice(0, 12), 64, y + 8, 1.15, '#fff', 'left');
      drawText(ctx, `P${r.place}`, 170, y + 8, 1, '#9be7ff', 'left');
      drawText(ctx, `S${r.score}`, 208, y + 8, 1, '#8cff9b', 'left');
      drawText(ctx, `${r.roomCode}`, 264, y + 8, 1, '#ddd', 'right');
    }
  }

  for (const b of state.buttons) b.draw(ctx);
}

export function handleMultiRecordButton(state, id) {
  const list = getMultiRecords();
  if (id === 'up') state.multiRecordScroll = Math.max(0, state.multiRecordScroll - 1);
  if (id === 'down') state.multiRecordScroll = Math.min(Math.max(0, list.length - 10), state.multiRecordScroll + 1);
}

export function saveResultToHistory(profile, roomState, myId) {
  const row = (roomState.placements || []).find(r => r.id === myId);
  if (!row) return;
  addMultiRecord(profile.name, row.place, row.score, roomState.code);
}

function statusColor(status) {
  if (status === 'lobby') return '#5ca9c9';
  if (status === 'countdown') return '#ffcc80';
  if (status === 'playing') return '#81c784';
  if (status === 'results') return '#ba68c8';
  if (status === 'finished') return '#ffd166';
  return '#888';
}