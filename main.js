import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { clone as cloneSkeleton } from "three/addons/utils/SkeletonUtils.js";

const stage = document.getElementById("game-stage");
const gameContainer = document.getElementById("game-container");
const stageStatus = document.getElementById("stage-status");
const scoreValue = document.getElementById("score-value");
const coinValue = document.getElementById("coin-value");
const speedValue = document.getElementById("speed-value");
const bestValue = document.getElementById("best-value");
const walletValue = document.getElementById("wallet-value");
const activeRewards = document.getElementById("active-rewards");
const quickRewardBar = document.getElementById("quick-reward-bar");
const bonusBanner = document.getElementById("bonus-banner");
const treasureBanner = document.getElementById("treasure-banner");
const goldenFlash = document.getElementById("golden-flash");
const scorePopLayer = document.getElementById("score-pop-layer");
const startScreen = document.getElementById("start-screen");
const pauseScreen = document.getElementById("pause-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const audioStatus = document.getElementById("audio-status");
const finalScore = document.getElementById("final-score");
const finalCoins = document.getElementById("final-coins");
const finalBest = document.getElementById("final-best");
const gameOverRunnerStage = document.getElementById("game-over-runner-stage");
const mysteryBoxPanel = document.getElementById("mystery-box-panel");
const openMysteryBoxButton = document.getElementById("open-mystery-box-button");
const mysteryBoxButtonLabel = document.getElementById("mystery-box-button-label");
const mysteryBoxButtonCount = document.getElementById("mystery-box-button-count");
const mysteryBoxResult = document.getElementById("mystery-box-result");
const menuWalletValue = document.getElementById("menu-wallet-value");
const menuBestValue = document.getElementById("menu-best-value");
const menuLastCoinsValue = document.getElementById("menu-last-coins-value");
const menuQueuedRewardsValue = document.getElementById("menu-queued-rewards-value");
const menuRewardSummary = document.getElementById("menu-reward-summary");
const menuInventoryList = document.getElementById("menu-inventory-list");
const featuredRewardStrip = document.getElementById("featured-reward-strip");
const enableAudioButton = document.getElementById("enable-audio-button");
const testAudioButton = document.getElementById("test-audio-button");
const toggleMusicButton = document.getElementById("toggle-music-button");
const toggleSfxButton = document.getElementById("toggle-sfx-button");
const shopWallet = document.getElementById("shop-wallet");
const openShopButton = document.getElementById("open-shop-button");
const pauseShopButton = document.getElementById("pause-shop-button");
const closeShopButton = document.getElementById("close-shop-button");
const shopScreen = document.getElementById("shop-screen");
const shopWalletModal = document.getElementById("shop-wallet-modal");
const shopWalletHero = document.getElementById("shop-wallet-hero");
const characterShopGrid = document.getElementById("character-shop-grid");
const hoverboardShopGrid = document.getElementById("hoverboard-shop-grid");
const styleStatus = document.getElementById("style-status");
const difficultyStatus = document.getElementById("difficulty-status");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const resumeButton = document.getElementById("resume-button");
const pauseHomeButton = document.getElementById("pause-home-button");
const gameOverHomeButton = document.getElementById("game-over-home-button");
const pauseButton = document.getElementById("pause-button");
const muteButton = document.getElementById("mute-button");
const controlLeft = document.getElementById("control-left");
const controlRight = document.getElementById("control-right");
const controlJump = document.getElementById("control-jump");
const controlSlide = document.getElementById("control-slide");
const shopBuyButtons = Array.from(document.querySelectorAll(".shop-buy-button"));
const difficultyButtons = Array.from(document.querySelectorAll("[data-difficulty]"));
const menuTabButtons = Array.from(document.querySelectorAll("[data-menu-tab]"));
const menuPanels = Array.from(document.querySelectorAll("[data-menu-panel]"));
const graphicsQualityButtons = Array.from(document.querySelectorAll("[data-graphics-quality]"));

const laneX = [-3.3, 0, 3.3];
const SHOP_COST = {
  shield: 95,
  magnet: 110,
  "jump-boots": 85,
  "double-coins": 135,
  "treasure-box": 165
};
const REWARD_SHOP_META = {
  shield: { title: "Shield", blurb: "Protects you from one crash", accent: "#d98cff" },
  magnet: { title: "Magnet", blurb: "Pulls nearby coins toward you", accent: "#ff9a68" },
  "jump-boots": { title: "Jump Boots", blurb: "Gives you higher jumps and better air control", accent: "#65c3ff" },
  "double-coins": { title: "Double Coins", blurb: "Doubles the value of collected coins", accent: "#ffd45f" },
  "treasure-box": { title: "Treasure Box", blurb: "Unlocks a rare bonus or surprise reward", accent: "#7ab0ff" }
};
const RUN_REWARD_MILESTONES = [
  { coins: 25, wallet: 18, label: "Street Bonus" },
  { coins: 60, wallet: 42, label: "Treasure Bonus" },
  { coins: 110, wallet: 78, label: "Royal Bonus" }
];
const DIFFICULTY_MODES = {
  easy: {
    label: "Easy",
    description: "Relaxed pacing with more recovery time and safer spacing.",
    speedMultiplier: 0.94,
    initialObstacleDelay: 3.1,
    obstacleDelayMin: 1.06,
    obstacleDelayMax: 1.42,
    spawnTimerMin: 0.52,
    spawnTimerMax: 0.76,
    coinCap: 24,
    denseCooldownMin: 1.35,
    denseCooldownMax: 1.95,
    lightCooldownMin: 0.9,
    lightCooldownMax: 1.3,
    powerUpCap: 1,
    powerUpChance: 0.05,
    trafficGapMin: 0.5,
    trafficGapMax: 0.74
  },
  medium: {
    label: "Medium",
    description: "Balanced pacing with fair coin runs and clean jump arcs.",
    speedMultiplier: 1,
    initialObstacleDelay: 2.6,
    obstacleDelayMin: 0.94,
    obstacleDelayMax: 1.3,
    spawnTimerMin: 0.42,
    spawnTimerMax: 0.66,
    coinCap: 20,
    denseCooldownMin: 1.55,
    denseCooldownMax: 2.2,
    lightCooldownMin: 1,
    lightCooldownMax: 1.45,
    powerUpCap: 1,
    powerUpChance: 0.04,
    trafficGapMin: 0.42,
    trafficGapMax: 0.62
  },
  hard: {
    label: "Hard",
    description: "Faster flow, tighter gaps, and high-focus near-miss runs.",
    speedMultiplier: 1.08,
    initialObstacleDelay: 2.2,
    obstacleDelayMin: 0.84,
    obstacleDelayMax: 1.12,
    spawnTimerMin: 0.34,
    spawnTimerMax: 0.54,
    coinCap: 18,
    denseCooldownMin: 1.75,
    denseCooldownMax: 2.45,
    lightCooldownMin: 1.12,
    lightCooldownMax: 1.62,
    powerUpCap: 1,
    powerUpChance: 0.03,
    trafficGapMin: 0.34,
    trafficGapMax: 0.52
  }
};
const CHARACTER_STYLES = [
  { key: "classic", label: "Classic", cost: 0, tint: 0xffffff, tintMix: 0, emissive: 0x000000, emissiveMix: 0, emissiveIntensity: 0.02 },
  { key: "neon", label: "Neon", cost: 120, tint: 0x6fd6ff, tintMix: 0.34, emissive: 0x1ec8ff, emissiveMix: 1, emissiveIntensity: 1.2 },
  { key: "stealth", label: "Stealth", cost: 140, tint: 0x16181d, tintMix: 0.78, emissive: 0x020304, emissiveMix: 0.18, emissiveIntensity: 0.08 },
  { key: "royal", label: "Royal", cost: 180, tint: 0xffd86b, tintMix: 0.42, emissive: 0xffb300, emissiveMix: 0.48, emissiveIntensity: 0.42 }
];
const HOVERBOARD_STYLES = [
  { key: "sunset", label: "Sunset", cost: 0, color: 0xff5d3d, emissive: 0xff935d, glow: 0xffd26a },
  { key: "aqua", label: "Aqua", cost: 110, color: 0x29e1d8, emissive: 0x16afb5, glow: 0x8bfff5 },
  { key: "lava", label: "Lava", cost: 140, color: 0xff6f2d, emissive: 0xff2d2d, glow: 0xffb163 },
  { key: "galaxy", label: "Galaxy", cost: 190, color: 0x7d5dff, emissive: 0xa066ff, glow: 0xdab4ff }
];
const roadSegments = [];
const laneStripes = [];
const sideDecor = [];
const clouds = [];
const stars = [];
const lampHalos = [];
const trafficLights = [];
const rainDrops = [];
const coins = [];
const obstacles = [];
const trafficCars = [];
const trafficCarPool = [];
const powerUps = [];
const particles = [];
const trailSegments = [];
const debugHitboxes = false;

let scene;
let camera;
let renderer;
let clock;
let audioContext = null;
let masterGain = null;
let musicGain = null;
let sfxGain = null;
let engineOscillator = null;
let engineLfo = null;
let engineGain = null;
let engineFilter = null;
let audioPrimed = false;
let htmlAudioEnabled = false;
let fallbackMusicStep = 0;
let nextFallbackMusicTime = 0;
let musicStep = 0;
let nextMusicNoteTime = 0;
let hemisphereLight;
let sunLight;
let ambientLight;
let sunMesh;
let moonMesh;
let roadPlane;
let roadScrollTexture = null;

let player;
let hoverboard;
let hoverGlow;
let leftArmPivot;
let rightArmPivot;
let leftLegPivot;
let rightLegPivot;
let shieldMesh;
let playerShadow;

let laneIndex = 1;
let targetLane = laneX[1];
let jumpVelocity = 0;
let playerY = 0;
let jumpsLeft = 2;
let isSliding = false;
let slideTimer = 0;
let spawnTimer = 0;
let bonusTimer = 0;
let shieldTimer = 0;
let magnetTimer = 0;
let coinRainTimer = 0;
let jumpBoostTimer = 0;
let doubleCoinsTimer = 0;
let obstacleSpawnDelay = 0;
let coinPatternCooldown = 0;
let trafficGapCooldown = 0;
let trafficSpawnTimer = 0;
let screenShakeTimer = 0;
let screenShakeStrength = 0;
let weatherMode = "clear";
let weatherTimer = 0;
let treasureCoinSpawnCooldown = 0;

let score = 0;
let displayedScore = 0;
let coinCount = 0;
let displayedCoins = 0;
let walletCoins = 0;
let speed = 16;
let distance = 0;
let bestScore = 0;
let lastRunCoins = 0;
let lastRunScore = 0;
let state = "ready";
let touchStart = null;
let isMuted = false;

let treasureSlowTriggered = false;
let treasureGoldTriggered = false;
let treasureModeLevel = 0;
let purchasedRewards = [];
let rewardMilestoneClaimed = [];
let shopReturnOverlay = "start";
let unlockedCharacterStyles = ["classic"];
let unlockedHoverboardStyles = ["sunset"];
let equippedCharacterStyle = "classic";
let equippedHoverboardStyle = "sunset";
let selectedDifficulty = "medium";
let activeMenuTab = "home";
let musicEnabled = true;
let sfxEnabled = true;
let graphicsQuality = "medium";
let pendingMysteryBoxes = 0;
let lastMysteryReward = "";
let forcedCoinBoxRewards = 2;

const gravity = 18;
const jumpForce = 17.2;
const baseSpeed = 15.2;
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
const tempVec = new THREE.Vector3();
const cameraBase = new THREE.Vector3(0, 6.8, 11.2);
const BUILDING_BODY_PALETTE = [0xf0b15b, 0xeb9758, 0xc972d6, 0x79b86d, 0x7ca6e8, 0xf3cf67];
const BUILDING_TRIM_PALETTE = [0xfff2d7, 0xf8ead2, 0xf4f6fb];
const BUILDING_AWNING_PALETTE = [0xff6b5f, 0xff9f43, 0x7bc96f, 0x5fb7ff, 0xbf73ff];
const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();
const RUNNER_MODEL_PATH = "./assets/models/boy-runner.glb";
const RUNNER_MODEL_FBX_PATH = "./assets/models/Running.fbx";
const FORCE_STYLIZED_RUNNER = false;
const FORCE_STYLIZED_TRAFFIC = true;
const USE_HOVERBOARD = false;
const VEHICLE_MODEL_ROOT = "./assets/models/vehicles";
const AUDIO_ROOT = "./assets/audio";
const vehicleModelCache = new Map();
const vehicleModelYOffsetCache = new Map();
const DAY_PHASE_DISTANCE = 220;
const DUSK_PHASE_DISTANCE = 85;
const NIGHT_PHASE_DISTANCE = 220;
const DAWN_PHASE_DISTANCE = 85;
const LOCK_SUNSET_LOOK = false;
const htmlToneCache = new Map();
const soundEffects = {};
const activeMediaSounds = new Set();
let bgMusic = null;

const BASE_VEHICLE_TYPES = [
  {
    key: "truck",
    path: `${VEHICLE_MODEL_ROOT}/truck.glb`,
    scale: 1.2,
    width: 1.22,
    height: 1.8,
    depth: 1.9
  },
  {
    key: "car",
    path: `${VEHICLE_MODEL_ROOT}/car.glb`,
    scale: 1.05,
    width: 1.02,
    height: 1.0,
    depth: 1.35
  },
  {
    key: "bus",
    path: `${VEHICLE_MODEL_ROOT}/bus.glb`,
    scale: 1.15,
    width: 1.28,
    height: 1.65,
    depth: 2.05
  },
  {
    key: "van",
    path: `${VEHICLE_MODEL_ROOT}/van.glb`,
    scale: 1.05,
    width: 1.08,
    height: 1.2,
    depth: 1.45
  },
  {
    key: "taxi",
    path: `${VEHICLE_MODEL_ROOT}/taxi.glb`,
    scale: 1.0,
    width: 1.04,
    height: 1.05,
    depth: 1.4
  },
  {
    key: "police",
    path: `${VEHICLE_MODEL_ROOT}/police.glb`,
    scale: 1.04,
    width: 1.06,
    height: 1.1,
    depth: 1.42
  },
  {
    key: "rickshaw",
    path: `${VEHICLE_MODEL_ROOT}/rickshaw.glb`,
    scale: 1.0,
    width: 0.92,
    height: 1.25,
    depth: 1.28
  },
  {
    key: "bike",
    path: `${VEHICLE_MODEL_ROOT}/bike.glb`,
    scale: 1.22,
    width: 0.96,
    height: 1.28,
    depth: 1.34
  }
];

const VEHICLE_VARIANTS = [
  { key: "standard", scaleMul: 1, widthMul: 1, heightMul: 1, depthMul: 1 },
  { key: "wide", scaleMul: 1.03, widthMul: 1.11, heightMul: 1.02, depthMul: 1.05 },
  { key: "long", scaleMul: 1.02, widthMul: 0.98, heightMul: 1.01, depthMul: 1.16 },
  { key: "heavy", scaleMul: 1.08, widthMul: 1.07, heightMul: 1.09, depthMul: 1.06 }
];

const VEHICLE_TYPES = BASE_VEHICLE_TYPES.flatMap((baseType) =>
  VEHICLE_VARIANTS.map((variant) => ({
    ...baseType,
    key: `${baseType.key}-${variant.key}`,
    familyKey: baseType.key,
    scale: Number((baseType.scale * variant.scaleMul).toFixed(3)),
    width: Number((baseType.width * variant.widthMul).toFixed(3)),
    height: Number((baseType.height * variant.heightMul).toFixed(3)),
    depth: Number((baseType.depth * variant.depthMul).toFixed(3))
  }))
);
const MODELED_TRAFFIC_FAMILIES = new Set(["car", "truck"]);
const TRAFFIC_VEHICLE_TYPES = VEHICLE_TYPES.filter((type) =>
  MODELED_TRAFFIC_FAMILIES.has(type.familyKey)
);
const TRAFFIC_BASE_VEHICLE = TRAFFIC_VEHICLE_TYPES.find((type) => type.familyKey === "car") ?? TRAFFIC_VEHICLE_TYPES[0] ?? VEHICLE_TYPES[0];
const TRAFFIC_SPAWN_MIN = 2.2;
const TRAFFIC_SPAWN_MAX = 3.4;
const TRAFFIC_MAX_CARS = 6;

const STATIC_OBSTACLE_TYPES = [
  { key: "cone-cluster", width: 1.08, height: 0.88, depth: 1.34 },
  { key: "barricade", width: 1.46, height: 1.36, depth: 1.08 },
  { key: "dumpster", width: 1.28, height: 1.26, depth: 1.02 },
  { key: "road-block", width: 1.34, height: 1.02, depth: 1.02 },
  { key: "crate-stack", width: 1.08, height: 1.45, depth: 0.98 }
];

let runnerMixer = null;
let runnerRoot = null;
let usingFallbackRunner = false;
let runnerAnimationClips = [];
let gameOverPreviewScene = null;
let gameOverPreviewCamera = null;
let gameOverPreviewRenderer = null;
let gameOverPreviewRoot = null;
let gameOverPreviewMixer = null;
let gameOverPreviewReady = false;

bootstrap();

function bootstrap() {
  applyRequestedScoreReset();
  applyRequestedFreshStart();
  bestScore = readBestScore();
  walletCoins = readWalletCoins();
  lastRunCoins = readLastRunCoins();
  lastRunScore = readLastRunScore();
  loadPurchasedRewards();
  loadPendingMysteryBoxes();
  loadCosmeticState();
  loadDifficultyState();
  loadSettingsState();
  preloadVehicleModels();

  try {
    initGame();
    setStageStatus("");
  } catch (error) {
    console.error(error);
    setStageStatus("3D scene failed to start. Open console and share the error.");
  }
}

function applyRequestedScoreReset() {
  try {
    const resetMarkerKey = "treasure-run-score-reset-20260403";
    if (window.localStorage.getItem(resetMarkerKey) === "done") {
      return;
    }

    window.localStorage.setItem("treasure-run-best", "0");
    window.localStorage.setItem("treasure-run-last-score", "0");
    window.localStorage.setItem("treasure-run-last-coins", "0");
    window.localStorage.setItem(resetMarkerKey, "done");
  } catch (error) {
    console.warn("Score reset could not be applied.", error);
  }
}

function applyRequestedFreshStart() {
  try {
    const resetMarkerKey = "treasure-run-fresh-reset-20260403";
    if (window.localStorage.getItem(resetMarkerKey) === "done") {
      return;
    }

    window.localStorage.setItem("treasure-run-best", "0");
    window.localStorage.setItem("treasure-run-wallet", "0");
    window.localStorage.setItem("treasure-run-last-coins", "0");
    window.localStorage.setItem("treasure-run-last-score", "0");
    window.localStorage.setItem("treasure-run-purchased-rewards", JSON.stringify([]));
    window.localStorage.setItem("treasure-run-pending-mystery-boxes", "0");
    window.localStorage.setItem(resetMarkerKey, "done");
  } catch (error) {
    console.warn("Fresh start reset could not be applied.", error);
  }
}

function initGame() {
  createScene();
  createWorld();
  createPlayer();
  initGameOverPreview();
  setupMediaAudio();
  bindEvents();
  syncMuteButton();
  updateAudioStatus("Audio locked. Tap enable first in Edge.");
  updateHud(true);
  applyCosmetics();
  showHomeScreen();
  setStageStatus("Loading runner model...");
  animate();
}

function getDifficultyConfig() {
  return DIFFICULTY_MODES[selectedDifficulty] ?? DIFFICULTY_MODES.medium;
}

function getGraphicsPixelRatio() {
  const qualityCaps = {
    low: isTouchDevice ? 0.82 : 0.92,
    medium: isTouchDevice ? 1.05 : 1.18,
    high: isTouchDevice ? 1.2 : 1.35
  };
  return Math.min(window.devicePixelRatio, qualityCaps[graphicsQuality] ?? qualityCaps.medium);
}

function showHomeScreen() {
  state = "ready";
  gameContainer?.classList.add("home-mode");
  gameContainer?.classList.remove("gameover-mode");
  stage.style.filter = "saturate(1) brightness(1)";
  stage.style.transform = "scale(1)";
  updateAudioMix();
  syncMediaAudio();
  renderHomeMenu();
  showOverlay(startScreen);
}

function setStageStatus(message) {
  if (!stageStatus) {
    return;
  }

  stageStatus.textContent = message;
  stageStatus.style.display = message ? "block" : "none";
}

function createScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf2d2a1, 30, 138);

  const width = stage.clientWidth || 360;
  const height = stage.clientHeight || 640;

  camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 220);
  camera.position.set(0, 6.6, 12.1);
  camera.lookAt(0, 2.2, -20);

  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
  renderer.setPixelRatio(getGraphicsPixelRatio());
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  stage.querySelector("canvas")?.remove();
  stage.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  hemisphereLight = new THREE.HemisphereLight(0xfff0d3, 0xd09b63, 2.35);
  scene.add(hemisphereLight);

  ambientLight = new THREE.AmbientLight(0xffc98a, 0.42);
  scene.add(ambientLight);

  sunLight = new THREE.DirectionalLight(0xfff2d6, 2.6);
  sunLight.position.set(-8, 10, 22);
  sunLight.castShadow = false;
  scene.add(sunLight);

  sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(4.2, 30, 30),
    new THREE.MeshBasicMaterial({ color: 0xffefc0 })
  );
  sunMesh.position.set(0, 8.2, -92);
  scene.add(sunMesh);

  moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xdfe8ff, transparent: true, opacity: 0.08 })
  );
  moonMesh.position.set(-8, 12, -90);
  scene.add(moonMesh);

  for (let i = 0; i < 5; i += 1) {
    const cloud = new THREE.Mesh(
      new THREE.SphereGeometry(1.4 + (i % 2) * 0.45, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0xfff6ea, roughness: 1, transparent: true, opacity: 0.7 })
    );
    cloud.position.set(-12 + i * 6, 12 + (i % 2) * 1.2, -30 - i * 18);
    scene.add(cloud);
    clouds.push(cloud);
  }

  for (let i = 0; i < 36; i += 1) {
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.08 + (i % 3) * 0.03, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
    );
    star.position.set(
      THREE.MathUtils.randFloatSpread(34),
      THREE.MathUtils.randFloat(9, 22),
      -THREE.MathUtils.randFloat(30, 120)
    );
    scene.add(star);
    stars.push(star);
  }
}

function createWorld() {
  roadScrollTexture = createRoadScrollTexture();
  const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x45484d,
    roughness: 0.9,
    metalness: 0.08,
    map: roadScrollTexture
  });
  const sideMaterial = new THREE.MeshStandardMaterial({ color: 0xd4c4ae, roughness: 0.98 });
  const curbMaterial = new THREE.MeshStandardMaterial({ color: 0xe7dfd1, roughness: 0.92 });

  roadPlane = new THREE.Mesh(new THREE.PlaneGeometry(12.8, 190), roadMaterial);
  roadPlane.rotation.x = -Math.PI / 2;
  roadPlane.position.set(0, -0.13, -72);
  roadPlane.receiveShadow = true;
  scene.add(roadPlane);

  for (let i = 0; i < 9; i += 1) {
    const road = new THREE.Mesh(new THREE.BoxGeometry(12.8, 0.14, 20), roadMaterial);
    road.position.set(0, -0.08, -i * 20);
    road.receiveShadow = true;
    roadSegments.push(road);
    scene.add(road);
  }

  const leftSidewalk = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.26, 176), sideMaterial);
  leftSidewalk.position.set(-8.2, -0.04, -66);
  leftSidewalk.receiveShadow = true;
  scene.add(leftSidewalk);

  const rightSidewalk = leftSidewalk.clone();
  rightSidewalk.position.x = 8.2;
  scene.add(rightSidewalk);

  const leftCurb = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 176), curbMaterial);
  leftCurb.position.set(-6.32, 0.01, -66);
  leftCurb.receiveShadow = true;
  scene.add(leftCurb);

  const rightCurb = leftCurb.clone();
  rightCurb.position.x = 6.32;
  scene.add(rightCurb);

  for (let i = 0; i < 30; i += 1) {
    const stripeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5efe2,
      emissive: 0xffffff,
      emissiveIntensity: 0.02,
      roughness: 0.78
    });

    const leftStripe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 3.2), stripeMaterial);
    leftStripe.position.set(-1.65, 0.02, -i * 5.2);
    laneStripes.push(leftStripe);
    scene.add(leftStripe);

    const rightStripe = leftStripe.clone();
    rightStripe.position.x = 1.65;
    laneStripes.push(rightStripe);
    scene.add(rightStripe);
  }

  for (let i = 0; i < 14; i += 1) {
    addBuilding(-11.5, -10 - i * 13, i);
    addBuilding(11.5, -16 - i * 13, i + 2);
    addTree(-6.4, -8 - i * 13);
    addTree(6.4, -14 - i * 13);
    addLamp(-5.2, -12 - i * 13);
    addLamp(5.2, -18 - i * 13);
    if (i % 2 === 0) {
      addTrafficSignal(-4.7, -14 - i * 13, "left");
      addTrafficSignal(4.7, -20 - i * 13, "right");
    }
  }
}

