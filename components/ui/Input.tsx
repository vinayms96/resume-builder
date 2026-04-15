import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id}
          className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
          style={{ color: 'var(--color-on-surface-muted)' }}>
          {label}
        </label>
      )}
      <input id={id} {...props} className="input-editorial" />
    </div>
  );
};

export default Input;
