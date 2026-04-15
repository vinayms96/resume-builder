import React from 'react';
import { Resume } from '../../types';
import FormSection from '../FormSection';

interface SkillsSectionProps {
  resumeData: Resume;
  onFieldChange: (path: string, value: any) => void;
}

interface TagInputProps {
  label: string;
  description?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ label, description, values, onChange, placeholder }) => {
  const [inputValue, setInputValue] = React.useState('');

  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) addTag(inputValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const items = pasted.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
    const newValues = [...values];
    for (const item of items) {
      if (!newValues.includes(item)) newValues.push(item);
    }
    onChange(newValues);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      {description && <p className="text-xs text-slate-400 mb-1.5">{description}</p>}
      <div className="min-h-10 flex flex-wrap gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent cursor-text"
        onClick={(e) => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}
      >
        {values.map((tag, i) => (
          <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium">
            {tag}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="text-indigo-400 hover:text-indigo-600 leading-none"
            >×</button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder={values.length === 0 ? placeholder : ''}
          className="flex-1 min-w-24 border-0 outline-none text-sm text-slate-800 placeholder-slate-400 bg-transparent p-0"
        />
      </div>
      <p className="text-xs text-slate-400 mt-1">Press Enter or comma to add. Paste a list to bulk add.</p>
    </div>
  );
};

const SkillsSection: React.FC<SkillsSectionProps> = ({ resumeData, onFieldChange }) => {
  const totalSkills = resumeData.skills_core.length + resumeData.skills_tools.length + resumeData.skills_soft.length;

  return (
    <FormSection title="Skills" badge={totalSkills || undefined}>
      <TagInput
        label="Core Skills"
        description="Programming languages, frameworks, and primary technical skills"
        values={resumeData.skills_core}
        onChange={v => onFieldChange('skills_core', v)}
        placeholder="e.g. JavaScript, Python, React…"
      />
      <TagInput
        label="Tools & Technologies"
        description="Platforms, tools, cloud services, databases"
        values={resumeData.skills_tools}
        onChange={v => onFieldChange('skills_tools', v)}
        placeholder="e.g. AWS, Docker, Jenkins, Postgres…"
      />
      <TagInput
        label="Soft Skills"
        description="Leadership, communication, and interpersonal strengths"
        values={resumeData.skills_soft}
        onChange={v => onFieldChange('skills_soft', v)}
        placeholder="e.g. Agile, Team Leadership…"
      />
    </FormSection>
  );
};

export default SkillsSection;