function addBuilding(x, z, seed) {
  const width = 3.5 + (seed % 3) * 0.42;
  const height = 8.2 + (seed % 4) * 1.35;
  const bodyColor = new THREE.Color(`hsl(${(seed * 57 + Math.random() * 40) % 360}, 60%, 65%)`);
  const trim = BUILDING_TRIM_PALETTE[seed % BUILDING_TRIM_PALETTE.length];
  const awningColor = BUILDING_AWNING_PALETTE[(seed + 2) % BUILDING_AWNING_PALETTE.length];
  const facadeX = x < 0 ? width / 2 + 0.08 : -(width / 2 + 0.08);
  const facadeRot = x < 0 ? -Math.PI / 2 : Math.PI / 2;

  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.userData.kind = "building";
  group.userData.seed = seed;

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, 3, 2, 2, 2),
    new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: 0.6,
      metalness: 0.1
    })
  );
  body.userData.buildingPart = "body";
  body.position.y = height / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.24, 0.22, 4.98),
    new THREE.MeshStandardMaterial({ color: 0xb98e63, roughness: 0.9 })
  );
  roof.userData.buildingPart = "roof";
  roof.position.y = height + 0.12;
  roof.castShadow = true;
  group.add(roof);

  const cornice = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.18, 0.3, 4.94),
    new THREE.MeshStandardMaterial({ color: trim, roughness: 0.94 })
  );
  cornice.userData.buildingPart = "trim";
  cornice.position.y = height - 0.08;
  group.add(cornice);

  const awning = new THREE.Mesh(
    new THREE.BoxGeometry(width * 0.82, 0.16, 0.58),
    new THREE.MeshStandardMaterial({ color: awningColor, roughness: 0.86 })
  );
  awning.userData.buildingPart = "awning";
  awning.rotation.y = facadeRot;
  awning.position.set(facadeX, 2.02, 0);
  group.add(awning);

  const storefront = new THREE.Mesh(
    new THREE.BoxGeometry(width * 0.92, 2.05, 0.14),
    new THREE.MeshStandardMaterial({ color: trim, roughness: 0.9 })
  );
  storefront.rotation.y = facadeRot;
  storefront.position.set(facadeX - Math.sign(facadeX) * 0.01, 1.52, 0);
  group.add(storefront);

  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 1.38, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x7a5a43, roughness: 0.92 })
  );
  door.rotation.y = facadeRot;
  door.position.set(facadeX, 0.7, x < 0 ? 0.78 : -0.78);
  group.add(door);

  const shopWindows = [-0.92, 0.92];
  shopWindows.forEach((offset) => {
    const display = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 1.2, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0xbde8ff,
        roughness: 0.08,
        metalness: 0.18,
        transparent: true,
        opacity: 0.92
      })
    );
    display.position.set(facadeX, 0.96, offset * 0.9);
    display.rotation.y = facadeRot;
    group.add(display);
  });

  const floors = Math.max(4, Math.floor(height / 2.05));
  for (let row = 0; row < floors; row += 1) {
    for (let col = 0; col < 2; col += 1) {
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(0.76, 1.08, 0.1),
        new THREE.MeshStandardMaterial({ color: trim, roughness: 0.9 })
      );
      frame.position.set(
        facadeX,
        2.9 + row * 1.58,
        col === 0 ? -0.92 : 0.92
      );
      frame.rotation.y = facadeRot;
      group.add(frame);

      const pane = new THREE.Mesh(
        new THREE.BoxGeometry(0.56, 0.88, 0.08),
        new THREE.MeshStandardMaterial({
          color: row % 2 === 0 ? 0xffefcc : 0xe8eef4,
          emissive: row % 2 === 0 ? 0xffcb7b : 0x89b4d6,
          emissiveIntensity: row % 2 === 0 ? 0.26 : 0.16,
          roughness: 0.28,
          metalness: 0.12
        })
      );
      pane.position.set(
        facadeX,
        2.9 + row * 1.58,
        col === 0 ? -0.92 : 0.92
      );
      pane.rotation.y = facadeRot;
      group.add(pane);

      const sill = new THREE.Mesh(
        new THREE.BoxGeometry(0.74, 0.06, 0.16),
        new THREE.MeshStandardMaterial({ color: 0xedc28f, roughness: 0.92 })
      );
      sill.position.set(
        facadeX,
        2.36 + row * 1.58,
        col === 0 ? -0.92 : 0.92
      );
      sill.rotation.y = facadeRot;
      group.add(sill);
    }
  }

  if (seed % 2 === 0) {
    const shopSign = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.54, 0.34, 0.16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.84 })
    );
    shopSign.rotation.y = facadeRot;
    shopSign.position.set(facadeX, 2.36, 0);
    group.add(shopSign);
  }

  const cornerTrimA = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, height + 0.2, 4.9),
    new THREE.MeshStandardMaterial({ color: trim, roughness: 0.94 })
  );
  cornerTrimA.position.set(x < 0 ? width / 2 - 0.03 : -(width / 2 - 0.03), (height + 0.2) / 2, 0);
  group.add(cornerTrimA);

  const cornerTrimB = cornerTrimA.clone();
  cornerTrimB.position.x *= -1;
  group.add(cornerTrimB);

  if (seed % 3 === 0) {
    const topShape = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.36, 0.72, 3),
      new THREE.MeshStandardMaterial({ color: trim, roughness: 0.92 })
    );
    topShape.rotation.z = Math.PI / 2;
    topShape.rotation.x = Math.PI / 2;
    topShape.position.set(0, height + 0.45, 0);
    group.add(topShape);
  }

  scene.add(group);
  sideDecor.push({ mesh: group, speed: 0.34 });
}

function addTree(x, z) {
  const planter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.58, 0.46, 14),
    new THREE.MeshStandardMaterial({ color: 0x8f816f, roughness: 0.94 })
  );
  planter.position.set(x, 0.2, z);
  planter.receiveShadow = true;
  scene.add(planter);
  sideDecor.push({ mesh: planter, speed: 0.42 });

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.22, 1.7, 8),
    new THREE.MeshStandardMaterial({ color: 0x7a563a })
  );
  trunk.position.set(x, 0.85, z);
  trunk.castShadow = true;
  scene.add(trunk);
  sideDecor.push({ mesh: trunk, speed: 0.42 });

  const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x5d6a34, roughness: 0.9 });
  const crowns = [
    { ox: 0, oy: 2.28, oz: 0, s: 0.96 },
    { ox: -0.34, oy: 2.02, oz: 0.12, s: 0.68 },
    { ox: 0.32, oy: 2.06, oz: -0.08, s: 0.64 },
    { ox: 0.08, oy: 2.56, oz: 0, s: 0.54 }
  ];
  crowns.forEach(({ ox, oy, oz, s }) => {
    const leaves = new THREE.Mesh(new THREE.SphereGeometry(s, 16, 16), leafMaterial);
    leaves.position.set(x + ox, oy, z + oz);
    leaves.castShadow = true;
    scene.add(leaves);
    sideDecor.push({ mesh: leaves, speed: 0.42 });
  });
}

function addLamp(x, z) {
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 3.1, 10),
    new THREE.MeshStandardMaterial({ color: 0x2c2926, metalness: 0.26, roughness: 0.62 })
  );
  pole.position.set(x, 1.55, z);
  scene.add(pole);
  sideDecor.push({ mesh: pole, speed: 0.4 });

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, 0.08, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x2c2926, metalness: 0.24, roughness: 0.62 })
  );
  arm.position.set(x, 3.04, z);
  scene.add(arm);
  sideDecor.push({ mesh: arm, speed: 0.4 });

  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfff6df, emissive: 0xffdfa2, emissiveIntensity: 1.6 })
  );
  lamp.position.set(x + 0.24, 2.82, z);
  scene.add(lamp);
  sideDecor.push({ mesh: lamp, speed: 0.4 });

  const halo = new THREE.Mesh(
    new THREE.CircleGeometry(1.05, 24),
    new THREE.MeshBasicMaterial({ color: 0xffd79a, transparent: true, opacity: 0.16 })
  );
  halo.position.set(x + 0.24, 2.82, z);
  halo.lookAt(cameraBase);
  scene.add(halo);
  lampHalos.push({ halo, lamp });
}

function addTrafficSignal(x, z, side) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.11, 3.6, 10),
    new THREE.MeshStandardMaterial({ color: 0xd4dbe4, roughness: 0.62, metalness: 0.24 })
  );
  pole.position.y = 1.8;
  group.add(pole);

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.12, 0.12),
    new THREE.MeshStandardMaterial({ color: 0xc4ccd8, roughness: 0.62, metalness: 0.22 })
  );
  const armDirection = side === "left" ? 1 : -1;
  arm.position.set(armDirection * 0.72, 3.42, 0);
  group.add(arm);

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.96, 0.34),
    new THREE.MeshStandardMaterial({ color: 0x1f2738, roughness: 0.55, metalness: 0.2 })
  );
  head.position.set(armDirection * 1.38, 3.2, 0);
  group.add(head);

  const red = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x541111, emissive: 0x220000, emissiveIntensity: 0.12 })
  );
  red.position.set(0, 0.28, 0.18);
  head.add(red);

  const yellow = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x5c4c0a, emissive: 0x1a1400, emissiveIntensity: 0.12 })
  );
  yellow.position.set(0, 0, 0.18);
  head.add(yellow);

  const green = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x0e4a1f, emissive: 0x001a08, emissiveIntensity: 0.12 })
  );
  green.position.set(0, -0.28, 0.18);
  head.add(green);

  scene.add(group);
  sideDecor.push({ mesh: group, speed: 0.4 });
  trafficLights.push({
    red: red.material,
    yellow: yellow.material,
    green: green.material,
    phaseOffset: Math.random() * 6
  });
}

function createRoadScrollTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#5a6068";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 460; i += 1) {
    const alpha = 0.02 + Math.random() * 0.045;
    const size = 1 + Math.random() * 4;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      size,
      size * (0.8 + Math.random() * 1.2)
    );
  }

  ctx.fillStyle = "rgba(255, 214, 123, 0.045)";
  for (let i = 0; i < 18; i += 1) {
    ctx.fillRect(0, i * 56, canvas.width, 10);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.3, 8.5);
  texture.anisotropy = 4;
  return texture;
}

function randomizeBuildingAppearance(group) {
  const nextSeed = Math.floor(Math.random() * 1000);
  const bodyColor = new THREE.Color(`hsl(${Math.random() * 360}, 60%, 65%)`);
  const trimColor = BUILDING_TRIM_PALETTE[nextSeed % BUILDING_TRIM_PALETTE.length];
  const awningColor = BUILDING_AWNING_PALETTE[(nextSeed + 2) % BUILDING_AWNING_PALETTE.length];

  group.scale.y = 0.92 + Math.random() * 0.18;
  group.traverse((child) => {
    if (!child.isMesh || !child.material) {
      return;
    }
    if (child.userData.buildingPart === "body") {
      child.material.color.copy(bodyColor);
    } else if (child.userData.buildingPart === "trim") {
      child.material.color.setHex(trimColor);
    } else if (child.userData.buildingPart === "awning") {
      child.material.color.setHex(awningColor);
    }
  });
}

function createPlayer() {
  player = new THREE.Group();
  player.position.set(0, 0, 2.8);
  leftArmPivot = null;
  rightArmPivot = null;
  leftLegPivot = null;
  rightLegPivot = null;

  hoverboard = new THREE.Mesh(
    new THREE.BoxGeometry(1.85, 0.18, 0.75),
    new THREE.MeshStandardMaterial({
      color: 0xff5d3d,
      emissive: 0xff935d,
      emissiveIntensity: 0.55,
      metalness: 0.18,
      roughness: 0.4
    })
  );
  hoverboard.position.y = 0.16;
  hoverboard.castShadow = true;
  hoverboard.visible = USE_HOVERBOARD;
  player.add(hoverboard);

  hoverGlow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.95, 0.06, 24),
    new THREE.MeshBasicMaterial({ color: 0xffd26a, transparent: true, opacity: 0.42 })
  );
  hoverGlow.position.y = 0.02;
  hoverGlow.visible = USE_HOVERBOARD;
  player.add(hoverGlow);

  playerShadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.95, 28),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.16 })
  );
  playerShadow.rotation.x = -Math.PI / 2;
  playerShadow.position.y = -0.04;
  player.add(playerShadow);

  loadRunnerModel();

  shieldMesh = new THREE.Mesh(
    new THREE.TorusGeometry(1.15, 0.05, 12, 32),
    new THREE.MeshBasicMaterial({ color: 0x7df9ff, transparent: true, opacity: 0.8 })
  );
  shieldMesh.rotation.x = Math.PI / 2;
  shieldMesh.position.y = 1.45;
  shieldMesh.visible = false;
  player.add(shieldMesh);

  scene.add(player);
}

function loadRunnerModel() {
  if (FORCE_STYLIZED_RUNNER) {
    createFallbackRunner();
    setStageStatus("");
    return;
  }

  fbxLoader.load(
    RUNNER_MODEL_FBX_PATH,
    (fbx) => {
      applyLoadedRunner(fbx, fbx.animations || []);
      setStageStatus("");
    },
    undefined,
    () => {
      gltfLoader.load(
        RUNNER_MODEL_PATH,
        (gltf) => {
          applyLoadedRunner(gltf.scene, gltf.animations || []);
          setStageStatus("");
        },
        undefined,
        (error) => {
          console.warn("Runner model failed to load, using fallback.", error);
          createFallbackRunner();
          setStageStatus("Runner model missing, using fallback avatar.");
          setTimeout(() => setStageStatus(""), 2400);
        }
      );
    }
  );
}

function applyLoadedRunner(sourceRoot, animations) {
  runnerRoot?.removeFromParent();
  runnerRoot = sourceRoot;
  usingFallbackRunner = false;
  runnerAnimationClips = animations;
  runnerMixer = animations.length ? new THREE.AnimationMixer(runnerRoot) : null;

  normalizeRunnerModel(runnerRoot, 3.1);
  runnerRoot.position.set(0, 0.28, 0);
  runnerRoot.rotation.y = Math.PI;

  runnerRoot.traverse((child) => {
    if (!child.isMesh) {
      return;
    }
    child.castShadow = true;
    child.receiveShadow = true;
    if (child.material) {
      child.material.roughness = Math.min(1, child.material.roughness ?? 0.8);
    }
  });

  player.add(runnerRoot);
  applyCharacterStyle();
  syncGameOverRunnerPreview();

  if (runnerMixer && animations[0]) {
    runnerMixer.clipAction(animations[0]).play();
  }
}

function normalizeRunnerModel(root, targetHeight) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  if (size.y <= 0.001) {
    return;
  }

  const scale = targetHeight / size.y;
  root.scale.setScalar(scale);

  const boxAfterScale = new THREE.Box3().setFromObject(root);
  const center = boxAfterScale.getCenter(new THREE.Vector3());
  root.position.sub(center);
  root.position.y -= boxAfterScale.min.y;
}

function createFallbackRunner() {
  runnerRoot?.removeFromParent();
  runnerMixer = null;
  usingFallbackRunner = true;
  runnerAnimationClips = [];

  const group = new THREE.Group();
  group.userData.lockAppearance = true;
  group.scale.setScalar(1.22);
  group.position.y = 0.02;

  const hoodieBlue = 0x1e9dff;
  const hoodieDark = 0x1463c9;
  const accentYellow = 0xffc82f;
  const shortsColor = 0x303745;
  const skinColor = 0xffd1a6;
  const hairColor = 0x6a351f;
  const shoeBlue = 0x2a7fe2;
  const cuffBlue = 0x1a58b5;

  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.86, 1.14, 0.56),
    new THREE.MeshStandardMaterial({ color: hoodieBlue, roughness: 0.68 })
  );
  torso.position.y = 1.6;
  torso.castShadow = true;
  group.add(torso);

  const hoodieHem = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.08, 0.58),
    new THREE.MeshStandardMaterial({ color: accentYellow, roughness: 0.62 })
  );
  hoodieHem.position.y = 1.06;
  group.add(hoodieHem);

  const leftShoulderStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.06, 0.5),
    new THREE.MeshStandardMaterial({ color: accentYellow, roughness: 0.6 })
  );
  leftShoulderStripe.position.set(-0.35, 2.02, -0.02);
  group.add(leftShoulderStripe);
  const rightShoulderStripe = leftShoulderStripe.clone();
  rightShoulderStripe.position.x = 0.35;
  group.add(rightShoulderStripe);

  const chestText = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.16, 0.03),
    new THREE.MeshStandardMaterial({ color: accentYellow, roughness: 0.55, emissive: 0x8d5f00, emissiveIntensity: 0.25 })
  );
  chestText.position.set(0, 1.6, 0.3);
  group.add(chestText);

  const frontPocket = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, 0.22, 0.08),
    new THREE.MeshStandardMaterial({ color: hoodieDark, roughness: 0.7 })
  );
  frontPocket.position.set(0, 1.32, 0.3);
  group.add(frontPocket);

  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.46, 0.52),
    new THREE.MeshStandardMaterial({ color: hoodieDark, roughness: 0.7 })
  );
  hood.position.set(0, 2.04, -0.22);
  group.add(hood);

  const backStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.09, 0.04),
    new THREE.MeshStandardMaterial({ color: accentYellow, roughness: 0.62 })
  );
  backStripe.position.set(0, 1.38, -0.29);
  group.add(backStripe);

  const leftString = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.36, 8),
    new THREE.MeshStandardMaterial({ color: 0xe8edf3, roughness: 0.45 })
  );
  leftString.position.set(-0.07, 1.7, 0.31);
  group.add(leftString);
  const rightString = leftString.clone();
  rightString.position.x = 0.07;
  group.add(rightString);

  const shorts = new THREE.Mesh(
    new THREE.BoxGeometry(0.78, 0.46, 0.56),
    new THREE.MeshStandardMaterial({ color: shortsColor, roughness: 0.72 })
  );
  shorts.position.y = 0.86;
  shorts.castShadow = true;
  group.add(shorts);

  const leftPocket = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.28, 0.16),
    new THREE.MeshStandardMaterial({ color: 0x3e4658, roughness: 0.75 })
  );
  leftPocket.position.set(-0.43, 0.84, 0.06);
  group.add(leftPocket);
  const rightPocket = leftPocket.clone();
  rightPocket.position.x = 0.43;
  group.add(rightPocket);

  const rearPocket = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.14, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x464f63, roughness: 0.74 })
  );
  rearPocket.position.set(-0.15, 0.94, -0.28);
  group.add(rearPocket);
  const rearPocket2 = rearPocket.clone();
  rearPocket2.position.x = 0.15;
  group.add(rearPocket2);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.31, 20, 18),
    new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.62 })
  );
  head.position.y = 2.43;
  head.castShadow = true;
  group.add(head);

  const hairBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.18, 0.62),
    new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.6 })
  );
  hairBase.position.set(0, 2.72, 0);
  group.add(hairBase);

  for (let i = 0; i < 6; i += 1) {
    const spike = new THREE.Mesh(
      new THREE.ConeGeometry(0.09, 0.22, 8),
      new THREE.MeshStandardMaterial({ color: 0x7c4025, roughness: 0.58 })
    );
    spike.position.set(
      -0.2 + i * 0.08,
      2.84 + (i % 2) * 0.05,
      -0.05 + (i % 3) * 0.08
    );
    spike.rotation.x = -0.35;
    group.add(spike);
  }

  leftArmPivot = createLimbPivot(-0.57, 1.9, hoodieBlue, 0.2, 0.82, skinColor, shoeBlue, false, cuffBlue, accentYellow);
  rightArmPivot = createLimbPivot(0.57, 1.9, hoodieBlue, 0.2, 0.82, skinColor, shoeBlue, false, cuffBlue, accentYellow);
  leftLegPivot = createLimbPivot(-0.24, 1.04, shortsColor, 0.24, 0.98, skinColor, shoeBlue, true, cuffBlue, accentYellow);
  rightLegPivot = createLimbPivot(0.24, 1.04, shortsColor, 0.24, 0.98, skinColor, shoeBlue, true, cuffBlue, accentYellow);

  runnerRoot = group;
  player.add(group);
  applyCharacterStyle();
  syncGameOverRunnerPreview();
}

function createLimbPivot(
  x,
  y,
  color,
  width,
  height,
  skinColor = 0xffd1a6,
  trimColor = 0x2a7fe2,
  isLeg = false,
  cuffColor = 0x1a58b5,
  accentColor = 0xffc82f
) {
  const pivot = new THREE.Group();
  pivot.position.set(x, y, 0);

  const limb = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, width),
    new THREE.MeshStandardMaterial({ color })
  );
  limb.position.y = -height / 2;
  limb.castShadow = true;
  pivot.add(limb);

  const handOrSock = new THREE.Mesh(
    new THREE.BoxGeometry(width * 0.9, isLeg ? 0.2 : 0.16, width * 0.9),
    new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.62 })
  );
  handOrSock.position.y = -height + (isLeg ? 0.06 : 0.02);
  handOrSock.castShadow = true;
  pivot.add(handOrSock);

  const cuff = new THREE.Mesh(
    new THREE.BoxGeometry(width * 0.96, 0.08, width * 0.96),
    new THREE.MeshStandardMaterial({ color: cuffColor, roughness: 0.6 })
  );
  cuff.position.y = -height + (isLeg ? 0.22 : 0.14);
  pivot.add(cuff);

  if (!isLeg) {
    const band = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.9, 0.06, width * 0.9),
      new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.5 })
    );
    band.position.y = -height + 0.04;
    pivot.add(band);
  }

  if (isLeg) {
    const sock = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.92, 0.22, width * 0.92),
      new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.62 })
    );
    sock.position.y = -height + 0.02;
    pivot.add(sock);

    const shoe = new THREE.Mesh(
      new THREE.BoxGeometry(width * 1.35, 0.18, width * 2.05),
      new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.5, emissive: 0x173c7d, emissiveIntensity: 0.18 })
    );
    shoe.position.set(0, -height - 0.02, width * 0.22);
    shoe.castShadow = true;
    pivot.add(shoe);

    const sole = new THREE.Mesh(
      new THREE.BoxGeometry(width * 1.28, 0.06, width * 1.95),
      new THREE.MeshStandardMaterial({ color: 0xf2f4f9, roughness: 0.7 })
    );
    sole.position.set(0, -height - 0.12, width * 0.22);
    pivot.add(sole);
  }

  player.add(pivot);
  return pivot;
}

function applyCosmetics() {
  applyCharacterStyle();
  applyHoverboardStyle();
}

function applyCharacterStyle() {
  applyCharacterStyleToRoot(runnerRoot);
  applyCharacterStyleToRoot(gameOverPreviewRoot);
}

