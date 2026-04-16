import React from 'react';
import { Resume } from '../types';
import ContactSection from './sections/ContactSection';
import RoleSection from './sections/RoleSection';
import SummarySection from './sections/SummarySection';
import SkillsSection from './sections/SkillsSection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import ProjectsSection from './sections/ProjectsSection';
import CertificationsSection from './sections/CertificationsSection';
import LanguagesSection from './sections/LanguagesSection';
import AwardsSection from './sections/AwardsSection';

interface ResumeFormProps {
  resumeData: Resume;
  onFieldChange: (path: string, value: any) => void;
  selectedTemplate: string | null;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, onFieldChange, selectedTemplate }) => {
  return (
    <div className="space-y-2 pb-8">
      <div className="mb-5 px-1">
        <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
          Build Your Resume
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-outline)' }}>
          Fill in your details — preview updates field by field.
        </p>
      </div>

      <ContactSection resumeData={resumeData} onFieldChange={onFieldChange} showAvatarUpload={selectedTemplate === 'C' || selectedTemplate === 'D'} />
      <RoleSection resumeData={resumeData} onFieldChange={onFieldChange} />
      <SummarySection resumeData={resumeData} onFieldChange={onFieldChange} />
      <SkillsSection resumeData={resumeData} onFieldChange={onFieldChange} />
      <ExperienceSection workExperience={resumeData.work_experience} onFieldChange={onFieldChange} />
      <ProjectsSection projects={resumeData.projects} onFieldChange={onFieldChange} />
      <CertificationsSection certifications={resumeData.certifications} onFieldChange={onFieldChange} />
      <EducationSection education={resumeData.education} onFieldChange={onFieldChange} />
      <LanguagesSection languages={resumeData.languages} onFieldChange={onFieldChange} />
      <AwardsSection awards={resumeData.awards} onFieldChange={onFieldChange} />
    </div>
  );
};

export default ResumeForm;
