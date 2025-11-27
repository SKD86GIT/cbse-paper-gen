import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface Props {
  text: string;
}

const MathText: React.FC<Props> = ({ text }) => {
  if (!text) return null;
  const parts = text.split('$');
  
  return (
    <span>
      {parts.map((part, index) => {
        // Odd numbers (1, 3, 5) are inside $ signs -> Render as Math
        if (index % 2 === 1) {
          return <InlineMath key={index}>{part}</InlineMath>;
        }
        // Even numbers are text
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default MathText;