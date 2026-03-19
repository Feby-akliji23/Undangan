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
const SUPABASE_MODULE_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL  = 'https://mkpfuqqwxxapgbbfuswy.supabase.co';
const SUPABASE_ANON = 'sb_publishable_L9iRLeanmFIao2WenjnpqQ_JoyEh740';

(function(){
'use strict';

/* ════════════════════════════════════════════════════
   GSAP + TEMPUS — performance layer
   GSAP  : batching style writes, no forced reflow
   Tempus: frame delta yang akurat, animasi konsisten
           di semua device & frame rate
   ════════════════════════════════════════════════════ */
const GSAP_CDN   = 'https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js';
const TEMPUS_CDN = 'https://cdn.jsdelivr.net/npm/@studio-freight/tempus@0.0.24/dist/index.js';
const LENIS_CDN  = 'https://cdn.jsdelivr.net/npm/lenis@1.3.18/dist/lenis.min.js';

let gsap   = null;
let Tempus = null;
let Lenis  = null;

const loadPerf = () => Promise.all([
  new Promise(res => {
    if (window.gsap) { gsap = window.gsap; res(); return; }
    const s = document.createElement('script');
    s.src = GSAP_CDN;
    s.onload  = () => { gsap = window.gsap; res(); };
    s.onerror = () => res();
    document.head.appendChild(s);
  }),
  new Promise(res => {
    if (window.Tempus) { Tempus = window.Tempus; res(); return; }
    const s = document.createElement('script');
    s.src = TEMPUS_CDN;
    s.onload  = () => { Tempus = window.Tempus || window.tempus; res(); };
    s.onerror = () => res();
    document.head.appendChild(s);
  }),
  new Promise(res => {
    if (window.Lenis) { Lenis = window.Lenis; res(); return; }
    const s = document.createElement('script');
    s.src = LENIS_CDN;
    s.onload  = () => { Lenis = window.Lenis; res(); };
    s.onerror = () => res(); /* graceful fallback ke handler manual */
    document.head.appendChild(s);
  }),
]);

/* ── gs(el, props) — single style-write entry point ──
   Semua penulisan visual (opacity, transform, left, top, dll) harus
   lewat fungsi ini. GSAP batch semua write ke akhir frame sehingga
   tidak ada forced reflow. Fallback manual mencakup semua prop yang
   dipakai di kode ini sehingga tidak ada el.style.* tersebar di luar.
*/
const gs = (el, props) => {
  if (!el) return;
  if (gsap) {
    /* force3D:false  — GSAP tidak inject translateZ/will-change:transform
       autoRound:false — opacity tidak dibulatkan paksa */
    gsap.set(el, { force3D: false, autoRound: false, ...props });
    return;
  }
  const s = el.style;
  if (props.opacity            !== undefined) s.opacity            = String(props.opacity);
  if (props.left               !== undefined) s.left               = String(props.left);
  if (props.top                !== undefined) s.top                = String(props.top);
  if (props.right              !== undefined) s.right              = String(props.right);
  if (props.bottom             !== undefined) s.bottom             = String(props.bottom);
  if (props.width              !== undefined) s.width              = String(props.width);
  if (props.transform          !== undefined) s.transform          = String(props.transform);
  if (props.transformOrigin    !== undefined) s.transformOrigin    = String(props.transformOrigin);
  if (props.backgroundSize     !== undefined) s.backgroundSize     = String(props.backgroundSize);
  if (props.backgroundPosition !== undefined) s.backgroundPosition = String(props.backgroundPosition);
  if (props.willChange         !== undefined) s.willChange         = String(props.willChange);
};

/* ════════════════════════════════════════════════════
   CONFIG — global settings (musik, viewport, dll)
   ════════════════════════════════════════════════════ */
const CONFIG = {

  viewport: {
    mobileBreakpoint: 1000,
  },

  music: {
    src: 'assets/audio/Christian_Bautista_-_The_Way_You_Look_At_Me_(mp3.pm).mp3',
    volume: 0.8,
    defaultOn: true,
    overrideSavedOffWhenDefaultOn: true,
    storageKey: 'wss_music_on',
  },

  /* ── Lenis — tuning input scroll ──
     wheelMultiplier : kecepatan wheel mouse (1.0 = normal)
     touchMultiplier : kecepatan swipe jari (1.4–1.5 biasanya enak di mobile)
     syncTouchLerp   : panjang momentum setelah jari diangkat (0=instant, 0.1=panjang)
  */
  lenis: {
    wheelMultiplier: 1.0,
    touchMultiplier: 1.45,
    syncTouchLerp:   0.08,
  },

  /* ── Animasi — tuning lerp hero/journey ──
     smoothMobile  : seberapa smooth animasi di mobile (lebih besar = lebih responsif)
     smoothDesktop : seberapa smooth animasi di desktop
     Nilai antara 0.05 (sangat smooth/lambat) hingga 0.2 (sangat responsif/cepat)
  */
  animation: {
    smoothMobile:  0.10,
    smoothDesktop: 0.09,
  },

  /* ── Default placement FG (global) ──
     Dipakai saat movement tidak isi fgX/fgY/fgXOrigin/fgYOrigin.
     Semua angka di sini aman dituning langsung dari CONFIG.
  */
  fgPlacement: {
    hero: {
      fg:  { xPct: 50,  yPct: 100, xOrigin: 0.5, yOrigin: 1 },
      fg2: { xPct: 0,   yPct: 0,   xOrigin: 0,   yOrigin: 0 },
      fg3: { xPct: 100, yPct: 0,   xOrigin: 1,   yOrigin: 0 },
      fg4: { xPct: 0,   yPct: 100, xOrigin: 0,   yOrigin: 1 },
      fg5: { xPct: 100, yPct: 100, xOrigin: 1,   yOrigin: 1 },
    },
    journey: {
      fg:  { xPct: 50, yPct: 100, xOrigin: 0.5, yOrigin: 1 },
      fg2: { xPct: 50, yPct: 100, xOrigin: 0.5, yOrigin: 1 },
    },
  },

  /* ── Fallback — dipakai kalau Lenis gagal load ──
     Nilai ini meniru behavior Lenis secara manual.
  */
  fallback: {
    wheelMult:        2.0,
    touchMult:        1.2,
    touchLimitMobile: 70,
    touchLimitDesktop:180,
    deadzoneMobile:   1.4,
    deadzoneDesktop:  0.8,
  },

};

const FG_DEFAULTS = {
  hero: {
    fg:  CONFIG.fgPlacement?.hero?.fg  || { xPct: 50,  yPct: 100, xOrigin: 0.5, yOrigin: 1 },
    fg2: CONFIG.fgPlacement?.hero?.fg2 || { xPct: 0,   yPct: 0,   xOrigin: 0,   yOrigin: 0 },
    fg3: CONFIG.fgPlacement?.hero?.fg3 || { xPct: 100, yPct: 0,   xOrigin: 1,   yOrigin: 0 },
    fg4: CONFIG.fgPlacement?.hero?.fg4 || { xPct: 0,   yPct: 100, xOrigin: 0,   yOrigin: 1 },
    fg5: CONFIG.fgPlacement?.hero?.fg5 || { xPct: 100, yPct: 100, xOrigin: 1,   yOrigin: 1 },
  },
  journey: {
    fg:  CONFIG.fgPlacement?.journey?.fg  || { xPct: 50, yPct: 100, xOrigin: 0.5, yOrigin: 1 },
    fg2: CONFIG.fgPlacement?.journey?.fg2 || { xPct: 50, yPct: 100, xOrigin: 0.5, yOrigin: 1 },
  },
};

/* ════════════════════════════════════════════════════
   HERO SCENE
   ────────────────────────────────────────────────────
   Pakai sistem Journey yang sama persis.
   ────────────────────────────────────────────────────
   bg layer  : .bg-paper  (background-image, pan/zoom)
   fg        : #hBirds    — burung
               fgX/fgY            = posisi bebas di viewport (%) saat 0..100
               fgXOrigin/fgYOrigin= origin titik elemen (0..1, optional)
   fg2       : #hFlowerTL — bunga kiri atas
   fg3       : #hFlowerTR — bunga kanan atas
   fg4       : #hFlowerBL — bunga kiri bawah
   fg5       : #hFlowerBR — bunga kanan bawah
               fgNX/fgNY            = posisi bebas di viewport (%) saat 0..100
               fgNXOrigin/fgNYOrigin= origin titik elemen (0..1, optional)
   dialog    : #hDialog   — .jdialog + style class
               style: 'hero-intro'   → teks judul besar
               style: 'hero-prayer'  → teks doa/sambutan
   ════════════════════════════════════════════════════ */
const HERO_SCENE = {
  chapters: [
    {
      movements: [
        /* mv1 — opening: teks intro langsung terlihat, fg fade-in dari bawah */
        {
          scroll: 120,
          ease: 'out',
          desktop: {
            bgX: 50, bgY: 50, bgZoom: 1,
            fgX: 0,  fgY: 0, fgXOrigin: 0, fgYOrigin: 0, fgScale: 0.2, fgOpacity: 1.0,  /* burung */
            fg2X: 0, fg2Y: 0, fg2XOrigin: 0, fg2YOrigin: 0, fg2Scale: 0.5,  fg2Opacity: 0.0,
            fg3X: 100, fg3Y: 0, fg3XOrigin: 1, fg3YOrigin: 0, fg3Scale: 0.5,  fg3Opacity: 0.0,
            fg4X: 0, fg4Y: 100, fg4XOrigin: 0, fg4YOrigin: 1, fg4Scale: 0.5,  fg4Opacity: 0.0,
            fg5X: 100, fg5Y: 100, fg5XOrigin: 1, fg5YOrigin: 1, fg5Scale: 0.5,  fg5Opacity: 0.0,
            dialog: { style: 'hero-intro', desktop: { x: 50, y: 50, anchor: 'center' }, mobile: { x: 50, y: 50, anchor: 'center' } },
          },
          mobile: {
            bgX: 50, bgY: 50, bgZoom: 1,
            fgX: 0,  fgY: 0, fgXOrigin: 0, fgYOrigin: 0, fgScale: 0.2, fgOpacity: 1.0,
            fg2X: 0, fg2Y: 0, fg2XOrigin: 0, fg2YOrigin: 0, fg2Scale: 0.4,  fg2Opacity: 0.0,
            fg3X: 100, fg3Y: 0, fg3XOrigin: 1, fg3YOrigin: 0, fg3Scale: 0.4,  fg3Opacity: 0.0,
            fg4X: 0, fg4Y: 100, fg4XOrigin: 0, fg4YOrigin: 1, fg4Scale: 0.4,  fg4Opacity: 0.0,
            fg5X: 100, fg5Y: 100, fg5XOrigin: 1, fg5YOrigin: 1, fg5Scale: 0.4,  fg5Opacity: 0.0,
            dialog: { style: 'hero-intro', desktop: { x: 50, y: 50, anchor: 'center' }, mobile: { x: 50, y: 50, anchor: 'center' } },
          },
        },

        /* mv2 — settle: semua fg masuk smooth, burung landing di posisi intro */
        {
          scroll: 340,
          ease: 'out',
          desktop: {
            bgX: 50, bgY: 60, bgZoom: 1.16,
            fgX: 50,  fgY: 50, fgXOrigin: 0.5, fgYOrigin: 0.5, fgScale: 1.2,  fgOpacity: 1.0,  /* burung di posisi tengah */
            fg2X: 0, fg2Y: 0, fg2XOrigin: 0, fg2YOrigin: 0, fg2Scale: 1.0,  fg2Opacity: 1.0,
            fg3X: 100, fg3Y: 0, fg3XOrigin: 1, fg3YOrigin: 0, fg3Scale: 1.0,  fg3Opacity: 1.0,
            fg4X: 0, fg4Y: 100, fg4XOrigin: 0, fg4YOrigin: 1, fg4Scale: 1.0,  fg4Opacity: 1.0,
            fg5X: 100, fg5Y: 100, fg5XOrigin: 1, fg5YOrigin: 1, fg5Scale: 1.0,  fg5Opacity: 1.0,
            dialog: { style: 'hero-intro', desktop: { x: 50, y: 50, anchor: 'center' }, mobile: { x: 50, y: 50, anchor: 'center' } },
          },
          mobile: {
            bgX: 50, bgY: 60, bgZoom: 1.16,
            fgX: 50,  fgY: 50, fgXOrigin: 0.5, fgYOrigin: 0.5, fgScale: 1.2,  fgOpacity: 1.0,
            fg2X: 0, fg2Y: 0, fg2XOrigin: 0, fg2YOrigin: 0, fg2Scale: 0.8,  fg2Opacity: 1.0,
            fg3X: 100, fg3Y: 0, fg3XOrigin: 1, fg3YOrigin: 0, fg3Scale: 0.8,  fg3Opacity: 1.0,
            fg4X: 0, fg4Y: 100, fg4XOrigin: 0, fg4YOrigin: 1, fg4Scale: 0.8,  fg4Opacity: 1.0,
            fg5X: 100, fg5Y: 100, fg5XOrigin: 1, fg5YOrigin: 1, fg5Scale: 0.8,  fg5Opacity: 1.0,
            dialog: { style: 'hero-intro', desktop: { x: 50, y: 50, anchor: 'center' }, mobile: { x: 50, y: 50, anchor: 'center' } },
          },
        },

        /* mv3 — dialog swap ke prayer di t=0.5*/
        {
          scroll: 360,
          ease: 'inOut',
          desktop: {
            bgX: 50, bgY: 45, bgZoom: 1.12,
            fgX: 50,  fgY: 20, fgXOrigin: 0, fgYOrigin: 0, fgScale: 1.2,  fgOpacity: 1.0,
            fg2X: 0, fg2Y: 0, fg2XOrigin: 0, fg2YOrigin: 0, fg2Scale: 1.0,  fg2Opacity: 1.0,
            fg3X: 100, fg3Y: 0, fg3XOrigin: 1, fg3YOrigin: 0, fg3Scale: 1.0,  fg3Opacity: 1.0,
            fg4X: 0, fg4Y: 100, fg4XOrigin: 0, fg4YOrigin: 1, fg4Scale: 1.0,  fg4Opacity: 1.0,
            fg5X: 100, fg5Y: 100, fg5XOrigin: 1, fg5YOrigin: 1, fg5Scale: 1.0,  fg5Opacity: 1.0,
            dialog: { style: 'hero-prayer', desktop: { x: 50, y: 50, anchor: 'center' }, mobile: { x: 50, y: 50, anchor: 'center' } },
          },
          mobile: {
            bgX: 50, bgY: 45, bgZoom: 1.12,
            fgX: 100,  fgY: 60, fgXOrigin: 1, fgYOrigin: 0, fgScale: 1.2,  fgOpacity: 1.0,
            fg2X: 0, fg2Y: 0, fg2XOrigin: 0, fg2YOrigin: 0, fg2Scale: 0.7,  fg2Opacity: 1.0,
            fg3X: 100, fg3Y: 0, fg3XOrigin: 1, fg3YOrigin: 0, fg3Scale: 0.7,  fg3Opacity: 1.0,
            fg4X: 0, fg4Y: 100, fg4XOrigin: 0, fg4YOrigin: 1, fg4Scale: 0.7,  fg4Opacity: 1.0,
            fg5X: 100, fg5Y: 100, fg5XOrigin: 1, fg5YOrigin: 1, fg5Scale: 0.7,  fg5Opacity: 1.0,
            dialog: { style: 'hero-prayer', desktop: { x: 50, y: 50, anchor: 'center' }, mobile: { x: 50, y: 50, anchor: 'center' } },
          },
        },

        /* mv4 — soar: burung terus naik ke posisi prayer final */
        {
          scroll: 220,
          ease: 'inOut',
          desktop: {
            bgX: 50, bgY: 60, bgZoom: 1.04,
            fgX: 80,  fgY: 10, fgXOrigin: 1, fgYOrigin: 0, fgScale: 3.0,  fgOpacity: 1.0,
            fg2X: 0, fg2Y: 0, fg2XOrigin: 0, fg2YOrigin: 0, fg2Scale: 1.0,  fg2Opacity: 1.0,
            fg3X: 100, fg3Y: 0, fg3XOrigin: 1, fg3YOrigin: 0, fg3Scale: 1.0,  fg3Opacity: 1.0,
            fg4X: 0, fg4Y: 100, fg4XOrigin: 0, fg4YOrigin: 1, fg4Scale: 1.0,  fg4Opacity: 1.0,
            fg5X: 100, fg5Y: 100, fg5XOrigin: 1, fg5YOrigin: 1, fg5Scale: 1.0,  fg5Opacity: 1.0,
            dialog: { style: 'hero-prayer', desktop: { x: 50, y: 50, anchor: 'center' }, mobile: { x: 50, y: 50, anchor: 'center' } },
          },
          mobile: {
            bgX: 50, bgY: 60, bgZoom: 1.04,
            fgX: 80,  fgY: 10, fgXOrigin: 1, fgYOrigin: 0, fgScale: 3.0,  fgOpacity: 1.0,
            fg2X: 0, fg2Y: 0, fg2XOrigin: 0, fg2YOrigin: 0, fg2Scale: 0.9,  fg2Opacity: 1.0,
            fg3X: 100, fg3Y: 0, fg3XOrigin: 1, fg3YOrigin: 0, fg3Scale: 0.9,  fg3Opacity: 1.0,
            fg4X: 0, fg4Y: 100, fg4XOrigin: 0, fg4YOrigin: 1, fg4Scale: 0.9,  fg4Opacity: 1.0,
            fg5X: 100, fg5Y: 100, fg5XOrigin: 1, fg5YOrigin: 1, fg5Scale: 0.9,  fg5Opacity: 1.0,
            dialog: { style: 'hero-prayer', desktop: { x: 50, y: 50, anchor: 'center' }, mobile: { x: 50, y: 50, anchor: 'center' } },
          },
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════
   JOURNEY CONFIG — keyframe scroll per chapter
   ────────────────────────────────────────────────────
   bgX/bgY   : fokus background 0–100% (50/50 = tengah)
   bgZoom    : zoom (1.0 = cover pas, 1.3 = zoom 30%)
   fgX/fgY   : geser foreground horizontal/vertikal px
   fgScale   : skala foreground
   fgRotate  : rotasi foreground (derajat)
   fgOpacity : opacity foreground (0–1)
   fg2*      : optional foreground kedua
   fgX/fgY   : posisi bebas di viewport (%) saat 0..100
   fgXOrigin/fgYOrigin : origin titik elemen (0..1, optional)
   fg2X/fg2Y : posisi bebas fg2 di viewport (%) saat 0..100
   fg2XOrigin/fg2YOrigin : origin titik elemen fg2 (0..1, optional)
   fgRevealStart : 0..1, fg mulai muncul di akhir transisi
   fgCutIn   : true = fg langsung muncul (no fade)
   desktop/mobile : override nilai per perangkat
   scroll    : jarak scroll absolut per movement (virtual units)
               jika tidak diisi, fallback default 280
   ease      : 'inOut' | 'out' | 'in' | 'linear'
   ════════════════════════════════════════════════════ */
const JOURNEY = {
  chapters: [
    /* ── Chapter 1: Pertemuan ── */
    {
      movements: [
        // {
        //   scroll: 240, ease:'out',
        //   desktop: { bgX:0, bgY:0, bgZoom:1.60, fgX:50, fgY:100, fgXOrigin:0.5, fgYOrigin:0.88, fgScale:1.0, fgOpacity:0.0 },
        //   mobile:  { bgX:0, bgY:0, bgZoom:1.60, fgX:50, fgY:100, fgXOrigin:0.5, fgYOrigin:0.88, fgScale:0.94, fgOpacity:0.0 },
        //   dialog: {
        //     text: 'Di tempat yang penuh kesibukan,\nMorowali.',
        //     desktop: { x: 50, y: 50, anchor: 'center', width: 'min(520px, 38vw)' },
        //     mobile:  { x: 50, y: 25, anchor: 'top-left', width: 'min(300px, 84vw)' }
        //   }
        // },
        {
          scroll: 240, ease:'inOut',
          desktop: { bgX:100, bgY:35, bgZoom:1.45,  fgX:42, fgY:100, fgXOrigin:0.5, fgYOrigin:0.66, fgScale:1.2, fgOpacity:0.0 },
          mobile:  { bgX:100, bgY:35, bgZoom:1.45, fgX:42, fgY:100, fgXOrigin:0.5, fgYOrigin:0.66, fgScale:1.08, fgOpacity:0.0 },
          dialog: {
            text: 'Tak pernah kami sangka\ntakdir mempertemukan dua hati.',
            desktop: { x: 20, y: 20, anchor: 'top-right', width: 'min(420px, 38vw)' },
            mobile:  { x: 50, y: 25, anchor: 'top-right', width: 'min(300px, 84vw)' }
          }
        },
        {
          scroll: 720, ease:'inOut', 
          desktop: { bgX:50, bgY:55, bgZoom:1.25, fgX:42, fgY:100, fgXOrigin:0.5, fgYOrigin:0.66, fgScale:1.3, fgOpacity:1.0 },
          mobile:  { bgX:50, bgY:55, bgZoom:1.25, fgX:50, fgY:50, fgXOrigin:0.5, fgYOrigin:0.5, fgScale:1.16, fgOpacity:1.0 },
          dialog: {
            text: 'Tak pernah kami sangka\ntakdir mempertemukan dua hati.',
            desktop: { x: 100, y: 20, anchor: 'center', width: 'min(420px, 38vw)' },
            mobile:  { x: 50,   y: 25,  anchor: 'center', width: 'min(300px, 84vw)' }
          }
        },
        {
          scroll: 260, ease:'in',
          desktop: { bgX:50, bgY:50, bgZoom:1.08, fgX:50, fgY:100, fgXOrigin:0.5, fgYOrigin:0.78, fgScale:1.2, fgOpacity:0.7 },
          mobile:  { bgX:50, bgY:50, bgZoom:1.08, fgX:50, fgY:100, fgXOrigin:0.5, fgYOrigin:0.78, fgScale:1.08, fgOpacity:0.7 },
          dialog: null
        },
      ],
    },

    /* ── Chapter 2: Percakapan ── */
    {
      movements: [
        {
          scroll: 260, ease:'out',
          desktop: { bgX:0, bgY:0, bgZoom:1.60, fgX:18,   fgY:85, fgXOrigin:0.5, fgYOrigin:0.35, fgScale:0.9, fgOpacity:0.0 },
          mobile:  { bgX:0, bgY:0, bgZoom:1.60, fgX:18, fgY:85, fgXOrigin:0.5, fgYOrigin:0.35, fgScale:0.86, fgOpacity:0.0 },
          dialog: {
            text: 'lalu waktu pelan-pelan mengajarkan kami untuk saling mengenal, memahami, dan akhirnya memilih satu sama lain.',
            desktop: { x: 50, y: 50, anchor: 'center', width: 'min(520px, 38vw)' },
            mobile:  { x: 50, y: 50, anchor: 'center', width: 'min(300px, 84vw)' }
          }
        },
        // {
        //   scroll: 680, ease:'inOut',
        //   desktop: { bgX:100, bgY:35, bgZoom:1.45, fgX:50,   fgY:75, fgXOrigin:0.5, fgYOrigin:0.35, fgScale:1.7,fgRotate:8, fgOpacity:1.0 },
        //   mobile:  { bgX:100, bgY:35, bgZoom:1.45, fgX:70, fgY:70, fgXOrigin:0.5, fgYOrigin:0.7, fgScale:1.35, fgRotate:0, fgOpacity:1.0 },
        //   dialog: {
        //     text: 'Setiap percakapan, setiap pertemuan.',
        //     desktop: { x: 94, y: 30, anchor: 'top-right', width: 'min(520px, 38vw)' },
        //     mobile:  { x: 0, y: 50,  anchor: 'top-right', width: 'min(300px, 84vw)' }
        //   }
        // },
        {
          scroll: 700, ease:'inOut',
          desktop: { bgX:50, bgY:50, bgZoom:1.05, fgX:40, fgY:70, fgXOrigin:0.5, fgYOrigin:0.35, fgScale:1.4, fgRotate:8,  fgOpacity:1.0 },
          mobile:  { bgX:50, bgY:50, bgZoom:1.05, fgX:50, fgY:50, fgXOrigin:0.5, fgYOrigin:0.5, fgScale:1.20, fgRotate:8, fgOpacity:1.0 },
          dialog: {
            text: 'menumbuhkan keyakinan bahwa ini bukan sekadar kebetulan, melainkan perjalanan yang memang ditakdirkan.',
            desktop: { x: 94, y: 30, anchor: 'top-right', width: 'min(520px, 38vw)' },
            mobile:  { x: 100, y: 20,  anchor: 'top-right', width: 'min(300px, 84vw)' }
          }
        },
        {
          scroll: 240, ease:'in',
          desktop: { bgX:90, bgY:10, bgZoom:1.25, fgX:40, fgY:70, fgXOrigin:0.5, fgYOrigin:0.35, fgScale:1.4, fgRotate:8, fgOpacity:0.7 },
          mobile:  { bgX:90, bgY:10, bgZoom:1.25, fgX:40, fgY:70, fgXOrigin:0.5, fgYOrigin:0.35, fgScale:1.18, fgRotate:8, fgOpacity:0.7 },
          dialog: null
        },
      ],
    },

    /* ── Chapter 3: Bersama ── */
    {
      movements: [
        {
          scroll: 100, ease:'out',
          desktop: { bgX:100, bgY:35, bgZoom:1.60,  fgX:0, fgY:50, fgXOrigin:0.5, fgYOrigin:1, fgScale:1.0, fgOpacity:0.0 },
          mobile:  { bgX:100, bgY:35, bgZoom:1.60, fgX:0, fgY:50, fgXOrigin:0.5, fgYOrigin:1, fgScale:0.92, fgOpacity:0.0 },
          dialog: null
        },
        {
          scroll: 680, ease:'inOut',
          desktop: { bgX:100, bgY:35, bgZoom:1.08, fgX:0, fgY:100, fgXOrigin:0, fgYOrigin:0.7,  fgScale:1.0, fgOpacity:0.0 },
          mobile:  { bgX:100, bgY:35, bgZoom:1.08, fgX:0, fgY:100, fgXOrigin:0, fgYOrigin:0.7, fgScale:0.92, fgOpacity:0.0 },
          dialog: {
            text: 'Masalah dan tantangan datang, menguji, menguatkan, dan mendewasakan.',
            desktop: { x: 50, y: 50, anchor: 'center', width: 'min(520px, 38vw)' },
            mobile:  { x: 50, y: 50, anchor: 'center', width: 'min(300px, 84vw)' }
          }
        },
        {
          scroll: 700, ease:'inOut',
          desktop: {
            bgX: 0, bgY: 100, bgZoom: 1.08,
            fgX:22, fgY:100,         
            fgXOrigin:0, fgYOrigin:0.8, 
            fgScale:1.2, fgOpacity:1.0
          },
          mobile:  { bgX:0, bgY:100, bgZoom:1.08, fgX:50, fgY:70, fgXOrigin:0.5, fgYOrigin:0.7, fgScale:1.1, fgOpacity:1.0 },
          dialog: {
            text: 'Hingga kami sadar,\ncinta ini layak diperjuangkan.',
            desktop: { x: 94, y: 30, anchor: 'top',          width: 'min(520px, 38vw)' },
            mobile:  { x: 50, y: 80, anchor: 'bottom-center', width: 'min(300px, 84vw)' }
          }
        },
        {
          scroll: 240, ease:'inOut',
          desktop: { bgX:100, bgY:100, bgZoom:1.20, fgX:50, fgY:100, fgXOrigin:0, fgYOrigin:0.7, fgScale:1.2,  fgOpacity:1.0 },
          mobile:  { bgX:100, bgY:100, bgZoom:1.20, fgX:50, fgY:100, fgXOrigin:0, fgYOrigin:0.7, fgScale:1.04, fgOpacity:0.8 },
          dialog: null
        },
      ],
    },

    /* ── Chapter 4: Ikrar ── */
    {
      movements: [
        {
          scroll: 120, ease:'out',
          desktop: { bgX:50, bgY:80, bgZoom:1.20, fgX:50,fgY:100,fgXOrigin:0.5,fgYOrigin:0.45, fgScale:0.5, fgOpacity:0.0, fg2X:100, fg2Y:0, fg2XOrigin:1, fg2YOrigin:0, fg2Scale:0.68, fg2Opacity:1.0 },
          mobile:  { bgX:50, bgY:80, bgZoom:1.20, fgX:50, fgY:100, fgXOrigin:0.5, fgYOrigin:0.45, fgScale:0.42, fgOpacity:0.0, fg2X:100, fg2Y:0, fg2XOrigin:1, fg2YOrigin:0, fg2Scale:0.62, fg2Opacity:1.0 },
          dialog: null
        },
        {
          scroll: 300, ease:'out',
          desktop: { bgX:50, bgY:0,  bgZoom:1.20,fgX:50,fgY:100,fgXOrigin:0.5,fgYOrigin:0.75,fgScale:1.05,fgOpacity:0.0, fg2X:40, fg2Y:50, fg2XOrigin:1, fg2YOrigin:0, fg2Scale:0.58, fg2Opacity:0.86 },
          mobile:  { bgX:50, bgY:0, bgZoom:1.20, fgX:50, fgY:100, fgXOrigin:0.5, fgYOrigin:0.75, fgScale:0.90, fgOpacity:0.0, fg2X:50, fg2Y:50, fg2XOrigin:0.5, fg2YOrigin:0.5, fg2Scale:1.5, fg2Opacity:1.0},
          dialog: {
            text: 'Maka dengan ini kami mantap memutuskan...',
            desktop: { x: 50, y: 50, anchor: 'center',   width: 'min(520px, 38vw)' },
            mobile:  { x: 50,  y: 50,  anchor: 'center', width: 'min(300px, 84vw)' },
          }
        },
        {
          scroll: 760, ease:'inOut',
          desktop: { bgX:0, bgY:0, bgZoom:1.60, fgX:50,fgY:100,fgXOrigin:0.5,fgYOrigin:0.75,fgScale:1.05,fgOpacity:1.0, fg2X:30, fg2Y:10, fg2XOrigin:1, fg2YOrigin:0, fg2Scale:0.7, fg2Opacity:0.86 },
          mobile:  { bgX:0, bgY:0, bgZoom:1.60, fgX:50, fgY:100, fgXOrigin:0.5, fgYOrigin:0.95, fgScale:1.1, fgOpacity:1.0, fg2X:70, fg2Y:8, fg2XOrigin:1, fg2YOrigin:0.3, fg2Scale:1, fg2Opacity:1 },
          dialog: {
            text: 'Untuk mengikat janji, untuk berjalan bersama hari ini, esok, dan selamanya.',
            desktop: { x: 50, y: 95, anchor: 'bottom-center', width: 'min(620px, 68vw)' },
            mobile:  { x: 50, y: 25, anchor: 'center',        width: 'min(300px, 84vw)' },
          }
        },
        {
          scroll: 320, ease:'inOut',
          desktop: { bgX:80, bgY:100, bgZoom:1.30,fgX:50,fgY:100,fgXOrigin:0.5,fgYOrigin:0.55,fgScale:1.55,fgOpacity:1.0, fg2X:50, fg2Y:0, fg2XOrigin:1, fg2YOrigin:0.2, fg2Scale:1.0, fg2Opacity:0.86 },
          mobile:  { bgX:0, bgY:0, bgZoom:1.60, fgX:50, fgY:100, fgXOrigin:0.5, fgYOrigin:0.95, fgScale:1.3, fgOpacity:1.0, fg2X:80, fg2Y:70, fg2XOrigin:1, fg2YOrigin:1, fg2Scale:0.62, fg2Opacity:0.86 },
          dialog: null
        },
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════
   ENGINE — tidak perlu diubah
════════════════════════════════════════════════════ */

/* ── DOM refs: Hero ── */
const heroBgPaper  = document.querySelector('.bg-paper');
const heroBirdsEl  = document.getElementById('hBirds');
const heroFlowerTL = document.getElementById('hFlowerTL');
const heroFlowerTR = document.getElementById('hFlowerTR');
const heroFlowerBL = document.getElementById('hFlowerBL');
const heroFlowerBR = document.getElementById('hFlowerBR');
const heroDialogEl = document.getElementById('hDialog');

/* ── DOM refs: General ── */
const progressOrn      = document.getElementById('progressOrn');
const scrollHint  = document.getElementById('scrollHint');
const btnContinue = document.getElementById('btnContinue');
const btnTop      = document.getElementById('btnTop');
const btnDown     = document.getElementById('btnDown');
const bgMusic     = document.getElementById('bgMusic');
const btnMusic    = document.getElementById('btnMusic');
const appLoader   = document.getElementById('appLoader');
const appLoaderBar   = document.getElementById('appLoaderBar');
const appLoaderText  = document.getElementById('appLoaderText');
const appEnterBtn    = document.getElementById('appEnterBtn');
const appEnterLabel  = appEnterBtn ? appEnterBtn.querySelector('.ldr-enter-label') : null;
const appLoaderBody  = appLoader ? appLoader.querySelector('.ldr-body') : null;
const appLoaderCopy = appLoader ? appLoader.querySelector('.ldr-copy') : null;
const mainContent = document.getElementById('main-content');
const btnBack     = document.getElementById('btnBack');

let appReady = false;
let mainContentAssetsReady = false;

/* ── Comment state ── */
let comments = [];
const COMMENTS_PER_PAGE = 7;
const COMMENT_PAGE_SS_KEY = 'wss_cmt_page';
let commentPage = (() => {
  try {
    const raw = Number(sessionStorage.getItem(COMMENT_PAGE_SS_KEY));
    return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1;
  } catch(e) {
    return 1;
  }
})();
let supabase = null;
let supabaseReadyPromise = null;
let supabaseRealtimeChannel = null;
const cmtPager = document.getElementById('cmtPager');
const cmtPrev = document.getElementById('cmtPrev');
const cmtNext = document.getElementById('cmtNext');
const cmtPageInfo = document.getElementById('cmtPageInfo');
const saveCommentPage = () => {
  try { sessionStorage.setItem(COMMENT_PAGE_SS_KEY, String(commentPage)); } catch(e) {}
};

const attachUcapanRealtime = () => {
  if (!supabase || supabaseRealtimeChannel) return;
  supabaseRealtimeChannel = supabase
    .channel('ucapan-realtime')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ucapan' }, (payload) => {
      comments.unshift(payload.new);
      commentPage = 1;
      saveCommentPage();
      renderComments();
    })
    .subscribe();
};

const initSupabase = async () => {
  if (supabase) return true;
  if (supabaseReadyPromise) return supabaseReadyPromise;
  supabaseReadyPromise = (async () => {
    try {
      const mod = await import(SUPABASE_MODULE_URL);
      if (!mod || typeof mod.createClient !== 'function') throw new Error('createClient tidak ditemukan');
      supabase = mod.createClient(SUPABASE_URL, SUPABASE_ANON);
      await loadUcapan();
      attachUcapanRealtime();
      return true;
    } catch (err) {
      supabase = null;
      console.warn('[Supabase] Lazy load gagal:', err?.message || err);
      return false;
    } finally {
      if (!supabase) supabaseReadyPromise = null;
    }
  })();
  return supabaseReadyPromise;
};

async function loadUcapan() {
  if (!supabase) return;
  const { data, error } = await supabase
    .from('ucapan').select('name, text, ts').order('ts', { ascending: false }).limit(200);
  if (error) { console.warn('[Supabase] Gagal memuat ucapan:', error.message); return; }
  comments = data || [];
  renderComments();
}

const ensureMainContentAssets = () => {
  if (mainContentAssetsReady || !mainContent) return;
  mainContent.classList.add('mc-bg-ready');
  mainContentAssetsReady = true;
};

const updateLoaderEnterMidpoint = () => {
  if (!appLoader || !appLoaderBody || !appEnterBtn) return;
  const anchorEl = appLoaderCopy || appLoaderBody;
  const rect = anchorEl.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  if (!vh) return;
  const contentBottom = Math.min(vh, Math.max(0, rect.bottom));
  const midPoint = contentBottom + (vh - contentBottom) * 0.5;
  appLoader.style.setProperty('--ldr-enter-y', `${midPoint.toFixed(1)}px`);
};

const scheduleLoaderEnterMidpoint = () => {
  updateLoaderEnterMidpoint();
  requestAnimationFrame(updateLoaderEnterMidpoint);
};

if (document.documentElement.classList.contains('app-loading')) {
  scheduleLoaderEnterMidpoint();
}
window.addEventListener('resize', () => {
  if (!document.documentElement.classList.contains('app-loading')) return;
  scheduleLoaderEnterMidpoint();
}, { passive: true });
if (document.fonts && document.fonts.ready) {
  document.fonts.ready
    .then(() => {
      if (!document.documentElement.classList.contains('app-loading')) return;
      scheduleLoaderEnterMidpoint();
    })
    .catch(() => {});
}

/* ── Music ── */
let musicEnabled = CONFIG.music.defaultOn;

const setMusicUi = (isOn) => {
  if (!btnMusic) return;
  btnMusic.classList.toggle('is-on', !!isOn);
  btnMusic.setAttribute('aria-pressed', isOn ? 'true' : 'false');
  btnMusic.setAttribute('aria-label', isOn ? 'Matikan musik' : 'Nyalakan musik');
  btnMusic.title = isOn ? 'Matikan musik' : 'Nyalakan musik';
};
const saveMusicPref = () => {
  try { localStorage.setItem(CONFIG.music.storageKey, musicEnabled ? '1' : '0'); } catch(e) {}
};
const loadMusicPref = () => {
  try {
    const raw = localStorage.getItem(CONFIG.music.storageKey);
    if (raw === '1') { musicEnabled = true; return; }
    if (raw === '0') {
      if (CONFIG.music.defaultOn && CONFIG.music.overrideSavedOffWhenDefaultOn) { musicEnabled = true; return; }
      musicEnabled = false;
    }
  } catch(e) {}
};
const prepareAudioElement = () => {
  if (!bgMusic) return;
  const targetSrc = new URL(CONFIG.music.src, window.location.href).href;
  if (bgMusic.currentSrc !== targetSrc && bgMusic.src !== targetSrc) bgMusic.src = CONFIG.music.src;
  bgMusic.volume = Math.min(1, Math.max(0, Number(CONFIG.music.volume) || 0));
};
const playMusic = async () => {
  if (!bgMusic) return false;
  try { await bgMusic.play(); return true; } catch(e) { return false; }
};
const setMusicState = async (nextState, persist = true) => {
  musicEnabled = !!nextState;
  if (persist) saveMusicPref();
  if (!bgMusic) { setMusicUi(false); return; }
  if (!musicEnabled) { bgMusic.pause(); setMusicUi(false); return; }
  const ok = await playMusic();
  setMusicUi(ok);
};
const initMusic = () => {
  if (!bgMusic || !btnMusic) return;
  loadMusicPref();
  prepareAudioElement();
  bgMusic.addEventListener('play',  () => setMusicUi(true));
  bgMusic.addEventListener('pause', () => setMusicUi(false));
  bgMusic.addEventListener('error', () => {
    btnMusic.classList.add('is-error');
    btnMusic.disabled = true;
    btnMusic.setAttribute('aria-disabled', 'true');
    btnMusic.title = 'File musik belum tersedia';
  });
  btnMusic.addEventListener('click', async () => { await setMusicState(bgMusic.paused, true); });

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
  if (musicEnabled && bgMusic.paused) {
    playMusic().then(ok => { if (ok) { setMusicUi(true); removeKick(); } });
  }
};

/* ── Loader ── */
const BOOT_TIMEOUT_MS    = 12000;
const CSS_LINK_SELECTOR  = 'link[rel="stylesheet"][href*="assets/css/styles.css"]';
const URL_RE             = /url\((['"]?)(.*?)\1\)/;

const setLoaderStep = (pct, text) => {
  const safePct = Math.max(0, Math.min(100, pct));
  if (appLoaderBar)  appLoaderBar.style.width = `${safePct}%`;
  if (appLoaderText && text) appLoaderText.textContent = text;
  if (appEnterLabel && appEnterBtn && !appEnterBtn.classList.contains('is-ready'))
    appEnterLabel.textContent = `${Math.round(safePct)}%`;
  scheduleLoaderEnterMidpoint();
};
const withTimeout = (promise, ms = BOOT_TIMEOUT_MS) =>
  Promise.race([promise, new Promise(resolve => setTimeout(resolve, ms))]);

const waitStylesReady = () => {
  const link = document.querySelector(CSS_LINK_SELECTOR);
  if (!link || link.sheet) return Promise.resolve();
  return withTimeout(new Promise(resolve => {
    link.addEventListener('load',  () => resolve(), { once: true });
    link.addEventListener('error', () => resolve(), { once: true });
  }));
};
const waitImageLoaded = (imgEl) => {
  if (!imgEl) return Promise.resolve();
  if (imgEl.complete && imgEl.naturalWidth > 0) return Promise.resolve();
  return withTimeout(new Promise(resolve => {
    imgEl.addEventListener('load',  () => resolve(), { once: true });
    imgEl.addEventListener('error', () => resolve(), { once: true });
  }));
};
const preloadImageSrc = (src) => {
  if (!src) return Promise.resolve();
  return withTimeout(new Promise(resolve => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  }));
};
const preloadImageNaturalSizeToEl = (el, src) => {
  if (!el || !src) return Promise.resolve();
  return withTimeout(new Promise(resolve => {
    const img = new Image();
    img.onload  = () => { el._natW = img.naturalWidth; el._natH = img.naturalHeight; resolve(); };
    img.onerror = resolve;
    img.src = src;
  }));
};
const extractCssUrl = (css) => { const m = String(css || '').match(URL_RE); return m ? m[2] : ''; };
const waitAudioReady = (audioEl) => {
  if (!audioEl) return Promise.resolve();
  prepareAudioElement();
  if (!audioEl.paused || audioEl.readyState >= 3) return Promise.resolve();
  return withTimeout(new Promise(resolve => {
    const done = () => {
      ['canplaythrough','canplay','loadeddata','error'].forEach(ev => audioEl.removeEventListener(ev, done));
      resolve();
    };
    ['canplaythrough','canplay','loadeddata','error'].forEach(ev => audioEl.addEventListener(ev, done, { once: true }));
    try { if (audioEl.networkState === 0) audioEl.load(); } catch(e) { resolve(); }
  }));
};

const waitEssentialAssets = async () => {
  setLoaderStep(16, 'Memuat stylesheet...');
  await waitStylesReady();
  setLoaderStep(56, 'Menyiapkan hero...');
  const heroImgs  = Array.from(document.querySelectorAll('#heroCanvas img'));
  const bgPaperSrc = heroBgPaper ? extractCssUrl(getComputedStyle(heroBgPaper).backgroundImage) : '';
  await Promise.all([
    ...heroImgs.map(waitImageLoaded),
    preloadImageSrc(bgPaperSrc),
    preloadImageNaturalSizeToEl(heroBgPaper, bgPaperSrc),
  ]);
  setLoaderStep(84, 'Menyiapkan musik...');
  await waitAudioReady(bgMusic);
};

const hideLoader = () => {
  if (!appLoader) return;
  appLoader.setAttribute('aria-hidden', 'true');
  setTimeout(() => { if (appLoader && appLoader.parentNode) appLoader.parentNode.removeChild(appLoader); }, 620);
};

const waitForLoaderTap = () => {
  if (!appEnterBtn) return Promise.resolve();
  scheduleLoaderEnterMidpoint();
  return new Promise(resolve => {
    appEnterBtn.disabled = false;
    appEnterBtn.setAttribute('aria-disabled', 'false');
    appEnterBtn.classList.add('is-ready');
    if (appEnterLabel) appEnterLabel.textContent = 'Masuk';
    setLoaderStep(100, 'Siap — sentuh untuk masuk');
    const onTap = async () => {
      appEnterBtn.disabled = true;
      appEnterBtn.setAttribute('aria-disabled', 'true');
      const rect = appEnterBtn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      const maxDx = Math.max(cx, window.innerWidth - cx), maxDy = Math.max(cy, window.innerHeight - cy);
      appEnterBtn.style.setProperty('--ldr-expand-scale', ((Math.hypot(maxDx, maxDy) / (rect.width / 2)) + 1.6).toFixed(2));
      setLoaderStep(100, 'Membuka undangan...');
      if (musicEnabled) { prepareAudioElement(); await setMusicState(true, true); }
      appEnterBtn.classList.add('expand');
      let done = false;
      const finish = () => { if (done) return; done = true; resolve(); };
      appEnterBtn.addEventListener('animationend', finish, { once: true });
      setTimeout(finish, 900);
    };
    appEnterBtn.addEventListener('click', onTap, { once: true });
  });
};

/* ════════════════════════════════════════════════════
   SHARED RENDER UTILS
════════════════════════════════════════════════════ */
const clamp  = (v,a,b) => Math.min(b, Math.max(a, v));
const lerp   = (a,b,t) => a + (b - a) * t;
const norm   = (v,a,b) => clamp((v - a) / (b - a), 0, 1);
const eio    = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
const eout   = t => 1 - Math.pow(1 - t, 3);
const easeFn = { inOut: eio, out: eout, in: t => t*t*t, linear: t => t };

const IS_MOBILE = () => window.innerWidth < CONFIG.viewport.mobileBreakpoint;

/* Resolve desktop/mobile override dari movement object */
const resolveByViewport = (mv) => {
  const base = (mv && typeof mv === 'object') ? mv : {};
  const deviceCfg = IS_MOBILE()
    ? (base.mobile  && typeof base.mobile  === 'object' ? base.mobile  : null)
    : (base.desktop && typeof base.desktop === 'object' ? base.desktop : null);
  return deviceCfg ? { ...base, ...deviceCfg } : base;
};

/* Pilih frame interpolasi dari array movements berdasarkan progress 0→1 */
const pickMovementFrame = (movements, progress) => {
  const mvs = Array.isArray(movements) ? movements : [];
  if (!mvs.length) return null;
  let fromMv = mvs[0], toMv = mvs[0], t = 0;
  if (progress <= mvs[0]._end) {
    fromMv = toMv = mvs[0]; t = 0;
  } else if (progress >= mvs[mvs.length - 1]._end) {
    fromMv = toMv = mvs[mvs.length - 1]; t = 1;
  } else {
    for (let i = 0; i < mvs.length - 1; i++) {
      const a = mvs[i], b = mvs[i + 1];
      if (progress >= a._end && progress <= b._end) {
        fromMv = a; toMv = b;
        t = norm(progress, a._end, b._end);
        const bCfg = resolveByViewport(b);
        t = (easeFn[bCfg.ease] || easeFn.inOut)(t);
        break;
      }
    }
  }
  return { fromCfg: resolveByViewport(fromMv), toCfg: resolveByViewport(toMv), t };
};

/* ── Progress ornament helper ── */
const progressFill = progressOrn ? progressOrn.querySelector('.porn-fill') : null;
const progressPct  = progressOrn ? progressOrn.querySelector('.porn-pct')  : null;
let _lastProgressPct = -1;
let _progressHideTimer = null;

const _showProgress = () => {
  if (!progressOrn) return;
  progressOrn.classList.add('show');
  /* Auto-hide setelah 1.5s tidak ada aktivitas scroll */
  clearTimeout(_progressHideTimer);
  _progressHideTimer = setTimeout(() => {
    progressOrn.classList.remove('show');
  }, 1000);
};

const setProgress = (pct) => {
  if (!progressOrn) return;
  const p = Math.max(0, Math.min(100, pct));
  if (Math.abs(p - _lastProgressPct) < 0.05) return;
  _lastProgressPct = p;
  if (progressFill) progressFill.style.width = p.toFixed(2) + '%';
  if (progressPct)  progressPct.textContent  = Math.round(p) + '%';
  /* Tidak auto-show di sini — hanya update nilai */
};

/* applyBg: zoom+pan bg guaranteed cover + safe clamp (no edge leak) */
const BG_OVERSCAN_PX = 2;
const clampBgPercent = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return 50;
  return clamp(n, 0, 100);
};
const getBgBoxSize = (el) => {
  const rect = el.getBoundingClientRect();
  const vw = Math.max(1, Number(rect.width) || window.innerWidth || 1);
  const vh = Math.max(1, Number(rect.height) || window.innerHeight || 1);
  return { vw, vh };
};
const applyBg = (el, bgX, bgY, bgZoom) => {
  const { vw, vh } = getBgBoxSize(el);
  const iw = Math.max(1, Number(el._natW) || 1600);
  const ih = Math.max(1, Number(el._natH) || 900);
  const zoom = Math.max(0.001, Number(bgZoom) || 1);
  const coverScale = Math.max(vw / iw, vh / ih);

  const targetW = Math.max(vw + BG_OVERSCAN_PX, Math.ceil((iw * coverScale * zoom) + BG_OVERSCAN_PX));
  const targetH = Math.max(vh + BG_OVERSCAN_PX, Math.ceil((ih * coverScale * zoom) + BG_OVERSCAN_PX));
  const sizeStr = `${targetW}px ${targetH}px`;
  const posStr  = `${clampBgPercent(bgX).toFixed(2)}% ${clampBgPercent(bgY).toFixed(2)}%`;
  if (el._bgSize === sizeStr && el._bgPos === posStr) return;
  el._bgSize = sizeStr;
  el._bgPos  = posStr;

  /* Pakai gsap.set jika tersedia — batching style write, no forced reflow.
     GSAP tidak support backgroundSize/Position shorthand langsung,
     jadi kita tetap tulis manual tapi dibungkus dalam requestAnimationFrame
     satu batch via gsap.set dengan cssVars trick, atau fallback langsung. */
  gs(el, { backgroundSize: sizeStr, backgroundPosition: posStr });
};

/* ════════════════════════════════════════════════════
   BUILD RANGES — pre-compute _start/_end dari scroll
   Dipakai oleh HERO_SCENE dan JOURNEY
════════════════════════════════════════════════════ */
const DEFAULT_SCROLL_PER_DURATION = 280;
const getMovementScrollDistance = (m) => {
  const explicit = Number(m?.scroll);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  return DEFAULT_SCROLL_PER_DURATION;
};

const buildRangesForScene = (scene) => {
  const allMvs = scene.chapters.flatMap(c => c.movements);
  const totalScroll = allMvs.reduce((s, m) => s + getMovementScrollDistance(m), 0) || 1;
  scene._scrollTotal = totalScroll;
  let cursor = 0;
  scene.chapters.forEach(ch => {
    ch.movements.forEach(m => {
      const moveScroll = getMovementScrollDistance(m);
      m._start = cursor / totalScroll;
      m._end   = (cursor + moveScroll) / totalScroll;
      cursor += moveScroll;
    });
    ch._start = ch.movements[0]._start;
    ch._end   = ch.movements[ch.movements.length - 1]._end;
  });
};
buildRangesForScene(HERO_SCENE);
buildRangesForScene(JOURNEY);

/* ════════════════════════════════════════════════════
   DIALOG POSITIONING — shared antara Hero dan Journey
   getBoundingClientRect() hanya dipanggil sekali per
   kombinasi (dialog + viewport size), lalu di-cache.
   Render loop tidak pernah trigger forced reflow.
════════════════════════════════════════════════════ */
const getDialogInsetPx = () => clamp(window.innerWidth * 0.04, 16, 32);

/* Cache box size per elemen — diisi sekali, invalidate saat resize */
const _dlgSizeCache = new WeakMap();
let   _dlgSizeVw = 0, _dlgSizeVh = 0;

window.addEventListener('resize', () => {
  /* Kosongkan cache saat viewport berubah — WeakMap tidak bisa di-clear
     sekaligus, jadi kita track generasi dengan counter vw/vh */
  _dlgSizeVw = window.innerWidth;
  _dlgSizeVh = window.innerHeight;
}, { passive: true });

const _getDialogBoxSize = (el, widthVal, vw, vh, textKey) => {
  /* Cache key: width + viewport + konten teks.
     Teks berbeda = tinggi box berbeda = harus cache terpisah. */
  const cacheKey = `${widthVal}|${vw}|${vh}|${textKey}`;
  const cached = _dlgSizeCache.get(el);
  if (cached && cached.key === cacheKey) return cached;

  /* Satu-satunya tempat getBoundingClientRect dipanggil —
     hanya saat cache miss (dialog baru / viewport resize) */
  const prevDisplay    = el.style.display;
  const prevVisibility = el.style.visibility;
  const wasHidden = getComputedStyle(el).display === 'none';
  if (wasHidden) { el.style.display = ''; el.style.visibility = 'hidden'; }
  gs(el, { width: widthVal || '', transform: 'none', top: 'auto', left: 'auto', right: 'auto', bottom: 'auto' });
  const rect = el.getBoundingClientRect();
  if (wasHidden) { el.style.display = prevDisplay; }
  el.style.visibility = prevVisibility || '';

  const result = {
    key: cacheKey,
    w: rect.width  || (vw * 0.8),
    h: rect.height || (vh * 0.16),
  };
  _dlgSizeCache.set(el, result);
  return result;
};

const applyDialogPos = (el, dialogCfg) => {
  const baseCfg   = (dialogCfg && typeof dialogCfg === 'object') ? dialogCfg : {};
  const deviceCfg = IS_MOBILE()
    ? (baseCfg.mobile  && typeof baseCfg.mobile  === 'object' ? baseCfg.mobile  : null)
    : (baseCfg.desktop && typeof baseCfg.desktop === 'object' ? baseCfg.desktop : null);
  const cfg      = deviceCfg ? { ...baseCfg, ...deviceCfg } : baseCfg;
  const widthVal = (cfg.width !== undefined && cfg.width !== null && cfg.width !== '')
    ? (typeof cfg.width === 'number' ? `${cfg.width}px` : String(cfg.width))
    : '';

  const x      = clamp(Number.isFinite(cfg.x) ? cfg.x : 50, 0, 100);
  const y      = clamp(Number.isFinite(cfg.y) ? cfg.y : 50, 0, 100);
  const anchor = String(cfg.anchor || 'center').toLowerCase();
  const vw     = window.innerWidth, vh = window.innerHeight;
  const inset  = getDialogInsetPx();
  const posKey  = `${vw}|${vh}|${x.toFixed(2)}|${y.toFixed(2)}|${anchor}|${widthVal}|${baseCfg.text||''}|${baseCfg.date||''}`;
  if (el._dlgPosKey === posKey) return;
  el._dlgPosKey = posKey;

  /* textKey untuk cache ukuran box — teks berbeda = tinggi berbeda */
  const textKey = `${baseCfg.text||''}|${baseCfg.date||''}`;
  const { w: boxW, h: boxH } = _getDialogBoxSize(el, widthVal, vw, vh, textKey);

  let left = (x / 100) * vw, top = (y / 100) * vh;
  switch (anchor) {
    case 'top-center': case 'top':         left -= boxW / 2; break;
    case 'top-right':                       left -= boxW; break;
    case 'bottom-left':                     top  -= boxH; break;
    case 'bottom-center': case 'bottom':    left -= boxW / 2; top -= boxH; break;
    case 'bottom-right':                    left -= boxW; top -= boxH; break;
    case 'center':                          left -= boxW / 2; top -= boxH / 2; break;
    case 'top-left': default: break;
  }

  gs(el, {
    left:      `${clamp(left, inset, Math.max(inset, vw - boxW - inset)).toFixed(1)}px`,
    top:       `${clamp(top,  inset, Math.max(inset, vh - boxH - inset)).toFixed(1)}px`,
    right:     'auto',
    bottom:    'auto',
    width:     widthVal,
    transform: 'none',
  });
};

/* Foreground placement helper (shared by Hero + Journey)
   Single system:
   - fgX/fgY in 0..100  : absolute position (% viewport)
   - fgX/fgY outside    : treated as pixel offset from default anchor
   - fgXOrigin/fgYOrigin: element origin (0..1)
   - fgRotate           : rotation in degrees
*/
const getLayerRaw = (cfg, layerId, suffix) => {
  const key = layerId ? `fg${layerId}${suffix}` : `fg${suffix}`;
  if (cfg[key] !== undefined) return cfg[key];
  if (layerId) {
    const fallbackKey = `fg${suffix}`;
    if (cfg[fallbackKey] !== undefined) return cfg[fallbackKey];
  }
  return undefined;
};
const getLayerNum = (cfg, layerId, suffix, def) => {
  const raw = getLayerRaw(cfg, layerId, suffix);
  const n = Number(raw);
  return Number.isFinite(n) ? n : def;
};
const applyPlacedFg = (el, fromCfg, toCfg, t, layerId = '', defaults = null) => {
  if (!el) return;
  const d = defaults || {};
  const sc = lerp(getLayerNum(fromCfg, layerId, 'Scale', 1), getLayerNum(toCfg, layerId, 'Scale', 1), t);
  const rot = lerp(getLayerNum(fromCfg, layerId, 'Rotate', 0), getLayerNum(toCfg, layerId, 'Rotate', 0), t);
  const op = lerp(getLayerNum(fromCfg, layerId, 'Opacity', 1), getLayerNum(toCfg, layerId, 'Opacity', 1), t);
  const readXY = (cfg) => ({
    x: Number(getLayerRaw(cfg, layerId, 'X')),
    y: Number(getLayerRaw(cfg, layerId, 'Y')),
  });
  const inPctRange = (v) => Number.isFinite(v) && v >= 0 && v <= 100;
  const fromXY = readXY(fromCfg);
  const toXY   = readXY(toCfg);
  const fromAbs = inPctRange(fromXY.x) && inPctRange(fromXY.y);
  const toAbs   = inPctRange(toXY.x)  && inPctRange(toXY.y);
  const useAbs  = t >= 0.5 ? toAbs : fromAbs;

  let xPct, yPct, pxX, pxY, xOrigin, yOrigin;

  if (useAbs) {
    const absFromX = Number.isFinite(fromXY.x) ? fromXY.x : (Number.isFinite(d.xPct) ? d.xPct : 50);
    const absToX   = Number.isFinite(toXY.x)   ? toXY.x   : (Number.isFinite(d.xPct) ? d.xPct : 50);
    const absFromY = Number.isFinite(fromXY.y)  ? fromXY.y : (Number.isFinite(d.yPct) ? d.yPct : 50);
    const absToY   = Number.isFinite(toXY.y)    ? toXY.y   : (Number.isFinite(d.yPct) ? d.yPct : 50);
    xPct = lerp(absFromX, absToX, t);
    yPct = lerp(absFromY, absToY, t);
    pxX  = 0; pxY = 0;
    const xOriginDef = Number.isFinite(d.xOrigin) ? d.xOrigin : 0.5;
    const yOriginDef = Number.isFinite(d.yOrigin) ? d.yOrigin : 0.5;
    xOrigin = clamp(lerp(getLayerNum(fromCfg, layerId, 'XOrigin', xOriginDef), getLayerNum(toCfg, layerId, 'XOrigin', xOriginDef), t), 0, 1);
    yOrigin = clamp(lerp(getLayerNum(fromCfg, layerId, 'YOrigin', yOriginDef), getLayerNum(toCfg, layerId, 'YOrigin', yOriginDef), t), 0, 1);
  } else {
    xPct = Number.isFinite(d.xPct) ? d.xPct : 50;
    yPct = Number.isFinite(d.yPct) ? d.yPct : 50;
    pxX  = lerp(getLayerNum(fromCfg, layerId, 'X', 0), getLayerNum(toCfg, layerId, 'X', 0), t);
    pxY  = lerp(getLayerNum(fromCfg, layerId, 'Y', 0), getLayerNum(toCfg, layerId, 'Y', 0), t);
    xOrigin = clamp(Number.isFinite(d.xOrigin) ? d.xOrigin : 0.5, 0, 1);
    yOrigin = clamp(Number.isFinite(d.yOrigin) ? d.yOrigin : 0.5, 0, 1);
  }

  const leftPct   = clamp(xPct, 0, 100);
  const topPct    = clamp(yPct, 0, 100);
  const transformStr = `translate(${-xOrigin * 100}%,${-yOrigin * 100}%) translate(${pxX.toFixed(1)}px,${pxY.toFixed(1)}px) rotate(${rot.toFixed(3)}deg) scale(${sc.toFixed(4)})`;
  const originStr    = `${(xOrigin * 100).toFixed(2)}% ${(yOrigin * 100).toFixed(2)}%`;

  gs(el, {
    opacity:         op,
    left:            `${leftPct.toFixed(2)}%`,
    top:             `${topPct.toFixed(2)}%`,
    right:           'auto',
    bottom:          'auto',
    transformOrigin: originStr,
    transform:       transformStr,
  });
};

/* ════════════════════════════════════════════════════
   HERO RENDER
   ────────────────────────────────────────────────────
   fg/fg2/fg3/fg4/fg5:
   single placement system (X/Y + XOrigin/YOrigin)
   dialog (#hDialog) : class = 'jdialog ' + style
════════════════════════════════════════════════════ */
const renderHeroScene = (hp) => {
  const p = clamp(hp, 0, 1);
  setProgress(hp * 100);
  gs(scrollHint, { opacity: clamp(1 - hp * 8, 0, .9) });

  const ch    = HERO_SCENE.chapters[0];
  const frame = pickMovementFrame(ch.movements, p);
  if (!frame) return;
  const { fromCfg, toCfg, t } = frame;

  if (heroBgPaper) applyBg(heroBgPaper,
    lerp(fromCfg.bgX    ?? 50, toCfg.bgX    ?? 50, t),
    lerp(fromCfg.bgY    ?? 50, toCfg.bgY    ?? 50, t),
    lerp(fromCfg.bgZoom ?? 1,  toCfg.bgZoom ?? 1,  t)
  );

  const hasFgReveal = Number.isFinite(toCfg.fgRevealStart);
  const tFg = hasFgReveal ? eout(norm(t, clamp(toCfg.fgRevealStart, 0, 0.999), 1)) : t;

  applyPlacedFg(heroBirdsEl,  fromCfg, toCfg, tFg, '',  FG_DEFAULTS.hero.fg);
  applyPlacedFg(heroFlowerTL, fromCfg, toCfg, tFg, '2', FG_DEFAULTS.hero.fg2);
  applyPlacedFg(heroFlowerTR, fromCfg, toCfg, tFg, '3', FG_DEFAULTS.hero.fg3);
  applyPlacedFg(heroFlowerBL, fromCfg, toCfg, tFg, '4', FG_DEFAULTS.hero.fg4);
  applyPlacedFg(heroFlowerBR, fromCfg, toCfg, tFg, '5', FG_DEFAULTS.hero.fg5);

  if (heroDialogEl) {
    const activeDialog = t >= 0.5 ? toCfg.dialog : fromCfg.dialog;
    if (activeDialog) {
      const nextClass = 'jdialog ' + (activeDialog.style || '');
      if (heroDialogEl.className !== nextClass) heroDialogEl.className = nextClass;
      gs(heroDialogEl, {
        left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 1,
      });
      heroDialogEl.style.display = '';
    } else {
      heroDialogEl.style.display = 'none';
    }
  }
};

/* ════════════════════════════════════════════════════
   JOURNEY RENDER
════════════════════════════════════════════════════ */
const journeyCanvas = document.getElementById('journeyCanvas');
const jHint         = document.getElementById('jHint');
const jDots         = document.getElementById('jDots');
const jDotEls       = Array.from(jDots.querySelectorAll('.jdot'));
const jChapters = JOURNEY.chapters.map((_, i) => ({
  el:  document.getElementById(`jch${i+1}`),
  bg:  document.getElementById(`jch${i+1}bg`),
  fg:  document.getElementById(`jch${i+1}fg`),
  fg2: document.getElementById(`jch${i+1}fg2`),
  dlg: document.getElementById(`jch${i+1}dlg`),
}));

/* Lazy load journey images */
const _imgCache = {};
const _bgUrlRe  = /url\(['"]?([^'"]+)['"]?\)/;
const _getBgSrc = (bgEl) => { const m = (bgEl.style.backgroundImage || '').match(_bgUrlRe); return m ? m[1] : ''; };
const _cacheBgNaturalSize = (bgEl, src) => {
  if (!src) return;
  if (_imgCache[src]) { bgEl._natW = _imgCache[src].w; bgEl._natH = _imgCache[src].h; return; }
  const img = new Image();
  img.onload = () => { _imgCache[src] = { w: img.naturalWidth, h: img.naturalHeight }; bgEl._natW = img.naturalWidth; bgEl._natH = img.naturalHeight; };
  img.src = src;
};
const ensureBgLoaded = (idx) => {
  const jc = jChapters[idx]; if (!jc || !jc.bg) return;
  const bg = jc.bg, dataSrc = bg.getAttribute('data-bg');
  if (dataSrc && !bg.style.backgroundImage) bg.style.backgroundImage = `url('${dataSrc}')`;
  const src = _getBgSrc(bg); if (!src || bg.dataset.loaded === '1') return;
  bg.dataset.loaded = '1'; _cacheBgNaturalSize(bg, src);
};
const ensureFgElLoaded = (fg) => {
  if (!fg || fg.dataset.loaded === '1') return;
  const dataSrc = fg.getAttribute('data-src') || '';
  const curSrc  = fg.getAttribute('src') || '';
  if (!dataSrc && !curSrc) { fg.dataset.loaded = '1'; return; }
  if (dataSrc && curSrc !== dataSrc) fg.setAttribute('src', dataSrc);
  else if (!curSrc) fg.setAttribute('src', dataSrc || curSrc);
  fg.dataset.loaded = '1';
};
const ensureFgLoaded   = (idx) => { const jc = jChapters[idx]; if (!jc) return; ensureFgElLoaded(jc.fg); ensureFgElLoaded(jc.fg2); };
const primeJourneyImages = (idx) => { ensureBgLoaded(idx); ensureBgLoaded(idx+1); ensureFgLoaded(idx); ensureFgLoaded(idx+1); };

setTimeout(() => { jChapters.forEach(jc => { const src = _getBgSrc(jc.bg); if (src) _cacheBgNaturalSize(jc.bg, src); }); }, 0);
ensureBgLoaded(0); ensureFgLoaded(0);

const renderJourney = (jp) => {
  const C = JOURNEY.chapters;
  setProgress(jp * 100);
  jHint.classList.toggle('show', jp < 0.04);
  fadeToggle(btnContinue, jp >= .97);
  jDots.classList.toggle('show', jp < 0.97);

  let activeChIdx = 0;
  C.forEach((ch, i) => { if (jp >= ch._start) activeChIdx = i; });
  primeJourneyImages(activeChIdx);
  jDotEls.forEach((d, i) => d.classList.toggle('active', i === activeChIdx));

  C.forEach((ch, ci) => {
    const jc = jChapters[ci];
    const FADE = 0.015;
    const chOp = ch._start === 0
      ? (jp < ch._end - FADE ? 1 : 1 - norm(jp, ch._end - FADE, ch._end + FADE))
      : jp < ch._start + FADE
        ? norm(jp, ch._start - FADE, ch._start + FADE)
        : jp < ch._end - FADE ? 1
        : 1 - norm(jp, ch._end - FADE, ch._end + FADE);

    const visible = chOp >= 0.02;

    /* Chapter opacity — direct style, bukan GSAP */
    jc.el.style.opacity = clamp(chOp, 0, 1).toFixed(4);

    /* Dynamic will-change — alokasi GPU layer hanya saat chapter visible */
    const wcVal = visible ? 'opacity' : 'auto';
    if (jc.el.style.willChange  !== wcVal) jc.el.style.willChange  = wcVal;
    if (jc.bg)  { const v = visible ? 'background-size, background-position' : 'auto'; if (jc.bg.style.willChange  !== v) jc.bg.style.willChange  = v; }
    if (jc.fg)  { const v = visible ? 'transform, opacity' : 'auto'; if (jc.fg.style.willChange  !== v) jc.fg.style.willChange  = v; }
    if (jc.fg2) { const v = visible ? 'transform, opacity' : 'auto'; if (jc.fg2.style.willChange !== v) jc.fg2.style.willChange = v; }

    /* Skip full render kalau chapter hampir tidak terlihat */
    if (!visible) return;

    const frame = pickMovementFrame(ch.movements, jp);
    if (!frame) return;
    const { fromCfg, toCfg, t } = frame;

    const hasFgReveal = Number.isFinite(toCfg.fgRevealStart);
    const tFg = hasFgReveal
      ? eout(norm(t, clamp(toCfg.fgRevealStart, 0, 0.999), 1))
      : (toCfg.fgCutIn ? (t >= 0.999 ? 1 : 0) : t);

    applyBg(jc.bg,
      lerp(fromCfg.bgX    ?? 50, toCfg.bgX    ?? 50, t),
      lerp(fromCfg.bgY    ?? 50, toCfg.bgY    ?? 50, t),
      lerp(fromCfg.bgZoom ?? 1,  toCfg.bgZoom ?? 1,  t)
    );

    applyPlacedFg(jc.fg,  fromCfg, toCfg, tFg, '',  FG_DEFAULTS.journey.fg);
    applyPlacedFg(jc.fg2, fromCfg, toCfg, tFg, '2', FG_DEFAULTS.journey.fg2);

    const activeDialog = t >= 0.5 ? toCfg.dialog : fromCfg.dialog;
    if (activeDialog) {
      jc.dlg.querySelector('.jdialog-text').innerHTML = (activeDialog.text || '').replace(/\n/g, '<br>');
      const dateEl = jc.dlg.querySelector('.jdialog-date');
      if (dateEl) { dateEl.textContent = activeDialog.date || ''; dateEl.style.display = activeDialog.date ? '' : 'none'; }
      applyDialogPos(jc.dlg, activeDialog);
      jc.dlg.style.opacity = '1';
      jc.dlg.style.display = '';
    } else {
      jc.dlg.style.display = 'none';
    }
  });
};

/* ════════════════════════════════════════════════════
   SCROLL ENGINE — Lenis sebagai input normalizer
   ────────────────────────────────────────────────────
   Lenis normalize delta dari wheel dan touchmove
   lintas device sebelum masuk ke addDelta().
   Kalau Lenis gagal load, fallback ke handler manual.

   TUNING (sesuaikan setelah test di device):
   wheelMultiplier : kecepatan wheel mouse
   touchMultiplier : kecepatan swipe jari
   lerp            : smoothness input (0=instant, 1=tidak pernah sampai)
   syncTouch       : momentum touch ala iOS native
════════════════════════════════════════════════════ */
const HERO_TOTAL    = Math.max(1, HERO_SCENE._scrollTotal || 1);
const JOURNEY_TOTAL = Math.max(1, JOURNEY._scrollTotal || 1);

/* Konstanta fallback — dipakai hanya kalau Lenis gagal load */
const FALLBACK_WHEEL_MULT  = CONFIG.fallback.wheelMult;
const FALLBACK_TOUCH_MULT  = CONFIG.fallback.touchMult;
const FALLBACK_TOUCH_LIMIT = IS_MOBILE() ? CONFIG.fallback.touchLimitMobile  : CONFIG.fallback.touchLimitDesktop;
const FALLBACK_DEADZONE    = IS_MOBILE() ? CONFIG.fallback.deadzoneMobile    : CONFIG.fallback.deadzoneDesktop;

const _SS_KEY = 'wss_sh26';
const _savedState = (() => { try { return JSON.parse(sessionStorage.getItem(_SS_KEY)) || {}; } catch(e) { return {}; } })();
if (!_savedState.inviteOpen) document.documentElement.classList.remove('invite-open-boot');
if (!(Number(_savedState.jAccum || 0) > 0 || Number(_savedState.zone || 0) === 1))
  document.documentElement.classList.remove('journey-open-boot');

let heroAccum  = clamp(_savedState.heroAccum || 0, 0, HERO_TOTAL);
let jAccum     = clamp(_savedState.jAccum    || 0, 0, JOURNEY_TOTAL);
let rafId      = 0;
let heroTarget = heroAccum / HERO_TOTAL,  heroCur = heroTarget;
let jTarget    = jAccum    / JOURNEY_TOTAL, jCur  = jTarget;
let zone       = _savedState.zone || 0;
let _hasOpenedInvite = !!_savedState.hasOpened;

const buildSessionState = (overrides = {}) => ({
  heroAccum, jAccum, zone,
  hasOpened: _hasOpenedInvite,
  inviteOpen: mainContent.classList.contains('show'),
  ...overrides,
});
const persistSessionState = (overrides = {}) => {
  try { sessionStorage.setItem(_SS_KEY, JSON.stringify(buildSessionState(overrides))); } catch(e) {}
};
let _saveTimer = null;
const saveState = () => { clearTimeout(_saveTimer); _saveTimer = setTimeout(() => persistSessionState(), 300); };

const addDelta = (d) => {
  if (!appReady) return;
  _showProgress();
  if (zone === 0) {
    heroAccum  = clamp(heroAccum + d, 0, HERO_TOTAL);
    heroTarget = heroAccum / HERO_TOTAL;
    if (heroAccum >= HERO_TOTAL && d > 0) zone = 1;
    kickRaf();
  } else {
    jAccum  = clamp(jAccum + d, 0, JOURNEY_TOTAL);
    jTarget = jAccum / JOURNEY_TOTAL;
    if (jAccum <= 0 && d < 0) zone = 0;
    kickRaf();
  }
  saveState();
};

/* ── Lenis instance ── */
let _lenis = null;

const initLenis = () => {
  if (!Lenis) return; /* fallback handler aktif */
  try {
    _lenis = new Lenis({
      /* Lenis hanya sebagai normalizer — tidak ada wrapper/content.
         Dia listen wheel dan touch di window, normalize delta-nya,
         lalu kita ambil via virtual-scroll event. */
      eventsTarget:    window,
      smoothWheel:     true,
      syncTouch:       true,
      syncTouchLerp:   CONFIG.lenis.syncTouchLerp,
      wheelMultiplier: CONFIG.lenis.wheelMultiplier,
      touchMultiplier: CONFIG.lenis.touchMultiplier,
      virtualScroll: (e) => {
        if (mainContent.classList.contains('show')) return false;
        return true;
      },
    });

    /* Ambil delta yang sudah dinormalisasi dari Lenis */
    _lenis.on('virtual-scroll', ({ deltaY }) => {
      if (!appReady) return;
      if (mainContent.classList.contains('show')) return;
      const deltaLimit = IS_MOBILE() ? 90 : 160;
      const d = clamp(deltaY, -deltaLimit, deltaLimit);
      addDelta(d);
    });

    /* Integrasikan Lenis ke dalam loop yang sudah ada.
       Lenis.raf(time) harus dipanggil setiap frame dengan timestamp ms. */
    if (_tempusUnsub) {
      /* Tempus aktif — tambah Lenis.raf ke subscription terpisah
         dengan priority lebih rendah (1) dari ticker animasi (0) */
      Tempus.add((time) => { if (_lenis) _lenis.raf(time); }, 1);
    } else {
      /* RAF fallback — buat loop manual untuk Lenis */
      const lenisRafLoop = (time) => {
        if (_lenis) { _lenis.raf(time); requestAnimationFrame(lenisRafLoop); }
      };
      requestAnimationFrame(lenisRafLoop);
    }
  } catch(e) {
    _lenis = null; /* gagal → fallback handler aktif */
  }
};

const resetInputMomentum = () => {
  if (_lenis) {
    /* Stop momentum Lenis */
    try { _lenis.stop(); _lenis.start(); } catch(e) {}
  }
};

/* ── Keyboard navigation — tetap pakai addDelta langsung ── */
const isTypingElement = (el) => el && (el.isContentEditable || ['INPUT','TEXTAREA','SELECT'].includes(el.tagName));
window.addEventListener('keydown', e => {
  if (!appReady || mainContent.classList.contains('show')) return;
  if (isTypingElement(e.target) || isTypingElement(document.activeElement)) return;
  const d = { ArrowDown:60, ArrowUp:-60, PageDown:300, PageUp:-300, ' ':150, Space:150, Spacebar:150 }[e.key];
  if (d === undefined) return;
  e.preventDefault(); addDelta(d);
});

/* ── Fallback handler — aktif hanya kalau Lenis gagal load ── */
const _initFallbackHandlers = () => {
  if (_lenis) return; /* Lenis aktif, tidak perlu fallback */

  window.addEventListener('wheel', e => {
    if (!appReady || mainContent.classList.contains('show')) return;
    e.preventDefault();
    const abs = Math.abs(e.deltaY);
    addDelta(abs < 50 ? e.deltaY * FALLBACK_WHEEL_MULT : e.deltaY * (FALLBACK_WHEEL_MULT * 0.22));
  }, { passive: false });

  let _touchY = null, _touchActive = false;
  let _pendingDelta = 0, _touchRafId = 0;

  const _flushDelta = () => {
    _touchRafId = 0;
    if (_pendingDelta === 0) return;
    const d = clamp(_pendingDelta, -FALLBACK_TOUCH_LIMIT, FALLBACK_TOUCH_LIMIT);
    _pendingDelta -= d;
    addDelta(d);
    if (_pendingDelta !== 0) _touchRafId = requestAnimationFrame(_flushDelta);
  };

  window.addEventListener('touchstart', e => {
    if (mainContent.classList.contains('show')) { _pendingDelta = 0; return; }
    _touchY = e.touches[0].clientY; _touchActive = true;
  }, { passive: true });

  window.addEventListener('touchmove', e => {
    if (!appReady || !_touchActive || _touchY === null) return;
    if (mainContent.classList.contains('show')) return;
    e.preventDefault();
    const dy = _touchY - e.touches[0].clientY;
    _touchY = e.touches[0].clientY;
    if (Math.abs(dy) < FALLBACK_DEADZONE) return;
    _pendingDelta += dy * FALLBACK_TOUCH_MULT;
    if (!_touchRafId) _touchRafId = requestAnimationFrame(_flushDelta);
  }, { passive: false });

  window.addEventListener('touchend',    () => { _pendingDelta = 0; _touchY = null; _touchActive = false; });
  window.addEventListener('touchcancel', () => { _pendingDelta = 0; _touchY = null; _touchActive = false; });
};

/* ── fadeToggle — fade in/out dengan display:none setelah transisi selesai ──
   Mengurangi GPU composite layer: elemen yang tidak visible benar-benar
   tidak ada di render tree, bukan sekedar opacity:0.
*/
const _fadeListeners = new WeakMap();
const fadeToggle = (el, show) => {
  if (!el) return;
  const isShown = el.classList.contains('show');
  if (show === isShown && el.style.display !== 'none') return;

  /* Bersihkan listener lama kalau ada */
  const prev = _fadeListeners.get(el);
  if (prev) { el.removeEventListener('transitionend', prev); _fadeListeners.delete(el); }

  if (show) {
    el.style.display = '';
    /* setTimeout(0) — satu tick cukup untuk browser register display:''
       sebelum class ditambah, tanpa nested RAF di render loop */
    setTimeout(() => { el.classList.add('show'); }, 0);
  } else {
    el.classList.remove('show');
    const onEnd = (e) => {
      if (e.propertyName !== 'opacity') return;
      el.style.display = 'none';
      el.removeEventListener('transitionend', onEnd);
      _fadeListeners.delete(el);
    };
    el.addEventListener('transitionend', onEnd);
    _fadeListeners.set(el, onEnd);
  }
};

/* Master render */
const heroCanvas = document.getElementById('heroCanvas');
const jTitleEl   = document.getElementById('jTitle');
const render = () => {
  const inJourney  = zone === 1 || jCur > 0.008;
  const inviteOpen = mainContent.classList.contains('show');
  const goingBack = jTarget < jCur || (zone === 0 && jCur > 0);
  const fadeBackMul = IS_MOBILE() ? 36 : 42;
  const fadeFwdMul = IS_MOBILE() ? 38 : 20;
  const fade = clamp(jCur * (goingBack ? fadeBackMul : fadeFwdMul), 0, 1);
  const heroOpacity = clamp(1 - fade, 0, 1);

  /* Opsi 2: display:none setelah fade-out selesai.
     btnContinue dikontrol oleh renderJourney(), tidak di sini. */
  fadeToggle(btnTop,  inJourney && !inviteOpen);
  fadeToggle(btnDown, inJourney && !inviteOpen);

  if (jTitleEl) {
    gs(jTitleEl, { opacity: (inJourney && !inviteOpen) ? 1 : 0 });
  }

  if (!inJourney || heroOpacity > 0.004) {
    renderHeroScene(heroCur);
  }

  /* Dynamic will-change untuk hero — aktif hanya saat hero terlihat */
  const heroVisible = heroOpacity > 0.02;
  const heroWc = heroVisible ? 'transform, opacity' : 'auto';
  const heroBgWc = heroVisible ? 'background-size, background-position' : 'auto';
  if (heroBgPaper  && heroBgPaper.style.willChange  !== heroBgWc) heroBgPaper.style.willChange  = heroBgWc;
  if (heroBirdsEl  && heroBirdsEl.style.willChange  !== heroWc)   heroBirdsEl.style.willChange  = heroWc;
  if (heroFlowerTL && heroFlowerTL.style.willChange !== heroWc)   heroFlowerTL.style.willChange = heroWc;
  if (heroFlowerTR && heroFlowerTR.style.willChange !== heroWc)   heroFlowerTR.style.willChange = heroWc;
  if (heroFlowerBL && heroFlowerBL.style.willChange !== heroWc)   heroFlowerBL.style.willChange = heroWc;
  if (heroFlowerBR && heroFlowerBR.style.willChange !== heroWc)   heroFlowerBR.style.willChange = heroWc;

  /* Canvas opacity — direct style, bukan GSAP */
  heroCanvas.style.opacity    = heroOpacity.toFixed(4);
  journeyCanvas.style.opacity = fade.toFixed(4);
  journeyCanvas.classList.toggle('active', inJourney);

  scrollHint.style.display = inJourney ? 'none' : '';

  if (inJourney) renderJourney(jCur);
  else setProgress(heroCur * 100);
};

/* smooth di-cache, update hanya saat resize */
let _smoothVal = CONFIG.animation.smoothDesktop;
const updateSmooth = () => {
  _smoothVal = IS_MOBILE() ? CONFIG.animation.smoothMobile : CONFIG.animation.smoothDesktop;
};
updateSmooth();
window.addEventListener('resize', updateSmooth, { passive: true });

/* ── Tempus-aware tick ──
   Kalau Tempus berhasil load, delta (ms sejak frame terakhir) dipakai
   untuk frame-rate-independent lerp sehingga animasi tidak "nyangkut lalu
   loncat" saat frame drop di mobile.
   Fallback ke RAF biasa kalau Tempus gagal load.

   IDLE STOP: ticker berhenti sepenuhnya saat animasi selesai (done),
   dan hanya restart saat ada input scroll baru via kickRaf/kickTempus.
   Ini mencegah GSAP terus melakukan internal bookkeeping saat tidak ada
   perubahan — salah satu penyebab memory leak ringan setelah ~1 menit.
*/
const LERP_BASE_MS = 1000 / 60;
let _tickerActive  = false;
let _tempusUnsub   = null; /* return value dari Tempus.add() — fungsi unsubscribe */

const _stopTicker = () => {
  _tickerActive = false;
  if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  /* Subscription Tempus tetap hidup — hanya gate yang ditutup */
};

const tickFn = (delta) => {
  const dt  = (delta && delta > 0 && delta < 200) ? delta : LERP_BASE_MS;
  const mul = dt / LERP_BASE_MS;
  const s   = Math.min(_smoothVal * mul, 0.95);

  heroCur += (heroTarget - heroCur) * s;
  jCur    += (jTarget    - jCur)    * s;
  render();

  const done = Math.abs(heroTarget - heroCur) < .0004 && Math.abs(jTarget - jCur) < .0004;
  if (done) {
    heroCur = heroTarget; jCur = jTarget;
    render();
    _tickerActive = false; /* tutup gate, subscription tetap hidup */
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  }
};

/* RAF fallback — dipakai kalau Tempus tidak berhasil load */
const tick = () => {
  if (!_tickerActive) { rafId = 0; return; }
  tickFn(LERP_BASE_MS);
  if (_tickerActive) rafId = requestAnimationFrame(tick);
};

const kickRaf = () => {
  _tickerActive = true;
  if (_tempusUnsub) return; /* Tempus aktif, cukup buka gate */
  if (!rafId) rafId = requestAnimationFrame(tick); /* RAF fallback */
};

/* attachTempus — dipanggil sekali setelah loadPerf().
   Satu subscription permanen. Return value Tempus.add()
   adalah fungsi unsubscribe, disimpan di _tempusUnsub. */
const attachTempus = () => {
  if (!Tempus) return;
  try {
    _tempusUnsub = Tempus.add((time, delta) => {
      if (!appReady || !_tickerActive) return; /* idle gate */
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      tickFn(delta);
    }, 0);
  } catch(e) {
    _tempusUnsub = null; /* gagal → RAF fallback tetap jalan */
  }
  /* Kalau ada animasi pending saat boot, langsung kick */
  if (Math.abs(heroTarget - heroCur) > .0004 || Math.abs(jTarget - jCur) > .0004) {
    kickRaf();
  }
};

const resetSceneToTopImmediate = () => {
  resetInputMomentum();
  _stopTicker();
  heroAccum = heroTarget = heroCur = 0;
  jAccum    = jTarget    = jCur    = 0;
  zone = 0;
};

/* ── Buttons ── */
function openInvite() {
  ensureMainContentAssets();
  mainContent.classList.add('show');
  document.body.classList.add('invite-open');
  document.documentElement.classList.add('invite-open-boot');
  _hasOpenedInvite = true;
  if (_lenis) _lenis.stop(); /* pause Lenis saat main content terbuka */
  saveState();
  persistSessionState({ hasOpened: true, inviteOpen: true });
  mainContent.scrollTo({ top: 0, behavior: 'auto' });
  renderComments();
}
btnContinue.addEventListener('click', openInvite);
btnBack.addEventListener('click', () => {
  mainContent.classList.remove('show');
  document.body.classList.remove('invite-open');
  document.documentElement.classList.remove('invite-open-boot');
  if (_lenis) _lenis.start(); /* resume Lenis saat kembali ke hero/journey */
  resetSceneToTopImmediate();
  clearTimeout(_saveTimer);
  try { sessionStorage.removeItem(_SS_KEY); } catch(e) {}
  _hasOpenedInvite = false;
  render(); kickRaf();
});
btnTop.addEventListener('click', () => {
  resetSceneToTopImmediate();
  clearTimeout(_saveTimer);
  try { sessionStorage.removeItem(_SS_KEY); } catch(e) {}
  _hasOpenedInvite = false;
  document.documentElement.classList.remove('invite-open-boot');
  render(); kickRaf();
});
btnDown.addEventListener('click', openInvite);

/* ── App boot ── */
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
  initMusic();
  void initSupabase();
  if (document.documentElement.classList.contains('journey-open-boot'))
    requestAnimationFrame(() => document.documentElement.classList.remove('journey-open-boot'));
  requestAnimationFrame(() => document.documentElement.classList.remove('scene-boot'));
};
const bootApp = async () => {
  try {
    /* Load GSAP + Tempus + Lenis paralel dengan asset loading.
       Keduanya harus selesai SEBELUM user bisa tap — supaya saat
       expand animation selesai, hero langsung muncul tanpa jeda. */
    const perfPromise = loadPerf();
    await Promise.all([waitEssentialAssets(), perfPromise]);
    attachTempus();
    initLenis();
    _initFallbackHandlers();
    await waitForLoaderTap(); /* tap setelah semua siap → expand → langsung hero */
  } finally {
    hideLoader();
    document.documentElement.classList.remove('app-loading');
    document.documentElement.classList.add('app-ready');
    startApp();
  }
};
bootApp();

/* ── Copy to clipboard ── */
function copyGift(elId, btn) {
  const text = document.getElementById(elId).textContent.trim();
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
  });
  const orig = btn.textContent;
  btn.textContent = '✓'; btn.classList.add('copied');
  setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
}
window.copyGift = copyGift;

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function formatCommentDate(ts) {
  return new Intl.DateTimeFormat('id-ID', { day:'2-digit', month:'short', year:'numeric' }).format(new Date(Number(ts) || Date.now()));
}
function renderComments() {
  const list = document.getElementById('cmtList'), empty = document.getElementById('cmtEmpty');
  if (!list) return;

  const total = comments.length;
  const pageCount = Math.max(1, Math.ceil(total / COMMENTS_PER_PAGE));
  commentPage = clamp(commentPage, 1, pageCount);
  saveCommentPage();

  Array.from(list.querySelectorAll('.comment-bubble')).forEach(el => el.remove());
  if (total === 0) {
    if (empty) empty.style.display = '';
    if (cmtPager) cmtPager.style.display = 'none';
    if (cmtPageInfo) cmtPageInfo.textContent = 'Halaman 1 / 1';
    if (cmtPrev) cmtPrev.disabled = true;
    if (cmtNext) cmtNext.disabled = true;
    return;
  }

  if (empty) empty.style.display = 'none';
  const start = (commentPage - 1) * COMMENTS_PER_PAGE;
  const pageItems = comments.slice(start, start + COMMENTS_PER_PAGE);
  pageItems.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'comment-bubble';
    div.style.animationDelay = (i * 60) + 'ms';
    div.innerHTML = `<p class="comment-bubble-name">${escHtml(c.name)}</p><p class="comment-bubble-date">${escHtml(formatCommentDate(c.ts))}</p><p class="comment-bubble-text">${escHtml(c.text)}</p>`;
    list.appendChild(div);
  });

  if (cmtPager) cmtPager.style.display = pageCount > 1 ? 'flex' : 'none';
  if (cmtPageInfo) cmtPageInfo.textContent = `Halaman ${commentPage} / ${pageCount}`;
  if (cmtPrev) cmtPrev.disabled = commentPage <= 1;
  if (cmtNext) cmtNext.disabled = commentPage >= pageCount;
}

if (cmtPrev) {
  cmtPrev.addEventListener('click', () => {
    if (commentPage <= 1) return;
    commentPage -= 1;
    saveCommentPage();
    renderComments();
  });
}
if (cmtNext) {
  cmtNext.addEventListener('click', () => {
    const pageCount = Math.max(1, Math.ceil(comments.length / COMMENTS_PER_PAGE));
    if (commentPage >= pageCount) return;
    commentPage += 1;
    saveCommentPage();
    renderComments();
  });
}

const cmtSubmit = document.getElementById('cmtSubmit');
if (cmtSubmit) {
  cmtSubmit.addEventListener('click', async () => {
    const nameEl = document.getElementById('cmtName'), textEl = document.getElementById('cmtText');
    const name = nameEl.value.trim(), msg = textEl.value.trim();
    if (!name || !msg) {
      if (!name) nameEl.style.borderColor = 'rgba(176,100,100,.7)';
      if (!msg)  textEl.style.borderColor = 'rgba(176,100,100,.7)';
      setTimeout(() => { nameEl.style.borderColor = ''; textEl.style.borderColor = ''; }, 1400);
      return;
    }
    cmtSubmit.disabled = true; cmtSubmit.textContent = 'Mengirim…';
    try {
      const ready = supabase ? true : await initSupabase();
      if (!ready || !supabase) throw new Error('Layanan ucapan belum siap');
      const { error } = await supabase.from('ucapan').insert([{ name, text: msg, ts: Date.now() }]);
      if (error) throw error;
      nameEl.value = ''; textEl.value = '';
      cmtSubmit.textContent = '✓ Terkirim';
    } catch (err) {
      console.error('[Supabase] Gagal kirim ucapan:', err.message);
      cmtSubmit.textContent = '✗ Gagal — coba lagi';
    } finally {
      setTimeout(() => { cmtSubmit.textContent = 'Kirim Ucapan'; cmtSubmit.disabled = false; }, 2200);
    }
  });
}

/* ── Moment slider (auto move + swipe) ── */
(function initMomentSlider() {
  const viewports = Array.from(document.querySelectorAll('.mc-moment-viewport'));
  if (!viewports.length) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const speedPxPerSec = () => (window.innerWidth < CONFIG.viewport.mobileBreakpoint ? 12 : 22);

  const rows = [];
  const cleanupFns = [];
  let raf = 0;
  let mcScrollPauseTimer = 0;

  const createRow = (viewport, idx) => {
    const track = viewport.querySelector('.mc-moment-track');
    if (!track) return null;

    const baseCards = Array.from(track.children);
    const baseCount = baseCards.length;
    if (baseCount < 2) return null;

    baseCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    const dirRaw = String(viewport.dataset.momentDir || (idx % 2 === 0 ? 'right' : 'left')).toLowerCase();
    /* scrollLeft naik => visual bergerak ke kiri, jadi "right" pakai arah negatif */
    const dirSign = dirRaw === 'right' ? -1 : 1;

    let loopWidth = 0;
    let pos = 0;
    let lastTs = 0;
    let paused = false;
    let manualUntil = 0;
    let visible = false;

    const recalcLoopWidth = () => {
      const first = track.children[0];
      const firstClone = track.children[baseCount];
      if (!first || !firstClone) return;
      loopWidth = Math.max(1, firstClone.offsetLeft - first.offsetLeft);
      pos = loopWidth ? (viewport.scrollLeft % loopWidth) : 0;
      viewport.scrollLeft = pos;
    };

    const markManual = (pauseMs = 900) => {
      manualUntil = performance.now() + pauseMs;
      if (loopWidth > 0) pos = viewport.scrollLeft % loopWidth;
    };

    const setPaused = (nextPaused) => { paused = !!nextPaused; };

    const step = (ts) => {
      if (!lastTs) lastTs = ts;
      const dt = Math.min(64, ts - lastTs);
      lastTs = ts;

      if (!reduceMotion && visible && mainContent.classList.contains('show') && !paused && ts > manualUntil && loopWidth > 0) {
        pos += dirSign * (dt / 1000) * speedPxPerSec();
        if (pos >= loopWidth) pos -= loopWidth;
        if (pos < 0) pos += loopWidth;
        viewport.scrollLeft = pos;
      }
    };

    const bind = (target, ev, fn, opts) => {
      target.addEventListener(ev, fn, opts);
      cleanupFns.push(() => target.removeEventListener(ev, fn, opts));
    };

    bind(viewport, 'pointerdown', () => { setPaused(true); markManual(1400); }, { passive: true });
    bind(viewport, 'pointerup', () => { setPaused(false); markManual(900); }, { passive: true });
    bind(viewport, 'pointercancel', () => { setPaused(false); markManual(900); }, { passive: true });
    bind(viewport, 'mouseenter', () => { setPaused(true); }, undefined);
    bind(viewport, 'mouseleave', () => { setPaused(false); markManual(900); }, undefined);
    bind(viewport, 'touchstart', () => markManual(1200), { passive: true });
    bind(viewport, 'wheel', () => markManual(900), { passive: true });

    const io = new IntersectionObserver(entries => {
      visible = entries.some(e => e.isIntersecting);
    }, {
      root: mainContent,
      threshold: 0,
      rootMargin: '120px 0px 120px 0px',
    });
    io.observe(viewport);
    cleanupFns.push(() => io.disconnect());

    recalcLoopWidth();
    if (dirSign < 0 && loopWidth > 0) {
      pos = loopWidth * 0.5;
      viewport.scrollLeft = pos;
    }
    return { step, recalcLoopWidth, markManual, setPaused };
  };

  viewports.forEach((viewport, idx) => {
    const row = createRow(viewport, idx);
    if (row) rows.push(row);
  });
  if (!rows.length) return;

  const tick = (ts) => {
    rows.forEach(r => r.step(ts));
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  const onMainContentScroll = () => {
    rows.forEach(r => {
      r.setPaused(true);
      r.markManual(500);
    });
    clearTimeout(mcScrollPauseTimer);
    mcScrollPauseTimer = setTimeout(() => {
      rows.forEach(r => r.setPaused(false));
    }, 110);
  };

  mainContent.addEventListener('scroll', onMainContentScroll, { passive: true });
  cleanupFns.push(() => mainContent.removeEventListener('scroll', onMainContentScroll, { passive: true }));

  const onResize = () => { rows.forEach(r => r.recalcLoopWidth()); };
  window.addEventListener('resize', onResize, { passive: true });
  cleanupFns.push(() => window.removeEventListener('resize', onResize, { passive: true }));

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { rows.forEach(r => r.recalcLoopWidth()); }).catch(() => {});
  }

  const onBeforeUnload = () => {
    cancelAnimationFrame(raf);
    clearTimeout(mcScrollPauseTimer);
    cleanupFns.forEach(fn => fn());
    if (_lenis) { try { _lenis.destroy(); } catch(e) {} }
  };
  window.addEventListener('beforeunload', onBeforeUnload);
  cleanupFns.push(() => window.removeEventListener('beforeunload', onBeforeUnload));
})();

/* ── Scroll reveal ── */
(function initReveal() {
  const mc = document.getElementById('main-content');
  if (!mc) return;
  const revealIO = new IntersectionObserver(
    entries => entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting)),
    { root: mc, threshold: 0.16, rootMargin: '0px 0px -10% 0px' }
  );
  const cardIO = new IntersectionObserver(
    entries => entries.forEach(e => e.target.classList.toggle('show', e.isIntersecting)),
    { root: mc, threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
  );
  function observeAll() {
    mc.querySelectorAll('.mc-reveal').forEach(el => { el.classList.remove('visible'); revealIO.observe(el); });
    mc.querySelectorAll('.mc-card').forEach(el => cardIO.observe(el));
    queueSync();
  }
  let syncRaf = 0;
  const syncVisibility = () => {
    syncRaf = 0;
    if (!mc.classList.contains('show')) return;
    const vh = window.innerHeight;
    mc.querySelectorAll('.mc-reveal').forEach(el => {
      const r = el.getBoundingClientRect();
      el.classList.toggle('visible', r.top < vh * 0.90 && r.bottom > vh * 0.10);
    });
    mc.querySelectorAll('.mc-card').forEach(el => {
      const r = el.getBoundingClientRect();
      el.classList.toggle('show', r.top < vh * 0.92 && r.bottom > vh * 0.08);
    });
  };
  const queueSync = () => { if (syncRaf) return; syncRaf = requestAnimationFrame(syncVisibility); };
  const mcObserver = new MutationObserver(() => { if (mc.classList.contains('show')) setTimeout(observeAll, 100); });
  mcObserver.observe(mc, { attributes: true, attributeFilter: ['class'] });
  if (mc.classList.contains('show')) setTimeout(observeAll, 80);
  window.addEventListener('resize', () => { if (mc.classList.contains('show')) observeAll(); }, { passive: true });
  mc.addEventListener('scroll', queueSync, { passive: true });
})();

})();
