import React from 'react';

export const RepeatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662a4.006 4.006 0 0 0 3.7 3.7c1.21.092 2.43.138 3.662.138 1.232 0 2.453-.046 3.662-.138a4.006 4.006 0 0 0 3.7-3.7Zm-15.75 0c0 .065.003.129.008.193m15.734-.193a2.25 2.25 0 0 1-.008.193M9 12h6M6.75 16.5l-3-3m0 0l3-3m-3 3h16.5M17.25 7.5l3 3m0 0l-3 3m3-3H3.75" />
  </svg>
);