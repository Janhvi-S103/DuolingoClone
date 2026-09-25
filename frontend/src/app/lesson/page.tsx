"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  X,
  Heart,
  Volume2,
  CheckCircle,
  XCircle,
  Flame,
  Zap,
  Target,
  Sparkles
} from "lucide-react";
import { api, LessonData, Exercise } from "@/utils/api";
import {
  playClickSound,
  playCorrectSound,
  playIncorrectSound,
  playFanfareSound,
  speakSpanish
} from "@/utils/sound";
import { MascotDuo } from "@/components/MascotDuo";
import { OscarCharacter } from "@/components/OscarCharacter";

// Comprehensive Spanish hint dictionary for lesson exercises
const SPANISH_DICTIONARY: Record<string, string> = {
  yo: "I",
  soy: "am",
  eres: "are",
  es: "is",
  somos: "are",
  son: "are",
  una: "a, an",
  un: "a, an",
  unos: "some",
  unas: "some",
  mujer: "woman",
  mujeres: "women",
  hombre: "man",
  hombres: "men",
  niño: "boy",
  niños: "boys",
  niña: "girl",
  niñas: "girls",
  el: "the",
  la: "the",
  los: "the",
  las: "the",
  bebe: "drinks",
  bebo: "drink",
  bebes: "drink",
  agua: "water",
  come: "eats",
  como: "eat / like",
  comes: "eat",
  pan: "bread",
  leche: "milk",
  manzana: "apple",
  manzanas: "apples",
  mi: "my",
  mis: "my",
  tu: "your",
  tus: "your",
  su: "his / her / your",
  sus: "their / your",
  maleta: "suitcase",
  maletas: "suitcases",
  mucho: "nice / much",
  gusto: "pleasure / to meet you",
  juan: "Juan",
  hola: "hello",
  gracias: "thank you",
  por: "for / please",
  favor: "favor / please",
  de: "of / from",
  nada: "nothing / you're welcome",
  hasta: "until / see you",
  luego: "later",
  adiós: "goodbye",
  café: "coffee",
  té: "tea",
  casa: "house",
  perro: "dog",
  gato: "cat",
  libro: "book",
  mamá: "mom",
  papá: "dad",
  él: "he",
  ella: "she",
  ellos: "they",
  ellas: "they",
  nosotros: "we",
  sí: "yes",
  no: "no",
  buenos: "good",
  días: "days / morning",
  tardes: "afternoon",
  noches: "evening / night"
};

