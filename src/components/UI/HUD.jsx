import React from 'react';
import { useStore } from '../../state/store';
import { Flame, Wind, Gauge, Sun, Moon, Target, ChevronUp, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export default function HUD() {
  const { flightData, controls, setControls, environment, setEnvironment, respawnNPCs } = useStore();

  return (
    <div className="fixed inset-0 pointer-events-none p-4 md:p-8 flex flex-col justify-between text-emerald-100 font-mono">
      {/* Top Bar: Stats & Time Control */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 pointer-events-auto">
        <div className="bg-black/80 border border-emerald-500/30 p-4 rounded-2xl backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-red-400">COMBAT_ACTIVE</span>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            <div className="flex items-center gap-2 text-emerald-400">
              <Target className="w-4 h-4" /> <span>SCORE:</span>
            </div>
            <div className="text-right font-black text-white">{flightData.score}</div>
            
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4" /> <span>SPD:</span>
            </div>
            <div className="text-right">{flightData.speed}</div>
            
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4" /> <span>ALT:</span>
            </div>
            <div className="text-right">{flightData.altitude}</div>
          </div>
          <button 
            onClick={respawnNPCs}
            className="mt-4 w-full py-1 text-[10px] bg-emerald-500/10 border border-emerald-500/20 rounded hover:bg-emerald-500/30 transition-colors"
          >
            RESPAWN_PREY
          </button>
        </div>

        <div className="bg-black/80 border border-white/10 p-4 rounded-2xl backdrop-blur-xl flex flex-col gap-3 min-w-[200px]">
           <div className="flex items-center justify-between text-[10px] uppercase opacity-50">
             <span>Cycle Control</span>
             {environment.time > 18 || environment.time < 6 ? <Moon className="w-3 h-3"/> : <Sun className="w-3 h-3"/>}
           </div>
           <input 
             type="range" min="0" max="24" step="0.1" 
             value={environment.time} 
             onChange={(e) => setEnvironment({ time: parseFloat(e.target.value) })}
             className="w-full accent-emerald-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
           />
           <div className="flex justify-between text-xs font-bold">
             <span className={environment.time < 12 ? "text-emerald-400" : ""}>DAWN</span>
             <span className="text-white/40">{Math.floor(environment.time)}:00</span>
             <span className={environment.time > 18 ? "text-blue-400" : ""}>DUSK</span>
           </div>
        </div>
      </div>

      {/* Mobile/On-Screen Controls */}
      <div className="flex justify-between items-end pointer-events-auto">
        {/* Movement D-PAD */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-black/40 rounded-3xl backdrop-blur-sm border border-white/5">
          <div />
          <button 
            onMouseDown={() => setControls({ forward: true })} onMouseUp={() => setControls({ forward: false })}
            onTouchStart={() => setControls({ forward: true })} onTouchEnd={() => setControls({ forward: false })}
            className="p-4 bg-white/5 rounded-xl active:bg-emerald-500/40"><ChevronUp /></button>
          <div />
          <button 
            onMouseDown={() => setControls({ left: true })} onMouseUp={() => setControls({ left: false })}
            onTouchStart={() => setControls({ left: true })} onTouchEnd={() => setControls({ left: false })}
            className="p-4 bg-white/5 rounded-xl active:bg-emerald-500/40"><ChevronLeft /></button>
          <button 
            onMouseDown={() => setControls({ backward: true })} onMouseUp={() => setControls({ backward: false })}
            onTouchStart={() => setControls({ backward: true })} onTouchEnd={() => setControls({ backward: false })}
            className="p-4 bg-white/5 rounded-xl active:bg-emerald-500/40"><ChevronDown /></button>
          <button 
            onMouseDown={() => setControls({ right: true })} onMouseUp={() => setControls({ right: false })}
            onTouchStart={() => setControls({ right: true })} onTouchEnd={() => setControls({ right: false })}
            className="p-4 bg-white/5 rounded-xl active:bg-emerald-500/40"><ChevronRight /></button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onMouseDown={() => setControls({ flap: true })} onMouseUp={() => setControls({ flap: false })}
            onTouchStart={() => setControls({ flap: true })} onTouchEnd={() => setControls({ flap: false })}
            className="w-20 h-20 bg-emerald-600/20 border-2 border-emerald-500/40 rounded-full flex items-center justify-center font-black active:scale-90 transition-transform"
          >
            FLAP
          </button>
          <button 
            onMouseDown={() => setControls({ fire: true })} onMouseUp={() => setControls({ fire: false })}
            onTouchStart={() => setControls({ fire: true })} onTouchEnd={() => setControls({ fire: false })}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center font-black active:scale-95 transition-all shadow-[0_0_30px_rgba(249,115,22,0.2)] ${controls.fire ? 'bg-orange-500 border-4 border-white' : 'bg-orange-600/40 border-2 border-orange-500'}`}
          >
            <Flame className={controls.fire ? 'animate-bounce' : ''} />
            <span className="text-[10px] mt-1">FIRE</span>
          </button>
        </div>
      </div>

      {/* Central Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
        <div className="w-16 h-16 border-2 border-emerald-500/20 rounded-full flex items-center justify-center">
          <div className="w-1 h-8 bg-emerald-500/40 absolute" />
          <div className="w-8 h-1 bg-emerald-500/40 absolute" />
        </div>
      </div>
    </div>
  );
}
