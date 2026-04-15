import React, { useState, useRef, useEffect } from 'react';
import { ATSResult } from '../services/atsScore';

interface HeaderProps {
  onLoadSample: () => void;
  onSwitchToPersonal: () => void;
  onClearData: () => void;
  onExport: (format: 'pdf' | 'docx' | 'csv') => void;
  hasData: boolean;
  viewMode: 'personal' | 'sample';
  atsResult: ATSResult;
  jdMatchScore?: number;
}

const GRADE_COLOR: Record<string, string> = {
  poor:   '#DC2626',
  fair:   '#D97706',
  good:   '#2563EB',
  strong: '#059669',
};

const GRADE_LABEL: Record<string, string> = {
  poor:   'Needs Work',
  fair:   'Developing',
  good:   'Good',
  strong: 'ATS Ready',
};

function catColor(score: number, max: number): string {
  const pct = max > 0 ? (score / max) * 100 : 0;
  if (pct >= 80) return '#059669';
  if (pct >= 55) return '#2563EB';
  if (pct >= 30) return '#D97706';
  return '#DC2626';
}

const exportOptions = [
  {
    fmt: 'pdf' as const,
    label: 'PDF',
    desc: 'Print-ready',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    color: 'text-red-500',
  },
  {
    fmt: 'docx' as const,
    label: 'DOCX',
    desc: 'Word doc',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'text-blue-500',
  },
  {
    fmt: 'csv' as const,
    label: 'CSV',
    desc: 'Spreadsheet',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    color: 'text-emerald-500',
  },
];

function scoreColor(s: number): string {
  if (s >= 85) return '#059669';
  if (s >= 65) return '#2563EB';
  if (s >= 40) return '#D97706';
  return '#DC2626';
}

