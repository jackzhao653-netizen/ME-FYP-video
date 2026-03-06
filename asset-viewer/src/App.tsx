import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from 'react';
import type { DragEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AssetItem, AssetKind, PromptEntry, PromptMap } from './types';
import { FLIPBOOK_VERSIONS } from './flipbook-versions';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, TrackballControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';

const POLL_MS = 3000;
const GROUPS: Array<{ kind: AssetKind; title: string }> = [
  { kind: 'vandi', title: 'Vandi Profile' },
  { kind: 'videos', title: 'Videos' },
  { kind: 'images', title: 'Images' },
  { kind: 'svgs', title: 'SVGs' },
  { kind: 'audio', title: 'Audio' },
  { kind: 'voiceovers', title: 'Voiceovers' }
];

const ACCEPTED_EXTENSIONS = new Set(['.mp4', '.png', '.jpg', '.jpeg', '.svg', '.wav', '.mp3']);
const AUDIO_EXTENSIONS = new Set(['.wav', '.mp3']);
const ACCEPT_ATTRIBUTE = '.mp4,.png,.jpg,.jpeg,.svg,.wav,.mp3';
const NETWORK_INFO_POLL_MS = 10000;

type AudioDestination = 'audio' | 'sounds';

type NetworkInfo = {
  ip: string | null;
  url: string | null;
};

type TabKey = AssetKind | 'upload' | 'flipbook' | 'vandi-interactive' | 'vandi-3d';

type FlipbookScene = {
  key: string;
  relativePath: string;
  caption: string;
  audioPath?: string;
  script?: string;
  filmingNotes?: string;
};

const FLIPBOOK_SCENES: FlipbookScene[] = [
  {
    key: 'hook',
    relativePath: 'images/scene-01-hook.png',
    caption: 'Cold open: fuel cell car on track, Jetson Nano LEDs glowing.',
    audioPath: 'audio/vo-scene-01-hook.mp3'
  },
  {
    key: 'intro',
    relativePath: 'images/scene-02-intro.png',
    caption: 'Introducing Vandi — AI-powered, fuel-cell driven.',
    audioPath: 'audio/vo-scene-02-intro.mp3'
  },
  {
    key: 'fuel-cell',
    relativePath: 'images/scene-04-fuelcell.png',
    caption: 'Vanadium redox fuel cell deep dive: OCV 1.4V, 2W peak.',
    audioPath: 'audio/vo-scene-04-fuelcell.mp3'
  },
  {
    key: 'architecture',
    relativePath: 'images/scene-03-arch.png',
    caption: 'System architecture: React UI → Flask → ROS 2 → Jetson → Motors.',
    audioPath: 'audio/vo-scene-03-arch.mp3'
  },
  {
    key: 'voice-demo',
    relativePath: 'images/scene-08-voicedemo.png',
    caption: 'Live voice command demo — Vandi responds in under a second.',
    audioPath: 'audio/vo-scene-08-voicedemo.mp3'
  },
  {
    key: 'autonomous',
    relativePath: 'images/scene-09-autonomous.png',
    caption: 'Autonomous lane-following with YOLOv5 obstacle detection.',
    audioPath: 'audio/vo-scene-09-autonomous.mp3'
  },
  {
    key: 'safety',
    relativePath: 'images/scene-10-safety.png',
    caption: 'Safety rejection: dangerous commands blocked before reaching ROS 2.',
    audioPath: 'audio/vo-scene-10-safety.mp3'
  },
  {
    key: 'outro',
    relativePath: 'images/scene-14-outro.png',
    caption: 'Final hero shot. HK PolyU FYP 2025–2026.',
    audioPath: 'audio/vo-scene-14-outro.mp3'
  }
];

