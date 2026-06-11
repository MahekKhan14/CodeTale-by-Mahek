import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { saveProgress, loadProgress } from '../api/client';

const XP_PER_LEVEL = 300;

// Spaced repetition intervals (days)
const SRS_INTERVALS = [1, 3, 7, 14, 30];

function generateSessionId() {
  return 'ct_' + Math.random().toString(36).slice(2, 11);
}

function getDailyQuests(dateStr) {
  return [
    { id: `${dateStr}_solve`, icon: '⚔️', title: 'Solve a problem', xp: 75, type: 'solve', target: 1, progress: 0 },
    { id: `${dateStr}_learn`, icon: '📖', title: 'Study a concept', xp: 40, type: 'learn', target: 1, progress: 0 },
    { id: `${dateStr}_nohint`, icon: '🧠', title: 'Solve without hints', xp: 60, type: 'no_hints', target: 1, progress: 0 },
  ];
}

export const ACHIEVEMENTS = [
  { id: 'first_solve', icon: '🎯', title: 'First Solution', desc: 'Solved your first problem', rarity: 'common' },
  { id: 'no_hints', icon: '🧠', title: 'Unaided', desc: 'Solved without any hints', rarity: 'rare' },
  { id: 'streak_3', icon: '🔥', title: 'On a Roll', desc: '3-day streak', rarity: 'common' },
  { id: 'streak_7', icon: '⚡', title: 'Week Warrior', desc: '7-day streak', rarity: 'epic' },
  { id: 'speed_solve', icon: '💨', title: 'Speed Run', desc: 'Solved in under 90 seconds', rarity: 'epic' },
  { id: 'boss_first', icon: '🐉', title: 'Dragon Slayer', desc: 'Defeated your first boss', rarity: 'epic' },
  { id: 'teach_byte', icon: '🎓', title: 'The Teacher', desc: 'Taught Byte 3 concepts', rarity: 'rare' },
  { id: 'interview_mock', icon: '💼', title: 'Mock Ready', desc: 'Completed a mock interview', rarity: 'rare' },
  { id: 'readiness_50', icon: '📈', title: 'Halfway There', desc: 'Readiness score ≥ 50', rarity: 'rare' },
  { id: 'readiness_80', icon: '🌟', title: 'Interview Ready', desc: 'Readiness score ≥ 80', rarity: 'legendary' },
  { id: 'phase_1', icon: '🥚', title: 'Foundation Set', desc: 'Completed Phase 1', rarity: 'common' },
  { id: 'five_streak_problems', icon: '🏹', title: 'On Fire', desc: 'Solved 5 problems in a row', rarity: 'epic' },
];

