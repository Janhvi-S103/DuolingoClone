import React from "react";

export function OscarCharacter({ size = 96 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size * 1.15, flexShrink: 0 }}>
      <svg
        viewBox="0 0 100 115"
        width={size}
        height={size * 1.15}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <ellipse cx="50" cy="110" rx="24" ry="5" fill="#182226" />

        {/* Legs / Shoes */}
        <ellipse cx="40" cy="104" rx="8" ry="5" fill="#1cb0f6" />
        <ellipse cx="60" cy="104" rx="8" ry="5" fill="#1cb0f6" />
        <rect x="36" y="88" width="10" height="15" rx="3" fill="#2ce2a8" />
        <rect x="54" y="88" width="10" height="15" rx="3" fill="#2ce2a8" />

        {/* Pink Torso */}
        <ellipse cx="50" cy="80" rx="22" ry="16" fill="#f498af" />
        <path d="M42 66C46 72 54 72 58 66" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

        {/* Head */}
        <rect x="32" y="32" width="36" height="38" rx="14" fill="#c48261" />

        {/* Hair */}
        <path
          d="M30 38C28 26 36 16 50 16C64 16 72 26 70 38C70 42 66 42 64 36C60 30 52 28 46 30C40 32 36 38 30 38Z"
          fill="#3b2d28"
        />
        <circle cx="50" cy="18" r="8" fill="#3b2d28" />

        {/* Ears */}
        <circle cx="28" cy="50" r="5" fill="#c48261" />
        <circle cx="72" cy="50" r="5" fill="#c48261" />

        {/* Eyebrows */}
        <path d="M36 40C38 38 44 38 46 40" stroke="#3b2d28" strokeWidth="3" strokeLinecap="round" />
        <path d="M54 40C56 38 62 38 64 40" stroke="#3b2d28" strokeWidth="3" strokeLinecap="round" />

        {/* Eyes (Sly/charming look to the side) */}
        <ellipse cx="42" cy="46" rx="4" ry="4" fill="#ffffff" />
        <ellipse cx="58" cy="46" rx="4" ry="4" fill="#ffffff" />
        <circle cx="44" cy="46" r="2.5" fill="#182226" />
        <circle cx="60" cy="46" r="2.5" fill="#182226" />

        {/* Nose */}
        <ellipse cx="50" cy="49" rx="3.5" ry="3" fill="#a86548" />

        {/* Signature Mustache */}
        <path
          d="M34 56C36 52 46 52 50 56C54 52 64 52 66 56C64 62 54 62 50 58C46 62 36 62 34 56Z"
          fill="#3b2d28"
        />
      </svg>
    </div>
  );
}
