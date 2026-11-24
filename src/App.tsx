import React, { useState, useEffect, useCallback, useRef } from 'react';

type ColorKey = 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'orange';
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Vehicle {
  id: string;
  color: ColorKey;
  row: number;
  col: number;
  length: 2 | 3;
  orientation: 'H' | 'V';
  direction: Direction;
}

interface ParkedBus {
  slotIndex: number;
  vehicleId: string;
  color: ColorKey;
  capacity: number;
  passengers: number;
  isDeparting: boolean;
}

interface StageConfig {
  level: number;
  title: string;
  gridSize: number;
  slotsCount: number;
  vehicles: Vehicle[];
  passengerQueue: ColorKey[];
}

interface ColorStyle {
  name: string;
  bg: string;
  border: string;
  roof: string;
  shadow: string;
  personBg: string;
  badge: string;
}

const COLOR_STYLES: Record<ColorKey, ColorStyle> = {
  red: {
    name: '赤',
    bg: '#ef4444',
    border: '#b91c1c',
    roof: '#f87171',
    shadow: '#991b1b',
    personBg: '#ef4444',
    badge: 'bg-red-500 text-white',
  },
  blue: {
    name: '青',
    bg: '#3b82f6',
    border: '#1d4ed8',
    roof: '#60a5fa',
    shadow: '#1e40af',
    personBg: '#3b82f6',
    badge: 'bg-blue-500 text-white',
  },
  yellow: {
    name: '黄',
    bg: '#eab308',
    border: '#a16207',
    roof: '#facc15',
    shadow: '#854d0e',
    personBg: '#eab308',
    badge: 'bg-yellow-400 text-slate-900',
  },
  green: {
    name: '緑',
    bg: '#22c55e',
    border: '#15803d',
    roof: '#4ade80',
    shadow: '#166534',
    personBg: '#22c55e',
    badge: 'bg-green-500 text-white',
  },
  purple: {
    name: '紫',
    bg: '#a855f7',
    border: '#7e22ce',
    roof: '#c084fc',
    shadow: '#6b21a8',
    personBg: '#a855f7',
    badge: 'bg-purple-500 text-white',
  },
  orange: {
    name: '橙',
    bg: '#f97316',
    border: '#c2410c',
    roof: '#fb923c',
    shadow: '#9a3412',
    personBg: '#f97316',
    badge: 'bg-orange-500 text-white',
  },
};