export const useStore = create(
  persist(
    (set, get) => ({
      // ── Identity ─────────────────────────────────────
      playerName: '',
      avatar: '🧑‍💻',
      sessionId: generateSessionId(),

      // ── Progress ──────────────────────────────────────
      xp: 0,
      level: 1,
      streak: 0,
      lastPlayed: null,
      streakShields: 1,

      completedProblems: [],    // array of problem ids
      completedChapters: [],
      unlockedChapters: ['ch1'],
      earnedAchievements: [],

      // Problem metadata
      attempts: {},             // problemId → count
      hintsUsed: {},            // problemId → count
      solveTimes: {},           // problemId → seconds
      teachByteCount: 0,
      mockInterviewCount: 0,
      consecutiveSolves: 0,

      // ── Spaced repetition ─────────────────────────────
      // problemId → { interval_index, next_review_date }
      srsSchedule: {},

      // ── Learning profile (sent to AI) ─────────────────
      weakTopics: [],
      strongTopics: [],
      learningStyle: 'balanced',
      avgAttempts: 1.0,
      hintUsageRate: 0.0,

      // ── Daily quests ──────────────────────────────────
      dailyQuests: getDailyQuests(new Date().toDateString()),
      dailyQuestDate: new Date().toDateString(),

      // ── Navigation ────────────────────────────────────
      currentScreen: 'landing',
      currentChapter: null,
      currentProblem: null,

      // ── Pending UI events ─────────────────────────────
      pendingAchievement: null,
      backendOnline: null,   // null=unknown, true, false

      // ── Actions ───────────────────────────────────────
      setPlayer: (name, avatar) => set({ playerName: name, avatar }),

      go: (screen) => set({ currentScreen: screen }),
      setCurrentChapter: (ch) => set({ currentChapter: ch }),
      setCurrentProblem: (p) => set({ currentProblem: p }),

      addXP: (amount) => set((s) => {
        const newXP = s.xp + amount;
        const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
        return { xp: newXP, level: newLevel };
      }),

      completeProblem: (problemId, { usedHints = false, solveTime = 0 } = {}) => set((s) => {
        if (s.completedProblems.includes(problemId)) return s;

        const newCompleted = [...s.completedProblems, problemId];
        const newConsecutive = s.consecutiveSolves + 1;
        const newAchievements = [...s.earnedAchievements];
        let pendingAchievement = null;

        // Achievement checks
        const checks = [
          [newCompleted.length === 1, 'first_solve'],
          [!usedHints, 'no_hints'],
          [solveTime > 0 && solveTime < 90, 'speed_solve'],
          [newConsecutive >= 5, 'five_streak_problems'],
        ];
        for (const [cond, id] of checks) {
          if (cond && !newAchievements.includes(id)) {
            newAchievements.push(id);
            pendingAchievement = id;
          }
        }

        // SRS scheduling
        const srsSchedule = { ...s.srsSchedule };
        const now = new Date();
        const nextReview = new Date(now);
        nextReview.setDate(now.getDate() + SRS_INTERVALS[0]);
        srsSchedule[problemId] = { interval_index: 0, next_review: nextReview.toISOString() };

        // Update daily quests
        const today = new Date().toDateString();
        let dailyQuests = s.dailyQuests;
        if (s.dailyQuestDate === today) {
          dailyQuests = s.dailyQuests.map(q =>
            q.type === 'solve' ? { ...q, progress: Math.min(q.target, q.progress + 1) } :
            (q.type === 'no_hints' && !usedHints) ? { ...q, progress: Math.min(q.target, q.progress + 1) } :
            q
          );
        }

        // Recalculate learning metrics
        const totalHintProblems = Object.values(s.hintsUsed).filter(h => h > 0).length;
        const hintUsageRate = newCompleted.length > 0 ? totalHintProblems / newCompleted.length : 0;
        const allAttempts = Object.values(s.attempts);
        const avgAttempts = allAttempts.length > 0 ? allAttempts.reduce((a, b) => a + b, 0) / allAttempts.length : 1;

        return {
          completedProblems: newCompleted,
          earnedAchievements: newAchievements,
          pendingAchievement,
          consecutiveSolves: newConsecutive,
          srsSchedule,
          dailyQuests,
          hintUsageRate,
          avgAttempts,
          solveTimes: solveTime ? { ...s.solveTimes, [problemId]: solveTime } : s.solveTimes,
        };
      }),

      completeChapter: (chapterId, nextChapterId) => set((s) => {
        const newCompleted = s.completedChapters.includes(chapterId)
          ? s.completedChapters : [...s.completedChapters, chapterId];
        const newUnlocked = nextChapterId && !s.unlockedChapters.includes(nextChapterId)
          ? [...s.unlockedChapters, nextChapterId] : s.unlockedChapters;
        const newAchievements = [...s.earnedAchievements];
        let pendingAchievement = null;
        if (!newAchievements.includes('boss_first')) {
          newAchievements.push('boss_first');
          pendingAchievement = 'boss_first';
        }
        return { completedChapters: newCompleted, unlockedChapters: newUnlocked, earnedAchievements: newAchievements, pendingAchievement };
      }),

      incrementAttempts: (problemId) => set((s) => ({
        attempts: { ...s.attempts, [problemId]: (s.attempts[problemId] || 0) + 1 },
        consecutiveSolves: 0, // reset on failure
      })),

      useHint: (problemId) => set((s) => ({
        hintsUsed: { ...s.hintsUsed, [problemId]: (s.hintsUsed[problemId] || 0) + 1 },
      })),

      learnConcept: () => set((s) => {
        const today = new Date().toDateString();
        if (s.dailyQuestDate !== today) return s;
        return {
          dailyQuests: s.dailyQuests.map(q =>
            q.type === 'learn' ? { ...q, progress: Math.min(q.target, q.progress + 1) } : q
          ),
        };
      }),

      incrementTeachByte: () => set((s) => {
        const count = s.teachByteCount + 1;
        const newAchievements = [...s.earnedAchievements];
        let pendingAchievement = null;
        if (count >= 3 && !newAchievements.includes('teach_byte')) {
          newAchievements.push('teach_byte');
          pendingAchievement = 'teach_byte';
        }
        return { teachByteCount: count, earnedAchievements: newAchievements, pendingAchievement };
      }),

      updateReadinessAchievement: (score) => set((s) => {
        const newAchievements = [...s.earnedAchievements];
        let pendingAchievement = null;
        if (score >= 80 && !newAchievements.includes('readiness_80')) {
          newAchievements.push('readiness_80');
          pendingAchievement = 'readiness_80';
        } else if (score >= 50 && !newAchievements.includes('readiness_50')) {
          newAchievements.push('readiness_50');
          pendingAchievement = 'readiness_50';
        }
        return { earnedAchievements: newAchievements, pendingAchievement };
      }),

      updateStreak: () => set((s) => {
        const today = new Date().toDateString();
        if (s.lastPlayed === today) return s;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        let newStreak = s.lastPlayed === yesterday ? s.streak + 1 : 1;

        const newAchievements = [...s.earnedAchievements];
        let pendingAchievement = null;
        if (newStreak >= 7 && !newAchievements.includes('streak_7')) {
          newAchievements.push('streak_7'); pendingAchievement = 'streak_7';
        } else if (newStreak >= 3 && !newAchievements.includes('streak_3')) {
          newAchievements.push('streak_3'); pendingAchievement = 'streak_3';
        }

        const dailyQuests = s.dailyQuestDate !== today ? getDailyQuests(today) : s.dailyQuests;
        return { streak: newStreak, lastPlayed: today, earnedAchievements: newAchievements, pendingAchievement, dailyQuests, dailyQuestDate: today };
      }),

      clearPendingAchievement: () => set({ pendingAchievement: null }),
      setBackendOnline: (status) => set({ backendOnline: status }),

      // ── Due for review (SRS) ──────────────────────────
      getDueForReview: () => {
        const { srsSchedule, completedProblems } = get();
        const now = new Date();
        return completedProblems.filter(id => {
          const entry = srsSchedule[id];
          if (!entry) return false;
          return new Date(entry.next_review) <= now;
        });
      },

      // ── Computed helpers ──────────────────────────────
      getXPProgress: () => {
        const { xp, level } = get();
        return ((xp - (level - 1) * XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
      },

      getLevelTitle: () => {
        const { level } = get();
        const titles = ['', 'Code Newbie', 'Variable Voyager', 'Loop Knight', 'Function Mage',
          'Array Archer', 'String Slayer', 'Hash Wizard', 'Stack Samurai', 'Recursion Ranger',
          'Tree Titan', 'Graph Guardian', 'DP Dragon', 'Algorithm Ace', 'Interview Legend', 'Code Deity'];
        return titles[Math.min(level, titles.length - 1)];
      },

      getStreakMultiplier: () => {
        const { streak } = get();
        if (streak >= 14) return 2.0;
        if (streak >= 7) return 1.5;
        if (streak >= 3) return 1.25;
        return 1.0;
      },

      getLearningProfile: () => {
        const s = get();
        return {
          session_id: s.sessionId,
          player_name: s.playerName,
          level: s.level,
          xp: s.xp,
          completed_problems: s.completedProblems,
          completed_chapters: s.completedChapters,
          weak_topics: s.weakTopics,
          strong_topics: s.strongTopics,
          avg_attempts: s.avgAttempts,
          hint_usage_rate: s.hintUsageRate,
          learning_style: s.learningStyle,
          streak: s.streak,
        };
      },

      resetGame: () => set({
        playerName: '', avatar: '🧑‍💻', sessionId: generateSessionId(),
        xp: 0, level: 1, streak: 0, lastPlayed: null, streakShields: 1,
        completedProblems: [], completedChapters: [], unlockedChapters: ['ch1'],
        earnedAchievements: [], attempts: {}, hintsUsed: {}, solveTimes: {},
        teachByteCount: 0, mockInterviewCount: 0, consecutiveSolves: 0,
        srsSchedule: {}, weakTopics: [], strongTopics: [],
        dailyQuests: getDailyQuests(new Date().toDateString()),
        dailyQuestDate: new Date().toDateString(),
        currentScreen: 'landing', currentChapter: null, currentProblem: null,
      }),
    }),
    { name: 'codetale-v3-save' }
  )
);
