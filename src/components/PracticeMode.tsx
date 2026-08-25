import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Filter,
  Search,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Question, CategoryType, DifficultyLevel } from "../types";
import { CATEGORIES, DIFFICULTIES } from "../data/questions";
import { QuestionCard } from "./QuestionCard";
import { soundManager } from "../utils/audio";

interface PracticeModeProps {
  questions: Question[];
  onRecordAnswer: (
    question: Question,
    isCorrect: boolean,
    userAnswerIndex: number,
    timeSpentMs: number
  ) => void;
  vaultQuestions: Question[];
  onToggleVault: (q: Question) => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  questions,
  onRecordAnswer,
  vaultQuestions,
  onToggleVault,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [practiceDeck, setPracticeDeck] = useState<Question[]>(questions);

  // Filter questions based on category, difficulty, search query
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchCat =
        selectedCategory === "All" ||
        q.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchDiff =
        selectedDifficulty === "All" ||
        q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDiff && matchSearch;
    });
  }, [questions, selectedCategory, selectedDifficulty, searchQuery]);

  // Handle deck updates
  const activeQuestions = filteredQuestions.length > 0 ? filteredQuestions : questions;
  const currentQuestion = activeQuestions[Math.min(currentIndex, activeQuestions.length - 1)];

  const handleShuffle = () => {
    soundManager.playClick();
    const shuffled = [...activeQuestions].sort(() => 0.5 - Math.random());
    setPracticeDeck(shuffled);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <h1 className="font-serif text-xl font-bold text-white sm:text-2xl">
              Intellectual Practice Hub
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Explore and master concepts at your own pace with deep logic breakdowns, hints, and AI insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="shuffle-deck-btn"
            onClick={handleShuffle}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <Shuffle className="h-3.5 w-3.5 text-blue-400" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-3.5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-lg">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="practice-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
            }}
            placeholder="Search questions by concept, keywords, or thinkers..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md py-2.5 pl-11 pr-4 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-bold uppercase text-slate-400 px-1">Domain:</span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                }}
                className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-blue-500/20 text-white border border-blue-500/40 shadow-sm"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Difficulty Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] font-bold uppercase text-slate-400 px-1">Difficulty:</span>
          {DIFFICULTIES.map((diff) => {
            const isSelected = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedDifficulty(diff);
                  setCurrentIndex(0);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress & Pagination Tracker */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <div className="flex items-center gap-2">
          <span>Question</span>
          <strong className="font-mono text-sm text-blue-300">{currentIndex + 1}</strong>
          <span>of</span>
          <strong className="font-mono text-sm text-slate-200">{activeQuestions.length}</strong>
        </div>

        {/* Previous & Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="prev-question-btn"
            onClick={() => {
              soundManager.playClick();
              handlePrev();
            }}
            disabled={currentIndex === 0}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white backdrop-blur-md transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            id="next-question-nav-btn"
            onClick={() => {
              soundManager.playClick();
              handleNext();
            }}
            disabled={currentIndex >= activeQuestions.length - 1}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white backdrop-blur-md transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active Question Display */}
      {currentQuestion ? (
        <QuestionCard
          question={currentQuestion}
          onAnswer={(selectedIndex, isCorrect, timeSpentMs) => {
            onRecordAnswer(currentQuestion, isCorrect, selectedIndex, timeSpentMs);
          }}
          onNext={handleNext}
          hasNext={currentIndex + 1 < activeQuestions.length}
          isInVault={vaultQuestions.some((v) => v.id === currentQuestion.id)}
          onToggleVault={onToggleVault}
          modeLabel={`Practice #${currentIndex + 1}`}
        />
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center text-slate-300 shadow-xl">
          No questions matched your filter criteria. Try clearing filters or search term.
        </div>
      )}
    </div>
  );
};
