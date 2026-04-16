import React, { useState, useEffect, useRef } from 'react';
import { Template, TEMPLATE_OPTIONS } from '../types';

interface TemplateSelectorProps {
  selectedTemplate: Template | null;
  onTemplateChange: (t: Template) => void;
  jd: string;
  onJdChange: (v: string) => void;
}

const TEMPLATE_META: Record<string, { short: string; accent: string; desc: string }> = {
  A: { short: 'Classic',    accent: '#1E3A5F', desc: 'ATS Universal' },
  B: { short: 'Tech',       accent: '#2563EB', desc: 'Tech / Data' },
  C: { short: 'Modern Pro', accent: '#EA580C', desc: 'Two-Column' },
  D: { short: 'Prime ATS',   accent: '#1a5c96', desc: 'Blue Header' },
};

const TemplateThumbnail: React.FC<{ value: string; selected: boolean }> = ({ value, selected }) => {
  const meta = TEMPLATE_META[value] || { accent: '#1E3A5F' };
  const bg = selected ? `${meta.accent}14` : '#ECEEF0';

  if (value === 'C') {
    return (
      <div className="w-full flex flex-col gap-0.5 p-1.5 rounded-md" style={{ background: bg, height: '100%' }}>
        <div className="h-1.5 w-3/4 rounded-sm" style={{ background: meta.accent, opacity: 0.85 }} />
        <div className="h-1 w-1/2 rounded-sm" style={{ background: meta.accent, opacity: 0.5 }} />
        <div className="h-px w-full mt-0.5" style={{ background: meta.accent, opacity: 0.7 }} />
        <div className="flex gap-1 mt-0.5 flex-1">
          <div className="flex flex-col gap-0.5 flex-1">
            {[100, 90, 80, 70, 85, 75, 65, 80, 70, 60].map((w, i) => (
              <div key={i} className="h-0.5 rounded-sm" style={{ width: `${w}%`, background: '#CBD5E1' }} />
            ))}
          </div>
          <div className="flex flex-col gap-0.5" style={{ width: '38%' }}>
            <div className="h-px w-full" style={{ background: meta.accent, opacity: 0.5 }} />
            {[100, 80, 90, 70, 100, 60, 80].map((w, i) => (
              <div key={i} className="h-0.5 rounded-sm" style={{ width: `${w}%`, background: '#CBD5E1' }} />
            ))}
            <div className="flex flex-wrap gap-0.5 mt-0.5">
              {[40, 35, 45, 30].map((w, i) => (
                <div key={i} className="h-1 rounded-sm" style={{ width: `${w}%`, background: '#E2E8F0', border: `0.5px solid ${meta.accent}55` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (value === 'D') {
    // Prime ATS: big blue name left, photo top-right, blue section underlines
    return (
      <div className="w-full flex flex-col gap-0.5 p-1.5 rounded-md" style={{ background: bg, height: '100%' }}>
        {/* Header row: name + photo */}
        <div className="flex items-start justify-between gap-1">
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="h-2 w-full rounded-sm" style={{ background: meta.accent, opacity: 0.9 }} />
            <div className="h-1 w-2/3 rounded-sm" style={{ background: meta.accent, opacity: 0.45 }} />
            <div className="h-0.5 w-full rounded-sm mt-0.5" style={{ background: '#94A3B8' }} />
          </div>
          <div className="rounded-sm flex-shrink-0" style={{ width: '10px', height: '10px', background: '#CBD5E1', border: `0.5px solid ${meta.accent}44` }} />
        </div>
        {/* Blue underlined sections */}
        {[0, 1].map(s => (
          <div key={s} className="mt-1">
            <div className="h-px w-full mb-0.5" style={{ background: meta.accent, opacity: 0.6 }} />
            {[100, 80, 70].map((w, i) => (
              <div key={i} className="h-0.5 rounded-sm mb-0.5" style={{ width: `${w}%`, background: '#CBD5E1' }} />
            ))}
          </div>
        ))}
        {/* Skills grid */}
        <div className="mt-0.5">
          <div className="h-px w-full mb-0.5" style={{ background: meta.accent, opacity: 0.6 }} />
          <div className="grid grid-cols-2 gap-0.5">
            {[70, 55, 60, 45].map((w, i) => (
              <div key={i} className="h-0.5 rounded-sm" style={{ width: `${w}%`, background: '#CBD5E1' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Template B: bold name + thick indigo bottom border on header, indigo section labels
  if (value === 'B') {
    return (
      <div className="w-full flex flex-col gap-0.5 p-1.5 rounded-md" style={{ background: bg, height: '100%' }}>
        {/* Header with thick bottom border */}
        <div style={{ borderBottom: `2px solid ${meta.accent}`, paddingBottom: '3px', marginBottom: '3px' }}>
          <div className="h-2 w-full rounded-sm" style={{ background: '#1a1a1a', opacity: 0.85 }} />
          <div className="h-1 w-1/2 rounded-sm mt-0.5" style={{ background: meta.accent, opacity: 0.7 }} />
          <div className="h-0.5 w-3/4 rounded-sm mt-0.5" style={{ background: '#94A3B8' }} />
        </div>
        {/* Indigo-labeled sections */}
        {[[100, 85, 75], [100, 90, 70, 60]].map((lines, s) => (
          <div key={s} className="mt-1">
            <div className="h-0.5 w-2/5 rounded-sm mb-0.5" style={{ background: meta.accent, opacity: 0.85 }} />
            {lines.map((w, i) => (
              <div key={i} className="h-0.5 rounded-sm mb-0.5" style={{ width: `${w}%`, background: '#CBD5E1' }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Template A: minimal classic single-column
  return (
    <div className="w-full flex flex-col gap-0.5 p-1.5 rounded-md" style={{ background: bg, height: '100%' }}>
      <div className="h-1.5 w-full rounded-sm" style={{ background: meta.accent, opacity: 0.85 }} />
      <div className="h-1 w-2/3 rounded-sm mt-0.5" style={{ background: meta.accent, opacity: 0.5 }} />
      <div className="flex gap-0.5 mt-0.5">
        {[45, 35, 30].map((w, i) => (
          <div key={i} className="h-0.5 rounded-sm" style={{ width: `${w}%`, background: '#94A3B8' }} />
        ))}
      </div>
      <div className="mt-1 h-px w-full" style={{ background: meta.accent, opacity: 0.25 }} />
      {[100, 85, 90, 70, 80, 60, 75, 50].map((w, i) => (
        <div key={i} className="h-0.5 rounded-sm" style={{ width: `${w}%`, background: '#CBD5E1' }} />
      ))}
      <div className="mt-0.5 h-px w-full" style={{ background: meta.accent, opacity: 0.25 }} />
      {[100, 75, 60].map((w, i) => (
        <div key={i} className="h-0.5 rounded-sm" style={{ width: `${w}%`, background: '#CBD5E1' }} />
      ))}
    </div>
  );
};

const ATSMatchBadge: React.FC<{ active: boolean }> = ({ active }) => (
  <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
    style={{ background: active ? '#16a34a15' : '#DC262615', color: active ? '#16a34a' : '#DC2626', whiteSpace: 'nowrap' }}>
    <span style={{
      width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
      background: active ? '#16a34a' : '#DC2626',
      display: 'inline-block',
    }} />
    {active ? 'ATS Matching (Active)' : 'ATS Matching (Inactive)'}
  </span>
);

const ExpandIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onTemplateChange, jd, onJdChange }) => {
  const activeMeta = selectedTemplate ? TEMPLATE_META[selectedTemplate] : null;
  const [expanded, setExpanded] = useState(false);
  const modalRef = useRef<HTMLTextAreaElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [expanded]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (expanded) setTimeout(() => modalRef.current?.focus(), 50);
  }, [expanded]);

  return (
    <div
      className="flex-shrink-0 px-4 sm:px-5 pt-4 sm:pt-5 pb-4 flex flex-col md:flex-row gap-4 md:gap-5"
      style={{ borderBottom: '1px solid var(--color-surface-container)' }}
    >
      {/* Left: Template picker */}
      <div className="flex flex-col flex-shrink-0 md:w-[310px]">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>
            Template
          </span>
          {activeMeta && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${activeMeta.accent}15`, color: activeMeta.accent }}
            >
              {activeMeta.short}
            </span>
          )}
        </div>

        {/* Scrollable thumbnail strip */}
        <div
          className="flex gap-2 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TEMPLATE_OPTIONS.map(opt => {
            const meta = TEMPLATE_META[opt.value] || { accent: '#1E3A5F', short: opt.value, desc: '' };
            const isSelected = selectedTemplate === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                title={opt.label}
                onClick={() => onTemplateChange(opt.value as Template)}
                className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer"
                style={{ width: '64px' }}
              >
                <div
                  className="w-full rounded-lg overflow-hidden transition-all duration-150"
                  style={{
                    border: isSelected ? `2px solid ${meta.accent}` : '2px solid transparent',
                    boxShadow: isSelected ? `0 0 0 3px ${meta.accent}22` : 'none',
                    height: '90px',
                  }}
                >
                  <TemplateThumbnail value={opt.value} selected={isSelected} />
                </div>
                <span
                  className="text-center leading-tight font-medium transition-colors"
                  style={{ fontSize: '10px', color: isSelected ? meta.accent : 'var(--color-outline)' }}
                >
                  {meta.short}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="md:hidden" style={{ height: '1px', background: 'var(--color-surface-container)' }} />
      <div className="hidden md:block" style={{ width: '1px', background: 'var(--color-surface-container)', flexShrink: 0 }} />

      {/* Right: Job Description */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>
            Job Description
          </span>
          <div className="flex items-center gap-2">
            <ATSMatchBadge active={!!jd.trim()} />
            <button
              type="button"
              onClick={() => setExpanded(true)}
              title="Expand editor"
              className="flex items-center justify-center rounded transition-colors"
              style={{ color: 'var(--color-outline)', width: 22, height: 22 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#2563EB')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-outline)')}
            >
              <ExpandIcon />
            </button>
          </div>
        </div>
        <textarea
          value={jd}
          onChange={e => onJdChange(e.target.value)}
          placeholder="Paste the job description here to calculate ATS keyword match score…"
          className="flex-1 resize-none text-xs rounded-lg p-2.5 w-full leading-relaxed"
          style={{
            minHeight: '110px',
            maxHeight: '130px',
            border: '1px solid var(--color-surface-container)',
            background: 'var(--color-surface)',
            color: 'var(--color-on-surface)',
            outline: 'none',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#2563EB')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-surface-container)')}
        />
      </div>

      {/* Expanded JD modal */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setExpanded(false); }}
        >
          <div
            className="flex flex-col rounded-xl shadow-2xl"
            style={{
              width: 'min(720px, 90vw)',
              height: 'min(600px, 85vh)',
              background: 'var(--color-surface-low)',
              border: '1px solid var(--color-surface-container)',
            }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3.5"
              style={{ borderBottom: '1px solid var(--color-surface-container)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                  Job Description
                </span>
                <ATSMatchBadge active={!!jd.trim()} />
              </div>
              <div className="flex items-center gap-3">
                {jd.trim() && (
                  <button
                    type="button"
                    onClick={() => onJdChange('')}
                    className="text-xs font-medium px-2.5 py-1 rounded transition-colors"
                    style={{ color: '#EF4444', border: '1px solid #EF444430' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#EF444410')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="flex items-center justify-center rounded-md transition-colors"
                  style={{ color: 'var(--color-outline)', width: 28, height: 28 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-container)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              ref={modalRef}
              value={jd}
              onChange={e => onJdChange(e.target.value)}
              placeholder="Paste the full job description here…"
              className="flex-1 resize-none text-sm p-5 leading-relaxed rounded-b-xl"
              style={{
                background: 'var(--color-surface)',
                color: 'var(--color-on-surface)',
                border: 'none',
                outline: 'none',
              }}
            />

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-2.5"
              style={{ borderTop: '1px solid var(--color-surface-container)' }}>
              <span className="text-xs" style={{ color: 'var(--color-outline)' }}>
                {jd.trim() ? `${jd.trim().split(/\s+/).length} words` : 'No content'}
              </span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="text-xs font-semibold px-4 py-1.5 rounded-lg text-white transition-opacity"
                style={{ background: '#2563EB' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
