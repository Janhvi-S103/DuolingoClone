"use client";

import React from "react";
import { playClickSound } from "@/utils/sound";

interface TopBarProps {
  streak: number;
  gems: number;
  hearts: number;
  maxHearts?: number;
  todayXp?: number;
  onOpenHeartsModal?: () => void;
}

export function TopBar({
  streak = 1,
  gems = 505,
  hearts = 4,
  todayXp = 0,
  onOpenHeartsModal
}: TopBarProps) {
  // If streak is not zero, grey out streak icon and text until a lesson is done today (todayXp > 0)
  const isStreakInactive = streak > 0 && (todayXp || 0) === 0;

  return (
    <header className="top-stats-bar">
      {/* Flag with level number */}
      <div className="stat-pill" title="Current course">
        <span style={{ fontSize: 20 }}>🇪🇸</span>
        <span style={{ fontWeight: 800, fontSize: 15, marginLeft: 2 }}>1</span>
      </div>

      {/* Streak */}
      <div
        className={`stat-pill streak ${isStreakInactive ? "streak-inactive" : ""}`}
        title={isStreakInactive ? `${streak} day streak (Complete a lesson today to keep it active!)` : `${streak} day streak (Active today!)`}
      >
        <span style={{ fontSize: 18 }}>🔥</span>
        <span style={{ fontWeight: 800, fontSize: 15, marginLeft: 2 }}>{streak}</span>
      </div>

      {/* Gems */}
      <div className="stat-pill gems" title={`${gems} Gems`}>
        <span style={{ fontSize: 18 }}>💎</span>
        <span style={{ fontWeight: 800, fontSize: 15, marginLeft: 2 }}>{gems}</span>
      </div>

      {/* Hearts */}
      <div
        className="stat-pill hearts"
        onClick={() => {
          playClickSound();
          if (onOpenHeartsModal) onOpenHeartsModal();
        }}
        title="Hearts"
      >
        <span style={{ fontSize: 18 }}>❤️</span>
        <span style={{ fontWeight: 800, fontSize: 15, marginLeft: 2 }}>{hearts > 50 ? "∞" : hearts}</span>
      </div>
    </header>
  );
}
