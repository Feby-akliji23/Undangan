/* ════════════════════════════════════════════════════
   SUPABASE CONFIG — Ganti nilai di bawah dengan config
   dari Supabase Dashboard → Project Settings → API
   ════════════════════════════════════════════════════
   Cara mendapatkan config:
   1. Buka https://supabase.com dan login (bisa pakai GitHub)
   2. Klik "New Project", isi nama & password
   3. Buka Project Settings → API
   4. Copy "Project URL" dan "anon public" key ke sini
   5. Buat tabel ucapan:
      - Buka Table Editor → New Table
      - Nama tabel: ucapan
      - Tambah kolom: name (text), text (text), ts (int8)
      - Matikan "Enable Row Level Security (RLS)"
   ════════════════════════════════════════════════════ */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL  = 'https://mkpfuqqwxxapgbbfuswy.supabase.co';
const SUPABASE_ANON = 'sb_publishable_L9iRLeanmFIao2WenjnpqQ_JoyEh740';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

(function(){
'use strict';

/* ════════════════════════════════════════════════════
   CONFIG — posisi, ukuran, opacity tiap objek hero
   ────────────────────────────────────────────────────
   x/y     : posisi tengah objek (% layar)
   scale   : ukuran (1.0 = normal)
   rotate  : rotasi derajat
   opacity : transparansi (0–1)
   width   : lebar elemen (string CSS)
   intro/prayer : state awal → state akhir scroll
   ════════════════════════════════════════════════════ */

const CONFIG = {

  /* ── Breakpoint viewport global ── */
  viewport: {
    mobileBreakpoint: 1000,
  },

  /* ── Tombol musik + audio ── */
  music: {
    src: 'assets/audio/Christian_Bautista_-_The_Way_You_Look_At_Me_(mp3.pm).mp3',
    volume: 0.8,
    defaultOn: true,
    overrideSavedOffWhenDefaultOn: true,
    storageKey: 'wss_music_on',
  },

  /* ── Bunga kiri atas — pojok dikunci CSS, scale/opacity dianimasikan ── */
  flowerTL: {
    width:        'clamp(200px, 25vw, 360px)',  // lebar desktop
    widthMobile:  'clamp(290px, 38vw, 400px)',  // lebar mobile (<768px)
    scaleMul:     { mobile: 0.8, desktop: 1.0 }, // tuning responsive scale
    intro:  { scale: 1.0,  rotate:  0,  opacity: 1.0 },
    prayer: { scale: 1.0,  rotate:  0,  opacity: 1.0 },
  },

  /* ── Bunga kanan atas ── */
  flowerTR: {
    width:        'clamp(50px, 25vw, 160px)',  // lebar desktop
    widthMobile:  'clamp(190px, 38vw, 390px)',  // lebar mobile (<768px)
    scaleMul:     { mobile: 0.8, desktop: 1.0 }, // tuning responsive scale
    intro:  { scale:1.0,   rotate:  0,  opacity: 1.0, },
    prayer: { scale: 1.0,  rotate:  0,  opacity: 1.0,},
  },

  /* ── Bunga kiri bawah ── */
  flowerBL: {
    width:        'clamp(50px, 25vw, 160px)',  // lebar desktop
    widthMobile:   'clamp(190px, 38vw, 390px)',  // lebar mobile (<768px)
    scaleMul:     { mobile: 0.8, desktop: 1.0 }, // tuning responsive scale
    intro:  { scale:1.0,   rotate:  0,  opacity: 1.0 },
    prayer: { scale: 1.0,  rotate:  0,  opacity: 1.0 },
  },

  /* ── Bunga kanan bawah ── */
  flowerBR: {
    width:        'clamp(200px, 25vw, 360px)',  // lebar desktop
    widthMobile:  'clamp(290px, 38vw, 400px)',  // lebar mobile (<768px)
    scaleMul:     { mobile: 0.8, desktop: 1.0 }, // tuning responsive scale
    intro:  { scale:1.0,   rotate:  0,  opacity: 1.0 },
    prayer: { scale: 1.0,  rotate:  0,  opacity: 1.0 },
  },

  /* ── Burung — x/y = posisi tengah dalam % layar ── */
  birds: {
    width:          '50%',   // lebar di desktop
    widthMobile:    '100%',   // lebar di mobile (<768px)
    scaleMul:       { mobile: 1.0, desktop: 1.0 }, // tuning responsive scale
    intro:  { x: 50,  y: 40,  scale: 1.0,  rotate:  0,  opacity: 1.0 },
    prayer: { x: 50,  y: 82,  scale: 2.0, rotate:  0,  opacity: 1.0 },
  },

  /* ── Teks intro (nama & tanggal) ── */
  intro: {
    width:          'min(92%, 920px)',
    scaleMul:       { mobile: 0.96, desktop: 1.0 }, // tuning responsive scale
    intro:  { x: 50,  y: 50,  scale: 1.0,  rotate:  0,  opacity: 1.0 },
    prayer: { x: 50,  y: 40,  scale: 0.9,  rotate:  0,  opacity: 0.0 },
    //                                              ↑ fade keluar saat prayer
  },

  /* ── Teks prayer (salam & doa) ── */
  prayer: {
    width:          'min(88%, 780px)',
    scaleMul:       { mobile: 0.96, desktop: 1.0 }, // tuning responsive scale
    intro:  { x: 50,  y: 55,  scale: 0.95, rotate:  0,  opacity: 0.0 },
    //                                              ↑ mulai tidak terlihat
    prayer: { x: 50,  y: 40,  scale: 1.0,  rotate:  0,  opacity: 1.0 },
  },

  /* ── Timeline: [start, end] dalam 0.0–1.0 progress scroll ── */
  timeline: {
    flowersBloom:  [0.00, 0.40],   // bunga muncul dari pojok
    birdsAppear:   [0.00, 0.22],   // burung fade in
    birdsMove:     [0.22, 1.00],   // burung bergerak ke posisi prayer
    introOut:      [0.28, 0.56],   // teks intro fade out
    prayerIn:      [0.38, 0.84],   // teks prayer fade in
    warmBg:        [0.40, 1.00],   // background hangat fade in
  },

};

let HERO_CFG = CONFIG;

const withScaleMul = (state, mul) => ({
  ...state,
  scale: (state.scale ?? 1) * mul,
});

const applyResponsiveHeroScales = () => {
  const isMobile = window.innerWidth < CONFIG.viewport.mobileBreakpoint;
  const pickScaleMul = (cfg) => {
    const group = cfg.scaleMul || {};
    return isMobile ? (group.mobile ?? 1) : (group.desktop ?? 1);
  };
  const makeScaled = (cfg) => ({
    ...cfg,
    intro: withScaleMul(cfg.intro, pickScaleMul(cfg)),
    prayer: withScaleMul(cfg.prayer, pickScaleMul(cfg)),
  });

  HERO_CFG = {
    ...CONFIG,
    flowerTL: makeScaled(CONFIG.flowerTL),
    flowerTR: makeScaled(CONFIG.flowerTR),
    flowerBL: makeScaled(CONFIG.flowerBL),
    flowerBR: makeScaled(CONFIG.flowerBR),
    birds: makeScaled(CONFIG.birds),
    intro: makeScaled(CONFIG.intro),
    prayer: makeScaled(CONFIG.prayer),
  };
};

/* ================================================================
   ENGINE — tidak perlu diubah
================================================================ */

const fcTL        = document.getElementById('fcTL');
const fcTR        = document.getElementById('fcTR');
const fcBL        = document.getElementById('fcBL');
const fcBR        = document.getElementById('fcBR');
const birdsEl     = document.getElementById('birds');
const layerIntro  = document.getElementById('layerIntro');
const layerPrayer = document.getElementById('layerPrayer');
const progressBar = document.getElementById('progressBar');
const scrollHint  = document.getElementById('scrollHint');
const btnContinue = document.getElementById('btnContinue');
const btnTop      = document.getElementById('btnTop');
const btnDown     = document.getElementById('btnDown');
const bgMusic     = document.getElementById('bgMusic');
const btnMusic    = document.getElementById('btnMusic');
const appLoader   = document.getElementById('appLoader');
const appLoaderBar  = document.getElementById('appLoaderBar');
const appLoaderText = document.getElementById('appLoaderText');
const appEnterBtn  = document.getElementById('appEnterBtn');
const mainContent = document.getElementById('main-content');
const btnBack     = document.getElementById('btnBack');

let appReady = false;
let mainContentAssetsReady = false;

/* ── Comment state — diisi oleh Supabase realtime listener ── */
let comments = [];

/* Load ucapan awal */
async function loadUcapan() {
  const { data, error } = await supabase
    .from('ucapan')
    .select('name, text, ts')
    .order('ts', { ascending: false })
    .limit(200);
  if (error) { console.warn('[Supabase] Gagal memuat ucapan:', error.message); return; }
  comments = data || [];
  renderComments();
}
loadUcapan();

/* Realtime listener — ucapan baru langsung muncul di semua perangkat */
supabase
  .channel('ucapan-realtime')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ucapan' }, (payload) => {
    comments.unshift(payload.new);
    renderComments();
  })
  .subscribe();

