import React from 'react';
import { Certification } from '../../types';
import FormSection from '../FormSection';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface CertificationsSectionProps {
  certifications: Certification[];
  onFieldChange: (path: string, value: any) => void;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications, onFieldChange }) => {

  const handleItemChange = (index: number, field: keyof Certification, value: string | boolean) => {
    onFieldChange(`certifications.${index}.${field}`, value);
  };

  const addItem = () => {
    onFieldChange('certifications', [...certifications, { name: '', issuer: '', issue_date: '' }]);
  };

  const removeItem = (index: number) => {
    onFieldChange('certifications', certifications.filter((_, i) => i !== index));
  };

  return (
    <FormSection title="Certifications" badge={certifications.length || undefined} defaultOpen={false}>
      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Certification {index + 1}</span>
              <button onClick={() => removeItem(index)} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="Certification Name" value={cert.name} onChange={e => handleItemChange(index, 'name', e.target.value)} placeholder="e.g. AWS Solutions Architect" />
              <Input label="Issuing Organization" value={cert.issuer} onChange={e => handleItemChange(index, 'issuer', e.target.value)} placeholder="e.g. Amazon Web Services" />
              <Input label="Issue Date" value={cert.issue_date} onChange={e => handleItemChange(index, 'issue_date', e.target.value)} placeholder="e.g. Mar 2023" />
              <Input label="Expiry Date (optional)" value={cert.expiry_date || ''} onChange={e => handleItemChange(index, 'expiry_date', e.target.value)} placeholder="e.g. Mar 2026" />
              <div className="space-y-1.5">
                <Input label="Credential ID (optional)" value={cert.credential_id || ''} onChange={e => handleItemChange(index, 'credential_id', e.target.value)} placeholder="e.g. ABC123XYZ" />
                {cert.credential_id && (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!cert.show_credential_id}
                      onChange={e => handleItemChange(index, 'show_credential_id', e.target.checked)}
                      className="w-3.5 h-3.5 accent-blue-600"
                    />
                    <span className="text-xs text-slate-500">Show ID in resume</span>
                  </label>
                )}
              </div>
              <div className="space-y-1.5">
                <Input label="Credential URL (optional)" value={cert.credential_url || ''} onChange={e => handleItemChange(index, 'credential_url', e.target.value)} placeholder="https://..." />
                {cert.credential_url && (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!cert.show_credential_url}
                      onChange={e => handleItemChange(index, 'show_credential_url', e.target.checked)}
                      className="w-3.5 h-3.5 accent-blue-600"
                    />
                    <span className="text-xs text-slate-500">Show link in resume</span>
                  </label>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={addItem} variant="primary" className="w-full mt-2">+ Add Certification</Button>
    </FormSection>
  );
};

export default CertificationsSection;
