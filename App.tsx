import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Resume, Template } from './types';
import { INITIAL_RESUME_DATA, SAMPLE_RESUME_DATA, JOB_FAMILY_TEMPLATE_MAP } from './constants';
import Header from './components/Header';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import TemplateSelector from './components/TemplateSelector';
import { set } from 'lodash-es';
import { exportAsPdf, exportAsDocx, exportAsCsv } from './services/exportService';
import { computeATSScore, computeJDMatchScore } from './services/atsScore';
import DevTools from './components/DevTools';
import { saveResume, loadResume, clearResume, STORAGE_KEY, TEMPLATE_KEY, VIEW_MODE_KEY } from './services/storage';

// Deep merge: user fields override sample; empty user fields fall back to sample
const mergeForPreview = (sample: Resume, user: Resume): Resume => {
  const result: Resume = JSON.parse(JSON.stringify(sample));

  const stringFields = [
    'avatar_url', 'full_name', 'email', 'phone', 'city', 'state_region', 'country',
    'linkedin_url', 'portfolio_url', 'personal_site_url', 'target_role_title',
    'seniority_level', 'job_family', 'summary', 'work_authorization',
    'clearance', 'remote_preference',
  ] as (keyof Resume)[];

  for (const field of stringFields) {
    const val = user[field];
    if (val !== undefined && val !== null && val !== '') {
      (result as any)[field] = val;
    }
  }

  if (user.relocation !== undefined) result.relocation = user.relocation;

  const arrayFields = [
    'skills_core', 'skills_tools', 'skills_soft', 'role_keywords',
    'work_experience', 'education', 'projects', 'certifications',
    'awards', 'publications', 'volunteering', 'languages',
  ] as (keyof Resume)[];

  for (const field of arrayFields) {
    const arr = user[field] as any[];
    if (arr && arr.length > 0) {
      (result as any)[field] = arr;
    }
  }

  return result;
};

const isResumeEmpty = (data: Resume): boolean => {
  return (
    !data.full_name &&
    !data.email &&
    !data.phone &&
    !data.summary &&
    data.work_experience.length === 0 &&
    data.education.length === 0 &&
    data.skills_core.length === 0
  );
};


