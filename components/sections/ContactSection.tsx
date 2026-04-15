import React, { useRef } from 'react';
import { Resume } from '../../types';
import FormSection from '../FormSection';
import Input from '../ui/Input';

interface ContactSectionProps {
  resumeData: Resume;
  onFieldChange: (path: string, value: any) => void;
  showAvatarUpload?: boolean;
}

// Limits
const MAX_FILE_SIZE_MB = 2;
const MAX_DIMENSION    = 220;   // resize canvas to this max width/height
const ALLOWED_TYPES    = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXT      = '.jpg, .jpeg, .png, .webp';

function resizeToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
      const w = Math.round(img.width  * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
}

const ContactSection: React.FC<ContactSectionProps> = ({ resumeData, onFieldChange, showAvatarUpload = false }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert(`Unsupported file type. Please upload: ${ALLOWED_EXT}`);
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    try {
      const base64 = await resizeToBase64(file);
      onFieldChange('avatar_url', base64);
    } catch {
      alert('Failed to process image. Please try another file.');
    }
    // Reset input so same file can be re-uploaded
    e.target.value = '';
  };

  return (
    <FormSection title="Contact Information">

      {/* Avatar upload — shown only when Modern Pro template is selected */}
      {showAvatarUpload && (
        <>
          <div className="flex items-center gap-4 mb-2">
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center cursor-pointer transition-all group"
                style={{ background: '#F1F5F9', border: '2px dashed #CBD5E1' }}
                title="Upload profile photo"
              >
                {resumeData.avatar_url ? (
                  <img src={resumeData.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="#94A3B8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 4v16m8-8H4" />
                  </svg>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.4)' }}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </button>

              {/* Remove button */}
              {resumeData.avatar_url && (
                <button
                  type="button"
                  onClick={() => onFieldChange('avatar_url', '')}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ background: '#EF4444', color: 'white', fontSize: '10px', lineHeight: 1 }}
                  title="Remove photo"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>
                Profile Photo
              </span>
              <span className="text-xs" style={{ color: 'var(--color-outline)' }}>
                Only for Modern Pro template
              </span>
              <span className="text-xs" style={{ color: 'var(--color-outline)' }}>
                JPG, PNG, WebP · max {MAX_FILE_SIZE_MB}MB
              </span>
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept={ALLOWED_EXT}
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}

      <Input
        label="Full Name"
        id="full_name"
        value={resumeData.full_name}
        onChange={e => onFieldChange('full_name', e.target.value)}
        placeholder="e.g. Jane Smith"
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Email" id="email" type="email" value={resumeData.email} onChange={e => onFieldChange('email', e.target.value)} placeholder="jane@example.com" required />
        <Input label="Phone" id="phone" value={resumeData.phone} onChange={e => onFieldChange('phone', e.target.value)} placeholder="+91 98765 43210" required />
        <Input label="City" id="city" value={resumeData.city || ''} onChange={e => onFieldChange('city', e.target.value)} placeholder="e.g. Bengaluru" />
        <Input label="Country" id="country" value={resumeData.country} onChange={e => onFieldChange('country', e.target.value)} placeholder="e.g. India" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="LinkedIn URL" id="linkedin_url" value={resumeData.linkedin_url || ''} onChange={e => onFieldChange('linkedin_url', e.target.value)} placeholder="linkedin.com/in/janesmith" />
        <Input label="Portfolio / GitHub URL" id="portfolio_url" value={resumeData.portfolio_url || ''} onChange={e => onFieldChange('portfolio_url', e.target.value)} placeholder="github.com/janesmith" />
      </div>
    </FormSection>
  );
};

export default ContactSection;
