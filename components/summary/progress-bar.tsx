import React from "react";

interface ProgressBarProps {
  currentSection: number;
  totalSections: number;
}

export default function ProgressBar({
  currentSection,
  totalSections,
}: ProgressBarProps) {
  const progress = ((currentSection + 1) / totalSections) * 100;

  return (
    <div className="w-full mb-4">
      {/* Progress bar container */}
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        {/* Progress fill with gradient */}
        <div
          className="h-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Progress text */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>
          Section {currentSection + 1} of {totalSections}
        </span>
        <span>{Math.round(progress)}% complete</span>
      </div>
    </div>
  );
}
