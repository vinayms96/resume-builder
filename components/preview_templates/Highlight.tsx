import React from 'react';

// Kept for future use — currently templates render data directly without highlight overlay
// This component can be re-enabled to visually distinguish sample data from user data
interface HighlightProps {
  children: React.ReactNode;
  className?: string;
}

const Highlight: React.FC<HighlightProps> = ({ children, className }) => {
  if (!children) return null;
  return <span className={className}>{children}</span>;
};

export default Highlight;
