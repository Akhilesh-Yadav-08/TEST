import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Zap, Activity, Compass, Flame, ArrowUpRight, Shield, Award } from 'lucide-react';
import { getCricketerPhoto } from '../data/cricketerImages';

interface PitchZone {
  id: string;
  name: string;
  lengthRange: string;
  speed: string;
  swingAngle: string;
  wicketRate: string;
  economy: string;
  specialist: string;
  specialistTeam: string;
  description: string;
  color: string;
  gradient: string;
}

const PITCH_ZONES: PitchZone[] = [
  {
    id: 'yorker',
    name: 'Toe-Crusher Yorker',
    lengthRange: '0.0m – 1.8m from Batting Stumps',
    speed: '146.4 km/h',
    swingAngle: '2.1° Late Reverse Swing',
    wicketRate: '34.8%',
    economy: '4.6 rpo',
    specialist: 'Jasprit Bumrah',
    specialistTeam: 'India',
    description: 'Drifting into the base of the off and middle stump at 145+ km/h. Leaves almost zero bat response time and directly attacks the woodwork or front toe in front of the stumps.',
    color: '#ef4444',
    gradient: 'from-rose-500/20 to-red-600/30',
  },
  {
    id: 'full',
    name: 'Full Pitch / Half Volley',
    lengthRange: '2.0m – 4.2m from Stumps',
    speed: '141.2 km/h',
    swingAngle: '3.4° Conventional Outswing',
    wicketRate: '21.5%',
    economy: '7.8 rpo',
    specialist: 'Mitchell Starc',
    specialistTeam: 'Australia',
    description: 'Invites the drive through the covers or down the ground. Seams late across the right-hander, seeking the outside edge to the keeper and cordon slips.',
    color: '#f59e0b',
    gradient: 'from-amber-500/20 to-yellow-600/30',
  },
  {
    id: 'good-length',
    name: 'Corridor of Uncertainty (Good Length)',
    lengthRange: '5.5m – 7.2m (The Optimum Zone)',
    speed: '143.8 km/h',
    swingAngle: '1.9° Sharp Seam Movement',
    wicketRate: '42.2%',
    economy: '3.9 rpo',
    specialist: 'Pat Cummins',
    specialistTeam: 'Australia',
    description: 'The golden territory in test and ODI cricket. Forces the batsman into hesitation between front foot and back foot defense, producing maximum knicks and bowled dismissals.',
    color: '#10b981',
    gradient: 'from-emerald-500/20 to-teal-600/30',
  },
  {
    id: 'back-of-length',
    name: 'Heavy Ball (Back of Length)',
    lengthRange: '7.5m – 9.0m from Stumps',
    speed: '148.1 km/h',
    swingAngle: 'Steep Rib-Height Trampoline',
    wicketRate: '28.1%',
    economy: '5.2 rpo',
    specialist: 'Kagiso Rabada',
    specialistTeam: 'South Africa',
    description: 'Hits the splice of the bat with steep bounce off a firm deck. Cramps the batsman for room on the cut and forces miscued aerial pulls to square leg.',
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-indigo-600/30',
  },
  {
    id: 'bouncer',
    name: 'Throat Bouncer / Short Ball',
    lengthRange: '9.2m – 12.0m from Stumps',
    speed: '150.2 km/h',
    swingAngle: 'Helmet-Level Hostile Trajectory',
    wicketRate: '19.4%',
    economy: '6.4 rpo',
    specialist: 'Jofra Archer',
    specialistTeam: 'England',
    description: 'Uncompromising pace targeted at the batsman’s chest and helmet badge. Forces reflex defensive ducking or high-risk top-edge hook shots towards fine leg.',
    color: '#a855f7',
    gradient: 'from-purple-500/20 to-fuchsia-600/30',
  },
];

interface WagonSector {
  id: string;
  name: string;
  runsPercent: number;
  boundaries: number;
  keyShot: string;
  master: string;
  masterTeam: string;
  angle: number;
  color: string;
}

