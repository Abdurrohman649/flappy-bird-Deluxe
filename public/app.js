import { W, H, GROUND_Y, STORAGE_KEYS } from './config.js';
import {
  loadAssets,
  getLoadingProgress,
  playSound,
  IMG,
  drawLoadingBar,
  drawSpriteScore
} from './assets.js';
import {
  drawBackground,
  drawGround,
  drawPanel,
  drawText,
  drawTextShadow,
  drawPipes,
  drawBird,
  drawBadge,
  drawCard
} from './ui.js';
import {
  saveProfile,
  saveRoomCreateSettings,
  getRoomCreateSettings,
  saveSessionId
} from './storage.js';
import {
  createProfileState,
  buildProfileButtons,
  drawProfile,
  handleProfileButton
} from './profile.js';
import {
  createSingleState,
  buildSingleMenuButtons,
  buildSingleRecordButtons,
  drawSingleMenu,
  handleSingleMenuButton,
  drawSingleRecords,
  handleSingleRecordButton,
  resetSingleGame,
  updateSingleGame,
  drawSingleGame
} from './single.js';
import {
  createMultiplayerState,
  buildMultiMenuButtons,
  buildCreateRoomButtons,
  buildLobbyButtons,
  buildLobbySettingsButtons,
  buildResultsButtons,
  buildMultiRecordButtons,
  drawMultiMenu,
  drawCreateRoom,
  drawLobby,
  drawLobbySettings,
  drawResults,
  drawMultiRecords,
  handleMultiRecordButton,
  saveResultToHistory
} from './multiplayer.js';

const socket = io();

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

canvas.width = W;
canvas.height = H;

function resize() {
  const s = Math.min(window.innerWidth / W, window.innerHeight / H);
  canvas.style.width = ((W * s) | 0) + 'px';
  canvas.style.height = ((H * s) | 0) + 'px';
}
resize();
window.addEventListener('resize', resize);

const sessionId = localStorage.getItem(STORAGE_KEYS.session) || Math.random().toString(36).slice(2);
saveSessionId(sessionId);

let screen = 'loading';
let pingMs = 0;
let errorText = '';
let errorTimer = 0;
let groundX = 0;
let reconnecting = false;
let myId = null;
let frame = 0;

const profileState = createProfileState();
buildProfileButtons(profileState);

const singleState = createSingleState(profileState.profile);
buildSingleMenuButtons(singleState);
buildSingleRecordButtons(singleState);

const multiState = createMultiplayerState(profileState.profile);
multiState.createSettings = getRoomCreateSettings();
buildMultiMenuButtons(multiState);

let homeButtons = [];
buildHomeButtons();

function buildHomeButtons() {
  homeButtons = [
    {
      x: W / 2 - 88,
      y: 200,
      w: 176,
      h: 40,
      text: 'ПРОФИЛЬ',
      id: 'profile',
      hover: false,
      style: 'blue'
    },
    {
      x: W / 2 - 88,
      y: 248,
      w: 176,
      h: 40,
      text: 'ОДИНОЧНАЯ',
      id: 'single-menu',
      hover: false,
      style: 'gold'
    },
    {
      x: W / 2 - 88,
      y: 296,
      w: 176,
      h: 40,
      text: 'МУЛЬТИПЛЕЕР',
      id: 'multi-menu',
      hover: false,
      style: 'green'
    }
  ];
}

function showError(text) {
  errorText = String(text || '');
  errorTimer = 180;
}

function clearError() {
  errorText = '';
  errorTimer = 0;
}

function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = W / rect.width;
  const scaleY = H / rect.height;
  const p = e.touches ? e.touches[0] : e;

  return {
    x: (p.clientX - rect.left) * scaleX,
    y: (p.clientY - rect.top) * scaleY
  };
}

function drawBG(bgName = 'day') {
  drawBackground(ctx, bgName);
}

function drawGroundWrap() {
  groundX -= 2;
  const img = IMG['base'];
  if (img && groundX <= -img.width) groundX += img.width;
  drawGround(ctx, groundX, GROUND_Y);
}