/* Apply sizes from config */
const applyStaticConfig = () => {
  const isMobile = window.innerWidth < CONFIG.viewport.mobileBreakpoint;
  fcTL.style.width = isMobile ? CONFIG.flowerTL.widthMobile : CONFIG.flowerTL.width;
  fcTR.style.width = isMobile ? CONFIG.flowerTR.widthMobile : CONFIG.flowerTR.width;
  fcBL.style.width = isMobile ? CONFIG.flowerBL.widthMobile : CONFIG.flowerBL.width;
  fcBR.style.width = isMobile ? CONFIG.flowerBR.widthMobile : CONFIG.flowerBR.width;
  birdsEl.style.width     = isMobile ? CONFIG.birds.widthMobile : CONFIG.birds.width;
  layerIntro.style.width  = CONFIG.intro.width;
  layerPrayer.style.width = CONFIG.prayer.width;
  applyResponsiveHeroScales();
};
applyStaticConfig();
window.addEventListener('resize', applyStaticConfig);

const ensureMainContentAssets = () => {
  if (mainContentAssetsReady || !mainContent) return;
  mainContent.classList.add('mc-bg-ready');
  mainContentAssetsReady = true;
};

/* ── Music button ── */
let musicEnabled = CONFIG.music.defaultOn;

const setMusicUi = (isOn) => {
  if (!btnMusic) return;
  btnMusic.classList.toggle('is-on', !!isOn);
  btnMusic.setAttribute('aria-pressed', isOn ? 'true' : 'false');
  btnMusic.setAttribute('aria-label', isOn ? 'Matikan musik' : 'Nyalakan musik');
  btnMusic.title = isOn ? 'Matikan musik' : 'Nyalakan musik';
};

const saveMusicPref = () => {
  try {
    localStorage.setItem(CONFIG.music.storageKey, musicEnabled ? '1' : '0');
  } catch (e) {}
};

const loadMusicPref = () => {
  try {
    const raw = localStorage.getItem(CONFIG.music.storageKey);
    if (raw === '1') {
      musicEnabled = true;
      return;
    }
    if (raw === '0') {
      if (CONFIG.music.defaultOn && CONFIG.music.overrideSavedOffWhenDefaultOn) {
        musicEnabled = true;
        return;
      }
      musicEnabled = false;
    }
  } catch (e) {}
};

const prepareAudioElement = () => {
  if (!bgMusic) return;
  const targetSrc = new URL(CONFIG.music.src, window.location.href).href;
  if (bgMusic.currentSrc !== targetSrc && bgMusic.src !== targetSrc) {
    bgMusic.src = CONFIG.music.src;
  }
  bgMusic.volume = Math.min(1, Math.max(0, Number(CONFIG.music.volume) || 0));
};

const playMusic = async () => {
  if (!bgMusic) return false;
  try {
    await bgMusic.play();
    return true;
  } catch (e) {
    return false;
  }
};

const setMusicState = async (nextState, persist = true) => {
  musicEnabled = !!nextState;
  if (persist) saveMusicPref();

  if (!bgMusic) {
    setMusicUi(false);
    return;
  }

  if (!musicEnabled) {
    bgMusic.pause();
    setMusicUi(false);
    return;
  }

  const ok = await playMusic();
  if (!ok) {
    setMusicUi(false);
    return;
  }
  setMusicUi(true);
};

