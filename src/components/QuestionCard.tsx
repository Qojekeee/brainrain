import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lightbulb,
  Scissors,
  Share2,
  Info,
  Loader2,
} from "lucide-react";
import { Question } from "../types";
import { soundManager } from "../utils/audio";
import confetti from "canvas-confetti";

interface QuestionCardProps {
  question: Question;
  onAnswer: (selectedIndex: number, isCorrect: boolean, timeSpentMs: number) => void;
  onNext?: () => void;
  hasNext?: boolean;
  isInVault?: boolean;
  onToggleVault?: (question: Question) => void;
  showTimer?: boolean;
  timeRemaining?: number;
  totalTime?: number;
  modeLabel?: string;
  autoAdvanceDelay?: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  onNext,
  hasNext = true,
  isInVault = false,
  onToggleVault,
  showTimer = false,
  timeRemaining = 0,
  totalTime = 20,
  modeLabel,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showHint, setShowHint] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [hasUsed5050, setHasUsed5050] = useState(false);

  // AI Deep Dive State
  const [aiDeepDive, setAiDeepDive] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Reset local states on new question
  useEffect(() => {
    setSelectedOption(null);
    setHasAnswered(false);
    setShowHint(false);
    setEliminatedOptions([]);
    setHasUsed5050(false);
    setAiDeepDive(null);
    setIsAiLoading(false);
    setCustomQuery("");
    setStartTime(Date.now());
  }, [question.id]);

  // Keyboard shortcut listener for A, B, C, D or 1, 2, 3, 4, Space/Enter for next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in the AI query input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (!hasAnswered) {
        const key = e.key.toUpperCase();
        let targetIndex: number | null = null;

        if (key === "A" || key === "1") targetIndex = 0;
        else if (key === "B" || key === "2") targetIndex = 1;
        else if (key === "C" || key === "3") targetIndex = 2;
        else if (key === "D" || key === "4") targetIndex = 3;

        if (targetIndex !== null && targetIndex < question.options.length) {
          if (!eliminatedOptions.includes(targetIndex)) {
            handleSelectOption(targetIndex);
          }
        }
      } else {
        if ((e.key === "Enter" || e.key === " ") && onNext && hasNext) {
          e.preventDefault();
          onNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasAnswered, question, eliminatedOptions, onNext, hasNext]);

  const handleSelectOption = (index: number) => {
    if (hasAnswered || eliminatedOptions.includes(index)) return;

    const timeSpent = Date.now() - startTime;
    const isCorrect = index === question.correctAnswerIndex;

    setSelectedOption(index);
    setHasAnswered(true);

    if (isCorrect) {
      soundManager.playRaindrop();
      if (question.difficulty === "Polymath" || question.difficulty === "Master") {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#38bdf8", "#818cf8", "#34d399"],
        });
      }
    } else {
      soundManager.playWrong();
    }

    onAnswer(index, isCorrect, timeSpent);
  };

  const handleUse5050 = () => {
    if (hasUsed5050 || hasAnswered) return;
    soundManager.playClick();
    const wrongIndices = question.options
      .map((_, i) => i)
      .filter((i) => i !== question.correctAnswerIndex);

    // Shuffle and pick 2 to eliminate
    const toEliminate = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setEliminatedOptions(toEliminate);
    setHasUsed5050(true);
  };

  const handleAskBrainAI = async () => {
    setIsAiLoading(true);
    soundManager.playClick();
    try {
      const res = await fetch("/api/gemini/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question,
          options: question.options,
          correctAnswer: question.options[question.correctAnswerIndex],
          selectedAnswer:
            selectedOption !== null ? question.options[selectedOption] : "None",
          userQuery:
            customQuery.trim() ||
            "Give me a deep dive into the reasoning, historical context, or scientific proof behind this concept.",
        }),
      });
      const data = await res.json();
      if (data.explanation) {
        setAiDeepDive(data.explanation);
      } else {
        setAiDeepDive("Could not retrieve AI insight at this time.");
      }
    } catch {
      setAiDeepDive(
        "AI reasoning unavailable without internet or server connection. Please verify your connection."
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Novice":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "Scholar":
        return "bg-blue-500/15 text-blue-300 border-blue-500/30";
      case "Master":
        return "bg-purple-500/15 text-purple-300 border-purple-500/30";
      case "Polymath":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      default:
        return "bg-white/10 text-slate-300 border-white/15";
    }
  };

  const timerPercent =
    showTimer && totalTime > 0
      ? Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100))
      : 100;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8 transition-all">
      {/* Timer Bar (if active) */}
      {showTimer && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/5">
          <div
            className={`h-full transition-all duration-200 ${
              timerPercent < 25
                ? "bg-rose-500 animate-pulse"
                : timerPercent < 50
                ? "bg-amber-400"
                : "bg-blue-400"
            }`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      )}

      {/* Header bar: Category, Difficulty, Lifelines, Bookmark */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {modeLabel && (
            <span className="rounded-xl bg-white/10 border border-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-300">
              {modeLabel}
            </span>
          )}
          <span className="rounded-xl bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
            {question.category}
          </span>
          <span
            className={`rounded-xl border px-3 py-1 text-xs font-bold ${getDifficultyColor(
              question.difficulty
            )}`}
          >
            {question.difficulty}
          </span>
          {question.source && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              {question.source}
            </span>
          )}
        </div>

        {/* Action icons: 50/50, Hint, Vault Bookmark */}
        <div className="flex items-center gap-2">
          {!hasAnswered && (
            <>
              {/* 50/50 Lifeline */}
              <button
                id="lifeline-50-50-btn"
                onClick={handleUse5050}
                disabled={hasUsed5050}
                title="Eliminate two wrong choices (50/50)"
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all backdrop-blur-md ${
                  hasUsed5050
                    ? "opacity-30 cursor-not-allowed text-slate-500 bg-white/5 border border-white/5"
                    : "bg-white/5 border border-white/10 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500/40"
                }`}
              >
                <Scissors className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">50/50</span>
              </button>

              {/* Hint Lifeline */}
              {question.hint && (
                <button
                  id="lifeline-hint-btn"
                  onClick={() => {
                    soundManager.playClick();
                    setShowHint(!showHint);
                  }}
                  title="Reveal thought-provoking clue"
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all backdrop-blur-md ${
                    showHint
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                      : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Hint</span>
                </button>
              )}
            </>
          )}

          {/* Bookmark to Vault */}
          {onToggleVault && (
            <button
              id="bookmark-vault-btn"
              onClick={() => {
                soundManager.playClick();
                onToggleVault(question);
              }}
              title={isInVault ? "Remove from Cerebral Vault" : "Save to Cerebral Vault"}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all backdrop-blur-md ${
                isInVault
                  ? "border-amber-500/40 bg-amber-500/20 text-amber-300 shadow-sm"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {isInVault ? (
                <BookmarkCheck className="h-4 w-4 text-amber-400" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Hint Alert (if revealed) */}
      {showHint && question.hint && (
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-md p-3.5 text-xs text-amber-200 animate-fadeIn">
          <Lightbulb className="h-4 w-4 flex-shrink-0 text-amber-400 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-300">Cerebral Hint:</strong>{" "}
            {question.hint}
          </div>
        </div>
      )}

      {/* Main Question Body */}
      <div className="my-7">
        <h2 className="font-serif text-xl font-bold leading-relaxed tracking-tight text-white sm:text-2xl md:text-3xl">
          {question.question}
        </h2>
      </div>

      {/* Option Buttons */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {question.options.map((option, idx) => {
          const letter = ["A", "B", "C", "D"][idx];
          const isSelected = selectedOption === idx;
          const isCorrect = idx === question.correctAnswerIndex;
          const isEliminated = eliminatedOptions.includes(idx);

          let optionStyle =
            "border-white/10 bg-white/5 text-slate-200 hover:border-blue-500/40 hover:bg-blue-500/15";

          if (isEliminated) {
            optionStyle =
              "border-white/5 bg-white/[0.02] text-slate-600 line-through opacity-30 cursor-not-allowed";
          } else if (hasAnswered) {
            if (isCorrect) {
              optionStyle =
                "border-emerald-500/50 bg-emerald-500/20 text-emerald-200 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400";
            } else if (isSelected && !isCorrect) {
              optionStyle =
                "border-rose-500/50 bg-rose-500/20 text-rose-200 ring-1 ring-rose-400";
            } else {
              optionStyle = "border-white/5 bg-white/[0.02] text-slate-500 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              id={`option-btn-${idx}`}
              onClick={() => handleSelectOption(idx)}
              disabled={hasAnswered || isEliminated}
              className={`group flex items-start gap-3.5 rounded-2xl border p-4 text-left text-sm font-medium backdrop-blur-md transition-all ${optionStyle}`}
            >
              {/* Option Letter Tag */}
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-colors ${
                  hasAnswered && isCorrect
                    ? "bg-emerald-500 text-slate-950"
                    : hasAnswered && isSelected && !isCorrect
                    ? "bg-rose-500 text-white"
                    : isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 border border-white/10 text-slate-300 group-hover:bg-blue-500/30 group-hover:text-white"
                }`}
              >
                {hasAnswered && isCorrect ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : hasAnswered && isSelected && !isCorrect ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  letter
                )}
              </span>

              <span className="flex-1 leading-snug pt-0.5">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Answer Explanation & Deep-Dive Area (Shown after answer) */}
      {hasAnswered && (
        <div className="mt-7 space-y-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6 animate-fadeIn">
          {/* Status banner */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedOption === question.correctAnswerIndex ? (
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Brilliant! Correct reasoning.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                  <XCircle className="h-5 w-5" />
                  <span>Not quite. Correct: {question.options[question.correctAnswerIndex]}</span>
                </div>
              )}
            </div>

            {/* Next Button */}
            {onNext && hasNext && (
              <button
                id="next-question-btn"
                onClick={() => {
                  soundManager.playClick();
                  onNext();
                }}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-105"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Educational Logic Breakdown */}
          <div className="text-xs sm:text-sm leading-relaxed text-slate-300">
            <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-blue-400">
              Logical Explanation
            </h4>
            <p>{question.explanation}</p>
          </div>

          {/* Did You Know fact */}
          {question.didYouKnow && (
            <div className="flex items-start gap-2.5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3.5 text-xs text-blue-200">
              <Info className="h-4 w-4 flex-shrink-0 text-blue-400 mt-0.5" />
              <div>
                <strong className="font-semibold text-blue-300">Curious Fact:</strong>{" "}
                {question.didYouKnow}
              </div>
            </div>
          )}

          {/* AI Deep Dive Section */}
          <div className="border-t border-white/10 pt-3">
            {!aiDeepDive ? (
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="ai-curiosity-query-input"
                    type="text"
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="Ask Gemini AI a question about this topic (or leave empty for deep-dive)..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    id="ask-brain-ai-btn"
                    onClick={handleAskBrainAI}
                    disabled={isAiLoading}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Thinking...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                        <span>Ask Brain AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-blue-500/30 bg-blue-950/40 backdrop-blur-xl p-4 text-xs sm:text-sm text-blue-100 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-blue-300 font-semibold text-xs border-b border-blue-500/20 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    Gemini Intellectual Analysis
                  </span>
                  <button
                    onClick={() => setAiDeepDive(null)}
                    className="text-[10px] text-blue-400 hover:text-blue-200 underline"
                  >
                    Close
                  </button>
                </div>
                <div className="leading-relaxed whitespace-pre-line">{aiDeepDive}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
