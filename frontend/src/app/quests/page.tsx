"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { RightSidebar } from "@/components/RightSidebar";
import { api, Achievement, User } from "@/utils/api";
import { playClickSound } from "@/utils/sound";
import { Flame, Zap, BookOpen, Target, Trophy, Award, CheckCircle } from "lucide-react";

export default function QuestsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [achData, userData] = await Promise.all([
        api.getAchievements(),
        api.getCurrentUser()
      ]);
      setAchievements(achData);
      setUser(userData);
    } catch (e) {
      console.error("Failed to load achievements:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "flame": return <Flame size={28} color="var(--orange)" fill="var(--orange)" />;
      case "zap": return <Zap size={28} color="var(--yellow-dark)" fill="var(--yellow)" />;
      case "book": return <BookOpen size={28} color="var(--blue)" />;
      case "target": return <Target size={28} color="var(--green)" />;
      case "trophy": return <Trophy size={28} color="var(--gold-dark)" fill="var(--yellow)" />;
      default: return <Award size={28} color="var(--purple)" />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {user && (
          <TopBar
            streak={user.streak}
            gems={user.gems}
            hearts={user.hearts}
            maxHearts={user.max_hearts}
            todayXp={user.today_xp}
          />
        )}

        <main className="main-content">
          <div className="path-center-column" style={{ maxWidth: 640 }}>
            {/* Header */}
            <div style={{ width: "100%", marginBottom: 32 }}>
              <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
                Quests & Achievements
              </h1>
              <p style={{ color: "var(--text-sub)", fontWeight: 600, fontSize: 16 }}>
                Complete daily missions and unlock prestigious badges as you master languages.
              </p>
            </div>

            {/* Daily Quests Section */}
            <div style={{ width: "100%", marginBottom: 40 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>
                Daily Quests
              </h2>
              <div
                className="sidebar-card"
                style={{ display: "flex", flexDirection: "column", gap: 20, padding: 24 }}
              >
                {/* Quest 1 */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, marginBottom: 8 }}>
                    <span>Earn {user?.daily_goal_xp || 30} XP</span>
                    <span style={{ color: "var(--text-sub)" }}>
                      {user?.today_xp || 0} / {user?.daily_goal_xp || 30} XP
                    </span>
                  </div>
                  <div style={{ height: 12, background: "var(--card-border)", borderRadius: 6, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(100, Math.round(((user?.today_xp || 0) / (user?.daily_goal_xp || 30)) * 100))}%`,
                        background: "var(--yellow)",
                        borderRadius: 6,
                        transition: "width 0.4s ease"
                      }}
                    />
                  </div>
                </div>

                {/* Quest 2 */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, marginBottom: 8 }}>
                    <span>Score 90% or higher in 1 lesson</span>
                    <span style={{ color: "var(--green-text)" }}>Completed!</span>
                  </div>
                  <div style={{ height: 12, background: "var(--card-border)", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "100%", background: "var(--green)", borderRadius: 6 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div style={{ width: "100%" }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>
                Badges & Milestones
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {achievements.map((ach) => {
                  const percent = Math.min(100, Math.round((ach.current_value / ach.target_value) * 100));
                  return (
                    <div
                      key={ach.id}
                      className="sidebar-card"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        padding: "18px 22px",
                        backgroundColor: ach.is_unlocked ? "var(--card-bg)" : "var(--bg-subtle)",
                        opacity: ach.is_unlocked ? 1 : 0.85
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background: ach.is_unlocked ? "var(--yellow-light)" : "var(--card-border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}
                      >
                        {renderBadgeIcon(ach.icon)}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <h3 style={{ fontSize: 18, fontWeight: 900 }}>{ach.title}</h3>
                          {ach.is_unlocked && (
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 800,
                                background: "var(--green-light)",
                                color: "var(--green-text)",
                                padding: "2px 8px",
                                borderRadius: 8
                              }}
                            >
                              UNLOCKED
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 14, color: "var(--text-sub)", fontWeight: 600, margin: "4px 0 10px 0" }}>
                          {ach.description}
                        </p>

                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ flex: 1, height: 8, background: "var(--card-border)", borderRadius: 4, overflow: "hidden" }}>
                            <div
                              style={{
                                height: "100%",
                                width: `${percent}%`,
                                background: ach.is_unlocked ? "var(--green)" : "var(--yellow)",
                                borderRadius: 4
                              }}
                            />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-sub)" }}>
                            {ach.current_value} / {ach.target_value}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {user && (
            <RightSidebar
              todayXp={user.today_xp}
              dailyGoalXp={user.daily_goal_xp}
              league={user.league}
              onSimulateDay={async () => {
                await api.simulateDay();
                await loadData();
              }}
              onResetProgress={async () => {
                await api.resetProgress();
                await loadData();
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