const initMusic = () => {
  if (!bgMusic || !btnMusic) return;

  loadMusicPref();
  prepareAudioElement();

  bgMusic.addEventListener('play', () => setMusicUi(true));
  bgMusic.addEventListener('pause', () => setMusicUi(false));
  bgMusic.addEventListener('error', () => {
    btnMusic.classList.add('is-error');
    btnMusic.disabled = true;
    btnMusic.setAttribute('aria-disabled', 'true');
    btnMusic.title = 'File musik belum tersedia';
  });

  btnMusic.addEventListener('click', async () => {
    const willPlay = bgMusic.paused;
    await setMusicState(willPlay, true);
  });

  /* Autoplay pada gesture pertama setelah loader hilang.
     Browser biasanya baru izinkan play() setelah gesture nyata.
     Saved-off tetap dihormati, kecuali defaultOn + overrideSavedOffWhenDefaultOn aktif. */
  const kickStart = async () => {
    const stored = (() => { try { return localStorage.getItem(CONFIG.music.storageKey); } catch(e){ return null; } })();
    const savedOff = stored === '0';
    const respectSavedOff = savedOff && !(CONFIG.music.defaultOn && CONFIG.music.overrideSavedOffWhenDefaultOn);
    if (respectSavedOff) { musicEnabled = false; setMusicUi(false); removeKick(); return; }
    if (!bgMusic.paused) { removeKick(); return; }
    const ok = await playMusic();
    if (ok) { musicEnabled = true; setMusicUi(true); removeKick(); }
  };

  const removeKick = () => {
    window.removeEventListener('pointerdown', kickStart);
    window.removeEventListener('touchstart',  kickStart);
    window.removeEventListener('keydown',     kickStart);
  };

  window.addEventListener('pointerdown', kickStart, { passive: true });
  window.addEventListener('touchstart',  kickStart, { passive: true });
  window.addEventListener('keydown',     kickStart);

  setMusicUi(false);

  // Coba autoplay langsung; jika diblok browser, kickStart akan handle di interaksi pertama.
  if (musicEnabled && bgMusic.paused) {
    playMusic().then((ok) => {
      if (ok) { setMusicUi(true); removeKick(); }
    });
  }
};