function applyCharacterStyleToRoot(root) {
  const style = CHARACTER_STYLES.find((item) => item.key === equippedCharacterStyle) ?? CHARACTER_STYLES[0];
  if (!root) {
    return;
  }
  if (root.userData?.lockAppearance) {
    return;
  }

  root.traverse((child) => {
    if (!child.isMesh || !child.material) {
      return;
    }
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) {
        return;
      }
      if (material.color) {
        if (!material.userData.baseColorHex) {
          material.userData.baseColorHex = material.color.getHex();
        }
        material.color.setHex(material.userData.baseColorHex);
        material.color.lerp(new THREE.Color(style.tint), 0.22);
      }
      if ("emissive" in material && material.emissive) {
        if (!material.userData.baseEmissiveHex) {
          material.userData.baseEmissiveHex = material.emissive.getHex();
        }
        material.emissive.setHex(material.userData.baseEmissiveHex);
        material.emissive.lerp(new THREE.Color(style.emissive), 0.2);
        material.emissiveIntensity = Math.max(0.05, material.emissiveIntensity ?? 0.2);
      }
    });
  });
}

function applyHoverboardStyle() {
  if (!USE_HOVERBOARD) {
    if (hoverboard) {
      hoverboard.visible = false;
    }
    if (hoverGlow) {
      hoverGlow.visible = false;
    }
    return;
  }
  const style = HOVERBOARD_STYLES.find((item) => item.key === equippedHoverboardStyle) ?? HOVERBOARD_STYLES[0];
  if (hoverboard?.material) {
    hoverboard.material.color.setHex(style.color);
    hoverboard.material.emissive?.setHex(style.emissive);
    hoverboard.material.emissiveIntensity = 0.55;
  }
  if (hoverGlow?.material) {
    hoverGlow.material.color.setHex(style.glow);
  }
}

function initGameOverPreview() {
  if (!gameOverRunnerStage || gameOverPreviewReady) {
    return;
  }

  gameOverRunnerStage.innerHTML = `
    <div class="game-over-runner-backdrop">
      <span class="game-over-runner-glow game-over-runner-glow-a"></span>
      <span class="game-over-runner-glow game-over-runner-glow-b"></span>
    </div>
  `;

  gameOverPreviewScene = new THREE.Scene();
  gameOverPreviewCamera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
  gameOverPreviewCamera.position.set(0, 1.35, 8.5);
  gameOverPreviewCamera.lookAt(0, 0.95, 0.35);

  const ambient = new THREE.HemisphereLight(0xffebb9, 0x39284b, 2.1);
  gameOverPreviewScene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffd2a5, 2.4);
  keyLight.position.set(3.6, 6.4, 6.8);
  gameOverPreviewScene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x89cbff, 1.2);
  rimLight.position.set(-3.2, 2.8, 5.6);
  gameOverPreviewScene.add(rimLight);

  gameOverPreviewRenderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  gameOverPreviewRenderer.setClearColor(0x000000, 0);
  gameOverPreviewRenderer.outputColorSpace = THREE.SRGBColorSpace;
  gameOverPreviewRenderer.domElement.className = "game-over-runner-canvas";
  gameOverRunnerStage.appendChild(gameOverPreviewRenderer.domElement);

  gameOverPreviewReady = true;
  resizeGameOverPreview();
  syncGameOverRunnerPreview();
}

function resizeGameOverPreview() {
  if (!gameOverPreviewReady || !gameOverRunnerStage || !gameOverPreviewRenderer || !gameOverPreviewCamera) {
    return;
  }

  const width = Math.max(gameOverRunnerStage.clientWidth || 0, 220);
  const height = Math.max(gameOverRunnerStage.clientHeight || 0, 182);
  gameOverPreviewCamera.aspect = width / height;
  gameOverPreviewCamera.updateProjectionMatrix();
  gameOverPreviewRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  gameOverPreviewRenderer.setSize(width, height, false);
}

function syncGameOverRunnerPreview() {
  if (!gameOverPreviewReady || !gameOverPreviewScene) {
    return;
  }

  gameOverPreviewRoot?.removeFromParent();
  gameOverPreviewRoot = null;
  gameOverPreviewMixer = null;

  if (!runnerRoot) {
    return;
  }

  const previewClone = cloneSkeleton(runnerRoot);
  previewClone.traverse((child) => {
    if (!child.isMesh) {
      return;
    }
    child.castShadow = false;
    child.receiveShadow = false;
    if (child.material) {
      child.material = Array.isArray(child.material)
        ? child.material.map((material) => material.clone())
        : child.material.clone();
    }
  });

  previewClone.scale.copy(runnerRoot.scale).multiplyScalar(0.92);
  previewClone.position.set(0, -1.28, 0.25);
  previewClone.rotation.set(0, 0, 0);

  gameOverPreviewScene.add(previewClone);
  gameOverPreviewRoot = previewClone;

  if (runnerAnimationClips.length > 0) {
    gameOverPreviewMixer = new THREE.AnimationMixer(previewClone);
    gameOverPreviewMixer.clipAction(runnerAnimationClips[0]).play();
  }

  applyCharacterStyleToRoot(gameOverPreviewRoot);
}

function bindEvents() {
  window.addEventListener("resize", resizeRenderer);

  window.addEventListener("keydown", (event) => {
    void primeAudioFromGesture();
    if (event.code === "ArrowLeft" || event.code === "KeyA") {
      event.preventDefault();
      moveLane(-1);
    }
    if (event.code === "ArrowRight" || event.code === "KeyD") {
      event.preventDefault();
      moveLane(1);
    }
    if (event.code === "ArrowUp" || event.code === "KeyW" || event.code === "Space") {
      event.preventDefault();
      jump();
    }
    if (event.code === "ArrowDown" || event.code === "KeyS") {
      event.preventDefault();
      slide();
    }
    if (event.code === "KeyP") {
      event.preventDefault();
      togglePause();
    }
    if (event.code === "KeyM") {
      event.preventDefault();
      toggleMute();
    }
  });

  stage.addEventListener("pointerdown", (event) => {
    void primeAudioFromGesture();
    touchStart = { x: event.clientX, y: event.clientY };
  });

  stage.addEventListener("pointerup", (event) => {
    if (!touchStart || state !== "running") {
      touchStart = null;
      return;
    }

    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) < 18) {
      jump();
    } else if (absX > absY) {
      moveLane(dx > 0 ? 1 : -1);
    } else if (dy < 0) {
      jump();
    } else {
      slide();
    }

    touchStart = null;
  });

  [startButton, restartButton, resumeButton, pauseHomeButton, gameOverHomeButton, muteButton, controlLeft, controlRight, controlJump, controlSlide, testAudioButton]
    .forEach((button) => {
      button?.addEventListener("pointerdown", () => {
        void primeAudioFromGesture();
      });
    });

  enableAudioButton?.addEventListener("pointerdown", () => {
    void enableAudioManually();
  });
  testAudioButton?.addEventListener("pointerdown", () => {
    void runAudioDiagnostic();
  });
  shopBuyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const reward = button.dataset.reward;
      if (!reward) {
        return;
      }
      buyReward(reward);
    });
  });
  difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modeKey = button.dataset.difficulty;
      if (!modeKey) {
        return;
      }
      setDifficulty(modeKey);
    });
  });
  toggleMusicButton?.addEventListener("click", () => {
    musicEnabled = !musicEnabled;
    writeSettingsState();
    renderSettingsControls();
    updateAudioMix();
    syncMediaAudio();
  });
  toggleSfxButton?.addEventListener("click", () => {
    sfxEnabled = !sfxEnabled;
    writeSettingsState();
    renderSettingsControls();
    updateAudioMix();
    if (!sfxEnabled) {
      stopAllMediaSounds();
    }
  });
  openMysteryBoxButton?.addEventListener("click", openPendingMysteryBox);
  graphicsQualityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const quality = button.dataset.graphicsQuality;
      if (!quality) {
        return;
      }
      graphicsQuality = quality;
      writeSettingsState();
      renderSettingsControls();
      resizeRenderer();
    });
  });
  menuTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabKey = button.dataset.menuTab;
      if (!tabKey) {
        return;
      }
      setMenuTab(tabKey);
    });
  });

  quickRewardBar?.addEventListener("pointerdown", onQuickRewardPress);
  openShopButton?.addEventListener("click", openShopOverlay);
  pauseShopButton?.addEventListener("click", openShopOverlay);
  closeShopButton?.addEventListener("click", closeShopOverlay);
  pauseHomeButton?.addEventListener("click", showHomeScreen);
  gameOverHomeButton?.addEventListener("click", showHomeScreen);
  characterShopGrid?.addEventListener("click", onCosmeticShopClick);
  hoverboardShopGrid?.addEventListener("click", onCosmeticShopClick);
  startButton.addEventListener("click", () => void startRun());
  restartButton.addEventListener("click", () => void startRun());
  resumeButton.addEventListener("click", () => void resumeRun());
  pauseButton.addEventListener("click", togglePause);
  muteButton.addEventListener("click", toggleMute);
  controlLeft.addEventListener("click", () => moveLane(-1));
  controlRight.addEventListener("click", () => moveLane(1));
  controlJump.addEventListener("click", jump);
  controlSlide.addEventListener("click", slide);
}

function setDifficulty(modeKey) {
  if (!DIFFICULTY_MODES[modeKey]) {
    return;
  }
  selectedDifficulty = modeKey;
  writeDifficultyState();
  renderDifficultyButtons();
  renderHomeMenu();
}

function setMenuTab(tabKey) {
  activeMenuTab = tabKey;
  menuTabButtons.forEach((button) => {
    const isActive = button.dataset.menuTab === tabKey;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  menuPanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.menuPanel !== tabKey);
  });
}