const STAGES: StageConfig[] = [
  {
    level: 1,
    title: 'ステージ 1：駅前ロータリー（8台）',
    gridSize: 6,
    slotsCount: 4,
    vehicles: [
      { id: 'v1', color: 'blue', row: 0, col: 0, length: 2, orientation: 'H', direction: 'LEFT' },
      { id: 'v2', color: 'red', row: 0, col: 2, length: 2, orientation: 'V', direction: 'UP' },
      { id: 'v3', color: 'yellow', row: 0, col: 3, length: 3, orientation: 'H', direction: 'RIGHT' },
      { id: 'v4', color: 'green', row: 1, col: 0, length: 3, orientation: 'V', direction: 'DOWN' },
      { id: 'v5', color: 'purple', row: 2, col: 1, length: 2, orientation: 'H', direction: 'RIGHT' },
      { id: 'v6', color: 'orange', row: 2, col: 4, length: 2, orientation: 'V', direction: 'UP' },
      { id: 'v7', color: 'red', row: 4, col: 1, length: 3, orientation: 'H', direction: 'RIGHT' },
      { id: 'v8', color: 'blue', row: 5, col: 0, length: 2, orientation: 'H', direction: 'LEFT' },
    ],
    passengerQueue: [
      'red', 'red', 'red', 'red',
      'blue', 'blue', 'blue', 'blue',
      'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow',
      'orange', 'orange', 'orange', 'orange',
      'purple', 'purple', 'purple', 'purple',
      'green', 'green', 'green', 'green', 'green', 'green',
      'red', 'red', 'red', 'red', 'red', 'red',
      'blue', 'blue', 'blue', 'blue',
    ],
  },
  {
    level: 2,
    title: 'ステージ 2：朝のターミナル（11台）',
    gridSize: 6,
    slotsCount: 4,
    vehicles: [
      { id: 'v1', color: 'yellow', row: 0, col: 0, length: 2, orientation: 'V', direction: 'UP' },
      { id: 'v2', color: 'red', row: 0, col: 1, length: 2, orientation: 'H', direction: 'RIGHT' },
      { id: 'v3', color: 'green', row: 0, col: 4, length: 2, orientation: 'H', direction: 'RIGHT' },
      { id: 'v4', color: 'blue', row: 1, col: 2, length: 3, orientation: 'V', direction: 'DOWN' },
      { id: 'v5', color: 'purple', row: 1, col: 3, length: 2, orientation: 'H', direction: 'RIGHT' },
      { id: 'v6', color: 'orange', row: 2, col: 0, length: 2, orientation: 'H', direction: 'LEFT' },
      { id: 'v7', color: 'red', row: 2, col: 5, length: 3, orientation: 'V', direction: 'DOWN' },
      { id: 'v8', color: 'yellow', row: 3, col: 1, length: 2, orientation: 'V', direction: 'UP' },
      { id: 'v9', color: 'blue', row: 4, col: 2, length: 3, orientation: 'H', direction: 'RIGHT' },
      { id: 'v10', color: 'green', row: 5, col: 0, length: 2, orientation: 'H', direction: 'LEFT' },
      { id: 'v11', color: 'purple', row: 5, col: 3, length: 2, orientation: 'H', direction: 'RIGHT' },
    ],
    passengerQueue: [
      'red', 'red', 'red', 'red',
      'green', 'green', 'green', 'green',
      'yellow', 'yellow', 'yellow', 'yellow',
      'purple', 'purple', 'purple', 'purple',
      'orange', 'orange', 'orange', 'orange',
      'yellow', 'yellow', 'yellow', 'yellow',
      'blue', 'blue', 'blue', 'blue', 'blue', 'blue',
      'red', 'red', 'red', 'red', 'red', 'red',
      'blue', 'blue', 'blue', 'blue', 'blue', 'blue',
      'green', 'green', 'green', 'green',
      'purple', 'purple', 'purple', 'purple',
    ],
  },
  {
    level: 3,
    title: 'ステージ 3：マンモス駐車場（13台）',
    gridSize: 7,
    slotsCount: 5,
    vehicles: [
      { id: 'v1', color: 'red', row: 0, col: 0, length: 2, orientation: 'H', direction: 'LEFT' },
      { id: 'v2', color: 'blue', row: 0, col: 2, length: 3, orientation: 'H', direction: 'RIGHT' },
      { id: 'v3', color: 'green', row: 0, col: 6, length: 2, orientation: 'V', direction: 'UP' },
      { id: 'v4', color: 'yellow', row: 1, col: 1, length: 3, orientation: 'V', direction: 'UP' },
      { id: 'v5', color: 'purple', row: 1, col: 3, length: 2, orientation: 'H', direction: 'RIGHT' },
      { id: 'v6', color: 'orange', row: 2, col: 2, length: 2, orientation: 'V', direction: 'DOWN' },
      { id: 'v7', color: 'red', row: 2, col: 4, length: 3, orientation: 'V', direction: 'DOWN' },
      { id: 'v8', color: 'blue', row: 2, col: 5, length: 2, orientation: 'H', direction: 'RIGHT' },
      { id: 'v9', color: 'green', row: 4, col: 0, length: 2, orientation: 'H', direction: 'LEFT' },
      { id: 'v10', color: 'yellow', row: 5, col: 1, length: 3, orientation: 'H', direction: 'LEFT' },
      { id: 'v11', color: 'purple', row: 5, col: 5, length: 2, orientation: 'V', direction: 'DOWN' },
      { id: 'v12', color: 'orange', row: 6, col: 0, length: 3, orientation: 'H', direction: 'LEFT' },
      { id: 'v13', color: 'blue', row: 6, col: 3, length: 2, orientation: 'H', direction: 'RIGHT' },
    ],
    passengerQueue: [
      'red', 'red', 'red', 'red',
      'blue', 'blue', 'blue', 'blue', 'blue', 'blue',
      'green', 'green', 'green', 'green',
      'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow',
      'purple', 'purple', 'purple', 'purple',
      'blue', 'blue', 'blue', 'blue',
      'red', 'red', 'red', 'red', 'red', 'red',
      'orange', 'orange', 'orange', 'orange',
      'green', 'green', 'green', 'green',
      'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow',
      'purple', 'purple', 'purple', 'purple',
      'blue', 'blue', 'blue', 'blue',
      'orange', 'orange', 'orange', 'orange', 'orange', 'orange',
    ],
  },
  {
    level: 4,
    title: 'ステージ 4：交差する大動脈（15台）',
    gridSize: 7,
    slotsCount: 5,
    vehicles: [
      { id: 'v1', color: 'green', row: 0, col: 0, length: 2, orientation: 'V', direction: 'UP' },
      { id: 'v2', color: 'orange', row: 0, col: 1, length: 2, orientation: 'H', direction: 'RIGHT' },
      { id: 'v3', color: 'purple', row: 0, col: 4, length: 3, orientation: 'H', direction: 'RIGHT' },
      { id: 'v4', color: 'blue', row: 1, col: 2, length: 2, orientation: 'V', direction: 'UP' },
      { id: 'v5', color: 'red', row: 1, col: 3, length: 3, orientation: 'V', direction: 'DOWN' },
      { id: 'v6', color: 'yellow', row: 1, col: 5, length: 2, orientation: 'H', direction: 'RIGHT' },
      { id: 'v7', color: 'red', row: 2, col: 0, length: 2, orientation: 'H', direction: 'LEFT' },
      { id: 'v8', color: 'green', row: 2, col: 4, length: 2, orientation: 'V', direction: 'DOWN' },
      { id: 'v9', color: 'blue', row: 3, col: 1, length: 2, orientation: 'H', direction: 'LEFT' },
      { id: 'v10', color: 'orange', row: 3, col: 6, length: 3, orientation: 'V', direction: 'DOWN' },
      { id: 'v11', color: 'yellow', row: 4, col: 0, length: 2, orientation: 'V', direction: 'DOWN' },
      { id: 'v12', color: 'purple', row: 4, col: 2, length: 3, orientation: 'H', direction: 'RIGHT' },
      { id: 'v13', color: 'green', row: 5, col: 1, length: 2, orientation: 'H', direction: 'LEFT' },
      { id: 'v14', color: 'red', row: 6, col: 2, length: 2, orientation: 'H', direction: 'LEFT' },
      { id: 'v15', color: 'blue', row: 6, col: 4, length: 3, orientation: 'H', direction: 'RIGHT' },
    ],
    passengerQueue: [
      'green', 'green', 'green', 'green',
      'orange', 'orange', 'orange', 'orange',
      'purple', 'purple', 'purple', 'purple', 'purple', 'purple',
      'blue', 'blue', 'blue', 'blue',
      'yellow', 'yellow', 'yellow', 'yellow',
      'red', 'red', 'red', 'red',
      'blue', 'blue', 'blue', 'blue',
      'green', 'green', 'green', 'green',
      'red', 'red', 'red', 'red', 'red', 'red',
      'orange', 'orange', 'orange', 'orange', 'orange', 'orange',
      'yellow', 'yellow', 'yellow', 'yellow',
      'purple', 'purple', 'purple', 'purple', 'purple', 'purple',
      'green', 'green', 'green', 'green',
      'blue', 'blue', 'blue', 'blue', 'blue', 'blue',
      'red', 'red', 'red', 'red',
    ],
  },
  {
    level: 5,
    title: 'ステージ 5：超巨大メガジャム（18台）',
    gridSize: 8,
    slotsCount: 5,
    vehicles: [
      { id: 'v1', color: 'red', row: 0, col: 0, length: 2, orientation: 'H', direction: 'LEFT' },
      { id: 'v2', color: 'blue', row: 0, col: 2, length: 2, orientation: 'V', direction: 'UP' },
      { id: 'v3', color: 'yellow', row: 0, col: 3, length: 3, orientation: 'H', direction: 'RIGHT' },
      { id: 'v4', color: 'green', row: 0, col: 7, length: 3, orientation: 'V', direction: 'UP' },
      { id: 'v5', color: 'purple', row: 1, col: 0, length: 3, orientation: 'V', direction: 'DOWN' },
      { id: 'v6', color: 'orange', row: 1, col: 4, length: 2, orientation: 'H', direction: 'RIGHT' },
      { id: 'v7', color: 'red', row: 2, col: 1, length: 2, orientation: 'H', direction: 'RIGHT' },
      { id: 'v8', color: 'blue', row: 2, col: 3, length: 3, orientation: 'V', direction: 'DOWN' },
      { id: 'v9', color: 'yellow', row: 2, col: 5, length: 2, orientation: 'V', direction: 'UP' },
      { id: 'v10', color: 'green', row: 3, col: 6, length: 2, orientation: 'H', direction: 'RIGHT' },
      { id: 'v11', color: 'orange', row: 4, col: 0, length: 2, orientation: 'H', direction: 'LEFT' },
      { id: 'v12', color: 'purple', row: 4, col: 4, length: 2, orientation: 'H', direction: 'RIGHT' },
      { id: 'v13', color: 'red', row: 5, col: 1, length: 2, orientation: 'V', direction: 'DOWN' },
      { id: 'v14', color: 'yellow', row: 5, col: 2, length: 3, orientation: 'H', direction: 'RIGHT' },
      { id: 'v15', color: 'blue', row: 5, col: 7, length: 3, orientation: 'V', direction: 'DOWN' },
      { id: 'v16', color: 'green', row: 6, col: 3, length: 2, orientation: 'H', direction: 'LEFT' },
      { id: 'v17', color: 'orange', row: 7, col: 0, length: 3, orientation: 'H', direction: 'LEFT' },
      { id: 'v18', color: 'purple', row: 7, col: 4, length: 3, orientation: 'H', direction: 'RIGHT' },
    ],
    passengerQueue: [
      'red', 'red', 'red', 'red',
      'blue', 'blue', 'blue', 'blue',
      'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow',
      'green', 'green', 'green', 'green', 'green', 'green',
      'orange', 'orange', 'orange', 'orange',
      'purple', 'purple', 'purple', 'purple', 'purple', 'purple',
      'yellow', 'yellow', 'yellow', 'yellow',
      'green', 'green', 'green', 'green',
      'red', 'red', 'red', 'red',
      'orange', 'orange', 'orange', 'orange',
      'purple', 'purple', 'purple', 'purple',
      'blue', 'blue', 'blue', 'blue', 'blue', 'blue',
      'blue', 'blue', 'blue', 'blue', 'blue', 'blue',
      'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow',
      'red', 'red', 'red', 'red',
      'green', 'green', 'green', 'green',
      'orange', 'orange', 'orange', 'orange', 'orange', 'orange',
      'purple', 'purple', 'purple', 'purple', 'purple', 'purple',
    ],
  },
];

