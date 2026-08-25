import React, { useState, useEffect, useRef } from "react";
import {
  CloudRain,
  Zap,
  Shield,
  Trophy,
  Flame,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
} from "lucide-react";
import { Question, UserStats } from "../types";
import { QuestionCard } from "./QuestionCard";
import { soundManager } from "../utils/audio";
import confetti from "canvas-confetti";

interface RainArenaProps {
  questions: Question[];
  stats: UserStats;
  onRecordAnswer: (
    question: Question,
    isCorrect: boolean,
    userAnswerIndex: number,
    timeSpentMs: number
  ) => void;
  onSaveHighScore: (score: number) => void;
  onToggleVault: (q: Question) => void;
  vaultQuestions: Question[];
  onSwitchToPractice: () => void;
}

export const RainArena: React.FC<RainArenaProps> = ({
  questions,
  stats,
  onRecordAnswer,
  onSaveHighScore,
  onToggleVault,
  vaultQuestions,
  onSwitchToPractice,
}) => {
  const [gameState, setGameState] = useState<"lobby" | "playing" | "gameover">("lobby");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [rainDropsCollected, setRainDropsCollected] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(25);
  const [totalQuestionTime, setTotalQuestionTime] = useState(25);
  const [stormIntensity, setStormIntensity] = useState<"Drizzle" | "Shower" | "Monsoon" | "HyperStorm">("Drizzle");
  const [questionsAnsweredInRun, setQuestionsAnsweredInRun] = useState<
    { question: Question; isCorrect: boolean }[]
  >([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Background procedural rain animation on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particles
    const dropCount =
      stormIntensity === "HyperStorm"
        ? 120
        : stormIntensity === "Monsoon"
        ? 80
        : stormIntensity === "Shower"
        ? 50
        : 30;

    const drops: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 8 + 6,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const ripples: { x: number; y: number; radius: number; opacity: number }[] = [];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw raindrops
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.length);
        ctx.strokeStyle = `rgba(56, 189, 248, ${d.opacity})`;
        ctx.stroke();

        d.y += d.speed;
        d.x -= 0.8;

        if (d.y > height) {
          d.y = -20;
          d.x = Math.random() * width + 50;
          if (Math.random() > 0.6) {
            ripples.push({
              x: d.x,
              y: height - 10 + Math.random() * 10,
              radius: 1,
              opacity: 0.6,
            });
          }
        }
      }

      // Draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${r.opacity * 0.3})`;
        ctx.stroke();

        r.radius += 0.8;
        r.opacity -= 0.02;

        if (r.opacity <= 0 || r.radius > 25) {
          ripples.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [stormIntensity]);

  // Start a new rain storm session
  const startGame = () => {
    soundManager.playClick();
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setShuffledQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setRainDropsCollected(0);
    setQuestionsAnsweredInRun([]);
    setStormIntensity("Drizzle");
    setTotalQuestionTime(25);
    setTimeRemaining(25);
    setGameState("playing");
  };

  // Timer loop when playing
  useEffect(() => {
    if (gameState !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Timeout counts as a wrong answer
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentIndex, shuffledQuestions]);

  const handleTimeout = () => {
    soundManager.playWrong();
    const currentQ = shuffledQuestions[currentIndex];
    if (!currentQ) return;

    onRecordAnswer(currentQ, false, -1, totalQuestionTime * 1000);
    setQuestionsAnsweredInRun((prev) => [...prev, { question: currentQ, isCorrect: false }]);
    setCombo(0);

    const newLives = lives - 1;
    setLives(newLives);

    if (newLives <= 0) {
      endGame();
    } else {
      nextQuestion();
    }
  };

  const handleAnswer = (selectedIndex: number, isCorrect: boolean, timeSpentMs: number) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const currentQ = shuffledQuestions[currentIndex];
    if (!currentQ) return;

    onRecordAnswer(currentQ, isCorrect, selectedIndex, timeSpentMs);
    setQuestionsAnsweredInRun((prev) => [...prev, { question: currentQ, isCorrect }]);

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      // Multipliers: 1x base, +0.25x per combo level up to 4x
      const multiplier = Math.min(4, 1 + newCombo * 0.25);
      const difficultyPoints =
        currentQ.difficulty === "Polymath"
          ? 300
          : currentQ.difficulty === "Master"
          ? 200
          : currentQ.difficulty === "Scholar"
          ? 120
          : 80;

      // Speed bonus: answering in < 8s gives +50% speed bonus
      const speedFactor = timeRemaining > totalQuestionTime * 0.6 ? 1.5 : 1.0;
      const pointsEarned = Math.round(difficultyPoints * multiplier * speedFactor);

      setScore((prev) => prev + pointsEarned);
      setRainDropsCollected((prev) => prev + 1);

      // Upgrade storm intensity based on combo
      if (newCombo >= 10) setStormIntensity("HyperStorm");
      else if (newCombo >= 6) setStormIntensity("Monsoon");
      else if (newCombo >= 3) setStormIntensity("Shower");
      else setStormIntensity("Drizzle");
    } else {
      setCombo(0);
      setStormIntensity("Drizzle");
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        endGame();
        return;
      }
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < shuffledQuestions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      // As game progresses, time reduces slightly down to 14s minimum
      const nextTime = Math.max(14, 25 - Math.floor(nextIdx / 3));
      setTotalQuestionTime(nextTime);
      setTimeRemaining(nextTime);
    } else {
      // Re-shuffle and continue infinite rain
      const reshuffled = [...questions].sort(() => 0.5 - Math.random());
      setShuffledQuestions(reshuffled);
      setCurrentIndex(0);
      setTotalQuestionTime(15);
      setTimeRemaining(15);
    }
  };

  const endGame = () => {
    setGameState("gameover");
    soundManager.playVictory();
    if (score > (stats.highScores?.rainRush || 0)) {
      onSaveHighScore(score);
    }
  };

  const currentQ = shuffledQuestions[currentIndex];

  return (
    <div className="relative min-h-[75vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-4 sm:p-8 shadow-2xl">
      {/* Background Canvas for Animated Rain */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60"
      />

      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-[#0c1222]/80 z-0" />

      {/* Content wrapper */}
      <div className="relative z-10 mx-auto max-w-4xl">
        {/* LOBBY STATE */}
        {gameState === "lobby" && (
          <div className="py-10 text-center space-y-8 animate-fadeIn">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30 border border-white/20">
              <CloudRain className="h-10 w-10 text-white animate-bounce" />
            </div>

            <div className="space-y-3">
              <span className="rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-blue-400 border border-blue-500/20">
                Signature Challenge
              </span>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Brain Rain: Cascade Rush
              </h1>
              <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-slate-300">
                Test your intellect under the pressure of falling questions. Chain correct answers to
                ignite storm multipliers, preserve your 3 cerebral shields, and collect high-volume raindrops!
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 max-w-2xl mx-auto">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3.5 text-center">
                <div className="text-xl">🛡️</div>
                <div className="text-xs font-bold text-slate-200 mt-1">3 Shields</div>
                <div className="text-[10px] text-slate-400">3 mistakes max</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3.5 text-center">
                <div className="text-xl">⚡</div>
                <div className="text-xs font-bold text-blue-400 mt-1">Up to 4x Combo</div>
                <div className="text-[10px] text-slate-400">Streaks boost score</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3.5 text-center">
                <div className="text-xl">⏱️</div>
                <div className="text-xs font-bold text-amber-400 mt-1">Countdown Rush</div>
                <div className="text-[10px] text-slate-400">Fast answers win</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3.5 text-center">
                <div className="text-xl">🏆</div>
                <div className="text-xs font-bold text-purple-400 mt-1">High Score</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {stats.highScores?.rainRush || 0} pts
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-2">
              <button
                id="start-rain-rush-btn"
                onClick={startGame}
                className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-105 hover:from-blue-500 hover:to-indigo-500 active:scale-95 border border-white/20"
              >
                <CloudRain className="h-6 w-6" />
                <span>Begin Brain Rain</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">Ready</span>
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE PLAYING STATE */}
        {gameState === "playing" && currentQ && (
          <div className="space-y-5 animate-fadeIn">
            {/* Top Storm HUD */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              {/* Score & Combo */}
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Score</span>
                  <div className="font-mono text-xl font-bold text-blue-300">
                    {score.toLocaleString()}
                  </div>
                </div>

                {combo > 1 && (
                  <div className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30 animate-pulse">
                    <Flame className="h-4 w-4 text-amber-400" />
                    <span>
                      {combo}x Combo ({Math.min(4, 1 + combo * 0.25).toFixed(2)}x pts)
                    </span>
                  </div>
                )}
              </div>

              {/* Storm Level Badge */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">Storm:</span>
                <span
                  className={`rounded-xl px-2.5 py-1 text-xs font-bold border ${
                    stormIntensity === "HyperStorm"
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse"
                      : stormIntensity === "Monsoon"
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                      : stormIntensity === "Shower"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      : "bg-white/5 border-white/10 text-slate-300"
                  }`}
                >
                  🌧️ {stormIntensity}
                </span>
              </div>

              {/* Lives / Shields */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 mr-1 font-semibold">Shields:</span>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                      i <= lives
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm"
                        : "bg-white/5 text-slate-600 border border-white/5 opacity-40"
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Question Card */}
            <QuestionCard
              question={currentQ}
              onAnswer={handleAnswer}
              onNext={nextQuestion}
              hasNext={lives > 0}
              isInVault={vaultQuestions.some((v) => v.id === currentQ.id)}
              onToggleVault={onToggleVault}
              showTimer={true}
              timeRemaining={timeRemaining}
              totalTime={totalQuestionTime}
              modeLabel={`Drop #${currentIndex + 1}`}
            />
          </div>
        )}

        {/* GAMEOVER STATE */}
        {gameState === "gameover" && (
          <div className="py-8 text-center space-y-6 animate-fadeIn">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 to-indigo-600 shadow-xl shadow-amber-500/30 border border-white/20">
              <Trophy className="h-10 w-10 text-white" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
                Storm Dissipated!
              </h2>
              <p className="text-sm text-slate-300">
                You collected {rainDropsCollected} raindrops during the cascade.
              </p>
            </div>

            {/* Stats Summary Grid */}
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 max-w-xl mx-auto">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3.5">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Final Score</span>
                <div className="font-mono text-xl font-bold text-blue-300">
                  {score.toLocaleString()}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3.5">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Max Combo</span>
                <div className="font-mono text-xl font-bold text-amber-400">
                  {maxCombo}x
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3.5">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Correct</span>
                <div className="font-mono text-xl font-bold text-emerald-400">
                  {rainDropsCollected} / {questionsAnsweredInRun.length}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3.5">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Accuracy</span>
                <div className="font-mono text-xl font-bold text-purple-400">
                  {questionsAnsweredInRun.length > 0
                    ? Math.round((rainDropsCollected / questionsAnsweredInRun.length) * 100)
                    : 0}
                  %
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                id="play-again-rain-btn"
                onClick={startGame}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-105 border border-white/20"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Play Again</span>
              </button>

              <button
                id="switch-to-practice-btn"
                onClick={() => {
                  soundManager.playClick();
                  onSwitchToPractice();
                }}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-all"
              >
                <BookOpen className="h-4 w-4 text-blue-400" />
                <span>Study in Practice Hub</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