function renderSettingsControls() {
  if (toggleMusicButton) {
    toggleMusicButton.textContent = musicEnabled ? "On" : "Off";
    toggleMusicButton.classList.toggle("active", musicEnabled);
    toggleMusicButton.setAttribute("aria-pressed", musicEnabled ? "true" : "false");
  }
  if (toggleSfxButton) {
    toggleSfxButton.textContent = sfxEnabled ? "On" : "Off";
    toggleSfxButton.classList.toggle("active", sfxEnabled);
    toggleSfxButton.setAttribute("aria-pressed", sfxEnabled ? "true" : "false");
  }
  graphicsQualityButtons.forEach((button) => {
    const isActive = button.dataset.graphicsQuality === graphicsQuality;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function renderHomeMenu() {
  renderSettingsControls();
  renderGameOverRunner();
  const totalQueuedRewards = purchasedRewards.length;
  if (menuWalletValue) {
    menuWalletValue.textContent = String(walletCoins);
  }
  if (menuBestValue) {
    menuBestValue.textContent = String(bestScore);
  }
  if (menuLastCoinsValue) {
    menuLastCoinsValue.textContent = String(lastRunCoins);
  }
  if (menuQueuedRewardsValue) {
    menuQueuedRewardsValue.textContent = String(lastRunScore);
  }
  if (menuRewardSummary) {
    if (!totalQueuedRewards) {
      menuRewardSummary.textContent = "No emergency rewards queued yet.";
    } else {
      const summary = Object.keys(REWARD_SHOP_META)
        .map((type) => {
          const count = getQueuedRewardCount(type);
          if (!count) {
            return null;
          }
          return `${REWARD_SHOP_META[type].title} x${count}`;
        })
        .filter(Boolean)
        .join("  |  ");
      menuRewardSummary.textContent = summary;
    }
  }
  if (menuInventoryList) {
    if (!totalQueuedRewards) {
      menuInventoryList.innerHTML = `
            <div class="menu-inventory-item">
              <span class="menu-inventory-copy">
                <span class="menu-inventory-name">Inventory Empty</span>
                <span class="menu-inventory-meta">Rewards you buy from the shop will appear here.</span>
              </span>
            </div>
      `;
    } else {
      menuInventoryList.innerHTML = Object.keys(REWARD_SHOP_META)
        .map((type) => {
          const count = getQueuedRewardCount(type);
          if (!count) {
            return "";
          }
          const meta = REWARD_SHOP_META[type];
          return `
            <div class="menu-inventory-item">
              ${getRewardPreviewMarkup(type)}
              <span class="menu-inventory-copy">
                <span class="menu-inventory-name">${meta.title}</span>
                <span class="menu-inventory-meta">${meta.blurb} | Queued x${count}</span>
              </span>
            </div>
          `;
        })
        .join("");
    }
  }
  if (featuredRewardStrip) {
    const featuredTypes = ["shield", "magnet", "double-coins"];
    featuredRewardStrip.innerHTML = featuredTypes.map((type) => {
      const meta = REWARD_SHOP_META[type];
      const queued = getQueuedRewardCount(type);
      const tag = queued > 0 ? `Queued x${queued}` : `${SHOP_COST[type]} coins`;
      return `
        <div class="featured-reward-card" style="--reward-accent:${meta.accent}">
          ${getRewardPreviewMarkup(type)}
          <span class="featured-reward-name">${meta.title}</span>
          <span class="featured-reward-tag">${tag}</span>
        </div>
      `;
    }).join("");
  }
  renderMysteryBoxPanel();
  setMenuTab(activeMenuTab);
}

function renderGameOverRunner() {
  syncGameOverRunnerPreview();
  resizeGameOverPreview();
}

function renderMysteryBoxPanel() {
  if (!mysteryBoxPanel || !mysteryBoxResult) {
    return;
  }

  if (pendingMysteryBoxes <= 0 && !lastMysteryReward) {
    mysteryBoxPanel.classList.add("hidden");
    mysteryBoxResult.classList.add("hidden");
    mysteryBoxResult.innerHTML = "";
    return;
  }

  mysteryBoxPanel.classList.remove("hidden");
  if (mysteryBoxButtonCount) {
    mysteryBoxButtonCount.textContent = `x${pendingMysteryBoxes}`;
  }
  if (mysteryBoxButtonLabel) {
    mysteryBoxButtonLabel.textContent = pendingMysteryBoxes > 0 ? "Open Mystery Box" : "All Boxes Opened";
  }
  if (openMysteryBoxButton) {
    openMysteryBoxButton.disabled = pendingMysteryBoxes <= 0;
  }

  if (!lastMysteryReward) {
    mysteryBoxResult.classList.add("hidden");
    mysteryBoxResult.innerHTML = "";
    return;
  }

  const rewardResult = resolveMysteryBoxResult(lastMysteryReward);

  mysteryBoxResult.classList.remove("hidden");
  mysteryBoxResult.innerHTML = `
    <div class="mystery-box-result-card">
      ${rewardResult.preview}
      <div class="mystery-box-result-copy">
        <span class="mystery-box-result-title">${rewardResult.title}</span>
        <span class="mystery-box-result-meta">${rewardResult.meta}</span>
      </div>
    </div>
  `;
}

function onQuickRewardPress(event) {
  const button = event.target.closest("button[data-use-reward]");
  if (!button) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const reward = button.dataset.useReward;
  if (!reward) {
    return;
  }

  useStoredReward(reward);
}

function resizeRenderer() {
  const width = stage.clientWidth || 360;
  const height = stage.clientHeight || 640;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(getGraphicsPixelRatio());
  renderer.setSize(width, height);
  resizeGameOverPreview();
}

async function startRun() {
  await primeAudioFromGesture();
  state = "running";
  gameContainer?.classList.remove("home-mode");
  gameContainer?.classList.remove("gameover-mode");
  resetGame();
  updateAudioMix();
  syncMediaAudio();
  updateAudioStatus(isMuted ? "Sound is muted. Turn Sound: On first." : "Audio enabled. Run started.");
  hideOverlays();
  stage.style.filter = "saturate(1) brightness(1)";
  stage.style.transform = "scale(1)";
  renderQuickRewardBar();
  playStartJingle();
}

async function resumeRun() {
  if (state !== "paused") {
    return;
  }
  await primeAudioFromGesture();
  state = "running";
  gameContainer?.classList.remove("home-mode");
  gameContainer?.classList.remove("gameover-mode");
  updateAudioMix();
  syncMediaAudio();
  pauseScreen.classList.add("hidden");
  renderQuickRewardBar();
}

function resetGame() {
  const difficulty = getDifficultyConfig();
  clearDynamicObjects();
  lastMysteryReward = "";
  laneIndex = 1;
  targetLane = laneX[1];
  jumpVelocity = 0;
  playerY = 0;
  jumpsLeft = 2;
  isSliding = false;
  slideTimer = 0;
  spawnTimer = 0.25;
  bonusTimer = 0;
  shieldTimer = 0;
  magnetTimer = 0;
  coinRainTimer = 0;
  jumpBoostTimer = 0;
  doubleCoinsTimer = 0;
  obstacleSpawnDelay = 0;
  coinPatternCooldown = 0;
  trafficGapCooldown = 0;
  trafficSpawnTimer = THREE.MathUtils.randFloat(TRAFFIC_SPAWN_MIN, TRAFFIC_SPAWN_MAX);
  screenShakeTimer = 0;
  screenShakeStrength = 0;
  weatherMode = "clear";
  weatherTimer = 8;
  treasureCoinSpawnCooldown = 0;
  fallbackMusicStep = 0;
  nextFallbackMusicTime = 0;
  musicStep = 0;
  nextMusicNoteTime = 0;
  score = 0;
  displayedScore = 0;
  coinCount = 0;
  displayedCoins = 0;
  speed = baseSpeed * difficulty.speedMultiplier;
  distance = 0;
  treasureSlowTriggered = false;
  treasureGoldTriggered = false;
  treasureModeLevel = 0;
  rewardMilestoneClaimed = RUN_REWARD_MILESTONES.map(() => false);
  purchasedRewards = [...purchasedRewards];
  player.position.set(0, 0, 2.8);
  player.rotation.set(0, 0, 0);
  player.scale.set(1, 1, 1);
  applyCosmetics();
  shieldMesh.visible = false;
  goldenFlash.classList.add("hidden");
  goldenFlash.classList.remove("active");
  treasureBanner.classList.add("hidden");
  updateHud(true);
  hideBonus();
  gameOverScreen.classList.add("hidden");
  pauseScreen.classList.add("hidden");
  if (bgMusic) {
    bgMusic.currentTime = 0;
  }
  syncMediaAudio();
  obstacleSpawnDelay = difficulty.initialObstacleDelay;
  spawnRewardShowcase();
  spawnPurchasedRewards();
}

function clearDynamicObjects() {
  [coins, obstacles, trafficCars, powerUps, particles, trailSegments].forEach((list) => {
    while (list.length) {
      const item = list.pop();
      if (item.mesh) {
        scene.remove(item.mesh);
      }
    }
  });
  trafficCarPool.forEach((car) => {
    if (car.parent) {
      car.parent.remove(car);
    }
  });
}

function spawnRewardShowcase() {
  renderQuickRewardBar();
}

function spawnPurchasedRewards() {
  renderQuickRewardBar();
}

function moveLane(direction) {
  if (state !== "running") {
    return;
  }

  laneIndex = THREE.MathUtils.clamp(laneIndex + direction, 0, laneX.length - 1);
  targetLane = laneX[laneIndex];
  playTone(250 + laneIndex * 50, 0.04, "square", 0.012);
}

function jump() {
  if (state !== "running" || jumpsLeft <= 0) {
    return;
  }
  const activeJumpForce = jumpBoostTimer > 0 ? jumpForce * 1.28 : jumpForce;
  jumpVelocity = Math.max(jumpVelocity, activeJumpForce);
  jumpsLeft -= 1;
  playJumpSound();
}

function slide() {
  if (state !== "running") {
    return;
  }
  if (playerY > 0.1) {
    jumpVelocity = Math.min(jumpVelocity, -15.5);
    playSlideSound();
    return;
  }
  if (isSliding) {
    return;
  }
  isSliding = true;
  slideTimer = 0.65;
  player.scale.y = 0.58;
  playSlideSound();
}

function togglePause() {
  if (state === "ready" || state === "gameover") {
    return;
  }

  if (state === "paused") {
    resumeRun();
    return;
  }

  state = "paused";
  syncMediaAudio();
  showOverlay(pauseScreen);
}

function toggleMute() {
  isMuted = !isMuted;
  syncMuteButton();
  void ensureAudio();
  updateAudioMix();
  if (isMuted) {
    stopAllMediaSounds();
  }
  syncMediaAudio();
  updateAudioStatus(isMuted ? "Sound muted." : "Sound on. Tap Enable Audio if you still hear nothing.");
}

function syncMuteButton() {
  muteButton.textContent = isMuted ? "Sound: Off" : "Sound: On";
}

function updateAudioStatus(message) {
  if (audioStatus) {
    audioStatus.textContent = message;
  }
}

function setupMediaAudio() {
  soundEffects.enable = `${AUDIO_ROOT}/enable.wav`;
  soundEffects.coin = `${AUDIO_ROOT}/coin.wav`;
  soundEffects.jump = `${AUDIO_ROOT}/jump.wav`;
  soundEffects.crash = `${AUDIO_ROOT}/crash.wav`;

  bgMusic = new Audio(`${AUDIO_ROOT}/music-loop.wav`);
  bgMusic.preload = "auto";
  bgMusic.loop = true;
  bgMusic.volume = 0.55;
}

function playMediaSound(name, volume = 1) {
  if (isMuted || !sfxEnabled || !soundEffects[name]) {
    return false;
  }

  const audio = new Audio(soundEffects[name]);
  audio.preload = "auto";
  audio.volume = Math.max(0, Math.min(1, volume));
  activeMediaSounds.add(audio);
  audio.addEventListener("ended", () => activeMediaSounds.delete(audio), { once: true });
  audio.addEventListener("error", () => activeMediaSounds.delete(audio), { once: true });
  audio.play().catch(() => activeMediaSounds.delete(audio));
  return true;
}

function stopAllMediaSounds() {
  activeMediaSounds.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
  activeMediaSounds.clear();
}

function syncMediaAudio() {
  if (!bgMusic) {
    return;
  }

  bgMusic.volume = isMuted || !musicEnabled ? 0 : (state === "running" ? 0.55 : 0.28);
  if (isMuted || !musicEnabled || state === "ready" || state === "gameover") {
    bgMusic.pause();
    return;
  }

  bgMusic.play().catch(() => {});
}

function updateHud(force = false) {
  renderDifficultyButtons();
  renderHomeMenu();
  bestValue.textContent = String(bestScore);
  displayedScore = force ? Math.floor(score) : THREE.MathUtils.damp(displayedScore, score, 8, 0.16);
  displayedCoins = force ? coinCount : THREE.MathUtils.damp(displayedCoins, coinCount, 10, 0.16);
  scoreValue.textContent = String(Math.floor(displayedScore));
  coinValue.textContent = String(Math.floor(displayedCoins));
  speedValue.textContent = `${speed.toFixed(1)}x`;
  if (walletValue) {
    walletValue.textContent = String(walletCoins);
  }
  if (shopWallet) {
    shopWallet.textContent = `Wallet: ${walletCoins} coins`;
  }
  if (shopWalletModal) {
    shopWalletModal.textContent = `Wallet: ${walletCoins} coins`;
  }
  if (shopWalletHero) {
    shopWalletHero.textContent = String(walletCoins);
  }
  renderShopButtons();
  renderQuickRewardBar();
  renderCosmeticShop();
  renderActiveRewards();
}

function buyReward(type) {
  const cost = SHOP_COST[type] ?? 0;
  if (walletCoins < cost) {
    showBonus("Not Enough Coins");
    return;
  }

  walletCoins -= cost;
  purchasedRewards.push(type);
  writePurchasedRewards();
  writeWalletCoins(walletCoins);
  updateHud(true);
  showBonus(`Bought ${formatRewardName(type)}`);
}

function getQueuedRewardCount(type) {
  return purchasedRewards.reduce((count, reward) => count + (reward === type ? 1 : 0), 0);
}

function renderShopButtons() {
  shopBuyButtons.forEach((element) => {
    const type = element.dataset.reward;
    if (!type || !SHOP_COST[type]) {
      return;
    }
    const meta = REWARD_SHOP_META[type];
    if (!meta) {
      return;
    }
    const queued = getQueuedRewardCount(type);
    const queuedText = queued > 0 ? `Queued x${queued}` : "Tap to queue";
    element.style.setProperty("--reward-accent", meta.accent);
    element.innerHTML = `
      ${getRewardPreviewMarkup(type)}
      <span class="shop-reward-copy">
        <span class="shop-reward-head">
          <span class="shop-reward-title">${meta.title}</span>
          <span class="shop-reward-price">${SHOP_COST[type]}</span>
        </span>
        <span class="shop-reward-blurb">${meta.blurb}</span>
        <span class="shop-reward-queue">${queuedText}</span>
      </span>
    `;
  });
}

function renderQuickRewardBar() {
  if (!quickRewardBar) {
    return;
  }

  const rewardCounts = Object.keys(REWARD_SHOP_META)
    .map((type) => ({ type, count: getQueuedRewardCount(type) }));

  if (state !== "running" && state !== "paused") {
    quickRewardBar.classList.add("hidden");
    quickRewardBar.innerHTML = "";
    return;
  }

  quickRewardBar.classList.remove("hidden");
  quickRewardBar.innerHTML = `
    <div class="quick-reward-panel">
      <div class="quick-reward-title">Emergency Rewards</div>
      ${rewardCounts.map(({ type, count }) => {
    const meta = REWARD_SHOP_META[type];
    return `
      <button class="quick-reward-button ${count <= 0 ? "is-empty" : ""}" type="button" data-use-reward="${type}" style="--reward-accent:${meta.accent}" ${count <= 0 ? "disabled" : ""}>
        ${getRewardPreviewMarkup(type)}
        <span class="quick-reward-name">${meta.title}</span>
        <span class="quick-reward-count">${count}</span>
      </button>
    `;
  }).join("")}
    </div>
  `;
}

function useStoredReward(type) {
  if (state !== "running") {
    showBonus("Start run first");
    return;
  }

  const index = purchasedRewards.indexOf(type);
  if (index === -1) {
    return;
  }

  purchasedRewards.splice(index, 1);
  writePurchasedRewards();
  applyPowerUp(type);
  renderQuickRewardBar();
  updateHud(true);
}

function queueMysteryBox(count = 1, reason = "Mystery Box secured") {
  pendingMysteryBoxes += count;
  writePendingMysteryBoxes();
  renderMysteryBoxPanel();
  showBonus(reason);
}

function rollMysteryBoxReward() {
  if (forcedCoinBoxRewards > 0) {
    forcedCoinBoxRewards -= 1;
    return {
      type: "coins",
      amount: forcedCoinBoxRewards === 1 ? 100 : 200,
      weight: 0
    };
  }

  const rewardPool = [
    { type: "shield", weight: 28 },
    { type: "magnet", weight: 24 },
    { type: "jump-boots", weight: 22 },
    { type: "double-coins", weight: 18 },
    { type: "treasure-box", weight: 8 },
    { type: "coins", amount: 50, weight: 6 },
    { type: "coins", amount: 100, weight: 4 },
    { type: "coins", amount: 200, weight: 2 },
    { type: "coins", amount: 500, weight: 1 }
  ];
  const totalWeight = rewardPool.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < rewardPool.length; i += 1) {
    roll -= rewardPool[i].weight;
    if (roll <= 0) {
      return rewardPool[i];
    }
  }
  return { type: "shield" };
}

function openPendingMysteryBox() {
  if (pendingMysteryBoxes <= 0) {
    return;
  }

  pendingMysteryBoxes -= 1;
  const rewardResult = rollMysteryBoxReward();
  if (rewardResult.type === "coins") {
    walletCoins += rewardResult.amount;
    lastMysteryReward = { kind: "coins", amount: rewardResult.amount };
    writeWalletCoins(walletCoins);
  } else {
    purchasedRewards.push(rewardResult.type);
    lastMysteryReward = rewardResult.type;
    writePurchasedRewards();
  }
  writePendingMysteryBoxes();
  renderMysteryBoxPanel();
  updateHud(true);
  if (rewardResult.type === "coins") {
    showBonus(`${rewardResult.amount} coins added to wallet`);
  } else {
    showBonus(`${formatRewardName(rewardResult.type)} added to inventory`);
  }
}

function resolveMysteryBoxResult(result) {
  if (result && typeof result === "object" && result.kind === "coins") {
    return {
      title: `${result.amount} Coins Added`,
      meta: "Lucky coin bonus sent directly to your wallet.",
      preview: getRewardPreviewMarkup("double-coins")
    };
  }

  const rewardType = typeof result === "string" ? result : "shield";
  const meta = REWARD_SHOP_META[rewardType];
  if (!meta) {
    return {
      title: "Reward Added",
      meta: "Mystery box opened successfully.",
      preview: getRewardPreviewMarkup("shield")
    };
  }

  return {
    title: `${meta.title} Added`,
    meta: meta.blurb,
    preview: getRewardPreviewMarkup(rewardType)
  };
}

function getRewardPreviewMarkup(type) {
  if (type === "shield") {
    return `
      <span class="shop-reward-preview shield-preview" aria-hidden="true">
        <span class="shield-core"></span>
        <span class="shield-ring shield-ring-a"></span>
        <span class="shield-ring shield-ring-b"></span>
      </span>
    `;
  }
  if (type === "magnet") {
    return `
      <span class="shop-reward-preview magnet-preview" aria-hidden="true">
        <span class="magnet-arc"></span>
        <span class="magnet-tip magnet-tip-left"></span>
        <span class="magnet-tip magnet-tip-right"></span>
        <span class="magnet-wave"></span>
      </span>
    `;
  }
  if (type === "jump-boots") {
    return `
      <span class="shop-reward-preview boots-preview" aria-hidden="true">
        <span class="boot boot-left"></span>
        <span class="boot boot-right"></span>
        <span class="boot-ring"></span>
      </span>
    `;
  }
  if (type === "double-coins") {
    return `
      <span class="shop-reward-preview coins-preview" aria-hidden="true">
        <span class="shop-coin coin-a"></span>
        <span class="shop-coin coin-b"></span>
        <span class="shop-coin coin-c"></span>
        <span class="coin-halo"></span>
      </span>
    `;
  }
  return `
    <span class="shop-reward-preview box-preview" aria-hidden="true">
      <span class="box-base"></span>
      <span class="box-lid"></span>
      <span class="box-band"></span>
      <span class="box-ring"></span>
      <span class="box-mark">?</span>
    </span>
  `;
}

function onCosmeticShopClick(event) {
  const button = event.target.closest("button[data-style]");
  if (!button) {
    return;
  }

  const styleKey = button.dataset.style;
  const styleType = button.dataset.styleType;
  if (!styleKey || !styleType) {
    return;
  }

  if (styleType === "character") {
    handleCharacterStyleAction(styleKey);
    return;
  }
  if (styleType === "board") {
    handleHoverboardStyleAction(styleKey);
  }
}

function handleCharacterStyleAction(styleKey) {
  const style = CHARACTER_STYLES.find((item) => item.key === styleKey);
  if (!style) {
    return;
  }
  if (!unlockedCharacterStyles.includes(styleKey)) {
    if (walletCoins < style.cost) {
      showBonus("Not Enough Coins");
      return;
    }
    walletCoins -= style.cost;
    unlockedCharacterStyles = [...unlockedCharacterStyles, styleKey];
    writeWalletCoins(walletCoins);
    writeCosmeticState();
    showBonus(`${style.label} Unlocked`);
  }
  equippedCharacterStyle = styleKey;
  writeCosmeticState();
  applyCharacterStyle();
  updateHud(true);
}

function handleHoverboardStyleAction(styleKey) {
  const style = HOVERBOARD_STYLES.find((item) => item.key === styleKey);
  if (!style) {
    return;
  }
  if (!unlockedHoverboardStyles.includes(styleKey)) {
    if (walletCoins < style.cost) {
      showBonus("Not Enough Coins");
      return;
    }
    walletCoins -= style.cost;
    unlockedHoverboardStyles = [...unlockedHoverboardStyles, styleKey];
    writeWalletCoins(walletCoins);
    writeCosmeticState();
    showBonus(`${style.label} Board Unlocked`);
  }
  equippedHoverboardStyle = styleKey;
  writeCosmeticState();
  applyHoverboardStyle();
  updateHud(true);
}

function renderCosmeticShop() {
  renderCosmeticButtons(characterShopGrid, CHARACTER_STYLES, "character", unlockedCharacterStyles, equippedCharacterStyle);
  renderCosmeticButtons(hoverboardShopGrid, HOVERBOARD_STYLES, "board", unlockedHoverboardStyles, equippedHoverboardStyle);

  if (styleStatus) {
    const character = CHARACTER_STYLES.find((item) => item.key === equippedCharacterStyle)?.label ?? "Classic";
    const board = HOVERBOARD_STYLES.find((item) => item.key === equippedHoverboardStyle)?.label ?? "Sunset";
    styleStatus.textContent = `Equipped: ${character} + ${board}`;
  }
}

function renderCosmeticButtons(container, styles, styleType, unlockedStyles, equippedStyle) {
  if (!container) {
    return;
  }
  container.innerHTML = styles.map((style) => {
    const unlocked = unlockedStyles.includes(style.key);
    const equipped = equippedStyle === style.key;
    let action = `Buy ${style.cost}`;
    if (unlocked) {
      action = equipped ? "Equipped" : "Equip";
    }
    const classes = `shop-button ${equipped ? "equipped" : ""}`.trim();
    return `
      <button class="${classes} cosmetic-shop-button" data-style="${style.key}" data-style-type="${styleType}" type="button">
        ${getCosmeticPreviewMarkup(style, styleType)}
        <span class="shop-reward-copy">
          <span class="shop-reward-head">
            <span class="shop-reward-title">${style.label}</span>
            <span class="shop-reward-price">${unlocked ? "" : style.cost}</span>
          </span>
          <span class="shop-reward-blurb">${styleType === "character" ? "Same runner, new material style" : "Hoverboard skin preview"}</span>
          <span class="shop-reward-queue">${action}</span>
        </span>
      </button>
    `;
  }).join("");
}

function getCosmeticPreviewMarkup(style, styleType) {
  if (styleType === "character") {
    const previewTheme = getCharacterPreviewTheme(style.key);
    return `
      <span class="shop-reward-preview character-style-preview ${style.key}-preview" aria-hidden="true" style="--preview-main:${previewTheme.main};--preview-accent:${previewTheme.accent};--preview-emissive:${previewTheme.emissive};">
        <span class="character-head"></span>
        <span class="character-body"></span>
        <span class="character-arm arm-left"></span>
        <span class="character-arm arm-right"></span>
        <span class="character-leg leg-left"></span>
        <span class="character-leg leg-right"></span>
      </span>
    `;
  }

  return `
    <span class="shop-reward-preview board-style-preview" aria-hidden="true" style="--board-main:#${style.color.toString(16).padStart(6, "0")};--board-glow:#${style.glow.toString(16).padStart(6, "0")};">
      <span class="board-deck"></span>
      <span class="board-ring"></span>
    </span>
  `;
}

function getCharacterPreviewTheme(styleKey) {
  if (styleKey === "neon") {
    return { main: "#48b8ff", accent: "#eaf9ff", emissive: "#1ed0ff" };
  }
  if (styleKey === "stealth") {
    return { main: "#1a1d23", accent: "#838b9a", emissive: "#0b0d12" };
  }
  if (styleKey === "royal") {
    return { main: "#d8b14b", accent: "#fff0b7", emissive: "#ffcc49" };
  }
  return { main: "#2a84ff", accent: "#ffd24d", emissive: "#7bb6ff" };
}

function formatRewardName(type) {
  if (type === "jump-boots") {
    return "Jump Boots";
  }
  if (type === "double-coins") {
    return "Double Coins";
  }
  if (type === "treasure-box") {
    return "Treasure Box";
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function renderActiveRewards() {
  if (!activeRewards) {
    return;
  }

  const rewards = [];
  if (shieldTimer > 0) {
    rewards.push(`Shield ${shieldTimer.toFixed(1)}s`);
  }
  if (magnetTimer > 0) {
    rewards.push(`Magnet ${magnetTimer.toFixed(1)}s`);
  }
  if (jumpBoostTimer > 0) {
    rewards.push(`Jump Boots ${jumpBoostTimer.toFixed(1)}s`);
  }
  if (doubleCoinsTimer > 0) {
    rewards.push(`Double Coins ${doubleCoinsTimer.toFixed(1)}s`);
  }
  if (coinRainTimer > 0) {
    rewards.push(`Coin Rain ${coinRainTimer.toFixed(1)}s`);
  }
  if (treasureModeLevel > 0 && coinRainTimer <= 0) {
    rewards.push(treasureGoldTriggered ? "Golden Rush" : "Treasure Mode");
  }

  if (!rewards.length) {
    activeRewards.classList.add("hidden");
    activeRewards.innerHTML = "";
    return;
  }

  activeRewards.classList.remove("hidden");
  activeRewards.innerHTML = rewards.map((reward) => `<span class="reward-pill">${reward}</span>`).join("");
}

function bumpValue(element) {
  element.classList.remove("bump");
  void element.offsetWidth;
  element.classList.add("bump");
  setTimeout(() => element.classList.remove("bump"), 220);
}

function showOverlay(element) {
  hideOverlays();
  element.classList.remove("hidden");
}

function hideOverlays() {
  startScreen.classList.add("hidden");
  pauseScreen.classList.add("hidden");
  shopScreen?.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
}

function openShopOverlay() {
  if (state === "running") {
    state = "paused";
    shopReturnOverlay = "running";
  } else if (state === "gameover") {
    shopReturnOverlay = "gameover";
  } else if (state === "paused") {
    shopReturnOverlay = "pause";
  } else {
    shopReturnOverlay = "start";
  }
  showOverlay(shopScreen);
}

function closeShopOverlay() {
  if (shopReturnOverlay === "running") {
    state = "running";
    hideOverlays();
    updateAudioMix();
    syncMediaAudio();
    renderQuickRewardBar();
    return;
  }
  if (shopReturnOverlay === "pause") {
    showOverlay(pauseScreen);
    return;
  }
  if (shopReturnOverlay === "gameover") {
    showOverlay(gameOverScreen);
    return;
  }
  renderHomeMenu();
  showOverlay(startScreen);
}

function showBonus(text) {
  bonusTimer = 1.5;
  bonusBanner.textContent = text;
  bonusBanner.classList.remove("hidden");
}

function hideBonus() {
  bonusBanner.classList.add("hidden");
}

function showTreasureBanner(text, golden = false) {
  treasureBanner.textContent = text;
  treasureBanner.classList.remove("hidden");
  if (golden) {
    goldenFlash.classList.remove("hidden");
    goldenFlash.classList.add("active");
  }
}

function hideTreasureBanner() {
  treasureBanner.classList.add("hidden");
  goldenFlash.classList.remove("active");
  goldenFlash.classList.add("hidden");
}

function updatePlayer(delta) {
  player.position.x = THREE.MathUtils.damp(player.position.x, targetLane, 15, delta);

  if (jumpVelocity !== 0 || playerY > 0) {
    jumpVelocity -= gravity * delta;
    playerY = Math.max(0, playerY + jumpVelocity * delta);
    if (playerY === 0) {
      jumpVelocity = 0;
      jumpsLeft = 2;
    }
  } else {
    jumpsLeft = 2;
  }

  player.position.y = playerY;
  playerShadow.scale.setScalar(1 - Math.min(0.35, playerY * 0.12));
  playerShadow.material.opacity = 0.18 - Math.min(0.1, playerY * 0.03);

  if (isSliding) {
    slideTimer -= delta;
    if (slideTimer <= 0) {
      isSliding = false;
      player.scale.y = 1;
    }
  }

  if (shieldTimer > 0) {
    shieldTimer -= delta;
    shieldMesh.visible = true;
    shieldMesh.rotation.z += delta * 2;
    if (shieldTimer <= 0) {
      shieldMesh.visible = false;
    }
  }

  if (magnetTimer > 0) {
    magnetTimer -= delta;
    if (magnetTimer <= 0) {
      showBonus("Magnet Ended");
    }
  }

  if (jumpBoostTimer > 0) {
    jumpBoostTimer -= delta;
    if (jumpBoostTimer <= 0) {
      showBonus("Jump Boost Ended");
    }
  }

  if (doubleCoinsTimer > 0) {
    doubleCoinsTimer -= delta;
    if (doubleCoinsTimer <= 0) {
      showBonus("Double Coins Ended");
    }
  }

  const cycle = distance * 0.23;
  if (runnerMixer) {
    runnerMixer.update(delta * (speed / baseSpeed));
  } else if (runnerRoot && !usingFallbackRunner) {
    runnerRoot.position.y = 0.2 + Math.abs(Math.sin(cycle * 1.4)) * 0.08;
    runnerRoot.rotation.z = Math.sin(cycle) * 0.04;
  }

  if (leftArmPivot && rightArmPivot && leftLegPivot && rightLegPivot) {
    leftArmPivot.rotation.x = Math.sin(cycle) * 0.8;
    rightArmPivot.rotation.x = -Math.sin(cycle) * 0.8;
    leftLegPivot.rotation.x = -Math.sin(cycle) * 0.82;
    rightLegPivot.rotation.x = Math.sin(cycle) * 0.82;
  }
  hoverboard.rotation.z = Math.sin(cycle * 0.5) * 0.08;
  hoverGlow.scale.x = 1 + Math.sin(cycle) * 0.08;
  hoverGlow.scale.z = 1 + Math.cos(cycle) * 0.08;
  player.rotation.z = (targetLane - player.position.x) * 0.08;

  spawnTrail(delta);
}

function spawnTrail(delta) {
  if (trailSegments.length > 8 || state !== "running") {
    return;
  }
  if (Math.random() > 0.34 + delta * 5) {
    return;
  }

  const mesh = new THREE.Mesh(
    new THREE.CircleGeometry(0.18, 12),
    new THREE.MeshBasicMaterial({ color: 0xffcf66, transparent: true, opacity: 0.32 })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(player.position.x, 0.04, player.position.z + 0.8);
  scene.add(mesh);
  trailSegments.push({ mesh, life: 0.4 });
}

function updateTrail(delta) {
  for (let i = trailSegments.length - 1; i >= 0; i -= 1) {
    const item = trailSegments[i];
    item.life -= delta;
    item.mesh.position.z += speed * delta * 0.65;
    item.mesh.scale.multiplyScalar(1 + delta * 2.2);
    item.mesh.material.opacity = Math.max(0, item.life * 0.8);

    if (item.life <= 0) {
      scene.remove(item.mesh);
      trailSegments.splice(i, 1);
    }
  }
}

function updateEnvironment(delta) {
  const timeScale = getTimeScale();
  const move = speed * delta * timeScale;
  distance += move;
  updateThemeCycle();
  updateWeather(delta, move);

  if (roadScrollTexture) {
    roadScrollTexture.offset.y = (roadScrollTexture.offset.y - move * 0.012) % 1;
  }

  roadSegments.forEach((segment) => {
    segment.position.z += move;
    if (segment.position.z > 20) {
      segment.position.z -= roadSegments.length * 20;
    }
  });

  laneStripes.forEach((stripe) => {
    stripe.position.z += move;
    if (stripe.position.z > 8) {
      stripe.position.z -= 156;
    }
  });

  sideDecor.forEach((item) => {
    item.mesh.position.z += move * item.speed;
    if (item.mesh.position.z > 12) {
      item.mesh.position.z -= 184;
      if (item.mesh.userData.kind === "building") {
        randomizeBuildingAppearance(item.mesh);
      }
    }
  });

  clouds.forEach((cloud, index) => {
    cloud.position.x += Math.sin(distance * 0.01 + index) * delta * 0.15;
  });

  lampHalos.forEach(({ halo }, index) => {
    halo.scale.setScalar(1 + Math.sin(distance * 0.01 + index) * 0.08);
  });
}

function updateThemeCycle() {
  if (LOCK_SUNSET_LOOK) {
    const skyTop = new THREE.Color(0xb6d2ea);
    const skyBottom = new THREE.Color(0xf1c688);
    const fogColor = new THREE.Color(0xe3c08d);

    scene.background = skyTop;
    scene.fog.color.copy(fogColor);

    hemisphereLight.intensity = 1.9;
    hemisphereLight.color.set(0xffefd8);
    hemisphereLight.groundColor.set(0xc99663);
    ambientLight.intensity = 0.44;
    ambientLight.color.set(0xffc98a);

    sunLight.intensity = 2.15;
    sunLight.color.set(0xfff0d6);

    sunMesh.position.y = 8.4;
    sunMesh.material.color.set(0xffefc3);
    sunMesh.material.opacity = 0.95;
    sunMesh.material.transparent = true;
    moonMesh.material.opacity = 0;
    stage.style.background = `linear-gradient(180deg, ${toCssColor(skyTop)} 0%, ${toCssColor(new THREE.Color(0xdcc3a1))} 46%, ${toCssColor(skyBottom)} 100%)`;
    roadPlane.material.color.set(0x565b61);
    if ("roughness" in roadPlane.material) {
      roadPlane.material.roughness = 0.92;
    }
    if ("metalness" in roadPlane.material) {
      roadPlane.material.metalness = 0.03;
    }

    clouds.forEach((cloud, index) => {
      cloud.material.transparent = true;
      cloud.material.opacity = 0.58;
      cloud.position.y += Math.sin(distance * 0.002 + index) * 0.002;
    });

    stars.forEach((star) => {
      star.material.opacity = 0;
    });

    return;
  }

  const cycleDistance = DAY_PHASE_DISTANCE + DUSK_PHASE_DISTANCE + NIGHT_PHASE_DISTANCE + DAWN_PHASE_DISTANCE;
  const cyclePos = ((distance % cycleDistance) + cycleDistance) % cycleDistance;
  let t = 1;

  if (cyclePos < DAY_PHASE_DISTANCE) {
    t = 1;
  } else if (cyclePos < DAY_PHASE_DISTANCE + DUSK_PHASE_DISTANCE) {
    const duskT = (cyclePos - DAY_PHASE_DISTANCE) / DUSK_PHASE_DISTANCE;
    t = 1 - (duskT * duskT * (3 - 2 * duskT));
  } else if (cyclePos < DAY_PHASE_DISTANCE + DUSK_PHASE_DISTANCE + NIGHT_PHASE_DISTANCE) {
    t = 0;
  } else {
    const dawnT = (cyclePos - DAY_PHASE_DISTANCE - DUSK_PHASE_DISTANCE - NIGHT_PHASE_DISTANCE) / DAWN_PHASE_DISTANCE;
    t = dawnT * dawnT * (3 - 2 * dawnT);
  }

  const skyTop = new THREE.Color().lerpColors(
    new THREE.Color(0x5d6f8d),
    new THREE.Color(0x9fc3e4),
    t
  );
  const skyBottom = new THREE.Color().lerpColors(
    new THREE.Color(0x8e7a65),
    new THREE.Color(0xe7c088),
    t
  );
  const fogColor = new THREE.Color().lerpColors(
    new THREE.Color(0x7d7f83),
    new THREE.Color(0xd2b489),
    t
  );

  scene.background = skyTop;
  scene.fog.color.copy(fogColor);

  hemisphereLight.intensity = THREE.MathUtils.lerp(1.35, 1.95, t);
  hemisphereLight.color.copy(
    new THREE.Color().lerpColors(new THREE.Color(0x9aa4b5), new THREE.Color(0xc0d8ee), t)
  );
  hemisphereLight.groundColor.copy(
    new THREE.Color().lerpColors(new THREE.Color(0x8a7f71), new THREE.Color(0xd1a471), t)
  );
  ambientLight.intensity = THREE.MathUtils.lerp(0.24, 0.44, t);
  ambientLight.color.copy(
    new THREE.Color().lerpColors(new THREE.Color(0x8b8da0), new THREE.Color(0xffc98a), t)
  );

  sunLight.intensity = THREE.MathUtils.lerp(1.25, 1.72, t);
  sunLight.color.copy(
    new THREE.Color().lerpColors(new THREE.Color(0xd9d0c3), new THREE.Color(0xfff2df), t)
  );

  sunMesh.position.y = THREE.MathUtils.lerp(10, 18, t);
  sunMesh.material.color.copy(
    new THREE.Color().lerpColors(new THREE.Color(0xf2d1a3), new THREE.Color(0xffd89a), t)
  );
  sunMesh.material.opacity = THREE.MathUtils.lerp(0.2, 1, t);
  sunMesh.material.transparent = true;

  moonMesh.position.y = THREE.MathUtils.lerp(18, 11, t);
  moonMesh.material.opacity = THREE.MathUtils.lerp(0.95, 0.04, t);

  stage.style.background = `linear-gradient(180deg, ${toCssColor(skyTop)}, ${toCssColor(skyBottom)})`;
  roadPlane.material.color.copy(
    new THREE.Color().lerpColors(
      new THREE.Color(0x555a61),
      new THREE.Color(0x646a72),
      t
    )
  );
  roadPlane.material.roughness = THREE.MathUtils.lerp(0.48, 0.94, t);
  roadPlane.material.metalness = THREE.MathUtils.lerp(0.22, 0.04, t);

  const nightStrength = 1 - t;
  clouds.forEach((cloud, index) => {
    cloud.material.opacity = undefined;
    cloud.material.transparent = true;
    cloud.material.opacity = THREE.MathUtils.lerp(0.18, 0.95, t);
    cloud.position.y += Math.sin(distance * 0.002 + index) * 0.002;
  });

  stars.forEach((star, index) => {
    const twinkle = 0.65 + Math.sin(distance * 0.02 + index * 1.7) * 0.35;
    star.material.opacity = THREE.MathUtils.lerp(0, 0.95 * twinkle, nightStrength);
    star.position.y += Math.sin(distance * 0.004 + index) * 0.0015;
  });

  sideDecor.forEach((item) => {
    item.mesh.traverse?.((child) => {
      if (!child.isMesh || !child.material) {
        return;
      }
      if ("emissiveIntensity" in child.material && child.material.emissiveIntensity > 0) {
        child.material.emissiveIntensity = THREE.MathUtils.lerp(0.2, 1.35, nightStrength);
      }
    });
  });

  lampHalos.forEach(({ halo, lamp }, index) => {
    const pulse = 0.92 + Math.sin(distance * 0.012 + index * 0.6) * 0.08;
    halo.material.opacity = THREE.MathUtils.lerp(0.02, weatherMode === "rain" ? 0.34 : 0.28, nightStrength) * pulse;
    halo.scale.setScalar(THREE.MathUtils.lerp(0.72, weatherMode === "rain" ? 1.28 : 1.18, nightStrength) * pulse);
    lamp.material.emissiveIntensity = THREE.MathUtils.lerp(0.55, 2.6, nightStrength) * pulse * (1 + nightStrength * 6);
  });

  updateTrafficLights(nightStrength);
}

function updateTrafficLights(nightStrength) {
  if (!trafficLights.length) {
    return;
  }
  const now = performance.now() / 1000;
  trafficLights.forEach((signal) => {
    const t = (now + signal.phaseOffset) % 6;
    const redOn = t < 2.2;
    const yellowOn = (t >= 2.2 && t < 2.8) || t >= 5.6;
    const greenOn = t >= 2.8 && t < 5.6;
    const ambient = THREE.MathUtils.lerp(0.08, 0.2, nightStrength);

    signal.red.emissiveIntensity = redOn ? THREE.MathUtils.lerp(0.7, 1.35, nightStrength) : ambient;
    signal.yellow.emissiveIntensity = yellowOn ? THREE.MathUtils.lerp(0.58, 1.2, nightStrength) : ambient;
    signal.green.emissiveIntensity = greenOn ? THREE.MathUtils.lerp(0.62, 1.28, nightStrength) : ambient;
  });
}

function updateWeather(delta, move) {
  weatherTimer -= delta;
  if (weatherTimer <= 0) {
    weatherMode = weatherMode === "clear" ? "rain" : "clear";
    weatherTimer = weatherMode === "rain" ? 8 : 14;
  }

  if (weatherMode === "rain" && rainDrops.length < 90) {
    for (let i = 0; i < 5; i += 1) {
      spawnRainDrop();
    }
  }

  for (let i = rainDrops.length - 1; i >= 0; i -= 1) {
    const drop = rainDrops[i];
    drop.mesh.position.z += move * 0.9;
    drop.mesh.position.y -= delta * 18;
    drop.mesh.position.x += delta * 0.25;
    drop.mesh.material.opacity = weatherMode === "rain" ? 0.45 : 0;

    if (drop.mesh.position.y < 0 || drop.mesh.position.z > 10 || weatherMode !== "rain") {
      scene.remove(drop.mesh);
      rainDrops.splice(i, 1);
    }
  }
}

function spawnRainDrop() {
  const drop = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.38, 0.03),
    new THREE.MeshBasicMaterial({ color: 0xb8e6ff, transparent: true, opacity: 0.42 })
  );
  drop.position.set(
    THREE.MathUtils.randFloat(-7, 7),
    THREE.MathUtils.randFloat(5, 12),
    THREE.MathUtils.randFloat(-40, -5)
  );
  scene.add(drop);
  rainDrops.push({ mesh: drop });
}

function updateSpawns(delta) {
  const difficulty = getDifficultyConfig();
  const timeScale = getTimeScale();
  spawnTimer -= delta * timeScale;
  obstacleSpawnDelay -= delta * timeScale;
  trafficGapCooldown = Math.max(0, trafficGapCooldown - delta * timeScale);
  coinPatternCooldown = Math.max(0, coinPatternCooldown - delta * timeScale);

  if (spawnTimer <= 0) {
    spawnTimer = THREE.MathUtils.randFloat(difficulty.spawnTimerMin, difficulty.spawnTimerMax);
    if (coins.length < difficulty.coinCap && coinPatternCooldown <= 0) {
      const denseCoinWave = spawnCoinPattern();
      coinPatternCooldown = denseCoinWave
        ? THREE.MathUtils.randFloat(difficulty.denseCooldownMin, difficulty.denseCooldownMax)
        : THREE.MathUtils.randFloat(difficulty.lightCooldownMin, difficulty.lightCooldownMax);
    }
    if (powerUps.length < difficulty.powerUpCap && Math.random() < difficulty.powerUpChance) {
      spawnPowerUp();
    }
  }

  const maxObstacleCount = 42;
  if (obstacleSpawnDelay <= 0 && obstacles.length < maxObstacleCount) {
    spawnObstacleSet(-82 - THREE.MathUtils.randFloat(0, 18));
    const minDelay = treasureModeLevel >= 1
      ? Math.max(0.76, difficulty.obstacleDelayMin - 0.12)
      : difficulty.obstacleDelayMin;
    const maxDelay = treasureModeLevel >= 1
      ? Math.max(minDelay + 0.08, difficulty.obstacleDelayMax - 0.12)
      : difficulty.obstacleDelayMax;
    obstacleSpawnDelay = THREE.MathUtils.randFloat(minDelay, maxDelay);
  }

  if (trafficGapCooldown <= 0) {
    fillEmptyTrafficGaps();
  }
}

function updateTrafficSystem(delta) {
  if (state !== "running") {
    return;
  }

  const move = speed * delta * getTimeScale();
  trafficSpawnTimer -= delta;
  if (trafficSpawnTimer <= 0) {
    trafficSpawnTimer = THREE.MathUtils.randFloat(TRAFFIC_SPAWN_MIN, TRAFFIC_SPAWN_MAX);
    if (trafficCars.length < TRAFFIC_MAX_CARS) {
      spawnTrafficCar();
    }
  }

  for (let i = trafficCars.length - 1; i >= 0; i -= 1) {
    const car = trafficCars[i];
    car.mesh.position.z += move;

    if (car.mesh.position.z > 16) {
      recycleTrafficCar(car, i);
      continue;
    }

    if (checkTrafficHit(car)) {
      triggerScreenShake(0.08, 0.05);
      recycleTrafficCar(car, i);
      continue;
    }
  }
}

function checkTrafficHit(car) {
  const hitX = Math.abs(car.mesh.position.x - player.position.x) < car.width * 0.46;
  const hitZ = Math.abs(car.mesh.position.z - player.position.z) < car.depth * 0.34;
  if (!hitX || !hitZ) {
    return false;
  }

  const playerBottom = player.position.y;
  const obstacleTop = car.height;
  const clearance = isSliding ? 0.15 : 0.22;
  return playerBottom < obstacleTop - clearance;
}

function spawnTrafficCar() {
  const randomLaneIndex = THREE.MathUtils.randInt(0, laneX.length - 1);
  const lane = laneX[randomLaneIndex];
  const spawnZ = -92 - THREE.MathUtils.randFloat(0, 22);
  const trafficType = TRAFFIC_VEHICLE_TYPES.length > 0
    ? TRAFFIC_VEHICLE_TYPES[THREE.MathUtils.randInt(0, TRAFFIC_VEHICLE_TYPES.length - 1)]
    : TRAFFIC_BASE_VEHICLE;
  const template = vehicleModelCache.get(trafficType.familyKey || trafficType.key);
  const mesh = acquireTrafficCarMesh(template, trafficType);

  mesh.position.set(lane, 0, spawnZ);
  mesh.rotation.set(0, 0, 0);
  mesh.visible = true;
  scene.add(mesh);

  trafficCars.push({
    mesh,
    type: "traffic-car",
    width: trafficType.width,
    height: trafficType.height,
    depth: trafficType.depth
  });
}

function acquireTrafficCarMesh(template, type = TRAFFIC_BASE_VEHICLE) {
  const familyKey = type.familyKey || type.key;
  const pooledIndex = trafficCarPool.findIndex((item) => item.userData?.vehicleFamily === familyKey);
  if (pooledIndex !== -1) {
    const [pooledMesh] = trafficCarPool.splice(pooledIndex, 1);
    pooledMesh.scale.setScalar(type.scale || 1);
    return pooledMesh;
  }

  let mesh = null;
  if (template) {
    mesh = template.clone(true);
  } else {
    mesh = createFallbackVehicle(type);
  }

  mesh.scale.setScalar(type.scale || 1);
  mesh.userData.vehicleFamily = familyKey;
  mesh.traverse((child) => {
    if (!child.isMesh) {
      return;
    }
    child.castShadow = true;
    child.receiveShadow = true;
  });
  return mesh;
}

function recycleTrafficCar(car, index) {
  scene.remove(car.mesh);
  car.mesh.visible = false;
  trafficCars.splice(index, 1);
  if (trafficCarPool.length < TRAFFIC_MAX_CARS + 6) {
    trafficCarPool.push(car.mesh);
  }
}

function spawnCoinPattern() {
  const roll = Math.random();
  if (roll < 0.22) {
    return spawnCoinLine();
  }
  if (roll < 0.4) {
    return spawnCoinArc();
  }
  if (roll < 0.58) {
    return spawnCoinZigzag();
  }
  if (roll < 0.76) {
    return spawnCoinLaneWave();
  }
  if (roll < 0.9) {
    return spawnCoinStairs();
  }
  return spawnCoinSweep();
}

function spawnCoinLine() {
  const lane = laneX[THREE.MathUtils.randInt(0, 2)];
  const startZ = -62;
  const count = THREE.MathUtils.randInt(4, 6);
  if (count >= 5) {
    ensureMagnetForCoinRun(lane, startZ);
  }
  spawnLaneCoinRun(lane, startZ, count, 3.4, 1.0, 0.12, false);
  return count >= 5;
}

function spawnCoinArc() {
  const lane = laneX[THREE.MathUtils.randInt(0, 2)];
  const startZ = -62;
  ensureMagnetForCoinRun(lane, startZ);
  spawnJumpCurveCoinRun(lane, startZ, 5, 3.2, 1.0, 2.5, false);
  return true;
}

function spawnCoinZigzag() {
  const startZ = -62;
  const laneOrder = [0, 1, 2, 1, 0];
  ensureMagnetForCoinRun(laneX[1], startZ);
  laneOrder.forEach((laneIndexLocal, i) => {
    const y = 1.02 + (i % 2) * 0.14;
    createCoin(laneX[laneIndexLocal], y, startZ - i * 2.8, false);
  });
  return true;
}

function spawnCoinLaneWave() {
  const startZ = -62;
  const count = 6;
  ensureMagnetForCoinRun(laneX[1], startZ);
  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    const x = THREE.MathUtils.lerp(laneX[0], laneX[2], t);
    const y = 1.05 + Math.sin(t * Math.PI * 2) * 0.18;
    createCoin(x, y, startZ - i * 3.1, false);
  }
  return true;
}

function spawnCoinStairs() {
  const lane = laneX[THREE.MathUtils.randInt(0, 2)];
  const startZ = -62;
  const count = 5;
  ensureMagnetForCoinRun(lane, startZ);
  for (let i = 0; i < count; i += 1) {
    const up = i < 3 ? i : 4 - i;
    createCoin(lane, 1 + up * 0.42, startZ - i * 3.2, false);
  }
  return true;
}

function spawnCoinSweep() {
  const startZ = -60;
  ensureMagnetForCoinRun(laneX[1], startZ);
  for (let i = 0; i < 4; i += 1) {
    const z = startZ - i * 3.3;
    createCoin(laneX[0], 1.02, z, false);
    createCoin(laneX[2], 1.02, z, false);
  }
  return true;
}

function spawnCoinRain() {
  const centerLane = THREE.MathUtils.randInt(0, 2);
  const sideLane = THREE.MathUtils.clamp(centerLane + (Math.random() < 0.5 ? -1 : 1), 0, 2);
  obstacleSpawnDelay = Math.max(obstacleSpawnDelay, 0.85);
  ensureMagnetForCoinRun(laneX[centerLane], -55);
  spawnLaneCoinRun(laneX[centerLane], -54, 6, 2.6, 1.02, 0.12, true);
  spawnJumpCurveCoinRun(laneX[sideLane], -59, 6, 2.6, 1.04, 2.2, true);
  if (Math.random() < 0.55) {
    spawnLaneCoinRun(laneX[1], -63, 4, 2.8, 1.12, 0.1, true);
  }
}

function spawnLaneCoinRun(lane, startZ, count, spacing, baseY, wave, rain) {
  const zValues = Array.from({ length: count }, (_, i) => startZ - i * spacing);
  const resolvedLane = resolvePickupLane(lane, zValues);
  if (resolvedLane == null) {
    return;
  }
  for (let i = 0; i < count; i += 1) {
    createCoin(resolvedLane, baseY + (i % 2) * wave, zValues[i], rain);
  }
}

function spawnJumpCurveCoinRun(lane, startZ, count, spacing, minY, apexY, rain) {
  const zValues = Array.from({ length: count }, (_, i) => startZ - i * spacing);
  const resolvedLane = resolvePickupLane(lane, zValues);
  if (resolvedLane == null) {
    return;
  }
  for (let i = 0; i < count; i += 1) {
    const t = i / Math.max(1, count - 1);
    const y = minY + Math.sin(t * Math.PI) * (apexY - minY);
    createCoin(resolvedLane, y, zValues[i], rain);
  }
}

function hasMagnetAvailable() {
  return magnetTimer > 0 || powerUps.some((item) => item.type === "magnet");
}

function ensureMagnetForCoinRun(lane, coinStartZ) {
  if (hasMagnetAvailable() || powerUps.length >= 1) {
    return;
  }
  if (distance < 120 || Math.random() > 0.22) {
    return;
  }
  spawnPowerUp("magnet", lane, coinStartZ - 14);
}

function getLaneIndexFromX(x) {
  return laneX.findIndex((lane) => Math.abs(lane - x) < 0.18);
}

function isLaneBlockedForPickup(lane, z, depthPadding = 7.2) {
  const laneIndexLocal = getLaneIndexFromX(lane);
  if (laneIndexLocal === -1) {
    return false;
  }

  for (let i = 0; i < obstacles.length; i += 1) {
    const obstacle = obstacles[i];
    if (getLaneIndexFromX(obstacle.mesh.position.x) !== laneIndexLocal) {
      continue;
    }
    const depth = obstacle.depth ?? 1.2;
    if (Math.abs(obstacle.mesh.position.z - z) < depthPadding + depth * 0.7) {
      return true;
    }
  }

  for (let i = 0; i < trafficCars.length; i += 1) {
    const car = trafficCars[i];
    if (getLaneIndexFromX(car.mesh.position.x) !== laneIndexLocal) {
      continue;
    }
    const depth = car.depth ?? 1.45;
    if (Math.abs(car.mesh.position.z - z) < depthPadding + depth * 0.7) {
      return true;
    }
  }

  return false;
}

function resolvePickupLane(preferredLane, zValues) {
  const preferredIndex = getLaneIndexFromX(preferredLane);
  const laneOrder = laneX
    .map((lane, index) => ({ lane, index }))
    .sort((a, b) => {
      const aDist = preferredIndex === -1 ? 0 : Math.abs(a.index - preferredIndex);
      const bDist = preferredIndex === -1 ? 0 : Math.abs(b.index - preferredIndex);
      return aDist - bDist;
    });

  for (let i = 0; i < laneOrder.length; i += 1) {
    const lane = laneOrder[i].lane;
    const blocked = zValues.some((z) => isLaneBlockedForPickup(lane, z));
    if (!blocked) {
      return lane;
    }
  }

  return null;
}

function spawnJumpArcWithLead(lane, baseZ, rain = false) {
  spawnLaneCoinRun(lane, baseZ, 2, 2.8, 1.02, 0.08, rain);
  spawnJumpCurveCoinRun(lane, baseZ - 5.6, 4, 2.85, 1.12, 2.6, rain);
}

function createCoin(x, y, z, rain) {
  const laneIndexLocal = getLaneIndexFromX(x);
  if (laneIndexLocal !== -1 && isLaneBlockedForPickup(laneX[laneIndexLocal], z, 5.4)) {
    return false;
  }

  const coinMaterial = new THREE.MeshStandardMaterial({
    color: rain ? 0xf4c52b : 0xe0ab12,
    emissive: 0xc47a00,
    emissiveIntensity: 1.05,
    metalness: 0.84,
    roughness: 0.26
  });
  coinMaterial.emissive = new THREE.Color(rain ? 0xe4a300 : 0xc98500);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.46, 0.14, 26),
    coinMaterial
  );
  mesh.rotation.z = Math.PI / 2;
  mesh.position.set(x, y, z);
  mesh.castShadow = true;

  const face = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 0.03, 24),
    new THREE.MeshStandardMaterial({
      color: 0xf2c11f,
      emissive: 0xf7c64b,
      emissiveIntensity: 0.16,
      metalness: 0.8,
      roughness: 0.24
    })
  );
  face.rotation.z = Math.PI / 2;
  face.position.z = 0.05;
  mesh.add(face);

  const sparkle = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.12, 0),
    new THREE.MeshBasicMaterial({ color: 0xffffe2, transparent: true, opacity: 0.9 })
  );
  sparkle.position.set(0.34, 0.22, 0);
  mesh.add(sparkle);

  const softShadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.28, 16),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.14 })
  );
  softShadow.rotation.x = -Math.PI / 2;
  softShadow.position.set(0, -y + 0.06, 0);
  mesh.add(softShadow);

  scene.add(mesh);
  coins.push({
    mesh,
    sparkle,
    baseY: y,
    radius: 0.74,
    value: rain ? 20 : 10,
    sparklePhase: Math.random() * Math.PI * 2
  });
  return true;
}

