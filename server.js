const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingInterval: 25000,
  pingTimeout: 60000
});

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const W = 288;
const H = 512;
const GROUND_Y = H - 112;

const DIFFS = {
  easy:   { gap: 155, speed: 2.0, gravity: 0.35, jump: -6.2, spawnRate: 100 },
  normal: { gap: 125, speed: 2.8, gravity: 0.45, jump: -7.2, spawnRate: 85 },
  hard:   { gap: 95,  speed: 3.8, gravity: 0.55, jump: -7.8, spawnRate: 70 }
};

const COLORS = ['yellow', 'blue', 'red'];
const AVATARS = ['STAR', 'CROWN', 'BOLT', 'HEART', 'MOON', 'SKULL'];

const rooms = new Map();
const playerSessionMap = new Map();

function randCode(len = 5) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[(Math.random() * chars.length) | 0];
  return s;
}
function uniqueRoomCode() {
  let code;
  do code = randCode();
  while (rooms.has(code));
  return code;
}
function clampName(name) {
  return String(name || 'Игрок').trim().slice(0, 16) || 'Игрок';
}

function createPlayer(socketId, sessionId, profile, isHost = false, spectator = false, bot = false, botIndex = 0) {
  return {
    id: socketId,
    sessionId,
    name: bot ? `BOT ${botIndex}` : clampName(profile?.name),
    color: COLORS.includes(profile?.color) ? profile.color : 'yellow',
    avatar: AVATARS.includes(profile?.avatar) ? profile.avatar : 'STAR',
    x: 60,
    y: H / 2 - 30,
    w: 34,
    h: 24,
    vel: 0,
    rot: 0,
    anim: 0,
    animT: 0,
    alive: !spectator,
    ready: bot ? true : false,
    score: 0,
    wins: 0,
    isHost,
    spectator,
    bot,
    connected: true
  };
}

function serializePlayer(p) {
  return {
    id: p.id,
    sessionId: p.sessionId,
    name: p.name,
    color: p.color,
    avatar: p.avatar,
    x: p.x,
    y: p.y,
    w: p.w,
    h: p.h,
    vel: p.vel,
    rot: p.rot,
    anim: p.anim,
    alive: p.alive,
    ready: p.ready,
    score: p.score,
    wins: p.wins,
    isHost: p.isHost,
    spectator: p.spectator,
    bot: p.bot,
    connected: p.connected
  };
}

function pushChat(room, from, text, system = false) {
  const msg = {
    id: Date.now() + Math.random(),
    from: String(from).slice(0, 24),
    text: String(text).slice(0, 160),
    system,
    ts: Date.now()
  };
  room.chat.push(msg);
  if (room.chat.length > 100) room.chat.splice(0, room.chat.length - 100);
}

function createRoom(hostSocket, sessionId, profile, opts = {}) {
  const code = uniqueRoomCode();
  const room = {
    code,
    hostId: hostSocket.id,
    status: 'lobby',
    public: !!opts.public,
    password: opts.password ? String(opts.password).slice(0, 24) : '',
    roundsToWin: Math.max(1, Math.min(5, opts.roundsToWin || 3)),
    round: 1,
    settings: {
      diff: DIFFS[opts.diff] ? opts.diff : 'normal',
      maxPlayers: Math.max(2, Math.min(6, opts.maxPlayers || 4)),
      bg: ['day', 'night'].includes(opts.bg) ? opts.bg : 'day',
      pipe: ['green', 'red'].includes(opts.pipe) ? opts.pipe : 'green',
      botCount: Math.max(0, Math.min(5, opts.botCount || 0))
    },
    players: new Map(),
    pipes: [],
    pipeTimer: 0,
    frame: 0,
    winnerId: null,
    placements: [],
    countdown: 0,
    chat: []
  };

  const host = createPlayer(hostSocket.id, sessionId, profile || {}, true, !!opts.spectator, false, 0);
  room.players.set(hostSocket.id, host);
  addBotsToRoom(room);
  rooms.set(code, room);
  hostSocket.join(code);
  playerSessionMap.set(sessionId, { roomCode: code, playerId: hostSocket.id });
  pushChat(room, 'SYSTEM', `${host.name} создал комнату`, true);
  return room;
}