const WAGON_SECTORS: WagonSector[] = [
  { id: 'cover', name: 'Cover Drive & Extra Cover', runsPercent: 26, boundaries: 48, keyShot: 'High-Elbow Cover Drive', master: 'Virat Kohli', masterTeam: 'India', angle: 300, color: '#38bdf8' },
  { id: 'point', name: 'Point & Third Man', runsPercent: 14, boundaries: 22, keyShot: 'Backfoot Square Cut & Glide', master: 'Steve Smith', masterTeam: 'Australia', angle: 250, color: '#a78bfa' },
  { id: 'straight', name: 'Straight Down Ground & Long-Off', runsPercent: 19, boundaries: 34, keyShot: 'Punched Straight Drive', master: 'Sachin Tendulkar', masterTeam: 'India', angle: 0, color: '#fbbf24' },
  { id: 'mid-on', name: 'Mid-On & Long-On', runsPercent: 12, boundaries: 18, keyShot: 'Lofted On-Drive', master: 'Kane Williamson', masterTeam: 'New Zealand', angle: 60, color: '#34d399' },
  { id: 'mid-wicket', name: 'Mid-Wicket & Cow Corner', runsPercent: 21, boundaries: 42, keyShot: 'Authoritative Pull Shot', master: 'Rohit Sharma', masterTeam: 'India', angle: 110, color: '#f87171' },
  { id: 'fine-leg', name: 'Square Leg & Fine Leg', runsPercent: 8, boundaries: 14, keyShot: 'Flick / Paddle Sweep', master: 'Ben Stokes', masterTeam: 'England', angle: 160, color: '#f472b6' },
];