/* ── Initial loading cover: wait CSS + hero assets + music readiness ── */
const BOOT_TIMEOUT_MS = 12000;
const CSS_LINK_SELECTOR = 'link[rel="stylesheet"][href*="assets/css/styles.css"]';
const URL_RE = /url\((['"]?)(.*?)\1\)/;

const setLoaderStep = (pct, text) => {
  if (appLoaderBar) appLoaderBar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  if (appLoaderText && text) appLoaderText.textContent = text;
};

const withTimeout = (promise, ms = BOOT_TIMEOUT_MS) =>
  Promise.race([promise, new Promise(resolve => setTimeout(resolve, ms))]);

const waitStylesReady = () => {
  const link = document.querySelector(CSS_LINK_SELECTOR);
  if (!link || link.sheet) return Promise.resolve();
  return withTimeout(new Promise(resolve => {
    const done = () => resolve();
    link.addEventListener('load', done, { once: true });
    link.addEventListener('error', done, { once: true });
  }));
};

const waitImageLoaded = (imgEl) => {
  if (!imgEl) return Promise.resolve();
  if (imgEl.complete && imgEl.naturalWidth > 0) return Promise.resolve();
  return withTimeout(new Promise(resolve => {
    const done = () => resolve();
    imgEl.addEventListener('load', done, { once: true });
    imgEl.addEventListener('error', done, { once: true });
  }));
};

const preloadImageSrc = (src) => {
  if (!src) return Promise.resolve();
  return withTimeout(new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  }));
};

const extractCssUrl = (cssBackground) => {
  const m = String(cssBackground || '').match(URL_RE);
  return m ? m[2] : '';
};

const waitAudioReady = (audioEl) => {
  if (!audioEl) return Promise.resolve();
  prepareAudioElement();
  if (!audioEl.paused) return Promise.resolve();
  if (audioEl.readyState >= 3) return Promise.resolve();
  return withTimeout(new Promise(resolve => {
    const done = () => {
      audioEl.removeEventListener('canplaythrough', done);
      audioEl.removeEventListener('canplay', done);
      audioEl.removeEventListener('loadeddata', done);
      audioEl.removeEventListener('error', done);
      resolve();
    };
    audioEl.addEventListener('canplaythrough', done, { once: true });
    audioEl.addEventListener('canplay', done, { once: true });
    audioEl.addEventListener('loadeddata', done, { once: true });
    audioEl.addEventListener('error', done, { once: true });
    try {
      // Hindari reset playback jika browser sudah memulai fetch audio.
      if (audioEl.networkState === 0) audioEl.load();
    } catch (e) { resolve(); }
  }));
};

const waitEssentialAssets = async () => {
  setLoaderStep(16, 'Memuat stylesheet...');
  await waitStylesReady();

  setLoaderStep(56, 'Menyiapkan hero...');
  const heroImgs = Array.from(document.querySelectorAll('#canvas .obj img'));
  const bgPaperEl = document.querySelector('.bg-paper');
  const bgPaperSrc = bgPaperEl ? extractCssUrl(getComputedStyle(bgPaperEl).backgroundImage) : '';
  await Promise.all([
    ...heroImgs.map(waitImageLoaded),
    preloadImageSrc(bgPaperSrc),
  ]);

  setLoaderStep(84, 'Menyiapkan musik...');
  await waitAudioReady(bgMusic);
};

const hideLoader = () => {
  if (!appLoader) return;
  appLoader.setAttribute('aria-hidden', 'true');
  setTimeout(() => {
    if (appLoader && appLoader.parentNode) appLoader.parentNode.removeChild(appLoader);
  }, 620);
};

const waitForLoaderTap = () => {
  if (!appEnterBtn) return Promise.resolve();

  return new Promise((resolve) => {
    appEnterBtn.disabled = false;
    appEnterBtn.setAttribute('aria-disabled', 'false');
    appEnterBtn.classList.add('is-ready');
    setLoaderStep(100, 'Siap — sentuh untuk masuk');

    const onTap = async () => {
      appEnterBtn.disabled = true;
      appEnterBtn.setAttribute('aria-disabled', 'true');

      const rect = appEnterBtn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const maxDx = Math.max(cx, window.innerWidth - cx);
      const maxDy = Math.max(cy, window.innerHeight - cy);
      const targetScale = (Math.hypot(maxDx, maxDy) / (rect.width / 2)) + 1.6;
      appEnterBtn.style.setProperty('--ldr-expand-scale', targetScale.toFixed(2));

      setLoaderStep(100, 'Membuka undangan...');
      if (musicEnabled) {
        prepareAudioElement();
        await setMusicState(true, true);
      }

      appEnterBtn.classList.add('expand');

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      appEnterBtn.addEventListener('animationend', finish, { once: true });
      setTimeout(finish, 900);
    };

    appEnterBtn.addEventListener('click', onTap, { once: true });
  });
};

/* Utils */
const clamp = (v,a,b) => Math.min(b,Math.max(a,v));
const lerp  = (a,b,t) => a+(b-a)*t;
const norm  = (v,a,b) => clamp((v-a)/(b-a),0,1);
const eio   = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const eout  = t => 1-Math.pow(1-t,3);

/* Helper: interpolate a full state object between intro and prayer */
const lerpState = (cfgA, cfgB, t) => ({
  x:       lerp(cfgA.x       ?? 50, cfgB.x       ?? 50, t),
  y:       lerp(cfgA.y       ?? 50, cfgB.y       ?? 50, t),
  scale:   lerp(cfgA.scale   ?? 1,  cfgB.scale   ?? 1,  t),
  rotate:  lerp(cfgA.rotate  ?? 0,  cfgB.rotate  ?? 0,  t),
  opacity: lerp(cfgA.opacity ?? 1,  cfgB.opacity ?? 1,  t),
});

/* Apply state to a corner-anchored flower (no x/y — position fixed by CSS) */
const applyFlower = (el, state) => {
  el.style.opacity   = state.opacity.toFixed(4);
  el.style.transform = `scale(${state.scale.toFixed(4)}) rotate(${state.rotate.toFixed(2)}deg)`;
};

/* Apply state to a freely-positioned object */
const applyFree = (el, state) => {
  el.style.opacity   = state.opacity.toFixed(4);
  el.style.left      = `${state.x}%`;
  el.style.top       = `${state.y}%`;
  el.style.transform = `translate(-50%,-50%) scale(${state.scale.toFixed(4)}) rotate(${state.rotate.toFixed(2)}deg)`;
};





/* ════════════════════════════════════════════════════
   JOURNEY CONFIG — keyframe scroll per chapter
   ────────────────────────────────────────────────────
   bgX/bgY   : fokus background 0–100% (50/50 = tengah)
   bgZoom    : zoom (1.0 = cover pas, 1.3 = zoom 30%)
   fgY       : geser foreground vertikal px (+ = turun)
   fgScale   : skala foreground (1.0 = normal)
   fgOpacity : opacity foreground (0–1)
   duration  : bobot durasi relatif antar movement
   ease      : 'inOut' | 'out' | 'in' | 'linear'
   ════════════════════════════════════════════════════ */
const JOURNEY = {
  totalVirtualPx: 10000,  // total virtual scroll untuk semua journey (lebih besar = lebih lambat & smooth)

  chapters: [
    /* ── Chapter 1: Pertemuan ── */
    {
      movements: [
        // mv1: zoom sinematik ke pojok kiri atas — bg saja, fg & dialog belum
        { bgX:0,  bgY:0,  bgZoom:1.60, fgY:120, fgScale:1.0, fgOpacity:0.0, duration:2, ease:'out',
          dialog: null },

        // mv2: pan ke kiri-tengah — masih hanya bg
        { bgX:25, bgY:35, bgZoom:1.45, fgY:120, fgScale:1.0, fgOpacity:0.0, duration:2, ease:'inOut',
          dialog: { text:'Di tempat yang penuh kesibukan,\nMorowali.', pos:'tl' } },

        // mv3: fg naik + fade in, dialog muncul
        { bgX:40, bgY:55, bgZoom:1.25, fgY:0,   fgScale:1.0, fgOpacity:1.0, duration:2, ease:'inOut',
          dialog: { text:'Tak pernah kami sangka\ntakdir mempertemukan dua hati.', pos:'tl' } },

        // mv4: zoom out, siap ke ch2
        { bgX:50, bgY:50, bgZoom:1.08, fgY:-15, fgScale:1.0, fgOpacity:0.7, duration:1, ease:'in',
          dialog: null },
      ],
    },

    /* ── Chapter 2: Percakapan / HP ── */
    {
      movements: [
        // mv1: masuk, bg reveal dari atas
        { bgX:50, bgY:20, bgZoom:1.20, fgY:80,  fgScale:0.9, fgOpacity:0.0, duration:1, ease:'out',
          dialog: null },
        // mv2: fg naik, dialog kanan atas
        { bgX:50, bgY:50, bgZoom:1.05, fgY:0,   fgScale:1.0, fgOpacity:1.0, duration:2, ease:'inOut',
          dialog: { text:'Kami dikenalkan\noleh seorang teman baik.', pos:'tr' } },
        // mv3: dialog berubah, masih di kanan
        { bgX:50, bgY:50, bgZoom:1.05, fgY:0,   fgScale:1.0, fgOpacity:1.0, duration:2, ease:'inOut',
          dialog: { text:'Setiap percakapan,\nsetiap pertemuan.', pos:'tr' } },
        // mv4: pan tepi, dialog hilang
        { bgX:90, bgY:10, bgZoom:1.25, fgY:-15, fgScale:1.0, fgOpacity:0.7, duration:1, ease:'in',
          dialog: null },
      ],
    },

    /* ── Chapter 3: Bersama Sunset ── */
    {
      movements: [
        // mv1: masuk dari kiri bawah
        { bgX:20, bgY:80, bgZoom:1.15, fgY:50,  fgScale:1.0, fgOpacity:0.0, duration:1, ease:'out',
          dialog: null },
        // mv2: parallax, dialog kiri bawah
        { bgX:60, bgY:60, bgZoom:1.08, fgY:0,   fgScale:1.0, fgOpacity:1.0, duration:2, ease:'inOut',
          dialog: { text:'Masalah dan tantangan datang,\nmenguji dan menguatkan.', pos:'bl' } },
        // mv3: dialog berubah kanan bawah
        { bgX:60, bgY:60, bgZoom:1.08, fgY:0,   fgScale:1.0, fgOpacity:1.0, duration:2, ease:'inOut',
          dialog: { text:'Hingga kami sadar,\ncinta ini layak diperjuangkan.', pos:'br' } },
        // mv4: zoom out, fade
        { bgX:50, bgY:50, bgZoom:1.00, fgY:10,  fgScale:0.98,fgOpacity:0.8, duration:1, ease:'inOut',
          dialog: null },
      ],
    },

    /* ── Chapter 4: Ikrar ── */
    {
      movements: [
        // mv1: masuk, kamera jauh
        { bgX:50, bgY:50, bgZoom:1.00, fgY:60,  fgScale:0.95,fgOpacity:0.0, duration:1, ease:'out',
          dialog: null },
        // mv2: zoom in ke pasangan
        { bgX:50, bgY:70, bgZoom:1.20, fgY:0,   fgScale:1.0, fgOpacity:1.0, duration:2, ease:'inOut',
          dialog: { text:'Maka pada 8 April 2026,\ndengan hati yang mantap.', pos:'tl' } },
        // mv3: ikrar muncul, dialog tengah atas
        { bgX:50, bgY:70, bgZoom:1.20, fgY:0,   fgScale:1.0, fgOpacity:1.0, duration:3, ease:'inOut',
          dialog: { text:'Kami mengikat janji,\nuntuk berjalan bersama\nhari ini, esok, dan selamanya.', pos:'tc', date:'08 · 04 · 2026' } },
        // mv4: zoom out pelan, dialog bertahan
        { bgX:50, bgY:50, bgZoom:1.05, fgY:0,   fgScale:1.02,fgOpacity:1.0, duration:2, ease:'inOut',
          dialog: { text:'Kami mengikat janji,\nuntuk berjalan bersama\nhari ini, esok, dan selamanya.', pos:'tc', date:'08 · 04 · 2026' } },
      ],
    },
  ],
};

/* Pre-compute chapter/movement ranges from duration weights */
(function buildRanges(){
  // Total weight of all movements across all chapters
  const allMovements = JOURNEY.chapters.flatMap(c=>c.movements);
  const totalW = allMovements.reduce((s,m)=>s+m.duration, 0);
  let cursor = 0;
  JOURNEY.chapters.forEach(ch => {
    ch.movements.forEach(m => {
      m._start = cursor / totalW;
      m._end   = (cursor + m.duration) / totalW;
      cursor  += m.duration;
    });
    // chapter range = first movement start → last movement end
    ch._start = ch.movements[0]._start;
    ch._end   = ch.movements[ch.movements.length-1]._end;
  });
})();

/* ── Journey elements ── */
const journeyCanvas = document.getElementById('journeyCanvas');
const jHint         = document.getElementById('jHint');
const jDots         = document.getElementById('jDots');
const jDotEls       = Array.from(jDots.querySelectorAll('.jdot'));
const jChapters = JOURNEY.chapters.map((_,i) => ({
  el:  document.getElementById(`jch${i+1}`),
  bg:  document.getElementById(`jch${i+1}bg`),
  fg:  document.getElementById(`jch${i+1}fg`),
  dlg: document.getElementById(`jch${i+1}dlg`),
}));

/* Lazy load journey images: load current + next chapter only */
const _imgCache = {};
const _bgUrlRe = /url\(['"]?([^'"]+)['"]?\)/;
const _getBgSrc = (bgEl) => {
  const m = (bgEl.style.backgroundImage || '').match(_bgUrlRe);
  return m ? m[1] : '';
};
const _cacheBgNaturalSize = (bgEl, src) => {
  if (!src) return;
  if (_imgCache[src]) {
    bgEl._natW = _imgCache[src].w;
    bgEl._natH = _imgCache[src].h;
    return;
  }
  const img = new Image();
  img.onload = () => {
    _imgCache[src] = { w: img.naturalWidth, h: img.naturalHeight };
    bgEl._natW = img.naturalWidth;
    bgEl._natH = img.naturalHeight;
  };
  img.src = src;
};
const ensureBgLoaded = (idx) => {
  const jc = jChapters[idx];
  if (!jc || !jc.bg) return;
  const bg = jc.bg;
  const dataSrc = bg.getAttribute('data-bg');
  if (dataSrc && !bg.style.backgroundImage) {
    bg.style.backgroundImage = `url('${dataSrc}')`;
  }
  const src = _getBgSrc(bg);
  if (!src) return;
  if (bg.dataset.loaded === '1') return;
  bg.dataset.loaded = '1';
  _cacheBgNaturalSize(bg, src);
};
const ensureFgLoaded = (idx) => {
  const jc = jChapters[idx];
  if (!jc || !jc.fg) return;
  const fg = jc.fg;
  if (fg.dataset.loaded === '1') return;
  const dataSrc = fg.getAttribute('data-src') || '';
  const currentSrc = fg.getAttribute('src') || '';
  const src = dataSrc || currentSrc;
  if (!src) return;
  if (dataSrc && currentSrc !== dataSrc) fg.setAttribute('src', dataSrc);
  else if (!currentSrc) fg.setAttribute('src', src);
  fg.dataset.loaded = '1';
};
const primeJourneyImages = (activeIdx) => {
  ensureBgLoaded(activeIdx);
  ensureBgLoaded(activeIdx + 1);
  ensureFgLoaded(activeIdx);
  ensureFgLoaded(activeIdx + 1);
};

/* Preload natural image sizes so applyBg can compute true cover scale */
const _preloadBgSizes = () => {
  jChapters.forEach(jc => {
    const bg = jc.bg;
    const src = _getBgSrc(bg);
    if (!src) return;
    _cacheBgNaturalSize(bg, src);
  });
};
setTimeout(_preloadBgSizes, 0);
ensureBgLoaded(0);
ensureFgLoaded(0);

/* ── Render hero scene (p: 0→1) ── */
const renderHero = (p) => {
  const C = HERO_CFG || CONFIG;
  const T = C.timeline;
  progressBar.style.width = (p*100).toFixed(2)+'%';
  scrollHint.style.opacity = clamp(1-p*8,0,.9).toFixed(3);

  const tFlower = eout(norm(p,...T.flowersBloom));
  const tBirdIn = eout(norm(p,...T.birdsAppear));
  const tPhase  = eio (norm(p,...T.birdsMove));
  const tIntro  = eio (norm(p,...T.introOut));
  const tPrayer = eio (norm(p,...T.prayerIn));

  const blendFlower = (cfg) => {
    const bloomed = lerpState({scale:0.2,rotate:0,opacity:0}, cfg.intro, tFlower);
    return lerpState(bloomed, cfg.prayer, tPhase);
  };
  applyFlower(fcTL, blendFlower(C.flowerTL));
  applyFlower(fcTR, blendFlower(C.flowerTR));
  applyFlower(fcBL, blendFlower(C.flowerBL));
  applyFlower(fcBR, blendFlower(C.flowerBR));

  const birdAppeared = lerpState({...C.birds.intro,opacity:0,scale:(C.birds.intro.scale ?? 1) * .86}, C.birds.intro, tBirdIn);
  applyFree(birdsEl, lerpState(birdAppeared, C.birds.prayer, tPhase));
  applyFree(layerIntro,  lerpState(C.intro.intro,  C.intro.prayer,  tIntro));
  applyFree(layerPrayer, lerpState(C.prayer.intro, C.prayer.prayer, tPrayer));
};

/* ── Render journey scene (jp: 0→1) ── */

/* Easing functions */
const easeFn = {
  inOut:  t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2,
  out:    t => 1-Math.pow(1-t,3),
  in:     t => t*t*t,
  linear: t => t,
};


/* applyBg: zoom+pan bg, guaranteed cover via pixel-based backgroundSize */
const applyBg = (el, bgX, bgY, bgZoom) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const iw = el._natW || 1600;   // fallback jika belum load
  const ih = el._natH || 900;

  // Cover scale: skala minimum agar gambar mengisi layar penuh di kedua axis
  const coverScale = Math.max(vw / iw, vh / ih);

  // Final size dalam px = cover * zoom
  const finalW = (iw * coverScale * bgZoom).toFixed(1);
  const finalH = (ih * coverScale * bgZoom).toFixed(1);

  el.style.backgroundSize     = `${finalW}px ${finalH}px`;
  el.style.backgroundPosition = `${bgX.toFixed(2)}% ${bgY.toFixed(2)}%`;
};

