import React, { useState, useEffect } from 'react';
import { Plus, Search, User, Edit2, Trash2, AlertCircle, Shield, Award, LayoutGrid, List, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, Team, PlayerRole } from '../types/cricket';
import { api } from '../lib/api';
import { useTheme } from '../context/ThemeContext';
import { CricketerAvatar } from './CricketerAvatar';
import { getCricketerMeta } from '../data/cricketerImages';

interface PlayersViewProps {
  teams: Team[];
  initialTeamFilter?: number | null;
  onClearInitialFilter?: () => void;
}

const ROLES: PlayerRole[] = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'];

export const PlayersView: React.FC<PlayersViewProps> = ({
  teams,
  initialTeamFilter,
  onClearInitialFilter,
}) => {
  const { isDark } = useTheme();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>(initialTeamFilter ? initialTeamFilter.toString() : '');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [viewMode, setViewMode] = useState<'gallery' | 'table'>('gallery');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState<PlayerRole>('Batsman');
  const [playerTeamId, setPlayerTeamId] = useState<number>(teams[0]?.team_id || 0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deletingPlayer, setDeletingPlayer] = useState<Player | null>(null);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const teamId = selectedTeam ? parseInt(selectedTeam, 10) : undefined;
      const role = selectedRole || undefined;
      const data = await api.getPlayers({ team_id: teamId, role, search: search.trim() || undefined });
      setPlayers(data);
    } catch (err) {
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlayers();
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedTeam, selectedRole, search]);

  useEffect(() => {
    if (initialTeamFilter) {
      setSelectedTeam(initialTeamFilter.toString());
    }
  }, [initialTeamFilter]);

  const handleOpenAdd = () => {
    setEditingPlayer(null);
    setPlayerName('');
    setPlayerRole('Batsman');
    setPlayerTeamId(teams[0]?.team_id || 0);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (player: Player) => {
    setEditingPlayer(player);
    setPlayerName(player.player_name);
    setPlayerRole(player.role);
    setPlayerTeamId(player.team_id);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setErrorMsg('Player name is required.');
      return;
    }
    if (!playerTeamId) {
      setErrorMsg('Please select a valid team.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingPlayer) {
        await api.updatePlayer(editingPlayer.player_id, {
          player_name: playerName.trim(),
          role: playerRole,
          team_id: playerTeamId,
        });
      } else {
        await api.createPlayer({
          player_name: playerName.trim(),
          role: playerRole,
          team_id: playerTeamId,
        });
      }
      setIsModalOpen(false);
      fetchPlayers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPlayer) return;
    try {
      await api.deletePlayer(deletingPlayer.player_id);
      setDeletingPlayer(null);
      fetchPlayers();
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Batsman':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
      case 'Bowler':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
      case 'All-Rounder':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/60';
      case 'Wicket-Keeper':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/60';
      default:
        return 'bg-white/10 text-slate-300 border-white/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Official Tournament Roster</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            International Athletes Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real photographic portraits, playing disciplines, and verified championship career aggregates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-2xl">
            <button
              onClick={() => setViewMode('gallery')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'gallery'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Portrait Gallery View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Compact Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenAdd}
            className="px-4 py-2.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-amber-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Player</span>
          </motion.button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-black border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by player name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            />
          </div>

          {/* Team Filter Dropdown */}
          <select
            value={selectedTeam}
            onChange={(e) => {
              setSelectedTeam(e.target.value);
              if (onClearInitialFilter) onClearInitialFilter();
            }}
            className="px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
          >
            <option value="" className="bg-black text-white">All National Squads</option>
            {teams.map((t) => (
              <option key={t.team_id} value={t.team_id} className="bg-black text-white">
                {t.team_name} ({t.country})
              </option>
            ))}
          </select>

          {/* Role Filter Dropdown */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
          >
            <option value="" className="bg-black text-white">All Playing Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r} className="bg-black text-white">
                {r}
              </option>
            ))}
          </select>

          {(selectedTeam || selectedRole || search) && (
            <button
              onClick={() => {
                setSelectedTeam('');
                setSelectedRole('');
                setSearch('');
                if (onClearInitialFilter) onClearInitialFilter();
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-mono cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="text-xs font-mono text-slate-400 tabular-nums">
          {players.length} players listed
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-white/[0.03] border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : players.length === 0 ? (
        <div className="p-12 text-center space-y-2 border border-white/10 rounded-3xl bg-black">
          <User className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">
            No athletes match the criteria
          </h3>
          <p className="text-xs text-slate-500">Try adjusting your filters or search terms.</p>
        </div>
      ) : viewMode === 'gallery' ? (
        /* ============================================================ */
        /* GALLERY VIEW: AUTHENTIC CRICKETER PORTRAIT CARDS             */
        /* ============================================================ */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {players.map((player) => {
            const meta = getCricketerMeta(player.player_name);
            return (
              <motion.div
                key={player.player_id}
                whileHover={{ y: -4 }}
                className="group relative rounded-3xl bg-black border border-white/10 hover:border-amber-400/50 transition-all p-5 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle top ambient glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full filter blur-2xl group-hover:bg-amber-400/15 transition-all pointer-events-none" />

                <div className="space-y-4">
                  {/* Top Bar: Country & Jersey */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="font-bold text-white uppercase tracking-wider">
                      {player.team_name}
                    </span>
                    {meta?.jerseyNumber && (
                      <span className="text-amber-400 font-bold">#{meta.jerseyNumber}</span>
                    )}
                  </div>

                  {/* Real Portrait Avatar & Name */}
                  <div className="flex items-center gap-3.5">
                    <CricketerAvatar
                      name={player.player_name}
                      size="lg"
                      borderColor="border-amber-400/50"
                    />
                    <div className="space-y-1">
                      <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors leading-tight">
                        {player.player_name}
                      </h3>
                      <span className={`inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${getRoleBadgeClass(player.role)}`}>
                        {player.role}
                      </span>
                    </div>
                  </div>

                  {/* Career Stats Strip */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Runs</span>
                      <span className="text-sm font-black font-mono text-amber-400 tabular-nums">
                        {player.career_runs ?? 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Wkts</span>
                      <span className="text-sm font-black font-mono text-emerald-400 tabular-nums">
                        {player.career_wickets ?? 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Mat</span>
                      <span className="text-sm font-black font-mono text-white tabular-nums">
                        {player.matches_played ?? 0}
                      </span>
                    </div>
                  </div>

                  {meta?.battingStyle && (
                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      {meta.battingStyle}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 mt-3 flex items-center justify-between border-t border-white/10">
                  <span className="text-[10px] font-mono text-slate-500">ID #{player.player_id}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(player)}
                      title="Edit Athlete"
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingPlayer(player)}
                      title="Delete Athlete"
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* ============================================================ */
        /* BROADCAST TABLE VIEW WITH REAL PLAYER PORTRAIT THUMBNAILS    */
        /* ============================================================ */
        <div className="rounded-3xl border border-white/10 bg-black overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="font-semibold border-b border-white/10 uppercase tracking-wider text-[11px] bg-white/[0.02] text-slate-400">
                <tr>
                  <th className="py-4 px-4 font-mono">ID</th>
                  <th className="py-4 px-4">Athlete</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4">National Team</th>
                  <th className="py-4 px-4 text-right font-mono">Matches</th>
                  <th className="py-4 px-4 text-right font-mono">Career Runs</th>
                  <th className="py-4 px-4 text-right font-mono">Career Wickets</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {players.map((player) => (
                  <tr
                    key={player.player_id}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-slate-500 font-medium">
                      #{player.player_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <CricketerAvatar name={player.player_name} size="sm" borderColor="border-amber-400/50" />
                        <span className="font-bold text-white text-sm">
                          {player.player_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${getRoleBadgeClass(player.role)}`}>
                        {player.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-white">{player.team_name}</span>
                      <span className="text-slate-400 ml-1.5 font-mono">({player.country})</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                      {player.matches_played ?? 0}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-amber-400 tabular-nums text-sm">
                      {player.career_runs ?? 0}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-400 tabular-nums text-sm">
                      {player.career_wickets ?? 0}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(player)}
                          title="Edit Player"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingPlayer(player)}
                          title="Delete Player"
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Player Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-white/10 bg-black text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-lg font-black text-white">
                {editingPlayer ? 'Edit Athlete Profile' : 'Register New Athlete'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer font-mono"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jasprit Bumrah"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Playing Role</label>
                <select
                  value={playerRole}
                  onChange={(e) => setPlayerRole(e.target.value as PlayerRole)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r} className="bg-black text-white">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">National Squad</label>
                <select
                  value={playerTeamId}
                  onChange={(e) => setPlayerTeamId(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                >
                  {teams.map((t) => (
                    <option key={t.team_id} value={t.team_id} className="bg-black text-white">
                      {t.team_name} ({t.country})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-400 hover:text-white rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl cursor-pointer shadow-md shadow-amber-400/20"
                >
                  {isSubmitting ? 'Saving...' : editingPlayer ? 'Update Athlete' : 'Create Athlete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPlayer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-white/10 bg-black text-white">
            <h3 className="text-base font-black text-white">Delete Athlete?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove <strong className="text-white">{deletingPlayer.player_name}</strong> from the championship roster?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeletingPlayer(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl cursor-pointer shadow-md shadow-red-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
