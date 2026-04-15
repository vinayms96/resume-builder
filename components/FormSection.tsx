import React, { ReactNode, useState } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
  icon?: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, defaultOpen = true, badge, icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-150"
      style={{
        background: isOpen ? '#FFFFFF' : 'transparent',
        boxShadow: isOpen ? '0 1px 4px rgba(2,36,72,0.06)' : 'none',
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left group cursor-pointer"
        style={{ borderRadius: isOpen ? '0.75rem 0.75rem 0 0' : '0.75rem' }}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span
              className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ background: 'var(--color-surface-low)', color: 'var(--color-primary)' }}
            >
              {icon}
            </span>
          )}
          <span className="text-sm font-semibold" style={{ color: 'var(--color-on-surface)' }}>
            {title}
          </span>
          {badge !== undefined && badge !== 0 && (
            <span
              className="px-2 py-0.5 text-xs font-semibold rounded-full"
              style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB' }}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Plus/minus style from Icon Accordion inspiration */}
        <div
          className="w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-200"
          style={{
            background: isOpen ? 'rgba(37,99,235,0.1)' : 'var(--color-surface-high)',
            color: isOpen ? '#2563EB' : 'var(--color-outline)',
          }}
        >
          <svg
            className="w-3.5 h-3.5 transition-transform duration-200"
            style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </button>

      {/* CSS grid accordion — no layout jump */}
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <div className="accordion-inner">
          <div className="px-5 pb-5 pt-1 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSection;