const renderJourney = (jp) => {
  const C = JOURNEY.chapters;
  const N = C.length;

  progressBar.style.width = (jp*100).toFixed(2)+'%';
  jHint.classList.toggle('show', jp < 0.04);
  btnContinue.classList.toggle('show', jp >= .97);
  jDots.classList.toggle('show', jp < 0.97);

  // Active chapter for dots
  let activeChIdx = 0;
  C.forEach((ch,i) => { if (jp >= ch._start) activeChIdx = i; });
  primeJourneyImages(activeChIdx);
  jDotEls.forEach((d,i) => d.classList.toggle('active', i===activeChIdx));

  C.forEach((ch, ci) => {
    const jc = jChapters[ci];

    // Chapter visibility window — add padding for crossfade
    const FADE = 0.015; // 1.5% of total journey for xfade
    const chOp = ch._start===0
      ? (jp < ch._end-FADE ? 1 : 1-norm(jp, ch._end-FADE, ch._end+FADE))
      : jp < ch._start+FADE
        ? norm(jp, ch._start-FADE, ch._start+FADE)
        : jp < ch._end-FADE ? 1
        : 1-norm(jp, ch._end-FADE, ch._end+FADE);

    jc.el.style.opacity = clamp(chOp, 0, 1).toFixed(4);
    if (chOp < 0.005) return; // skip rendering invisible chapters

    // Find current movement and interpolate.
    // Each movement is a KEYFRAME. Transition between keyframe[i] → keyframe[i+1]
    // happens over the scroll range: mvs[i]._end → mvs[i+1]._end
    // This means scroll progress directly drives every value — no jumps.
    const mvs = ch.movements;
    let fromMv = mvs[0], toMv = mvs[1] || mvs[0], t = 0;

    // Before first keyframe's end — hold first state
    if (jp <= mvs[0]._end) {
      fromMv = mvs[0]; toMv = mvs[0]; t = 0;
    }
    // After last keyframe — hold last state
    else if (jp >= mvs[mvs.length-1]._end) {
      fromMv = mvs[mvs.length-1]; toMv = mvs[mvs.length-1]; t = 1;
    }
    // Between two keyframes — interpolate
    else {
      for (let mi = 0; mi < mvs.length-1; mi++) {
        const a = mvs[mi], b = mvs[mi+1];
        if (jp >= a._end && jp <= b._end) {
          fromMv = a; toMv = b;
          // t = how far we are between a._end and b._end (0→1)
          t = norm(jp, a._end, b._end);
          // apply easing defined on the destination keyframe
          t = (easeFn[b.ease] || easeFn.inOut)(t);
          break;
        }
      }
    }

    const bgX      = lerp(fromMv.bgX,      toMv.bgX,      t);
    const bgY      = lerp(fromMv.bgY,      toMv.bgY,      t);
    const bgZoom   = lerp(fromMv.bgZoom,   toMv.bgZoom,   t);
    const fgY      = lerp(fromMv.fgY,      toMv.fgY,      t);
    const fgScale  = lerp(fromMv.fgScale,  toMv.fgScale,  t);
    const fgOp     = lerp(fromMv.fgOpacity,toMv.fgOpacity,t);
    applyBg(jc.bg, bgX, bgY, bgZoom);
    jc.fg.style.transform = `translateX(-50%) translateY(${fgY.toFixed(1)}px) scale(${fgScale.toFixed(4)})`;
    jc.fg.style.opacity   = fgOp.toFixed(4);

    /* ── Dialog box — no fade, swap content instantly at t=0.5 ── */
    const dlg = jc.dlg;
    // Show destination dialog once we're past halfway, else show source
    const activeDialog = t >= 0.5 ? toMv.dialog : fromMv.dialog;

    if (activeDialog) {
      dlg.querySelector('.jdialog-text').innerHTML   =
        (activeDialog.text || '').replace(/\n/g,'<br>');
      dlg.querySelector('.jdialog-date').textContent = activeDialog.date || '';
      dlg.querySelector('.jdialog-date').style.display = activeDialog.date ? '' : 'none';
      applyDialogPos(dlg, activeDialog.pos || 'tl');
      dlg.style.opacity = '1';
      dlg.style.display = '';
    } else {
      dlg.style.display = 'none';
    }
  });
};

