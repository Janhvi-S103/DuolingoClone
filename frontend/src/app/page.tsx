"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { RightSidebar } from "@/components/RightSidebar";
import { GuidebookModal } from "@/components/GuidebookModal";
import { HeartsModal } from "@/components/HeartsModal";
import { MascotDuo } from "@/components/MascotDuo";
import { api, CoursePathData, SkillItem } from "@/utils/api";
import { playClickSound } from "@/utils/sound";
import { Star, Trophy, ArrowLeft, Check } from "lucide-react";

export default function HomePage() {
  const [data, setData] = useState<CoursePathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [showGuidebook, setShowGuidebook] = useState<string | false>(false);
  const [showHeartsModal, setShowHeartsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.getCoursePath();
      setData(res);
    } catch (err) {
      console.error("Failed to load course path:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulateDay = async () => {
    try {
      setActionLoading(true);
      await api.simulateDay();
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetProgress = async () => {
    try {
      setActionLoading(true);
      await api.resetProgress();
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefillHearts = async () => {
    try {
      await api.refillHearts();
      setShowHeartsModal(false);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const [visibleUnitIndex, setVisibleUnitIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!data || !data.units) return;
      const unitBlocks = document.querySelectorAll(".unit-section-block");
      let currentIdx = 0;
      unitBlocks.forEach((block, idx) => {
        const rect = block.getBoundingClientRect();
        if (rect.top <= 240) {
          currentIdx = idx;
        }
      });
      setVisibleUnitIndex(currentIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data]);

  // Node curve offsets matching the snake path from user screenshot
  const nodeCurveOffsets = [0, -30, -55, -35, 10, 20];

  if (loading || !data) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "var(--bg-main)" }}>
        <MascotDuo mood="happy" size={110} />
      </div>
    );
  }

  // Global calculation of active skill across all units
  let foundActive = false;
  let activeSkillGlobalId: number | null = null;
  for (const unit of data?.units || []) {
    for (const skill of unit.skills) {
      const isCompleted = skill.is_completed || (skill.total_lessons > 0 && skill.completed_lessons >= skill.total_lessons);
      if (skill.is_unlocked && !isCompleted && !foundActive) {
        activeSkillGlobalId = skill.id;
        foundActive = true;
        break;
      }
    }
  }

  const currentUnit = data.units[visibleUnitIndex] || data.units[0];
  const currentUnitNumber = visibleUnitIndex + 1;
  const currentBannerBg = currentUnit?.theme_color || (currentUnitNumber === 1 ? "#58cc02" : currentUnitNumber === 2 ? "#ce82ff" : "#00cd9c");
  const currentBannerShadow = currentBannerBg === "#58cc02" ? "#46a302" : currentBannerBg === "#ce82ff" ? "#a559d9" : "#009e78";

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Path Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopBar
          streak={data.user.streak}
          gems={data.user.gems}
          hearts={data.user.hearts}
          maxHearts={data.user.max_hearts}
          todayXp={data.user.today_xp}
          onOpenHeartsModal={() => setShowHeartsModal(true)}
        />

        <main className="main-content">
          <div className="path-center-column">
            {/* Single Sticky Unit Header Banner */}
            <div className="unit-banner-sticky-container">
              <div
                className="unit-banner-exact"
                style={{
                  backgroundColor: currentBannerBg,
                  boxShadow: `0 4px 0 ${currentBannerShadow}`
                }}
              >
                <div className="unit-banner-left">
                  <div className="unit-section-tag">
                    <ArrowLeft size={16} strokeWidth={3} />
                    <span>SECTION 1, UNIT {currentUnitNumber}</span>
                  </div>
                  <h2 className="unit-banner-title">
                    {currentUnit?.title}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    setShowGuidebook(currentUnit?.title || "Order at a café");
                  }}
                  className="unit-guidebook-btn-exact"
                >
                  {/* Notebook / guidebook icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="3" width="15" height="18" rx="2" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
                    <path d="M5 7H3M5 12H3M5 17H3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <path d="M9 8H16M9 12H16M9 16H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>GUIDEBOOK</span>
                </button>
              </div>
            </div>

            {/* Learning Path Units */}
            {data.units.map((unit, unitIdx) => {
              const unitSkills = unit.skills || [];
              const unitNumber = unitIdx + 1;

              return (
                <div key={unit.id} className="unit-section-block" style={{ width: "100%", marginBottom: 20 }}>
                  {/* Snake Curve Path Container */}
                  <div className="path-flow-container">
                    {/* Unit 1 Mascot */}
                    {unitNumber === 1 && (
                      <div className="path-mascot-wrapper" style={{ top: 90, left: 340 }}>
                        <img
                          src="https://d35aaqx5ub95lt.cloudfront.net/images/pathCharacters/active/a506d9752e476f9e29b898c8350e21c6.svg"
                          alt="Unit 1 Mascot"
                          style={{ width: 243, height: 243, objectFit: "contain", display: "block" }}
                        />
                      </div>
                    )}

                    {/* Unit 2 Mascot: Official Lily SVG */}
                    {unitNumber === 2 && (
                      <div className="path-mascot-wrapper" style={{ top: 65, left: 30 }}>
                        <img
                          src="https://d35aaqx5ub95lt.cloudfront.net/images/pathCharacters/dark/a3e1fd17f6d11b10ecae6bf5bc1ca701.svg"
                          alt="Lily Mascot Dark"
                          className="img-theme-dark"
                          style={{ width: 187, height: 187, objectFit: "contain", display: "block" }}
                        />
                        <img
                          src="https://d35aaqx5ub95lt.cloudfront.net/images/pathCharacters/locked/34443969dabd59f00795cc94457c1b3b.svg"
                          alt="Lily Mascot Light"
                          className="img-theme-light"
                          style={{ width: 187, height: 187, objectFit: "contain", display: "block" }}
                        />
                      </div>
                    )}

                    {/* Unit 3 Mascot: Official Bear / Falstaff SVG */}
                    {unitNumber === 3 && (
                      <div className="path-mascot-wrapper" style={{ top: -50, left: 330 }}>
                        <img
                          src="https://d35aaqx5ub95lt.cloudfront.net/images/pathCharacters/dark/350eb5e80d4ddc292088d0acc5ef3e2d.svg"
                          alt="Falstaff Mascot Dark"
                          className="img-theme-dark"
                          style={{ width: 187, height: 187, objectFit: "contain", display: "block" }}
                        />
                        <img
                          src="https://d35aaqx5ub95lt.cloudfront.net/images/pathCharacters/locked/f1a8ca7d22677f84c9781b7e9034f688.svg"
                          alt="Falstaff Mascot Light"
                          className="img-theme-light"
                          style={{ width: 187, height: 187, objectFit: "contain", display: "block" }}
                        />
                      </div>
                    )}

                    {/* Render Nodes for this Unit */}
                    {unitSkills.map((skill, index) => {
                      const isCompleted = skill.is_completed || (skill.total_lessons > 0 && skill.completed_lessons >= skill.total_lessons);
                      const isCurrentActive = skill.id === activeSkillGlobalId;
                      const isUnlocked = isCompleted || skill.is_unlocked || isCurrentActive;
                      const isChest = skill.icon === "chest";
                      const isFastForward = skill.icon === "fast_forward";
                      const isHeadset = skill.icon === "headset";
                      const isTrophy = skill.icon === "trophy" || index === unitSkills.length - 1;
                      const xOffset = skill.position_x !== undefined ? skill.position_x : (nodeCurveOffsets[index % nodeCurveOffsets.length] || 0);
                      const isSelected = selectedSkill?.id === skill.id;

                      // Dynamic progress calculation on this tile
                      const progressFraction = skill.total_lessons > 0
                        ? Math.min(1, Math.max(0, skill.completed_lessons / skill.total_lessons))
                        : 0;
                      const strokeOffset = 295.3 * (1 - progressFraction);

                      return (
                        <div
                          key={skill.id}
                          className="node-outer-container"
                          style={{
                            ["--node-x-offset" as any]: `${xOffset}px`,
                            zIndex: isSelected ? 150 : 20 - index
                          }}
                        >
                          {/* START Speech Bubble Tooltip for current active tile */}
                          {isCurrentActive && !isSelected && (
                            <div className="start-speech-bubble">
                              <span>START</span>
                              <div className="start-speech-bubble-pointer" />
                            </div>
                          )}

                          {/* JUMP HERE Speech Bubble for fast forward tile */}
                          {isFastForward && !isCompleted && (
                            <div className="jump-speech-bubble">
                              <span>JUMP HERE?</span>
                              <div className="jump-speech-bubble-pointer" />
                            </div>
                          )}

                          {/* Node Button Rendering */}
                          {isCompleted ? (
                            /* Completed Checkmark Node */
                            <div
                              className="completed-checkmark-node-btn"
                              onClick={() => {
                                playClickSound();
                                setSelectedSkill(isSelected ? null : skill);
                              }}
                            >
                              <Check size={42} strokeWidth={4.5} stroke="#ffffff" />
                            </div>
                          ) : isCurrentActive ? (
                            /* Active Green Node with Animated Ring */
                            <div
                              className="active-node-container"
                              onClick={() => {
                                playClickSound();
                                setSelectedSkill(isSelected ? null : skill);
                              }}
                            >
                              <svg className="active-node-svg-ring" viewBox="0 0 108 108">
                                <circle
                                  cx="54"
                                  cy="54"
                                  r="47"
                                  fill="none"
                                  stroke="var(--active-node-track)"
                                  strokeWidth="8.5"
                                />
                                {progressFraction > 0 && (
                                  <circle
                                    cx="54"
                                    cy="54"
                                    r="47"
                                    fill="none"
                                    stroke="#58cc02"
                                    strokeWidth="8.5"
                                    strokeLinecap="round"
                                    strokeDasharray={295.3}
                                    strokeDashoffset={strokeOffset}
                                    style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                                    transform="rotate(-90 54 54)"
                                  />
                                )}
                              </svg>

                              <div className="active-node-inner-btn">
                                <Star size={36} fill="#ffffff" stroke="#ffffff" strokeWidth={1.5} />
                              </div>
                            </div>
                          ) : isFastForward ? (
                            /* Fast Forward Jump Purple Node */
                            <div
                              className="fast-forward-node-btn"
                              onClick={() => {
                                playClickSound();
                                setSelectedSkill(isSelected ? null : skill);
                              }}
                            >
                              <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
                                <path d="M4 18L12.5 12L4 6V18ZM13 6V18L21.5 12L13 6Z" />
                              </svg>
                            </div>
                          ) : isChest ? (
                            /* Chest Node */
                            <div
                              className="chest-node-btn"
                              onClick={() => {
                                playClickSound();
                                setSelectedSkill(isSelected ? null : skill);
                              }}
                            >
                              {/* Dark Mode Chest */}
                              <img
                                src="/assets/learningpath/chestlearning.png"
                                alt="Chest Dark"
                                className="img-theme-dark"
                                width={119}
                                height={98}
                                style={{
                                  objectFit: "contain",
                                  filter: isUnlocked ? "none" : "grayscale(1) brightness(0.65)",
                                  transition: "filter 0.2s ease"
                                }}
                              />
                              {/* Light Mode Chest SVG */}
                              <img
                                src="https://d35aaqx5ub95lt.cloudfront.net/images/path/b841637c196f5be786d8b8578a42ffbf.svg"
                                alt="Chest Light"
                                className="img-theme-light"
                                width={119}
                                height={98}
                                style={{
                                  objectFit: "contain",
                                  filter: isUnlocked ? "none" : "grayscale(1) opacity(0.85)",
                                  transition: "filter 0.2s ease"
                                }}
                              />
                            </div>
                          ) : (
                            /* Locked Grey Node with Star, Trophy, or Headset */
                            <div
                              className="locked-node-btn"
                              onClick={() => {
                                playClickSound();
                                setSelectedSkill(isSelected ? null : skill);
                              }}
                            >
                              {isTrophy ? (
                                <Trophy size={32} fill="var(--locked-node-icon)" stroke="var(--locked-node-icon)" />
                              ) : isHeadset ? (
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--locked-node-icon)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" fill="var(--locked-node-icon)" />
                                </svg>
                              ) : (
                                <Star size={32} fill="var(--locked-node-icon)" stroke="var(--locked-node-icon)" />
                              )}
                            </div>
                          )}

                          {/* Popover Card */}
                          {isSelected && (
                            <div className={`node-popover-duo ${isTrophy || !isUnlocked ? "node-popover-locked-dark" : ""}`}>
                              <h3>{isTrophy ? `Unit ${unitNumber} review` : skill.title}</h3>
                              <p style={{ marginBottom: 18 }}>
                                {isTrophy
                                  ? isUnlocked
                                    ? `Review all Unit ${unitNumber} concepts to earn your trophy!`
                                    : "Complete all levels above to unlock this!"
                                  : isFastForward
                                  ? "Jump ahead to Unit 2 by passing a quick test!"
                                  : isCompleted
                                  ? `Completed! • ${skill.total_lessons}/${skill.total_lessons} Lessons`
                                  : isUnlocked
                                  ? `Lesson ${Math.min(skill.completed_lessons + 1, skill.total_lessons)} of ${skill.total_lessons}`
                                  : "Complete all levels above to unlock this!"}
                              </p>

                              {isUnlocked || isFastForward ? (
                                <Link
                                  href={`/lesson?skillId=${skill.id}`}
                                  onClick={playClickSound}
                                  className="popover-start-btn"
                                  style={isFastForward ? { color: "#ce82ff" } : {}}
                                >
                                  {isFastForward ? "JUMP HERE" : isCompleted ? "PRACTICE +10 XP" : "START +10 XP"}
                                </Link>
                              ) : (
                                <button
                                  disabled
                                  className="popover-locked-btn"
                                >
                                  LOCKED
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* End of Unit / Lesson Section Line with next unit title */}
                  {unitIdx < data.units.length - 1 && (
                    <div className="unit-transition-divider">
                      <div className="unit-divider-line" />
                      <span className="unit-divider-title">
                        {data.units[unitIdx + 1]?.title}
                      </span>
                      <div className="unit-divider-line" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Sidebar */}
          <RightSidebar
            todayXp={data.user.today_xp}
            dailyGoalXp={data.user.daily_goal_xp}
            league={data.user.league}
            onSimulateDay={handleSimulateDay}
            onResetProgress={handleResetProgress}
            loadingAction={actionLoading}
          />
        </main>
      </div>

      {/* Guidebook Modal */}
      <GuidebookModal
        isOpen={!!showGuidebook}
        onClose={() => setShowGuidebook(false)}
        unitTitle={typeof showGuidebook === "string" ? showGuidebook : "Order at a café"}
        guidebookContent={
          data.units.find((u) => u.title === showGuidebook)?.guidebook_content ||
          data.units[0]?.guidebook_content
        }
        themeColor="#58cc02"
      />

      {/* Hearts Modal */}
      <HeartsModal
        isOpen={showHeartsModal}
        onClose={() => setShowHeartsModal(false)}
        hearts={data.user.hearts}
        gems={data.user.gems}
        onRefill={handleRefillHearts}
        onPractice={() => {
          setShowHeartsModal(false);
          const firstSkill = data.units[0]?.skills[0];
          if (firstSkill) {
            window.location.href = `/lesson?skillId=${firstSkill.id}`;
          }
        }}
      />
    </div>
  );
}
