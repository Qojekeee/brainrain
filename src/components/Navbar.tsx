import React, { useState } from "react";
import {
  CloudRain,
  BookOpen,
  Zap,
  Calendar,
  Sparkles,
  RotateCcw,
  Bookmark,
  BarChart3,
  Volume2,
  VolumeX,
  CloudFog,
  Trophy,
  BrainCircuit,
} from "lucide-react";
import { GameMode, UserStats } from "../types";
import { soundManager } from "../utils/audio";

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  stats: UserStats;
  soundEffects: boolean;
  onToggleSoundEffects: () => void;
  ambientRain: boolean;
  onToggleAmbientRain: () => void;
  mistakesCount: number;
  vaultCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  stats,
  soundEffects,
  onToggleSoundEffects,
  ambientRain,
  onToggleAmbientRain,
  mistakesCount,
  vaultCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getRankName = (bq: number) => {
    if (bq >= 1600) return { title: "Cosmic Polymath", color: "text-amber-400" };
    if (bq >= 1400) return { title: "Grand Scholar", color: "text-purple-400" };
    if (bq >= 1200) return { title: "Intellect Maestro", color: "text-blue-400" };
    if (bq >= 1050) return { title: "Adept Thinker", color: "text-emerald-400" };
    return { title: "Neuron Apprentice", color: "text-slate-300" };
  };

  const rank = getRankName(stats.brainQuotient);

  const navItems = [
    { id: "rain" as GameMode, label: "Rain Rush", icon: CloudRain, badge: "Popular" },
    { id: "practice" as GameMode, label: "Practice Hub", icon: BookOpen },
    { id: "blitz" as GameMode, label: "60s Blitz", icon: Zap },
    { id: "daily" as GameMode, label: "Daily Shower", icon: Calendar },
    { id: "custom_storm" as GameMode, label: "AI Topic Storm", icon: Sparkles, badge: "AI" },
    {
      id: "mistakes" as GameMode,
      label: "Mistakes",
      icon: RotateCcw,
      count: mistakesCount,
    },
    { id: "vault" as GameMode, label: "Vault", icon: Bookmark, count: vaultCount },
    { id: "stats" as GameMode, label: "Intellect Stats", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div
          id="brand-logo-btn"
          onClick={() => {
            soundManager.playClick();
            onSelectMode("rain");
          }}
          className="group flex cursor-pointer items-center gap-3 transition-transform hover:scale-[1.02]"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 border border-white/20">
            <CloudRain className="h-5 w-5 text-white animate-pulse" />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-cyan-400 ring-2 ring-[#0c1222]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-blue-300 transition-colors">
                Brain Rain
              </span>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">The Intellectual Question Arena</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-2xl backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => {
                  soundManager.playClick();
                  onSelectMode(item.id);
                }}
                className={`relative flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-500/20 text-white border border-blue-500/40 shadow-sm shadow-blue-500/10"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="rounded-md bg-blue-500/20 px-1.5 py-0.2 text-[9px] font-bold text-blue-300 border border-blue-500/30">
                    {item.badge}
                  </span>
                )}
                {typeof item.count === "number" && item.count > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500/20 px-1 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side controls: BQ score, streak, audio toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* BQ Rating & Streak Chips */}
          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1.5 text-xs">
            <div className="flex items-center gap-1.5 border-r border-white/10 pr-2.5">
              <BrainCircuit className="h-4 w-4 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">
                  Brain Quotient
                </span>
                <span className="font-mono text-xs font-bold text-blue-300">
                  {stats.brainQuotient} <span className={`text-[10px] font-normal ${rank.color}`}>({rank.title})</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pl-1">
              <span className="text-sm">🔥</span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Streak</span>
                <span className="font-mono text-xs font-bold text-amber-400">
                  {stats.currentStreak}
                </span>
              </div>
            </div>
          </div>

          {/* Ambient Rain Sound Generator Toggle */}
          <button
            id="ambient-rain-toggle-btn"
            onClick={onToggleAmbientRain}
            title={ambientRain ? "Mute ambient rain atmosphere" : "Play focus ambient rain sound"}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all backdrop-blur-md ${
              ambientRain
                ? "border-blue-500/40 bg-blue-500/20 text-blue-300 shadow-sm shadow-blue-500/30 animate-pulse"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <CloudFog className="h-4 w-4" />
          </button>

          {/* Sound Effects Toggle */}
          <button
            id="sound-fx-toggle-btn"
            onClick={onToggleSoundEffects}
            title={soundEffects ? "Mute sound effects" : "Enable sound effects"}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all backdrop-blur-md ${
              soundEffects
                ? "border-white/10 bg-white/5 text-blue-400 hover:bg-white/10"
                : "border-white/10 bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10"
            }`}
          >
            {soundEffects ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            id="mobile-nav-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white lg:hidden backdrop-blur-md"
          >
            <span className="text-lg">☰</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#0c1222]/95 backdrop-blur-2xl px-4 py-3 lg:hidden animate-fadeIn">
          <div className="mb-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs">
            <div>
              <span className="text-slate-400">Brain Quotient:</span>{" "}
              <strong className="text-blue-300">{stats.brainQuotient}</strong> ({rank.title})
            </div>
            <div>
              <span className="text-slate-400">Streak:</span>{" "}
              <strong className="text-amber-400">🔥 {stats.currentStreak}</strong>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentMode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectMode(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-500/20 text-white border border-blue-500/40"
                      : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 text-blue-400" />
                  <span className="truncate">{item.label}</span>
                  {typeof item.count === "number" && item.count > 0 && (
                    <span className="ml-auto rounded-full bg-amber-500/20 px-1.5 text-[10px] text-amber-300 border border-amber-500/30">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