/* Position dialog box on screen */
const DIALOG_GAP = 'clamp(16px, 4vw, 32px)';
const applyDialogPos = (el, pos) => {
  el.style.top = el.style.bottom = el.style.left = el.style.right = 'auto';
  el.style.transform = 'none';
  const dg = DIALOG_GAP;
  switch(pos) {
    case 'tl': el.style.top=dg; el.style.left=dg;   break;
    case 'tr': el.style.top=dg; el.style.right=dg;  break;
    case 'bl': el.style.bottom=dg; el.style.left=dg;  break;
    case 'br': el.style.bottom=dg; el.style.right=dg; break;
    case 'tc': el.style.top=dg; el.style.left='50%'; el.style.transform='translateX(-50%)'; break;
    case 'bc': el.style.bottom=dg; el.style.left='50%'; el.style.transform='translateX(-50%)'; break;
    default:   el.style.top=dg; el.style.left=dg;
  }
};

/* ════════════════════════════════════════════════════
   SCROLL ENGINE — dua virtual range
   hero:    0→HERO_TOTAL     → intro + prayer scene
   journey: 0→JOURNEY_TOTAL  → journey scene
   ────────────────────────────────────────────────────
   TUNING:
   smooth()          : 0.09 desktop / 0.14 mobile
   HERO_TOTAL        : 2000 (naik = lebih lambat)
   totalVirtualPx    : 20000 (di JOURNEY CONFIG)
   wheel ×0.55/×2.5  : sensitifitas mouse/trackpad
   touch ×1.1        : sensitifitas touch (hero only)
   ════════════════════════════════════════════════════ */
