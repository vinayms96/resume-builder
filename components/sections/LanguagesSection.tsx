import React from 'react';
import { Language } from '../../types';
import { LANGUAGE_PROFICIENCY } from '../../constants';
import FormSection from '../FormSection';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface LanguagesSectionProps {
  languages: Language[];
  onFieldChange: (path: string, value: any) => void;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages, onFieldChange }) => {

  const handleItemChange = (index: number, field: keyof Language, value: string) => {
    onFieldChange(`languages.${index}.${field}`, value);
  };

  const addItem = () => {
    onFieldChange('languages', [...languages, { language: '', proficiency: 'Professional' }]);
  };

  const removeItem = (index: number) => {
    onFieldChange('languages', languages.filter((_, i) => i !== index));
  };

  return (
    <FormSection title="Languages" badge={languages.length || undefined} defaultOpen={false}>
      <div className="space-y-3">
        {languages.map((lang, index) => (
          <div key={index} className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label={index === 0 ? 'Language' : ''}
                value={lang.language}
                onChange={e => handleItemChange(index, 'language', e.target.value)}
                placeholder="e.g. English"
              />
            </div>
            <div className="flex-1">
              <Select
                label={index === 0 ? 'Proficiency' : ''}
                options={LANGUAGE_PROFICIENCY}
                value={lang.proficiency || 'Professional'}
                onChange={e => handleItemChange(index, 'proficiency', e.target.value)}
              />
            </div>
            <button
              onClick={() => removeItem(index)}
              className="mb-1 text-slate-400 hover:text-red-500 p-1 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <Button onClick={addItem} variant="primary" className="w-full mt-2">+ Add Language</Button>
    </FormSection>
  );
};

export default LanguagesSection;
