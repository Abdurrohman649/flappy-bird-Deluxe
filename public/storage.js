import { LIMITS, STORAGE_KEYS } from './config.js';

function safeParse(json, fallback) {
  try {
    const value = JSON.parse(json);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function loadJSON(key, fallback) {
  return safeParse(localStorage.getItem(key), fallback);
}

export function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeJSON(key) {
  localStorage.removeItem(key);
}

/* ───────── PROFILE ───────── */

export function getProfile() {
  const data = loadJSON(STORAGE_KEYS.profile, {
    name: 'Игрок' + ((Math.random() * 900 + 100) | 0),
    color: 'yellow',
    avatar: 'STAR'
  });

  return {
    name: sanitizeName(data.name),
    color: sanitizeColor(data.color),
    avatar: sanitizeAvatar(data.avatar)
  };
}

export function saveProfile(profile) {
  saveJSON(STORAGE_KEYS.profile, {
    name: sanitizeName(profile.name),
    color: sanitizeColor(profile.color),
    avatar: sanitizeAvatar(profile.avatar)
  });
}

/* ───────── SINGLE SETTINGS ───────── */

export function getSingleSettings() {
  const data = loadJSON(STORAGE_KEYS.singleSettings, {
    diff: 'normal',
    bg: 'day',
    pipe: 'green',
    sound: true
  });

  return {
    diff: sanitizeDiff(data.diff),
    bg: sanitizeBg(data.bg),
    pipe: sanitizePipe(data.pipe),
    sound: !!data.sound
  };
}

export function saveSingleSettings(settings) {
  saveJSON(STORAGE_KEYS.singleSettings, {
    diff: sanitizeDiff(settings.diff),
    bg: sanitizeBg(settings.bg),
    pipe: sanitizePipe(settings.pipe),
    sound: !!settings.sound
  });
}

/* ───────── ROOM CREATE SETTINGS ───────── */

export function getRoomCreateSettings() {
  const data = loadJSON(STORAGE_KEYS.roomCreateSettings, {
    isPublic: true,
    password: '',
    spectator: false,
    diff: 'normal',
    bg: 'day',
    pipe: 'green',
    maxPlayers: 4,
    botCount: 0,
    roundsToWin: 3
  });

  return {
    isPublic: !!data.isPublic,
    password: sanitizePassword(data.password),
    spectator: !!data.spectator,
    diff: sanitizeDiff(data.diff),
    bg: sanitizeBg(data.bg),
    pipe: sanitizePipe(data.pipe),
    maxPlayers: sanitizeMaxPlayers(data.maxPlayers),
    botCount: sanitizeBotCount(data.botCount),
    roundsToWin: sanitizeRounds(data.roundsToWin)
  };
}

export function saveRoomCreateSettings(settings) {
  saveJSON(STORAGE_KEYS.roomCreateSettings, {
    isPublic: !!settings.isPublic,
    password: sanitizePassword(settings.password),
    spectator: !!settings.spectator,
    diff: sanitizeDiff(settings.diff),
    bg: sanitizeBg(settings.bg),
    pipe: sanitizePipe(settings.pipe),
    maxPlayers: sanitizeMaxPlayers(settings.maxPlayers),
    botCount: sanitizeBotCount(settings.botCount),
    roundsToWin: sanitizeRounds(settings.roundsToWin)
  });
}

/* ───────── SINGLE RECORDS ───────── */

export function getSingleRecords() {
  const list = loadJSON(STORAGE_KEYS.singleRecords, []);
  if (!Array.isArray(list)) return [];

  return list
    .map(item => ({
      score: sanitizeNumber(item.score, 0),
      diff: sanitizeDiff(item.diff),
      bg: sanitizeBg(item.bg),
      pipe: sanitizePipe(item.pipe),
      date: sanitizeNumber(item.date, Date.now())
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, LIMITS.maxRecords);
}

export function addSingleRecord(score, settings) {
  const list = getSingleRecords();

  list.push({
    score: sanitizeNumber(score, 0),
    diff: sanitizeDiff(settings.diff),
    bg: sanitizeBg(settings.bg),
    pipe: sanitizePipe(settings.pipe),
    date: Date.now()
  });

  list.sort((a, b) => b.score - a.score);

  if (list.length > LIMITS.maxRecords) {
    list.length = LIMITS.maxRecords;
  }

  saveJSON(STORAGE_KEYS.singleRecords, list);
}

export function clearSingleRecords() {
  saveJSON(STORAGE_KEYS.singleRecords, []);
}

/* ───────── MULTI RECORDS ───────── */

export function getMultiRecords() {
  const list = loadJSON(STORAGE_KEYS.multiRecords, []);
  if (!Array.isArray(list)) return [];

  return list
    .map(item => ({
      name: sanitizeName(item.name),
      place: sanitizeNumber(item.place, 99),
      score: sanitizeNumber(item.score, 0),
      roomCode: sanitizeRoomCode(item.roomCode),
      date: sanitizeNumber(item.date, Date.now())
    }))
    .sort((a, b) => {
      if (a.place !== b.place) return a.place - b.place;
      return b.score - a.score;
    })
    .slice(0, LIMITS.maxRecords);
}

export function addMultiRecord(name, place, score, roomCode) {
  const list = getMultiRecords();

  const entry = {
    name: sanitizeName(name),
    place: sanitizeNumber(place, 99),
    score: sanitizeNumber(score, 0),
    roomCode: sanitizeRoomCode(roomCode),
    date: Date.now()
  };

  const duplicate = list.find(item =>
    item.name === entry.name &&
    item.place === entry.place &&
    item.score === entry.score &&
    item.roomCode === entry.roomCode &&
    Math.abs(item.date - entry.date) < 3000
  );

  if (duplicate) return;

  list.push(entry);

  list.sort((a, b) => {
    if (a.place !== b.place) return a.place - b.place;
    return b.score - a.score;
  });

  if (list.length > LIMITS.maxRecords) {
    list.length = LIMITS.maxRecords;
  }

  saveJSON(STORAGE_KEYS.multiRecords, list);
}

export function clearMultiRecords() {
  saveJSON(STORAGE_KEYS.multiRecords, []);
}

/* ───────── SESSION ───────── */

export function getSessionId() {
  return localStorage.getItem(STORAGE_KEYS.session) || '';
}

export function saveSessionId(id) {
  localStorage.setItem(STORAGE_KEYS.session, String(id || ''));
}

/* ───────── HELPERS ───────── */

function sanitizeName(name) {
  return String(name || 'Игрок').trim().slice(0, LIMITS.playerName) || 'Игрок';
}

function sanitizeColor(color) {
  return ['yellow', 'blue', 'red'].includes(color) ? color : 'yellow';
}

function sanitizeAvatar(avatar) {
  return ['STAR', 'CROWN', 'BOLT', 'HEART', 'MOON', 'SKULL'].includes(avatar)
    ? avatar
    : 'STAR';
}

function sanitizeDiff(diff) {
  return ['easy', 'normal', 'hard'].includes(diff) ? diff : 'normal';
}

function sanitizeBg(bg) {
  return ['day', 'night'].includes(bg) ? bg : 'day';
}

function sanitizePipe(pipe) {
  return ['green', 'red'].includes(pipe) ? pipe : 'green';
}

function sanitizePassword(password) {
  return String(password || '').slice(0, LIMITS.roomPassword);
}

function sanitizeMaxPlayers(n) {
  const value = sanitizeNumber(n, 4);
  return Math.max(2, Math.min(LIMITS.maxPlayers, value));
}

function sanitizeBotCount(n) {
  const value = sanitizeNumber(n, 0);
  return Math.max(0, Math.min(LIMITS.maxBots, value));
}

function sanitizeRounds(n) {
  const value = sanitizeNumber(n, 3);
  return Math.max(1, Math.min(5, value));
}

function sanitizeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function sanitizeRoomCode(code) {
  return String(code || '----').toUpperCase().slice(0, 8);
}