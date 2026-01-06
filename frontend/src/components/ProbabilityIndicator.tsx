import React from 'react';

interface ProbabilityIndicatorProps {
  probability: number;
  threshold?: number;
  size?: 'sm' | 'md' | 'lg';
}

const ProbabilityIndicator: React.FC<ProbabilityIndicatorProps> = ({
  probability,
  threshold = 0.8,
  size = 'md',
}) => {
  const percentage = Math.round(probability * 100);
  const meetsThreshold = probability >= threshold;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const getColorClasses = () => {
    if (meetsThreshold) {
      return 'bg-secondary text-white';
    } else if (probability >= 0.6) {
      return 'bg-accent text-white';
    } else {
      return 'bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${getColorClasses()}`}
      title={`${percentage}% success probability`}
    >
      <span className="font-mono">{percentage}%</span>
      {meetsThreshold && (
        <span className="ml-1.5 text-xs">✓</span>
      )}
    </div>
  );
};

export default ProbabilityIndicator;

