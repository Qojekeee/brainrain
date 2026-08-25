import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  BookOpen,
  Loader2,
  RefreshCw,
  Plus,
  Compass,
  ArrowRight,
} from "lucide-react";
import { Question, DifficultyLevel } from "../types";
import { QuestionCard } from "./QuestionCard";
import { soundManager } from "../utils/audio";

interface CustomStormGeneratorProps {
  onRecordAnswer: (
    question: Question,
    isCorrect: boolean,
    userAnswerIndex: number,
    timeSpentMs: number
  ) => void;
  vaultQuestions: Question[];
  onToggleVault: (q: Question) => void;
}

const SUGGESTED_TOPICS = [
  "Quantum Computing & Entanglement",
  "Ancient Roman Military Strategy & Engineering",
  "Existentialist Philosophy & Sartre",
  "Neuroscience & Brain Plasticity",
  "Astrophysics & Dark Matter",
  "Cryptographic Protocols & Zero-Knowledge Proofs",
  "Game Theory & Nash Equilibrium",
  "Renaissance Art & Anatomy",
  "Linguistic Relativity & Sapir-Whorf Hypothesis",
  "Evolutionary Biology & Epigenetics",
];

export const CustomStormGenerator: React.FC<CustomStormGeneratorProps> = ({
  onRecordAnswer,
  vaultQuestions,
  onToggleVault,
}) => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Scholar");
  const [count, setCount] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleGenerate = async (topicToUse?: string) => {
    const finalTopic = (topicToUse || topic).trim();
    if (!finalTopic) return;

    soundManager.playClick();
    setIsLoading(true);
    setError(null);
    setGeneratedQuestions([]);
    setCurrentIndex(0);

    try {
      const response = await fetch("/api/gemini/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: finalTopic,
          difficulty,
          count,
          category: "AI Topic Storm",
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate questions.");
      }

      if (data.questions && data.questions.length > 0) {
        setGeneratedQuestions(data.questions);
        soundManager.playVictory();
      } else {
        throw new Error("No questions were generated. Please try a different prompt.");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || "Failed to connect to AI generator. Please check your network and API key."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentQ = generatedQuestions[currentIndex];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-white sm:text-2xl">
              AI Topic Storm Generator
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Generate infinite, intellectually rigorous question showers on ANY custom domain powered by Gemini 3.7.
            </p>
          </div>
        </div>
      </div>

      {/* Generation Form */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
        {/* Topic Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Target Intellectual Domain or Topic
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              id="ai-topic-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Quantum Electrodynamics, French Absurdism, Byzantine Architecture, Game Theory..."
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerate();
              }}
            />
            <button
              id="generate-storm-btn"
              onClick={() => handleGenerate()}
              disabled={isLoading || !topic.trim()}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-40 transition-all border border-white/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Storm</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Configuration Row: Difficulty & Count */}
        <div className="flex flex-wrap items-center gap-5 text-xs">
          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold">Difficulty:</span>
            {(["Novice", "Scholar", "Master", "Polymath"] as DifficultyLevel[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-xl px-3 py-1.5 font-medium transition-all ${
                  difficulty === d
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-sm"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Count */}
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold">Questions:</span>
            {[3, 5, 10].map((c) => (
              <button
                key={c}
                onClick={() => setCount(c)}
                className={`rounded-xl px-3 py-1.5 font-medium transition-all ${
                  count === c
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold shadow-sm"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Topic Chips */}
        <div className="pt-2">
          <span className="block text-[11px] font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-blue-400" />
            Curated Curiosities (Click to Instant-Generate):
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTopic(t);
                  handleGenerate(t);
                }}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-3 py-1.5 text-[11px] text-slate-200 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white transition-all"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 backdrop-blur-md p-3.5 text-xs text-rose-300">
            {error}
          </div>
        )}
      </div>

      {/* Active Generated Set Display */}
      {generatedQuestions.length > 0 && currentQ && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-indigo-300">Topic:</span>
              <span className="text-slate-200">{topic || "Custom Storm"}</span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <span className="text-blue-300">{currentIndex + 1}</span> / {generatedQuestions.length}
            </div>
          </div>

          <QuestionCard
            question={currentQ}
            onAnswer={(selectedIndex, isCorrect, timeSpentMs) => {
              onRecordAnswer(currentQ, isCorrect, selectedIndex, timeSpentMs);
            }}
            onNext={() => {
              if (currentIndex + 1 < generatedQuestions.length) {
                setCurrentIndex((prev) => prev + 1);
              }
            }}
            hasNext={currentIndex + 1 < generatedQuestions.length}
            isInVault={vaultQuestions.some((v) => v.id === currentQ.id)}
            onToggleVault={onToggleVault}
            modeLabel={`AI Storm #${currentIndex + 1}`}
          />
        </div>
      )}
    </div>
  );
};