function drawMobileFlapButton() {
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath();
  ctx.arc(W - 42, H - 72, 28, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  drawTextShadow(ctx, 'TAP', W - 42, H - 76, 1.2, '#fff', '#000', 'center');
}

function drawBigMenuButton(b) {
  const shadow = b.style === 'blue'
    ? '#0d4054'
    : b.style === 'green'
      ? '#335415'
      : '#6b430d';

  const outer = b.style === 'blue'
    ? (b.hover ? '#7fe0ff' : '#5dc7ea')
    : b.style === 'green'
      ? (b.hover ? '#bdf37a' : '#95d453')
      : (b.hover ? '#ffe082' : '#f6c24e');

  const inner = b.style === 'blue'
    ? (b.hover ? '#49bce8' : '#3499c0')
    : b.style === 'green'
      ? (b.hover ? '#82c947' : '#63a92a')
      : (b.hover ? '#efb43c' : '#d89321');

  const text = b.style === 'blue'
    ? '#083447'
    : b.style === 'green'
      ? '#264000'
      : '#5a3300';

  const border = b.style === 'blue'
    ? '#d5f6ff'
    : b.style === 'green'
      ? '#eaffcd'
      : '#fff1b8';

  roundedRect(ctx, b.x + 2, b.y + 3, b.w, b.h, 8);
  ctx.fillStyle = shadow;
  ctx.fill();

  roundedRect(ctx, b.x, b.y, b.w, b.h, 8);
  ctx.fillStyle = outer;
  ctx.fill();

  roundedRect(ctx, b.x + 2, b.y + 2, b.w - 4, b.h - 4, 7);
  ctx.fillStyle = inner;
  ctx.fill();

  roundedRect(ctx, b.x + 3, b.y + 3, b.w - 6, 7, 6);
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fill();

  roundedRect(ctx, b.x, b.y, b.w, b.h, 8);
  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  ctx.stroke();

  drawTextShadow(ctx, b.text, b.x + b.w / 2, b.y + b.h / 2 - 5.5, 1.45, text, '#fff', 'center');
}

function drawHomeBackgroundDecor() {
  const grad = ctx.createLinearGradient(0, 0, 0, 180);
  grad.addColorStop(0, 'rgba(255,255,255,0.06)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 180);

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 5; i++) {
    const x = (i * 70 + Math.sin(frame * 0.01 + i) * 8);
    const y = 98 + i * 6;
    cloudBlob(x, y, 20, 10);
  }
}

function cloudBlob(x, y, w, h) {
  ctx.beginPath();
  ctx.arc(x, y, h, Math.PI, 0);
  ctx.arc(x + h, y - 3, h + 2, Math.PI, 0);
  ctx.arc(x + w - h, y - 2, h + 1, Math.PI, 0);
  ctx.arc(x + w, y, h, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
}

function drawLoading() {
  ctx.fillStyle = '#0d1420';
  ctx.fillRect(0, 0, W, H);

  drawTextShadow(ctx, 'LOADING', W / 2, H / 2 - 52, 3.2, '#ffffff', '#000', 'center');
  drawText(ctx, 'FLAPPY BIRD DELUXE', W / 2, H / 2 - 22, 1.2, '#cbefff', 'center');

  const progress = getLoadingProgress();
  const pct = progress.total ? progress.loaded / progress.total : 0;

  drawLoadingBar(ctx, 44, H / 2 + 6, 200, 16, pct);
  drawText(ctx, `${progress.loaded}/${progress.total}`, W / 2, H / 2 + 32, 1.2, '#fff', 'center');

  if (progress.done) {
    screen = 'home';
    socket.emit('session:register', { sessionId });
    socket.emit('rooms:get');
    socket.emit('room:reconnect', { sessionId });
  }
}

function drawHome() {
  drawBG('day');
  drawHomeBackgroundDecor();
  drawGroundWrap();

  drawPanel(ctx, 26, 22, 236, 386, '', '#69d2ff');

  drawBadge(ctx, 34, 30, 'MENU', '#8be9ff', '#003344');
  drawBadge(ctx, 208, 30, `PING ${pingMs}`, '#ffe082', '#503000');

  drawTextShadow(ctx, 'FLAPPY', W / 2, 58, 4.2, '#ffd166', '#7a4f12', 'center');
  drawTextShadow(ctx, 'BIRD', W / 2, 98, 4.2, '#ffffff', '#31414f', 'center');

  drawText(ctx, 'DELUXE HUB', W / 2, 132, 1.1, '#d7f7ff', 'center');

  const floatY = Math.sin(frame * 0.05) * 4;
  drawBird(ctx, profileState.profile.color, W / 2 - 22, 144 + floatY, 44, 32, 'midflap');

  for (const b of homeButtons) drawBigMenuButton(b);

  drawCard(ctx, 40, 350, 208, 40, '#69d2ff');
  drawText(ctx, profileState.profile.name, W / 2, 362, 1.35, '#ffffff', 'center');
  drawText(ctx, `COLOR ${profileState.profile.color.toUpperCase()}`, W / 2, 378, 1.0, '#d9f6ff', 'center');

  drawText(ctx, reconnecting ? 'RECONNECTING...' : 'READY', W / 2, 492, 1.0, reconnecting ? '#ff8a80' : '#ffffff', 'center');
}

function drawProfileScreen() {
  drawBG();
  drawGroundWrap();
  drawProfile(ctx, profileState, W);
}

function drawSingleMenuScreen() {
  drawBG(singleState.settings.bg);
  drawGroundWrap();
  drawSingleMenu(ctx, singleState, W);
}

function drawSingleRecordsScreen() {
  drawBG();
  drawGroundWrap();
  drawSingleRecords(ctx, singleState);
}

function drawSingleGameScreen() {
  drawSingleGame(
    ctx,
    singleState,
    (bg) => drawBG(bg),
    () => drawGroundWrap(),
    drawMobileFlapButton
  );
}

function drawMultiMenuScreen() {
  drawBG();
  drawGroundWrap();
  drawMultiMenu(ctx, multiState);
}

function drawCreateRoomScreen() {
  drawBG();
  drawGroundWrap();
  drawCreateRoom(ctx, multiState);
}

function drawLobbyScreen() {
  drawBG(multiState.roomState?.settings?.bg || 'day');
  drawGroundWrap();
  if (multiState.roomState) drawLobby(ctx, multiState, multiState.roomState, myId, pingMs);
}

function drawLobbySettingsScreen() {
  drawBG();
  drawGroundWrap();
  drawLobbySettings(ctx, multiState);
}

function drawGameMultiplayer() {
  if (!multiState.roomState) return;

  drawBG(multiState.roomState.settings.bg);
  drawPipes(ctx, multiState.roomState.settings.pipe, multiState.roomState.pipes, H);
  drawGroundWrap();

  for (const p of multiState.roomState.players) {
    if (p.spectator) continue;

    const flaps = ['downflap', 'midflap', 'upflap'];
    const img = IMG[`${p.color}-${flaps[p.anim || 0]}`];
    if (!img) continue;

    ctx.save();
    if (!p.alive) ctx.globalAlpha = 0.45;
    ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
    ctx.rotate((p.rot || 0) * Math.PI / 180);
    ctx.drawImage(img, -p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }

  const me = multiState.roomState.players.find(p => p.id === myId);
  if (!me?.spectator) {
    drawSpriteScore(ctx, me?.score || 0, 18, 1);
  } else {
    drawTextShadow(ctx, 'SPECTATOR', W / 2, 20, 2, '#ba68c8', '#000', 'center');
  }

  drawMobileFlapButton();

  if (multiState.roomState.status === 'countdown') {
    const sec = Math.max(1, Math.ceil(multiState.roomState.countdown / 60));
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, W, H);
    drawTextShadow(ctx, String(sec), W / 2, H / 2 - 16, 6, '#fff', '#000', 'center');
  }
}

function drawResultsScreen() {
  drawBG();
  drawGroundWrap();
  drawResults(ctx, multiState, multiState.roomState, myId);
}

function drawMultiRecordsScreen() {
  drawBG();
  drawGroundWrap();
  drawMultiRecords(ctx, multiState);
}

function setInputActive(input, active) {
  input.active = active;
}

function clearInputs() {
  profileState.nameInput.active = false;
  multiState.chatInput.active = false;
  multiState.createPasswordInput.active = false;
}

function handleHomeClick(mx, my) {
  for (const b of homeButtons) {
    if (!containsSimple(b, mx, my)) continue;

    playSound('swoosh', 0.2);

    if (b.id === 'profile') screen = 'profile';
    else if (b.id === 'single-menu') screen = 'single-menu';
    else if (b.id === 'multi-menu') {
      screen = 'multi-menu';
      socket.emit('rooms:get');
    }
    return;
  }
}

function handleButtons(list, mx, my, cb) {
  for (const b of list) {
    if (b.contains(mx, my)) {
      playSound('swoosh', 0.2);
      cb(b.id);
      return true;
    }
  }
  return false;
}

function handleProfileClick(mx, my) {
  if (profileState.nameInput.contains(mx, my)) {
    clearInputs();
    setInputActive(profileState.nameInput, true);
    return;
  }

  clearInputs();

  handleButtons(profileState.buttons, mx, my, (id) => {
    if (id === 'back') {
      saveProfile(profileState.profile);
      screen = 'home';
      return;
    }

    const result = handleProfileButton(profileState, id);
    if (result === 'saved') showError('ПРОФИЛЬ СОХРАНЕН');

    singleState.profile = profileState.profile;
    multiState.profile = profileState.profile;
  });
}

function handleSingleMenuClick(mx, my) {
  handleButtons(singleState.menuButtons, mx, my, (id) => {
    if (id === 'back') screen = 'home';
    else if (id === 'single-start') {
      resetSingleGame(singleState);
      screen = 'single-play';
    }
    else if (id === 'single-records') screen = 'single-records';
    else handleSingleMenuButton(singleState, id);
  });
}

function handleSingleRecordsClick(mx, my) {
  handleButtons(singleState.recordButtons, mx, my, (id) => {
    if (id === 'back') screen = 'single-menu';
    else handleSingleRecordButton(singleState, id);
  });
}

function handleSinglePlayClick() {
  if (singleState.game.state === 'idle') {
    singleState.game.state = 'play';
    singleState.game.bird.vel = -7.2;
    playSound('wing', 0.25);
    return;
  }

  if (singleState.game.state === 'play') {
    singleState.game.bird.vel = -7.2;
    playSound('wing', 0.25);
    return;
  }

  if (singleState.game.state === 'over') {
    resetSingleGame(singleState);
  }
}

function handleMultiMenuClick(mx, my) {
  if (handleButtons(multiState.buttons, mx, my, (id) => {
    if (id === 'back') screen = 'home';
    else if (id === 'multi-create') {
      screen = 'create-room';
      buildCreateRoomButtons(multiState);
    }
    else if (id === 'multi-join') {
      const code = prompt('Введите код комнаты', '') || '';
      if (!code.trim()) return;

      const password = prompt('Введите пароль, если нужен', '') || '';
      const spectator = confirm('OK = наблюдатель, Отмена = игрок');

      socket.emit('room:join', {
        code: code.trim().toUpperCase(),
        password,
        spectator,
        profile: profileState.profile
      });
    }
    else if (id === 'rooms-up') {
      multiState.roomScroll = Math.max(0, multiState.roomScroll - 1);
    }
    else if (id === 'rooms-down') {
      multiState.roomScroll = Math.min(Math.max(0, multiState.publicRooms.length - 5), multiState.roomScroll + 1);
    }
  })) return;

  const visible = multiState.publicRooms.slice(multiState.roomScroll, multiState.roomScroll + 5);
  for (let i = 0; i < visible.length; i++) {
    const y = 78 + i * 68;
    if (mx >= 18 && mx <= 270 && my >= y && my <= y + 60) {
      const room = visible[i];
      const password = room.protected ? (prompt('Введите пароль', '') || '') : '';
      const spectator = confirm('OK = наблюдатель, Отмена = игрок');

      socket.emit('room:join', {
        code: room.code,
        password,
        spectator,
        profile: profileState.profile
      });
      return;
    }
  }
}

function handleCreateRoomClick(mx, my) {
  if (multiState.createPasswordInput.contains(mx, my)) {
    clearInputs();
    setInputActive(multiState.createPasswordInput, true);
    return;
  }

  clearInputs();

  handleButtons(multiState.buttons, mx, my, (id) => {
    const s = multiState.createSettings;

    if (id === 'back') {
      saveRoomCreateSettings(s);
      screen = 'multi-menu';
      buildMultiMenuButtons(multiState);
      return;
    }

    if (id === 'save-room-settings') {
      saveRoomCreateSettings(s);
      showError('СОХРАНЕНО');
      return;
    }

    if (id === 'create-room') {
      saveRoomCreateSettings(s);
      socket.emit('room:create', {
        profile: profileState.profile,
        isPublic: s.isPublic,
        password: s.isPublic ? '' : multiState.createPasswordInput.value,
        spectator: s.spectator,
        settings: {
          diff: s.diff,
          bg: s.bg,
          pipe: s.pipe,
          maxPlayers: s.maxPlayers,
          botCount: s.botCount,
          roundsToWin: s.roundsToWin
        }
      });
      return;
    }

    if (id === 'cr-public') s.isPublic = true;
    else if (id === 'cr-private') s.isPublic = false;
    else if (id === 'cr-player') s.spectator = false;
    else if (id === 'cr-spectator') s.spectator = true;
    else if (id.startsWith('cr-diff-')) s.diff = id.split('-')[2];
    else if (id.startsWith('cr-bg-')) s.bg = id.split('-')[2];
    else if (id.startsWith('cr-pipe-')) s.pipe = id.split('-')[2];
    else if (id === 'cr-max-down') s.maxPlayers = Math.max(2, s.maxPlayers - 1);
    else if (id === 'cr-max-up') s.maxPlayers = Math.min(6, s.maxPlayers + 1);
    else if (id === 'cr-bot-down') s.botCount = Math.max(0, s.botCount - 1);
    else if (id === 'cr-bot-up') s.botCount = Math.min(5, s.botCount + 1);

    saveRoomCreateSettings(s);
  });
}

function handleLobbyClick(mx, my) {
  const me = multiState.roomState?.players.find(p => p.id === myId);
  if (!me) return;

  if (multiState.chatInput.contains(mx, my)) {
    clearInputs();
    setInputActive(multiState.chatInput, true);
    return;
  }

  clearInputs();

  handleButtons(multiState.buttons, mx, my, (id) => {
    if (id === 'ready' && !me.bot && !me.spectator) {
      socket.emit('player:ready', { ready: !me.ready });
    }
    else if (id === 'copy-code') {
      navigator.clipboard?.writeText(multiState.roomState.code);
      showError('КОД СКОПИРОВАН');
    }
    else if (id === 'copy-link') {
      navigator.clipboard?.writeText(`${location.origin}/?room=${multiState.roomState.code}`);
      showError('ССЫЛКА СКОПИРОВАНА');
    }
    else if (id === 'leave') {
      socket.emit('room:leave');
      multiState.roomState = null;
      history.replaceState({}, '', '/');
      screen = 'multi-menu';
      buildMultiMenuButtons(multiState);
      socket.emit('rooms:get');
    }
    else if (id === 'start') {
      socket.emit('room:start');
    }
    else if (id === 'lobby-settings') {
      multiState.lobbySettingsDraft = {
        isPublic: multiState.roomState.public,
        password: '',
        diff: multiState.roomState.settings.diff,
        bg: multiState.roomState.settings.bg,
        pipe: multiState.roomState.settings.pipe,
        maxPlayers: multiState.roomState.settings.maxPlayers,
        botCount: multiState.roomState.settings.botCount,
        roundsToWin: multiState.roomState.roundsToWin
      };
      screen = 'lobby-settings';
      buildLobbySettingsButtons(multiState);
    }
    else if (id === 'chat-send') {
      if (multiState.chatInput.value.trim()) {
        socket.emit('chat:send', { text: multiState.chatInput.value.trim() });
        multiState.chatInput.value = '';
      }
    }
    else if (id === 'chat-up') {
      multiState.chatScroll = Math.min(50, multiState.chatScroll + 1);
    }
    else if (id === 'chat-down') {
      multiState.chatScroll = Math.max(0, multiState.chatScroll - 1);
    }
    else if (id === 'lp-yellow' || id === 'lp-blue' || id === 'lp-red') {
      const color = id.split('-')[1];
      profileState.profile.color = color;
      saveProfile(profileState.profile);
      socket.emit('player:setProfile', { profile: profileState.profile });
    }
  });
}

function handleLobbySettingsClick(mx, my) {
  if (multiState.createPasswordInput.contains(mx, my)) {
    clearInputs();
    setInputActive(multiState.createPasswordInput, true);
    return;
  }

  clearInputs();

  handleButtons(multiState.buttons, mx, my, (id) => {
    const s = multiState.lobbySettingsDraft;

    if (id === 'back') {
      screen = 'lobby';
      buildLobbyButtons(
        multiState,
        multiState.roomState.players.find(p => p.id === myId),
        !!multiState.roomState.players.find(p => p.id === myId)?.isHost
      );
      return;
    }

    if (id === 'save-lobby-settings') {
      socket.emit('room:updateSettings', {
        diff: s.diff,
        bg: s.bg,
        pipe: s.pipe,
        maxPlayers: s.maxPlayers,
        botCount: s.botCount,
        roundsToWin: s.roundsToWin,
        isPublic: s.isPublic,
        password: s.isPublic ? '' : multiState.createPasswordInput.value
      });

      screen = 'lobby';
      buildLobbyButtons(
        multiState,
        multiState.roomState.players.find(p => p.id === myId),
        !!multiState.roomState.players.find(p => p.id === myId)?.isHost
      );
      return;
    }

    if (id.startsWith('ls-diff-')) s.diff = id.split('-')[2];
    else if (id.startsWith('ls-bg-')) s.bg = id.split('-')[2];
    else if (id.startsWith('ls-pipe-')) s.pipe = id.split('-')[2];
    else if (id === 'ls-max-down') s.maxPlayers = Math.max(2, s.maxPlayers - 1);
    else if (id === 'ls-max-up') s.maxPlayers = Math.min(6, s.maxPlayers + 1);
    else if (id === 'ls-bot-down') s.botCount = Math.max(0, s.botCount - 1);
    else if (id === 'ls-bot-up') s.botCount = Math.min(5, s.botCount + 1);
    else if (id === 'ls-rounds-down') s.roundsToWin = Math.max(1, s.roundsToWin - 1);
    else if (id === 'ls-rounds-up') s.roundsToWin = Math.min(5, s.roundsToWin + 1);
    else if (id === 'ls-public') s.isPublic = true;
    else if (id === 'ls-private') s.isPublic = false;
  });
}

function handleGameClick() {
  const me = multiState.roomState?.players.find(p => p.id === myId);
  const isReadyToFlap = !me?.spectator && multiState.roomState?.status === 'playing' && me?.alive;
  
  if (isReadyToFlap) {
    socket.emit('player:flap');
    playSound('wing', 0.2);
  } else {
    console.log('Cannot flap. Reasons:', {
      meFound: !!me,
      isSpectator: me?.spectator,
      gameStatus: multiState.roomState?.status,
      isAlive: me?.alive,
      myId
    });
  }
}

function handleResultsClick(mx, my) {
  handleButtons(multiState.buttons, mx, my, (id) => {
    if (id === 'leave') {
      socket.emit('room:leave');
      multiState.roomState = null;
      history.replaceState({}, '', '/');
      screen = 'multi-menu';
      buildMultiMenuButtons(multiState);
      socket.emit('rooms:get');
    }
    else if (id === 'multi-records') {
      screen = 'multi-records';
      buildMultiRecordButtons(multiState);
    }
    else if (id === 'copy-code') {
      navigator.clipboard?.writeText(multiState.roomState.code);
      showError('КОД СКОПИРОВАН');
    }
    else if (id === 'next-round') {
      socket.emit('room:nextRound');
    }
    else if (id === 'restart-match') {
      socket.emit('room:restartMatch');
    }
  });
}

function handleMultiRecordsClick(mx, my) {
  handleButtons(multiState.buttons, mx, my, (id) => {
    if (id === 'back') {
      screen = 'results';
      buildResultsButtons(
        multiState,
        !!multiState.roomState?.players.find(p => p.id === myId)?.isHost,
        multiState.roomState
      );
    } else {
      handleMultiRecordButton(multiState, id);
    }
  });
}

function handleClick(mx, my) {
  if (screen === 'home') return handleHomeClick(mx, my);
  if (screen === 'profile') return handleProfileClick(mx, my);
  if (screen === 'single-menu') return handleSingleMenuClick(mx, my);
  if (screen === 'single-records') return handleSingleRecordsClick(mx, my);
  if (screen === 'single-play') return handleSinglePlayClick();
  if (screen === 'multi-menu') return handleMultiMenuClick(mx, my);
  if (screen === 'create-room') return handleCreateRoomClick(mx, my);
  if (screen === 'lobby') return handleLobbyClick(mx, my);
  if (screen === 'lobby-settings') return handleLobbySettingsClick(mx, my);
  if (screen === 'game') return handleGameClick();
  if (screen === 'results') return handleResultsClick(mx, my);
  if (screen === 'multi-records') return handleMultiRecordsClick(mx, my);
}

canvas.addEventListener('click', (e) => {
  const p = getCanvasPos(e);
  handleClick(p.x, p.y);
});

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const p = getCanvasPos(e);
  handleClick(p.x, p.y);
}, { passive: false });

