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
        <span style={{ fontSize: 24, display: "inline-flex", alignItems: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {/* Red roof house */}
            <path d="M12 3L2 12H5V20H19V12H22L12 3Z" fill="#ff4b4b" />
            <path d="M9 20V13H15V20H9Z" fill="#ffc800" />
            <rect x="5" y="11" width="14" height="9" fill="#ff9600" />
            <rect x="9" y="14" width="6" height="6" fill="#131f24" />
          </svg>
        </span>
      ),
    },
    {
      label: "LEADERBOARDS",
      href: "/leaderboard",
      icon: (
        <span style={{ fontSize: 24, display: "inline-flex", alignItems: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L4 5V11C4 16.5 7.5 21.5 12 22C16.5 21.5 20 16.5 20 11V5L12 2Z"
              fill="#ffc800"
              stroke="#e5a500"
              strokeWidth="2"
            />
          </svg>
        </span>
      ),
    },
    {
      label: "QUESTS",
      href: "/quests",
      icon: (
        <span style={{ fontSize: 24, display: "inline-flex", alignItems: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="14" rx="3" fill="#ffc800" stroke="#e5a500" strokeWidth="2" />
            <path d="M3 11H21" stroke="#4b4b4b" strokeWidth="2" />
            <rect x="10" y="9" width="4" height="4" rx="1" fill="#ff4b4b" />
          </svg>
        </span>
      ),
    },
    {
      label: "SHOP",
      href: "/shop",
      icon: (
        <span style={{ fontSize: 24, display: "inline-flex", alignItems: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 4H20L22 10H2L4 4Z" fill="#ff4b4b" />
            <rect x="3" y="10" width="18" height="11" rx="2" fill="#1cb0f6" />
            <rect x="9" y="14" width="6" height="7" fill="#ffffff" />
          </svg>
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
            border: "2px dashed #8598a2",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 800,
            color: "#8598a2"
          }}
        >
          J
        </span>
      ),
    },
  ];

  return (
    <aside className="sidebar-left">
      {/* Exact Duolingo Wordmark Logo */}
      <div className="sidebar-logo">
        <Link href="/" onClick={playClickSound} className="sidebar-logo-text">
          duolingo
        </Link>
      </div>

      {/* Nav List */}
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={playClickSound}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