class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playMove() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }

  playBlocked() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(95, ctx.currentTime + 0.14);
    gain.gain.setValueAtTime(0.14, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  }

  playBoard() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  playDepart() {
    const ctx = this.getContext();
    if (!ctx) return;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.05 + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 0.15);
    });
  }

  playWin() {
    const ctx = this.getContext();
    if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.16, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.3);
    });
  }
}

const sfx = new SoundFX();

const VehicleArtwork: React.FC<{
  vehicle: Vehicle;
  isExitable: boolean;
}> = ({ vehicle, isExitable }) => {
  const style = COLOR_STYLES[vehicle.color];
  const isBus = vehicle.length === 3;
  const capacity = isBus ? 6 : 4;

  const rotationMap: Record<Direction, number> = {
    UP: 0,
    RIGHT: 90,
    DOWN: 180,
    LEFT: 270,
  };

  return (
    <div
      className="relative w-full h-full select-none flex items-center justify-center p-0.5 sm:p-1"
      style={{
        filter: isExitable ? 'brightness(1.12)' : undefined,
      }}
    >
      <div
        className="relative w-full h-full rounded-xl flex items-center justify-center transition-transform duration-150"
        style={{
          backgroundColor: style.bg,
          border: '3px solid ' + style.border,
          boxShadow: '0 4px 0 ' + style.shadow + ', 0 6px 12px rgba(0,0,0,0.25)',
        }}
      >
        <div
          className="absolute inset-1 rounded-lg opacity-85 flex items-center justify-center"
          style={{
            backgroundColor: style.roof,
            border: '1.5px solid rgba(255,255,255,0.45)',
          }}
        >
          {vehicle.orientation === 'H' ? (
            <div className="w-full h-full flex items-center justify-between px-1.5">
              <div className="w-2 h-3/5 bg-slate-800/75 rounded-sm" />
              {isBus && <div className="w-2.5 h-3/5 bg-slate-800/60 rounded-sm" />}
              <div className="w-2 h-3/5 bg-slate-800/75 rounded-sm" />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-between py-1.5">
              <div className="h-2 w-3/5 bg-slate-800/75 rounded-sm" />
              {isBus && <div className="h-2.5 w-3/5 bg-slate-800/60 rounded-sm" />}
              <div className="h-2 w-3/5 bg-slate-800/75 rounded-sm" />
            </div>
          )}
        </div>

        {vehicle.direction === 'UP' && (
          <div className="absolute -top-0.5 inset-x-2 flex justify-between">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
          </div>
        )}
        {vehicle.direction === 'DOWN' && (
          <div className="absolute -bottom-0.5 inset-x-2 flex justify-between">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
          </div>
        )}
        {vehicle.direction === 'LEFT' && (
          <div className="absolute -left-0.5 inset-y-2 flex flex-col justify-between">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
          </div>
        )}
        {vehicle.direction === 'RIGHT' && (
          <div className="absolute -right-0.5 inset-y-2 flex flex-col justify-between">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
          </div>
        )}

        <div className="relative z-10 flex items-center justify-center bg-white/95 rounded-full w-5 h-5 sm:w-7 sm:h-7 shadow border border-slate-200">
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800"
            style={{ transform: 'rotate(' + rotationMap[vehicle.direction] + 'deg)' }}
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
        </div>

        <span className="absolute bottom-0.5 right-0.5 z-10 px-1 text-[8px] sm:text-[9px] font-black leading-tight rounded bg-slate-900/80 text-white">
          {capacity}
        </span>
      </div>
    </div>
  );
};