const Header: React.FC<HeaderProps> = ({ onLoadSample, onSwitchToPersonal, onClearData, onExport, hasData, viewMode, atsResult, jdMatchScore }) => {
  const [isExportOpen,  setIsExportOpen]  = useState(false);
  const [isATSOpen,     setIsATSOpen]     = useState(false);
  const [activeTip,     setActiveTip]     = useState<number | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const exportRef = useRef<HTMLDivElement>(null);
  const atsRef    = useRef<HTMLDivElement>(null);
  const clearRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setIsExportOpen(false);
      if (atsRef.current    && !atsRef.current.contains(e.target as Node))    setIsATSOpen(false);
      if (clearRef.current  && !clearRef.current.contains(e.target as Node))  setShowClearConfirm(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const grade      = atsResult?.grade      ?? 'poor';
  const total      = atsResult?.total      ?? 0;
  const categories = atsResult?.categories ?? [];
  const color      = GRADE_COLOR[grade]    ?? '#DC2626';
  const label      = GRADE_LABEL[grade]    ?? 'Needs Work';

  // When JD is present, button shows ATS Match; otherwise profile completeness
  const hasJD        = jdMatchScore !== undefined;
  const displayScore = hasJD ? jdMatchScore! : total;
  const displayColor = hasJD ? scoreColor(jdMatchScore!) : color;
  const displayLabel = hasJD
    ? (jdMatchScore! >= 75 ? 'Strong Match' : jdMatchScore! >= 50 ? 'Partial Match' : 'Low Match')
    : label;

  return (
    <header
      className="no-print h-14 sticky top-0 z-20 flex items-center justify-between px-3 sm:px-6"
      style={{
        background: 'rgba(30,58,95,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="logo" className="w-7 h-7 rounded-md" style={{ imageRendering: 'crisp-edges' }} />
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white tracking-tight leading-tight">
            Resume<br />Builder
          </span>
          <span className="text-xs font-medium px-1.5 py-0.5 rounded flex-shrink-0"
            style={{ background: 'rgba(37,99,235,0.4)', color: '#93C5FD' }}>ATS</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">

        {/* ── ATS Score button + popup ── */}
        <div className="relative" ref={atsRef}>
          <button
            type="button"
            onClick={() => { setIsATSOpen(o => !o); setActiveTip(null); }}
            className="flex items-center gap-2 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer"
            style={{ height: '32px', background: `${displayColor}30`, color: displayColor, border: `1px solid ${displayColor}88` }}
            onMouseEnter={e => (e.currentTarget.style.background = `${displayColor}45`)}
            onMouseLeave={e => (e.currentTarget.style.background = `${displayColor}30`)}
          >
            <span className="hidden sm:inline" style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.04em' }}>
              {hasJD ? 'ATS Match' : 'Profile Score'}
            </span>
            <span className="hidden sm:inline" style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
            <span className="flex items-center justify-center w-5 h-5 rounded-full text-white font-bold"
              style={{ background: displayColor, fontSize: '10px' }}>
              {displayScore}
            </span>
            <span className="hidden sm:inline" style={{ fontWeight: 700 }}>{displayLabel}</span>
            <span className="hidden sm:block w-16 h-1.5 rounded-full" style={{ position: 'relative', background: 'rgba(255,255,255,0.15)' }}>
              <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${displayScore}%`, background: displayColor }} />
            </span>
            <span className="hidden sm:inline" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px' }}>/100</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ transform: isATSOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* ATS Popup */}
          {isATSOpen && (
            <div
              className="fixed sm:absolute left-2 right-2 sm:left-0 sm:right-auto top-[60px] sm:top-auto sm:mt-3 rounded-2xl z-50"
              style={{
                width: undefined,
                maxWidth: '500px',
                margin: '0 auto',
                background: '#FFFFFF',
                boxShadow: '0 24px 60px rgba(2,36,72,0.28), 0 2px 8px rgba(0,0,0,0.08)',
                border: `1.5px solid ${color}33`,
              }}
            >
              {/* Popup header */}
              <div className="px-5 py-4" style={{ borderBottom: `1.5px solid #F1F5F9`, background: `${displayColor}08`, borderRadius: '16px 16px 0 0' }}>
                {/* ATS Match row — shown only when JD present */}
                {hasJD && (
                  <div className="flex items-center gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ background: displayColor, fontSize: '18px', boxShadow: `0 4px 12px ${displayColor}44` }}>
                      {jdMatchScore}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#94A3B8' }}>ATS Match</div>
                      <div className="text-base font-bold" style={{ color: displayColor }}>{displayLabel}</div>
                    </div>
                    <div className="flex-1 h-2.5 rounded-full ml-2" style={{ background: '#E2E8F0' }}>
                      <div className="h-full rounded-full" style={{ width: `${jdMatchScore}%`, background: displayColor, transition: 'width 0.6s ease' }} />
                    </div>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: '#64748B' }}>
                      {jdMatchScore}<span className="text-xs font-normal text-gray-400">/100</span>
                    </span>
                  </div>
                )}
                {/* Profile Score row — always shown */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ background: color, fontSize: '18px', boxShadow: `0 4px 12px ${color}44` }}>
                    {total}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#94A3B8' }}>
                      Profile Score
                    </div>
                    <div className="text-base font-bold" style={{ color }}>{label}</div>
                  </div>
                  <div className="flex-1 h-2.5 rounded-full ml-2" style={{ background: '#E2E8F0' }}>
                    <div className="h-full rounded-full" style={{ width: `${total}%`, background: color, transition: 'width 0.6s ease' }} />
                  </div>
                  <span className="text-sm font-bold flex-shrink-0" style={{ color: '#64748B' }}>
                    {total}<span className="text-xs font-normal text-gray-400">/100</span>
                  </span>
                </div>
              </div>

              {/* Category rows
                  Layout (460px = 500 - 20px padding each side):
                  label 130px | bar 190px | score+chevron 140px (right-aligned, flush with 52/100)
              */}
              <div className="px-5 py-3 space-y-1">
                {categories.map((cat, i) => {
                  const pct    = cat.max > 0 ? Math.round((cat.score / cat.max) * 100) : 0;
                  const cc     = catColor(cat.score, cat.max);
                  const isOpen = activeTip === i;
                  return (
                    <div key={cat.label}>
                      <button
                        type="button"
                        onClick={() => setActiveTip(isOpen ? null : i)}
                        className="w-full flex items-center py-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                        style={{ border: '1px solid transparent', paddingLeft: '8px', paddingRight: '8px' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#E2E8F0')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                      >
                        {/* Label — fixed 120px, no wrap */}
                        <span style={{ width: '120px', flexShrink: 0, fontSize: '13px', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
                          {cat.label}
                        </span>

                        {/* Bar — flex-1, fills all remaining space so no gap before score */}
                        <div style={{ flex: 1, height: '8px', borderRadius: '9999px', background: '#E2E8F0', minWidth: 0 }}>
                          <div style={{ width: `${pct}%`, height: '100%', borderRadius: '9999px', background: cc, transition: 'width 0.4s ease' }} />
                        </div>

                        {/* Score — fixed 80px, right-aligned */}
                        <span style={{ width: '80px', flexShrink: 0, textAlign: 'right', fontSize: '13px', fontWeight: 700, color: cc, fontVariantNumeric: 'tabular-nums' }}>
                          {cat.score}<span style={{ fontSize: '11px', fontWeight: 400, color: '#9CA3AF' }}>/{cat.max}</span>
                        </span>

                        {/* Chevron — fixed 20px */}
                        <span style={{ width: '20px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {cat.tips.length > 0 && (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"
                              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 150ms' }}>
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          )}
                        </span>
                      </button>

                      {isOpen && cat.tips.length > 0 && (
                        <div className="pl-4 border-l-2 mt-1 mb-1.5 space-y-1.5" style={{ borderColor: cc }}>
                          {cat.tips.map((tip, j) => (
                            <div key={j} className="text-xs px-3 py-2 rounded-lg leading-relaxed"
                              style={{ color: '#475569', background: `${cc}10`, border: `1px solid ${cc}22` }}>
                              {tip}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sample / Personal toggle */}
        {viewMode === 'personal' ? (
          <button
            onClick={onLoadSample}
            className="flex items-center justify-center text-xs font-semibold rounded-md transition-all cursor-pointer"
            style={{ height: '32px', minWidth: '32px', padding: '0 8px',
                     color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.06)', border: '1px solid transparent' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            title="Load Sample"
          >
            <span className="hidden sm:inline" style={{ whiteSpace: 'nowrap' }}>Load Sample</span>
            <svg className="sm:hidden w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={onSwitchToPersonal}
            className="flex items-center justify-center text-xs font-semibold rounded-md transition-all cursor-pointer"
            style={{ height: '32px', minWidth: '32px', padding: '0 8px',
                     color: '#FFF7ED', background: 'rgba(234,88,12,0.75)', border: '1px solid rgba(234,88,12,0.9)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(234,88,12,0.95)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(234,88,12,0.75)')}
            title="My Resume"
          >
            <span className="hidden sm:inline" style={{ whiteSpace: 'nowrap' }}>← My Resume</span>
            <svg className="sm:hidden w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        )}

        {hasData && (
          <div className="relative" ref={clearRef}>
            <button
              onClick={() => setShowClearConfirm(o => !o)}
              className="flex items-center justify-center px-3 text-xs font-semibold rounded-md transition-all cursor-pointer"
              style={{ height: '32px', color: '#FCA5A5', background: 'rgba(239,68,68,0.22)', border: '1px solid rgba(239,68,68,0.45)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.35)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.22)')}
            >
              <span className="hidden sm:inline">Clear</span>
              <svg className="sm:hidden w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            {showClearConfirm && (
              <div
                className="absolute right-0 mt-3 rounded-xl z-50 p-4"
                style={{
                  width: '260px',
                  background: '#FFFFFF',
                  boxShadow: '0 16px 40px rgba(2,36,72,0.18)',
                  border: '1px solid rgba(239,68,68,0.25)',
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="#DC2626" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">Clear all data?</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      This will permanently delete all your personal resume data. This cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer"
                    style={{ background: '#F1F5F9', color: '#475569' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#E2E8F0')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#F1F5F9')}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { onClearData(); setShowClearConfirm(false); }}
                    className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-white"
                    style={{ background: '#DC2626' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#B91C1C')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#DC2626')}
                  >
                    Yes, Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Export dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setIsExportOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 text-xs font-semibold text-white rounded-md transition-all cursor-pointer"
            style={{ height: '32px', background: '#2563EB', border: '1px solid transparent' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1D4ED8')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2563EB')}
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Export</span>
            <svg className="hidden sm:block w-3 h-3 transition-transform duration-150"
              style={{ transform: isExportOpen ? 'rotate(180deg)' : 'rotate(0)' }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isExportOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl py-1.5 z-30"
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 16px 40px rgba(2,36,72,0.18)',
                border: '1px solid rgba(196,198,207,0.3)',
              }}
            >
              {exportOptions.map(({ fmt, label, desc, icon, color }) => (
                <button
                  key={fmt}
                  onClick={() => { onExport(fmt); setIsExportOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer hover:bg-slate-50"
                  style={{ color: '#191C1E' }}
                >
                  <span className={color}>{icon}</span>
                  <span className="font-semibold">{label}</span>
                  <span className="ml-auto text-xs" style={{ color: '#74777F' }}>{desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
