"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { api, User } from "@/utils/api";
import { playClickSound } from "@/utils/sound";
import { ChevronDown, Moon, Sun, Monitor } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [themeMode, setThemeMode] = useState<"system" | "dark" | "light">("system");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await api.getCurrentUser();
        setUser(u);
      } catch (e) {
        console.error("Failed to load user:", e);
      }
    };
    fetchUser();

    // Check saved theme
    const saved = localStorage.getItem("duo_theme") as "system" | "dark" | "light" | null;
    if (saved) {
      setThemeMode(saved);
      applyTheme(saved);
    } else {
      applyTheme("system");
    }

    // Media query listener for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      const currentSaved = localStorage.getItem("duo_theme");
      if (!currentSaved || currentSaved === "system") {
        document.documentElement.setAttribute("data-theme", e.matches ? "light" : "dark");
      }
    };
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const applyTheme = (mode: "system" | "dark" | "light") => {
    localStorage.setItem("duo_theme", mode);
    setThemeMode(mode);
    if (mode === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else if (mode === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      const isSystemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      document.documentElement.setAttribute("data-theme", isSystemLight ? "light" : "dark");
    }
  };

  const getDisplayLabel = (mode: "system" | "dark" | "light") => {
    switch (mode) {
      case "system":
        return "SYSTEM DEFAULT";
      case "dark":
        return "DARK";
      case "light":
        return "LIGHT";
    }
  };

  const getIcon = (mode: "system" | "dark" | "light") => {
    switch (mode) {
      case "system":
        return <Monitor size={18} />;
      case "dark":
        return <Moon size={18} />;
      case "light":
        return <Sun size={18} />;
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
          <div className="path-center-column" style={{ maxWidth: 640, width: "100%", alignItems: "flex-start", paddingTop: 32 }}>
            {/* Appearance Section Heading */}
            <div style={{ width: "100%", borderBottom: "2px solid var(--card-border)", paddingBottom: 16, marginBottom: 24 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text-main)", letterSpacing: -0.3 }}>
                Appearance
              </h1>
            </div>

            {/* Dark mode subsection */}
            <div style={{ width: "100%" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 18,
                  fontWeight: 900,
                  color: "var(--text-main)",
                  marginBottom: 12,
                }}
              >
                Dark mode
              </label>

              {/* Custom Duolingo-styled Select Box */}
              <div style={{ position: "relative", width: "100%" }}>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    background: "var(--card-bg)",
                    border: "2px solid var(--card-border)",
                    borderRadius: 16,
                    color: "var(--text-main)",
                    fontSize: 15,
                    fontWeight: 900,
                    letterSpacing: 0.8,
                    cursor: "pointer",
                    outline: "none",
                    transition: "border-color 0.2s, background-color 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {getIcon(themeMode)}
                    <span style={{ textTransform: "uppercase" }}>{getDisplayLabel(themeMode)}</span>
                  </div>
                  <ChevronDown
                    size={22}
                    color="var(--text-muted)"
                    strokeWidth={3}
                    style={{
                      transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      right: 0,
                      background: "var(--card-bg)",
                      border: "2px solid var(--card-border)",
                      borderRadius: 16,
                      boxShadow: "0 8px 24px var(--speech-bubble-shadow)",
                      overflow: "hidden",
                      zIndex: 50,
                    }}
                  >
                    {(["system", "dark", "light"] as const).map((mode) => (
                      <div
                        key={mode}
                        onClick={() => {
                          playClickSound();
                          applyTheme(mode);
                          setDropdownOpen(false);
                        }}
                        style={{
                          padding: "14px 20px",
                          fontSize: 15,
                          fontWeight: 800,
                          color: themeMode === mode ? "var(--blue)" : "var(--text-main)",
                          background: themeMode === mode ? "var(--sidebar-link-active-bg)" : "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (themeMode !== mode) e.currentTarget.style.background = "var(--card-hover)";
                        }}
                        onMouseLeave={(e) => {
                          if (themeMode !== mode) e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {getIcon(mode)}
                          <span>{getDisplayLabel(mode)}</span>
                        </div>
                        {themeMode === mode && (
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "var(--blue)",
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
