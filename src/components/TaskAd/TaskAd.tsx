import React, { useEffect, useRef } from 'react';

interface TaskAdProps {
  blockId: string;
  onTaskComplete?: () => void;
  onTaskError?: (error: any) => void;
  reward?: string;
  className?: string;
}

export const TaskAd: React.FC<TaskAdProps> = ({
  blockId,
  onTaskComplete,
  onTaskError,
  reward,
  className,
}) => {
  const taskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create the adsgram-task element
    const taskElement = document.createElement('adsgram-task');
    taskElement.setAttribute('data-block-id', blockId);
    taskElement.setAttribute('data-debug', 'true'); // Remove in production
    taskElement.className = 'task';

    // Create and append slot elements
    const rewardSlot = document.createElement('p');
    rewardSlot.setAttribute('slot', 'reward');
    rewardSlot.className = 'task__reward';
    rewardSlot.textContent = reward || '';
    taskElement.appendChild(rewardSlot);

    const buttonSlot = document.createElement('div');
    buttonSlot.setAttribute('slot', 'button');
    buttonSlot.className = 'task__button';
    buttonSlot.textContent = 'Start';
    taskElement.appendChild(buttonSlot);

    const doneSlot = document.createElement('div');
    doneSlot.setAttribute('slot', 'done');
    doneSlot.className = 'task__button task__button--done';
    doneSlot.textContent = 'Completed';
    taskElement.appendChild(doneSlot);

    // Add event listeners
    taskElement.addEventListener('reward', () => {
      onTaskComplete?.();
    });

    taskElement.addEventListener('onBannerNotFound', () => {
      onTaskError?.({ description: 'No task available' });
    });

    // Store reference and append to container
    if (taskRef.current) {
      taskRef.current.appendChild(taskElement);
    }

    // Cleanup
    return () => {
      taskElement.removeEventListener('reward', () => {});
      taskElement.removeEventListener('onBannerNotFound', () => {});
      if (taskRef.current) {
        taskRef.current.innerHTML = '';
      }
    };
  }, [blockId, reward, onTaskComplete, onTaskError]);

  // Custom styling for the task component
  const taskStyles = `
    .task {
      --adsgram-task-font-size: 16px;
      --adsgram-task-icon-size: 50px;
      --adsgram-task-icon-title-gap: 15px;
      --adsgram-task-icon-border-radius: 8px;
      --adsgram-task-button-width: 60px;
      display: block;
      width: 328px;
      padding: 8px 16px 8px 8px;
      border-radius: 16px;
      background-color: #1d2733;
      font-family: Roboto;
      color: white;
    }

    .task__reward {
      font-size: 14px;
      color: #98d974;
      font-weight: 600;
      margin: 0;
    }

    .task__button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 60px;
      padding: 8px 16px;
      border-radius: 8px;
      background-color: rgba(110, 211, 255, 0.1);
      color: #6ed3ff;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .task__button:hover {
      background-color: rgba(110, 211, 255, 0.2);
    }

    .task__button--done {
      background-color: rgba(76, 175, 80, 0.1);
      color: #4caf50;
    }
  `;

  return (
    <>
      <style>{taskStyles}</style>
      <div ref={taskRef} className={className}>
        {/* AdsGram task will be mounted here */}
      </div>
    </>
  );
}; 