const smooth = () => window.innerWidth < CONFIG.viewport.mobileBreakpoint ? .14 : .09;
const HERO_TOTAL    = 2000;
const JOURNEY_TOTAL = JOURNEY.totalVirtualPx;

/* ── Restore scroll state from sessionStorage on refresh ── */
const _SS_KEY = 'wss_sh26';
const _savedState = (() => {
  try { return JSON.parse(sessionStorage.getItem(_SS_KEY)) || {}; } catch(e) { return {}; }
})();
if (!_savedState.inviteOpen) {
  document.documentElement.classList.remove('invite-open-boot');
}
if (!(Number(_savedState.jAccum || 0) > 0 || Number(_savedState.zone || 0) === 1)) {
  document.documentElement.classList.remove('journey-open-boot');
}

let heroAccum = _savedState.heroAccum || 0;
let jAccum    = _savedState.jAccum    || 0;
let rafId     = 0;
let heroTarget = heroAccum / HERO_TOTAL;
let heroCur    = heroTarget;
let jTarget    = jAccum / JOURNEY_TOTAL;
let jCur       = jTarget;
let zone       = _savedState.zone || 0;
let _hasOpenedInvite = !!_savedState.hasOpened;

const buildSessionState = (overrides = {}) => ({
  heroAccum,
  jAccum,
  zone,
  hasOpened: _hasOpenedInvite,
  inviteOpen: mainContent.classList.contains('show'),
  ...overrides,
});

const persistSessionState = (overrides = {}) => {
  try { sessionStorage.setItem(_SS_KEY, JSON.stringify(buildSessionState(overrides))); }
  catch (e) {}
};

/* Save state to sessionStorage (throttled) */
let _saveTimer = null;
const saveState = () => {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    persistSessionState();
  }, 300);
};

const addDelta = (d) => {
  if (!appReady) return;
  if (zone === 0) {
    heroAccum = clamp(heroAccum+d, 0, HERO_TOTAL);
    heroTarget = heroAccum/HERO_TOTAL;
    if (heroAccum >= HERO_TOTAL && d > 0) zone = 1;
    kickRaf();
  } else {
    jAccum = clamp(jAccum+d, 0, JOURNEY_TOTAL);
    jTarget = jAccum/JOURNEY_TOTAL;
    if (jAccum <= 0 && d < 0) { zone = 0; }
    kickRaf();
  }
  saveState();
};

window.addEventListener('wheel', e=>{
  if (!appReady) return;
  /* Jika main-content (undangan) sedang terbuka — biarkan scroll normal */
  if (mainContent.classList.contains('show')) return;
  e.preventDefault();
  addDelta(Math.abs(e.deltaY)<50 ? e.deltaY*2.5 : e.deltaY*0.55);
},{passive:false});

let touchY=null;
window.addEventListener('touchstart',e=>{touchY=e.touches[0].clientY;},{passive:true});
window.addEventListener('touchmove',e=>{
  if (!appReady) return;
  if(touchY===null)return;
  if (mainContent.classList.contains('show')) return;
  e.preventDefault();
  addDelta((touchY-e.touches[0].clientY)*1.1);
  touchY=e.touches[0].clientY;
},{passive:false});
window.addEventListener('touchend',()=>{touchY=null;});

const isTypingElement = (el) => {
  if (!el) return false;
  const tag = el.tagName;
  return el.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
};

window.addEventListener('keydown',e=>{
  if (!appReady) return;
  if (mainContent.classList.contains('show')) return;
  if (isTypingElement(e.target) || isTypingElement(document.activeElement)) return;
  const map={ArrowDown:60,ArrowUp:-60,PageDown:300,PageUp:-300,' ':150,Space:150,Spacebar:150};
  const d=map[e.key];
  if (d===undefined) return;
  e.preventDefault();
  addDelta(d);
});

/* Master render */
const render = () => {
  const inJourney  = zone === 1 || jCur > 0.001;
  const inviteOpen = mainContent.classList.contains('show');

  btnTop.classList.toggle('show', inJourney && !inviteOpen);
  btnDown.classList.toggle('show', inJourney && !inviteOpen);

  renderHero(heroCur);

  const fade = clamp(jCur*20, 0, 1);
  document.getElementById('canvas').style.opacity = (1-fade).toFixed(4);
  journeyCanvas.style.opacity = fade.toFixed(4);
  journeyCanvas.classList.toggle('active', inJourney);

  scrollHint.style.display = inJourney ? 'none' : '';
  btnContinue.classList.toggle('show', inJourney && jCur >= .97);

  if (inJourney) renderJourney(jCur);
  else progressBar.style.width = (heroCur*100).toFixed(2)+'%';
};

/* RAF */
const tick = () => {
  heroCur += (heroTarget-heroCur)*smooth();
  jCur    += (jTarget-jCur)*smooth();
  render();
  const done = Math.abs(heroTarget-heroCur)<.0004 && Math.abs(jTarget-jCur)<.0004;
  if (!done) { rafId=requestAnimationFrame(tick); }
  else { heroCur=heroTarget; jCur=jTarget; render(); rafId=0; }
};
const kickRaf = () => { if(!rafId)rafId=requestAnimationFrame(tick); };

btnContinue.addEventListener('click', openInvite);
btnBack.addEventListener('click', () => {
  mainContent.classList.remove('show');
  document.body.classList.remove('invite-open');
  document.documentElement.classList.remove('invite-open-boot');
  heroAccum = 0; heroTarget = 0; heroCur = 0;
  jAccum    = 0; jTarget    = 0; jCur    = 0;
  zone = 0;
  clearTimeout(_saveTimer);
  try { sessionStorage.removeItem(_SS_KEY); } catch(e) {}
  _hasOpenedInvite = false;
  render();
  kickRaf();
});

function openInvite() {
  ensureMainContentAssets();
  mainContent.classList.add('show');
  document.body.classList.add('invite-open');
  document.documentElement.classList.add('invite-open-boot');
  _hasOpenedInvite = true;
  saveState();
  persistSessionState({ hasOpened: true, inviteOpen: true });
  mainContent.scrollTo({ top: 0, behavior: 'auto' });
  renderComments();
}

