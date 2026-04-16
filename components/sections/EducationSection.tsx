import React from 'react';
import { Education } from '../../types';
import FormSection from '../FormSection';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface EducationSectionProps {
  education: Education[];
  onFieldChange: (path: string, value: any) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({ education, onFieldChange }) => {

  const handleItemChange = (index: number, field: keyof Education, value: string) => {
    onFieldChange(`education.${index}.${field}`, value);
  };

  const addItem = () => {
    onFieldChange('education', [...education, { degree: '', institution: '' }]);
  };

  const removeItem = (index: number) => {
    onFieldChange('education', education.filter((_, i) => i !== index));
  };

  return (
    <FormSection title="Education" badge={education.length || undefined} defaultOpen={false}>
      <div className="space-y-4">
        {education.map((item, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50 relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Entry {index + 1}</span>
              <button onClick={() => removeItem(index)} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Degree" value={item.degree} onChange={e => handleItemChange(index, 'degree', e.target.value)} placeholder="e.g. B.Tech, MBA" />
              <Input label="Discipline / Major" value={item.discipline || ''} onChange={e => handleItemChange(index, 'discipline', e.target.value)} placeholder="e.g. Computer Science" />
              <Input label="Institution" value={item.institution || ''} onChange={e => handleItemChange(index, 'institution', e.target.value)} placeholder="e.g. IIT Bombay" />
              <Input label="Graduation Date" value={item.graduation_date || ''} onChange={e => handleItemChange(index, 'graduation_date', e.target.value)} placeholder="e.g. May 2022" />
              <Input label="GPA (optional)" value={item.gpa || ''} onChange={e => handleItemChange(index, 'gpa', e.target.value)} placeholder="e.g. 8.5/10" />
            </div>
          </div>
        ))}
      </div>
      <Button onClick={addItem} variant="primary" className="w-full mt-2">+ Add Education</Button>
    </FormSection>
  );
};

export default EducationSection;
