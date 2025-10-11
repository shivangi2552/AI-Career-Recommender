// backend/utils/achievements.js

export const computeAchievements = (user) => {
  const achievements = [];

  // 5 Skills Learned
  if (user.skills.length >= 5) {
    achievements.push({
      title: "5 Skills Learned",
      description: "Congrats! You have learned 5 skills.",
      icon: "🏆",
      date: new Date(),
    });
  }

  // First Skill Completed
  const completedResources = user.skills.flatMap((s) =>
    s.resources.filter((r) => r.status === "Completed")
  );
  if (completedResources.length >= 1) {
    achievements.push({
      title: "First Skill Completed",
      description: "You completed your first resource!",
      icon: "🎉",
      date: new Date(),
    });
  }

  // Add more rules here if needed (streaks, XP levels, etc.)

  return achievements;
};