canvas.addEventListener('mousemove', (e) => {
  const p = getCanvasPos(e);

  if (screen === 'home') {
    for (const b of homeButtons) b.hover = containsSimple(b, p.x, p.y);
  } else if (screen === 'profile') {
    for (const b of profileState.buttons) b.hover = b.contains(p.x, p.y);
  } else if (screen === 'single-menu') {
    for (const b of singleState.menuButtons) b.hover = b.contains(p.x, p.y);
  } else if (screen === 'single-records') {
    for (const b of singleState.recordButtons) b.hover = b.contains(p.x, p.y);
  } else if (['multi-menu', 'create-room', 'lobby', 'lobby-settings', 'results', 'multi-records'].includes(screen)) {
    for (const b of multiState.buttons) b.hover = b.contains(p.x, p.y);
  }
});

document.addEventListener('keydown', (e) => {
  const input = profileState.nameInput.active
    ? profileState.nameInput
    : multiState.chatInput.active
      ? multiState.chatInput
      : multiState.createPasswordInput.active
        ? multiState.createPasswordInput
        : null;

  if (input) {
    if (e.key === 'Backspace') {
      input.value = input.value.slice(0, -1);
      e.preventDefault();
      return;
    }

    if (e.key === 'Enter') {
      if (input === profileState.nameInput) {
        profileState.profile.name = profileState.nameInput.value.slice(0, 16) || profileState.profile.name;
        saveProfile(profileState.profile);
        showError('ИМЯ СОХРАНЕНО');
      }

      if (input === multiState.chatInput) {
        if (multiState.chatInput.value.trim()) {
          socket.emit('chat:send', { text: multiState.chatInput.value.trim() });
          multiState.chatInput.value = '';
        }
      }

      if (input === multiState.createPasswordInput) {
        multiState.createSettings.password = multiState.createPasswordInput.value;
        saveRoomCreateSettings(multiState.createSettings);
      }

      e.preventDefault();
      return;
    }

    if (e.key.length === 1 && input.value.length < input.maxLength) {
      input.value += e.key;
      e.preventDefault();
      return;
    }
  }

  if (screen === 'single-play' && ['Space', 'ArrowUp', 'KeyW', 'Enter'].includes(e.code)) {
    e.preventDefault();
    console.log('Single-play space/flap pressed');
    handleSinglePlayClick();
    return;
  }

  if (screen === 'game' && ['Space', 'ArrowUp', 'KeyW', 'Enter'].includes(e.code)) {
    e.preventDefault();
    console.log('Multiplayer space/flap pressed', { screen, myId, roomState: !!multiState.roomState });
    handleGameClick();
    return;
  }

  if (screen === 'lobby') {
    if (e.code === 'PageUp') multiState.chatScroll = Math.min(50, multiState.chatScroll + 1);
    if (e.code === 'PageDown') multiState.chatScroll = Math.max(0, multiState.chatScroll - 1);
    if (e.code === 'KeyT') {
      clearInputs();
      setInputActive(multiState.chatInput, true);
    }
  }

  if (e.code === 'Escape') {
    if (['profile', 'single-menu', 'single-records', 'multi-menu', 'create-room'].includes(screen)) {
      screen = 'home';
      clearInputs();
      return;
    }

    if (screen === 'lobby-settings') {
      screen = 'lobby';
      clearInputs();
      return;
    }

    if (screen === 'single-play') {
      screen = 'single-menu';
      clearInputs();
      return;
    }
  }
});