export const InteractiveCricketPitchMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pitch' | 'wagon'>('pitch');
  const [selectedZone, setSelectedZone] = useState<PitchZone>(PITCH_ZONES[2]); // Default Good Length
  const [selectedSector, setSelectedSector] = useState<WagonSector>(WAGON_SECTORS[0]); // Default Cover Drive

  return (
    <div className="relative z-10 w-full py-8 space-y-8 select-none">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Broadcast Telemetry Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Tactical Pitch & Wagon Wheel Analyzer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1">
            Click into delivery lengths on the 22-yard turf or rotate through field sectors to inspect real ball trajectory, dismissal rates, and master athlete mechanics.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-2xl">
          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'pitch'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>22-Yard Pitch Lengths</span>
          </button>
          <button
            onClick={() => setActiveTab('wagon')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'wagon'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>360° Wagon Wheel</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. PITCH LENGTH INTERACTIVE VISUALIZER                       */}
      {/* ============================================================ */}
      {activeTab === 'pitch' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Pitch Graphic & Interactive Zones */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-md bg-gradient-to-b from-[#18120c] via-[#241a12] to-[#140e08] rounded-3xl p-6 border border-amber-500/20 shadow-2xl relative overflow-hidden">
              {/* Bowling Stumps & Crease */}
              <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Bowling End (Release: 2.1m)
                </span>
                <span>Stumps: 3 Wooden Pegs</span>
              </div>

              {/* 5 Interactive Pitch Zones */}
              <div className="py-4 space-y-2.5 relative">
                {/* Visual delivery line animation */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 border-l border-dashed border-white/20 pointer-events-none" />

                {PITCH_ZONES.map((zone) => {
                  const isSelected = selectedZone.id === zone.id;
                  return (
                    <motion.div
                      key={zone.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedZone(zone)}
                      className={`relative p-3.5 rounded-2xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'border-amber-400 bg-white/10 shadow-lg shadow-amber-500/10'
                          : 'border-white/5 bg-black/40 hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: zone.color }}
                          />
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              <span>{zone.name}</span>
                              {isSelected && (
                                <span className="text-[10px] font-mono bg-amber-400 text-black px-1.5 py-0.2 rounded font-bold">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {zone.lengthRange}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {zone.wicketRate}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block">Wicket Pct</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Batting Crease & Popping Stumps */}
              <div className="flex items-center justify-between pt-4 border-t border-amber-500/20 text-[10px] font-mono text-slate-400">
                <span className="text-emerald-400 font-bold">Batting Crease & Guard</span>
                <span>Popping Crease (4ft)</span>
              </div>
            </div>
          </div>

          {/* Active Zone Detail Telemetry & Real Cricketer Card */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedZone.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Zone Telemetry Ledger */}
                <div className="p-6 rounded-3xl bg-black/80 border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg"
                      style={{ backgroundColor: `${selectedZone.color}25`, color: selectedZone.color }}
                    >
                      {selectedZone.name}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {selectedZone.lengthRange}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {selectedZone.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Avg Speed</div>
                      <div className="text-base font-black font-mono text-white mt-0.5">
                        {selectedZone.speed}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Seam Deviation</div>
                      <div className="text-base font-black font-mono text-amber-400 mt-0.5">
                        {selectedZone.swingAngle}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Economy Rate</div>
                      <div className="text-base font-black font-mono text-emerald-400 mt-0.5">
                        {selectedZone.economy}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specialist Athlete Spotlight with Real Photo */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-black to-black border border-amber-500/30 flex items-center gap-4">
                  <img
                    src={getCricketerPhoto(selectedZone.specialist)}
                    alt={selectedZone.specialist}
                    className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-amber-400 shadow-lg shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                      <Flame className="w-3 h-3 fill-amber-400" />
                      <span>Benchmark Zone Specialist</span>
                    </div>
                    <div className="text-base font-black text-white">
                      {selectedZone.specialist}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {selectedZone.specialistTeam} · Premier Fast Bowler
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. 360° WAGON WHEEL SHOT SELECTOR                            */}
      {/* ============================================================ */}
      {activeTab === 'wagon' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive Wagon Wheel Dial */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-md aspect-square rounded-full bg-gradient-to-br from-[#0c140c] via-black to-[#050a05] border border-emerald-500/30 p-6 relative flex items-center justify-center shadow-2xl">
              {/* Outer Boundary Ring */}
              <div className="absolute inset-4 rounded-full border border-dashed border-emerald-500/20 pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-emerald-500/15 pointer-events-none" />
              <div className="absolute inset-28 rounded-full border border-emerald-500/10 pointer-events-none" />

              {/* Pitch in the Center */}
              <div className="w-10 h-24 bg-amber-800/60 rounded-md border border-amber-500/40 z-10 flex flex-col justify-between items-center py-1">
                <span className="w-4 h-1 bg-white/70 rounded-full" />
                <span className="text-[8px] font-mono text-amber-200 font-bold rotate-90">22 YDS</span>
                <span className="w-4 h-1 bg-white/70 rounded-full" />
              </div>

              {/* Sector Laser Rays */}
              {WAGON_SECTORS.map((sector) => {
                const isSelected = selectedSector.id === sector.id;
                // Position radially
                const rad = (sector.angle * Math.PI) / 180;
                const distPercent = 42;
                const left = 50 + Math.sin(rad) * distPercent;
                const top = 50 - Math.cos(rad) * distPercent;

                return (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector)}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap border ${
                      isSelected
                        ? 'bg-amber-400 text-black border-amber-300 scale-110 shadow-lg shadow-amber-400/40'
                        : 'bg-black/80 text-white border-white/20 hover:border-amber-400/60 hover:scale-105'
                    }`}
                  >
                    <span>{sector.name.split(' ')[0]}</span>
                    <span className="block text-[9px] opacity-80">{sector.runsPercent}% Runs</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Sector Telemetry with Real Master Cricketer Portrait */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSector.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-3xl bg-black/80 border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                      {selectedSector.name}
                    </span>
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      {selectedSector.runsPercent}% of Total Innings Runs
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Signature Stroke</div>
                    <div className="text-lg font-black text-white">{selectedSector.keyShot}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Boundary Ratio</div>
                      <div className="text-xl font-black font-mono text-amber-400 mt-0.5">
                        {selectedSector.boundaries}% Boundaries
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Fielding Risk</div>
                      <div className="text-xl font-black font-mono text-emerald-400 mt-0.5">
                        Low · Grounded
                      </div>
                    </div>
                  </div>
                </div>

                {/* Master Batsman Showcase with Real Photo */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-black to-black border border-emerald-500/30 flex items-center gap-4">
                  <img
                    src={getCricketerPhoto(selectedSector.master)}
                    alt={selectedSector.master}
                    className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-emerald-400 shadow-lg shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                      <Award className="w-3 h-3 text-emerald-400" />
                      <span>Signature Stroke Virtuoso</span>
                    </div>
                    <div className="text-base font-black text-white">
                      {selectedSector.master}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {selectedSector.masterTeam} · {selectedSector.keyShot}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
