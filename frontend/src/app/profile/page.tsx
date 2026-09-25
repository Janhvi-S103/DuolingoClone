"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { RightSidebar } from "@/components/RightSidebar";
import { api, User, Achievement } from "@/utils/api";
import { playClickSound, playCorrectSound } from "@/utils/sound";
import { MascotDuo } from "@/components/MascotDuo";
import { Flame, Zap, Shield, Trophy, RotateCcw, Calendar, Heart, Award, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [evalMsg, setEvalMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [userData, achData] = await Promise.all([
        api.getCurrentUser(),
        api.getAchievements()
      ]);
      setUser(userData);
      setAchievements(achData);
    } catch (e) {
      console.error("Failed to load profile:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulateDay = async () => {
    playClickSound();
    try {
      const res = await api.simulateDay();
      setEvalMsg(res.message);
      await loadData();
    } catch (e: any) {
      setEvalMsg(e.message || "Failed to advance day");
    }
  };

  const handleRefillHearts = async () => {
    playClickSound();
    try {
      const res = await api.refillHearts();
      playCorrectSound();
      setEvalMsg(res.message);
      await loadData();
    } catch (e: any) {
      setEvalMsg(e.message || "Failed to refill hearts");
    }
  };

  const handleResetProgress = async () => {
    playClickSound();
    try {
      const res = await api.resetProgress();
      setEvalMsg(res.message);
      await loadData();
    } catch (e: any) {
      setEvalMsg(e.message || "Failed to reset progress");
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
          <div className="path-center-column" style={{ maxWidth: 660 }}>
            {/* User Profile Header Card */}
            <div
              className="sidebar-card"
              style={{
                width: "100%",
                padding: "32px 28px",
                display: "flex",
                alignItems: "center",
                gap: 28,
                marginBottom: 32
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  backgroundColor: "var(--green-light)",
                  border: "4px solid var(--green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 54
                }}
              >
                {user?.avatar || "🦉"}
              </div>

              <div>
                <h1 style={{ fontSize: 28, fontWeight: 900 }}>{user?.name || "Alex Rodriguez"}</h1>
                <p style={{ color: "var(--text-sub)", fontWeight: 700, fontSize: 16 }}>
                  @{user?.username || "duo_learner"} • Joined March 2026
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <span
                    style={{
                      background: "var(--blue-light)",
                      color: "var(--blue)",
                      fontWeight: 800,
                      fontSize: 13,
                      padding: "4px 10px",
                      borderRadius: 10
                    }}
                  >
                    🇪🇸 Spanish Course
                  </span>
                  <span
                    style={{
                      background: "var(--yellow-light)",
                      color: "var(--yellow-dark)",
                      fontWeight: 800,
                      fontSize: 13,
                      padding: "4px 10px",
                      borderRadius: 10
                    }}
                  >
                    {user?.league} League
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div style={{ width: "100%", marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>Statistics</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* Streak */}
                <div className="sidebar-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: 18 }}>
                  <Flame size={32} color="var(--orange)" fill="var(--orange)" />
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 900 }}>{user?.streak || 0}</div>
                    <div style={{ fontSize: 13, color: "var(--text-sub)", fontWeight: 700 }}>Day streak</div>
                  </div>
                </div>

                {/* Total XP */}
                <div className="sidebar-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: 18 }}>
                  <Zap size={32} color="var(--yellow-dark)" fill="var(--yellow)" />
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 900 }}>{user?.total_xp || 0}</div>
                    <div style={{ fontSize: 13, color: "var(--text-sub)", fontWeight: 700 }}>Total XP</div>
                  </div>
                </div>

                {/* Current League */}
                <div className="sidebar-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: 18 }}>
                  <Shield size={32} color="var(--blue)" fill="var(--blue-light)" />
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 900 }}>{user?.league || "Silver"}</div>
                    <div style={{ fontSize: 13, color: "var(--text-sub)", fontWeight: 700 }}>Current league</div>
                  </div>
                </div>

                {/* Top 3 Finishes */}
                <div className="sidebar-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: 18 }}>
                  <Trophy size={32} color="var(--yellow-dark)" fill="var(--yellow)" />
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 900 }}>2</div>
                    <div style={{ fontSize: 13, color: "var(--text-sub)", fontWeight: 700 }}>Top 3 finishes</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Shelf */}
            <div style={{ width: "100%", marginBottom: 36 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>Achievements</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 14 }}>
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="sidebar-card"
                    style={{
                      textAlign: "center",
                      padding: "16px 12px",
                      opacity: ach.is_unlocked ? 1 : 0.45,
                      backgroundColor: ach.is_unlocked ? "var(--card-bg)" : "var(--bg-subtle)"
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 6 }}>
                      {ach.icon === "flame" ? "🔥" : ach.icon === "zap" ? "⚡" : ach.icon === "book" ? "📖" : ach.icon === "target" ? "🎯" : "🏆"}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{ach.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-sub)", fontWeight: 600, marginTop: 4 }}>
                      {ach.is_unlocked ? "Level 1" : "Locked"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SDE Evaluator Panel */}
            <div
              className="sidebar-card"
              style={{
                width: "100%",
                border: "2px dashed var(--blue)",
                backgroundColor: "var(--bg-subtle)",
                padding: 24
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>🧪</span>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "var(--blue)" }}>
                  SDE Evaluator & Demo Controls
                </h3>
              </div>
              <p style={{ fontSize: 14, color: "var(--text-sub)", fontWeight: 600, marginBottom: 20 }}>
                These interactive shortcuts let you test gamification algorithms and state transitions on demand:
              </p>

              {evalMsg && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "var(--green-light)",
                    color: "var(--green-text)",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 14,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}
                >
                  <CheckCircle size={18} />
                  <span>{evalMsg}</span>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <button
                  onClick={handleSimulateDay}
                  className="btn-3d btn-blue"
                  style={{ padding: "12px", fontSize: 13, gap: 6 }}
                >
                  <Calendar size={16} />
                  <span>Simulate Next Day</span>
                </button>

                <button
                  onClick={handleRefillHearts}
                  className="btn-3d btn-green"
                  style={{ padding: "12px", fontSize: 13, gap: 6 }}
                >
                  <Heart size={16} fill="white" />
                  <span>Refill Hearts</span>
                </button>

                <button
                  onClick={handleResetProgress}
                  className="btn-3d btn-white"
                  style={{ padding: "12px", fontSize: 13, gap: 6 }}
                >
                  <RotateCcw size={16} />
                  <span>Reset Demo</span>
                </button>
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