socket.on('connect', () => {
  reconnecting = false;
  clearError();
  socket.emit('session:register', { sessionId });
  socket.emit('rooms:get');
  socket.emit('room:reconnect', { sessionId });
});

socket.on('disconnect', () => {
  reconnecting = true;
  showError('ПЕРЕПОДКЛЮЧЕНИЕ...');
});

socket.on('room:joined', ({ roomCode, playerId, sessionId: sid }) => {
  myId = playerId;
  if (sid) saveSessionId(sid);
  history.replaceState({}, '', '/?room=' + roomCode);
});

socket.on('room:update', (state) => {
  const prevStatus = multiState.roomState?.status;
  multiState.roomState = state;

  if (state.status === 'lobby') {
    screen = 'lobby';
    buildLobbyButtons(
      multiState,
      state.players.find(p => p.id === myId),
      !!state.players.find(p => p.id === myId)?.isHost
    );
  }
  else if (state.status === 'countdown' || state.status === 'playing') {
    screen = 'game';
  }
  else if (state.status === 'results' || state.status === 'finished') {
    screen = 'results';
    buildResultsButtons(
      multiState,
      !!state.players.find(p => p.id === myId)?.isHost,
      state
    );
    saveResultToHistory(profileState.profile, state, myId);
  }

  if (prevStatus !== state.status) {
    if (state.status === 'playing') playSound('swoosh', 0.25);
    if (state.status === 'results' || state.status === 'finished') playSound('die', 0.25);
  }
});

