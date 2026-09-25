"use client";

import React from "react";
import { Heart, Diamond, X, Dumbbell } from "lucide-react";
import { playClickSound } from "@/utils/sound";

interface HeartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hearts: number;
  gems: number;
  onRefill: () => void;
  onPractice: () => void;
}

export function HeartsModal({
  isOpen,
  onClose,
  hearts,
  gems,
  onRefill,
  onPractice
}: HeartsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => { playClickSound(); onClose(); }} className="lesson-close-btn">
            <X size={20} />
          </button>
        </div>

        <div style={{ margin: "-10px auto 16px auto" }}>
          <Heart size={64} fill="var(--red)" stroke="var(--red)" />
        </div>

        <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
          {hearts === 0 ? "You ran out of hearts!" : "Need more hearts?"}
        </h3>
        <p style={{ fontSize: 15, color: "var(--text-sub)", fontWeight: 600, marginBottom: 24, lineHeight: 1.4 }}>
          {hearts === 0
            ? "Keep learning by refilling your hearts with gems or by doing a quick review practice session."
            : `You currently have ${hearts}/5 hearts. Hearts are lost when you answer incorrectly.`}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            onClick={() => {
              playClickSound();
              onRefill();
            }}
            disabled={hearts >= 5 || gems < 50}
            className="btn-3d btn-blue"
            style={{ width: "100%", padding: "14px", gap: 8, fontSize: 15 }}
          >
            <Diamond size={18} fill="white" />
            <span>REFILL HEARTS (50 GEMS)</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onPractice();
            }}
            className="btn-3d btn-green"
            style={{ width: "100%", padding: "14px", gap: 8, fontSize: 15 }}
          >
            <Dumbbell size={18} />
            <span>PRACTICE TO EARN HEARTS</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="btn-3d btn-white"
            style={{ width: "100%", padding: "12px", fontSize: 14 }}
          >
            NO THANKS
          </button>
        </div>
      </div>
    </div>
  );
}
