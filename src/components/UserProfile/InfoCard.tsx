import React from 'react';

interface InfoCardProps {
  label: string;
  value: string | number | boolean | null | undefined;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value, className = '' }) => {
  const renderValue = () => {
    if (typeof value === 'boolean') {
      return (
        <span className={`font-medium ${value ? 'text-green-600' : 'text-gray-600'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      );
    }
    return <span className="text-gray-800">{value || 'N/A'}</span>;
  };

  return (
    <div className={`flex flex-col p-4 bg-gray-50 rounded-lg ${className}`}>
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      {renderValue()}
    </div>
  );
};

export default InfoCard;