socket.on('rooms:list', (list) => {
  multiState.publicRooms = list || [];
});

socket.on('room:error', (msg) => {
  showError(msg);
  playSound('hit', 0.25);
});

socket.on('pong:server', (t) => {
  pingMs = Date.now() - t;
});

setInterval(() => {
  socket.emit('ping:client', Date.now());
}, 3000);

loadAssets();

function containsSimple(b, x, y) {
  return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
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

function loop() {
  frame++;

  if (errorTimer > 0) errorTimer--;

  switch (screen) {
    case 'loading':
      drawLoading();
      break;
    case 'home':
      drawHome();
      break;
    case 'profile':
      drawProfileScreen();
      break;
    case 'single-menu':
      drawSingleMenuScreen();
      break;
    case 'single-records':
      drawSingleRecordsScreen();
      break;
    case 'single-play':
      updateSingleGame(singleState);
      drawSingleGameScreen();
      break;
    case 'multi-menu':
      drawMultiMenuScreen();
      break;
    case 'create-room':
      drawCreateRoomScreen();
      break;
    case 'lobby':
      drawLobbyScreen();
      break;
    case 'lobby-settings':
      drawLobbySettingsScreen();
      break;
    case 'game':
      drawGameMultiplayer();
      break;
    case 'results':
      drawResultsScreen();
      break;
    case 'multi-records':
      drawMultiRecordsScreen();
      break;
  }

  if (errorTimer > 0 && errorText) {
    ctx.fillStyle = 'rgba(0,0,0,0.72)';
    roundedRect(ctx, 16, H - 30, W - 32, 18, 6);
    ctx.fill();
    drawText(ctx, errorText, W / 2, H - 25, 1, '#ff8a80', 'center');
  }

  if (reconnecting) {
    drawText(ctx, 'RECONNECTING...', W / 2, 8, 1, '#ff8a80', 'center');
  }

  requestAnimationFrame(loop);
}

loop();