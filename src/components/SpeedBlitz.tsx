import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  Clock,
  Flame,
  RotateCcw,
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Question, UserStats } from "../types";
import { soundManager } from "../utils/audio";
import confetti from "canvas-confetti";

interface SpeedBlitzProps {
  questions: Question[];
  stats: UserStats;
  onRecordAnswer: (
    question: Question,
    isCorrect: boolean,
    userAnswerIndex: number,
    timeSpentMs: number
  ) => void;
  onSaveHighScore: (score: number) => void;
}

export const SpeedBlitz: React.FC<SpeedBlitzProps> = ({
  questions,
  stats,
  onRecordAnswer,
  onSaveHighScore,
}) => {
  const [gameState, setGameState] = useState<"lobby" | "playing" | "gameover">("lobby");
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deck, setDeck] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [lastAnswerFeedback, setLastAnswerFeedback] = useState<"correct" | "wrong" | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  const startBlitz = () => {
    soundManager.playClick();
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setDeck(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setAnsweredCount(0);
    setSecondsRemaining(60);
    setLastAnswerFeedback(null);
    setGameState("playing");
    questionStartTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          endBlitz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const endBlitz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("gameover");
    soundManager.playVictory();
    if (score > (stats.highScores?.blitz || 0)) {
      onSaveHighScore(score);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (gameState !== "playing") return;

    const currentQ = deck[currentIndex];
    if (!currentQ) return;

    const timeSpent = Date.now() - questionStartTimeRef.current;
    const isCorrect = idx === currentQ.correctAnswerIndex;

    onRecordAnswer(currentQ, isCorrect, idx, timeSpent);
    setAnsweredCount((prev) => prev + 1);

    if (isCorrect) {
      soundManager.playRaindrop(combo);
      setCorrectCount((prev) => prev + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      const multiplier = Math.min(3, 1 + newCombo * 0.2);
      const points = Math.round(100 * multiplier);
      setScore((prev) => prev + points);
      setLastAnswerFeedback("correct");
    } else {
      soundManager.playWrong();
      setCombo(0);
      setLastAnswerFeedback("wrong");
    }

    // Instant flash and advance to next
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex((prev) => prev + 1);
      questionStartTimeRef.current = Date.now();
    } else {
      const reshuffled = [...questions].sort(() => 0.5 - Math.random());
      setDeck(reshuffled);
      setCurrentIndex(0);
      questionStartTimeRef.current = Date.now();
    }
  };

  const currentQ = deck[currentIndex];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {gameState === "lobby" && (
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-600 shadow-xl shadow-amber-500/30 border border-white/20">
            <Zap className="h-10 w-10 text-white animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="rounded-full bg-amber-500/15 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-amber-300 border border-amber-500/30">
              High Intensity
            </span>
            <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              60-Second Blitz Shower
            </h1>
            <p className="mx-auto max-w-md text-sm text-slate-300 leading-relaxed">
              Answer as many intellectual questions as you can before the clock expires. High
              combos award massive score multipliers!
            </p>
          </div>

          <div className="flex justify-center gap-8 text-xs text-slate-400">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3 text-center">
              <span className="block font-mono text-xl font-bold text-white">60s</span>
              <span className="text-[11px] text-slate-400">Time limit</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3 text-center">
              <span className="block font-mono text-xl font-bold text-amber-400">3.0x</span>
              <span className="text-[11px] text-slate-400">Max Multiplier</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3 text-center">
              <span className="block font-mono text-xl font-bold text-blue-400">
                {stats.highScores?.blitz || 0}
              </span>
              <span className="text-[11px] text-slate-400">Personal Best</span>
            </div>
          </div>

          <button
            id="start-blitz-btn"
            onClick={startBlitz}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-rose-400 hover:scale-105 transition-all border border-white/20"
          >
            <Zap className="h-5 w-5" />
            <span>Launch Blitz Round</span>
          </button>
        </div>
      )}

      {gameState === "playing" && currentQ && (
        <div className="space-y-4">
          {/* Blitz HUD */}
          <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl shadow-xl">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl font-mono text-xl font-black ${
                  secondsRemaining <= 10
                    ? "bg-rose-500 text-white animate-ping"
                    : secondsRemaining <= 20
                    ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                    : "bg-blue-500/20 text-blue-300 border border-blue-400/40"
                }`}
              >
                {secondsRemaining}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Time Left
                </span>
                <div className="text-xs text-slate-300">Seconds</div>
              </div>
            </div>

            {/* Score & Multiplier */}
            <div className="flex items-center gap-4">
              {combo > 1 && (
                <div className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30 animate-bounce">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <span>{combo}x Combo</span>
                </div>
              )}
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Points</span>
                <div className="font-mono text-xl font-bold text-blue-300">{score}</div>
              </div>
            </div>
          </div>

          {/* Time Progress Bar */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full transition-all duration-1000 linear ${
                secondsRemaining <= 10
                  ? "bg-rose-500"
                  : secondsRemaining <= 25
                  ? "bg-amber-500"
                  : "bg-blue-400"
              }`}
              style={{ width: `${(secondsRemaining / 60) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="rounded-xl bg-white/10 border border-white/10 px-3 py-1 font-semibold text-slate-200">
                {currentQ.category}
              </span>
              <span className="font-mono text-slate-400">#{answeredCount + 1}</span>
            </div>

            <h2 className="font-serif text-lg font-bold leading-relaxed text-white sm:text-xl md:text-2xl">
              {currentQ.question}
            </h2>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {currentQ.options.map((opt, i) => {
                const letter = ["A", "B", "C", "D"][i];
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(i)}
                    className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-left text-sm font-medium text-slate-200 hover:border-blue-500/40 hover:bg-blue-500/15 active:scale-[0.98] transition-all"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 border border-white/10 font-mono text-xs font-bold text-slate-300">
                      {letter}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {gameState === "gameover" && (
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-fadeIn">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 to-purple-600 shadow-xl shadow-amber-500/30 border border-white/20">
            <Trophy className="h-10 w-10 text-white" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              Blitz Completed!
            </h2>
            <p className="text-sm text-slate-300">
              60 seconds of lightning cognitive performance.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 max-w-lg mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3.5">
              <span className="text-[10px] uppercase text-slate-400 font-semibold">Total Score</span>
              <div className="font-mono text-xl font-bold text-amber-400">{score}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3.5">
              <span className="text-[10px] uppercase text-slate-400 font-semibold">Correct</span>
              <div className="font-mono text-xl font-bold text-emerald-400">
                {correctCount} / {answeredCount}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3.5">
              <span className="text-[10px] uppercase text-slate-400 font-semibold">Accuracy</span>
              <div className="font-mono text-xl font-bold text-purple-400">
                {answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3.5">
              <span className="text-[10px] uppercase text-slate-400 font-semibold">Max Combo</span>
              <div className="font-mono text-xl font-bold text-blue-400">{maxCombo}x</div>
            </div>
          </div>

          <button
            id="retry-blitz-btn"
            onClick={startBlitz}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition-all hover:scale-105 border border-white/20"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