function spawnObstacleSet(baseZ = -80) {
  const laneOrder = getLaneOrderByTrafficAhead();
  const blockedLanes = laneOrder.slice(0, 2);
  const safeLane = laneOrder[2];
  const patternRoll = Math.random();

  if (patternRoll < 0.2) {
    createLaneObstacle(randomVehicleType(), laneX[blockedLanes[0]], baseZ + 2);
    createLaneObstacle(STATIC_OBSTACLE_TYPES.find((item) => item.key === "road-block") ?? randomStaticObstacleType(), laneX[blockedLanes[1]], baseZ - 8);
    spawnJumpArcWithLead(laneX[safeLane], baseZ - 2.8, false);
    return;
  }

  if (patternRoll < 0.4) {
    createLaneObstacle(randomStaticObstacleType(), laneX[blockedLanes[0]], baseZ);
    createLaneObstacle(randomStaticObstacleType(), laneX[blockedLanes[1]], baseZ - 5.6);
    spawnLaneCoinRun(laneX[safeLane], baseZ - 3.2, 3, 3, 1.05, 0.08, false);
    return;
  }

  if (patternRoll < 0.62) {
    const lane = blockedLanes[0];
    createLaneObstacle(randomVehicleType(), laneX[lane], baseZ);
    createLaneObstacle(randomVehicleType(), laneX[lane], baseZ - 12);
    if (Math.random() < 0.6) {
      createLaneObstacle(randomStaticObstacleType(), laneX[blockedLanes[1]], baseZ - 7);
    }
    if (Math.random() < 0.7) {
      spawnJumpArcWithLead(laneX[safeLane], baseZ - 4.2, false);
    }
    return;
  }

  if (patternRoll < 0.82) {
    createLaneObstacle(randomVehicleType(), laneX[blockedLanes[0]], baseZ);
    createLaneObstacle(randomVehicleType(), laneX[blockedLanes[1]], baseZ - 9.8);
    if (Math.random() < 0.5) {
      spawnLaneCoinRun(laneX[safeLane], baseZ - 3.2, 2, 3.1, 1.02, 0.06, false);
    }
    return;
  }

  blockedLanes.forEach((lane, i) => {
    const useStatic = Math.random() < 0.48;
    const type = useStatic ? randomStaticObstacleType() : randomVehicleType();
    createLaneObstacle(type, laneX[lane], baseZ - i * 7.8);
  });
  if (Math.random() < 0.7) {
    spawnLaneCoinRun(laneX[safeLane], baseZ - 2.6, 3, 3.2, 1.05, 0.08, false);
  }
}

function fillEmptyTrafficGaps() {
  const difficulty = getDifficultyConfig();
  let nearestAhead = -Infinity;
  for (let i = 0; i < obstacles.length; i += 1) {
    const z = obstacles[i].mesh.position.z;
    if (z < player.position.z + 1 && z > nearestAhead) {
      nearestAhead = z;
    }
  }

  if (nearestAhead > -36) {
    return;
  }

  const laneOrder = getLaneOrderByTrafficAhead();
  const blockedLanes = laneOrder.slice(0, 2);
  const safeLane = laneOrder[2];
  const baseZ = -36;
  blockedLanes.forEach((lane, index) => {
    const type = Math.random() < 0.38 ? randomStaticObstacleType() : randomVehicleType();
    createLaneObstacle(type, laneX[lane], baseZ - index * 4.8);
  });
  spawnLaneCoinRun(laneX[safeLane], baseZ - 2, 2, 3.2, 1.05, 0.08, false);
  if (Math.random() < 0.65) {
    spawnJumpCurveCoinRun(laneX[safeLane], baseZ - 6, 3, 2.9, 1.12, 2.35, false);
  }
  trafficGapCooldown = THREE.MathUtils.randFloat(difficulty.trafficGapMin, difficulty.trafficGapMax);
}

function getLaneOrderByTrafficAhead() {
  const counts = getLaneTrafficCountsAhead(-92, 6);
  const laneIndices = shuffle([0, 1, 2]);
  laneIndices.sort((a, b) => {
    return counts[a] - counts[b];
  });
  return laneIndices;
}

function getLaneTrafficCountsAhead(minZ, maxZ) {
  const counts = [0, 0, 0];
  for (let i = 0; i < obstacles.length; i += 1) {
    const obstacle = obstacles[i];
    const z = obstacle.mesh.position.z;
    if (z < minZ || z > maxZ) {
      continue;
    }
    const nearestLane = getNearestLaneIndex(obstacle.mesh.position.x);
    counts[nearestLane] += 1;
  }
  return counts;
}

function getNearestLaneIndex(x) {
  let bestIndex = 0;
  let bestDist = Infinity;
  for (let i = 0; i < laneX.length; i += 1) {
    const dist = Math.abs(x - laneX[i]);
    if (dist < bestDist) {
      bestDist = dist;
      bestIndex = i;
    }
  }
  return bestIndex;
}