function App() {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [prompts, setPrompts] = useState<PromptMap>({});
  const [activeTab, setActiveTab] = useState<TabKey>('videos');
  const [toast, setToast] = useState('');
  const [expandedAsset, setExpandedAsset] = useState<AssetItem | null>(null);
  const knownAssets = useRef<Set<string>>(new Set());

  const fetchAll = useCallback(async (): Promise<void> => {
    try {
      const [assetResponse, promptResponse] = await Promise.all([fetch('/api/assets'), fetch('/api/prompts')]);

      if (!assetResponse.ok || !promptResponse.ok) {
        return;
      }

      const assetJson = (await assetResponse.json()) as { assets: AssetItem[] };
      const promptJson = (await promptResponse.json()) as PromptMap;

      const nextSet = new Set(assetJson.assets.map((asset) => asset.relativePath));
      const hasNew = assetJson.assets.some((asset) => !knownAssets.current.has(asset.relativePath));

      setAssets(assetJson.assets);
      setPrompts(promptJson);

      if (knownAssets.current.size > 0 && hasNew) {
        setToast('New content detected');
        setTimeout(() => setToast(''), 2000);
      }

      knownAssets.current = nextSet;
    } catch {
      // Swallow polling errors, next interval retries.
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const timer = setInterval(fetchAll, POLL_MS);
    return () => clearInterval(timer);
  }, [fetchAll]);

  useEffect(() => {
    if (!expandedAsset) {
      return;
    }

    const onEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setExpandedAsset(null);
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [expandedAsset]);

  const grouped = useMemo(() => {
    const map = new Map<AssetKind, AssetItem[]>();
    GROUPS.forEach((group) => map.set(group.kind, []));
    assets.forEach((asset) => {
      const list = map.get(asset.kind);
      if (list) {
        list.push(asset);
      }
    });
    return map;
  }, [assets]);

  const savePrompt = async (assetPath: string, entry: PromptEntry): Promise<void> => {
    const response = await fetch('/api/prompts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: assetPath, entry })
    });

    if (!response.ok) {
      setToast('Failed to save prompt');
      setTimeout(() => setToast(''), 2000);
      return;
    }

    setPrompts((prev) => ({ ...prev, [assetPath]: entry }));
    setToast('Saved prompt changes');
    setTimeout(() => setToast(''), 2000);
  };

  const activeGroup = GROUPS.find((group) => group.kind === activeTab) ?? GROUPS[0];
  const activeAssets = grouped.get(activeGroup.kind) ?? [];
  const videoTab = activeGroup.kind === 'videos';

  return (
    <main className="min-h-screen bg-abyss px-4 pb-10 pt-6 text-slate-100 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-5 shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
          <p className="font-display text-sm uppercase tracking-[0.25em] text-cyanpulse">FYP Asset Viewer</p>
          <h1 className="mt-2 font-display text-3xl text-white md:text-4xl">Vandi FYP — Asset Pipeline</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            Polling <code className="rounded bg-slate-800 px-1 py-0.5">../fyp-assets/</code> every 3 seconds. Edit prompts, inspect in full-screen, and upload new source files.
          </p>
        </header>

        <nav className="sticky top-0 z-30 mb-6 rounded-xl border border-slate-700/90 bg-slate-900/90 p-2 shadow-lg backdrop-blur">
          <div className="flex flex-wrap gap-2">
            {GROUPS.map((group) => {
              const isActive = group.kind === activeTab;
              return (
                <button
                  key={group.kind}
                  type="button"
                  onClick={() => setActiveTab(group.kind)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${isActive
                    ? 'border border-cyanpulse/70 bg-cyan-500/15 text-cyanpulse shadow-[0_0_18px_rgba(34,211,238,0.22)]'
                    : 'border border-slate-700 text-slate-300 hover:border-cyanpulse/40 hover:text-cyan-200'
                    }`}
                >
                  {group.title}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === 'upload'
                ? 'border border-emerald-300/70 bg-emerald-500/15 text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.2)]'
                : 'border border-slate-700 text-slate-300 hover:border-emerald-300/40 hover:text-emerald-200'
                }`}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('flipbook')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === 'flipbook'
                ? 'border border-amber-300/70 bg-amber-500/15 text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.2)]'
                : 'border border-slate-700 text-slate-300 hover:border-amber-300/40 hover:text-amber-200'
                }`}
            >
              Audio Flipbook
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vandi-interactive')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === 'vandi-interactive'
                ? 'border border-violet-300/70 bg-violet-500/15 text-violet-200 shadow-[0_0_18px_rgba(167,139,250,0.2)]'
                : 'border border-slate-700 text-slate-300 hover:border-violet-300/40 hover:text-violet-200'
                }`}
            >
              Vandi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vandi-3d')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === 'vandi-3d'
                ? 'border border-cyan-300/70 bg-cyan-500/15 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.2)]'
                : 'border border-slate-700 text-slate-300 hover:border-cyan-300/40 hover:text-cyan-200'
                }`}
            >
              Vandi 3D
            </button>
          </div>
        </nav>

        {toast && (
          <div className="fixed right-4 top-4 z-40 rounded-md border border-emeraldpulse/40 bg-slate-900/95 px-4 py-2 text-sm text-emerald-200 shadow-lg shadow-emerald-500/20">
            {toast}
          </div>
        )}

        {activeTab === 'upload' ? (
          <UploadPanel
            onUploaded={async (name) => {
              setToast(`Uploaded ${name}`);
              setTimeout(() => setToast(''), 2000);
              await fetchAll();
            }}
          />
        ) : activeTab === 'flipbook' ? (
          <AudioFlipbook scenes={FLIPBOOK_SCENES} />
        ) : activeTab === 'vandi-interactive' ? (
          <VandiExpressionViewer />
        ) : activeTab === 'vandi-3d' ? (
          <Vandi3DViewer />
        ) : (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl text-cyanpulse">{activeGroup.title}</h2>
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-400">{activeAssets.length} assets</p>
              </div>
            </div>

            {activeAssets.length ? (
              <div className={videoTab ? 'grid gap-6' : 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'}>
                {activeAssets.map((asset) => (
                  <AssetCard
                    key={asset.relativePath}
                    asset={asset}
                    prompt={prompts[asset.relativePath]}
                    onSave={savePrompt}
                    onExpand={() => setExpandedAsset(asset)}
                    prominent={videoTab}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-4 py-10 text-center text-slate-400">
                No assets yet in this tab.
              </div>
            )}
          </section>
        )}
      </div>

      {expandedAsset && <AssetLightbox asset={expandedAsset} onClose={() => setExpandedAsset(null)} />}
    </main>
  );
}

const VANDI_EXPRESSIONS: Array<{ key: string; label: string; file: string; color: string }> = [
  { key: 'default', label: 'Default', file: 'vandi_front.svg', color: 'cyan' },
  { key: 'happy', label: 'Happy', file: 'vandi_front_happy.svg', color: 'emerald' },
  { key: 'sad', label: 'Sad', file: 'vandi_front_sad.svg', color: 'blue' },
  { key: 'angry', label: 'Angry', file: 'vandi_front_angry.svg', color: 'red' },
  { key: 'surprised', label: 'Surprised', file: 'vandi_front_surprised.svg', color: 'amber' },
  { key: 'listen', label: 'Listening', file: 'vandi_front_listen.svg', color: 'violet' },
  { key: 'sleepy', label: 'Sleepy', file: 'vandi_front_sleepy.svg', color: 'indigo' },
  { key: 'waving', label: 'Waving', file: 'vandi_front_waving.svg', color: 'pink' },
  { key: 'thinking', label: 'Thinking', file: 'vandi_front_thinking.svg', color: 'gray' },
  { key: 'thinking_two', label: 'Thinking 2', file: 'vandi_front_thinking_two.svg', color: 'indigo' }
];

const VANDI_BUTTONS = VANDI_EXPRESSIONS.filter((e) => e.key !== 'default');

// --- Dynamic Vandi Morphing Component (Framer Motion) ---
const EXPRESSION_PROPS_MOTION: Record<string, any> = {
  default: {
    leftAntennaTransform: { rotate: -110, scaleX: 1 }, rightAntennaTransform: { rotate: -70, scaleX: 1 },
    eyeGlow: '#00e5ff',
    leftEyePath: 'M -7 -16 L 7 -16 A 8 8 0 0 1 15 -8 L 15 8 A 8 8 0 0 1 7 16 L -7 16 A 8 8 0 0 1 -15 8 L -15 -8 A 8 8 0 0 1 -7 -16 Z',
    rightEyePath: 'M -7 -16 L 7 -16 A 8 8 0 0 1 15 -8 L 15 8 A 8 8 0 0 1 7 16 L -7 16 A 8 8 0 0 1 -15 8 L -15 -8 A 8 8 0 0 1 -7 -16 Z',
    leftEyeBlink: { d: "M -7 -16 L 7 -16 A 8 8 0 0 1 15 -8 L 15 8 A 8 8 0 0 1 7 16 L -7 16 A 8 8 0 0 1 -15 8 L -15 -8 A 8 8 0 0 1 -7 -16 Z; M -7 2 L 7 2 A 4 4 0 0 1 15 2 L 15 2 A 4 4 0 0 1 7 2 L -7 2 A 4 4 0 0 1 -15 2 L -15 2 A 4 4 0 0 1 -7 2 Z; M -7 -16 L 7 -16 A 8 8 0 0 1 15 -8 L 15 8 A 8 8 0 0 1 7 16 L -7 16 A 8 8 0 0 1 -15 8 L -15 -8 A 8 8 0 0 1 -7 -16 Z; M -7 -16 L 7 -16 A 8 8 0 0 1 15 -8 L 15 8 A 8 8 0 0 1 7 16 L -7 16 A 8 8 0 0 1 -15 8 L -15 -8 A 8 8 0 0 1 -7 -16 Z", keyTimes: "0; 0.05; 0.1; 1", dur: "4s" },
    rightEyeBlink: { d: "M -7 -16 L 7 -16 A 8 8 0 0 1 15 -8 L 15 8 A 8 8 0 0 1 7 16 L -7 16 A 8 8 0 0 1 -15 8 L -15 -8 A 8 8 0 0 1 -7 -16 Z; M -7 2 L 7 2 A 4 4 0 0 1 15 2 L 15 2 A 4 4 0 0 1 7 2 L -7 2 A 4 4 0 0 1 -15 2 L -15 2 A 4 4 0 0 1 -7 2 Z; M -7 -16 L 7 -16 A 8 8 0 0 1 15 -8 L 15 8 A 8 8 0 0 1 7 16 L -7 16 A 8 8 0 0 1 -15 8 L -15 -8 A 8 8 0 0 1 -7 -16 Z; M -7 -16 L 7 -16 A 8 8 0 0 1 15 -8 L 15 8 A 8 8 0 0 1 7 16 L -7 16 A 8 8 0 0 1 -15 8 L -15 -8 A 8 8 0 0 1 -7 -16 Z", keyTimes: "0; 0.05; 0.1; 1", dur: "4s" },
    leftEyeTransform: { x: -25, y: 0, rotate: 0 }, rightEyeTransform: { x: 25, y: 0, rotate: 0 },
    eyesGroupTransform: { x: 0, y: 0 },
    radarWaves: false
  },
  happy: {
    leftAntennaTransform: { rotate: -110, scaleX: 1.05 }, rightAntennaTransform: { rotate: -70, scaleX: 1.05 },
    eyeGlow: '#00e5ff',
    leftEyePath: 'M -15 0 Q 0 -20 15 0',
    rightEyePath: 'M -15 0 Q 0 -20 15 0',
    leftEyeTransform: { x: -25, y: 10, rotate: 0 }, rightEyeTransform: { x: 25, y: 10, rotate: 0 },
    eyesGroupTransform: { x: 0, y: -13 },
    radarWaves: false
  },
  sad: {
    leftAntennaTransform: { rotate: -15, scaleX: 0.8 }, rightAntennaTransform: { rotate: -165, scaleX: 0.8 },
    eyeGlow: '#00e5ff',
    leftEyePath: 'M 15 -8 Q 15 -16 7 -16 L -7 -4 Q -15 -4 -15 4 L -15 8 Q -15 16 -7 16 L 7 16 Q 15 16 15 8 Z',
    rightEyePath: 'M -15 -8 Q -15 -16 -7 -16 L 7 -4 Q 15 -4 15 4 L 15 8 Q 15 16 7 16 L -7 16 Q -15 16 -15 8 Z',
    leftEyeTransform: { x: -22, y: 0, rotate: 0 }, rightEyeTransform: { x: 22, y: 0, rotate: 0 },
    eyesGroupTransform: { x: 0, y: -3 },
    radarWaves: false
  },
  angry: {
    leftAntennaTransform: { rotate: -140, scaleX: 0.9 }, rightAntennaTransform: { rotate: -40, scaleX: 0.9 },
    eyeGlow: '#00e5ff',
    leftEyePath: 'M -14 -4 L 14 -4 A 4 4 0 0 1 18 0 L 18 12 A 4 4 0 0 1 14 16 L -14 16 A 4 4 0 0 1 -18 12 L -18 0 A 4 4 0 0 1 -14 -4 Z',
    rightEyePath: 'M -14 -4 L 14 -4 A 4 4 0 0 1 18 0 L 18 12 A 4 4 0 0 1 14 16 L -14 16 A 4 4 0 0 1 -18 12 L -18 0 A 4 4 0 0 1 -14 -4 Z',
    leftEyeTransform: { x: -25, y: 0, rotate: 20 }, rightEyeTransform: { x: 25, y: 0, rotate: -20 },
    eyesGroupTransform: { x: 0, y: -5 },
    radarWaves: false
  },
  surprised: {
    leftAntennaTransform: { rotate: -90, scaleX: 0.95 }, rightAntennaTransform: { rotate: -90, scaleX: 0.95 },
    eyeGlow: '#00e5ff',
    leftEyePath: 'M -16 0 A 16 16 0 1 1 16 0 A 16 16 0 1 1 -16 0',
    rightEyePath: 'M -16 0 A 16 16 0 1 1 16 0 A 16 16 0 1 1 -16 0',
    leftEyeTransform: { x: -25, y: 0, rotate: 0 }, rightEyeTransform: { x: 25, y: 0, rotate: 0 },
    eyesGroupTransform: { x: 0, y: -5 },
    radarWaves: false
  },
  listen: {
    leftAntennaTransform: { rotate: -90, scaleX: 1.1 }, rightAntennaTransform: { rotate: -70, scaleX: 1.1 },
    eyeGlow: '#00e5ff',
    leftEyePath: 'M -7 -16 L 7 -16 A 8 8 0 0 1 15 -8 L 15 8 A 8 8 0 0 1 7 16 L -7 16 A 8 8 0 0 1 -15 8 L -15 -8 A 8 8 0 0 1 -7 -16 Z',
    rightEyePath: 'M -7 -16 L 7 -16 A 8 8 0 0 1 15 -8 L 15 8 A 8 8 0 0 1 7 16 L -7 16 A 8 8 0 0 1 -15 8 L -15 -8 A 8 8 0 0 1 -7 -16 Z',
    leftEyeTransform: { x: -22, y: 0, rotate: 0 }, rightEyeTransform: { x: 22, y: 0, rotate: 0 },
    eyesGroupTransform: { x: -8, y: -5 },
    radarWaves: true
  },
  sleepy: {
    leftAntennaTransform: { rotate: -10, scaleX: 0.7 }, rightAntennaTransform: { rotate: -170, scaleX: 0.7 },
    eyeGlow: '#00e5ff',
    leftEyePath: 'M -11 -4 L 11 -4 A 4 4 0 0 1 15 0 A 4 4 0 0 1 11 4 L -11 4 A 4 4 0 0 1 -15 0 A 4 4 0 0 1 -11 -4 Z',
    rightEyePath: 'M -11 -4 L 11 -4 A 4 4 0 0 1 15 0 A 4 4 0 0 1 11 4 L -11 4 A 4 4 0 0 1 -15 0 A 4 4 0 0 1 -11 -4 Z',
    leftEyeTransform: { x: -22, y: 0, rotate: 0 }, rightEyeTransform: { x: 22, y: 0, rotate: 0 },
    eyesGroupTransform: { x: 0, y: 10 },
    radarWaves: false
  },
  waving: {
    leftAntennaTransform: { rotate: -110, scaleX: 1.1 }, rightAntennaTransform: { rotate: -70, scaleX: 1.1 },
    leftAntennaWobble: { values: "0; 50; -10; 50; 0", keyTimes: "0; 0.25; 0.5; 0.75; 1", dur: "0.5s" },
    rightAntennaWobble: { values: "0; -50; 10; -50; 0", keyTimes: "0; 0.25; 0.5; 0.75; 1", dur: "0.5s" },
    eyeGlow: '#00e5ff',
    leftEyePath: 'M -7 -16 L 7 -16 A 8 8 0 0 1 15 -8 L 15 -2 A 4 4 0 0 1 11 2 L -11 2 A 4 4 0 0 1 -15 -2 L -15 -8 A 8 8 0 0 1 -7 -16 Z',
    rightEyePath: 'M -7 -16 L 7 -16 A 8 8 0 0 1 15 -8 L 15 -2 A 4 4 0 0 1 11 2 L -11 2 A 4 4 0 0 1 -15 -2 L -15 -8 A 8 8 0 0 1 -7 -16 Z',
    leftEyeTransform: { x: -25, y: 0, rotate: 0 }, rightEyeTransform: { x: 25, y: 0, rotate: 0 },
    eyesGroupTransform: { x: 0, y: 0 },
    radarWaves: false
  },
  thinking: {
    leftAntennaTransform: { rotate: -120, scaleX: 1 }, rightAntennaTransform: { rotate: -60, scaleX: 1 },
    eyeGlow: '#00e5ff',
    leftEyePath: 'M -7 -16 L 7 -16 A 8 8 0 0 1 15 -8 L 15 -8 A 8 8 0 0 1 7 0 L -7 0 A 8 8 0 0 1 -15 -8 L -15 -8 A 8 8 0 0 1 -7 -16 Z',
    rightEyePath: 'M -7 -16 L 7 -16 A 8 8 0 0 1 15 -8 L 15 8 A 8 8 0 0 1 7 16 L -7 16 A 8 8 0 0 1 -15 8 L -15 -8 A 8 8 0 0 1 -7 -16 Z',
    leftEyeTransform: { x: -25, y: 18, rotate: 0 }, rightEyeTransform: { x: 25, y: 0, rotate: 0 },
    eyesGroupTransform: { x: 0, y: -10 },
    radarWaves: false
  },
  thinking_two: {
    leftAntennaTransform: { rotate: -110, scaleX: 1.05 }, rightAntennaTransform: { rotate: -70, scaleX: 1.05 },
    eyeGlow: '#00e5ff',
    leftEyePath: 'M -15 0 Q 0 -20 15 0',
    rightEyePath: 'M -15 0 Q 0 -20 15 0',
    leftEyeTransform: { x: -25, y: 10, rotate: 0 }, rightEyeTransform: { x: 25, y: 10, rotate: 0 },
    eyesGroupTransform: { x: 0, y: -13 },
    radarWaves: false
  }
};
function VandiExpressionViewer() {
  const [activeExpression, setActiveExpression] = useState('default');
  const [zoom, setZoom] = useState(1);
  const [isEyeTracking, setIsEyeTracking] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isEyeTracking) {
      setMouseOffset({ x: 0, y: 0 });
    }
  }, [isEyeTracking]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isEyeTracking) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width) * 2 - 1; // -1 to 1
    const normalizedY = (y / rect.height) * 2 - 1; // -1 to 1

    const maxOffsetX = 12;
    const maxOffsetY = 10;

    setMouseOffset({
      x: normalizedX * maxOffsetX,
      y: normalizedY * maxOffsetY
    });
  };

  const handlePointerLeave = () => {
    if (isEyeTracking) {
      setMouseOffset({ x: 0, y: 0 });
    }
  };

  // Auto-return to idle after 3 seconds
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (activeExpression !== 'default') {
      timerRef.current = setTimeout(() => setActiveExpression('default'), 3000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeExpression]);

  const props = EXPRESSION_PROPS_MOTION[activeExpression] || EXPRESSION_PROPS_MOTION.default;
  const springConfig = { type: "spring" as const, stiffness: 260, damping: 20 };

  const btnColors: Record<string, { active: string; idle: string }> = {
    emerald: { active: 'border-emerald-300/70 bg-emerald-500/15 text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.2)]', idle: 'border-slate-600 text-slate-300 hover:border-emerald-300/40 hover:text-emerald-200' },
    blue: { active: 'border-blue-300/70 bg-blue-500/15 text-blue-200 shadow-[0_0_18px_rgba(96,165,250,0.2)]', idle: 'border-slate-600 text-slate-300 hover:border-blue-300/40 hover:text-blue-200' },
    red: { active: 'border-red-300/70 bg-red-500/15 text-red-200 shadow-[0_0_18px_rgba(252,165,165,0.2)]', idle: 'border-slate-600 text-slate-300 hover:border-red-300/40 hover:text-red-200' },
    amber: { active: 'border-amber-300/70 bg-amber-500/15 text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.2)]', idle: 'border-slate-600 text-slate-300 hover:border-amber-300/40 hover:text-amber-200' },
    violet: { active: 'border-violet-300/70 bg-violet-500/15 text-violet-200 shadow-[0_0_18px_rgba(167,139,250,0.2)]', idle: 'border-slate-600 text-slate-300 hover:border-violet-300/40 hover:text-violet-200' },
    indigo: { active: 'border-indigo-300/70 bg-indigo-500/15 text-indigo-200 shadow-[0_0_18px_rgba(129,140,248,0.2)]', idle: 'border-slate-600 text-slate-300 hover:border-indigo-300/40 hover:text-indigo-200' },
    pink: { active: 'border-pink-300/70 bg-pink-500/15 text-pink-200 shadow-[0_0_18px_rgba(244,114,182,0.2)]', idle: 'border-slate-600 text-slate-300 hover:border-pink-300/40 hover:text-pink-200' }
  };

  return (
    <section className="rounded-2xl border border-violet-300/25 bg-slate-900/60 p-5 shadow-xl shadow-violet-500/10">
      <div className="mb-4">
        <h2 className="font-display text-2xl text-violet-200">Vandi Expression Viewer</h2>
        <p className="mt-1 text-sm text-slate-300">Click an expression — Vandi will react, then return to idle.</p>
      </div>

      <div className="flex items-start gap-5">
        {/* Native Framer Motion SVG area */}
        <div className="flex flex-1 flex-col gap-4">
          <div
            className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950/40 shadow-inner"
            style={{ height: '55vh', marginLeft: '-20px' }}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >

            <svg className="h-full w-full drop-shadow-2xl" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.1s ease-out' }} viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="cyanGlowDyn" x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id="headGradDyn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a8b4a" /><stop offset="100%" stopColor="#184718" /></linearGradient>
                <linearGradient id="screenGradDyn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a1a1e" /><stop offset="100%" stopColor="#0a0a0c" /></linearGradient>
                <linearGradient id="metalGradDyn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a8d9b" /><stop offset="100%" stopColor="#4a4c54" /></linearGradient>
              </defs>

              <g transform="translate(250, 250)">
                {/* Antennas */}
                <g transform="translate(-32, -75)">
                  <motion.g animate={props.leftAntennaTransform} transition={springConfig} style={{ originX: "0px", originY: "0px", transformBox: "view-box" }}>
                    <g>
                      <animateTransform key={activeExpression + '-left'} attributeName="transform" type="rotate" values={props.leftAntennaWobble?.values || "0; -8; 8; 0"} keyTimes={props.leftAntennaWobble?.keyTimes || "0; 0.3; 0.7; 1"} dur={props.leftAntennaWobble?.dur || (activeExpression === 'happy' ? "2s" : "4s")} repeatCount="indefinite" additive="sum" />
                      <rect x="0" y="-3" width="60" height="6" rx="3" fill="url(#metalGradDyn)" />
                      <motion.circle cx="62" cy="0" r="8" animate={{ fill: props.eyeGlow }} filter="url(#cyanGlowDyn)" />
                    </g>
                  </motion.g>
                </g>

                <g transform="translate(32, -75)">
                  <motion.g animate={props.rightAntennaTransform} transition={springConfig} style={{ originX: "0px", originY: "0px", transformBox: "view-box" }}>
                    <g>
                      <animateTransform key={activeExpression + '-right'} attributeName="transform" type="rotate" values={props.rightAntennaWobble?.values || "0; 8; -8; 0"} keyTimes={props.rightAntennaWobble?.keyTimes || "0; 0.3; 0.7; 1"} dur={props.rightAntennaWobble?.dur || (activeExpression === 'happy' ? "2.1s" : "4.3s")} repeatCount="indefinite" additive="sum" />
                      <rect x="0" y="-3" width="60" height="6" rx="3" fill="url(#metalGradDyn)" />
                      <motion.circle cx="62" cy="0" r="8" animate={{ fill: props.eyeGlow }} filter="url(#cyanGlowDyn)" />
                    </g>
                  </motion.g>
                </g>

                {/* Head Base */}
                <rect x="-80" y="-75" width="160" height="150" rx="45" fill="url(#headGradDyn)" stroke="#111" strokeWidth="3" />

                {/* Left Ear */}
                <g transform="translate(-80, -5)">
                  <path d="M 0 -22 L -10 -28 L -10 28 L 0 22 Z" fill="#222328" stroke="#111" strokeWidth="2" />
                  <rect x="-16" y="-35" width="6" height="70" rx="3" fill="url(#metalGradDyn)" stroke="#111" strokeWidth="2" />
                  <motion.rect height="30" animate={{ y: props.radarWaves ? -20 : -15, height: props.radarWaves ? 40 : 30, fill: props.eyeGlow }} x="-18" width="4" rx="2" filter="url(#cyanGlowDyn)" />
                  {props.radarWaves ? (
                    <>
                      <path d="M -24 -15 Q -30 0 -24 15" fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" filter="url(#cyanGlowDyn)"><animate attributeName="opacity" values="0; 0.8; 0" keyTimes="0; 0.2; 1" dur="1.5s" repeatCount="indefinite" /></path>
                      <path d="M -32 -25 Q -40 0 -32 25" fill="none" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" filter="url(#cyanGlowDyn)"><animate attributeName="opacity" values="0; 0; 0.6; 0" keyTimes="0; 0.2; 0.5; 1" dur="1.5s" repeatCount="indefinite" /></path>
                    </>
                  ) : (
                    <motion.path animate={{ stroke: props.eyeGlow }} d="M -24 -15 Q -30 0 -24 15" fill="none" strokeWidth="2" strokeLinecap="round" filter="url(#cyanGlowDyn)" opacity="0.6" />
                  )}
                </g>

                {/* Right Ear */}
                <g transform="translate(80, -5)">
                  <path d="M 0 -22 L 10 -28 L 10 28 L 0 22 Z" fill="#222328" stroke="#111" strokeWidth="2" />
                  <rect x="10" y="-35" width="6" height="70" rx="3" fill="url(#metalGradDyn)" stroke="#111" strokeWidth="2" />
                  <motion.rect animate={{ fill: props.eyeGlow }} x="14" y="-15" width="4" height="30" rx="2" filter="url(#cyanGlowDyn)" />
                  <motion.path animate={{ stroke: props.eyeGlow }} d="M 24 -15 Q 30 0 24 15" fill="none" strokeWidth="2" strokeLinecap="round" filter="url(#cyanGlowDyn)" opacity="0.6" />
                </g>

                {/* Screen */}
                <rect x="-70" y="-60" width="140" height="120" rx="35" fill="#15161a" stroke="#888c94" strokeWidth="5" />
                <rect x="-67" y="-57" width="134" height="114" rx="32" fill="url(#screenGradDyn)" />
                <path d="M -50 -50 Q 0 -40 50 -50 Q 55 -30 50 -10 Q 0 -20 -50 -10 Z" fill="#ffffff" opacity="0.04" />

                {/* Eyes */}
                <motion.g animate={props.eyesGroupTransform} transition={springConfig}>
                  <g>
                    {/* Internal group to hold SVG specific animateTransforms safely decoupled from Framer Motion's inline CSS transforms */}
                    {activeExpression === 'default' && <animateTransform attributeName="transform" type="translate" values="0,0; 0,2; 0,0" dur="4s" repeatCount="indefinite" />}
                    {activeExpression === 'happy' && <animateTransform attributeName="transform" type="translate" values="0,0; 0,-2; 0,0.5; 0,-1.5; 0,1; 0,-2; 0,0.5; 0,-1; 0,0" keyTimes="0; 0.1; 0.2; 0.3; 0.4; 0.55; 0.7; 0.85; 1" dur="2s" repeatCount="indefinite" />}
                    {activeExpression === 'sad' && <animateTransform attributeName="transform" type="translate" values="0,0; 0,2; 0,0" dur="4s" repeatCount="indefinite" />}
                    {activeExpression === 'angry' && <animateTransform attributeName="transform" type="translate" values="0,0; -2,0; 2,0; -1,0; 1,0; 0,0" keyTimes="0; 0.15; 0.3; 0.5; 0.7; 1" dur="1.5s" repeatCount="indefinite" />}

                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.g
                        key={`${activeExpression}-left`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, ...props.leftEyeTransform, x: (props.leftEyeTransform.x || 0) + mouseOffset.x, y: (props.leftEyeTransform.y || 0) + mouseOffset.y }}
                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
                        transition={springConfig}
                      >
                        {activeExpression === 'default' ? (
                          <path d={props.leftEyePath} fill={props.eyeGlow} filter="url(#cyanGlowDyn)">
                            <animate attributeName="d" values={props.leftEyeBlink.d} keyTimes={props.leftEyeBlink.keyTimes} dur={props.leftEyeBlink.dur} repeatCount="indefinite" />
                          </path>
                        ) : (
                          <motion.path d={props.leftEyePath} fill={(activeExpression === 'happy' || activeExpression === 'thinking_two') ? 'none' : props.eyeGlow} filter="url(#cyanGlowDyn)" stroke={(activeExpression === 'happy' || activeExpression === 'thinking_two') ? props.eyeGlow : 'none'} strokeWidth={(activeExpression === 'happy' || activeExpression === 'thinking_two') ? 12 : 0} strokeLinecap="round" />
                        )}
                      </motion.g>
                    </AnimatePresence>

                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.g
                        key={`${activeExpression}-right`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, ...props.rightEyeTransform, x: (props.rightEyeTransform.x || 0) + mouseOffset.x, y: (props.rightEyeTransform.y || 0) + mouseOffset.y }}
                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
                        transition={springConfig}
                      >
                        {activeExpression === 'default' ? (
                          <path d={props.rightEyePath} fill={props.eyeGlow} filter="url(#cyanGlowDyn)">
                            <animate attributeName="d" values={props.rightEyeBlink.d} keyTimes={props.rightEyeBlink.keyTimes} dur={props.rightEyeBlink.dur} repeatCount="indefinite" />
                          </path>
                        ) : (
                          <motion.path d={props.rightEyePath} fill={(activeExpression === 'happy' || activeExpression === 'thinking_two') ? 'none' : props.eyeGlow} filter="url(#cyanGlowDyn)" stroke={(activeExpression === 'happy' || activeExpression === 'thinking_two') ? props.eyeGlow : 'none'} strokeWidth={(activeExpression === 'happy' || activeExpression === 'thinking_two') ? 12 : 0} strokeLinecap="round" />
                        )}
                      </motion.g>
                    </AnimatePresence>
                  </g>
                </motion.g>

                {/* Sleepy ZZZs */}
                <AnimatePresence>
                  {activeExpression === 'sleepy' && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                      <motion.text x="35" animate={{ y: [-25, -35, -25], opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} fill="#00e5ff" fontFamily="monospace" fontWeight="bold" fontSize="20" filter="url(#cyanGlowDyn)">z</motion.text>
                      <motion.text x="50" animate={{ y: [-45, -55, -45], opacity: [1, 0, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} fill="#00e5ff" fontFamily="monospace" fontWeight="bold" fontSize="24" filter="url(#cyanGlowDyn)">Z</motion.text>
                    </motion.g>
                  )}
                </AnimatePresence>
                {/* Internal Scaled Thinking Cloud Overlay */}
                <AnimatePresence>
                  {(activeExpression === 'thinking' || activeExpression === 'thinking_two') && (
                    <motion.image
                      href={activeExpression === 'thinking_two' ? "/api/asset/vandi%20profile/thought_cloud_idea.svg" : "/api/asset/vandi%20profile/thought_cloud.svg"}
                      initial={{ opacity: 0, scale: 0.5, y: -200, x: 50 }}
                      animate={{ opacity: 1, scale: 0.8, y: [-210, -220, -210], x: 50 }}
                      exit={{ opacity: 0, scale: 0.5, y: -200 }}
                      transition={{
                        opacity: { duration: 0.3 },
                        scale: { type: "spring", stiffness: 200, damping: 15 },
                        y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                      }}
                      width="250"
                      height="200"
                      className="drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                    />
                  )}
                </AnimatePresence>
              </g>
            </svg>
          </div>

          {/* Zoom & Tracking Controls */}
          <div className="flex items-center gap-6 px-4" style={{ marginLeft: '-20px' }}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400">Eye Tracking</span>
              <button
                onClick={() => setIsEyeTracking(!isEyeTracking)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent outline-none transition-colors duration-200 ease-in-out ${isEyeTracking ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${isEyeTracking ? 'translate-x-4 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'translate-x-0 bg-slate-400'}`} />
              </button>
            </div>

            <div className="flex items-center gap-3 flex-1">
              <span className="text-xs font-medium text-slate-400">Zoom</span>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="h-1.5 flex-1 cursor-ew-resize appearance-none rounded-full bg-slate-700 outline-none hover:bg-slate-600 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              />
              <span className="w-8 text-right text-xs font-medium text-cyan-100">{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => setZoom(1)} className="rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-800">Reset</button>
            </div>
          </div>
        </div>

        {/* Expression trigger buttons — side grid */}
        <div className="grid w-36 shrink-0 grid-cols-1 gap-2">
          {VANDI_BUTTONS.map((expr) => {
            const isActive = expr.key === activeExpression;
            const colors = btnColors[expr.color] ?? btnColors.emerald;
            return (
              <button
                key={expr.key}
                type="button"
                onClick={() => setActiveExpression(expr.key)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${isActive ? colors.active : colors.idle}`}
              >
                {expr.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function STLModel({ url }: { url: string }) {
  const geometry = useLoader(STLLoader, url);
  
  // Center the geometry for better viewing
  geometry.center();
  
  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
      <meshStandardMaterial color="#4a8b4a" metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

function CameraController({ view }: { view: string }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  useEffect(() => {
    const positions: Record<string, [number, number, number]> = {
      front: [400, 0, 0],
      top: [0, 400, 0],
      left: [0, 0, -400],
      right: [0, 0, 400],
      iso: [300, 300, 300]
    };
    
    const position = positions[view];
    if (position && controlsRef.current) {
      camera.position.set(...position);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [view, camera]);
  
  return (
    <TrackballControls 
      ref={controlsRef}
      staticMoving={false}
      dynamicDampingFactor={0.1}
    />
  );
}

function Vandi3DViewer() {
  const [view, setView] = useState('iso');

  return (
    <section className="rounded-2xl border border-cyan-300/25 bg-slate-900/60 p-5 shadow-xl shadow-cyan-500/10">
      <div className="mb-4">
        <h2 className="font-display text-2xl text-cyan-200">Vandi 3D Model</h2>
        <p className="mt-1 text-sm text-slate-300">
          Interactive 3D view of Vandi assembly (Assem5.STL). Use mouse to rotate, scroll to zoom.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setView('front')}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
              view === 'front'
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                : 'border-slate-600 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-200'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setView('top')}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
              view === 'top'
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                : 'border-slate-600 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-200'
            }`}
          >
            Top
          </button>
          <button
            onClick={() => setView('left')}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
              view === 'left'
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                : 'border-slate-600 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-200'
            }`}
          >
            Left
          </button>
          <button
            onClick={() => setView('right')}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
              view === 'right'
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                : 'border-slate-600 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-200'
            }`}
          >
            Right
          </button>
          <button
            onClick={() => setView('iso')}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
              view === 'iso'
                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                : 'border-slate-600 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-200'
            }`}
          >
            3D
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700/80 bg-white" style={{ height: '70vh' }}>
        <Canvas>
          <color attach="background" args={['white']} />
          <PerspectiveCamera makeDefault position={[300, 300, 300]} />
          <CameraController view={view} />
          
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-10, -10, -5]} intensity={0.6} />
          <directionalLight position={[0, 10, 0]} intensity={0.4} />
          
          <Suspense fallback={null}>
            <STLModel url="/api/asset/Vandi3D/Assem5.STL" />
          </Suspense>
        </Canvas>
      </div>

      <div className="mt-4 rounded-lg border border-cyan-200/20 bg-cyan-500/5 px-4 py-3">
        <p className="text-sm text-cyan-100">
          <strong>Controls:</strong> Left-click + drag to rotate • Right-click + drag to pan • Scroll to zoom • Double-click to reset view
        </p>
      </div>
    </section>
  );
}

function AudioFlipbook({ scenes }: { scenes: FlipbookScene[] }) {
  const [currentScene, setCurrentScene] = useState(0);
  const [secondsPerScene, setSecondsPerScene] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVersion, setActiveVersion] = useState<string>('v0');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentScenes = activeVersion === 'v0' ? scenes : (FLIPBOOK_VERSIONS.find(v => v.id === activeVersion)?.scenes || scenes);
  const total = currentScenes.length;
  const active = currentScenes[currentScene];
  const msPerScene = secondsPerScene * 1000;

  // Play audio when scene changes
  useEffect(() => {
    if (active.audioPath && audioRef.current) {
      audioRef.current.src = `/api/asset/${encodeURIComponent(active.audioPath)}`;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => { });
      }
    }
  }, [currentScene, active.audioPath]);

  // Auto-advance: for scenes with audio, wait until audio ends.
  // Timer fallback is only used when a scene has no audio.
  useEffect(() => {
    if (!isPlaying || total < 2) return;
    const audio = audioRef.current;
    let fallback: ReturnType<typeof setTimeout> | null = null;
    const hasSceneAudio = Boolean(active.audioPath);

    const advance = () => {
      if (fallback) clearTimeout(fallback);
      setCurrentScene((prev) => (prev + 1) % total);
    };

    if (hasSceneAudio && audio) {
      audio.addEventListener('ended', advance);
      audio.addEventListener('error', advance);
      audio.addEventListener('abort', advance);
    } else {
      // No audio for this scene, use manual timing.
      fallback = setTimeout(advance, msPerScene);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('ended', advance);
        audio.removeEventListener('error', advance);
        audio.removeEventListener('abort', advance);
      }
      if (fallback) clearTimeout(fallback);
    };
  }, [active.audioPath, currentScene, isPlaying, msPerScene, total]);

  const jumpTo = (index: number): void => {
    if (index < 0 || index >= total) return;
    setCurrentScene(index);
  };

  const togglePlay = (): void => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (audioRef.current) {
      if (next) {
        audioRef.current.src = active.audioPath
          ? `/api/asset/${encodeURIComponent(active.audioPath)}`
          : '';
        audioRef.current.play().catch(() => { });
      } else {
        audioRef.current.pause();
      }
    }
  };

  const progressPercent = total <= 1 ? 100 : (currentScene / (total - 1)) * 100;

  return (
    <section className="rounded-2xl border border-amber-300/25 bg-slate-900/60 p-5 shadow-xl shadow-amber-500/10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-amber-200">Audio Flipbook</h2>
          <p className="mt-1 text-sm text-slate-300">Scene {currentScene + 1} / {total}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => jumpTo((currentScene - 1 + total) % total)}
            className="rounded-md border border-slate-600 px-3 py-1.5 text-sm text-slate-100 transition hover:bg-slate-800/80"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="rounded-md border border-amber-300/50 px-3 py-1.5 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/10"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={() => jumpTo((currentScene + 1) % total)}
            className="rounded-md border border-slate-600 px-3 py-1.5 text-sm text-slate-100 transition hover:bg-slate-800/80"
          >
            Next
          </button>
        </div>
      </div>

      {/* Version tabs */}
      <div className="mb-4 flex flex-wrap gap-2 rounded-lg border border-slate-700/50 bg-slate-950/40 p-2">
        <button
          type="button"
          onClick={() => { setActiveVersion('v0'); setCurrentScene(0); }}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${activeVersion === 'v0' ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50' : 'text-slate-400 hover:text-slate-200'}`}
        >
          V0: Original
        </button>
        {FLIPBOOK_VERSIONS.map((version) => (
          <button
            key={version.id}
            type="button"
            onClick={() => { setActiveVersion(version.id); setCurrentScene(0); }}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${activeVersion === version.id ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {version.label}
          </button>
        ))}
      </div>

      <div className="mb-4 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950/70">
        <div className="aspect-video w-full">
          <img
            src={`/api/asset/${encodeURIComponent(active.relativePath)}`}
            alt={`Scene ${currentScene + 1}: ${active.key}`}
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      <p className="mb-4 rounded-lg border border-amber-200/20 bg-amber-500/5 px-4 py-3 text-base text-amber-100">{active.caption}</p>

      {/* Script display */}
      {active.script && (
        <div className="mb-4 rounded-lg border-l-4 border-cyan-400 bg-slate-950/60 px-4 py-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-300">Narration Script</p>
          <p className="text-sm leading-relaxed text-slate-200">{active.script}</p>
        </div>
      )}

      {/* Filming notes */}
      {active.filmingNotes && (
        <div className="mb-4 rounded-lg border border-slate-700/50 bg-slate-900/40 px-4 py-2">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Filming Notes</p>
          <p className="text-xs text-slate-400">{active.filmingNotes}</p>
        </div>
      )}

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
          <span>Playback speed</span>
          <span>{secondsPerScene.toFixed(1)}s / scene</span>
        </div>
        <input
          type="range"
          min={1}
          max={8}
          step={0.5}
          value={secondsPerScene}
          onChange={(event) => setSecondsPerScene(Number(event.target.value))}
          className="w-full accent-amber-400"
        />
      </div>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div className="h-full bg-gradient-to-r from-amber-300 to-orange-400 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      </div>

      <audio ref={audioRef} className="hidden" />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {currentScenes.map((scene, index) => {
          const isActive = index === currentScene;
          return (
            <button
              key={scene.key}
              type="button"
              onClick={() => jumpTo(index)}
              className={`overflow-hidden rounded-lg border text-left transition ${isActive ? 'border-amber-300 shadow-[0_0_0_1px_rgba(251,191,36,0.5)]' : 'border-slate-700 hover:border-amber-300/50'
                }`}
            >
              <img
                src={`/api/asset/${encodeURIComponent(scene.relativePath)}`}
                alt={scene.key}
                className="aspect-video w-full bg-slate-950 object-cover"
              />
              <p className={`truncate px-2 py-1 text-xs ${isActive ? 'text-amber-200' : 'text-slate-300'}`}>
                {index + 1}. {scene.key}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function AssetCard({
  asset,
  prompt,
  onSave,
  onExpand,
  prominent
}: {
  asset: AssetItem;
  prompt?: PromptEntry;
  onSave: (path: string, entry: PromptEntry) => Promise<void>;
  onExpand: () => void;
  prominent?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<PromptEntry>(prompt ?? {});

  useEffect(() => {
    setDraft(prompt ?? {});
  }, [prompt]);

  const submit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    const next = { ...prompt, ...draft };
    await onSave(asset.relativePath, next);
    setIsEditing(false);
  };

  const isVoice = asset.kind === 'voiceovers' || prompt?.type === 'voiceover';

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest('button,textarea,input,select,audio,video,label')) {
          return;
        }
        onExpand();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onExpand();
        }
      }}
      className={`cursor-zoom-in overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4 shadow-xl shadow-cyan-900/20 ${prominent ? 'mx-auto w-full max-w-5xl' : ''
        } ${asset.kind === 'svgs' ? 'svg-card-hover' : ''}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-slate-100">{asset.fileName}</p>
          <p className="text-xs text-slate-400">{asset.relativePath}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExpand}
            className="rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200 transition hover:bg-slate-700/40"
          >
            Expand
          </button>
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="rounded-md border border-cyan-300/40 px-2 py-1 text-xs text-cyan-200 transition hover:bg-cyan-400/10"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="mb-4">{renderPreview(asset, prominent)}</div>

      {isEditing ? (
        <form className="space-y-2" onSubmit={submit}>
          {!isVoice && (
            <textarea
              value={draft.prompt ?? ''}
              onChange={(event) => setDraft((prev) => ({ ...prev, prompt: event.target.value }))}
              placeholder="Generation prompt"
              rows={4}
              className="w-full rounded-md border border-slate-600 bg-slate-950/70 px-3 py-2 text-sm"
            />
          )}

          {isVoice && (
            <>
              <textarea
                value={draft.script ?? ''}
                onChange={(event) => setDraft((prev) => ({ ...prev, script: event.target.value, type: 'voiceover' }))}
                placeholder="Voiceover script"
                rows={3}
                className="w-full rounded-md border border-slate-600 bg-slate-950/70 px-3 py-2 text-sm"
              />
              <textarea
                value={draft.voicePrompt ?? ''}
                onChange={(event) => setDraft((prev) => ({ ...prev, voicePrompt: event.target.value, type: 'voiceover' }))}
                placeholder="Voice description prompt"
                rows={4}
                className="w-full rounded-md border border-slate-600 bg-slate-950/70 px-3 py-2 text-sm"
              />
            </>
          )}

          <button type="submit" className="rounded-md bg-emeraldpulse/90 px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-emerald-300">
            Save
          </button>
        </form>
      ) : (
        <div className="space-y-2 text-sm text-slate-200">
          {isVoice ? (
            <>
              <Field label="Script" value={prompt?.script} />
              <Field label="Voice Prompt" value={prompt?.voicePrompt} />
            </>
          ) : (
            <Field label="Prompt" value={prompt?.prompt} />
          )}
        </div>
      )}
    </article>
  );
}

function UploadPanel({ onUploaded }: { onUploaded: (fileName: string) => Promise<void> }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioDestination, setAudioDestination] = useState<AudioDestination | ''>('');
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({ ip: null, url: null });
  const [progress, setProgress] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('Drop or pick one file to exchange into ../fyp-assets/.');

  const fetchNetworkInfo = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/network-info');
      if (!response.ok) {
        return;
      }
      const json = (await response.json()) as NetworkInfo;
      setNetworkInfo(json);
    } catch {
      // Swallow polling errors and keep last known address.
    }
  }, []);

  useEffect(() => {
    fetchNetworkInfo();
    const timer = setInterval(fetchNetworkInfo, NETWORK_INFO_POLL_MS);
    return () => clearInterval(timer);
  }, [fetchNetworkInfo]);

  const getExtension = (fileName: string): string => {
    const index = fileName.lastIndexOf('.');
    return index >= 0 ? fileName.slice(index).toLowerCase() : '';
  };

  const handlePickedFile = (file: File | null): void => {
    if (!file) {
      return;
    }

    const ext = getExtension(file.name);
    if (!ACCEPTED_EXTENSIONS.has(ext)) {
      setMessage('Unsupported file type. Use mp4, png, jpg, svg, wav, or mp3.');
      return;
    }

    setSelectedFile(file);
    if (AUDIO_EXTENSIONS.has(ext)) {
      setAudioDestination('');
      setMessage(`Pick destination for ${file.name} before upload.`);
      return;
    }

    setAudioDestination('');
    setMessage(`Ready to upload ${file.name}`);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(false);
    handlePickedFile(event.dataTransfer.files[0] ?? null);
  };

  const upload = async (): Promise<void> => {
    if (!selectedFile || progress !== null) {
      return;
    }

    const extension = getExtension(selectedFile.name);
    const isAudioFile = AUDIO_EXTENSIONS.has(extension);
    if (isAudioFile && !audioDestination) {
      setMessage('Please choose where this audio file should go before uploading.');
      return;
    }

    setProgress(0);
    setMessage(`Uploading ${selectedFile.name}...`);

    await new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload');
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.setRequestHeader('X-File-Name', encodeURIComponent(selectedFile.name));
      if (isAudioFile && audioDestination) {
        xhr.setRequestHeader('destination', audioDestination);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100);
          setMessage(`Uploaded ${selectedFile.name}`);
          
          // Save description to prompts if provided
          if (description.trim()) {
            const uploadResult = JSON.parse(xhr.responseText);
            const relativePath = uploadResult.relativePath;
            await fetch('/api/prompts', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                path: relativePath,
                entry: { type: 'asset', prompt: description.trim() }
              })
            });
          }
          
          setSelectedFile(null);
          setAudioDestination('');
          setDescription('');
          await onUploaded(selectedFile.name);
        } else {
          setProgress(null);
          setMessage(`Upload failed (${xhr.status}).`);
        }
        resolve();
      };

      xhr.onerror = () => {
        setProgress(null);
        setMessage('Upload failed due to network/server error.');
        resolve();
      };

      xhr.send(selectedFile);
    });

    setTimeout(() => setProgress(null), 700);
  };

  const selectedExtension = selectedFile ? getExtension(selectedFile.name) : '';
  const requiresAudioDestination = selectedFile ? AUDIO_EXTENSIONS.has(selectedExtension) : false;
  const canUpload = Boolean(selectedFile) && progress === null && (!requiresAudioDestination || Boolean(audioDestination));

  return (
    <section className="rounded-2xl border border-emerald-300/25 bg-slate-900/60 p-6 shadow-xl shadow-emerald-500/10">
      <div className="mb-4">
        <h2 className="font-display text-2xl text-emerald-200">Upload Exchanger</h2>
        <p className="mt-2 text-sm text-slate-300">Accepted: MP4, PNG, JPG, SVG, WAV, MP3. Audio asks for destination before upload.</p>
        <div className="mt-3 rounded-lg border border-emerald-300/45 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          {networkInfo.url ? (
            <>
              Access from other devices:{' '}
              <a href={networkInfo.url} target="_blank" rel="noreferrer" className="font-semibold underline decoration-emerald-300/80 underline-offset-2">
                {networkInfo.url}
              </a>
            </>
          ) : (
            'Access from other devices: local network IP unavailable.'
          )}
        </div>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`rounded-xl border-2 border-dashed p-8 text-center transition ${isDragging ? 'border-emerald-300 bg-emerald-300/10' : 'border-slate-600 bg-slate-950/40'
          }`}
      >
        <p className="text-sm text-slate-200">Drag and drop a file here</p>
        <p className="mt-2 text-xs text-slate-400">or</p>
        <label className="mt-4 inline-flex cursor-pointer items-center rounded-md border border-emerald-200/60 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/10">
          Pick file
          <input
            type="file"
            accept={ACCEPT_ATTRIBUTE}
            className="hidden"
            onChange={(event) => handlePickedFile(event.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <div className="mt-4 space-y-3">
        <p className="text-sm text-slate-300">{message}</p>
        {selectedFile && <p className="text-xs text-slate-400">Selected: {selectedFile.name}</p>}
        {requiresAudioDestination && (
          <div className="space-y-1">
            <label htmlFor="audio-destination" className="text-sm font-medium text-emerald-100">
              Where should this audio file go?
            </label>
            <select
              id="audio-destination"
              value={audioDestination}
              onChange={(event) => setAudioDestination(event.target.value as AudioDestination)}
              className="w-full rounded-md border border-emerald-200/40 bg-slate-950/80 px-3 py-2 text-sm text-slate-100"
            >
              <option value="">Select destination</option>
              <option value="audio">Voiceover (audio/)</option>
              <option value="sounds">Sound Effect (sounds/)</option>
            </select>
          </div>
        )}
        <div className="space-y-1">
          <label htmlFor="asset-description" className="text-sm font-medium text-emerald-100">
            Description (optional, helps agents find this asset)
          </label>
          <input
            id="asset-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Fuel cell assembly photo showing Nafion membrane"
            className="w-full rounded-md border border-emerald-200/40 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
          />
        </div>
        {progress !== null && (
          <div className="overflow-hidden rounded-full bg-slate-800">
            <div className="h-2 bg-emerald-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        <button
          type="button"
          onClick={upload}
          disabled={!canUpload}
          className="rounded-md bg-emerald-300 px-4 py-2 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
        >
          Upload file
        </button>
      </div>
    </section>
  );
}

function AssetLightbox({ asset, onClose }: { asset: AssetItem; onClose: () => void }) {
  const svgLightbox = asset.kind === 'svgs';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 ${svgLightbox ? 'svg-lightbox-overlay-enter' : ''}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`relative max-h-full w-full max-w-7xl rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl shadow-cyan-500/20 ${svgLightbox ? 'svg-lightbox-panel-enter' : ''}`}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close expanded preview"
          className="absolute right-3 top-3 rounded-md border border-slate-600 px-3 py-1 text-sm text-slate-200 transition hover:bg-slate-700/50"
        >
          X
        </button>
        <p className="mb-2 pr-12 text-sm text-slate-300">{asset.relativePath}</p>
        <div className="max-h-[82vh] overflow-auto rounded-lg bg-slate-950/70 p-3">{renderExpandedAsset(asset)}</div>
      </div>
    </div>
  );
}

function renderExpandedAsset(asset: AssetItem) {
  if (asset.kind === 'videos') {
    return <video controls className="mx-auto max-h-[78vh] w-full rounded-lg bg-black object-contain" src={asset.url} />;
  }

  if (asset.kind === 'images') {
    return <img src={asset.url} alt={asset.fileName} className="mx-auto max-h-[78vh] w-full rounded-lg object-contain" />;
  }

  if (asset.kind === 'svgs' || asset.kind === 'vandi') {
    return <InlineSvg src={asset.url} large className="svg-lightbox-svg" />;
  }

  return <AudioPreview src={asset.url} large />;
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-wide text-cyan-200/80">{label}</p>
      <p className="rounded-md border border-slate-700 bg-slate-950/60 p-2 text-slate-300">{value?.trim() || 'No prompt data yet.'}</p>
    </div>
  );
}

function renderPreview(asset: AssetItem, prominent?: boolean) {
  const src = asset.url;

  if (asset.kind === 'videos') {
    return (
      <div className={`mx-auto w-full ${prominent ? 'max-w-5xl' : ''}`}>
        <video controls className="aspect-video w-full rounded-lg bg-black object-contain" src={src} />
      </div>
    );
  }

  if (asset.kind === 'images') {
    return <img src={src} alt={asset.fileName} className="h-48 w-full rounded-lg bg-slate-950/70 object-contain" />;
  }

  if (asset.kind === 'svgs') {
    return <InlineSvg src={src} className="svg-preview-shell" />;
  }

  if (asset.kind === 'vandi') {
    return <InlineSvg src={src} className="svg-preview-shell" tall />;
  }

  return <AudioPreview src={src} />;
}

function InlineSvg({ src, large = false, tall = false, className = '' }: { src: string; large?: boolean; tall?: boolean; className?: string }) {
  const [markup, setMarkup] = useState('');

  useEffect(() => {
    fetch(src)
      .then((response) => response.text())
      .then((text) => setMarkup(text))
      .catch(() => setMarkup(''));
  }, [src]);

  if (!markup) {
    return <div className={`flex h-48 items-center justify-center rounded-lg bg-slate-950/80 text-sm text-slate-400 ${className}`}>Loading SVG...</div>;
  }

  const heightClass = large ? 'min-h-[68vh]' : tall ? 'h-96' : 'h-48';

  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-slate-950/80 p-3 [&_svg]:max-h-full [&_svg]:max-w-full ${heightClass
        } ${className}`}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

function AudioPreview({ src, large = false }: { src: string; large?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const draw = async (): Promise<void> => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      context.fillStyle = '#020617';
      context.fillRect(0, 0, canvas.width, canvas.height);

      let audioContext: AudioContext | null = null;
      try {
        audioContext = new AudioContext();
        const buffer = await fetch(src).then((response) => response.arrayBuffer());
        const data = await audioContext.decodeAudioData(buffer);
        const channel = data.getChannelData(0);
        const step = Math.max(1, Math.floor(channel.length / canvas.width));

        context.strokeStyle = '#22d3ee';
        context.lineWidth = 1;
        context.beginPath();

        for (let x = 0; x < canvas.width; x += 1) {
          const sample = channel[Math.min(x * step, channel.length - 1)] ?? 0;
          const y = ((sample + 1) / 2) * canvas.height;
          context.lineTo(x, y);
        }
        context.stroke();
      } catch {
        context.fillStyle = '#334155';
        context.font = '12px Manrope';
        context.fillText('Waveform unavailable', 10, 20);
      } finally {
        if (audioContext) {
          await audioContext.close();
        }
      }
    };

    draw();
  }, [src, large]);

  return (
    <div className="space-y-2 rounded-lg bg-slate-950/70 p-2">
      <canvas ref={canvasRef} width={large ? 1800 : 800} height={large ? 220 : 96} className={large ? 'h-56 w-full rounded bg-slate-950' : 'h-24 w-full rounded bg-slate-950'} />
      <audio controls src={src} className="w-full" />
    </div>
  );
}

export default App;
