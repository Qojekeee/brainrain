import { UserStats, Achievement, Question, AnswerRecord } from "../types";

const STATS_KEY = "brain_rain_stats_v1";
const VAULT_KEY = "brain_rain_vault_v1";
const MISTAKES_KEY = "brain_rain_mistakes_v1";
const HISTORY_KEY = "brain_rain_history_v1";
const SETTINGS_KEY = "brain_rain_settings_v1";

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_drop",
    title: "First Raindrop",
    description: "Answer your first intellectual question correctly.",
    icon: "💧",
    category: "rain",
  },
  {
    id: "streak_5",
    title: "Synapse Spark",
    description: "Achieve a 5-question answer streak without failing.",
    icon: "⚡",
    category: "streak",
  },
  {
    id: "streak_10",
    title: "Cognitive Cascade",
    description: "Reach a streak of 10 consecutive correct answers.",
    icon: "🌊",
    category: "streak",
  },
  {
    id: "speed_demon",
    title: "Lightning Neuron",
    description: "Answer a Master or Polymath question correctly in under 4 seconds.",
    icon: "⏱️",
    category: "speed",
  },
  {
    id: "polymath_initiate",
    title: "Polymath Emergence",
    description: "Answer at least 3 questions correctly across 5 different categories.",
    icon: "🏛️",
    category: "knowledge",
  },
  {
    id: "storm_survivor",
    title: "Rain Master",
    description: "Score over 1,500 points in a single Brain Rain cascade rush.",
    icon: "🌧️",
    category: "rain",
  },
  {
    id: "blitz_champion",
    title: "Blitz Maestro",
    description: "Answer 15+ correct questions in a single 60-second Blitz shower.",
    icon: "🏆",
    category: "speed",
  },
  {
    id: "vault_collector",
    title: "Cerebral Archivist",
    description: "Save 5 intriguing questions to your Cerebral Vault.",
    icon: "🗝️",
    category: "mastery",
  },
  {
    id: "daily_devotee",
    title: "Daily Luminary",
    description: "Complete 3 Daily Brain Showers.",
    icon: "✨",
    category: "mastery",
  },
];

const DEFAULT_STATS: UserStats = {
  totalAnswered: 0,
  totalCorrect: 0,
  currentStreak: 0,
  bestStreak: 0,
  brainQuotient: 1000,
  categoryStats: {},
  dailyCompletedDates: [],
  dailyStreak: 0,
  lastDailyDate: null,
  highScores: {
    rainRush: 0,
    blitz: 0,
    daily: 0,
  },
  achievementsUnlocked: [],
  totalRainDropsCollected: 0,
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error("Failed to save stats", err);
  }
}

export function recordAnswer(
  question: Question,
  isCorrect: boolean,
  userAnswerIndex: number,
  timeSpentMs: number
): { updatedStats: UserStats; newlyUnlockedAchievements: Achievement[] } {
  const stats = loadUserStats();
  const cat = question.category || "General";

  // Update totals
  stats.totalAnswered += 1;
  if (isCorrect) {
    stats.totalCorrect += 1;
    stats.currentStreak += 1;
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
    stats.totalRainDropsCollected += 1;

    // BQ delta based on difficulty & speed
    const diffBonus =
      question.difficulty === "Polymath"
        ? 25
        : question.difficulty === "Master"
        ? 18
        : question.difficulty === "Scholar"
        ? 12
        : 8;
    const speedBonus = timeSpentMs < 5000 ? 5 : 0;
    stats.brainQuotient = Math.round(stats.brainQuotient + diffBonus + speedBonus);
  } else {
    stats.currentStreak = 0;
    // Slight BQ decrease on incorrect, minimum 800
    const penalty = question.difficulty === "Novice" ? 10 : 5;
    stats.brainQuotient = Math.max(800, stats.brainQuotient - penalty);
    // Add to mistakes bank
    saveMistake(question);
  }

  // Update category stats
  if (!stats.categoryStats[cat]) {
    stats.categoryStats[cat] = { answered: 0, correct: 0, bestStreak: 0 };
  }
  stats.categoryStats[cat].answered += 1;
  if (isCorrect) {
    stats.categoryStats[cat].correct += 1;
  }

  // Check achievements
  const newlyUnlocked: Achievement[] = [];
  const unlock = (achId: string) => {
    if (!stats.achievementsUnlocked.includes(achId)) {
      stats.achievementsUnlocked.push(achId);
      const ach = INITIAL_ACHIEVEMENTS.find((a) => a.id === achId);
      if (ach) newlyUnlocked.push(ach);
    }
  };

  if (stats.totalCorrect >= 1) unlock("first_drop");
  if (stats.currentStreak >= 5) unlock("streak_5");
  if (stats.currentStreak >= 10) unlock("streak_10");
  if (
    isCorrect &&
    (question.difficulty === "Master" || question.difficulty === "Polymath") &&
    timeSpentMs < 4000
  ) {
    unlock("speed_demon");
  }

  // Polymath check (3+ correct in 5+ categories)
  const masterCats = Object.values(stats.categoryStats).filter(
    (c) => c.correct >= 3
  ).length;
  if (masterCats >= 5) unlock("polymath_initiate");

  saveUserStats(stats);

  // Save history record
  saveHistoryRecord({
    questionId: question.id,
    questionText: question.question,
    category: question.category,
    difficulty: question.difficulty,
    userAnswerIndex,
    correctAnswerIndex: question.correctAnswerIndex,
    isCorrect,
    timeSpentMs,
    timestamp: Date.now(),
  });

  return { updatedStats: stats, newlyUnlockedAchievements: newlyUnlocked };
}

// Vault (Bookmarked questions)
export function getVaultQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isQuestionInVault(questionId: string): boolean {
  const vault = getVaultQuestions();
  return vault.some((q) => q.id === questionId);
}

export function toggleVaultQuestion(question: Question): boolean {
  const vault = getVaultQuestions();
  const exists = vault.some((q) => q.id === question.id);
  let updated: Question[];
  if (exists) {
    updated = vault.filter((q) => q.id !== question.id);
  } else {
    updated = [question, ...vault];
  }
  localStorage.setItem(VAULT_KEY, JSON.stringify(updated));

  // Check vault achievement
  if (updated.length >= 5) {
    const stats = loadUserStats();
    if (!stats.achievementsUnlocked.includes("vault_collector")) {
      stats.achievementsUnlocked.push("vault_collector");
      saveUserStats(stats);
    }
  }

  return !exists;
}

// Mistakes bank
export function getMistakes(): Question[] {
  try {
    const raw = localStorage.getItem(MISTAKES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMistake(question: Question): void {
  try {
    const list = getMistakes();
    if (!list.some((q) => q.id === question.id)) {
      localStorage.setItem(
        MISTAKES_KEY,
        JSON.stringify([question, ...list.slice(0, 99)])
      );
    }
  } catch {
    // Ignore
  }
}

export function removeMistake(questionId: string): void {
  try {
    const list = getMistakes().filter((q) => q.id !== questionId);
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(list));
  } catch {
    // Ignore
  }
}

// History
export function getHistoryRecords(): AnswerRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistoryRecord(record: AnswerRecord): void {
  try {
    const history = getHistoryRecords();
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([record, ...history.slice(0, 199)])
    );
  } catch {
    // Ignore
  }
}

// Sound Settings
export function getSoundSettings(): {
  soundEffects: boolean;
  ambientRain: boolean;
  volume: number;
} {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { soundEffects: true, ambientRain: false, volume: 0.6 };
}

export function saveSoundSettings(settings: {
  soundEffects: boolean;
  ambientRain: boolean;
  volume: number;
}) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
