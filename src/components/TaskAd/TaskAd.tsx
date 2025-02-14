import React, { useState } from 'react';
import { useAdsgram } from '../../pages/useAdsgram';

interface TaskAdProps {
  blockId: string;
  onTaskComplete?: () => void;
  onTaskError?: (error: any) => void;
  buttonText?: string;
  className?: string;
}

export const TaskAd: React.FC<TaskAdProps> = ({
  blockId,
  onTaskComplete,
  onTaskError,
  buttonText = 'Complete Task',
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showAd = useAdsgram({
    blockId,
    onReward: () => {
      setIsLoading(false);
      onTaskComplete?.();
    },
    onError: (result) => {
      setIsLoading(false);
      setError(result.description);
      onTaskError?.(result);
    },
  });

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await showAd();
    } catch (err) {
      setError('Failed to load task ad');
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading...' : buttonText}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}; 