const App: React.FC = () => {
  const [userResumeData, setUserResumeData] = useState<Resume>(INITIAL_RESUME_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    () => (localStorage.getItem(TEMPLATE_KEY) as Template) || 'A'
  );
  const [viewMode, setViewMode] = useState<'personal' | 'sample'>(
    () => (localStorage.getItem(VIEW_MODE_KEY) as 'personal' | 'sample') || 'personal'
  );

  // Load encrypted resume data on mount
  useEffect(() => {
    loadResume().then(data => {
      if (data) setUserResumeData(data);
    });
  }, []);

  const [jd, setJd] = useState<string>('');

  const hasAnyData = !isResumeEmpty(userResumeData);
  const atsResult = useMemo(() => computeATSScore(userResumeData), [userResumeData]);
  const jdMatchScore = useMemo(
    () => jd.trim() ? computeJDMatchScore(userResumeData, jd) : undefined,
    [userResumeData, jd]
  );

  // Persist encrypted to localStorage on every change
  useEffect(() => {
    saveResume(userResumeData);
  }, [userResumeData]);

  useEffect(() => {
    if (selectedTemplate) localStorage.setItem(TEMPLATE_KEY, selectedTemplate);
    else localStorage.removeItem(TEMPLATE_KEY);
  }, [selectedTemplate]);

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  // Compute preview data based on view mode
  const previewData = useMemo((): Resume | null => {
    if (!selectedTemplate) return null;
    if (viewMode === 'sample') return SAMPLE_RESUME_DATA;
    if (!hasAnyData) return SAMPLE_RESUME_DATA;
    return mergeForPreview(SAMPLE_RESUME_DATA, userResumeData);
  }, [selectedTemplate, hasAnyData, userResumeData, viewMode]);

  const handleFieldChange = useCallback((path: string, value: any) => {
    setUserResumeData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      set(next, path, value);
      // Auto-select template based on job family
      if (path === 'job_family') {
        const mapped = JOB_FAMILY_TEMPLATE_MAP[value as keyof typeof JOB_FAMILY_TEMPLATE_MAP];
        if (mapped && !selectedTemplate) {
          setSelectedTemplate(mapped);
        }
      }
      return next;
    });
  }, [selectedTemplate]);

  const handleTemplateChange = useCallback((t: Template) => {
    setSelectedTemplate(t);
  }, []);

  const handleLoadSample = useCallback(() => {
    // Switch to sample view without touching personal data
    setViewMode('sample');
    const tmpl = JOB_FAMILY_TEMPLATE_MAP[SAMPLE_RESUME_DATA.job_family] || 'A';
    setSelectedTemplate(tmpl as Template);
  }, []);

  const handleSwitchToPersonal = useCallback(() => {
    setViewMode('personal');
  }, []);

  const handleClearData = useCallback(() => {
    setUserResumeData(INITIAL_RESUME_DATA);
    setSelectedTemplate(null);
    setViewMode('personal');
    clearResume();
    localStorage.removeItem(TEMPLATE_KEY);
    localStorage.removeItem(VIEW_MODE_KEY);
  }, []);

  const handleExport = useCallback((format: 'pdf' | 'docx' | 'csv') => {
    // Export user data if they've entered anything; else export sample
    const exportData = hasAnyData ? userResumeData : SAMPLE_RESUME_DATA;
    switch (format) {
      case 'pdf':
        exportAsPdf('resume-preview-container');
        break;
      case 'docx':
        exportAsDocx(exportData);
        break;
      case 'csv':
        exportAsCsv(exportData);
        break;
    }
  }, [hasAnyData, userResumeData]);

  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-surface)' }}>
      <Header
        onLoadSample={handleLoadSample}
        onSwitchToPersonal={handleSwitchToPersonal}
        onClearData={handleClearData}
        onExport={handleExport}
        hasData={hasAnyData}
        viewMode={viewMode}
        atsResult={atsResult}
        jdMatchScore={jdMatchScore}
      />

      {/* Mobile tab bar — hidden on lg+ */}
      <div className="lg:hidden flex no-print" style={{ borderBottom: '1px solid var(--color-surface-container)', background: 'var(--color-surface-low)' }}>
        {(['form', 'preview'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className="flex-1 py-2.5 text-xs font-semibold capitalize transition-colors"
            style={{
              color: mobileTab === tab ? 'var(--color-primary)' : 'var(--color-outline)',
              borderBottom: mobileTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
            }}
          >
            {tab === 'form' ? 'Edit' : 'Preview'}
          </button>
        ))}
      </div>

      <main className="flex-grow flex overflow-hidden">
        {/* Left: Template picker + Form */}
        <div
          className={`${mobileTab === 'form' ? 'flex' : 'hidden'} lg:flex w-full lg:w-[55%] overflow-y-auto flex-col`}
          style={{ background: 'var(--color-surface-low)' }}
        >
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateChange={handleTemplateChange}
            jd={jd}
            onJdChange={setJd}
          />
          <div className="flex-1 px-4 sm:px-5 pb-8 pt-0">
            <ResumeForm resumeData={userResumeData} onFieldChange={handleFieldChange} selectedTemplate={selectedTemplate} />
          </div>
        </div>

        {/* Right: Preview */}
        <div
          className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} flex-col w-full lg:flex lg:flex-col lg:w-[45%] overflow-y-auto p-4 lg:p-5`}
          style={{ background: 'var(--color-surface)' }}
        >
          <ResumePreview
            previewData={previewData}
            selectedTemplate={selectedTemplate}
          />
        </div>
      </main>
      {import.meta.env.DEV && (
        <DevTools
          onRestore={data => {
            setUserResumeData(data);
            // Ensure a template is selected so preview renders
            setSelectedTemplate(prev => {
              if (prev) return prev;
              const mapped = JOB_FAMILY_TEMPLATE_MAP[data.job_family as keyof typeof JOB_FAMILY_TEMPLATE_MAP];
              return (mapped || 'A') as Template;
            });
          }}
        />
      )}
    </div>
  );
};

export default App;
