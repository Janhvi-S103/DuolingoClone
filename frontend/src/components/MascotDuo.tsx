import React from "react";

interface MascotDuoProps {
  mood?: "happy" | "cheering" | "crying" | "determined" | "sleeping";
  size?: number;
  className?: string;
}

export function MascotDuo({ mood = "happy", size = 110, className = "" }: MascotDuoProps) {
  return (
    <div style={{ width: size, height: size * 1.05 }} className={`inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 140 145"
        width={size}
        height={size * 1.05}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Feet */}
        <ellipse cx="50" cy="132" rx="12" ry="6" fill="#ff9600" />
        <ellipse cx="90" cy="132" rx="12" ry="6" fill="#ff9600" />

        {/* Main Body */}
        <path
          d="M70 12C36 12 18 38 18 84C18 118 42 130 70 130C98 130 122 118 122 84C122 38 104 12 70 12Z"
          fill="#58cc02"
        />

        {/* Belly Patch */}
        <path
          d="M70 64C50 64 38 80 38 106C38 124 52 130 70 130C88 130 102 124 102 106C102 80 90 64 70 64Z"
          fill="#78d602"
        />

        {/* Wings */}
        <path
          d="M20 74C12 84 14 104 24 108C32 112 34 94 30 78Z"
          fill="#46a302"
        />
        <path
          d="M120 74C128 84 126 104 116 108C108 112 106 94 110 78Z"
          fill="#46a302"
        />

        {/* Outer White Eyeballs */}
        <circle cx="50" cy="54" r="21" fill="#ffffff" />
        <circle cx="90" cy="54" r="21" fill="#ffffff" />

        {/* Eye Irises & Pupils */}
        {mood === "crying" ? (
          <>
            <path d="M40 54C40 48 58 48 58 54" stroke="#2b3940" strokeWidth="4" strokeLinecap="round" />
            <path d="M82 54C82 48 100 48 100 54" stroke="#2b3940" strokeWidth="4" strokeLinecap="round" />
            <circle cx="36" cy="68" r="6" fill="#1cb0f6" />
            <circle cx="104" cy="68" r="6" fill="#1cb0f6" />
          </>
        ) : (
          <>
            <circle cx="54" cy="54" r="9" fill="#131f24" />
            <circle cx="86" cy="54" r="9" fill="#131f24" />
            <circle cx="56" cy="51" r="3" fill="#ffffff" />
            <circle cx="88" cy="51" r="3" fill="#ffffff" />
          </>
        )}

        {/* Beak */}
        <path
          d="M62 60L78 60L70 76Z"
          fill="#ff9600"
        />
      </svg>
    </div>
  );
}
