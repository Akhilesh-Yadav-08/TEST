import React, { useRef } from 'react';
import {
  Users,
  Shield,
  Calendar,
  Activity,
  Flame,
  ArrowRight,
  Award,
  ChevronRight,
  Sparkles,
  Trophy,
  Zap,
  Target,
  Compass,
  RotateCw,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ChampionshipHero } from './ChampionshipHero';
import { CricketGoatsSection } from './CricketGoatsSection';
import { LiveMatchTicker } from './LiveMatchTicker';
import { CorkBallScrollCanvas } from './CorkBallScrollCanvas';
import { InteractiveCricketPitchMap } from './InteractiveCricketPitchMap';
import { CricketerAvatar } from './CricketerAvatar';
import { DashboardStats, Match } from '../types/cricket';
import { useTheme } from '../context/ThemeContext';

interface DashboardViewProps {
  stats: DashboardStats | null;
  loading: boolean;
  onNavigate: (tab: string) => void;
  onViewMatch: (matchId: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  loading,
  onNavigate,
  onViewMatch,
}) => {
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  const handleScrollToContent = () => {
    contentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || !stats) {
    return (
      <div className="space-y-6 bg-black min-h-screen">
        <LiveMatchTicker onViewMatch={onViewMatch} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="h-96 rounded-3xl bg-white/[0.03] border border-white/10 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const maxRuns = stats.topScorers.length > 0 ? stats.topScorers[0].total_runs : 1;
  const maxWickets = stats.topBowlers.length > 0 ? stats.topBowlers[0].total_wickets : 1;

  return (
    <div className="space-y-12 bg-black min-h-screen text-white select-none">
      {/* 1. Broadcast Live Match Ticker Marquee */}
      <LiveMatchTicker onViewMatch={onViewMatch} />

      {/* 2. Championship Hero Arena with 3D Rotating Trophy */}
      <ChampionshipHero
        onScrollToContent={handleScrollToContent}
        onNavigate={onNavigate}
      />

      {/* 3. Main Tournament Content Viewport */}
      <div
        ref={contentSectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 z-10 relative"
      >
        {/* ============================================================ */}
        {/* SCROLL-DRIVEN 3D CORK BALL ARENA                             */}
        {/* ============================================================ */}
        <div className="py-8 border-y border-white/10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-amber-400">
                <RotateCw className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Scroll-Driven Kinematics · Real 3D Canvas</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Authentic 156g Test Cork Ball
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                As you scroll the page, the 3D leather cork ball tumbles and rotates dynamically in physical 3D space with genuine seam precession. Zero static pictures or flat graphics.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Shield className="w-3.5 h-3.5" />
                  Grade-1 Crimson Leather
                </span>
                <span>·</span>
                <span>Hand-Stitched Cotton Seam</span>
                <span>·</span>
                <span className="text-emerald-400">Interactive Drag Supported</span>
              </div>
            </div>

            {/* Live 3D Cork Ball Canvas embedded stage */}
            <div className="w-full lg:w-96 flex justify-center">
              <CorkBallScrollCanvas variant="embedded" />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TOURNAMENT LEDGER (BORDERLESS FLUID TYPOGRAPHY)              */}
        {/* ============================================================ */}
        <div className="py-6 border-b border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              National Squads
            </div>
            <div className="text-4xl lg:text-5xl font-black font-mono tracking-tight mt-1 tabular-nums text-white">
              {stats.totalTeams}
            </div>
            <div className="text-xs text-slate-400 mt-1">International Championship Roster</div>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Rostered Athletes
            </div>
            <div className="text-4xl lg:text-5xl font-black font-mono tracking-tight mt-1 tabular-nums text-white">
              {stats.totalPlayers}
            </div>
            <div className="text-xs text-slate-400 mt-1">Across 4 Playing Disciplines</div>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Tournament Fixtures
            </div>
            <div className="text-4xl lg:text-5xl font-black font-mono tracking-tight mt-1 tabular-nums text-white">
              {stats.totalMatches}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {stats.completedMatches} Completed · Live Match Center
            </div>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Championship Runs
            </div>
            <div className="text-4xl lg:text-5xl font-black font-mono tracking-tight mt-1 tabular-nums text-white">
              {stats.totalRuns.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {stats.totalWickets} Tournament Dismissals
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE PITCH & WAGON WHEEL ANALYZER                     */}
        {/* ============================================================ */}
        <InteractiveCricketPitchMap />

        {/* ============================================================ */}
        {/* EDITORIAL CAMPAIGN SHOWCASE BANNER                           */}
        {/* ============================================================ */}
        <div className="py-8 px-6 sm:px-10 rounded-3xl bg-gradient-to-r from-amber-500/10 via-black to-black border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>Cinematic Campaign Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Immersive Editorial Cricketer Showcase
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Experience Sachin, Virat, Dhoni, Vivian Richards, and Warne with full-bleed cinematic atmospheres, signature shot reels, and career records.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('goats')}
            className="px-6 py-3.5 text-xs font-black uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 rounded-xl shadow-xl shadow-amber-500/25 cursor-pointer shrink-0 inline-flex items-center gap-2"
          >
            <span>Launch Showcase</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* ============================================================ */}
        {/* HALL OF GOATS SHOWCASE PREVIEW                               */}
        {/* ============================================================ */}
        <CricketGoatsSection />

        {/* ============================================================ */}
        {/* LEADERBOARDS WITH REAL ATHLETE PORTRAITS                     */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Leading Run Scorers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Leading Run Scorers</h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Official Tournament Batting Leaderboard
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('players')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Full Roster</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {stats.topScorers.map((scorer, idx) => {
                const runPercent = Math.min(100, Math.round((scorer.total_runs / maxRuns) * 100));
                return (
                  <div
                    key={scorer.player_id}
                    className="py-3.5 px-2 hover:bg-white/[0.03] rounded-2xl transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-amber-500/40">
                          {idx + 1}
                        </span>
                        {/* Real Cricketer Portrait */}
                        <CricketerAvatar name={scorer.player_name} size="md" borderColor="border-amber-400/50" />
                        <div>
                          <div className="text-sm font-bold text-white">
                            {scorer.player_name}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                            <span>{scorer.team_name}</span>
                            <span>·</span>
                            <span className="text-slate-500">{scorer.role}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-black text-amber-400 font-mono tabular-nums">
                          {scorer.total_runs}{' '}
                          <span className="text-xs font-normal text-slate-400 font-sans">runs</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                          {scorer.total_balls} balls ({scorer.innings_played} inn)
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${runPercent}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leading Wicket Takers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Leading Wicket Takers</h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Official Tournament Bowling Leaderboard
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('players')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Full Roster</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-white/5">
              {stats.topBowlers.map((bowler, idx) => {
                const wktPercent = Math.min(100, Math.round((bowler.total_wickets / maxWickets) * 100));
                return (
                  <div
                    key={bowler.player_id}
                    className="py-3.5 px-2 hover:bg-white/[0.03] rounded-2xl transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/40">
                          {idx + 1}
                        </span>
                        {/* Real Cricketer Portrait */}
                        <CricketerAvatar name={bowler.player_name} size="md" borderColor="border-emerald-400/50" />
                        <div>
                          <div className="text-sm font-bold text-white">
                            {bowler.player_name}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                            <span>{bowler.team_name}</span>
                            <span>·</span>
                            <span className="text-slate-500">{bowler.role}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-black text-emerald-400 font-mono tabular-nums">
                          {bowler.total_wickets}{' '}
                          <span className="text-xs font-normal text-slate-400 font-sans">wkts</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                          {bowler.total_overs.toFixed(1)} ov ({bowler.matches_played} matches)
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${wktPercent}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RECENT MATCH CENTER (FLUID BROADCAST STRIPS)                 */}
        {/* ============================================================ */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Official Match Center
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Live championship scorecards and scheduled fixtures
              </p>
            </div>
            <button
              onClick={() => onNavigate('matches')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>All Fixtures</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.recentMatches.map((match: Match) => {
              const hasScores = match.team1_runs !== null || match.team2_runs !== null;
              const isLive = match.status === 'In Progress';
              return (
                <div
                  key={match.match_id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                    isLive
                      ? 'bg-black border-amber-500/50 shadow-2xl shadow-amber-500/10'
                      : 'bg-black border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-white/10">
                      <span className="font-mono">{match.match_date}</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] font-mono ${
                          match.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                            : match.status === 'In Progress'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center gap-1.5'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {match.status === 'In Progress' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        )}
                        {match.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-white">
                          {match.team1_name}
                        </span>
                        <span className="text-base font-mono font-bold text-white tabular-nums">
                          {match.team1_runs !== null ? (
                            <>
                              {match.team1_runs}/{match.team1_wickets}{' '}
                              <span className="text-xs font-normal text-slate-400">
                                ({match.team1_overs} ov)
                              </span>
                            </>
                          ) : (
                            <span className="text-xs font-normal text-slate-500">Yet to bat</span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-white">
                          {match.team2_name}
                        </span>
                        <span className="text-base font-mono font-bold text-white tabular-nums">
                          {match.team2_runs !== null ? (
                            <>
                              {match.team2_runs}/{match.team2_wickets}{' '}
                              <span className="text-xs font-normal text-slate-400">
                                ({match.team2_overs} ov)
                              </span>
                            </>
                          ) : (
                            <span className="text-xs font-normal text-slate-500">Yet to bat</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 truncate pt-2 border-t border-white/10 font-mono">
                      {match.venue}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 flex items-center justify-between border-t border-white/10">
                    <button
                      onClick={() => onViewMatch(match.match_id)}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>{hasScores ? 'Full Scorecard' : 'Match Details'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigate('scores')}
                      className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                    >
                      {isLive ? 'Live Ball-by-Ball' : 'Score Entry'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
