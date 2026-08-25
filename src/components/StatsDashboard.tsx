import React from "react";
import {
  BrainCircuit,
  Flame,
  Trophy,
  Award,
  BarChart3,
  CloudRain,
  Zap,
  CheckCircle2,
  Lock,
  Calendar,
  Layers,
} from "lucide-react";
import { UserStats, AnswerRecord } from "../types";
import { INITIAL_ACHIEVEMENTS, getHistoryRecords } from "../utils/storage";

interface StatsDashboardProps {
  stats: UserStats;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  const history = getHistoryRecords();
  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
      : 0;

  const getRankInfo = (bq: number) => {
    if (bq >= 1600)
      return {
        title: "Cosmic Polymath",
        tier: "Tier V",
        color: "text-amber-400",
        border: "border-amber-500/40",
        bg: "bg-amber-500/10",
        desc: "Mastery across myriad human disciplines and high-order reasoning.",
      };
    if (bq >= 1400)
      return {
        title: "Grand Scholar",
        tier: "Tier IV",
        color: "text-purple-400",
        border: "border-purple-500/40",
        bg: "bg-purple-500/10",
        desc: "Profound deductive rigor, broad erudition, and speed under pressure.",
      };
    if (bq >= 1200)
      return {
        title: "Intellect Maestro",
        tier: "Tier III",
        color: "text-blue-400",
        border: "border-blue-500/40",
        bg: "bg-blue-500/10",
        desc: "Consistently sharp analysis and deep philosophical foundations.",
      };
    if (bq >= 1050)
      return {
        title: "Adept Thinker",
        tier: "Tier II",
        color: "text-emerald-400",
        border: "border-emerald-500/40",
        bg: "bg-emerald-500/10",
        desc: "Developing strong mental models and keen pattern recognition.",
      };
    return {
      title: "Neuron Apprentice",
      tier: "Tier I",
      color: "text-slate-300",
      border: "border-slate-700",
      bg: "bg-slate-800/40",
      desc: "Beginning the intellectual ascent into the Brain Rain.",
    };
  };

  const rank = getRankInfo(stats.brainQuotient);

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fadeIn">
      {/* Top Banner: Brain Quotient Rank Card */}
      <div
        className={`rounded-3xl border ${rank.border} ${rank.bg} p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-mono font-bold text-slate-200 border border-white/15">
              {rank.tier} Status
            </span>
            <h1 className={`font-serif text-3xl sm:text-4xl font-bold ${rank.color}`}>
              {rank.title}
            </h1>
            <p className="max-w-md text-xs sm:text-sm text-slate-300 leading-relaxed">
              {rank.desc}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 min-w-48 shadow-xl">
            <span className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">
              Brain Quotient (BQ)
            </span>
            <div className="font-mono text-4xl font-black text-blue-300 tracking-tight">
              {stats.brainQuotient}
            </div>
            <span className="text-[11px] text-slate-400 mt-1">
              Dynamic Cognitive Rating
            </span>
          </div>
        </div>
      </div>

      {/* Core Numbers 4-Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-300 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Total Answered</span>
            <Layers className="h-4 w-4 text-blue-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-white">
            {stats.totalAnswered}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.totalCorrect} correct
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-300 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Accuracy Rate</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-300">
            {accuracy}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Overall precision</div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-300 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Best Streak</span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-amber-400">
            {stats.bestStreak}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Current: {stats.currentStreak} 🔥
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-300 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Drops Collected</span>
            <CloudRain className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-cyan-300">
            {stats.totalRainDropsCollected}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Raindrop drops</div>
        </div>
      </div>

      {/* High Scores Showcase */}
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
        <h2 className="font-serif text-base font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          <span>High Scores & Milestones</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
            <span className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">
              Brain Rain Cascade Rush
            </span>
            <div className="font-mono text-xl font-bold text-blue-300 mt-1">
              {stats.highScores?.rainRush || 0} <span className="text-xs font-normal text-slate-400">pts</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
            <span className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">
              60-Second Blitz Shower
            </span>
            <div className="font-mono text-xl font-bold text-amber-400 mt-1">
              {stats.highScores?.blitz || 0} <span className="text-xs font-normal text-slate-400">pts</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
            <span className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">
              Daily Challenge Streak
            </span>
            <div className="font-mono text-xl font-bold text-purple-300 mt-1">
              {stats.dailyStreak || 0} <span className="text-xs font-normal text-slate-400">days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Mastery Breakdown */}
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4 shadow-xl">
        <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-400" />
          <span>Domain Mastery Breakdown</span>
        </h2>

        <div className="space-y-3.5">
          {Object.keys(stats.categoryStats || {}).length === 0 ? (
            <p className="text-xs text-slate-400 py-3">
              No category data yet. Answer questions across different domains to unlock mastery bars!
            </p>
          ) : (
            Object.entries(stats.categoryStats).map(([cat, cdata]: [string, { answered: number; correct: number; bestStreak: number }]) => {
              const catAcc =
                cdata.answered > 0 ? Math.round((cdata.correct / cdata.answered) * 100) : 0;
              return (
                <div key={cat} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200">{cat}</span>
                    <span className="font-mono text-slate-300">
                      {cdata.correct} / {cdata.answered} ({catAcc}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${catAcc}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Achievements Gallery */}
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-base font-bold text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Achievements ({stats.achievementsUnlocked?.length || 0} / {INITIAL_ACHIEVEMENTS.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {INITIAL_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = stats.achievementsUnlocked?.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`flex items-start gap-3 rounded-2xl border p-3.5 transition-all backdrop-blur-md ${
                  isUnlocked
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-100 shadow-md"
                    : "border-white/5 bg-white/[0.02] text-slate-400 opacity-60"
                }`}
              >
                <div className="text-2xl flex-shrink-0">{ach.icon}</div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>{ach.title}</span>
                    {!isUnlocked && <Lock className="h-3 w-3 text-slate-500" />}
                  </div>
                  <div className="text-[11px] text-slate-300 leading-snug">{ach.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent History Ledger */}
      {history.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-3 shadow-xl">
          <h2 className="font-serif text-base font-bold text-white">
            Recent Practice History
          </h2>
          <div className="divide-y divide-white/10">
            {history.slice(0, 10).map((h, i) => (
              <div key={i} className="py-3 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      h.isCorrect
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {h.isCorrect ? "✓" : "✗"}
                  </span>
                  <span className="truncate text-slate-200">{h.questionText}</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 text-[11px] text-slate-300 font-mono">
                  <span>{(h.timeSpentMs / 1000).toFixed(1)}s</span>
                  <span className="rounded-lg bg-white/10 border border-white/10 px-2 py-0.5 text-slate-200">
                    {h.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
