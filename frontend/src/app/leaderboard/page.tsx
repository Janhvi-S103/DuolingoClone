"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { RightSidebar } from "@/components/RightSidebar";
import { api, LeaderboardUser, User } from "@/utils/api";
import { playClickSound } from "@/utils/sound";
import { Trophy, ChevronUp, ChevronDown, Minus, Clock, Shield } from "lucide-react";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [lbData, userData] = await Promise.all([
        api.getLeaderboard(),
        api.getCurrentUser()
      ]);
      setUsers(lbData);
      setUser(userData);
    } catch (e) {
      console.error("Failed to load leaderboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
            {/* Header League Banner */}
            <div
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #1cb0f6 0%, #0077c5 100%)",
                borderRadius: 20,
                padding: "24px 28px",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginBottom: 28,
                boxShadow: "0 6px 16px rgba(0,0,0,0.12)"
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34
                }}
              >
                🥈
              </div>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
                  {user?.league || "Silver"} League
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, opacity: 0.9 }}>
                  <Clock size={16} />
                  <span>3 days left • Top 3 advance to Gold League</span>
                </div>
              </div>
            </div>

            {/* Leaderboard Table List */}
            <div
              style={{
                width: "100%",
                border: "2px solid var(--card-border)",
                borderRadius: 20,
                overflow: "hidden",
                backgroundColor: "var(--card-bg)"
              }}
            >
              {users.map((item, idx) => {
                const isTop3 = item.rank <= 3;
                const isDemotion = item.rank >= 9;

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px 20px",
                      borderBottom: idx < users.length - 1 ? "1.5px solid var(--card-border)" : "none",
                      backgroundColor: item.is_current_user
                        ? "var(--blue-light)"
                        : "transparent",
                      transition: "background 0.15s ease"
                    }}
                  >
                    {/* Rank Number & Icon */}
                    <div
                      style={{
                        width: 44,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontWeight: 900,
                        fontSize: 18,
                        color: isTop3
                          ? "var(--green-text)"
                          : isDemotion
                          ? "var(--red)"
                          : "var(--text-sub)"
                      }}
                    >
                      <span>{item.rank}</span>
                      {isTop3 ? (
                        <ChevronUp size={16} strokeWidth={3} color="var(--green)" />
                      ) : isDemotion ? (
                        <ChevronDown size={16} strokeWidth={3} color="var(--red)" />
                      ) : (
                        <Minus size={14} color="var(--text-muted)" />
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        backgroundColor: "var(--bg-subtle)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        marginRight: 16,
                        border: "2px solid var(--card-border)"
                      }}
                    >
                      {item.avatar}
                    </div>

                    {/* Name */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 16,
                          color: item.is_current_user ? "var(--blue)" : "var(--text-main)"
                        }}
                      >
                        {item.name}
                      </div>
                      {item.is_current_user && (
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)" }}>
                          You are currently in the promotion zone!
                        </div>
                      )}
                    </div>

                    {/* XP Score */}
                    <div style={{ fontWeight: 800, fontSize: 16, color: "var(--text-sub)" }}>
                      {item.xp} XP
                    </div>
                  </div>
                );
              })}
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