function createLaneObstacle(type, x, z) {
  const mesh = createObstacleInstance(type);
  if (type.scale) {
    mesh.scale.setScalar(type.scale);
  }
  mesh.position.set(x, 0, z);
  scene.add(mesh);
  let debugBox = null;
  if (debugHitboxes) {
    const debugGeometry = new THREE.BoxGeometry(type.width * 1.36, type.height, type.depth * 1.24);
    const debugMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3b3b,
      wireframe: true,
      transparent: true,
      opacity: 0.42
    });
    debugBox = new THREE.Mesh(debugGeometry, debugMaterial);
    debugBox.position.set(0, type.height / 2, 0);
    mesh.add(debugBox);
  }
  obstacles.push({
    mesh,
    type: type.key,
    width: type.width,
    height: type.height,
    depth: type.depth,
    debugBox
  });
}

function randomVehicleType() {
  const pool = TRAFFIC_VEHICLE_TYPES.length > 0 ? TRAFFIC_VEHICLE_TYPES : VEHICLE_TYPES;
  return pool[Math.floor(Math.random() * pool.length)];
}

function randomStaticObstacleType() {
  return STATIC_OBSTACLE_TYPES[Math.floor(Math.random() * STATIC_OBSTACLE_TYPES.length)];
}

function polishVehicleMaterials(root) {
  root.traverse((child) => {
    if (!child.isMesh || !child.material) {
      return;
    }
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) {
        return;
      }
      material.flatShading = false;
      if ("roughness" in material) {
        material.roughness = 0.4;
      }
      if ("metalness" in material) {
        material.metalness = 0.3;
      }
      material.needsUpdate = true;
    });
  });
}

function preloadVehicleModels() {
  if (FORCE_STYLIZED_TRAFFIC) {
    BASE_VEHICLE_TYPES.forEach((type) => {
      vehicleModelCache.set(type.key, null);
    });
    return;
  }

  BASE_VEHICLE_TYPES.forEach((type) => {
    gltfLoader.load(
      type.path,
      (gltf) => {
        const root = gltf.scene;
        polishVehicleMaterials(root);
        root.traverse((child) => {
          if (!child.isMesh) {
            return;
          }
          child.castShadow = true;
          child.receiveShadow = true;
        });
        vehicleModelCache.set(type.key, root);
      },
      undefined,
      () => {
        vehicleModelCache.set(type.key, null);
      }
    );
  });
}

function createObstacleInstance(type) {
  if (isStaticObstacleType(type.key)) {
    return createStaticObstacleMesh(type.key);
  }
  const modelMesh = createVehicleModelMesh(type);
  if (modelMesh) {
    return modelMesh;
  }
  return createFallbackVehicle(type);
}

function createVehicleModelMesh(type) {
  if (FORCE_STYLIZED_TRAFFIC) {
    return null;
  }

  const familyKey = type.familyKey || type.key.split("-")[0];
  const template = vehicleModelCache.get(familyKey);
  if (!template) {
    return null;
  }

  const mesh = template.clone(true);
  const scale = type.scale || 1;
  mesh.scale.setScalar(scale);
  mesh.rotation.y = Math.PI;

  let yOffset = vehicleModelYOffsetCache.get(familyKey);
  if (typeof yOffset !== "number") {
    const bounds = new THREE.Box3().setFromObject(template);
    yOffset = Number.isFinite(bounds.min.y) ? -bounds.min.y : 0;
    vehicleModelYOffsetCache.set(familyKey, yOffset);
  }
  mesh.position.y = yOffset * scale;

  polishVehicleMaterials(mesh);
  mesh.traverse((child) => {
    if (!child.isMesh) {
      return;
    }
    child.castShadow = true;
    child.receiveShadow = true;
  });
  return mesh;
}

function isStaticObstacleType(typeKey) {
  return STATIC_OBSTACLE_TYPES.some((type) => type.key === typeKey);
}

function createFallbackVehicle(type) {
  const familyKey = type.familyKey || type.key.split("-")[0];
  if (familyKey === "truck") {
    return buildTruckMesh();
  }
  if (familyKey === "bus") {
    return buildBusMesh();
  }
  if (familyKey === "van") {
    return buildVanMesh();
  }
  if (familyKey === "taxi") {
    return buildTaxiMesh();
  }
  if (familyKey === "police") {
    return buildPoliceMesh();
  }
  if (familyKey === "rickshaw") {
    return buildRickshawMesh();
  }
  if (familyKey === "bike") {
    return buildBikeMesh();
  }
  return buildCarMesh();
}

function buildCarMesh() {
  const group = new THREE.Group();
  const paint = randomVehicleColor();
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: paint, roughness: 0.58, metalness: 0.16 });
  const glassMaterial = createVehicleGlassMaterial();
  const trimMaterial = new THREE.MeshStandardMaterial({ color: 0xf4f6fa, roughness: 0.64, metalness: 0.12 });

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.46, 3.0), bodyMaterial);
  base.position.y = 0.38;
  base.castShadow = true;
  group.add(base);

  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.24, 0.88), bodyMaterial);
  hood.position.set(0, 0.62, 0.96);
  hood.castShadow = true;
  group.add(hood);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.56, 1.4), bodyMaterial);
  cabin.position.set(0, 0.94, -0.04);
  cabin.castShadow = true;
  group.add(cabin);

  const rear = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.26, 0.78), bodyMaterial);
  rear.position.set(0, 0.6, -1.1);
  rear.castShadow = true;
  group.add(rear);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.12, 1.16), trimMaterial);
  roof.position.set(0, 1.24, -0.02);
  group.add(roof);

  const sideBand = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 0.12, 2.2),
    new THREE.MeshStandardMaterial({ color: 0xf7f2e7, roughness: 0.82, metalness: 0.04 })
  );
  sideBand.position.set(0, 0.74, -0.02);
  group.add(sideBand);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.38, 0.08), glassMaterial);
  windshield.position.set(0, 1.02, 0.76);
  group.add(windshield);

  const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.32, 0.08), glassMaterial);
  rearGlass.position.set(0, 0.98, -0.92);
  group.add(rearGlass);

  addSideWindows(group, 0.74, 0.95, 0.52, 0.9);
  addBumper(group, 1.02, 0.23, 1.52, 0xa8aeb8);
  addBumper(group, 1.02, 0.23, -1.52, 0x959ba6);
  addPlate(group, 0, 0.28, 1.56);
  addPlate(group, 0, 0.28, -1.56);
  addMirrorPair(group, 0.9, 0.96, 0.5);
  addFrontGrill(group, 1.08, 0.46, 1.5);
  addVehicleWheels(group, 0.75, 0.34, 0.95);
  addHeadlights(group, 0.58, 1.5, 0.2);
  addTailLights(group, 0.56, -1.5, 0.24);
  addVehicleShadow(group, 1.05);
  return group;
}

function buildTruckMesh() {
  const group = new THREE.Group();
  const trailerMaterial = new THREE.MeshStandardMaterial({ color: 0xf3f5f8, roughness: 0.82, metalness: 0.08 });
  const cabinMaterial = new THREE.MeshStandardMaterial({ color: randomVehicleColor(), roughness: 0.58, metalness: 0.14 });

  const trailer = new THREE.Mesh(new THREE.BoxGeometry(2.05, 1.62, 2.64), trailerMaterial);
  trailer.position.set(0, 0.9, -0.7);
  trailer.castShadow = true;
  group.add(trailer);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.74, 1.18, 1.22), cabinMaterial);
  cabin.position.set(0, 0.68, 1.2);
  cabin.castShadow = true;
  group.add(cabin);

  const grill = new THREE.Mesh(
    new THREE.BoxGeometry(1.22, 0.42, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xdbe2e8, roughness: 0.28, metalness: 0.7 })
  );
  grill.position.set(0, 0.64, 1.9);
  group.add(grill);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.55, 0.08), createVehicleGlassMaterial());
  windshield.position.set(0, 1.0, 1.74);
  group.add(windshield);

  const roofCap = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.14, 1.08), cabinMaterial);
  roofCap.position.set(0, 1.38, 1.18);
  roofCap.castShadow = true;
  group.add(roofCap);

  addSideWindows(group, 0.96, 1.0, 0.45, 0.58);
  addFrontGrill(group, 1.16, 0.7, 1.9);
  addMirrorPair(group, 1.02, 1.04, 1.34);
  addPlate(group, 0, 0.34, 1.95);
  addPlate(group, 0, 0.38, -2.09);
  addVehicleWheels(group, 0.92, 0.42, 1.18);
  addVehicleWheels(group, 0.92, 0.42, -0.6);
  addHeadlights(group, 0.75, 1.74, 0.26);
  addTailLights(group, 0.78, -2.05, 0.32);
  addVehicleShadow(group, 1.3);
  return group;
}

function buildBusMesh() {
  const group = new THREE.Group();
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xf5b933, roughness: 0.62, metalness: 0.1 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(2.16, 1.42, 3.78), bodyMaterial);
  body.position.set(0, 0.85, 0);
  body.castShadow = true;
  group.add(body);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.64, 0.08), createVehicleGlassMaterial());
  windshield.position.set(0, 1.1, 1.98);
  group.add(windshield);

  const belt = new THREE.Mesh(
    new THREE.BoxGeometry(2.24, 0.22, 3.86),
    new THREE.MeshStandardMaterial({ color: 0x232937, roughness: 0.38, metalness: 0.24 })
  );
  belt.position.set(0, 1.02, 0);
  group.add(belt);

  addBusWindows(group);
  addBumper(group, 1.12, 0.24, 1.98, 0xb9bfc8);
  addBumper(group, 1.12, 0.24, -1.98, 0xaab0ba);
  addFrontGrill(group, 1.2, 0.48, 1.98);
  addPlate(group, 0, 0.3, 2.02);
  addPlate(group, 0, 0.3, -2.02);
  addMirrorPair(group, 1.2, 1.18, 1.58);
  addVehicleWheels(group, 0.95, 0.44, 1.35);
  addVehicleWheels(group, 0.95, 0.44, -1.25);
  addHeadlights(group, 0.78, 1.86, 0.24);
  addTailLights(group, 0.78, -1.92, 0.28);
  addVehicleShadow(group, 1.35);
  return group;
}

function buildVanMesh() {
  const group = new THREE.Group();
  const paint = randomVehicleColor();
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: paint, roughness: 0.64, metalness: 0.12 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.16, 2.58), bodyMaterial);
  body.position.set(0, 0.7, 0);
  body.castShadow = true;
  group.add(body);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.52, 1.46), bodyMaterial);
  roof.position.set(0, 1.22, 0.18);
  roof.castShadow = true;
  group.add(roof);

  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.26, 0.7), bodyMaterial);
  hood.position.set(0, 0.82, 1.03);
  hood.castShadow = true;
  group.add(hood);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.46, 0.08), createVehicleGlassMaterial());
  windshield.position.set(0, 1.14, 1.28);
  group.add(windshield);

  const slidingDoorLine = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.76, 1.16),
    new THREE.MeshStandardMaterial({ color: 0x1d2129, roughness: 0.8 })
  );
  slidingDoorLine.position.set(-0.99, 0.84, -0.02);
  group.add(slidingDoorLine);

  addSideWindows(group, 0.94, 0.95, 0.45, 0.82);
  addBumper(group, 1.0, 0.24, 1.36, 0xb5bcc6);
  addBumper(group, 1.0, 0.24, -1.36, 0x9ea5af);
  addFrontGrill(group, 1.02, 0.46, 1.34);
  addMirrorPair(group, 1, 1.06, 0.92);
  addPlate(group, 0, 0.3, 1.4);
  addPlate(group, 0, 0.3, -1.4);
  addTailLights(group, 0.64, -1.34, 0.28);
  addVehicleWheels(group, 0.82, 0.38, 1);
  addHeadlights(group, 0.64, 1.34, 0.2);
  addVehicleShadow(group, 1.15);
  return group;
}

function buildTaxiMesh() {
  const group = buildCarMesh();
  const roofSign = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.2, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xffdf57, emissive: 0xffc21d, emissiveIntensity: 0.34 })
  );
  roofSign.position.set(0, 1.45, 0.05);
  group.add(roofSign);

  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(1.88, 0.2, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.62 })
  );
  stripe.position.set(0, 0.8, 1.04);
  group.add(stripe);

  const stripeRear = stripe.clone();
  stripeRear.position.z = -1.04;
  group.add(stripeRear);
  return group;
}

function buildPoliceMesh() {
  const group = buildCarMesh();
  const lightBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.78, 0.18, 0.28),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.25 })
  );
  lightBar.position.set(0, 1.45, 0.02);
  group.add(lightBar);

  const leftLight = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.16, 0.3),
    new THREE.MeshStandardMaterial({ color: 0xff4e59, emissive: 0xff2a41, emissiveIntensity: 0.72 })
  );
  leftLight.position.set(-0.2, 0, 0);
  lightBar.add(leftLight);

  const rightLight = leftLight.clone();
  rightLight.material = new THREE.MeshStandardMaterial({ color: 0x4eb8ff, emissive: 0x2094ff, emissiveIntensity: 0.72 });
  rightLight.position.x = 0.2;
  lightBar.add(rightLight);

  const doorStripe = new THREE.Mesh(
    new THREE.BoxGeometry(1.72, 0.16, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x2f6fe4, roughness: 0.7 })
  );
  doorStripe.position.set(0, 0.82, 0);
  group.add(doorStripe);
  return group;
}

function buildRickshawMesh() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.45, 1.18, 1.86),
    new THREE.MeshStandardMaterial({ color: randomVehicleColor(), roughness: 0.64, metalness: 0.1 })
  );
  body.position.set(0, 0.78, -0.18);
  body.castShadow = true;
  group.add(body);

  const canopy = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.24, 1.52),
    new THREE.MeshStandardMaterial({ color: 0x2b3550, roughness: 0.78, metalness: 0.08 })
  );
  canopy.position.set(0, 1.45, -0.14);
  group.add(canopy);

  const front = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.95, 0.96),
    new THREE.MeshStandardMaterial({ color: 0x202939, roughness: 0.52, metalness: 0.14 })
  );
  front.position.set(0, 0.58, 1.04);
  front.castShadow = true;
  group.add(front);

  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.4, 0.08),
    createVehicleGlassMaterial()
  );
  glass.position.set(0, 0.95, 1.52);
  group.add(glass);

  const rearWheel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.32, 16),
    new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.9 })
  );
  rearWheel.rotation.z = Math.PI / 2;
  rearWheel.position.set(0, 0.38, -0.85);
  group.add(rearWheel);

  addVehicleWheels(group, 0.67, 0.3, 0.7);
  addHeadlights(group, 0.36, 1.5, 0.18);
  addTailLights(group, 0.48, -1.06, 0.2);
  addVehicleShadow(group, 0.95);
  return group;
}

function buildBikeMesh() {
  const group = new THREE.Group();
  const wheelGeometry = new THREE.TorusGeometry(0.42, 0.1, 12, 22);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.9 });
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x18d1ff,
    roughness: 0.42,
    metalness: 0.2,
    emissive: 0x056f94,
    emissiveIntensity: 0.3
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff3d6,
    roughness: 0.36,
    metalness: 0.18
  });

  const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  frontWheel.rotation.y = Math.PI / 2;
  frontWheel.position.set(0, 0.46, 0.74);
  group.add(frontWheel);

  const rearWheel = frontWheel.clone();
  rearWheel.position.z = -0.74;
  group.add(rearWheel);

  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 1.56), frameMaterial);
  frame.position.set(0, 0.84, 0);
  frame.rotation.x = 0.42;
  group.add(frame);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.3), accentMaterial);
  seat.position.set(0, 1.12, -0.12);
  group.add(seat);

  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.1, 0.1), accentMaterial);
  handle.position.set(0, 1.1, 0.8);
  group.add(handle);

  const mudGuard = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.06, 0.06), accentMaterial);
  mudGuard.position.set(0, 0.95, 0.76);
  group.add(mudGuard);
  const mudGuardRear = mudGuard.clone();
  mudGuardRear.position.z = -0.76;
  group.add(mudGuardRear);

  const frontFork = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.82, 0.08), accentMaterial);
  frontFork.position.set(0, 0.78, 0.74);
  frontFork.rotation.x = -0.12;
  group.add(frontFork);

  const rearFork = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.72, 0.08), accentMaterial);
  rearFork.position.set(0, 0.74, -0.74);
  rearFork.rotation.x = 0.18;
  group.add(rearFork);

  const headLamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xfff8c8, emissive: 0xffdc6c, emissiveIntensity: 0.7, roughness: 0.2 })
  );
  headLamp.position.set(0, 1.03, 0.98);
  group.add(headLamp);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.92, 22),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.14 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.03;
  group.add(shadow);

  group.scale.setScalar(1.08);
  return group;
}

function createStaticObstacleMesh(typeKey) {
  if (typeKey === "cone-cluster") {
    return buildConeClusterMesh();
  }
  if (typeKey === "barricade") {
    return buildBarricadeMesh();
  }
  if (typeKey === "dumpster") {
    return buildDumpsterMesh();
  }
  if (typeKey === "road-block") {
    return buildRoadBlockMesh();
  }
  return buildCrateStackMesh();
}

function buildConeClusterMesh() {
  const group = new THREE.Group();
  const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xff8a2b, roughness: 0.7 });
  const stripeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  [-0.36, 0, 0.36].forEach((x) => {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.74, 16), coneMaterial);
    cone.position.set(x, 0.37, 0);
    group.add(cone);

    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.12, 14), stripeMaterial);
    stripe.position.set(x, 0.3, 0.02);
    group.add(stripe);
  });
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.18, 0.1, 1.22),
    new THREE.MeshStandardMaterial({ color: 0x313846, roughness: 0.85 })
  );
  base.position.y = 0.05;
  group.add(base);
  return group;
}

function buildBarricadeMesh() {
  const group = new THREE.Group();
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(1.84, 0.92, 0.22),
    new THREE.MeshStandardMaterial({ color: 0xffc52f, roughness: 0.55, metalness: 0.08 })
  );
  panel.position.y = 0.76;
  group.add(panel);

  [-0.62, 0, 0.62].forEach((x) => {
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 1.08, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.42 })
    );
    stripe.position.set(x, 0.78, 0.12);
    stripe.rotation.z = -0.38;
    group.add(stripe);
  });

  const feet = new THREE.Mesh(
    new THREE.BoxGeometry(1.72, 0.14, 1.02),
    new THREE.MeshStandardMaterial({ color: 0x404656, roughness: 0.82 })
  );
  feet.position.y = 0.09;
  group.add(feet);
  return group;
}

function buildDumpsterMesh() {
  const group = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.45, 1.05, 1.1),
    new THREE.MeshStandardMaterial({ color: 0x2f8b69, roughness: 0.72, metalness: 0.14 })
  );
  base.position.y = 0.56;
  group.add(base);

  const lid = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.16, 1.16),
    new THREE.MeshStandardMaterial({ color: 0x256f56, roughness: 0.78 })
  );
  lid.position.set(0, 1.14, 0);
  lid.rotation.x = -0.18;
  group.add(lid);

  addObstacleWheel(group, -0.48, 0.12, 0.38);
  addObstacleWheel(group, 0.48, 0.12, 0.38);
  addObstacleWheel(group, -0.48, 0.12, -0.38);
  addObstacleWheel(group, 0.48, 0.12, -0.38);
  return group;
}

function buildRoadBlockMesh() {
  const group = new THREE.Group();
  const block = new THREE.Mesh(
    new THREE.BoxGeometry(1.46, 0.68, 1.14),
    new THREE.MeshStandardMaterial({ color: 0xf0f4fb, roughness: 0.48, metalness: 0.14 })
  );
  block.position.y = 0.36;
  group.add(block);

  const strip = new THREE.Mesh(
    new THREE.BoxGeometry(1.42, 0.2, 1.16),
    new THREE.MeshStandardMaterial({ color: 0xff7a3d, roughness: 0.34, emissive: 0xff5a2a, emissiveIntensity: 0.22 })
  );
  strip.position.y = 0.66;
  group.add(strip);
  return group;
}

function buildCrateStackMesh() {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0x9c6d3b, roughness: 0.78 });
  const lower = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.6, 0.98), material);
  lower.position.y = 0.3;
  group.add(lower);

  const upper = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.5, 0.72), material);
  upper.position.set(0.08, 0.86, -0.04);
  upper.rotation.y = 0.2;
  group.add(upper);
  return group;
}

function addObstacleWheel(group, x, y, z) {
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.06, 10),
    new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.9 })
  );
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(x, y, z);
  group.add(wheel);
}

function addVehicleWheels(group, xOffset, radius, zOffset) {
  const wheelGeometry = new THREE.CylinderGeometry(radius, radius, 0.28, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x2c2d33, roughness: 0.94 });
  const hubGeometry = new THREE.CylinderGeometry(radius * 0.48, radius * 0.48, 0.3, 14);
  const hubMaterial = new THREE.MeshStandardMaterial({ color: 0xe9edf3, roughness: 0.44, metalness: 0.32 });

  [
    [-xOffset, zOffset],
    [xOffset, zOffset],
    [-xOffset, -zOffset],
    [xOffset, -zOffset]
  ].forEach(([x, z]) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, radius, z);
    wheel.castShadow = true;
    group.add(wheel);

    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    hub.rotation.z = Math.PI / 2;
    hub.position.set(x, radius, z);
    group.add(hub);
  });
}

function createVehicleGlassMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xc7dbef,
    roughness: 0.14,
    metalness: 0.28,
    transparent: true,
    opacity: 0.88
  });
}

function addHeadlights(group, xOffset, z, y) {
  const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff0b6,
    emissive: 0xffdd73,
    emissiveIntensity: 0.7
  });

  [-xOffset, xOffset].forEach((x) => {
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.06), lightMaterial);
    light.position.set(x, y, z);
    group.add(light);

    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.12, 0.22),
      new THREE.MeshBasicMaterial({ color: 0xffefb8, transparent: true, opacity: 0.16 })
    );
    beam.position.set(x, y, z + 0.12);
    group.add(beam);
  });
}

function addTailLights(group, xOffset, z, y) {
  const lightMaterial = new THREE.MeshStandardMaterial({
    color: 0xff8a8a,
    emissive: 0xff3a3a,
    emissiveIntensity: 0.65
  });

  [-xOffset, xOffset].forEach((x) => {
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.06), lightMaterial);
    light.position.set(x, y, z);
    group.add(light);
  });
}

function addBumper(group, width, height, z, color) {
  const bumper = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, 0.08),
    new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.2 })
  );
  bumper.position.set(0, 0.28, z);
  group.add(bumper);
}

function addSideWindows(group, xOffset, y, zOffset, length) {
  const mat = createVehicleGlassMaterial();
  [-xOffset, xOffset].forEach((x) => {
    const side = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, length), mat);
    side.position.set(x, y, zOffset);
    group.add(side);
  });
}

function addBusWindows(group) {
  const mat = createVehicleGlassMaterial();
  [-1.08, 1.08].forEach((x) => {
    for (let i = 0; i < 4; i += 1) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.62), mat);
      win.position.set(x, 1.08, -1.25 + i * 0.82);
      group.add(win);
    }
  });
}

function addVehicleShadow(group, radius) {
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 18),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);
}

function addPlate(group, x, y, z) {
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.12, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xf7f7f2, roughness: 0.7, metalness: 0.04 })
  );
  plate.position.set(x, y, z);
  group.add(plate);
}

function addMirrorPair(group, xOffset, y, z) {
  const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x20242c, roughness: 0.7, metalness: 0.2 });
  const glassMaterial = new THREE.MeshStandardMaterial({ color: 0xa8b9cf, roughness: 0.18, metalness: 0.52 });

  [-xOffset, xOffset].forEach((x) => {
    const stem = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.04), stemMaterial);
    stem.position.set(x, y, z);
    group.add(stem);

    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.08), glassMaterial);
    mirror.position.set(x + Math.sign(x) * 0.07, y + 0.02, z + 0.03);
    group.add(mirror);
  });
}

function addFrontGrill(group, width, y, z) {
  const grill = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.2, 0.06),
    new THREE.MeshStandardMaterial({ color: 0xc8d0d8, roughness: 0.26, metalness: 0.84 })
  );
  grill.position.set(0, y, z);
  group.add(grill);
}

