import React, { useState, useMemo } from "react";
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Trophy,
  Flame,
  Clock,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { Question, UserStats } from "../types";
import { QuestionCard } from "./QuestionCard";
import { soundManager } from "../utils/audio";
import confetti from "canvas-confetti";

interface DailyChallengeProps {
  questions: Question[];
  stats: UserStats;
  onRecordAnswer: (
    question: Question,
    isCorrect: boolean,
    userAnswerIndex: number,
    timeSpentMs: number
  ) => void;
  onCompleteDaily: (dateStr: string, score: number) => void;
  vaultQuestions: Question[];
  onToggleVault: (q: Question) => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({
  questions,
  stats,
  onRecordAnswer,
  onCompleteDaily,
  vaultQuestions,
  onToggleVault,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const isAlreadyCompleted = stats.dailyCompletedDates?.includes(todayStr);

  // Deterministically select 10 questions based on today's date string
  const dailyQuestions = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = (hash << 5) - hash + todayStr.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    const pool = [...questions];
    const selected: Question[] = [];
    for (let i = 0; i < 10 && pool.length > 0; i++) {
      const idx = (seed + i * 13) % pool.length;
      selected.push(pool.splice(idx, 1)[0]);
    }
    return selected;
  }, [questions, todayStr]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ isCorrect: boolean; time: number }[]>([]);
  const [isFinished, setIsFinished] = useState(isAlreadyCompleted);

  const currentQ = dailyQuestions[currentIndex];

  const handleAnswer = (selectedIndex: number, isCorrect: boolean, timeSpentMs: number) => {
    if (!currentQ) return;
    onRecordAnswer(currentQ, isCorrect, selectedIndex, timeSpentMs);
    setAnswers((prev) => [...prev, { isCorrect, time: timeSpentMs }]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < dailyQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      soundManager.playVictory();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
      const correctCount = answers.filter((a) => a.isCorrect).length;
      onCompleteDaily(todayStr, correctCount * 150);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 shadow-md shadow-purple-500/20 border border-white/20">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl font-bold text-white sm:text-2xl">
                Daily Brain Shower
              </h1>
              <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                {todayStr}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              10 curated questions refreshed every 24 hours. Keep your daily streak ablaze!
            </p>
          </div>
        </div>

        {/* Daily Streak Chip */}
        <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-md px-4 py-2 text-xs">
          <Flame className="h-4 w-4 text-amber-400 animate-pulse" />
          <div>
            <span className="text-[10px] uppercase text-amber-300/80 font-semibold">Daily Streak</span>
            <div className="font-mono font-bold text-amber-300">
              {stats.dailyStreak} {stats.dailyStreak === 1 ? "Day" : "Days"}
            </div>
          </div>
        </div>
      </div>

      {/* Already Finished or Finished State */}
      {isFinished ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 sm:p-12 text-center space-y-6 animate-fadeIn shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-blue-600 shadow-xl shadow-emerald-500/30 border border-white/20">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              Daily Shower Completed!
            </h2>
            <p className="text-sm text-slate-300">
              You have completed the official 10-question set for {todayStr}.
            </p>
          </div>

          <div className="flex justify-center gap-8 text-xs text-slate-400">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3 text-center">
              <span className="block font-mono text-xl font-bold text-emerald-400">
                {answers.filter((a) => a.isCorrect).length || (isAlreadyCompleted ? 10 : 0)} / 10
              </span>
              <span className="text-[11px] text-slate-400">Correct</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3 text-center">
              <span className="block font-mono text-xl font-bold text-amber-400">
                🔥 {stats.dailyStreak || 1}
              </span>
              <span className="text-[11px] text-slate-400">Day Streak</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3 text-center">
              <span className="block font-mono text-xl font-bold text-blue-400">+150 BQ</span>
              <span className="text-[11px] text-slate-400">Bonus Awarded</span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Come back tomorrow for a brand new set of curated intellectual challenges!
          </p>
        </div>
      ) : (
        currentQ && (
          <div className="space-y-4">
            {/* Progress */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span className="font-semibold text-slate-200">Daily Challenge</span>
              <span className="font-mono">
                <strong className="text-blue-300">{currentIndex + 1}</strong> /{" "}
                {dailyQuestions.length}
              </span>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / dailyQuestions.length) * 100}%` }}
              />
            </div>

            <QuestionCard
              question={currentQ}
              onAnswer={handleAnswer}
              onNext={handleNext}
              hasNext={currentIndex + 1 <= dailyQuestions.length}
              isInVault={vaultQuestions.some((v) => v.id === currentQ.id)}
              onToggleVault={onToggleVault}
              modeLabel={`Daily #${currentIndex + 1}`}
            />
          </div>
        )
      )}
    </div>
  );
};
