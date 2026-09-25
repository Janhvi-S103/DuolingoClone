"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RotateCcw, Calendar } from "lucide-react";
import { playClickSound } from "@/utils/sound";
import { api } from "@/utils/api";

interface RightSidebarProps {
  todayXp: number;
  dailyGoalXp: number;
  league: string;
  onSimulateDay: () => void;
  onResetProgress: () => void;
  loadingAction?: boolean;
}

export function RightSidebar({
  todayXp = 10,
  dailyGoalXp = 10,
  league = "Silver",
  onSimulateDay,
  onResetProgress,
  loadingAction = false,
}: RightSidebarProps) {
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchRank = async () => {
      try {
        const lb = await api.getLeaderboard();
        const me = lb.find((u) => u.is_current_user);
        if (me) {
          setCurrentUserRank(me.rank);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard rank in sidebar:", err);
      }
    };
    fetchRank();
  }, [todayXp]);

  const questPercent = Math.min(100, Math.round((todayXp / (dailyGoalXp || 10)) * 100));

  return (
    <aside className="right-sidebar">
      {/* 1. Super Duolingo Card */}
      <div className="sidebar-panel-card" style={{ position: "relative", overflow: "visible", padding: "20px 20px 24px 20px" }}>
        {/* Exact CDN Super Mascot SVG from Duolingo */}
        <div style={{ position: "absolute", top: 18, right: 18, zIndex: 1, pointerEvents: "none" }}>
          <img
            src="https://d35aaqx5ub95lt.cloudfront.net/images/super/fb7130289a205fadd2e196b9cc866555.svg"
            alt="Super Mascot"
            style={{ width: 84, height: 84, objectFit: "contain", display: "block" }}
          />
        </div>

        {/* Super Metallic Badge from assets */}
        <div style={{ marginBottom: 14 }}>
          <img
            src="https://d35aaqx5ub95lt.cloudfront.net/images/super/2e50c3e8358914df5285dc8cf45d0b4c.svg"
            alt="SUPER"
            style={{ height: 28, width: "auto", objectFit: "contain", display: "block" }}
          />
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8, color: "var(--text-main)", zIndex: 2, position: "relative" }}>
          Try Super for free
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-sub)",
            fontWeight: 600,
            lineHeight: 1.45,
            marginBottom: 20,
            maxWidth: "68%",
            zIndex: 2,
            position: "relative"
          }}
        >
          No ads, personalized practice, and unlimited Legendary!
        </p>

        <Link
          href="/shop"
          onClick={playClickSound}
          className="btn-3d btn-blue"
          style={{
            width: "100%",
            padding: "13px 16px",
            fontSize: 14,
            borderRadius: 16,
            zIndex: 2,
            position: "relative",
            letterSpacing: 0.8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none"
          }}
        >
          TRY 1 WEEK FREE
        </Link>
      </div>

      {/* 2. Leaderboard Rank Card */}
      <div className="sidebar-panel-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: "var(--text-main)", margin: 0 }}>
            {currentUserRank ? `${league} League` : "Unlock Leaderboards!"}
          </h3>
          <Link
            href="/leaderboard"
            onClick={playClickSound}
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "var(--blue)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              textDecoration: "none",
            }}
          >
            VIEW LEAGUE
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src="https://d35aaqx5ub95lt.cloudfront.net/images/leagues/192181672ada150becd83a74a4266ae9.svg"
            alt="Silver League"
            style={{ width: 48, height: 56, objectFit: "contain", flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "var(--text-main)", marginBottom: 2 }}>
              {currentUserRank ? `Rank #${currentUserRank}` : "Complete 2 more lessons"}
            </div>
            <p style={{ fontSize: 13, color: "var(--text-sub)", fontWeight: 600, lineHeight: 1.4, margin: 0 }}>
              {currentUserRank
                ? currentUserRank <= 3
                  ? "In the promotion zone! Top 3 advance."
                  : "Keep practicing to climb the ranks!"
                : "Complete 2 more lessons to start competing"}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Daily Quests Card */}
      <div className="sidebar-panel-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 16 }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: "var(--text-main)" }}>Daily Quests</span>
          <Link
            href="/quests"
            onClick={playClickSound}
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "var(--blue)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              textDecoration: "none",
            }}
          >
            VIEW ALL
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Official Blaze lightning SVG from Duolingo */}
          <img
            src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/2b5a211d830a24fab92e291d50f65d1d.svg"
            alt="Blaze Quest"
            style={{ width: 38, height: 44, objectFit: "contain", flexShrink: 0 }}
          />

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main)", marginBottom: 8 }}>
              Earn {dailyGoalXp || 10} XP
            </div>

            {/* Yellow progress bar with official Chest icon at the end */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  flex: 1,
                  height: 18,
                  background: "var(--bg-subtle)",
                  borderRadius: 9,
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid var(--card-border)",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${questPercent}%`,
                    background: "var(--yellow)",
                    borderRadius: 9,
                    transition: "width 0.4s ease",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 900,
                    color: questPercent >= 50 ? "#6d4400" : "var(--text-sub)",
                    letterSpacing: 0.5,
                  }}
                >
                  {Math.min(todayXp, dailyGoalXp || 10)} / {dailyGoalXp || 10}
                </span>
              </div>

              {/* Official Goal Chest SVG from Duolingo */}
              <img
                src="https://d35aaqx5ub95lt.cloudfront.net/images/goals/33af8ba58d22f3ea21279e9a84756833.svg"
                alt="Quest Chest"
                style={{ width: 40, height: 40, objectFit: "contain", marginLeft: 10, flexShrink: 0 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Evaluator Demo Controls Card */}
      <div
        className="sidebar-panel-card"
        style={{
          borderStyle: "dashed",
          borderColor: "var(--card-border)",
          background: "var(--bg-subtle)",
          padding: 16,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--blue)", marginBottom: 10 }}>
          ⚙️ Evaluator Demo Controls
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              playClickSound();
              onSimulateDay();
            }}
            disabled={loadingAction}
            className="btn-3d btn-card"
            style={{ flex: 1, padding: "8px", fontSize: 12, gap: 4 }}
          >
            <Calendar size={13} />
            <span>Next Day</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              onResetProgress();
            }}
            disabled={loadingAction}
            className="btn-3d btn-card"
            style={{ flex: 1, padding: "8px", fontSize: 12, gap: 4 }}
          >
            <RotateCcw size={13} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* 5. Duolingo Footer Links */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 12px", padding: "10px 4px", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
        <span style={{ cursor: "pointer" }}>About</span>
        <span style={{ cursor: "pointer" }}>Blog</span>
        <span style={{ cursor: "pointer" }}>Store</span>
        <span style={{ cursor: "pointer" }}>Efficacy</span>
        <span style={{ cursor: "pointer" }}>Careers</span>
        <span style={{ cursor: "pointer" }}>Investors</span>
        <span style={{ cursor: "pointer" }}>Terms</span>
        <span style={{ cursor: "pointer" }}>Privacy</span>
      </div>
    </aside>
  );
}
