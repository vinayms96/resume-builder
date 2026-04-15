import React from 'react';
import { Project } from '../../types';
import FormSection from '../FormSection';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ProjectsSectionProps {
  projects: Project[];
  onFieldChange: (path: string, value: any) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, onFieldChange }) => {

  const handleItemChange = (index: number, field: keyof Project, value: string) => {
    onFieldChange(`projects.${index}.${field}`, value);
  };

  const handleDescChange = (itemIndex: number, descIndex: number, value: string) => {
    onFieldChange(`projects.${itemIndex}.description.${descIndex}`, value);
  };

  const addDesc = (itemIndex: number) => {
    const newDesc = [...(projects[itemIndex].description || []), ''];
    onFieldChange(`projects.${itemIndex}.description`, newDesc);
  };

  const removeDesc = (itemIndex: number, descIndex: number) => {
    const newDesc = (projects[itemIndex].description || []).filter((_, i) => i !== descIndex);
    onFieldChange(`projects.${itemIndex}.description`, newDesc);
  };

  const handleTechChange = (index: number, value: string) => {
    onFieldChange(`projects.${index}.tech_stack`, value.split(',').map(s => s.trim()).filter(Boolean));
  };

  const addItem = () => {
    onFieldChange('projects', [...projects, { name: '', description: [''] }]);
  };

  const removeItem = (index: number) => {
    onFieldChange('projects', projects.filter((_, i) => i !== index));
  };

  return (
    <FormSection title="Projects" badge={projects.length || undefined} defaultOpen={false}>
      <div className="space-y-4">
        {projects.map((proj, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Project {index + 1}</span>
              <button onClick={() => removeItem(index)} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
            </div>
            <Input label="Project Name" value={proj.name} onChange={e => handleItemChange(index, 'name', e.target.value)} placeholder="e.g. E-commerce Platform" />
            <Input label="Project URL / GitHub" value={proj.link || ''} onChange={e => handleItemChange(index, 'link', e.target.value)} placeholder="https://github.com/..." />
            <Input label="Tech Stack (comma-separated)" value={(proj.tech_stack || []).join(', ')} onChange={e => handleTechChange(index, e.target.value)} placeholder="e.g. React, Node.js, PostgreSQL" />
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Description Points</label>
              <div className="space-y-2">
                {(proj.description || []).map((desc, descIndex) => (
                  <div key={descIndex} className="flex gap-2 items-start">
                    <input
                      type="text"
                      value={desc}
                      onChange={e => handleDescChange(index, descIndex, e.target.value)}
                      className="flex-1 text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400"
                      placeholder="Describe what you built or achieved…"
                    />
                    <button onClick={() => removeDesc(index, descIndex)} className="text-slate-400 hover:text-red-500 p-1 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => addDesc(index)} className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add point
              </button>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={addItem} variant="primary" className="w-full mt-2">+ Add Project</Button>
    </FormSection>
  );
};

export default ProjectsSection;
