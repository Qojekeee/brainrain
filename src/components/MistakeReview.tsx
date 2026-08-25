import React, { useState } from "react";
import { RotateCcw, CheckCircle, Trash2, ArrowRight, BookOpen } from "lucide-react";
import { Question } from "../types";
import { QuestionCard } from "./QuestionCard";
import { soundManager } from "../utils/audio";

interface MistakeReviewProps {
  mistakes: Question[];
  onRemoveMistake: (questionId: string) => void;
  onRecordAnswer: (
    question: Question,
    isCorrect: boolean,
    userAnswerIndex: number,
    timeSpentMs: number
  ) => void;
  vaultQuestions: Question[];
  onToggleVault: (q: Question) => void;
  onSwitchToPractice: () => void;
}

export const MistakeReview: React.FC<MistakeReviewProps> = ({
  mistakes,
  onRemoveMistake,
  onRecordAnswer,
  vaultQuestions,
  onToggleVault,
  onSwitchToPractice,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQ = mistakes[Math.min(currentIndex, Math.max(0, mistakes.length - 1))];

  const handleAnswer = (selectedIndex: number, isCorrect: boolean, timeSpentMs: number) => {
    if (!currentQ) return;
    onRecordAnswer(currentQ, isCorrect, selectedIndex, timeSpentMs);

    // If answered correctly, give option / auto-remove
    if (isCorrect) {
      setTimeout(() => {
        onRemoveMistake(currentQ.id);
      }, 1500);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < mistakes.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <RotateCcw className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-white sm:text-2xl">
              Mistakes & Cognitive Blindspots
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Transform misses into mastery. Questions you solve correctly are removed automatically.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-rose-500/15 border border-rose-500/30 px-3.5 py-1 text-xs font-bold text-rose-300">
            {mistakes.length} Missed {mistakes.length === 1 ? "Question" : "Questions"}
          </span>
        </div>
      </div>

      {mistakes.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-12 text-center space-y-4 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-2xl">
            ✨
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Flawless Synaptic Record!
          </h2>
          <p className="mx-auto max-w-md text-xs sm:text-sm text-slate-300">
            You currently have no unmastered mistakes in your ledger. Test your limits in Rain Rush
            or practice new domains!
          </p>
          <button
            onClick={onSwitchToPractice}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-105 border border-white/20"
          >
            <BookOpen className="h-4 w-4" />
            <span>Go to Practice Hub</span>
          </button>
        </div>
      ) : (
        currentQ && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span>
                Reviewing <strong className="text-rose-400">#{currentIndex + 1}</strong> of{" "}
                {mistakes.length}
              </span>
              <button
                onClick={() => onRemoveMistake(currentQ.id)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-300 transition-colors"
                title="Dismiss question without answering"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Dismiss</span>
              </button>
            </div>

            <QuestionCard
              question={currentQ}
              onAnswer={handleAnswer}
              onNext={handleNext}
              hasNext={currentIndex + 1 < mistakes.length}
              isInVault={vaultQuestions.some((v) => v.id === currentQ.id)}
              onToggleVault={onToggleVault}
              modeLabel="Mistake Review"
            />
          </div>
        )
      )}
    </div>
  );
};
