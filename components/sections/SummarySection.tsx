import React from 'react';
import { Resume } from '../../types';
import FormSection from '../FormSection';
import Textarea from '../ui/Textarea';

interface SummarySectionProps {
  resumeData: Resume;
  onFieldChange: (path: string, value: any) => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({ resumeData, onFieldChange }) => {
  return (
    <FormSection title="Professional Summary">
      <Textarea
        label="Summary"
        id="summary"
        value={resumeData.summary}
        onChange={e => onFieldChange('summary', e.target.value)}
        placeholder="A brief 2–4 sentence summary highlighting your key skills, experience, and what you bring to the role."
        rows={4}
      />
      <p className="text-xs text-slate-400">
        Tip: Lead with years of experience, top skills, and a measurable achievement.
      </p>
    </FormSection>
  );
};

export default SummarySection;