/* Scroll-to-top button */
btnTop.addEventListener('click', () => {
  heroAccum = 0; heroTarget = 0; heroCur = 0;
  jAccum    = 0; jTarget    = 0; jCur    = 0;
  zone = 0;
  clearTimeout(_saveTimer);
  try { sessionStorage.removeItem(_SS_KEY); } catch(e) {}
  _hasOpenedInvite = false;
  document.documentElement.classList.remove('invite-open-boot');
  render();
  kickRaf();
});

btnDown.addEventListener('click', () => {
  openInvite();
});

const restoreSavedViewState = () => {
  if (_savedState.inviteOpen) {
    ensureMainContentAssets();
    mainContent.classList.add('show');
    document.body.classList.add('invite-open');
    document.documentElement.classList.add('invite-open-boot');
    renderComments();
  }
};

const startApp = () => {
  appReady = true;
  restoreSavedViewState();
  render();
  initMusic(); /* dipanggil di sini — loader sudah hilang, gesture user bisa diterima */

  if (document.documentElement.classList.contains('journey-open-boot')) {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('journey-open-boot');
    });
  }
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('scene-boot');
  });
};

const bootApp = async () => {
  try {
    await waitEssentialAssets();
    await waitForLoaderTap();
  } finally {
    hideLoader();
    document.documentElement.classList.remove('app-loading');
    document.documentElement.classList.add('app-ready');
    startApp();
  }
};
bootApp();

/* ── Copy to clipboard (rekening) ── */
function copyGift(elId, btn) {
  const text = document.getElementById(elId).textContent.trim();
  navigator.clipboard.writeText(text).catch(() => {
    /* fallback */
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
  });
  const orig = btn.textContent;
  btn.textContent = '✓'; btn.classList.add('copied');
  setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
}
window.copyGift = copyGift;

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                  .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function formatCommentDate(ts) {
  const d = new Date(Number(ts) || Date.now());
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

function renderComments() {
  const list  = document.getElementById('cmtList');
  const empty = document.getElementById('cmtEmpty');
  if (!list) return;
  if (comments.length === 0) {
    if (empty) empty.style.display = '';
    /* remove old bubbles */
    Array.from(list.querySelectorAll('.comment-bubble')).forEach(el=>el.remove());
    return;
  }
  if (empty) empty.style.display = 'none';
  /* rebuild list */
  Array.from(list.querySelectorAll('.comment-bubble')).forEach(el=>el.remove());
  comments.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'comment-bubble';
    div.style.animationDelay = (i * 60) + 'ms';
    const dateText = formatCommentDate(c.ts);
    div.innerHTML = `
      <p class="comment-bubble-name">${escHtml(c.name)}</p>
      <p class="comment-bubble-date">${escHtml(dateText)}</p>
      <p class="comment-bubble-text">${escHtml(c.text)}</p>`;
    list.appendChild(div);
  });
}

const cmtSubmit = document.getElementById('cmtSubmit');
if (cmtSubmit) {
  cmtSubmit.addEventListener('click', async () => {
    const cmtNameEl = document.getElementById('cmtName');
    const cmtTextEl = document.getElementById('cmtText');
    const name = cmtNameEl.value.trim();
    const msg  = cmtTextEl.value.trim();
    if (!name || !msg) {
      if (!name) cmtNameEl.style.borderColor = 'rgba(176,100,100,.7)';
      if (!msg)  cmtTextEl.style.borderColor = 'rgba(176,100,100,.7)';
      setTimeout(() => {
        cmtNameEl.style.borderColor = '';
        cmtTextEl.style.borderColor = '';
      }, 1400);
      return;
    }

    /* Nonaktifkan tombol sementara mencegah double submit */
    cmtSubmit.disabled = true;
    cmtSubmit.textContent = 'Mengirim…';

    try {
      const { error } = await supabase
        .from('ucapan')
        .insert([{ name, text: msg, ts: Date.now() }]);
      if (error) throw error;
      cmtNameEl.value = '';
      cmtTextEl.value = '';
      cmtSubmit.textContent = '✓ Terkirim';
    } catch (err) {
      console.error('[Supabase] Gagal kirim ucapan:', err.message);
      cmtSubmit.textContent = '✗ Gagal — coba lagi';
    } finally {
      setTimeout(() => {
        cmtSubmit.textContent = 'Kirim Ucapan';
        cmtSubmit.disabled = false;
      }, 2200);
    }
  });
}

/* ── Scroll reveal observer untuk .mc-reveal ── */
(function initReveal() {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  }, {
    root: mainContent,
    threshold: 0.16,
    rootMargin: '0px 0px -10% 0px',
  });

  const cardIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('show', entry.isIntersecting);
    });
  }, {
    root: mainContent,
    threshold: 0.2,
    rootMargin: '0px 0px -8% 0px',
  });

  /* Observe existing elements + re-observe after openInvite */
  function observeAll() {
    mainContent.querySelectorAll('.mc-reveal').forEach(el => {
      el.classList.remove('visible');
      revealIO.observe(el);
    });
    mainContent.querySelectorAll('.mc-card').forEach(el => {
      cardIO.observe(el);
    });
    queueSync();
  }

  let syncRaf = 0;
  const syncVisibility = () => {
    syncRaf = 0;
    if (!mainContent.classList.contains('show')) return;
    const vh = window.innerHeight;
    mainContent.querySelectorAll('.mc-reveal').forEach(el => {
      const r = el.getBoundingClientRect();
      const inView = r.top < vh * 0.90 && r.bottom > vh * 0.10;
      el.classList.toggle('visible', inView);
    });
    mainContent.querySelectorAll('.mc-card').forEach(el => {
      const r = el.getBoundingClientRect();
      const inView = r.top < vh * 0.92 && r.bottom > vh * 0.08;
      el.classList.toggle('show', inView);
    });
  };
  const queueSync = () => {
    if (syncRaf) return;
    syncRaf = requestAnimationFrame(syncVisibility);
  };

  /* Trigger saat main-content dibuka */
  const mcObserver = new MutationObserver(() => {
    if (mainContent.classList.contains('show')) {
      setTimeout(observeAll, 100);
    }
  });
  mcObserver.observe(mainContent, { attributes:true, attributeFilter:['class'] });

  if (mainContent.classList.contains('show')) {
    setTimeout(observeAll, 80);
  }

  /* Re-observe saat viewport berubah agar trigger tetap konsisten */
  window.addEventListener('resize', () => {
    if (mainContent.classList.contains('show')) {
      observeAll();
    }
  }, { passive:true });
  mainContent.addEventListener('scroll', queueSync, { passive:true });
})();

})();