function addBotsToRoom(room) {
  for (const [id, p] of room.players) {
    if (p.bot) room.players.delete(id);
  }
  for (let i = 1; i <= room.settings.botCount; i++) {
    const id = `bot_${room.code}_${i}`;
    room.players.set(id, createPlayer(id, null, {
      name: `BOT ${i}`,
      color: COLORS[(i - 1) % COLORS.length],
      avatar: AVATARS[(i - 1) % AVATARS.length]
    }, false, false, true, i));
  }
}

function roomPublicState(room) {
  return {
    code: room.code,
    hostId: room.hostId,
    status: room.status,
    public: room.public,
    protected: !!room.password,
    round: room.round,
    roundsToWin: room.roundsToWin,
    countdown: room.countdown,
    settings: room.settings,
    players: [...room.players.values()].map(serializePlayer),
    pipes: room.pipes.map(p => ({ x: p.x, topH: p.topH, botY: p.botY, w: p.w })),
    winnerId: room.winnerId,
    placements: room.placements,
    chat: room.chat.slice(-100)
  };
}

function emitRoomsList() {
  const list = [...rooms.values()]
    .filter(r => r.public)
    .map(r => {
      const host = r.players.get(r.hostId);
      const players = [...r.players.values()].filter(p => !p.bot && !p.spectator);
      const spectators = [...r.players.values()].filter(p => p.spectator);
      const bots = [...r.players.values()].filter(p => p.bot);
      return {
        code: r.code,
        hostName: host?.name || 'HOST',
        players: players.length,
        spectators: spectators.length,
        bots: bots.length,
        maxPlayers: r.settings.maxPlayers,
        diff: r.settings.diff,
        bg: r.settings.bg,
        pipe: r.settings.pipe,
        protected: !!r.password,
        status: r.status,
        round: r.round,
        roundsToWin: r.roundsToWin
      };
    });
  io.emit('rooms:list', list);
}

function emitRoom(room) {
  io.to(room.code).emit('room:update', roomPublicState(room));
  emitRoomsList();
}

function resetRoundActors(room) {
  let idx = 0;
  for (const p of room.players.values()) {
    p.anim = 0;
    p.animT = 0;
    p.vel = 0;
    p.rot = 0;
    p.score = 0;

    if (p.spectator) {
      p.alive = false;
      continue;
    }

    p.alive = true;
    p.x = 54 + idx * 8;
    p.y = H / 2 - 30 + idx * 10;
    idx++;
  }
}

function startCountdown(room) {
  room.status = 'countdown';
  room.countdown = 180;
  room.pipes = [];
  room.pipeTimer = 0;
  room.frame = 0;
  room.winnerId = null;
  room.placements = [];
  resetRoundActors(room);
  pushChat(room, 'SYSTEM', `Раунд ${room.round} начинается`, true);
}

function startRound(room) {
  room.status = 'playing';
  room.countdown = 0;
}

function finalizeResults(room) {
  const active = [...room.players.values()].filter(p => !p.spectator);
  const alive = active.filter(p => p.alive);
  room.winnerId = alive.length === 1 ? alive[0].id : null;

  if (room.winnerId) {
    const winner = room.players.get(room.winnerId);
    if (winner) winner.wins++;
  }

  const sorted = [...active].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.alive !== b.alive) return a.alive ? -1 : 1;
    return 0;
  });

  room.placements = sorted.map((p, i) => ({
    place: i + 1,
    id: p.id,
    name: p.name,
    color: p.color,
    avatar: p.avatar,
    score: p.score,
    alive: p.alive,
    isHost: p.isHost,
    spectator: p.spectator,
    bot: p.bot,
    wins: p.wins
  }));

  const matchWinner = active.find(p => p.wins >= room.roundsToWin);
  room.status = matchWinner ? 'finished' : 'results';
  if (!matchWinner) room.round++;
  else pushChat(room, 'SYSTEM', `Матч выиграл ${matchWinner.name}`, true);
}

