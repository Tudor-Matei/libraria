import { useMemo } from "react";

export default function RatingStar({ fillPercentage }: { fillPercentage: number }) {
  const generatedRandomIDForGradient = useMemo(() => Math.floor(Math.random() * 1_000_000), []);
  return (
    <svg width="25" height="25" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      {fillPercentage !== 100 && fillPercentage !== 0 && (
        <defs>
          <linearGradient id={`gradient-${generatedRandomIDForGradient}`}>
            <stop offset={`${fillPercentage}%`} stopColor="yellow"></stop>
            <stop offset="0" stopColor="transparent"></stop>
          </linearGradient>
        </defs>
      )}
      <path
        d="M7.5 0.97082L8.89854 5.27508L8.96589 5.48237H9.18386H13.7096L10.0482 8.14255L9.87186 8.27067L9.93922 8.47796L11.3378 12.7822L7.67634 10.122L7.5 9.99393L7.32366 10.122L3.66224 12.7822L5.06078 8.47796L5.12814 8.27067L4.9518 8.14255L1.29038 5.48237H5.81614H6.03411L6.10146 5.27508L7.5 0.97082Z"
        stroke="black"
        strokeWidth="0.6"
        fill={
          fillPercentage === 100
            ? "yellow"
            : fillPercentage === 0
            ? "transparent"
            : `url('#gradient-${generatedRandomIDForGradient}')`
        }
      />
    </svg>
  );
}
