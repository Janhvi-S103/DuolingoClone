const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface User {
  id: number;
  username: string;
  name: string;
  avatar: string;
  total_xp: number;
  streak: number;
  hearts: number;
  max_hearts: number;
  gems: number;
  daily_goal_xp: number;
  today_xp: number;
  league: string;
  has_streak_freeze: boolean;
  last_active_date: string;
}

export interface SkillItem {
  id: number;
  unit_id: number;
  order_index: number;
  title: string;
  icon: string;
  total_lessons: number;
  position_x: number;
  completed_lessons: number;
  is_unlocked: boolean;
  is_completed: boolean;
  crown_level: number;
}

export interface UnitItem {
  id: number;
  order_index: number;
  title: string;
  description: string;
  guidebook_content?: string;
  theme_color: string;
  skills: SkillItem[];
}

export interface CoursePathData {
  course: {
    id: number;
    title: string;
    flag: string;
    code: string;
  };
  units: UnitItem[];
  user: User;
}

export interface Exercise {
  id: number;
  lesson_id: number;
  order_index: number;
  type: "multiple_choice" | "translate_word_bank" | "match_pairs" | "fill_in_blank" | "type_answer";
  prompt: string;
  target_text?: string;
  audio_text?: string;
  data: Record<string, any>;
}

export interface LessonData {
  id: number;
  skill_id: number;
  order_index: number;
  title: string;
  xp_reward: number;
  exercises: Exercise[];
}

export interface LeaderboardUser {
  id: number;
  name: string;
  avatar: string;
  league: string;
  xp: number;
  is_current_user: boolean;
  rank: number;
}

export interface Achievement {
  id: number;
  key: string;
  title: string;
  description: string;
  icon: string;
  target_value: number;
  current_value: number;
  is_unlocked: boolean;
  tier: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  badge: string;
  can_buy: boolean;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    }
  });

  if (!res.ok) {
    let errorMsg = `API request failed with status ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.detail) errorMsg = errJson.detail;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  getCoursePath: () => request<CoursePathData>("/api/course/path"),
  getLesson: (lessonId: number) => request<LessonData>(`/api/lessons/${lessonId}`),
  getLessonBySkill: (skillId: number) => request<LessonData>(`/api/lessons/by-skill/${skillId}`),
  completeLesson: (lessonId: number, body: { hearts_remaining: number; accuracy: number; time_taken_seconds: number }) =>
    request<{
      success: boolean;
      xp_awarded: number;
      new_total_xp: number;
      today_xp: number;
      new_streak: number;
      hearts: number;
      skill_completed: boolean;
      next_skill_unlocked: boolean;
      message: string;
    }>(`/api/lessons/${lessonId}/complete`, {
      method: "POST",
      body: JSON.stringify(body)
    }),
  getCurrentUser: () => request<User>("/api/user/current"),
  loseHeart: () => request<User>("/api/user/heart-lost", { method: "POST" }),
  refillHearts: () => request<{ success: boolean; hearts: number; gems: number; message: string }>("/api/user/refill-hearts", { method: "POST" }),
  simulateDay: () => request<{ success: boolean; streak: number; today_xp: number; last_active_date: string; message: string }>("/api/user/simulate-day", { method: "POST" }),
  resetProgress: () => request<{ success: boolean; message: string }>("/api/user/reset", { method: "POST" }),
  getLeaderboard: () => request<LeaderboardUser[]>("/api/leaderboard"),
  getAchievements: () => request<Achievement[]>("/api/achievements"),
  getShop: () => request<{ gems: number; items: ShopItem[] }>("/api/shop"),
  buyShopItem: (itemId: string) =>
    request<{ success: boolean; message: string; hearts?: number; gems: number }>("/api/shop/buy", {
      method: "POST",
      body: JSON.stringify({ item_id: itemId })
    })
};