const PassengerCharacter: React.FC<{
  color: ColorKey;
  isFront: boolean;
}> = ({ color, isFront }) => {
  const style = COLOR_STYLES[color];
  const wrapperClass = isFront
    ? 'relative flex flex-col items-center justify-end transition-all duration-200 scale-105 z-10'
    : 'relative flex flex-col items-center justify-end transition-all duration-200 opacity-90';

  return (
    <div className={wrapperClass}>
      {isFront && (
        <span className="bg-amber-300 text-slate-900 text-[8px] font-black px-1.5 rounded-full shadow-sm leading-tight mb-0.5 whitespace-nowrap">
          先頭
        </span>
      )}
      <svg viewBox="0 0 36 44" className="w-6 h-7 sm:w-7 sm:h-8 drop-shadow">
        <rect
          x="7"
          y="19"
          width="22"
          height="21"
          rx="9"
          fill={style.personBg}
          stroke="#1e293b"
          strokeWidth="2.2"
        />
        <circle
          cx="18"
          cy="12"
          r="8.5"
          fill={style.personBg}
          stroke="#1e293b"
          strokeWidth="2.2"
        />
        <circle cx="15" cy="11.5" r="1.4" fill="#ffffff" />
        <circle cx="21" cy="11.5" r="1.4" fill="#ffffff" />
        <path
          d="M15.5 14.5 Q18 16.8 20.5 14.5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default function App() {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [slots, setSlots] = useState<(ParkedBus | null)[]>([]);
  const [passengerQueue, setPassengerQueue] = useState<ColorKey[]>([]);
  const [blockedVehicleId, setBlockedVehicleId] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<'PLAYING' | 'VICTORY' | 'GAMEOVER'>('PLAYING');
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const stage = STAGES[currentStageIdx];
  const boardingTimerRef = useRef<number | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 1800);
  }, []);

  const initStage = useCallback((idx: number) => {
    const target = STAGES[idx];
    setVehicles(target.vehicles.map((v) => ({ ...v })));
    setSlots(Array(target.slotsCount).fill(null));
    setPassengerQueue([...target.passengerQueue]);
    setBlockedVehicleId(null);
    setGameStatus('PLAYING');
  }, []);

  useEffect(() => {
    initStage(currentStageIdx);
  }, [currentStageIdx, initStage]);

  useEffect(() => {
    sfx.enabled = soundOn;
  }, [soundOn]);

  const getVehicleCells = (v: Vehicle): { r: number; c: number }[] => {
    const cells: { r: number; c: number }[] = [];
    for (let i = 0; i < v.length; i++) {
      cells.push({
        r: v.orientation === 'V' ? v.row + i : v.row,
        c: v.orientation === 'H' ? v.col + i : v.col,
      });
    }
    return cells;
  };

  const canVehicleExit = (target: Vehicle, allVehicles: Vehicle[]): boolean => {
    const occupied = new Set<string>();
    allVehicles.forEach((v) => {
      if (v.id === target.id) return;
      getVehicleCells(v).forEach((cell) => {
        occupied.add(cell.r + ',' + cell.c);
      });
    });

    const cells = getVehicleCells(target);
    const gridSize = stage.gridSize;

    if (target.direction === 'UP') {
      const topRow = Math.min(...cells.map((c) => c.r));
      const col = cells[0].c;
      for (let r = topRow - 1; r >= 0; r--) {
        if (occupied.has(r + ',' + col)) return false;
      }
      return true;
    }
    if (target.direction === 'DOWN') {
      const bottomRow = Math.max(...cells.map((c) => c.r));
      const col = cells[0].c;
      for (let r = bottomRow + 1; r < gridSize; r++) {
        if (occupied.has(r + ',' + col)) return false;
      }
      return true;
    }
    if (target.direction === 'LEFT') {
      const leftCol = Math.min(...cells.map((c) => c.c));
      const row = cells[0].r;
      for (let c = leftCol - 1; c >= 0; c--) {
        if (occupied.has(row + ',' + c)) return false;
      }
      return true;
    }
    if (target.direction === 'RIGHT') {
      const rightCol = Math.max(...cells.map((c) => c.c));
      const row = cells[0].r;
      for (let c = rightCol + 1; c < gridSize; c++) {
        if (occupied.has(row + ',' + c)) return false;
      }
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (gameStatus !== 'PLAYING') return;

    if (passengerQueue.length === 0 && vehicles.length === 0) {
      const activeBuses = slots.filter((s) => s !== null);
      if (activeBuses.length === 0) {
        sfx.playWin();
        setGameStatus('VICTORY');
        return;
      }
    }

    const frontColor = passengerQueue[0];
    if (frontColor) {
      const matchingSlotIdx = slots.findIndex(
        (bus) =>
          bus !== null &&
          !bus.isDeparting &&
          bus.color === frontColor &&
          bus.passengers < bus.capacity
      );

      if (matchingSlotIdx !== -1) {
        boardingTimerRef.current = window.setTimeout(() => {
          sfx.playBoard();
          setPassengerQueue((prevQueue) => {
            if (prevQueue[0] !== frontColor) return prevQueue;
            return prevQueue.slice(1);
          });

          setSlots((prevSlots) => {
            const next = [...prevSlots];
            const bus = next[matchingSlotIdx];
            if (!bus) return prevSlots;

            const updatedPassengers = bus.passengers + 1;
            if (updatedPassengers >= bus.capacity) {
              next[matchingSlotIdx] = {
                ...bus,
                passengers: updatedPassengers,
                isDeparting: true,
              };
              sfx.playDepart();

              setTimeout(() => {
                setSlots((latest) => {
                  const cleared = [...latest];
                  if (cleared[matchingSlotIdx]?.vehicleId === bus.vehicleId) {
                    cleared[matchingSlotIdx] = null;
                  }
                  return cleared;
                });
              }, 350);
            } else {
              next[matchingSlotIdx] = {
                ...bus,
                passengers: updatedPassengers,
              };
            }
            return next;
          });
        }, 140);

        return () => {
          if (boardingTimerRef.current) clearTimeout(boardingTimerRef.current);
        };
      }
    }

    const isAllSlotsFull = slots.every((s) => s !== null && !s.isDeparting);
    if (isAllSlotsFull && passengerQueue.length > 0) {
      const hasMatchingBus = slots.some(
        (s) => s !== null && s.color === passengerQueue[0] && s.passengers < s.capacity
      );
      if (!hasMatchingBus) {
        const timer = window.setTimeout(() => {
          setGameStatus('GAMEOVER');
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [passengerQueue, slots, vehicles, gameStatus]);

  const handleVehicleClick = (vehicle: Vehicle) => {
    if (gameStatus !== 'PLAYING') return;

    if (!canVehicleExit(vehicle, vehicles)) {
      sfx.playBlocked();
      setBlockedVehicleId(vehicle.id);
      triggerToast('前の車が邪魔で出られません！');
      setTimeout(() => {
        setBlockedVehicleId((prev) => (prev === vehicle.id ? null : prev));
      }, 400);
      return;
    }

    const emptySlotIndex = slots.findIndex((s) => s === null);
    if (emptySlotIndex === -1) {
      sfx.playBlocked();
      triggerToast('待機レーンがいっぱいです！');
      return;
    }

    sfx.playMove();
    setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
    setSlots((prev) => {
      const next = [...prev];
      next[emptySlotIndex] = {
        slotIndex: emptySlotIndex,
        vehicleId: vehicle.id,
        color: vehicle.color,
        capacity: vehicle.length === 2 ? 4 : 6,
        passengers: 0,
        isDeparting: false,
      };
      return next;
    });
  };

  const exitableIds = new Set(
    vehicles.filter((v) => canVehicleExit(v, vehicles)).map((v) => v.id)
  );

  const slotGridClass =
    stage.slotsCount === 5 ? 'grid grid-cols-5 gap-1.5' : 'grid grid-cols-4 gap-1.5';

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-sky-500 via-sky-400 to-emerald-500 text-slate-800 flex flex-col items-center justify-start gap-2 py-2 px-3 select-none font-sans">
      {/* ヘッダー */}
      <header className="w-full max-w-xl flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400 border-2 border-amber-600 shadow flex items-center justify-center text-base font-black text-slate-900">
            🚌
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white drop-shadow leading-none">
              BUS ESCAPE
            </h1>
            <p className="text-[10px] font-bold text-sky-100 hidden sm:block">
              渋滞解消＆乗客誘導パズル
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="bg-white/95 px-2.5 py-1 rounded-xl shadow-sm border border-white flex items-center gap-1 text-xs font-extrabold">
            <span className="text-slate-500">残り</span>
            <span className="text-sky-600">{vehicles.length}台</span>
          </div>

          <button
            type="button"
            onClick={() => setSoundOn((prev) => !prev)}
            className="p-1.5 rounded-xl bg-white/90 hover:bg-white shadow-sm border border-white text-slate-700"
            title="サウンド切替"
          >
            {soundOn ? '🔊' : '🔇'}
          </button>

          <button
            type="button"
            onClick={() => initStage(currentStageIdx)}
            className="px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-white shadow-sm border border-white text-xs font-extrabold text-slate-700"
          >
            やり直す
          </button>

          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-200 shadow-sm border border-amber-400 text-xs font-black text-slate-900"
          >
            遊び方
          </button>
        </div>
      </header>

      {/* ステージ選択タブ */}
      <div className="w-full max-w-xl shrink-0">
        <div className="flex items-center justify-between gap-1 bg-slate-900/20 p-1 rounded-xl">
          {STAGES.map((st, idx) => {
            const isActive = idx === currentStageIdx;
            const btnClass = isActive
              ? 'flex-1 py-1 px-2 rounded-lg text-xs font-extrabold bg-white text-slate-900 shadow-sm'
              : 'flex-1 py-1 px-2 rounded-lg text-xs font-extrabold text-white hover:bg-white/20';

            return (
              <button
                key={st.level}
                type="button"
                onClick={() => setCurrentStageIdx(idx)}
                className={btnClass}
              >
                Lv.{st.level}
              </button>
            );
          })}
        </div>
        <div className="text-center mt-1">
          <span className="inline-block bg-slate-900/30 text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">
            {stage.title}
          </span>
        </div>
      </div>

      {/* メインエリア */}
      <main className="w-full max-w-xl flex flex-col items-center gap-3">
        {/* 1. 乗客待機列 */}
        <section className="w-full bg-amber-50/95 rounded-2xl p-2.5 shadow-md border-2 border-amber-200">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white text-[10px] font-black">
                BUS STOP
              </span>
              <span className="text-[11px] font-extrabold text-slate-700">
                乗客待機列
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {passengerQueue[0] && (
                <span
                  className={
                    'text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm ' +
                    COLOR_STYLES[passengerQueue[0]].badge
                  }
                >
                  次は {COLOR_STYLES[passengerQueue[0]].name}
                </span>
              )}
              <span className="text-[11px] font-black text-slate-600 bg-amber-200/80 px-2 py-0.5 rounded-md">
                残り {passengerQueue.length}人
              </span>
            </div>
          </div>

          <div className="relative min-h-[52px] bg-stone-200/90 rounded-xl border-2 border-stone-300 px-2 pt-1.5 pb-1 flex items-end justify-end overflow-x-auto">
            <div className="relative z-10 flex flex-row-reverse items-end gap-1 pr-6">
              {passengerQueue.slice(0, 12).map((color, idx) => (
                <PassengerCharacter
                  key={idx + '-' + color + '-' + passengerQueue.length}
                  color={color}
                  isFront={idx === 0}
                />
              ))}
              {passengerQueue.length > 12 && (
                <div className="self-center mr-1 px-1.5 py-0.5 rounded-full bg-slate-700 text-white text-[10px] font-bold">
                  +{passengerQueue.length - 12}
                </div>
              )}
              {passengerQueue.length === 0 && (
                <span className="text-xs font-extrabold text-emerald-700 pr-4">
                  全員乗車完了！
                </span>
              )}
            </div>

            <div className="absolute right-1.5 bottom-0 top-1 flex flex-col items-center justify-end pointer-events-none">
              <div className="w-4 h-4 rounded-full bg-sky-600 border border-white shadow flex items-center justify-center text-[8px] font-black text-white">
                停
              </div>
              <div className="w-1 h-4 bg-slate-600" />
            </div>
          </div>
        </section>

        {/* 2. 待機レーン */}
        <section className="w-full bg-slate-700 rounded-2xl p-2.5 shadow-lg border-y-2 border-slate-800">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 mb-1.5 px-1">
            <span>🅿️ 待機レーン（最大{stage.slotsCount}台）</span>
            <span>満員で自動発車 ➔</span>
          </div>

          <div className={slotGridClass}>
            {slots.map((bus, idx) => {
              const style = bus ? COLOR_STYLES[bus.color] : null;
              const busCardClass = bus?.isDeparting
                ? 'w-full h-full rounded-lg flex flex-col items-center justify-between px-1.5 py-1 border-2 shadow-md transition-all duration-300 translate-x-6 opacity-0'
                : 'w-full h-full rounded-lg flex flex-col items-center justify-between px-1.5 py-1 border-2 shadow-md transition-all duration-200';

              return (
                <div
                  key={idx}
                  className="h-16 rounded-xl border-2 border-dashed border-amber-300/70 bg-slate-800/80 flex flex-col items-center justify-center p-1"
                >
                  {!bus ? (
                    <div className="text-center opacity-45">
                      <span className="text-[10px] font-black text-amber-200 block">
                        P{idx + 1}
                      </span>
                      <span className="text-[9px] text-slate-300">空き</span>
                    </div>
                  ) : (
                    <div
                      className={busCardClass}
                      style={{
                        backgroundColor: style!.bg,
                        borderColor: style!.border,
                      }}
                    >
                      <div className="w-full flex items-center justify-between text-[9px] font-black text-white leading-none">
                        <span>{bus.capacity === 6 ? 'BUS' : 'CAR'}</span>
                        <span>
                          {bus.passengers}/{bus.capacity}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-0.5 flex-wrap max-w-[44px]">
                        {Array.from({ length: bus.capacity }).map((_, seatIdx) => {
                          const filled = seatIdx < bus.passengers;
                          const dotClass = filled
                            ? 'w-1.5 h-1.5 rounded-full border bg-amber-300 border-white scale-110'
                            : 'w-1.5 h-1.5 rounded-full border bg-slate-900/40 border-white/40';
                          return <span key={seatIdx} className={dotClass} />;
                        })}
                      </div>

                      <div className="w-full text-center leading-none">
                        <span className="inline-block px-1 py-0.5 rounded bg-slate-900/75 text-[8px] font-bold text-white">
                          {bus.isDeparting
                            ? '発車！'
                            : passengerQueue[0] === bus.color
                            ? '乗車中'
                            : '待機'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. 駐車場グリッド盤面 */}
        <section className="w-full flex flex-col items-center pt-4">
          <div
            className="relative aspect-square bg-slate-800 rounded-2xl p-2.5 shadow-2xl border-4 border-slate-900"
            style={{
              width: 'min(86vw, 340px)',
              height: 'min(86vw, 340px)',
            }}
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 bg-emerald-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full shadow border border-emerald-300 whitespace-nowrap">
              ▲ EXIT（バス停へ） ▲
            </div>

            <div
              className="w-full h-full grid gap-1 relative"
              style={{
                gridTemplateColumns: 'repeat(' + stage.gridSize + ', minmax(0, 1fr))',
                gridTemplateRows: 'repeat(' + stage.gridSize + ', minmax(0, 1fr))',
              }}
            >
              {Array.from({ length: stage.gridSize * stage.gridSize }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-slate-700/80 border border-slate-600/60 flex items-center justify-center"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600/50" />
                </div>
              ))}

              <div className="absolute inset-0 pointer-events-none">
                {vehicles.map((v) => {
                  const cellPercent = 100 / stage.gridSize;
                  const top = v.row * cellPercent + '%';
                  const left = v.col * cellPercent + '%';
                  const width =
                    v.orientation === 'H'
                      ? v.length * cellPercent + '%'
                      : cellPercent + '%';
                  const height =
                    v.orientation === 'V'
                      ? v.length * cellPercent + '%'
                      : cellPercent + '%';

                  const isShaking = blockedVehicleId === v.id;
                  const canExit = exitableIds.has(v.id);
                  const btnClass = isShaking
                    ? 'absolute pointer-events-auto p-0.5 transition-transform -translate-x-1 rotate-2 z-20 cursor-pointer'
                    : 'absolute pointer-events-auto p-0.5 transition-transform active:scale-95 z-10 cursor-pointer';

                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleVehicleClick(v)}
                      style={{ top, left, width, height }}
                      className={btnClass}
                    >
                      <VehicleArtwork vehicle={v} isExitable={canExit} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mt-2 text-[11px] font-extrabold text-white drop-shadow text-center">
            車両をタップして矢印の方向へ脱出させよう！
          </p>
        </section>
      </main>

      {/* トースト通知 */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white px-4 py-2 rounded-full text-xs font-extrabold shadow-xl border border-slate-700">
          ⚠️ {toastMessage}
        </div>
      )}

      {/* 遊び方モーダル */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-slate-950/65 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border-2 border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-black text-slate-800">
                🚌 遊び方・ルール
              </h2>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-black text-slate-600"
              >
                ✕
              </button>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              <li className="bg-sky-50 p-2.5 rounded-xl">
                <strong className="text-slate-900 block">1. 進行方向に脱出させよう</strong>
                車両をタップすると矢印の方向へ進みます。前に車がいると出られないので外側から順番に動かしましょう。
              </li>
              <li className="bg-amber-50 p-2.5 rounded-xl">
                <strong className="text-slate-900 block">2. 同じ色の乗客を乗せよう</strong>
                脱出した車は待機レーンに停まり、先頭の乗客と同じ色なら自動で乗車して定員（車4人・バス6人）で発車します。
              </li>
              <li className="bg-rose-50 p-2.5 rounded-xl">
                <strong className="text-slate-900 block">3. 待機レーンの満車に注意！</strong>
                待機レーンがすべて埋まり、先頭の乗客が乗れる車がないと渋滞（ゲームオーバー）になります。
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-4 w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-lg"
            >
              プレイに戻る
            </button>
          </div>
        </div>
      )}

      {/* クリアモーダル */}
      {gameStatus === 'VICTORY' && (
        <div className="fixed inset-0 z-50 bg-slate-950/65 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-4 border-amber-300">
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-2xl font-black text-slate-800 mb-1">
              ステージクリア！
            </h2>
            <p className="text-xs font-bold text-slate-500 mb-5">
              すべての車両を脱出させ、乗客を送り届けました！
            </p>

            <div className="flex flex-col gap-2">
              {currentStageIdx < STAGES.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStageIdx((prev) => prev + 1)}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-lg"
                >
                  次のステージへ ➔
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentStageIdx(0)}
                  className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-base shadow-lg"
                >
                  全ステージ制覇！最初から遊ぶ
                </button>
              )}
              <button
                type="button"
                onClick={() => initStage(currentStageIdx)}
                className="w-full py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-sm"
              >
                もう一度遊ぶ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ゲームオーバーモーダル */}
      {gameStatus === 'GAMEOVER' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-4 border-rose-400">
            <div className="text-5xl mb-2">🚨</div>
            <h2 className="text-2xl font-black text-rose-600 mb-1">
              大渋滞発生！
            </h2>
            <p className="text-xs font-bold text-slate-600 mb-5 leading-relaxed">
              待機レーンがいっぱいで、先頭の
              {passengerQueue[0] && (
                <span className="underline decoration-2 mx-1">
                  {COLOR_STYLES[passengerQueue[0]].name}
                </span>
              )}
              の乗客が乗れるバスが停まれません！
            </p>

            <button
              type="button"
              onClick={() => initStage(currentStageIdx)}
              className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-base shadow-lg"
            >
              リトライする
            </button>
          </div>
        </div>
      )}
    </div>
  );
}