function getWordHint(rawWord: string, exerciseData?: any): string {
  const clean = rawWord.toLowerCase().replace(/^[¿¡"']+|[.,!?"']+$/g, "").trim();
  if (exerciseData?.word_hints && exerciseData.word_hints[clean]) {
    return exerciseData.word_hints[clean];
  }
  if (exerciseData?.highlight_word && exerciseData.highlight_word.toLowerCase() === clean && exerciseData.hint) {
    return exerciseData.hint;
  }
  if (SPANISH_DICTIONARY[clean]) {
    return SPANISH_DICTIONARY[clean];
  }
  return clean;
}

function LessonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const skillIdParam = searchParams.get("skillId");
  const lessonIdParam = searchParams.get("lessonId");

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(4);
  const [streakInARow, setStreakInARow] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);

  // Exercise interaction states
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [wordBankAnswer, setWordBankAnswer] = useState<string[]>([]);
  const [typeAnswerText, setTypeAnswerText] = useState("");
  const [selectedBlankOption, setSelectedBlankOption] = useState<string | null>(null);
  const [activeWordHintIdx, setActiveWordHintIdx] = useState<number | null>(null);

  // Match pairs state
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [selectedPairLeft, setSelectedPairLeft] = useState<{ id: string; text: string } | null>(null);
  const [selectedPairRight, setSelectedPairRight] = useState<{ id: string; text: string } | null>(null);
  const [mismatchShakeLeft, setMismatchShakeLeft] = useState<string | null>(null);
  const [mismatchShakeRight, setMismatchShakeRight] = useState<string | null>(null);

  // Feedback states
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [correctSolutionText, setCorrectSolutionText] = useState("");

  // Modals & Final Screens
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showOutOfHeartsModal, setShowOutOfHeartsModal] = useState(false);
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);
  const [completionStats, setCompletionStats] = useState<{
    xpAwarded: number;
    newTotalXp: number;
    accuracy: number;
    streak: number;
    message: string;
  } | null>(null);

  // Fetch lesson data
  useEffect(() => {
    async function fetchLesson() {
      try {
        let data: LessonData;
        if (lessonIdParam) {
          data = await api.getLesson(parseInt(lessonIdParam, 10));
        } else if (skillIdParam) {
          data = await api.getLessonBySkill(parseInt(skillIdParam, 10));
        } else {
          data = await api.getLessonBySkill(1);
        }
        setLesson(data);

        // Fetch current user hearts
        try {
          const user = await api.getCurrentUser();
          setHearts(user.hearts);
        } catch {
          // fallback to 4
        }
      } catch (err) {
        console.error("Failed to load lesson:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [lessonIdParam, skillIdParam]);

  const currentExercise: Exercise | undefined = lesson?.exercises[currentIndex];

  // Memoized left & right items for match_pairs (supports data.left/right AND data.pairs)
  const { matchLeftItems, matchRightItems } = React.useMemo(() => {
    if (!currentExercise || currentExercise.type !== "match_pairs") {
      return { matchLeftItems: [], matchRightItems: [] };
    }
    const data = currentExercise.data || {};

    // Format A: explicitly separated left and right arrays
    if (Array.isArray(data.left) && Array.isArray(data.right) && data.left.length > 0) {
      return {
        matchLeftItems: data.left.map((item: any, idx: number) => ({
          id: String(item.id ?? `l-${idx}`),
          text: String(item.text ?? item.spanish ?? item.word ?? "")
        })),
        matchRightItems: data.right.map((item: any, idx: number) => ({
          id: String(item.id ?? `r-${idx}`),
          text: String(item.text ?? item.english ?? item.translation ?? "")
        }))
      };
    }

    // Format B: array of pairs: [{ id, spanish, english }, ...]
    if (Array.isArray(data.pairs) && data.pairs.length > 0) {
      const left = data.pairs.map((p: any, idx: number) => ({
        id: String(p.id ?? `pair-${idx}`),
        text: String(p.spanish ?? p.left ?? p.source ?? p.word ?? "")
      }));

      const rightRaw = data.pairs.map((p: any, idx: number) => ({
        id: String(p.id ?? `pair-${idx}`),
        text: String(p.english ?? p.right ?? p.target ?? p.translation ?? "")
      }));

      // Deterministic shuffle so right column does not align identically across
      const N = rightRaw.length;
      let order: number[] = [];
      if (N === 5) order = [2, 4, 0, 3, 1];
      else if (N === 4) order = [2, 0, 3, 1];
      else if (N === 3) order = [1, 2, 0];
      else order = rightRaw.map((_, i) => i).reverse();

      const shuffledRight = order.map((i) => rightRaw[i]).filter(Boolean);
      return {
        matchLeftItems: left,
        matchRightItems: shuffledRight.length === rightRaw.length ? shuffledRight : rightRaw
      };
    }

    return { matchLeftItems: [], matchRightItems: [] };
  }, [currentExercise]);

  // Reset state when exercise loads - Audio only plays on explicit word click (NO auto-play)
  useEffect(() => {
    setSelectedOptionId(null);
    setWordBankAnswer([]);
    setTypeAnswerText("");
    setSelectedBlankOption(null);
    setActiveWordHintIdx(null);
    setMatchedPairIds([]);
    setSelectedPairLeft(null);
    setSelectedPairRight(null);
    setMismatchShakeLeft(null);
    setMismatchShakeRight(null);
    setFeedbackStatus("idle");
    setCorrectSolutionText("");
  }, [currentIndex, currentExercise]);

  // Match Pairs Tap Handler
  const handleMatchSelect = (type: "left" | "right", item: { id: string; text: string }) => {
    if (feedbackStatus !== "idle") return;
    playClickSound();

    if (type === "left") {
      if (selectedPairLeft?.id === item.id && selectedPairLeft?.text === item.text) {
        setSelectedPairLeft(null);
        return;
      }
      setSelectedPairLeft(item);
      if (selectedPairRight) {
        evaluatePair(item, selectedPairRight);
      }
    } else {
      if (selectedPairRight?.id === item.id && selectedPairRight?.text === item.text) {
        setSelectedPairRight(null);
        return;
      }
      setSelectedPairRight(item);
      if (selectedPairLeft) {
        evaluatePair(selectedPairLeft, item);
      }
    }
  };

  const evaluatePair = async (
    left: { id: string; text: string },
    right: { id: string; text: string }
  ) => {
    if (left.id === right.id) {
      // Correct Match!
      playCorrectSound();
      const updated = [...matchedPairIds, left.id];
      setMatchedPairIds(updated);
      setSelectedPairLeft(null);
      setSelectedPairRight(null);

      // Check if all pairs are now completed
      const totalPairs = matchLeftItems.length || (currentExercise?.data.left || currentExercise?.data.pairs || []).length;
      if (updated.length >= totalPairs) {
        setStreakInARow((s) => s + 1);
        setFeedbackStatus("correct");
      }
    } else {
      // Mismatch
      playIncorrectSound();
      setMismatchShakeLeft(left.id);
      setMismatchShakeRight(right.id);

      // Deduct heart
      const nextHearts = Math.max(0, hearts - 1);
      setHearts(nextHearts);
      setMistakesCount((c) => c + 1);
      setStreakInARow(0);
      try {
        await api.loseHeart();
      } catch (e) {
        console.error(e);
      }

      setTimeout(() => {
        setMismatchShakeLeft(null);
        setMismatchShakeRight(null);
        setSelectedPairLeft(null);
        setSelectedPairRight(null);
      }, 450);

      if (nextHearts === 0) {
        setTimeout(() => setShowOutOfHeartsModal(true), 600);
      }
    }
  };

  // Check button enable state
  const isCheckEnabled = () => {
    if (!currentExercise) return false;
    switch (currentExercise.type) {
      case "translate_word_bank":
        return wordBankAnswer.length > 0;
      case "match_pairs":
        const total = matchLeftItems.length || (currentExercise.data.left || currentExercise.data.pairs || []).length;
        return total > 0 && matchedPairIds.length === total;
      case "multiple_choice":
        return selectedOptionId !== null;
      case "fill_in_blank":
        return selectedBlankOption !== null;
      case "type_answer":
        return typeAnswerText.trim().length > 0;
      default:
        return false;
    }
  };

  // Submit Answer
  const handleCheck = async () => {
    if (!currentExercise) return;
    playClickSound();

    let isCorrect = false;
    let solution = "";

    switch (currentExercise.type) {
      case "translate_word_bank": {
        const expected = (currentExercise.data.solution || []).join(" ");
        const actual = wordBankAnswer.join(" ");
        isCorrect = expected.toLowerCase().trim() === actual.toLowerCase().trim();
        solution = expected;
        break;
      }
      case "match_pairs": {
        isCorrect = true;
        solution = "All pairs matched!";
        break;
      }
      case "multiple_choice": {
        const selected = (currentExercise.data.options || []).find(
          (o: any) => o.id === selectedOptionId
        );
        isCorrect = !!selected?.correct;
        const correctOpt = (currentExercise.data.options || []).find((o: any) => o.correct);
        solution = correctOpt ? `${correctOpt.text} (${correctOpt.subtext || ""})` : "";
        break;
      }
      case "fill_in_blank": {
        const expected = currentExercise.data.solution || "";
        isCorrect = selectedBlankOption?.toLowerCase() === expected.toLowerCase();
        solution = expected;
        break;
      }
      case "type_answer": {
        const cleanInput = typeAnswerText.trim().toLowerCase().replace(/[.!?]/g, "");
        const accepted = (currentExercise.data.accepted || [currentExercise.data.solution]).map((s: string) =>
          s.toLowerCase().replace(/[.!?]/g, "")
        );
        isCorrect = accepted.includes(cleanInput);
        solution = currentExercise.data.solution || "";
        break;
      }
    }

    if (isCorrect) {
      playCorrectSound();
      setStreakInARow((s) => s + 1);
      setFeedbackStatus("correct");
    } else {
      playIncorrectSound();
      setStreakInARow(0);
      setFeedbackStatus("incorrect");
      setCorrectSolutionText(solution);
      setMistakesCount((c) => c + 1);

      const nextHearts = Math.max(0, hearts - 1);
      setHearts(nextHearts);
      try {
        await api.loseHeart();
      } catch (e) {
        console.error(e);
      }

      if (nextHearts === 0) {
        setTimeout(() => setShowOutOfHeartsModal(true), 600);
      }
    }
  };

  // Continue to next exercise or finish
  const handleContinue = async () => {
    playClickSound();
    if (!lesson) return;

    if (currentIndex + 1 < lesson.exercises.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed lesson!
      const totalExercises = lesson.exercises.length;
      const accuracy = Math.max(0, Math.round(((totalExercises - mistakesCount) / totalExercises) * 100));

      try {
        const result = await api.completeLesson(lesson.id, {
          hearts_remaining: hearts,
          accuracy: accuracy,
          time_taken_seconds: 60
        });

        setCompletionStats({
          xpAwarded: result.xp_awarded,
          newTotalXp: result.new_total_xp,
          accuracy: accuracy,
          streak: result.new_streak,
          message: result.message
        });
        setIsCompletedScreen(true);
        playFanfareSound();

        // Confetti explosion
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error("Error completing lesson:", err);
      }
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (feedbackStatus !== "idle") {
          handleContinue();
        } else if (isCheckEnabled()) {
          handleCheck();
        }
      }

      // Match pairs number shortcuts (1-5 for left, 6-0 for right)
      if (feedbackStatus === "idle" && currentExercise?.type === "match_pairs") {
        const leftItems = matchLeftItems;
        const rightItems = matchRightItems;
        if (["1", "2", "3", "4", "5"].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (leftItems[idx] && !matchedPairIds.includes(leftItems[idx].id)) {
            handleMatchSelect("left", leftItems[idx]);
          }
        } else if (["6", "7", "8", "9", "0"].includes(e.key)) {
          const mapIdx: Record<string, number> = { "6": 0, "7": 1, "8": 2, "9": 3, "0": 4 };
          const idx = mapIdx[e.key];
          if (rightItems[idx] && !matchedPairIds.includes(rightItems[idx].id)) {
            handleMatchSelect("right", rightItems[idx]);
          }
        }
      }

      // Multiple choice 1, 2, 3
      if (feedbackStatus === "idle" && currentExercise?.type === "multiple_choice") {
        if (["1", "2", "3"].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          const opt = currentExercise.data.options?.[idx];
          if (opt) {
            playClickSound();
            setSelectedOptionId(opt.id);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [feedbackStatus, isCheckEnabled, currentExercise, matchedPairIds, matchLeftItems, matchRightItems]);

  if (loading || !lesson) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "var(--bg-main)" }}>
        <MascotDuo mood="cheering" size={110} />
      </div>
    );
  }

  // Completion Celebration Screen
  if (isCompletedScreen && completionStats) {
    return (
      <div
        className="lesson-page-container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 24
        }}
      >
        <div
          style={{
            maxWidth: 520,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            margin: "0 auto"
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginBottom: 16 }}>
            <MascotDuo mood="cheering" size={160} />
          </div>

          <h1 style={{ fontSize: 34, fontWeight: 900, color: "var(--yellow)", marginTop: 0, marginBottom: 8 }}>
            Lesson Complete!
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-sub)", fontWeight: 700, marginBottom: 32 }}>
            {completionStats.message}
          </p>

          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 40 }}>
            {/* Total XP */}
            <div
              className="sidebar-panel-card"
              style={{
                borderColor: "var(--yellow)",
                backgroundColor: "var(--yellow-light)",
                padding: "20px 12px",
                alignItems: "center"
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--yellow)", textTransform: "uppercase" }}>
                Total XP
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 26, fontWeight: 900, color: "var(--yellow)", marginTop: 6 }}>
                <Zap size={22} fill="currentColor" />
                <span>+{completionStats.xpAwarded}</span>
              </div>
            </div>

            {/* Accuracy */}
            <div
              className="sidebar-panel-card"
              style={{
                borderColor: "var(--green)",
                backgroundColor: "var(--green-light)",
                padding: "20px 12px",
                alignItems: "center"
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--green-text)", textTransform: "uppercase" }}>
                Accuracy
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 26, fontWeight: 900, color: "var(--green-text)", marginTop: 6 }}>
                <Target size={22} />
                <span>{completionStats.accuracy}%</span>
              </div>
            </div>

            {/* Streak */}
            <div
              className="sidebar-panel-card"
              style={{
                borderColor: "var(--orange)",
                backgroundColor: "rgba(255, 150, 0, 0.1)",
                padding: "20px 12px",
                alignItems: "center"
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--orange)", textTransform: "uppercase" }}>
                Streak
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 26, fontWeight: 900, color: "var(--orange)", marginTop: 6 }}>
                <Flame size={22} fill="currentColor" />
                <span>{completionStats.streak} Days</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              router.push("/");
            }}
            className="btn-3d btn-green"
            style={{ width: "100%", padding: "16px", fontSize: 17, letterSpacing: 0.8 }}
          >
            CONTINUE
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round(((currentIndex) / lesson.exercises.length) * 100);

  return (
    <div className="lesson-page-container">
      {/* Top Header */}
      <header className="lesson-nav-header">
        <button
          onClick={() => {
            playClickSound();
            setShowQuitModal(true);
          }}
          className="lesson-nav-close"
          title="Quit Lesson"
        >
          <X size={26} strokeWidth={2.5} />
        </button>

        {/* Lesson Progress Bar with Streak Pill */}
        <div className="lesson-track-container">
          {streakInARow >= 3 && (
            <div className="lesson-streak-pill">
              {streakInARow} IN A ROW
            </div>
          )}
          <div className="lesson-track-bg">
            <div
              className="lesson-track-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Hearts Badge */}
        <div className="lesson-hearts-badge">
          <Heart size={26} fill="#ff4b4b" stroke="#ff4b4b" />
          <span>{hearts > 50 ? "∞" : hearts}</span>
        </div>
      </header>

      {/* Main Exercise Arena */}
      <main className="lesson-main-stage">
        {currentExercise && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Title / Header */}
            {currentExercise.data.badge && (
              <div className="new-word-capsule">
                <Sparkles size={14} />
                <span>{currentExercise.data.badge}</span>
              </div>
            )}

            <h1 className="exercise-heading-text">
              {currentExercise.prompt}
            </h1>

            {/* EXERCISE TYPE: MATCH PAIRS (Images 2 & 3) */}
            {currentExercise.type === "match_pairs" && (
              <div className="match-pairs-board">
                {/* Left Column (Spanish or English) */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {matchLeftItems.map((item: any, idx: number) => {
                    const isMatched = matchedPairIds.includes(item.id);
                    const isSelected = selectedPairLeft?.id === item.id && selectedPairLeft?.text === item.text;
                    const isError = mismatchShakeLeft === item.id;
                    const keyNumber = idx + 1;

                    return (
                      <div
                        key={`left-${item.id}-${idx}`}
                        className={`match-pair-card ${
                          isMatched ? "matched" : isSelected ? "selected" : ""
                        } ${isError ? "shake-error" : ""}`}
                        onClick={() => handleMatchSelect("left", item)}
                      >
                        <div className="match-pair-key-badge">{keyNumber}</div>
                        <div className="match-pair-label">{item.text}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Column (Target translation) */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {matchRightItems.map((item: any, idx: number) => {
                    const isMatched = matchedPairIds.includes(item.id);
                    const isSelected = selectedPairRight?.id === item.id && selectedPairRight?.text === item.text;
                    const isError = mismatchShakeRight === item.id;
                    const keyLabels = ["6", "7", "8", "9", "0"];
                    const keyNumber = keyLabels[idx] || `${idx + 6}`;

                    return (
                      <div
                        key={`right-${item.id}-${idx}`}
                        className={`match-pair-card ${
                          isMatched ? "matched" : isSelected ? "selected" : ""
                        } ${isError ? "shake-error" : ""}`}
                        onClick={() => handleMatchSelect("right", item)}
                      >
                        <div className="match-pair-key-badge">{keyNumber}</div>
                        <div className="match-pair-label">{item.text}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EXERCISE TYPE: TRANSLATE WORD BANK (Images 4 & 5) */}
            {currentExercise.type === "translate_word_bank" && (() => {
              const phrase = currentExercise.data.phrase || currentExercise.target_text || currentExercise.audio_text || "";
              const phraseWords = phrase.trim().split(/\s+/).filter(Boolean);

              return (
                <div style={{ width: "100%", maxWidth: 600 }}>
                  {/* Character Speech Row with Oscar */}
                  <div className="character-speech-row">
                    <OscarCharacter size={96} />

                    <div className="speech-bubble-dark" onClick={() => setActiveWordHintIdx(null)}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          speakSpanish(phrase);
                        }}
                        className="audio-speaker-icon-btn"
                        title="Listen to full phrase"
                      >
                        <Volume2 size={24} />
                      </button>

                      {/* Interactive words in the sentence */}
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 8px" }}>
                        {phraseWords.map((rawWord: string, wIdx: number) => {
                          const clean = rawWord.toLowerCase().replace(/^[¿¡"']+|[.,!?"']+$/g, "").trim();
                          const isHighlighted = currentExercise.data.highlight_word?.toLowerCase() === clean;
                          const hint = getWordHint(rawWord, currentExercise.data);
                          const isActive = activeWordHintIdx === wIdx;

                          return (
                            <span
                              key={`word-${wIdx}-${rawWord}`}
                              className={`dotted-word-hint ${isHighlighted ? "highlight-new" : ""} ${isActive ? "active" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                playClickSound();
                                // Audio only plays when that particular word is clicked
                                speakSpanish(clean);
                                setActiveWordHintIdx((prev) => (prev === wIdx ? null : wIdx));
                              }}
                            >
                              {rawWord}
                              {isActive && (
                                <div className="hint-tooltip-bubble" onClick={(e) => e.stopPropagation()}>
                                  {hint}
                                </div>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Answer Slot Baseline */}
                  <div className="answer-slot-baseline">
                    {wordBankAnswer.map((word, wIdx) => (
                      <button
                        key={`${word}-${wIdx}`}
                        className="word-tile-btn"
                        onClick={() => {
                          if (feedbackStatus !== "idle") return;
                          playClickSound();
                          setWordBankAnswer((prev) => prev.filter((_, idx) => idx !== wIdx));
                        }}
                      >
                        {word}
                      </button>
                    ))}
                  </div>

                  {/* Word Pool Container */}
                  <div className="word-pool-container">
                    {(currentExercise.data.words || []).map((word: string, wIdx: number) => {
                      const isUsed = wordBankAnswer.includes(word);
                      return isUsed ? (
                        <div key={`${word}-${wIdx}`} className="word-tile-empty-slot" />
                      ) : (
                        <button
                          key={`${word}-${wIdx}`}
                          disabled={feedbackStatus !== "idle"}
                          className="word-tile-btn"
                          onClick={() => {
                            playClickSound();
                            setWordBankAnswer((prev) => [...prev, word]);
                          }}
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* EXERCISE TYPE: MULTIPLE CHOICE */}
            {currentExercise.type === "multiple_choice" && (
              <div className="mc-choice-grid">
                {(currentExercise.data.options || []).map((opt: any, idx: number) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      className={`mc-choice-card ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        if (feedbackStatus !== "idle") return;
                        playClickSound();
                        setSelectedOptionId(opt.id);
                        if (opt.text) speakSpanish(opt.text);
                      }}
                    >
                      <div className="mc-choice-key">{idx + 1}</div>
                      <div className="mc-choice-icon">{opt.icon || "💡"}</div>
                      <div className="mc-choice-text">{opt.text}</div>
                      {opt.subtext && <div className="mc-choice-subtext">{opt.subtext}</div>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* EXERCISE TYPE: FILL IN THE BLANK */}
            {currentExercise.type === "fill_in_blank" && (
              <div style={{ width: "100%", textAlign: "center" }}>
                <div className="blank-sentence-row">
                  <span>{currentExercise.data.prefix}</span>
                  <span className="blank-slot-target">
                    {selectedBlankOption || "____"}
                  </span>
                  <span>{currentExercise.data.suffix}</span>
                </div>

                {currentExercise.data.translation && (
                  <p style={{ color: "var(--text-sub)", fontSize: 16, fontWeight: 600, marginBottom: 32 }}>
                    {currentExercise.data.translation}
                  </p>
                )}

                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
                  {(currentExercise.data.options || []).map((opt: string) => {
                    const isSelected = selectedBlankOption === opt;
                    return (
                      <button
                        key={opt}
                        className="word-tile-btn"
                        style={{
                          borderColor: isSelected ? "var(--blue)" : "var(--card-border)",
                          backgroundColor: isSelected ? "var(--blue-light)" : "var(--card-bg)",
                          color: isSelected ? "var(--blue)" : "var(--text-main)"
                        }}
                        onClick={() => {
                          if (feedbackStatus !== "idle") return;
                          playClickSound();
                          setSelectedBlankOption(opt);
                          speakSpanish(opt);
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EXERCISE TYPE: TYPE ANSWER */}
            {currentExercise.type === "type_answer" && (
              <div style={{ width: "100%", maxWidth: 540 }}>
                <input
                  type="text"
                  placeholder="Type in Spanish..."
                  className="type-input-field"
                  value={typeAnswerText}
                  disabled={feedbackStatus !== "idle"}
                  onChange={(e) => setTypeAnswerText(e.target.value)}
                  autoFocus
                />

                {/* Accent Virtual Keys */}
                <div className="accent-virtual-row">
                  {["á", "é", "í", "ó", "ú", "ñ", "¿", "¡"].map((acc) => (
                    <button
                      key={acc}
                      type="button"
                      className="accent-key-tile"
                      onClick={() => {
                        playClickSound();
                        setTypeAnswerText((prev) => prev + acc);
                      }}
                    >
                      {acc}
                    </button>
                  ))}
                </div>

                {currentExercise.data.hint && (
                  <p style={{ fontSize: 14, color: "var(--text-sub)", fontWeight: 600, marginTop: 14 }}>
                    💡 Hint: {currentExercise.data.hint}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Signature Duolingo Bottom Feedback Action Bar */}
      <footer
        className={`lesson-footer-bar ${
          feedbackStatus === "correct"
            ? "state-correct"
            : feedbackStatus === "incorrect"
            ? "state-incorrect"
            : ""
        }`}
      >
        <div className="lesson-footer-inner-max">
          {/* Idle state */}
          {feedbackStatus === "idle" && (
            <>
              <button
                onClick={() => {
                  playClickSound();
                  handleContinue();
                }}
                className="skip-action-btn"
              >
                SKIP
              </button>

              <button
                onClick={handleCheck}
                disabled={!isCheckEnabled()}
                className={`check-action-btn ${isCheckEnabled() ? "active" : "disabled"}`}
              >
                CHECK
              </button>
            </>
          )}

          {/* Correct state (Image 3) */}
          {feedbackStatus === "correct" && (
            <>
              <div className="feedback-badge-row">
                <div className="feedback-check-circle">
                  <CheckCircle size={38} strokeWidth={3} />
                </div>
                <div>
                  <div className="feedback-text-title correct">Great job!</div>
                  <div className="feedback-quick-options">
                    <span>💤 TOO EASY</span>
                    <span>⛰️ TOO DIFFICULT</span>
                    <span>🚩 REPORT</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="check-action-btn active"
              >
                CONTINUE
              </button>
            </>
          )}

          {/* Incorrect state */}
          {feedbackStatus === "incorrect" && (
            <>
              <div className="feedback-badge-row">
                <div className="feedback-wrong-circle">
                  <XCircle size={38} strokeWidth={3} />
                </div>
                <div>
                  <div className="feedback-text-title wrong">Correct solution:</div>
                  <div className="feedback-solution-text">
                    {correctSolutionText}
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="btn-3d btn-red"
                style={{ padding: "14px 44px", borderRadius: 16, fontSize: 15 }}
              >
                GOT IT
              </button>
            </>
          )}
        </div>
      </footer>

      {/* Quit Lesson Confirmation Modal */}
      {showQuitModal && (
        <div className="modal-overlay" onClick={() => setShowQuitModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <MascotDuo mood="crying" size={100} />
            <h3 style={{ fontSize: 24, fontWeight: 900, marginTop: 16, marginBottom: 8 }}>
              Wait, don't leave!
            </h3>
            <p style={{ fontSize: 15, color: "var(--text-sub)", fontWeight: 600, marginBottom: 24 }}>
              If you leave now, you will lose your progress for this session.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={() => {
                  playClickSound();
                  setShowQuitModal(false);
                }}
                className="btn-3d btn-blue"
                style={{ width: "100%", padding: "14px" }}
              >
                KEEP LEARNING
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  router.push("/");
                }}
                className="btn-3d btn-red"
                style={{ width: "100%", padding: "14px" }}
              >
                END SESSION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Out of Hearts Modal */}
      {showOutOfHeartsModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <MascotDuo mood="crying" size={110} />
            <h3 style={{ fontSize: 26, fontWeight: 900, marginTop: 16, marginBottom: 8 }}>
              You ran out of hearts!
            </h3>
            <p style={{ fontSize: 15, color: "var(--text-sub)", fontWeight: 600, marginBottom: 24 }}>
              Restore hearts with gems or practice to continue learning.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={async () => {
                  playClickSound();
                  try {
                    await api.refillHearts();
                    setHearts(5);
                    setShowOutOfHeartsModal(false);
                  } catch (e) {
                    console.error("Refill error:", e);
                  }
                }}
                className="btn-3d btn-blue"
                style={{ width: "100%", padding: "14px" }}
              >
                REFILL HEARTS (50 GEMS)
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  router.push("/");
                }}
                className="btn-3d btn-card"
                style={{ width: "100%", padding: "12px" }}
              >
                QUIT LESSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "var(--bg-main)" }}>
          <MascotDuo mood="cheering" size={120} />
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}
