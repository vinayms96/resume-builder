import React from 'react';
import { WorkItem } from '../../types';
import FormSection from '../FormSection';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ExperienceSectionProps {
  workExperience: WorkItem[];
  onFieldChange: (path: string, value: any) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ workExperience, onFieldChange }) => {

  const handleItemChange = (index: number, field: keyof WorkItem, value: string) => {
    onFieldChange(`work_experience.${index}.${field}`, value);
  };

  const handleAchievementsTextChange = (itemIndex: number, value: string) => {
    onFieldChange(`work_experience.${itemIndex}.achievements`, value.split('\n'));
  };

  const addItem = () => {
    const newItem: WorkItem = { title: '', employer: '', start_date: '', achievements: [''] };
    onFieldChange('work_experience', [...workExperience, newItem]);
  };

  const removeItem = (index: number) => {
    onFieldChange('work_experience', workExperience.filter((_, i) => i !== index));
  };

  const handleTechStackChange = (index: number, value: string) => {
    const arr = value.split(',').map(s => s.trim()).filter(Boolean);
    onFieldChange(`work_experience.${index}.tech_stack`, arr);
  };

  return (
    <FormSection title="Work Experience" badge={workExperience.length || undefined}>
      <div className="space-y-5">
        {workExperience.map((item, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3 relative bg-slate-50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Position {index + 1}
              </span>
              <button
                onClick={() => removeItem(index)}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Job Title" value={item.title} onChange={e => handleItemChange(index, 'title', e.target.value)} placeholder="e.g. Senior Engineer" />
              <Input label="Employer" value={item.employer} onChange={e => handleItemChange(index, 'employer', e.target.value)} placeholder="e.g. Acme Corp" />
              <Input label="Location" value={item.location || ''} onChange={e => handleItemChange(index, 'location', e.target.value)} placeholder="e.g. Bengaluru, India" />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Start Date" value={item.start_date} onChange={e => handleItemChange(index, 'start_date', e.target.value)} placeholder="Jan 2021" />
                <Input label="End Date" value={item.end_date || ''} onChange={e => handleItemChange(index, 'end_date', e.target.value)} placeholder="Present" />
              </div>
            </div>
            <Input
              label="Tech Stack (comma-separated)"
              value={(item.tech_stack || []).join(', ')}
              onChange={e => handleTechStackChange(index, e.target.value)}
              placeholder="e.g. React, TypeScript, AWS"
            />
            {/* Achievements */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-600">
                  Description / Achievements
                </label>
                {(item.achievements || []).some(a => a.trim()) && (
                  <button
                    type="button"
                    onClick={() => onFieldChange(`work_experience.${index}.achievements`, [])}
                    className="text-xs text-red-400 hover:text-red-600 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-2">
                Lines starting with •, -, * render as bullet points. All other lines render as paragraphs.
              </p>
              <textarea
                value={(item.achievements || []).join('\n')}
                onChange={e => handleAchievementsTextChange(index, e.target.value)}
                rows={6}
                className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y text-slate-800 placeholder-slate-400"
                placeholder={"Leading quality engineering for EdTech products used by K-12 schools globally.\n\n• Built and maintained a Cypress-based E2E automation suite.\n• Established CI/CD pipelines for faster feedback cycles."}
              />
            </div>
          </div>
        ))}
      </div>
      <Button onClick={addItem} variant="primary" className="w-full mt-2">
        + Add Work Experience
      </Button>
    </FormSection>
  );
};

export default ExperienceSection;