function rectHit(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function playerBounds(p) {
  // Уменьшаем границы на 4px со всех сторон для более мягкой коллизии
  return { x: p.x + 4, y: p.y + 4, w: p.w - 8, h: p.h - 8 };
}
function spawnPipe(room) {
  const gap = DIFFS[room.settings.diff].gap;
  const minTop = 60;
  const maxTop = GROUND_Y - gap - 60;
  const topH = minTop + Math.random() * (maxTop - minTop);
  room.pipes.push({ x: W, topH, botY: topH + gap, w: 52 });
}
function killPlayer(p) {
  p.alive = false;
}
function aliveParticipants(room) {
  return [...room.players.values()].filter(p => !p.spectator && p.alive);
}

function updateBots(room) {
  for (const p of room.players.values()) {
    if (!p.bot || !p.alive || room.status !== 'playing') continue;

    const nextPipe = room.pipes.find(pipe => pipe.x + pipe.w > p.x - 2);
    const params = DIFFS[room.settings.diff];

    if (nextPipe) {
      const gapCenter = nextPipe.topH + params.gap / 2;
      const center = p.y + p.h / 2;
      const dx = nextPipe.x - p.x;
      if (dx < 85 && center > gapCenter + 8) p.vel = params.jump;
      if (center > gapCenter + 20) p.vel = params.jump;
      if (p.y > GROUND_Y - 70) p.vel = params.jump;
    } else {
      if (p.y > H / 2 + 20) p.vel = params.jump;
    }
  }
}

function updateRoom(room) {
  if (room.status === 'countdown') {
    room.countdown--;
    if (room.countdown <= 0) startRound(room);
    return;
  }
  if (room.status !== 'playing') return;

  const pset = DIFFS[room.settings.diff];
  room.frame++;
  room.pipeTimer++;

  if (room.pipeTimer >= pset.spawnRate) {
    room.pipeTimer = 0;
    spawnPipe(room);
  }

  updateBots(room);

  for (let i = room.pipes.length - 1; i >= 0; i--) {
    const pipe = room.pipes[i];
    pipe.x -= pset.speed;
    if (pipe.x + pipe.w < -10) room.pipes.splice(i, 1);
  }

  for (const p of room.players.values()) {
    p.animT++;
    if (p.animT >= 8) {
      p.animT = 0;
      p.anim = (p.anim + 1) % 3;
    }

    if (p.spectator) continue;

    if (!p.alive) {
      p.rot = 90;
      if (p.y + p.h < GROUND_Y) {
        p.vel += pset.gravity;
        p.y += p.vel;
        if (p.y + p.h >= GROUND_Y) p.y = GROUND_Y - p.h;
      }
      continue;
    }

    p.vel += pset.gravity;
    p.y += p.vel;
    p.rot = p.vel < 0 ? Math.max(-30, p.vel * 4) : Math.min(90, p.rot + 3);

    const b = playerBounds(p);

    if (b.y + b.h >= GROUND_Y) {
      p.y = GROUND_Y - p.h;
      killPlayer(p);
      continue;
    }

    if (b.y < 0) {
      p.y = 0;
      p.vel = 0;
    }

    for (const pipe of room.pipes) {
      if (
        rectHit(b, { x: pipe.x, y: 0, w: pipe.w, h: pipe.topH }) ||
        rectHit(b, { x: pipe.x, y: pipe.botY, w: pipe.w, h: H - pipe.botY })
      ) {
        killPlayer(p);
        break;
      }
    }

    for (const pipe of room.pipes) {
      const key = '_scored_' + p.id;
      if (!pipe[key] && pipe.x + pipe.w < p.x) {
        pipe[key] = true;
        p.score++;
      }
    }
  }

  if (aliveParticipants(room).length <= 1) finalizeResults(room);
}

function removePlayer(socketId) {
  for (const room of rooms.values()) {
    if (!room.players.has(socketId)) continue;

    const leaving = room.players.get(socketId);
    room.players.delete(socketId);

    if (leaving?.sessionId) playerSessionMap.delete(leaving.sessionId);

    if (room.players.size === 0) {
      rooms.delete(room.code);
      emitRoomsList();
      return;
    }

    if (room.hostId === socketId) {
      const next = [...room.players.values()].find(p => !p.bot) || room.players.values().next().value;
      room.hostId = next.id;
      next.isHost = true;
    }

    pushChat(room, 'SYSTEM', `${leaving?.name || 'Игрок'} вышел`, true);

    if (room.status === 'playing' || room.status === 'countdown') {
      if (aliveParticipants(room).length <= 1) finalizeResults(room);
    }

    emitRoom(room);
    return;
  }
}

function canStart(room, socketId) {
  if (room.hostId !== socketId) return 'ТОЛЬКО ХОСТ МОЖЕТ НАЧАТЬ';
  const humans = [...room.players.values()].filter(p => !p.bot && !p.spectator);
  if (humans.length < 1) return 'НУЖЕН ХОТЯ БЫ 1 ИГРОК';
  const allReady = humans.every(p => p.id === room.hostId || p.ready);
  if (!allReady) return 'НЕ ВСЕ ГОТОВЫ';
  return '';
}

setInterval(() => {
  for (const room of rooms.values()) {
    if (room.status === 'countdown' || room.status === 'playing') {
      updateRoom(room);
      emitRoom(room);
    }
  }
}, 1000 / 60);

io.on('connection', (socket) => {
  emitRoomsList();

  socket.on('session:register', ({ sessionId }) => {
    socket.data.sessionId = String(sessionId || '');
  });

  socket.on('rooms:get', () => emitRoomsList());

  socket.on('room:create', ({ profile, isPublic, password, spectator, settings }) => {
    const sessionId = socket.data.sessionId || randCode(10);
    socket.data.sessionId = sessionId;

    const room = createRoom(socket, sessionId, profile || {}, {
      public: !!isPublic,
      password: password || '',
      spectator: !!spectator,
      diff: settings?.diff,
      maxPlayers: settings?.maxPlayers,
      bg: settings?.bg,
      pipe: settings?.pipe,
      botCount: settings?.botCount,
      roundsToWin: settings?.roundsToWin
    });

    socket.emit('room:joined', { roomCode: room.code, playerId: socket.id, sessionId });
    emitRoom(room);
  });

  socket.on('room:join', ({ code, profile, password, spectator }) => {
    const room = rooms.get(String(code || '').toUpperCase().trim());
    if (!room) return socket.emit('room:error', 'КОМНАТА НЕ НАЙДЕНА');

    if (room.password && room.password !== String(password || '')) {
      return socket.emit('room:error', 'НЕВЕРНЫЙ ПАРОЛЬ');
    }

    const humans = [...room.players.values()].filter(p => !p.bot && !p.spectator);
    if (!spectator && humans.length >= room.settings.maxPlayers) {
      return socket.emit('room:error', 'КОМНАТА ЗАПОЛНЕНА');
    }

    const sessionId = socket.data.sessionId || randCode(10);
    socket.data.sessionId = sessionId;

    const player = createPlayer(socket.id, sessionId, profile || {}, false, !!spectator, false, 0);
    room.players.set(socket.id, player);
    socket.join(room.code);
    playerSessionMap.set(sessionId, { roomCode: room.code, playerId: socket.id });
    pushChat(room, 'SYSTEM', `${player.name} ${spectator ? 'наблюдает' : 'вошел'}`, true);

    socket.emit('room:joined', { roomCode: room.code, playerId: socket.id, sessionId });
    emitRoom(room);
  });

  socket.on('room:reconnect', ({ sessionId }) => {
    if (!sessionId) return;
    const info = playerSessionMap.get(sessionId);
    if (!info) return;
    const room = rooms.get(info.roomCode);
    if (!room) return;

    let found = null;
    for (const p of room.players.values()) {
      if (p.sessionId === sessionId) {
        found = p;
        break;
      }
    }
    if (!found) return;

    room.players.delete(found.id);
    const oldId = found.id;
    found.id = socket.id;
    found.connected = true;
    room.players.set(socket.id, found);
    if (room.hostId === oldId) room.hostId = socket.id;

    playerSessionMap.set(sessionId, { roomCode: room.code, playerId: socket.id });
    socket.join(room.code);

    socket.emit('room:joined', { roomCode: room.code, playerId: socket.id, sessionId });
    emitRoom(room);
  });

  socket.on('room:leave', () => removePlayer(socket.id));

  socket.on('player:ready', ({ ready }) => {
    for (const room of rooms.values()) {
      const p = room.players.get(socket.id);
      if (!p || room.status !== 'lobby' || p.bot || p.spectator) continue;
      p.ready = !!ready;
      emitRoom(room);
      return;
    }
  });

  socket.on('player:setProfile', ({ profile }) => {
    for (const room of rooms.values()) {
      const p = room.players.get(socket.id);
      if (!p || room.status !== 'lobby' || p.bot) continue;
      p.name = clampName(profile?.name);
      if (COLORS.includes(profile?.color)) p.color = profile.color;
      if (AVATARS.includes(profile?.avatar)) p.avatar = profile.avatar;
      emitRoom(room);
      return;
    }
  });

  socket.on('room:updateSettings', (payload) => {
    for (const room of rooms.values()) {
      if (room.hostId !== socket.id || room.status !== 'lobby') continue;

      if (payload.diff && DIFFS[payload.diff]) room.settings.diff = payload.diff;
      if (payload.bg && ['day', 'night'].includes(payload.bg)) room.settings.bg = payload.bg;
      if (payload.pipe && ['green', 'red'].includes(payload.pipe)) room.settings.pipe = payload.pipe;
      if (typeof payload.isPublic === 'boolean') room.public = payload.isPublic;
      if (typeof payload.password === 'string') room.password = payload.password.slice(0, 24);
      if (payload.maxPlayers) {
        const n = Math.max(2, Math.min(6, payload.maxPlayers));
        const humans = [...room.players.values()].filter(p => !p.bot && !p.spectator).length;
        if (n >= humans) room.settings.maxPlayers = n;
      }
      if (typeof payload.botCount === 'number') {
        room.settings.botCount = Math.max(0, Math.min(5, payload.botCount));
        addBotsToRoom(room);
      }
      if (payload.roundsToWin) room.roundsToWin = Math.max(1, Math.min(5, payload.roundsToWin));

      emitRoom(room);
      return;
    }
  });

  socket.on('room:start', () => {
    for (const room of rooms.values()) {
      if (room.hostId !== socket.id) continue;
      const err = canStart(room, socket.id);
      if (err) return socket.emit('room:error', err);
      startCountdown(room);
      emitRoom(room);
      return;
    }
  });

  socket.on('room:nextRound', () => {
    for (const room of rooms.values()) {
      if (room.hostId !== socket.id || room.status !== 'results') continue;
      startCountdown(room);
      emitRoom(room);
      return;
    }
  });

  socket.on('room:restartMatch', () => {
    for (const room of rooms.values()) {
      if (room.hostId !== socket.id) continue;
      room.round = 1;
      room.status = 'lobby';
      room.winnerId = null;
      room.placements = [];
      room.pipes = [];
      room.pipeTimer = 0;
      for (const p of room.players.values()) {
        p.wins = 0;
        p.score = 0;
        p.ready = p.bot || p.spectator;
        p.alive = !p.spectator;
      }
      emitRoom(room);
      return;
    }
  });

  socket.on('chat:send', ({ text }) => {
    const msg = String(text || '').trim();
    if (!msg) return;
    for (const room of rooms.values()) {
      const p = room.players.get(socket.id);
      if (!p) continue;
      pushChat(room, p.name, msg, false);
      emitRoom(room);
      return;
    }
  });

  socket.on('player:flap', () => {
    for (const room of rooms.values()) {
      if (room.status !== 'playing') continue;
      const p = room.players.get(socket.id);
      if (!p || !p.alive || p.spectator) return;
      p.vel = DIFFS[room.settings.diff].jump;
      return;
    }
  });

  socket.on('ping:client', (t) => socket.emit('pong:server', t));

  socket.on('disconnect', () => {
    for (const room of rooms.values()) {
      const p = room.players.get(socket.id);
      if (!p) continue;

      if (p.bot) return;
      if (p.sessionId) {
        p.connected = false;
        emitRoom(room);
        setTimeout(() => {
          const still = room.players.get(socket.id);
          if (still && still.connected === false) removePlayer(socket.id);
        }, 30000);
        return;
      }

      removePlayer(socket.id);
      return;
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});