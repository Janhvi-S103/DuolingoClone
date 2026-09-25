"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { playClickSound } from "@/utils/sound";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "LEARN",
      href: "/",
      icon: (
        <span style={{ width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src="https://d35aaqx5ub95lt.cloudfront.net/vendor/784035717e2ff1d448c0f6cc4efc89fb.svg"
            alt="Learn"
            width={32}
            height={32}
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
        </span>
      ),
    },
    {
      label: "LEADERBOARDS",
      href: "/leaderboard",
      icon: (
        <span style={{ width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src="https://d35aaqx5ub95lt.cloudfront.net/vendor/ca9178510134b4b0893dbac30b6670aa.svg"
            alt="Leaderboards"
            width={32}
            height={32}
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
        </span>
      ),
    },
    {
      label: "QUESTS",
      href: "/quests",
      icon: (
        <span style={{ width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src="https://d35aaqx5ub95lt.cloudfront.net/vendor/7ef36bae3f9d68fc763d3451b5167836.svg"
            alt="Quests"
            width={32}
            height={32}
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
        </span>
      ),
    },
    {
      label: "SHOP",
      href: "/shop",
      icon: (
        <span style={{ width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <img
            src="https://d35aaqx5ub95lt.cloudfront.net/vendor/0e58a94dda219766d98c7796b910beee.svg"
            alt="Shop"
            width={32}
            height={32}
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
        </span>
      ),
    },
    {
      label: "PROFILE",
      href: "/profile",
      icon: (
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            border: "2px dashed var(--text-muted)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 800,
            color: "var(--text-muted)"
          }}
        >
          J
        </span>
      ),
    },
    {
      label: "SETTINGS",
      href: "/settings",
      icon: (
        <span style={{ fontSize: 24, display: "inline-flex", alignItems: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
      ),
    },
  ];

  return (
    <aside className="sidebar-left">
      {/* Exact Duolingo Wordmark Logo & Mobile/Tablet compact Logo */}
      <div className="sidebar-logo">
        <Link href="/" onClick={playClickSound} className="sidebar-logo-link">
          <span className="sidebar-logo-text">duolingo</span>
          <span className="sidebar-logo-icon">🦉</span>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={playClickSound}
              className={`nav-link ${isActive ? "active" : ""}`}
              title={item.label}
            >
              <div className="nav-link-icon">{item.icon}</div>
              <span className="nav-link-text">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
