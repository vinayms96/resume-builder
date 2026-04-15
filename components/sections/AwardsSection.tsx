import React from 'react';
import { Award } from '../../types';
import FormSection from '../FormSection';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface AwardsSectionProps {
  awards: Award[];
  onFieldChange: (path: string, value: any) => void;
}

const AwardsSection: React.FC<AwardsSectionProps> = ({ awards, onFieldChange }) => {

  const handleItemChange = (index: number, field: keyof Award, value: string) => {
    onFieldChange(`awards.${index}.${field}`, value);
  };

  const addItem = () => {
    onFieldChange('awards', [...awards, { name: '', issuer: '', date: '' }]);
  };

  const removeItem = (index: number) => {
    onFieldChange('awards', awards.filter((_, i) => i !== index));
  };

  return (
    <FormSection title="Awards & Honors" badge={awards.length || undefined} defaultOpen={false}>
      <div className="space-y-4">
        {awards.map((award, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Award {index + 1}</span>
              <button onClick={() => removeItem(index)} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Award Name" value={award.name || ''} onChange={e => handleItemChange(index, 'name', e.target.value)} placeholder="e.g. Employee of the Year" />
              <Input label="Issuing Organization" value={award.issuer || ''} onChange={e => handleItemChange(index, 'issuer', e.target.value)} placeholder="e.g. Acme Corp" />
              <Input label="Date" value={award.date || ''} onChange={e => handleItemChange(index, 'date', e.target.value)} placeholder="e.g. Dec 2023" />
              <Input label="Description (optional)" value={award.description || ''} onChange={e => handleItemChange(index, 'description', e.target.value)} placeholder="Brief context or achievement" />
            </div>
          </div>
        ))}
      </div>
      <Button onClick={addItem} variant="primary" className="w-full mt-2">+ Add Award</Button>
    </FormSection>
  );
};

export default AwardsSection;
