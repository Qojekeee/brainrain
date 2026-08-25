import React, { useState, useEffect } from "react";
import { GameMode, Question, UserStats, Achievement } from "./types";
import { BUILT_IN_QUESTIONS } from "./data/questions";
import {
  loadUserStats,
  saveUserStats,
  recordAnswer,
  getVaultQuestions,
  toggleVaultQuestion,
  getMistakes,
  removeMistake,
  getSoundSettings,
  saveSoundSettings,
} from "./utils/storage";
import { soundManager } from "./utils/audio";
import { Navbar } from "./components/Navbar";
import { RainArena } from "./components/RainArena";
import { PracticeMode } from "./components/PracticeMode";
import { SpeedBlitz } from "./components/SpeedBlitz";
import { CustomStormGenerator } from "./components/CustomStormGenerator";
import { DailyChallenge } from "./components/DailyChallenge";
import { MistakeReview } from "./components/MistakeReview";
import { CerebralVault } from "./components/CerebralVault";
import { StatsDashboard } from "./components/StatsDashboard";
import { Sparkles, Trophy, X, Keyboard, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>("rain");
  const [stats, setStats] = useState<UserStats>(loadUserStats());
  const [vaultQuestions, setVaultQuestions] = useState<Question[]>(getVaultQuestions());
  const [mistakes, setMistakes] = useState<Question[]>(getMistakes());

  // Sound settings
  const [soundConfig, setSoundConfig] = useState(getSoundSettings());
  const [unlockedToast, setUnlockedToast] = useState<Achievement | null>(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // Sync sound settings with SoundManager
  useEffect(() => {
    soundManager.setSoundEffectsEnabled(soundConfig.soundEffects);
    soundManager.setVolume(soundConfig.volume);
    if (soundConfig.ambientRain) {
      soundManager.toggleAmbientRain(true);
    }
  }, []);

  const handleToggleSoundEffects = () => {
    const next = !soundConfig.soundEffects;
    const updated = { ...soundConfig, soundEffects: next };
    setSoundConfig(updated);
    saveSoundSettings(updated);
    soundManager.setSoundEffectsEnabled(next);
  };

  const handleToggleAmbientRain = () => {
    const next = !soundConfig.ambientRain;
    const updated = { ...soundConfig, ambientRain: next };
    setSoundConfig(updated);
    saveSoundSettings(updated);
    soundManager.toggleAmbientRain(next);
  };

  const handleRecordAnswer = (
    question: Question,
    isCorrect: boolean,
    userAnswerIndex: number,
    timeSpentMs: number
  ) => {
    const { updatedStats, newlyUnlockedAchievements } = recordAnswer(
      question,
      isCorrect,
      userAnswerIndex,
      timeSpentMs
    );
    setStats({ ...updatedStats });
    setMistakes(getMistakes());

    if (newlyUnlockedAchievements.length > 0) {
      const first = newlyUnlockedAchievements[0];
      setUnlockedToast(first);
      soundManager.playVictory();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
      setTimeout(() => {
        setUnlockedToast(null);
      }, 4000);
    }
  };

  const handleToggleVault = (q: Question) => {
    toggleVaultQuestion(q);
    setVaultQuestions(getVaultQuestions());
  };

  const handleRemoveMistake = (id: string) => {
    removeMistake(id);
    setMistakes(getMistakes());
  };

  const handleSaveHighScore = (score: number) => {
    const current = loadUserStats();
    if (currentMode === "rain") {
      current.highScores.rainRush = Math.max(current.highScores.rainRush, score);
    } else if (currentMode === "blitz") {
      current.highScores.blitz = Math.max(current.highScores.blitz, score);
    }
    saveUserStats(current);
    setStats({ ...current });
  };

  const handleCompleteDaily = (dateStr: string, bonusBq: number) => {
    const current = loadUserStats();
    if (!current.dailyCompletedDates.includes(dateStr)) {
      current.dailyCompletedDates.push(dateStr);
      current.dailyStreak = (current.dailyStreak || 0) + 1;
      current.brainQuotient += bonusBq;
      saveUserStats(current);
      setStats({ ...current });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1222] text-slate-100 selection:bg-blue-500/30 selection:text-blue-200 relative overflow-x-hidden font-sans">
      {/* Frosted Glass Atmospheric Ambient Glowing Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/20 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-indigo-600/20 blur-[160px] rounded-full" />
        <div className="absolute top-[25%] right-[10%] w-[35%] h-[35%] bg-purple-600/15 blur-[120px] rounded-full" />
        <div className="absolute top-[60%] left-[15%] w-[30%] h-[30%] bg-cyan-600/10 blur-[110px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        stats={stats}
        soundEffects={soundConfig.soundEffects}
        onToggleSoundEffects={handleToggleSoundEffects}
        ambientRain={soundConfig.ambientRain}
        onToggleAmbientRain={handleToggleAmbientRain}
        mistakesCount={mistakes.length}
        vaultCount={vaultQuestions.length}
      />

      {/* Main Content Viewport */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {currentMode === "rain" && (
          <RainArena
            questions={BUILT_IN_QUESTIONS}
            stats={stats}
            onRecordAnswer={handleRecordAnswer}
            onSaveHighScore={handleSaveHighScore}
            onToggleVault={handleToggleVault}
            vaultQuestions={vaultQuestions}
            onSwitchToPractice={() => setCurrentMode("practice")}
          />
        )}

        {currentMode === "practice" && (
          <PracticeMode
            questions={BUILT_IN_QUESTIONS}
            onRecordAnswer={handleRecordAnswer}
            vaultQuestions={vaultQuestions}
            onToggleVault={handleToggleVault}
          />
        )}

        {currentMode === "blitz" && (
          <SpeedBlitz
            questions={BUILT_IN_QUESTIONS}
            stats={stats}
            onRecordAnswer={handleRecordAnswer}
            onSaveHighScore={handleSaveHighScore}
          />
        )}

        {currentMode === "daily" && (
          <DailyChallenge
            questions={BUILT_IN_QUESTIONS}
            stats={stats}
            onRecordAnswer={handleRecordAnswer}
            onCompleteDaily={handleCompleteDaily}
            vaultQuestions={vaultQuestions}
            onToggleVault={handleToggleVault}
          />
        )}

        {currentMode === "custom_storm" && (
          <CustomStormGenerator
            onRecordAnswer={handleRecordAnswer}
            vaultQuestions={vaultQuestions}
            onToggleVault={handleToggleVault}
          />
        )}

        {currentMode === "mistakes" && (
          <MistakeReview
            mistakes={mistakes}
            onRemoveMistake={handleRemoveMistake}
            onRecordAnswer={handleRecordAnswer}
            vaultQuestions={vaultQuestions}
            onToggleVault={handleToggleVault}
            onSwitchToPractice={() => setCurrentMode("practice")}
          />
        )}

        {currentMode === "vault" && (
          <CerebralVault
            vaultQuestions={vaultQuestions}
            onToggleVault={handleToggleVault}
            onRecordAnswer={handleRecordAnswer}
            onSwitchToPractice={() => setCurrentMode("practice")}
          />
        )}

        {currentMode === "stats" && <StatsDashboard stats={stats} />}
      </main>

      {/* Achievement Unlock Toast */}
      {unlockedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 text-slate-100 shadow-2xl shadow-blue-500/20 backdrop-blur-xl animate-bounce">
          <div className="text-3xl">{unlockedToast.icon}</div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Trophy className="h-3.5 w-3.5" />
              <span>Achievement Unlocked!</span>
            </div>
            <div className="text-sm font-bold text-slate-100">{unlockedToast.title}</div>
            <div className="text-xs text-slate-300">{unlockedToast.description}</div>
          </div>
          <button
            onClick={() => setUnlockedToast(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Bottom Footer */}
      <footer className="relative z-10 mt-12 border-t border-white/10 bg-white/5 backdrop-blur-md py-6 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-200">Brain Rain</span>
            <span>•</span>
            <span>Intellectual Cognitive Practice & Question Arena</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowShortcutsModal(true)}
              className="flex items-center gap-1 text-slate-400 hover:text-blue-300 transition-colors"
            >
              <Keyboard className="h-3.5 w-3.5" />
              <span>Keyboard Controls</span>
            </button>
            <span>•</span>
            <span>Powered by Google Gemini 3.7</span>
          </div>
        </div>
      </footer>

      {/* Keyboard Shortcuts Dialog */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/90 backdrop-blur-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-serif text-lg font-bold text-white">
                <Keyboard className="h-5 w-5 text-blue-400" />
                <span>Keyboard Shortcuts</span>
              </div>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-3">
                <span>Select Option A, B, C, D</span>
                <span className="flex gap-1">
                  <kbd className="rounded-lg bg-white/10 border border-white/15 px-2 py-0.5 font-mono text-blue-300">A</kbd>
                  <kbd className="rounded-lg bg-white/10 border border-white/15 px-2 py-0.5 font-mono text-blue-300">B</kbd>
                  <kbd className="rounded-lg bg-white/10 border border-white/15 px-2 py-0.5 font-mono text-blue-300">C</kbd>
                  <kbd className="rounded-lg bg-white/10 border border-white/15 px-2 py-0.5 font-mono text-blue-300">D</kbd>
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-3">
                <span>Alternative numeric selection</span>
                <span className="flex gap-1">
                  <kbd className="rounded-lg bg-white/10 border border-white/15 px-2 py-0.5 font-mono text-blue-300">1</kbd>
                  <kbd className="rounded-lg bg-white/10 border border-white/15 px-2 py-0.5 font-mono text-blue-300">2</kbd>
                  <kbd className="rounded-lg bg-white/10 border border-white/15 px-2 py-0.5 font-mono text-blue-300">3</kbd>
                  <kbd className="rounded-lg bg-white/10 border border-white/15 px-2 py-0.5 font-mono text-blue-300">4</kbd>
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-3">
                <span>Advance to next question</span>
                <span className="flex gap-1">
                  <kbd className="rounded-lg bg-white/10 border border-white/15 px-2 py-0.5 font-mono text-blue-300">
                    Space
                  </kbd>
                  <kbd className="rounded-lg bg-white/10 border border-white/15 px-2 py-0.5 font-mono text-blue-300">
                    Enter
                  </kbd>
                </span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
