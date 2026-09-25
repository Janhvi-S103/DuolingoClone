"use client";

import React, { useState } from "react";
import { X, BookOpen, Volume2, Search, Sparkles } from "lucide-react";
import { playClickSound, speakSpanish } from "@/utils/sound";
import { VOCABULARY_LIST, VocabWord } from "@/utils/vocabulary";

interface GuidebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitTitle: string;
  guidebookContent?: string;
  themeColor?: string;
}

export function GuidebookModal({
  isOpen,
  onClose,
  unitTitle,
  guidebookContent,
  themeColor = "#58cc02"
}: GuidebookModalProps) {
  const [activeTab, setActiveTab] = useState<"grammar" | "vocab">("vocab");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (!isOpen) return null;

  const categories = ["All", "Basics", "Greetings", "Food & Drink", "Café & Dining", "Travel & Places", "Animals & Nature", "Family & Life"];

  const filteredWords = VOCABULARY_LIST.filter((word: VocabWord) => {
    const matchesCategory = selectedCategory === "All" || word.category === selectedCategory;
    const matchesSearch =
      word.spanish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.english.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 640, width: "100%", textAlign: "left", maxHeight: "88vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: themeColor,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <BookOpen size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 900 }}>{unitTitle} Guidebook</h3>
              <p style={{ fontSize: 13, color: "var(--text-sub)", fontWeight: 600 }}>
                {VOCABULARY_LIST.length} Words of the Language & Grammar tips
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="lesson-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: "flex", gap: 8, borderBottom: "2px solid #2b383f", paddingBottom: 10, marginBottom: 16 }}>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab("vocab");
            }}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 10,
              background: activeTab === "vocab" ? "rgba(88, 204, 2, 0.15)" : "transparent",
              color: activeTab === "vocab" ? "#58cc02" : "var(--text-sub)",
              border: activeTab === "vocab" ? "2px solid #58cc02" : "2px solid transparent",
              fontWeight: 800,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s"
            }}
          >
            <Sparkles size={16} />
            <span>Words of the Language ({VOCABULARY_LIST.length})</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab("grammar");
            }}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 10,
              background: activeTab === "grammar" ? "rgba(28, 176, 246, 0.15)" : "transparent",
              color: activeTab === "grammar" ? "#1cb0f6" : "var(--text-sub)",
              border: activeTab === "grammar" ? "2px solid #1cb0f6" : "2px solid transparent",
              fontWeight: 800,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s"
            }}
          >
            <BookOpen size={16} />
            <span>Key Phrases & Grammar</span>
          </button>
        </div>

        {/* Tab 1: Words of the Language */}
        {activeTab === "vocab" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Search Input */}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <Search size={18} style={{ position: "absolute", left: 14, top: 12, color: "var(--text-sub)" }} />
              <input
                type="text"
                placeholder="Search words in Spanish or English..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 40px",
                  background: "#18272e",
                  border: "2px solid #2b383f",
                  borderRadius: 12,
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 600,
                  outline: "none"
                }}
              />
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, marginBottom: 12 }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    playClickSound();
                    setSelectedCategory(cat);
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    whiteSpace: "nowrap",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "1.5px solid",
                    borderColor: selectedCategory === cat ? "#58cc02" : "#2b383f",
                    background: selectedCategory === cat ? "#58cc02" : "#18272e",
                    color: selectedCategory === cat ? "#131f24" : "var(--text-sub)",
                    transition: "all 0.15s"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Words List Grid */}
            <div style={{ flex: 1, overflowY: "auto", paddingRight: 4, display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredWords.map((word) => (
                <div
                  key={word.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#18272e",
                    border: "1.5px solid #2b383f",
                    borderRadius: 12,
                    transition: "border-color 0.15s"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 17, fontWeight: 800, color: "#ffffff" }}>
                        {word.spanish}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 6,
                          background: "rgba(255, 255, 255, 0.08)",
                          color: "var(--text-sub)"
                        }}
                      >
                        {word.type}
                      </span>
                    </div>

                    <div style={{ fontSize: 14, color: "#58cc02", fontWeight: 700, marginTop: 2 }}>
                      {word.english}
                    </div>

                    {word.example && (
                      <div style={{ fontSize: 12, color: "var(--text-sub)", marginTop: 4, fontStyle: "italic" }}>
                        &ldquo;{word.example}&rdquo; &bull; {word.exampleEn}
                      </div>
                    )}
                  </div>

                  {/* Audio Button */}
                  <button
                    onClick={() => {
                      playClickSound();
                      speakSpanish(word.spanish);
                    }}
                    title="Pronounce word"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "#202f36",
                      border: "2px solid #37464f",
                      color: "#1cb0f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      marginLeft: 12,
                      flexShrink: 0
                    }}
                  >
                    <Volume2 size={20} />
                  </button>
                </div>
              ))}

              {filteredWords.length === 0 && (
                <div style={{ textAlign: "center", padding: "30px 0", color: "var(--text-sub)", fontWeight: 600 }}>
                  No words found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Key Phrases & Grammar */}
        {activeTab === "grammar" && (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              lineHeight: 1.6,
              fontSize: 15,
              paddingRight: 8,
              whiteSpace: "pre-line"
            }}
          >
            {guidebookContent || "No grammar notes available for this unit yet."}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="btn-3d btn-green"
            style={{ width: "100%", padding: "12px" }}
          >
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
}
