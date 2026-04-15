import React, { useState } from 'react';
import { ATSResult } from '../services/atsScore';

interface Props {
  result: ATSResult;
}

const GRADE_CONFIG = {
  poor:   { label: 'Needs Work', scoreClass: 'text-red-500',   circleClass: 'bg-red-500',   barClass: 'bg-red-500'   },
  fair:   { label: 'Developing', scoreClass: 'text-amber-500', circleClass: 'bg-amber-500', barClass: 'bg-amber-500' },
  good:   { label: 'Good',       scoreClass: 'text-blue-500',  circleClass: 'bg-blue-500',  barClass: 'bg-blue-500'  },
  strong: { label: 'ATS Ready',  scoreClass: 'text-green-500', circleClass: 'bg-green-500', barClass: 'bg-green-500' },
};

function catBarClass(score: number, max: number): string {
  const pct = max > 0 ? (score / max) * 100 : 0;
  if (pct >= 80) return 'bg-green-500';
  if (pct >= 55) return 'bg-blue-500';
  if (pct >= 30) return 'bg-amber-500';
  return 'bg-red-500';
}

const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ATSScorePanel: React.FC<Props> = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTip, setActiveTip]   = useState<number | null>(null);

  const grade      = result?.grade      ?? 'poor';
  const total      = result?.total      ?? 0;
  const categories = result?.categories ?? [];
  const cfg        = GRADE_CONFIG[grade] ?? GRADE_CONFIG.poor;

  return (
    <div className="mx-5 mb-4 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

      {/* Collapsed strip */}
      <button
        type="button"
        onClick={() => setIsExpanded(v => !v)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
      >
        <div className={`w-10 h-10 rounded-full ${cfg.circleClass} flex items-center justify-center flex-shrink-0`}>
          <span className="text-sm font-bold text-white">{total}</span>
        </div>

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1 mb-1">
            <span className={`text-xs font-bold uppercase tracking-wide ${cfg.scoreClass}`}>Score</span>
            <span className="text-xs text-gray-400">/100</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">{cfg.label}</span>
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${cfg.barClass} rounded-full`} style={{ width: `${Math.min(100, total)}%` }} />
            </div>
          </div>
        </div>

        <span className="text-gray-300"><Chevron open={isExpanded} /></span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-gray-100 px-4 pb-4">
          <div className="space-y-1 mt-3">
            {categories.map((cat, index) => {
              const pct      = cat.max > 0 ? Math.round((cat.score / cat.max) * 100) : 0;
              const barClass = catBarClass(cat.score, cat.max);
              const isActive = activeTip === index;

              return (
                <div key={cat.label}>
                  <button
                    type="button"
                    onClick={() => setActiveTip(isActive ? null : index)}
                    className="w-full text-left px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-28 flex-shrink-0 text-xs font-semibold text-gray-700 truncate">{cat.label}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${barClass} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-10 flex-shrink-0 text-right text-xs font-bold text-gray-700 tabular-nums">
                        {cat.score}/{cat.max}
                      </span>
                      {cat.tips.length > 0 && (
                        <span className="text-gray-300"><Chevron open={isActive} /></span>
                      )}
                    </div>
                  </button>

                  {isActive && cat.tips.length > 0 && (
                    <div className="ml-2 pl-4 border-l-2 border-gray-200 mt-1 mb-2 space-y-1.5">
                      {cat.tips.map((tip, i) => (
                        <div key={i} className="text-xs text-gray-600 bg-blue-50 px-3 py-2 rounded-md">{tip}</div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {categories.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-2">No score data</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSScorePanel;
