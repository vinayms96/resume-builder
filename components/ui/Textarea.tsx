import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id}
          className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
          style={{ color: 'var(--color-on-surface-muted)' }}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        {...props}
        rows={props.rows || 4}
        className="input-editorial resize-none"
        style={{ paddingTop: '8px', paddingBottom: '8px' }}
      />
    </div>
  );
};

export default Textarea;