function randomVehicleColor() {
  const colors = [0xb5392c, 0x345fa8, 0xd4a328, 0x2e7a62, 0xe5e7eb, 0x23262c, 0x8b9099, 0x8e3636];
  return colors[Math.floor(Math.random() * colors.length)];
}

function spawnPowerUp(typeOverride = null, laneOverride = null, z = -92) {
  const preferredLane = laneOverride ?? laneX[THREE.MathUtils.randInt(0, 2)];
  const x = resolvePickupLane(preferredLane, [z]);
  if (x == null) {
    return;
  }
  const type = typeOverride ?? randomRewardType();
  if (type === "magnet" && powerUps.some((item) => item.type === "magnet")) {
    return;
  }
  if (type === "double-coins" && powerUps.some((item) => item.type === "double-coins")) {
    return;
  }
  if (type === "jump-boots" && powerUps.some((item) => item.type === "jump-boots")) {
    return;
  }
  if (type === "treasure-box" && powerUps.some((item) => item.type === "treasure-box")) {
    return;
  }
  const mesh = createRewardMesh(type);
  mesh.position.set(x, 1.7, z);
  scene.add(mesh);
  powerUps.push({ mesh, type, phase: Math.random() * Math.PI * 2 });
}

function randomRewardType() {
  const roll = Math.random();
  if (roll < 0.4) {
    return "shield";
  }
  if (roll < 0.58) {
    return "magnet";
  }
  if (roll < 0.74) {
    return "jump-boots";
  }
  if (roll < 0.9) {
    return "double-coins";
  }
  return "treasure-box";
}

function createRewardMesh(type) {
  if (type === "treasure-box") {
    const group = new THREE.Group();
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(1.02, 0.62, 0.74),
      new THREE.MeshStandardMaterial({ color: 0x538ed8, roughness: 0.38, metalness: 0.34 })
    );
    const lid = new THREE.Mesh(
      new THREE.BoxGeometry(1.08, 0.24, 0.78),
      new THREE.MeshStandardMaterial({ color: 0x73acf2, roughness: 0.34, metalness: 0.34 })
    );
    lid.position.y = 0.32;
    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.08, 0.8),
      new THREE.MeshStandardMaterial({ color: 0xf7c454, roughness: 0.32, metalness: 0.58 })
    );
    trim.position.y = 0.03;
    const strap = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.78, 0.8),
      new THREE.MeshStandardMaterial({ color: 0xffd668, emissive: 0xffb526, emissiveIntensity: 0.82, metalness: 0.34, roughness: 0.24 })
    );
    const glow = new THREE.Mesh(
      new THREE.TorusGeometry(0.62, 0.07, 16, 30),
      new THREE.MeshStandardMaterial({ color: 0xffe27a, emissive: 0xffbf40, emissiveIntensity: 0.7 })
    );
    glow.rotation.x = Math.PI / 2;
    glow.position.y = -0.08;
    const qFront = createSymbolDisc("?", 0x142a4d, 0x9ed1ff, 0.24);
    qFront.position.set(0, 0.34, 0.39);
    const qTop = createSymbolDisc("?", 0x1f3961, 0xb9deff, 0.18);
    qTop.position.set(0, 0.54, 0);
    qTop.rotation.x = -Math.PI / 2;
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.44, 1.9, 18, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffdd86, transparent: true, opacity: 0.34, side: THREE.DoubleSide })
    );
    beam.position.y = 1.0;
    const star = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.18, 0),
      new THREE.MeshBasicMaterial({ color: 0xfff4c9, transparent: true, opacity: 0.9 })
    );
    star.position.y = 1.66;
    group.add(base);
    group.add(lid);
    group.add(trim);
    group.add(strap);
    group.add(qFront);
    group.add(qTop);
    group.add(glow);
    group.add(beam);
    group.add(star);
    addRewardAura(group, 0x8fc5ff, 0.84);
    group.userData = {
      spinners: [
        { mesh: glow, axis: "z", speed: 2.4 },
        { mesh: star, axis: "y", speed: 5.6 }
      ],
      pulseMats: [strap.material, beam.material, qFront.material]
    };
    return group;
  }

  if (type === "jump-boots") {
    const group = new THREE.Group();
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x2a9bff, emissive: 0x2ec6ff, emissiveIntensity: 0.5 });
    const left = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.48, 0.42),
      bootMat
    );
    left.position.x = -0.18;
    const right = left.clone();
    right.position.x = 0.18;
    const leftSole = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.08, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xf2f4fa, roughness: 0.72, emissive: 0x1a5aa0, emissiveIntensity: 0.08 })
    );
    leftSole.position.set(-0.18, -0.21, 0.02);
    const rightSole = leftSole.clone();
    rightSole.position.x = 0.18;
    const stripeL = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.06, 0.34),
      new THREE.MeshStandardMaterial({ color: 0xffca43, roughness: 0.55 })
    );
    stripeL.position.set(-0.18, 0.02, 0.03);
    const stripeR = stripeL.clone();
    stripeR.position.x = 0.18;
    const flameL = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.26, 12),
      new THREE.MeshBasicMaterial({ color: 0x8ce7ff, transparent: true, opacity: 0.72 })
    );
    flameL.position.set(-0.18, -0.38, -0.1);
    flameL.rotation.x = Math.PI;
    const flameR = flameL.clone();
    flameR.position.x = 0.18;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.46, 0.05, 14, 28),
      new THREE.MeshStandardMaterial({ color: 0xffd170, emissive: 0xffa238, emissiveIntensity: 0.82 })
    );
    ring.rotation.x = Math.PI / 2;
    group.add(left);
    group.add(right);
    group.add(leftSole);
    group.add(rightSole);
    group.add(stripeL);
    group.add(stripeR);
    group.add(flameL);
    group.add(flameR);
    group.add(ring);
    addRewardAura(group, 0x59c2ff, 0.72);
    group.userData = {
      spinners: [{ mesh: ring, axis: "y", speed: 4.2 }],
      pulseMats: [bootMat, ring.material, flameL.material]
    };
    return group;
  }

  if (type === "double-coins") {
    const group = new THREE.Group();
    const coinMat = new THREE.MeshStandardMaterial({ color: 0xe0ab12, emissive: 0xc98500, emissiveIntensity: 0.44, metalness: 0.82, roughness: 0.24 });
    const coinA = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.34, 0.1, 28),
      coinMat
    );
    coinA.rotation.z = Math.PI / 2;
    coinA.position.x = -0.24;
    const coinB = coinA.clone();
    coinB.position.x = 0;
    const coinC = coinA.clone();
    coinC.position.x = 0.24;
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.12, 14, 28),
      new THREE.MeshStandardMaterial({ color: 0x8dffb0, emissive: 0x55ff9b, emissiveIntensity: 0.72 })
    );
    halo.scale.setScalar(1.18);
    halo.rotation.x = Math.PI / 2;
    group.add(coinA);
    group.add(coinB);
    group.add(coinC);
    group.add(halo);
    addRewardAura(group, 0xffd257, 0.82);
    group.userData = {
      spinners: [
        { mesh: coinA, axis: "y", speed: 7.5 },
        { mesh: coinB, axis: "y", speed: -7.5 },
        { mesh: coinC, axis: "y", speed: 7.5 },
        { mesh: halo, axis: "z", speed: 3.8 }
      ],
      pulseMats: [coinMat, halo.material]
    };
    return group;
  }

  if (type === "shield") {
    const group = new THREE.Group();
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xd26aff,
      emissive: 0xb95dff,
      emissiveIntensity: 0.74,
      roughness: 0.2,
      metalness: 0.28,
      transparent: true,
      opacity: 0.92
    });
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 18), orbMat);
    const ringA = new THREE.Mesh(
      new THREE.TorusGeometry(0.44, 0.05, 14, 30),
      new THREE.MeshStandardMaterial({ color: 0xe69dff, emissive: 0xc777ff, emissiveIntensity: 0.88 })
    );
    ringA.rotation.x = Math.PI / 2;
    const ringB = ringA.clone();
    ringB.rotation.y = Math.PI / 2;
    group.add(orb);
    group.add(ringA);
    group.add(ringB);
    const icon = createSymbolDisc("↗", 0x3e0f61, 0xe5b0ff, 0.2);
    icon.position.set(0, 0, 0.3);
    group.add(icon);
    addRewardAura(group, 0xd27bff, 0.8);
    group.userData = {
      spinners: [
        { mesh: ringA, axis: "y", speed: 4.5 },
        { mesh: ringB, axis: "x", speed: -3.8 }
      ],
      pulseMats: [orbMat, ringA.material, icon.material]
    };
    return group;
  }

  if (type === "magnet") {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf65959,
      emissive: 0xff4c4c,
      emissiveIntensity: 0.72,
      roughness: 0.28,
      metalness: 0.22
    });
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.08, 14, 26, Math.PI),
      bodyMat
    );
    arc.rotation.z = Math.PI;
    arc.position.y = 0.04;
    const tipLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.18, 0.14),
      new THREE.MeshStandardMaterial({ color: 0xfff1fd, roughness: 0.56, metalness: 0.18 })
    );
    tipLeft.position.set(-0.34, -0.12, 0);
    const tipRight = tipLeft.clone();
    tipRight.position.x = 0.34;
    const spark = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.1, 0),
      new THREE.MeshBasicMaterial({ color: 0xffc6ff, transparent: true, opacity: 0.88 })
    );
    spark.position.set(0, 0.44, 0);
    const waves = new THREE.Mesh(
      new THREE.TorusGeometry(0.56, 0.02, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0xffc66e, transparent: true, opacity: 0.5 })
    );
    waves.rotation.x = Math.PI / 2;
    const magnetMark = createSymbolDisc("M", 0x6d2200, 0xffd575, 0.17);
    magnetMark.position.set(0, 0.1, 0.24);
    group.add(arc);
    group.add(tipLeft);
    group.add(tipRight);
    group.add(spark);
    group.add(waves);
    group.add(magnetMark);
    addRewardAura(group, 0xff8d73, 0.76);
    group.userData = {
      spinners: [
        { mesh: spark, axis: "y", speed: 7.8 },
        { mesh: waves, axis: "z", speed: 1.8 }
      ],
      pulseMats: [bodyMat, spark.material, waves.material]
    };
    return group;
  }

  const fallback = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.48, 0),
    new THREE.MeshStandardMaterial({
      color: 0xff6aff,
      emissive: 0xff6aff,
      emissiveIntensity: 0.8,
      roughness: 0.22,
      metalness: 0.18
    })
  );
  return fallback;
}

function createSymbolDisc(symbol, bgColor, textColor, radius) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.Mesh(
      new THREE.CircleGeometry(radius, 24),
      new THREE.MeshBasicMaterial({ color: bgColor })
    );
  }

  ctx.fillStyle = `#${bgColor.toString(16).padStart(6, "0")}`;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.46, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.fillStyle = `#${textColor.toString(16).padStart(6, "0")}`;
  ctx.font = "bold 72px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(symbol, size / 2, size / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return new THREE.Mesh(
    new THREE.CircleGeometry(radius, 30),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true })
  );
}

function addRewardAura(group, color, radius) {
  const aura = new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.035, 10, 28),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.52 })
  );
  aura.rotation.x = Math.PI / 2;
  const halo = new THREE.Mesh(
    new THREE.CircleGeometry(radius * 0.9, 22),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18 })
  );
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = -0.06;
  group.add(aura);
  group.add(halo);
  if (!group.userData.spinners) {
    group.userData.spinners = [];
  }
  group.userData.spinners.push({ mesh: aura, axis: "z", speed: 3.6 });
  group.userData.auraHalo = halo;
}

function updateCoins(delta) {
  const move = speed * delta * getTimeScale();

  for (let i = coins.length - 1; i >= 0; i -= 1) {
    const coin = coins[i];
    coin.mesh.position.z += move;
    coin.mesh.rotation.y += delta * 7;
    coin.mesh.rotation.x = Math.sin(distance * 0.04 + i) * 0.15;
    coin.mesh.position.y = coin.baseY + Math.sin(distance * 0.12 + i) * 0.16;
    coin.sparkle.rotation.y += delta * 9;
    coin.sparkle.scale.setScalar(0.8 + Math.sin(distance * 0.18 + coin.sparklePhase) * 0.25);

    if (magnetTimer > 0) {
      const attractZ = Math.abs(coin.mesh.position.z - player.position.z) < 7;
      if (attractZ) {
        coin.mesh.position.x = THREE.MathUtils.damp(coin.mesh.position.x, player.position.x, 10, delta);
        coin.mesh.position.y = THREE.MathUtils.damp(coin.mesh.position.y, player.position.y + 1.2, 10, delta);
      }
    }

    if (coin.mesh.position.z > 10) {
      scene.remove(coin.mesh);
      coins.splice(i, 1);
      continue;
    }

    if (checkCoinHit(coin)) {
      handleCoinCollect(coin, i);
    }
  }
}

function handleCoinCollect(coin, index) {
  const worldPos = coin.mesh.getWorldPosition(tempVec);
  scene.remove(coin.mesh);
  coins.splice(index, 1);
  const coinGain = doubleCoinsTimer > 0 ? 2 : 1;
  coinCount += coinGain;
  score += coin.value * coinGain;
  bumpValue(scoreValue);
  bumpValue(coinValue);
  spawnCoinBurst(worldPos, 0xffd44a);
  spawnScorePop(worldPos, `+${coin.value * coinGain}`);
  playCoinSound(coin.value);
  checkRunRewardMilestones();
  checkTreasureMode();
}

function checkRunRewardMilestones() {
  for (let i = 0; i < RUN_REWARD_MILESTONES.length; i += 1) {
    if (rewardMilestoneClaimed[i]) {
      continue;
    }
    const milestone = RUN_REWARD_MILESTONES[i];
    if (coinCount < milestone.coins) {
      continue;
    }
    rewardMilestoneClaimed[i] = true;
    walletCoins += milestone.wallet;
    writeWalletCoins(walletCoins);
    updateHud(true);
    showBonus(`${milestone.label}: +${milestone.wallet} Wallet`);
    triggerScreenShake(0.08, 0.04);
  }
}

function checkCoinHit(coin) {
  const hitX = Math.abs(coin.mesh.position.x - player.position.x) < coin.radius;
  const playerCoinHeight = player.position.y + (isSliding ? 0.95 : 1.15);
  const verticalTolerance = treasureModeLevel >= 2 ? 1.35 : 1.2;
  const hitY = Math.abs(coin.mesh.position.y - playerCoinHeight) < verticalTolerance;
  const hitZ = Math.abs(coin.mesh.position.z - player.position.z) < 1.1;
  return hitX && hitY && hitZ;
}

function updatePowerUps(delta) {
  const move = speed * delta * getTimeScale();

  for (let i = powerUps.length - 1; i >= 0; i -= 1) {
    const item = powerUps[i];
    item.mesh.position.z += move;
    const bob = 1.7 + Math.sin(distance * 0.12 + item.phase) * 0.22;
    item.mesh.position.y = bob;
    item.mesh.rotation.y += delta * 2.8;

    if (item.type === "magnet") {
      item.mesh.rotation.z = Math.sin(distance * 0.08 + item.phase) * 0.16;
    } else if (item.type === "jump-boots") {
      item.mesh.rotation.x = Math.sin(distance * 0.1 + item.phase) * 0.18;
    } else if (item.type === "double-coins") {
      item.mesh.rotation.x += delta * 0.8;
    } else if (item.type === "treasure-box") {
      item.mesh.rotation.x = Math.sin(distance * 0.05 + item.phase) * 0.08;
    } else {
      item.mesh.rotation.x += delta * 1.4;
    }

    const pulse = 0.78 + Math.sin(distance * 0.14 + item.phase) * 0.22;
    if (item.mesh.userData?.pulseMats) {
      item.mesh.userData.pulseMats.forEach((mat) => {
        if ("emissiveIntensity" in mat) {
          mat.emissiveIntensity = Math.max(0.2, pulse);
        }
        if ("opacity" in mat && mat.transparent) {
          mat.opacity = THREE.MathUtils.clamp(0.24 + pulse * 0.18, 0.2, 0.92);
        }
      });
    }
    if (item.mesh.userData?.spinners) {
      item.mesh.userData.spinners.forEach((spin) => {
        if (spin.axis === "x") {
          spin.mesh.rotation.x += delta * spin.speed;
        } else if (spin.axis === "y") {
          spin.mesh.rotation.y += delta * spin.speed;
        } else {
          spin.mesh.rotation.z += delta * spin.speed;
        }
      });
    }
    if (item.mesh.userData?.auraHalo) {
      item.mesh.userData.auraHalo.scale.setScalar(0.92 + pulse * 0.22);
    }

    if (item.mesh.position.z > 10) {
      scene.remove(item.mesh);
      powerUps.splice(i, 1);
      continue;
    }

    const hitX = Math.abs(item.mesh.position.x - player.position.x) < 0.9;
    const hitY = Math.abs(item.mesh.position.y - (player.position.y + 1.2)) < 1.2;
    const hitZ = Math.abs(item.mesh.position.z - player.position.z) < 1.1;

    if (hitX && hitY && hitZ) {
      const worldPos = item.mesh.getWorldPosition(tempVec);
      scene.remove(item.mesh);
      powerUps.splice(i, 1);
      spawnRewardPickupBurst(item.type, worldPos);
      applyPowerUp(item.type);
    }
  }
}

function spawnRewardPickupBurst(type, position) {
  const colorMap = {
    shield: 0x7df9ff,
    magnet: 0xff7be2,
    "jump-boots": 0xffa13d,
    "double-coins": 0x74ffad,
    "treasure-box": 0xffcc63
  };
  spawnCoinBurst(position, colorMap[type] ?? 0xffffff);
  spawnCoinBurst(position.clone().add(new THREE.Vector3(0, 0.45, 0)), colorMap[type] ?? 0xffffff);
}

function applyPowerUp(type) {
  if (type === "shield") {
    shieldTimer = 6;
    shieldMesh.visible = true;
    showBonus("Shield Active");
    playPowerUpSound(480);
    return;
  }

  if (type === "magnet") {
    magnetTimer = 7;
    showBonus("Coin Magnet");
    playPowerUpSound(620);
    return;
  }

  if (type === "jump-boots") {
    jumpBoostTimer = 8;
    showBonus("Jump Boots Active");
    playPowerUpSound(700);
    return;
  }

  if (type === "double-coins") {
    doubleCoinsTimer = 10;
    showBonus("Double Coins");
    playPowerUpSound(820);
    return;
  }

  queueMysteryBox(1, "Mystery Box saved for game over");
}

function updateObstacles(delta) {
  const move = speed * delta * getTimeScale();

  for (let i = obstacles.length - 1; i >= 0; i -= 1) {
    const obstacle = obstacles[i];
    obstacle.mesh.position.z += move;

    if (obstacle.mesh.position.z > 10) {
      scene.remove(obstacle.mesh);
      obstacles.splice(i, 1);
      continue;
    }

    if (checkObstacleHit(obstacle)) {
      if (shieldTimer > 0) {
        const worldPos = obstacle.mesh.getWorldPosition(tempVec);
        shieldTimer = 0;
        shieldMesh.visible = false;
        showBonus("Shield Broken");
        spawnCoinBurst(worldPos, 0x7df9ff);
        triggerScreenShake(0.18, 0.12);
        playCrashSound(0.04);
        scene.remove(obstacle.mesh);
        obstacles.splice(i, 1);
        continue;
      }

      triggerScreenShake(0.28, 0.22);
      endGame();
      return;
    }
  }
}

function checkObstacleHit(obstacle) {
  const obstacleKey = obstacle.type || "";
  const isVehicle = !isStaticObstacleType(obstacleKey);
  const hitX = Math.abs(obstacle.mesh.position.x - player.position.x) < obstacle.width * (isVehicle ? 0.5 : 0.6);
  const hitZ = Math.abs(obstacle.mesh.position.z - player.position.z) < obstacle.depth * (isVehicle ? 0.46 : 0.54);
  if (!hitX || !hitZ) {
    return false;
  }

  const playerBottom = player.position.y;
  const obstacleTop = obstacle.height;
  const clearance = isSliding ? 0.15 : 0.22;
  const hitY = playerBottom < obstacleTop - clearance;

  return hitY;
}

function spawnCoinBurst(position, color) {
  for (let i = 0; i < 8; i += 1) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 8, 8),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 })
    );
    mesh.position.copy(position);
    scene.add(mesh);
    particles.push({
      mesh,
      velocity: new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(2.2),
        THREE.MathUtils.randFloat(0.8, 2.6),
        THREE.MathUtils.randFloatSpread(1.6)
      ),
      life: 0.55
    });
  }
}

function updateParticles(delta) {
  if (particles.length > 42) {
    const overflow = particles.length - 42;
    for (let i = 0; i < overflow; i += 1) {
      const removed = particles.shift();
      if (removed) {
        scene.remove(removed.mesh);
      }
    }
  }

  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];
    particle.life -= delta;
    particle.velocity.y -= delta * 3;
    particle.mesh.position.addScaledVector(particle.velocity, delta);
    particle.mesh.material.opacity = Math.max(0, particle.life * 1.4);

    if (particle.life <= 0) {
      scene.remove(particle.mesh);
      particles.splice(i, 1);
    }
  }
}

function spawnScorePop(worldPosition, text) {
  const projected = worldPosition.clone().project(camera);
  const x = ((projected.x + 1) / 2) * stage.clientWidth;
  const y = ((-projected.y + 1) / 2) * stage.clientHeight;

  const node = document.createElement("div");
  node.className = "score-pop";
  node.textContent = text;
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  scorePopLayer.appendChild(node);
  setTimeout(() => node.remove(), 920);
}

function checkTreasureMode() {
  if (coinCount >= 90 && !treasureSlowTriggered) {
    treasureSlowTriggered = true;
    treasureModeLevel = 1;
    score += 200;
    showTreasureBanner("Treasure Mode");
    showBonus("Slow Motion Bonus");
    triggerScreenShake(0.08, 0.06);
    bumpValue(scoreValue);
  }

  if (coinCount >= 180 && !treasureGoldTriggered) {
    treasureGoldTriggered = true;
    treasureModeLevel = 2;
    coinRainTimer = 2.4;
    treasureCoinSpawnCooldown = 0;
    obstacleSpawnDelay = Math.max(obstacleSpawnDelay, 1);
    score += 600;
    showTreasureBanner("Golden Rush", true);
    showBonus("Coin Rain Activated");
    bumpValue(scoreValue);
    triggerScreenShake(0.12, 0.08);
  }
}

function getTimeScale() {
  if (treasureModeLevel >= 1 && !treasureGoldTriggered) {
    return 0.86;
  }
  return 1;
}

function updateTreasureMode(delta) {
  if (coinRainTimer > 0) {
    coinRainTimer -= delta;
    treasureCoinSpawnCooldown -= delta;
    if (treasureCoinSpawnCooldown <= 0) {
      spawnCoinRain();
      treasureCoinSpawnCooldown = 0.42;
    }
    if (coinRainTimer <= 0) {
      hideTreasureBanner();
    }
  } else if (treasureModeLevel === 1) {
    treasureBanner.classList.remove("hidden");
  }
}

function triggerScreenShake(duration, strength) {
  screenShakeTimer = Math.max(screenShakeTimer, duration);
  screenShakeStrength = Math.max(screenShakeStrength, strength);
}

