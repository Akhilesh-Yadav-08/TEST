import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Radio,
  Activity,
  RefreshCw,
  Pause,
  Play,
  MapPin,
  Calendar,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Match } from '../types/cricket';
import { api } from '../lib/api';
import { useTheme } from '../context/ThemeContext';

interface LiveMatchTickerProps {
  onViewMatch: (matchId: number) => void;
  className?: string;
}

// Country code & flag emoji lookup
const TEAM_META: Record<string, { code: string; flag: string }> = {
  india: { code: 'IND', flag: '🇮🇳' },
  australia: { code: 'AUS', flag: '🇦🇺' },
  england: { code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  pakistan: { code: 'PAK', flag: '🇵🇰' },
  'south africa': { code: 'SA', flag: '🇿🇦' },
  'new zealand': { code: 'NZ', flag: '🇳🇿' },
  'sri lanka': { code: 'SL', flag: '🇱🇰' },
  'west indies': { code: 'WI', flag: '🌴' },
  bangladesh: { code: 'BAN', flag: '🇧🇩' },
  afghanistan: { code: 'AFG', flag: '🇦🇫' },
};

function getTeamMeta(name: string, country?: string) {
  const key = (name || country || '').trim().toLowerCase();
  for (const [k, meta] of Object.entries(TEAM_META)) {
    if (key.includes(k)) return meta;
  }
  const clean = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
  return { code: clean.slice(0, 3) || 'TBD', flag: '🏏' };
}

function calculateMatchSummary(match: Match): { situation: string; crr?: string } {
  if (match.status === 'Completed') {
    const t1 = match.team1_runs ?? 0;
    const t2 = match.team2_runs ?? 0;
    const m1 = getTeamMeta(match.team1_name, match.team1_country);
    const m2 = getTeamMeta(match.team2_name, match.team2_country);
    if (t1 > t2) {
      return { situation: `${m1.code} won by ${t1 - t2} runs` };
    } else if (t2 > t1) {
      const wktsLeft = 10 - (match.team2_wickets ?? 0);
      return { situation: `${m2.code} won by ${wktsLeft} wkts` };
    }
    return { situation: 'Match tied' };
  }

  if (match.status === 'In Progress') {
    const m1 = getTeamMeta(match.team1_name, match.team1_country);
    const m2 = getTeamMeta(match.team2_name, match.team2_country);
    const t1Runs = match.team1_runs ?? 0;
    const t2Runs = match.team2_runs ?? 0;
    const t2Overs = match.team2_overs ?? 0;
    const t1Overs = match.team1_overs ?? 0;

    // Check if team 2 is batting (2nd innings)
    if (match.team2_score_id || t2Runs > 0 || t2Overs > 0) {
      const target = t1Runs + 1;
      const need = target - t2Runs;
      if (need > 0) {
        const ballsRemaining = Math.max(0, 300 - Math.round(t2Overs * 6));
        return {
          situation: `${m2.code} need ${need} runs in ${ballsRemaining}b (Target: ${target})`,
          crr: t2Overs > 0 ? (t2Runs / t2Overs).toFixed(2) : undefined,
        };
      } else {
        return {
          situation: `${m2.code} reached target`,
          crr: t2Overs > 0 ? (t2Runs / t2Overs).toFixed(2) : undefined,
        };
      }
    }

    // Team 1 is batting (1st innings)
    return {
      situation: `${m1.code} batting 1st · ${match.team1_overs ?? 0} ov`,
      crr: t1Overs > 0 ? (t1Runs / t1Overs).toFixed(2) : undefined,
    };
  }

  // Scheduled
  return {
    situation: `${match.venue} · ${match.match_date}`,
  };
}

export const LiveMatchTicker: React.FC<LiveMatchTickerProps> = ({
  onViewMatch,
  className = '',
}) => {
  const { isDark } = useTheme();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMatches = useCallback(async (showSpin = false) => {
    if (showSpin) setIsRefreshing(true);
    try {
      const data = await api.getMatches();
      // Sort matches:
      // 1. 'In Progress' matches first
      // 2. 'Scheduled' matches next
      // 3. 'Completed' matches
      const sorted = [...data].sort((a, b) => {
        const order: Record<string, number> = {
          'In Progress': 0,
          Scheduled: 1,
          Completed: 2,
        };
        const prioA = order[a.status] ?? 3;
        const prioB = order[b.status] ?? 3;
        if (prioA !== prioB) return prioA - prioB;
        return b.match_id - a.match_id;
      });
      setMatches(sorted);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error updating live ticker matches:', err);
    } finally {
      setLoading(false);
      if (showSpin) {
        setTimeout(() => setIsRefreshing(false), 600);
      }
    }
  }, []);

  useEffect(() => {
    fetchMatches(false);

    // Live match polling interval (every 8 seconds)
    pollingRef.current = setInterval(() => {
      fetchMatches(false);
    }, 8000);

    // Immediate re-fetch when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchMatches(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchMatches]);

  const liveCount = matches.filter((m) => m.status === 'In Progress').length;

  if (loading && matches.length === 0) {
    return (
      <div
        className={`w-full h-11 border-b flex items-center px-4 font-mono text-xs ${
          isDark
            ? 'bg-slate-950/80 border-amber-500/15 text-slate-400'
            : 'bg-white/90 border-slate-200 text-slate-500'
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>CONNECTING TO LIVE MATCH STREAM...</span>
        </span>
      </div>
    );
  }

  // Double list for infinite seamless marquee loop
  const displayItems = matches.length > 0 ? [...matches, ...matches] : [];

  return (
    <div
      className={`relative w-full border-b select-none overflow-hidden transition-colors duration-500 backdrop-blur-xl ${
        isDark
          ? 'bg-slate-950/90 border-amber-500/20 text-slate-100 shadow-lg shadow-black/40'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
      } ${className}`}
    >
      <div className="flex items-stretch h-11">
        {/* ========================================================= */}
        {/* Fixed Broadcast Badge (Pinned Left)                       */}
        {/* ========================================================= */}
        <div
          className={`shrink-0 z-20 flex items-center gap-2 px-3.5 sm:px-4 border-r font-mono text-xs font-bold uppercase tracking-wider backdrop-blur-2xl ${
            isDark
              ? 'bg-slate-950/95 border-amber-500/25 text-white'
              : 'bg-slate-50/95 border-slate-200 text-slate-900'
          }`}
        >
          {liveCount > 0 ? (
            <span className="relative flex items-center gap-1.5 text-red-500 font-black">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
              </span>
              <span>LIVE</span>
              <span className="hidden sm:inline font-mono px-1.5 py-0.2 rounded bg-red-500/10 text-[10px] text-red-400 border border-red-500/20">
                {liveCount}
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-500 font-black">
              <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>MATCH FEED</span>
            </span>
          )}

          <span
            className={`hidden md:inline text-[11px] font-normal tracking-normal ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            · ICC Championship
          </span>
        </div>

        {/* ========================================================= */}
        {/* Continuous Broadcast Marquee Track                        */}
        {/* ========================================================= */}
        <div className="relative flex-1 overflow-hidden flex items-center">
          {matches.length === 0 ? (
            <div className="px-4 text-xs font-mono text-slate-500 italic">
              No tournament fixtures currently registered.
            </div>
          ) : (
            <div
              className={`animate-broadcast-ticker flex items-center py-1 ${
                isPaused ? 'ticker-paused' : ''
              }`}
            >
              {displayItems.map((match, idx) => {
                const meta1 = getTeamMeta(match.team1_name, match.team1_country);
                const meta2 = getTeamMeta(match.team2_name, match.team2_country);
                const summary = calculateMatchSummary(match);
                const isLive = match.status === 'In Progress';
                const isFinal = match.status === 'Completed';

                return (
                  <button
                    key={`${match.match_id}-${idx}`}
                    onClick={() => onViewMatch(match.match_id)}
                    className={`group shrink-0 mx-2 px-3.5 py-1.5 rounded-lg border text-left transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                      isLive
                        ? isDark
                          ? 'bg-red-950/20 hover:bg-red-900/30 border-red-500/30 hover:border-red-400 shadow-xs shadow-red-950/50'
                          : 'bg-red-50/80 hover:bg-red-100/90 border-red-200 text-slate-900'
                        : isFinal
                        ? isDark
                          ? 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-amber-500/40'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        : isDark
                        ? 'bg-slate-900/40 hover:bg-slate-800/70 border-slate-800/80 hover:border-slate-700'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {/* Status Pill */}
                    <div className="flex items-center gap-1.5">
                      {isLive && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-500 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span>LIVE</span>
                        </span>
                      )}
                      {isFinal && (
                        <span
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-1 rounded ${
                            isDark
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          FINAL
                        </span>
                      )}
                      {!isLive && !isFinal && (
                        <span
                          className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-1 rounded ${
                            isDark
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          UPCOMING
                        </span>
                      )}
                    </div>

                    {/* Team Matchup & Scores */}
                    <div className="flex items-center gap-2 font-mono text-xs">
                      {/* Team 1 */}
                      <span className="flex items-center gap-1 font-bold whitespace-nowrap">
                        <span>{meta1.flag}</span>
                        <span>{meta1.code}</span>
                        {match.team1_runs !== null && match.team1_runs !== undefined && (
                          <span
                            className={`tabular-nums ml-0.5 ${
                              isLive ? 'text-amber-400 font-black' : ''
                            }`}
                          >
                            {match.team1_runs}/{match.team1_wickets ?? 0}
                          </span>
                        )}
                      </span>

                      <span
                        className={`text-[10px] uppercase ${
                          isDark ? 'text-slate-600' : 'text-slate-400'
                        }`}
                      >
                        vs
                      </span>

                      {/* Team 2 */}
                      <span className="flex items-center gap-1 font-bold whitespace-nowrap">
                        <span>{meta2.flag}</span>
                        <span>{meta2.code}</span>
                        {match.team2_runs !== null && match.team2_runs !== undefined && (
                          <span
                            className={`tabular-nums ml-0.5 ${
                              isLive ? 'text-amber-400 font-black' : ''
                            }`}
                          >
                            {match.team2_runs}/{match.team2_wickets ?? 0}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Contextual commentary snippet / situation */}
                    <div
                      className={`hidden lg:flex items-center gap-1.5 text-[11px] font-sans truncate max-w-[200px] ${
                        isLive
                          ? isDark
                            ? 'text-amber-300 font-medium'
                            : 'text-amber-900 font-semibold'
                          : isDark
                          ? 'text-slate-400'
                          : 'text-slate-500'
                      }`}
                    >
                      <span>•</span>
                      <span className="truncate">{summary.situation}</span>
                    </div>

                    {/* View prompt indicator */}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* Right Broadcast Controls (Play/Pause, Manual Refresh)     */}
        {/* ========================================================= */}
        <div
          className={`shrink-0 z-20 flex items-center gap-1 px-2.5 sm:px-3 border-l backdrop-blur-2xl ${
            isDark
              ? 'bg-slate-950/95 border-amber-500/25 text-slate-300'
              : 'bg-slate-50/95 border-slate-200 text-slate-700'
          }`}
        >
          {/* Pause / Play Toggle */}
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? 'Resume live ticker scroll' : 'Pause live ticker scroll'}
            title={isPaused ? 'Resume Marquee' : 'Pause Marquee'}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                : 'hover:bg-slate-200 text-slate-600 hover:text-slate-950'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Instant Refresh Button */}
          <button
            onClick={() => fetchMatches(true)}
            aria-label="Refresh live scores"
            title={`Refresh scores (Last synced: ${lastUpdated.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })})`}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                : 'hover:bg-slate-200 text-slate-600 hover:text-slate-950'
            }`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
