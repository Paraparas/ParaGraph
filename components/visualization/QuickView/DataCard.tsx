'use client';

import React from 'react';

interface DataCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DataCard: React.FC<DataCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-slate-800 rounded-lg p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default DataCard;