function updateCamera(delta) {
  const zoomOffset = THREE.MathUtils.clamp((speed - baseSpeed) * 0.06, 0, 1.2);
  const lateralDrift = Math.sin(distance * 0.032) * 0.08;
  const desiredX = player.position.x * 0.36 + lateralDrift;
  const desiredY = cameraBase.y + player.position.y * 0.22 + zoomOffset * 0.14 + Math.sin(distance * 0.048) * 0.04;
  const desiredZ = cameraBase.z - zoomOffset * 0.45 + Math.cos(distance * 0.026) * 0.03;

  camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredX, 4.8, delta);
  camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredY, 4.8, delta);
  camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredZ, 4.8, delta);

  const laneTilt = (targetLane - player.position.x) * -0.038;
  camera.rotation.z = THREE.MathUtils.damp(camera.rotation.z, laneTilt, 5, delta);

  if (screenShakeTimer > 0) {
    screenShakeTimer -= delta;
    camera.position.x += THREE.MathUtils.randFloatSpread(screenShakeStrength);
    camera.position.y += THREE.MathUtils.randFloatSpread(screenShakeStrength * 0.7);
    if (screenShakeTimer <= 0) {
      screenShakeStrength = 0;
    }
  }

  camera.lookAt(player.position.x * 0.18, 1.92 + player.position.y * 0.16, -24 - zoomOffset * 2.2);
  if (state === "running") {
    const blurStrength = THREE.MathUtils.clamp((speed - baseSpeed) * 0.012 + Math.abs(laneTilt) * 2.2, 0, 0.32);
    stage.style.filter = `saturate(1.02) brightness(1.01) blur(${blurStrength.toFixed(2)}px)`;
  }
}

function updateGame(delta) {
  speed = Math.min(28.5, speed + delta * 0.26);
  const scoreRate = doubleCoinsTimer > 0 ? 1.45 : 1;
  score += (delta * 14 + coinCount * 0.03) * scoreRate;

  if (speed > 24) {
    triggerScreenShake(0.03, 0.012);
  }

  updatePlayer(delta);
  updateEnvironment(delta);
  updateSpawns(delta);
  updateCoins(delta);
  updatePowerUps(delta);
  updateObstacles(delta);
  updateParticles(delta);
  updateTrail(delta);
  updateTreasureMode(delta);
  updateCamera(delta);
  updateHud();

  if (bonusTimer > 0) {
    bonusTimer -= delta;
    if (bonusTimer <= 0) {
      hideBonus();
    }
  }
}

function endGame() {
  state = "gameover";
  const achievedNewHighScore = Math.floor(score) > bestScore;
  lastRunCoins = coinCount;
  lastRunScore = Math.floor(score);
  walletCoins += coinCount * 2;
  writeLastRunCoins(lastRunCoins);
  writeLastRunScore(lastRunScore);
  writeWalletCoins(walletCoins);
  bestScore = Math.max(bestScore, Math.floor(score));
  writeBestScore(bestScore);
  if (achievedNewHighScore) {
    pendingMysteryBoxes += 1;
    writePendingMysteryBoxes();
    lastMysteryReward = "";
  }
  updateHud(true);
  finalScore.textContent = `Score: ${Math.floor(score)}`;
  finalCoins.textContent = `Coins: ${coinCount} | Wallet Earned: ${coinCount * 2} | Wallet: ${walletCoins}`;
  finalBest.textContent = achievedNewHighScore
    ? `Best: ${bestScore} | New High Score Mystery Box!`
    : `Best: ${bestScore}`;
  gameOverScreen.classList.toggle("high-score-celebration", achievedNewHighScore);
  gameContainer?.classList.add("gameover-mode");
  stage.style.filter = "saturate(0.92) brightness(0.92)";
  stage.style.transform = "scale(0.995)";
  syncMediaAudio();
  renderMysteryBoxPanel();
  showOverlay(gameOverScreen);
  playCrashSound(0.055);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.033);
  if (state === "running") {
    updateGame(delta);
  } else {
    updateParticles(delta);
    updateTrail(delta);
    updateCamera(delta || 0.016);
  }

  updateAudio(delta || 0.016);

  renderer.render(scene, camera);
  if (state === "gameover") {
    if (gameOverPreviewMixer) {
      gameOverPreviewMixer.update(delta * Math.max(speed / baseSpeed, 1));
    } else if (gameOverPreviewRoot) {
      const previewCycle = performance.now() * 0.006;
      gameOverPreviewRoot.position.y = -1.28 + Math.abs(Math.sin(previewCycle)) * 0.08;
      gameOverPreviewRoot.rotation.z = Math.sin(previewCycle * 0.7) * 0.03;
    }
    if (gameOverPreviewRenderer && gameOverPreviewScene && gameOverPreviewCamera) {
      gameOverPreviewRenderer.render(gameOverPreviewScene, gameOverPreviewCamera);
    }
  }
}

async function ensureAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return false;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass({ latencyHint: "interactive" });
    masterGain = audioContext.createGain();
    musicGain = audioContext.createGain();
    sfxGain = audioContext.createGain();
    engineGain = audioContext.createGain();

    masterGain.gain.value = 1;
    musicGain.gain.value = 0.0001;
    sfxGain.gain.value = 0.9;
    engineGain.gain.value = 0.0001;

    musicGain.connect(masterGain);
    sfxGain.connect(masterGain);
    engineGain.connect(masterGain);
    masterGain.connect(audioContext.destination);

    engineOscillator = audioContext.createOscillator();
    engineOscillator.type = "sawtooth";
    engineOscillator.frequency.value = 122;

    engineFilter = audioContext.createBiquadFilter();
    engineFilter.type = "lowpass";
    engineFilter.frequency.value = 1280;

    engineLfo = audioContext.createOscillator();
    engineLfo.type = "sine";
    engineLfo.frequency.value = 4.2;

    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = 18;

    engineLfo.connect(lfoGain);
    lfoGain.connect(engineOscillator.frequency);
    engineOscillator.connect(engineFilter);
    engineFilter.connect(engineGain);

    engineOscillator.start();
    engineLfo.start();
  }

  if (audioContext.state === "suspended") {
    try {
      await audioContext.resume();
    } catch (error) {
      console.warn("Audio resume was blocked by the browser.", error);
      return false;
    }
  }

  updateAudioMix();
  return audioContext.state === "running";
}

async function primeAudioFromGesture() {
  const ready = await ensureAudio();
  htmlAudioEnabled = true;
  if (!ready || isMuted || audioPrimed) {
    if (!ready) {
      updateAudioStatus("Web Audio blocked. HTML fallback ready. Tap Enable Audio.");
    }
    return ready;
  }

  audioPrimed = true;
  updateAudioStatus("Audio enabled. You should hear sound now.");
  playTone(880, 0.18, "square", 0.12);
  playTone(1174.66, 0.22, "triangle", 0.1);
  return true;
}

async function enableAudioManually() {
  const ready = await ensureAudio();
  htmlAudioEnabled = true;
  if (bgMusic) {
    bgMusic.currentTime = 0;
  }
  if (!ready) {
    isMuted = false;
    syncMuteButton();
    syncMediaAudio();
    updateAudioStatus("Fallback audio enabled. If you hear the beep, press Start Run.");
    playMediaSound("enable", 1);
    return true;
  }

  isMuted = false;
  syncMuteButton();
  updateAudioMix();
  syncMediaAudio();
  audioPrimed = true;
  fallbackMusicStep = 0;
  nextFallbackMusicTime = 0;
  updateAudioStatus("Audio enabled. If you heard the beep, press Start Run.");
  playMediaSound("enable", 1);
  return true;
}

async function runAudioDiagnostic() {
  updateAudioStatus("Running speaker test...");
  htmlAudioEnabled = true;
  isMuted = false;
  syncMuteButton();
  syncMediaAudio();

  const webAudioReady = await ensureAudio();
  playMediaSound("enable", 1);
  setTimeout(() => playMediaSound("coin", 1), 700);
  setTimeout(() => playMediaSound("jump", 1), 1200);

  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance("Audio test");
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn("Speech synthesis diagnostic failed.", error);
    }
  }

  updateAudioStatus(webAudioReady
    ? "Speaker test sent with real WAV files. If still silent, site media playback is blocked."
    : "Speaker test sent with WAV fallback. If still silent, site media playback is blocked.");
}

function updateAudioMix() {
  if (!audioContext || !masterGain || !musicGain || !engineGain) {
    return;
  }
  const now = audioContext.currentTime;
  const audible = !isMuted;
  const musicLevel = audible && musicEnabled ? (state === "running" ? 0.32 : 0.14) : 0.0001;
  const engineLevel = audible && sfxEnabled && state === "running" ? 0.26 : 0.0001;
  const sfxLevel = audible && sfxEnabled ? 0.9 : 0.0001;
  masterGain.gain.cancelScheduledValues(now);
  musicGain.gain.cancelScheduledValues(now);
  sfxGain.gain.cancelScheduledValues(now);
  engineGain.gain.cancelScheduledValues(now);
  masterGain.gain.linearRampToValueAtTime(audible ? 0.95 : 0.0001, now + 0.08);
  musicGain.gain.linearRampToValueAtTime(musicLevel, now + 0.12);
  sfxGain.gain.linearRampToValueAtTime(sfxLevel, now + 0.08);
  engineGain.gain.linearRampToValueAtTime(engineLevel, now + 0.1);
  if (engineFilter) {
    const filterFreq = state === "running" ? 1550 + Math.max(0, speed - baseSpeed) * 42 : 980;
    engineFilter.frequency.cancelScheduledValues(now);
    engineFilter.frequency.linearRampToValueAtTime(filterFreq, now + 0.1);
  }
}

function playTone(frequency, duration, type, volume) {
  if (isMuted || !sfxEnabled) {
    return;
  }

  if (!audioContext || !sfxGain || audioContext.state !== "running") {
    if (htmlAudioEnabled) {
      playHtmlTone(frequency, duration, type, volume);
    }
    return;
  }

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  const loudness = Math.min(0.9, Math.max(volume * 4.5, 0.0001));
  gainNode.gain.setValueAtTime(loudness, now);
  oscillator.connect(gainNode);
  gainNode.connect(sfxGain);
  oscillator.start(now);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.stop(now + duration);
}

function playCoinSound(value) {
  if (playMediaSound("coin", value > 10 ? 0.9 : 0.75)) {
    return;
  }
  playTone(760, 0.05, "triangle", 0.03);
  playTone(value > 10 ? 1120 : 980, 0.08, "sine", 0.018);
}

function playJumpSound() {
  if (playMediaSound("jump", 0.8)) {
    return;
  }
  playTone(520, 0.05, "triangle", 0.02);
  playTone(760, 0.08, "sine", 0.016);
}

function playSlideSound() {
  playTone(190, 0.06, "sawtooth", 0.016);
  playTone(130, 0.08, "triangle", 0.012);
}

function playPowerUpSound(root) {
  playTone(root, 0.08, "square", 0.022);
  playTone(root * 1.25, 0.1, "triangle", 0.022);
  playTone(root * 1.5, 0.14, "sine", 0.018);
  playTone(root * 2, 0.08, "triangle", 0.012);
}

function playStartJingle() {
  if (playMediaSound("enable", 0.95)) {
    return;
  }
  playTone(392, 0.04, "square", 0.02);
  playTone(523.25, 0.05, "square", 0.022);
  playTone(659.25, 0.08, "triangle", 0.024);
  playTone(880, 0.14, "sawtooth", 0.018);
}

function playCrashSound(volume) {
  if (isMuted) {
    return;
  }

  if (playMediaSound("crash", Math.min(1, volume * 8))) {
    return;
  }

  if (!audioContext || !sfxGain || audioContext.state !== "running") {
    if (htmlAudioEnabled) {
      playHtmlTone(122, 0.18, "sawtooth", volume * 0.65);
      playHtmlTone(74, 0.22, "square", volume * 0.3);
    }
    return;
  }

  const now = audioContext.currentTime;
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.24, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;

  const filter = audioContext.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 180;
  filter.Q.value = 1.1;

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(volume, now);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(sfxGain);
  source.start(now);
  source.stop(now + 0.24);
  playTone(122, 0.18, "sawtooth", volume * 0.65);
  playTone(74, 0.22, "square", volume * 0.3);
}

function scheduleMusicNote(note, startTime, duration, volume, type = "triangle") {
  if (!audioContext || !musicGain || isMuted || !musicEnabled) {
    return;
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(note, startTime);
  gainNode.gain.setValueAtTime(Math.max(volume, 0.0001), startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(gainNode);
  gainNode.connect(musicGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

function scheduleBeatPulse(startTime, frequency, duration, volume, type = "square") {
  if (!audioContext || !musicGain || isMuted) {
    return;
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequency * 0.55), startTime + duration);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(520, startTime);
  gainNode.gain.setValueAtTime(Math.max(volume, 0.0001), startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(musicGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

function scheduleNoiseBurst(startTime, duration, volume, frequency) {
  if (!audioContext || !musicGain || isMuted) {
    return;
  }

  const buffer = audioContext.createBuffer(1, Math.floor(audioContext.sampleRate * duration), audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;

  const filter = audioContext.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(frequency, startTime);
  filter.Q.value = 1.6;

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(Math.max(volume, 0.0001), startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(musicGain);
  source.start(startTime);
  source.stop(startTime + duration);
}

function waveformSample(type, phase) {
  if (type === "square") {
    return Math.sin(phase) >= 0 ? 1 : -1;
  }
  if (type === "sawtooth") {
    return 2 * ((phase / (Math.PI * 2)) % 1) - 1;
  }
  if (type === "triangle") {
    return (2 / Math.PI) * Math.asin(Math.sin(phase));
  }
  return Math.sin(phase);
}

function getHtmlToneUrl(frequency, duration, type) {
  const key = `${frequency.toFixed(2)}|${duration.toFixed(3)}|${type}`;
  if (htmlToneCache.has(key)) {
    return htmlToneCache.get(key);
  }

  const sampleRate = 22050;
  const frameCount = Math.max(1, Math.floor(sampleRate * duration));
  const buffer = new ArrayBuffer(44 + frameCount * 2);
  const view = new DataView(buffer);

  const writeString = (offset, value) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + frameCount * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, frameCount * 2, true);

  for (let i = 0; i < frameCount; i += 1) {
    const t = i / sampleRate;
    const envelope = Math.min(1, i / (sampleRate * 0.01)) * Math.max(0, 1 - i / frameCount);
    const phase = Math.PI * 2 * frequency * t;
    const sample = waveformSample(type, phase) * envelope * 0.7;
    view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, sample)) * 32767, true);
  }

  const url = URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
  htmlToneCache.set(key, url);
  return url;
}

function playHtmlTone(frequency, duration, type, volume) {
  if (isMuted || !htmlAudioEnabled) {
    return;
  }

  const audio = new Audio(getHtmlToneUrl(frequency, duration, type));
  audio.volume = Math.max(0, Math.min(1, volume * 8));
  audio.play().catch(() => {});
}

function updateFallbackMusic() {
  if (!htmlAudioEnabled || state !== "running") {
    return;
  }

  const now = performance.now() / 1000;
  const beatLength = 0.26;
  const melody = [659.25, 783.99, 987.77, 783.99, 698.46, 783.99, 1046.5, 987.77];
  const bass = [164.81, 164.81, 196, 196, 220, 220, 196, 196];

  if (nextFallbackMusicTime === 0) {
    nextFallbackMusicTime = now;
  }

  if (now >= nextFallbackMusicTime) {
    const index = fallbackMusicStep % melody.length;
    playHtmlTone(melody[index], 0.12, "square", 0.018);
    playHtmlTone(bass[index], 0.14, "triangle", 0.012);
    if (fallbackMusicStep % 2 === 0) {
      playHtmlTone(96, 0.08, "square", 0.014);
    }
    nextFallbackMusicTime = now + beatLength;
    fallbackMusicStep += 1;
  }
}

function updateAudio(delta) {
  if ((!audioContext || !masterGain || !engineOscillator || !engineGain) && !htmlAudioEnabled) {
    return;
  }

  if (audioContext && masterGain && engineOscillator && engineGain) {
    updateAudioMix();
  }

  if (isMuted) {
    return;
  }

  if (!audioContext || audioContext.state === "suspended") {
    updateFallbackMusic();
    return;
  }

  const now = audioContext.currentTime;
  if (state === "running") {
    const targetFreq = 128 + speed * 6.4 + (isSliding ? -12 : 0) + Math.max(0, playerY) * 8;
    engineOscillator.frequency.linearRampToValueAtTime(targetFreq, now + Math.max(delta, 0.02));
  }

  const beatLength = 0.22;
  const melody = [659.25, 783.99, 987.77, 783.99, 698.46, 783.99, 1046.5, 987.77];
  const bass = [164.81, 164.81, 196, 196, 220, 220, 196, 196];
  const pulse = [1318.51, 1174.66, 1318.51, 1567.98];

  if (nextMusicNoteTime === 0) {
    nextMusicNoteTime = now;
  }

  while (nextMusicNoteTime < now + 0.18) {
    const index = musicStep % melody.length;
    scheduleBeatPulse(nextMusicNoteTime, 96, beatLength * 0.34, 0.018, "square");
    scheduleMusicNote(melody[index], nextMusicNoteTime, beatLength * 0.78, 0.03, "sawtooth");
    scheduleMusicNote(bass[index], nextMusicNoteTime, beatLength * 0.6, 0.024, "triangle");
    scheduleMusicNote(pulse[musicStep % pulse.length], nextMusicNoteTime + 0.045, beatLength * 0.14, 0.012, "square");
    if (musicStep % 2 === 1) {
      scheduleNoiseBurst(nextMusicNoteTime + 0.11, beatLength * 0.16, 0.008, 1800);
    }
    if (musicStep % 2 === 0) {
      scheduleMusicNote(melody[index] * 0.5, nextMusicNoteTime + 0.1, beatLength * 0.22, 0.008, "square");
    }
    nextMusicNoteTime += beatLength;
    musicStep += 1;
  }
}

function loadCosmeticState() {
  const unlockedCharacters = readStorageArray("treasure-run-character-unlocked", ["classic"]);
  const unlockedBoards = readStorageArray("treasure-run-board-unlocked", ["sunset"]);
  const savedCharacter = readStorageString("treasure-run-character-equipped", "classic");
  const savedBoard = readStorageString("treasure-run-board-equipped", "sunset");

  const validCharacterKeys = CHARACTER_STYLES.map((item) => item.key);
  const validBoardKeys = HOVERBOARD_STYLES.map((item) => item.key);

  unlockedCharacterStyles = uniqueValid(["classic", ...unlockedCharacters], validCharacterKeys);
  unlockedHoverboardStyles = uniqueValid(["sunset", ...unlockedBoards], validBoardKeys);
  equippedCharacterStyle = validCharacterKeys.includes(savedCharacter) ? savedCharacter : "classic";
  equippedHoverboardStyle = validBoardKeys.includes(savedBoard) ? savedBoard : "sunset";

  if (!unlockedCharacterStyles.includes(equippedCharacterStyle)) {
    unlockedCharacterStyles.push(equippedCharacterStyle);
  }
  if (!unlockedHoverboardStyles.includes(equippedHoverboardStyle)) {
    unlockedHoverboardStyles.push(equippedHoverboardStyle);
  }

  if (FORCE_STYLIZED_RUNNER) {
    equippedCharacterStyle = "classic";
  }
}

function loadDifficultyState() {
  const savedDifficulty = readStorageString("treasure-run-difficulty", "medium");
  const normalizedDifficulty = savedDifficulty === "addictive" ? "hard" : savedDifficulty;
  selectedDifficulty = DIFFICULTY_MODES[normalizedDifficulty] ? normalizedDifficulty : "medium";
}

function loadPurchasedRewards() {
  const validRewardKeys = Object.keys(REWARD_SHOP_META);
  purchasedRewards = readStorageArray("treasure-run-purchased-rewards", [])
    .filter((reward) => validRewardKeys.includes(reward));
}

function loadPendingMysteryBoxes() {
  pendingMysteryBoxes = Number(readStorageString("treasure-run-pending-mystery-boxes", "0")) || 0;
}

function loadSettingsState() {
  musicEnabled = readStorageString("treasure-run-music-enabled", "true") !== "false";
  sfxEnabled = readStorageString("treasure-run-sfx-enabled", "true") !== "false";
  const defaultGraphics = isTouchDevice ? "medium" : "medium";
  const savedGraphics = readStorageString("treasure-run-graphics-quality", defaultGraphics);
  const normalizedGraphics = ["low", "medium", "high"].includes(savedGraphics) ? savedGraphics : defaultGraphics;
  graphicsQuality = normalizedGraphics;
}

function writeDifficultyState() {
  try {
    window.localStorage.setItem("treasure-run-difficulty", selectedDifficulty);
  } catch (error) {
    console.warn("localStorage unavailable, difficulty could not be saved.", error);
  }
}

function writeSettingsState() {
  try {
    window.localStorage.setItem("treasure-run-music-enabled", String(musicEnabled));
    window.localStorage.setItem("treasure-run-sfx-enabled", String(sfxEnabled));
    window.localStorage.setItem("treasure-run-graphics-quality", graphicsQuality);
  } catch (error) {
    console.warn("localStorage unavailable, settings could not be saved.", error);
  }
}

function writePurchasedRewards() {
  try {
    window.localStorage.setItem("treasure-run-purchased-rewards", JSON.stringify(purchasedRewards));
  } catch (error) {
    console.warn("localStorage unavailable, purchased rewards could not be saved.", error);
  }
}

function writePendingMysteryBoxes() {
  try {
    window.localStorage.setItem("treasure-run-pending-mystery-boxes", String(pendingMysteryBoxes));
  } catch (error) {
    console.warn("localStorage unavailable, mystery boxes could not be saved.", error);
  }
}

function renderDifficultyButtons() {
  const mode = getDifficultyConfig();
  difficultyButtons.forEach((button) => {
    const isActive = button.dataset.difficulty === selectedDifficulty;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
  if (difficultyStatus) {
    difficultyStatus.textContent = `${mode.label}: ${mode.description}`;
  }
}

function writeCosmeticState() {
  try {
    window.localStorage.setItem("treasure-run-character-unlocked", JSON.stringify(unlockedCharacterStyles));
    window.localStorage.setItem("treasure-run-board-unlocked", JSON.stringify(unlockedHoverboardStyles));
    window.localStorage.setItem("treasure-run-character-equipped", equippedCharacterStyle);
    window.localStorage.setItem("treasure-run-board-equipped", equippedHoverboardStyle);
  } catch (error) {
    console.warn("localStorage unavailable, cosmetic state could not be saved.", error);
  }
}

function readStorageArray(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
}

function readStorageString(key, fallback) {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch (error) {
    return fallback;
  }
}

function uniqueValid(values, allowed) {
  const seen = new Set();
  const filtered = [];
  values.forEach((value) => {
    if (!allowed.includes(value) || seen.has(value)) {
      return;
    }
    seen.add(value);
    filtered.push(value);
  });
  return filtered;
}

function readBestScore() {
  try {
    return Number(window.localStorage.getItem("treasure-run-best") || 0);
  } catch (error) {
    console.warn("localStorage unavailable, best score will not persist.", error);
    return 0;
  }
}

function readWalletCoins() {
  try {
    return Number(window.localStorage.getItem("treasure-run-wallet") || 0);
  } catch (error) {
    console.warn("localStorage unavailable, wallet coins will not persist.", error);
    return 0;
  }
}

function readLastRunCoins() {
  try {
    return Number(window.localStorage.getItem("treasure-run-last-coins") || 0);
  } catch (error) {
    console.warn("localStorage unavailable, last run coins will not persist.", error);
    return 0;
  }
}

function readLastRunScore() {
  try {
    return Number(window.localStorage.getItem("treasure-run-last-score") || 0);
  } catch (error) {
    console.warn("localStorage unavailable, last run score will not persist.", error);
    return 0;
  }
}

function writeWalletCoins(value) {
  try {
    window.localStorage.setItem("treasure-run-wallet", String(value));
  } catch (error) {
    console.warn("localStorage unavailable, wallet coins could not be saved.", error);
  }
}

function writeLastRunCoins(value) {
  try {
    window.localStorage.setItem("treasure-run-last-coins", String(value));
  } catch (error) {
    console.warn("localStorage unavailable, last run coins could not be saved.", error);
  }
}

function writeLastRunScore(value) {
  try {
    window.localStorage.setItem("treasure-run-last-score", String(value));
  } catch (error) {
    console.warn("localStorage unavailable, last run score could not be saved.", error);
  }
}

function writeBestScore(value) {
  try {
    window.localStorage.setItem("treasure-run-best", String(value));
  } catch (error) {
    console.warn("localStorage unavailable, best score could not be saved.", error);
  }
}

function toCssColor(color) {
  return `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
}

function shuffle(values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
