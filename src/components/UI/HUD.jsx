import React from 'react';
import { useStore } from '../../state/store';
import { Wind, Navigation, Flame, Sun, CloudRain } from 'lucide-react';

export default function HUD() {
  const { flightData, controls, environment, setEnvironment } = useStore();

  return (
    <div className="fixed inset-0 pointer-events-none p-6 flex flex-col justify-between text-white font-mono">
      {/* Top Section */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="bg-black/50 p-4 rounded-lg backdrop-blur-md border border-white/10">
          <h1 className="text-xl font-bold text-emerald-400 mb-2">DRAGON.SIM v1.0</h1>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-8">
              <span>SPEED:</span>
              <span className="text-emerald-300 font-bold">{flightData.speed} KT</span>
            </div>
            <div className="flex justify-between gap-8">
              <span>ALTITUDE:</span>
              <span className="text-emerald-300 font-bold">{flightData.altitude} FT</span>
            </div>
          </div>
        </div>

        <div className="bg-black/50 p-4 rounded-lg backdrop-blur-md border border-white/10 flex gap-4">
          <button 
            onClick={() => setEnvironment({ time: (environment.time + 3) % 24 })}
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
          >
            <Sun className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setEnvironment({ weather: environment.weather === 'clear' ? 'fog' : 'clear' })}
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
          >
            <CloudRain className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Middle - Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white/20 w-8 h-8 rounded-full flex items-center justify-center">
        <div className="w-1 h-1 bg-white/50 rounded-full" />
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end">
        <div className="bg-black/50 p-4 rounded-lg backdrop-blur-md border border-white/10 max-w-xs">
          <p className="text-xs text-white/50 mb-2 uppercase tracking-widest">Controls</p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <span>[W] FORWARD</span>
            <span>[S] BRAKE</span>
            <span>[A/D] STEER</span>
            <span>[SPACE] FLAP/LIFT</span>
            <span>[SHIFT] BOOST</span>
            <span>[F] FIRE BREATH</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-end">
          {controls.fire && (
             <div className="flex items-center gap-2 text-orange-500 animate-pulse font-bold">
               <Flame className="w-6 h-6" />
               FIRE BREATH ACTIVE
             </div>
          )}
          <div className="bg-black/50 p-4 rounded-lg backdrop-blur-md border border-white/10 text-right">
            <p className="text-xs text-white/50">SYSTEM STATUS</p>
            <p className="text-emerald-400">FLIGHT READY</p>
          </div>
        </div>
      </div>
    </div>
  );
}
