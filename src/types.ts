export type CategoryType =
  | "Logic & Riddles"
  | "Science & Cosmos"
  | "History & Civilization"
  | "Philosophy & Ideas"
  | "Literature & Words"
  | "Mathematics & Patterns"
  | "Geography & Nature"
  | "Art & Culture"
  | "AI Custom";

export type DifficultyLevel = "Novice" | "Scholar" | "Master" | "Polymath";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint: string;
  didYouKnow?: string;
  category: CategoryType | string;
  difficulty: DifficultyLevel;
  source?: string;
  tags?: string[];
}

export type GameMode =
  | "rain" // Falling rain rush / cascade storm
  | "practice" // Chill practice with filters, hints & AI tutor
  | "blitz" // 60s speed storm
  | "daily" // Daily 10-question intellect challenge
  | "custom_storm" // AI Topic Shower generator
  | "mistakes" // Review missed questions
  | "vault" // Bookmarked brain teasers
  | "stats"; // Cerebral profile & metrics

export interface AnswerRecord {
  questionId: string;
  questionText: string;
  category: string;
  difficulty: DifficultyLevel;
  userAnswerIndex: number;
  correctAnswerIndex: number;
  isCorrect: boolean;
  timeSpentMs: number;
  timestamp: number;
}

export interface UserStats {
  totalAnswered: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  brainQuotient: number; // Dynamic rating score (starting ~1000)
  categoryStats: Record<
    string,
    {
      answered: number;
      correct: number;
      bestStreak: number;
    }
  >;
  dailyCompletedDates: string[]; // ['2026-08-24', ...]
  dailyStreak: number;
  lastDailyDate: string | null;
  highScores: {
    rainRush: number;
    blitz: number;
    daily: number;
  };
  achievementsUnlocked: string[];
  totalRainDropsCollected: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  category: "streak" | "speed" | "mastery" | "knowledge" | "rain";
}

export interface SoundConfig {
  soundEffects: boolean;
  ambientRain: boolean;
  volume: number;
}

export interface FilterOptions {
  category: string | "All";
  difficulty: DifficultyLevel | "All";
  searchQuery: string;
}
