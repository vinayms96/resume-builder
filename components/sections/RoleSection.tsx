
import React from 'react';
import { Resume } from '../../types';
import { SENIORITY_LEVELS, JOB_FAMILIES, TARGET_ROLE_SUGGESTIONS } from '../../constants';
import FormSection from '../FormSection';
import DatalistInput from '../ui/DatalistInput';
import Select from '../ui/Select';

interface RoleSectionProps {
  resumeData: Resume;
  onFieldChange: (path: string, value: any) => void;
}

const RoleSection: React.FC<RoleSectionProps> = ({ resumeData, onFieldChange }) => {
  const roleSuggestions = [...(TARGET_ROLE_SUGGESTIONS[resumeData.job_family] || []), 'Other'];

  return (
    <FormSection title="Target Role">
        <DatalistInput 
          label="Target Role Title" 
          id="target_role_title" 
          value={resumeData.target_role_title} 
          onChange={(e) => onFieldChange('target_role_title', e.target.value)} 
          options={roleSuggestions}
          required 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Seniority Level" id="seniority_level" options={SENIORITY_LEVELS} value={resumeData.seniority_level || ''} onChange={(e) => onFieldChange('seniority_level', e.target.value)} />
            <Select label="Job Family" id="job_family" options={JOB_FAMILIES} value={resumeData.job_family} onChange={(e) => onFieldChange('job_family', e.target.value)} required />
        </div>
    </FormSection>
  );
};

export default RoleSection;