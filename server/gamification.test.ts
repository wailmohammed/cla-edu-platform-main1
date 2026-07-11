import { describe, it, expect } from "vitest";
import {
  calculateXPReward,
  calculateLevel,
  shouldAwardBadge,
  getXPProgressToNextLevel,
} from "./gamification-helpers";

describe("Gamification Service", () => {
  describe("calculateXPReward", () => {
    it("should award 10 XP for lesson completion", () => {
      const xp = calculateXPReward("lesson_completed");
      expect(xp).toBe(10);
    });

    it("should award 25 XP for exercise completion", () => {
      const xp = calculateXPReward("exercise_completed");
      expect(xp).toBe(25);
    });

    it("should award 15 XP for quiz passed", () => {
      const xp = calculateXPReward("quiz_passed");
      expect(xp).toBe(15);
    });

    it("should award 5 XP for code execution", () => {
      const xp = calculateXPReward("code_executed");
      expect(xp).toBe(5);
    });

    it("should return 0 for unknown activity type", () => {
      const xp = calculateXPReward("unknown");
      expect(xp).toBe(0);
    });
  });

  describe("calculateLevel", () => {
    it("should return level 1 for 0 XP", () => {
      const level = calculateLevel(0);
      expect(level).toBe(1);
    });

    it("should return level 2 for 100 XP", () => {
      const level = calculateLevel(100);
      expect(level).toBe(2);
    });

    it("should return level 6 for 500 XP", () => {
      const level = calculateLevel(500);
      expect(level).toBe(6);
    });

    it("should return level 11 for 1000 XP", () => {
      const level = calculateLevel(1000);
      expect(level).toBe(11);
    });
  });

  describe("shouldAwardBadge", () => {
    it("should award first lesson badge on first lesson completion", () => {
      const shouldAward = shouldAwardBadge("first_lesson", 1, 0);
      expect(shouldAward).toBe(true);
    });

    it("should not award first lesson badge on second completion", () => {
      const shouldAward = shouldAwardBadge("first_lesson", 2, 0);
      expect(shouldAward).toBe(false);
    });

    it("should award 7 day streak badge on 7 day streak", () => {
      const shouldAward = shouldAwardBadge("streak_7", 0, 7);
      expect(shouldAward).toBe(true);
    });

    it("should not award 7 day streak badge on 6 day streak", () => {
      const shouldAward = shouldAwardBadge("streak_7", 0, 6);
      expect(shouldAward).toBe(false);
    });

    it("should award 30 day streak badge on 30 day streak", () => {
      const shouldAward = shouldAwardBadge("streak_30", 0, 30);
      expect(shouldAward).toBe(true);
    });

    it("should award course master badge on 10 lessons completed", () => {
      const shouldAward = shouldAwardBadge("course_master", 10, 0);
      expect(shouldAward).toBe(true);
    });

    it("should not award course master badge on 9 lessons completed", () => {
      const shouldAward = shouldAwardBadge("course_master", 9, 0);
      expect(shouldAward).toBe(false);
    });

    it("should return false for unknown badge type", () => {
      const shouldAward = shouldAwardBadge("unknown_badge", 10, 10);
      expect(shouldAward).toBe(false);
    });
  });

  describe("getXPProgressToNextLevel", () => {
    it("should return 50% progress at 50 XP", () => {
      const progress = getXPProgressToNextLevel(50);
      expect(progress.percentage).toBe(50);
    });

    it("should return 0% progress at 0 XP", () => {
      const progress = getXPProgressToNextLevel(0);
      expect(progress.percentage).toBe(0);
    });

    it("should return 0% progress at 100 XP (start of next level)", () => {
      const progress = getXPProgressToNextLevel(100);
      expect(progress.percentage).toBe(0);
    });

    it("should return 75% progress at 175 XP", () => {
      const progress = getXPProgressToNextLevel(175);
      expect(progress.percentage).toBe(75);
    });
  });
});
