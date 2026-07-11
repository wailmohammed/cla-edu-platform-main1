/**
 * Calculate XP reward based on activity type
 */
export function calculateXPReward(activityType: string): number {
  const rewards: Record<string, number> = {
    lesson_completed: 10,
    exercise_completed: 25,
    quiz_passed: 15,
    code_executed: 5,
  };

  return rewards[activityType] || 0;
}

/**
 * Calculate user level based on total XP
 * Level progression: 100 XP per level
 */
export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1;
}

/**
 * Determine if a badge should be awarded
 */
export function shouldAwardBadge(
  badgeType: string,
  lessonsCompleted: number,
  currentStreak: number
): boolean {
  const badgeRequirements: Record<string, () => boolean> = {
    first_lesson: () => lessonsCompleted === 1,
    streak_7: () => currentStreak >= 7,
    streak_30: () => currentStreak >= 30,
    streak_100: () => currentStreak >= 100,
    course_master: () => lessonsCompleted >= 10,
    speed_runner: () => lessonsCompleted >= 5,
    code_warrior: () => lessonsCompleted >= 20,
    legend: () => lessonsCompleted >= 50,
  };

  const requirement = badgeRequirements[badgeType];
  return requirement ? requirement() : false;
}

/**
 * Calculate streak freeze cost
 */
export function calculateStreakFreezeCost(): number {
  return 50; // 50 XP to freeze a streak
}

/**
 * Check if user can use streak freeze
 */
export function canUseStreakFreeze(freezeDaysRemaining: number, totalXP: number): boolean {
  return freezeDaysRemaining > 0 && totalXP >= calculateStreakFreezeCost();
}

/**
 * Get next level XP requirement
 */
export function getNextLevelXP(currentLevel: number): number {
  return currentLevel * 100;
}

/**
 * Get XP progress to next level
 */
export function getXPProgressToNextLevel(totalXP: number): {
  current: number;
  required: number;
  percentage: number;
} {
  const currentLevel = calculateLevel(totalXP);
  const currentLevelXP = (currentLevel - 1) * 100;
  const nextLevelXP = currentLevel * 100;

  const current = totalXP - currentLevelXP;
  const required = nextLevelXP - currentLevelXP;
  const percentage = Math.round((current / required) * 100);

  return { current, required, percentage };
}
