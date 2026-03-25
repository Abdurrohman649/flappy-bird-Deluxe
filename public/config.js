export const W = 288;
export const H = 512;
export const GROUND_Y = H - 112;

export const COLORS = ['yellow', 'blue', 'red'];
export const AVATARS = ['STAR', 'CROWN', 'BOLT', 'HEART', 'MOON', 'SKULL'];

export const DIFFS = {
  easy: {
    gap: 155,
    speed: 2.0,
    gravity: 0.35,
    jump: -6.2,
    spawnRate: 100
  },
  normal: {
    gap: 125,
    speed: 2.8,
    gravity: 0.45,
    jump: -7.2,
    spawnRate: 85
  },
  hard: {
    gap: 95,
    speed: 3.8,
    gravity: 0.55,
    jump: -7.8,
    spawnRate: 70
  }
};

export const THEME = {
  skyBlue: '#69d2ff',
  aqua: '#4db6ac',
  gold: '#ffd166',
  white: '#ffffff',
  textSoft: '#d6f4f9',
  textDim: '#cfe7ef',
  shadow: '#000000',

  green: '#81c784',
  greenDark: '#234100',

  blue: '#6bb8d6',
  blueDark: '#083540',

  purple: '#ba68c8',
  purpleDark: '#240836',

  red: '#ff8a80',
  redDark: '#5c1e16'
};

export const UI = {
  panelRadius: 10,
  cardRadius: 8,
  buttonRadius: 7,
  inputRadius: 6,

  topMargin: 16,
  sideMargin: 10,

  menuPanelX: 10,
  menuPanelY: 16,
  menuPanelW: 268,
  menuPanelH: 480,

  safeBottom: 16
};

export const HOME_LAYOUT = {
  panelX: 26,
  panelY: 24,
  panelW: 236,
  panelH: 376,

  titleY: 58,
  subtitleY: 98,

  birdX: W / 2 - 22,
  birdY: 146,

  buttons: {
    w: 176,
    h: 38,
    x: W / 2 - 88,
    y1: 196,
    y2: 242,
    y3: 288
  }
};

export const PROFILE_LAYOUT = {
  panelX: 10,
  panelY: 16,
  panelW: 268,
  panelH: 480
};

export const SINGLE_LAYOUT = {
  panelX: 10,
  panelY: 16,
  panelW: 268,
  panelH: 480
};

export const MULTI_LAYOUT = {
  panelX: 10,
  panelY: 16,
  panelW: 268,
  panelH: 480
};

export const MOBILE = {
  flapButtonX: W - 42,
  flapButtonY: H - 72,
  flapButtonR: 28
};

export const AUDIO = {
  defaultVolume: 0.35,
  uiVolume: 0.2,
  pointVolume: 0.25,
  hitVolume: 0.3
};

export const STORAGE_KEYS = {
  profile: 'fb_profile',
  singleSettings: 'fb_single_settings',
  roomCreateSettings: 'fb_room_create_settings',
  singleRecords: 'fb_single_records',
  multiRecords: 'fb_multi_records',
  session: 'fb_session'
};

export const LIMITS = {
  playerName: 16,
  roomPassword: 24,
  chatMessage: 160,
  maxRecords: 50,
  maxBots: 5,
  maxPlayers: 6
};