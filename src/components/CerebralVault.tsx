import React, { useState } from "react";
import { Bookmark, Play, Trash2, BookOpen, Layers } from "lucide-react";
import { Question } from "../types";
import { QuestionCard } from "./QuestionCard";
import { soundManager } from "../utils/audio";

interface CerebralVaultProps {
  vaultQuestions: Question[];
  onToggleVault: (q: Question) => void;
  onRecordAnswer: (
    question: Question,
    isCorrect: boolean,
    userAnswerIndex: number,
    timeSpentMs: number
  ) => void;
  onSwitchToPractice: () => void;
}

export const CerebralVault: React.FC<CerebralVaultProps> = ({
  vaultQuestions,
  onToggleVault,
  onRecordAnswer,
  onSwitchToPractice,
}) => {
  const [activeQuizMode, setActiveQuizMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQ = vaultQuestions[Math.min(currentIndex, Math.max(0, vaultQuestions.length - 1))];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Bookmark className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-white sm:text-2xl">
              Cerebral Vault
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Your personal library of bookmarked paradoxes, intriguing questions, and profound concepts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {vaultQuestions.length > 0 && (
            <button
              id="quiz-vault-btn"
              onClick={() => {
                soundManager.playClick();
                setActiveQuizMode(!activeQuizMode);
                setCurrentIndex(0);
              }}
              className="flex items-center gap-1.5 rounded-2xl bg-amber-500/20 px-4 py-2.5 text-xs font-semibold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all shadow-sm"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{activeQuizMode ? "View Vault List" : "Quiz My Vault"}</span>
            </button>
          )}
        </div>
      </div>

      {vaultQuestions.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-12 text-center space-y-4 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 text-2xl border border-amber-500/20">
            🗝️
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Your Vault is Empty
          </h2>
          <p className="mx-auto max-w-md text-xs sm:text-sm text-slate-300">
            Click the bookmark icon on any question during Rain Rush, Practice, or AI storms to save it here for deep reflection.
          </p>
          <button
            onClick={onSwitchToPractice}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-105 border border-white/20"
          >
            <BookOpen className="h-4 w-4" />
            <span>Explore Questions</span>
          </button>
        </div>
      ) : activeQuizMode && currentQ ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>
              Vault Quiz: <strong className="text-amber-400">#{currentIndex + 1}</strong> of{" "}
              {vaultQuestions.length}
            </span>
            <button
              onClick={() => setActiveQuizMode(false)}
              className="text-xs text-blue-300 hover:text-white underline"
            >
              Exit Quiz Mode
            </button>
          </div>

          <QuestionCard
            question={currentQ}
            onAnswer={(selectedIndex, isCorrect, timeSpentMs) => {
              onRecordAnswer(currentQ, isCorrect, selectedIndex, timeSpentMs);
            }}
            onNext={() => {
              if (currentIndex + 1 < vaultQuestions.length) {
                setCurrentIndex((prev) => prev + 1);
              } else {
                setActiveQuizMode(false);
              }
            }}
            hasNext={currentIndex + 1 <= vaultQuestions.length}
            isInVault={true}
            onToggleVault={onToggleVault}
            modeLabel="Vault Quiz"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {vaultQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-white/20 space-y-3.5 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-xl bg-white/10 border border-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                    {q.category}
                  </span>
                  <span className="rounded-xl bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-300">
                    {q.difficulty}
                  </span>
                </div>

                <button
                  onClick={() => onToggleVault(q)}
                  title="Remove from vault"
                  className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <h3 className="font-serif text-base font-bold leading-relaxed text-white">
                {q.question}
              </h3>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-xs text-slate-200 leading-relaxed">
                <strong className="text-blue-300 font-semibold">Answer:</strong>{" "}
                {q.options[q.correctAnswerIndex]}
                <div className="mt-1.5 text-slate-300">{q.explanation}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
