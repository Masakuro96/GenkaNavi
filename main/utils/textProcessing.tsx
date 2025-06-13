
import React from 'react';

interface HighlightKeywordsProps {
  text: string;
}

export const HighlightKeywords: React.FC<HighlightKeywordsProps> = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g); // Split by **keyword** pattern, keeping the delimiters
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Remove the asterisks and apply bold styling
          return <strong key={index} className="font-semibold text-sky-700">{part.slice(2, -2)}</strong>;
        }
        // Return normal text part
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
};
