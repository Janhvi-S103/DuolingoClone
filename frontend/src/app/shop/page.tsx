"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { RightSidebar } from "@/components/RightSidebar";
import { api, ShopItem, User } from "@/utils/api";
import { playClickSound, playCorrectSound } from "@/utils/sound";
import { Diamond, CheckCircle, Zap } from "lucide-react";

export default function ShopPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [gems, setGems] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseMsg, setPurchaseMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [shopData, userData] = await Promise.all([
        api.getShop(),
        api.getCurrentUser()
      ]);
      setItems(shopData.items);
      setGems(shopData.gems);
      setUser(userData);
    } catch (e) {
      console.error("Failed to load shop:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBuy = async (item: ShopItem) => {
    playClickSound();
    try {
      const res = await api.buyShopItem(item.id);
      playCorrectSound();
      setPurchaseMsg(res.message);
      setTimeout(() => setPurchaseMsg(null), 3500);
      await loadData();
    } catch (e: any) {
      alert(e.message || "Purchase failed");
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
            {/* Header banner */}
            <div style={{ width: "100%", marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 style={{ fontSize: 28, fontWeight: 900 }}>Shop & Power-ups</h1>
                  <p style={{ color: "var(--text-sub)", fontWeight: 600, fontSize: 16, marginTop: 4 }}>
                    Spend your hard-earned gems on streak protection and heart refills.
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "var(--blue-light)",
                    color: "var(--blue)",
                    padding: "8px 16px",
                    borderRadius: 14,
                    fontWeight: 900,
                    fontSize: 18
                  }}
                >
                  <Diamond size={22} fill="currentColor" />
                  <span>{gems}</span>
                </div>
              </div>

              {purchaseMsg && (
                <div
                  style={{
                    marginTop: 16,
                    padding: "12px 18px",
                    backgroundColor: "var(--green-light)",
                    color: "var(--green-text)",
                    borderRadius: 14,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: 10
                  }}
                >
                  <CheckCircle size={20} />
                  <span>{purchaseMsg}</span>
                </div>
              )}
            </div>

            {/* Shop items list */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="sidebar-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    padding: "20px 24px"
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 16,
                      backgroundColor: "var(--bg-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 32,
                      border: "2px solid var(--card-border)",
                      flexShrink: 0
                    }}
                  >
                    {item.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 900 }}>{item.name}</h3>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          background: item.badge === "Equipped" ? "var(--green-light)" : "var(--blue-light)",
                          color: item.badge === "Equipped" ? "var(--green-text)" : "var(--blue)",
                          padding: "2px 8px",
                          borderRadius: 8
                        }}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--text-sub)", fontWeight: 600, marginTop: 4 }}>
                      {item.description}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!item.can_buy}
                      className="btn-3d btn-blue"
                      style={{ padding: "10px 18px", fontSize: 14, gap: 6 }}
                    >
                      <Diamond size={16} fill="white" />
                      <span>{item.cost}</span>
                    </button>
                  </div>
                </div>
              ))}
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
