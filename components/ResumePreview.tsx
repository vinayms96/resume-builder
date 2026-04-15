import React, { useLayoutEffect, useRef, useState } from 'react';
import { Resume, Template } from '../types';
import TemplateA from './preview_templates/TemplateA';
import TemplateB from './preview_templates/TemplateB';
import TemplateC from './preview_templates/TemplateC';

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const A4_PADDING_PX = 56;

interface ResumePreviewProps {
  previewData: Resume | null;
  selectedTemplate: Template | null;
}

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[70vh] text-center px-8">
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
      style={{ background: 'var(--color-surface-container)' }}
    >
      <svg className="w-7 h-7" style={{ color: 'var(--color-outline)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-on-surface)' }}>
      No template selected
    </p>
    <p className="text-xs leading-relaxed max-w-xs" style={{ color: 'var(--color-outline)' }}>
      Pick a template on the left — sample data will appear until you fill in your details.
    </p>
  </div>
);

const renderTemplate = (template: Template, data: Resume) => {
  switch (template) {
    case 'B': return <TemplateB data={data} />;
    case 'C': return <TemplateC data={data} />;
    case 'A':
    default:  return <TemplateA data={data} />;
  }
};

const ResumePreview: React.FC<ResumePreviewProps> = ({ previewData, selectedTemplate }) => {
  const [scale, setScale] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / A4_WIDTH_PX));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scaledHeight = A4_HEIGHT_PX * scale;

  return (
    <div className="flex-1 overflow-y-auto h-full" ref={panelRef}>
      {!selectedTemplate || !previewData ? (
        <EmptyState />
      ) : (
        <div style={{ height: `${scaledHeight}px`, position: 'relative' }}>
          <div
            style={{
              width: `${A4_WIDTH_PX}px`,
              minHeight: `${A4_HEIGHT_PX}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 32px rgba(2,36,72,0.10), 0 1px 4px rgba(2,36,72,0.06)',
              borderRadius: '2px',
            }}
          >
            <div
              id="resume-preview-container"
              style={{
                padding: `${A4_PADDING_PX}px`,
                minHeight: `${A4_HEIGHT_PX}px`,
                backgroundColor: '#ffffff',
              }}
            >
              {renderTemplate(selectedTemplate, previewData)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
