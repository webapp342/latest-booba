import React, { useState, useCallback } from 'react';
import { TaskAd } from './TaskAd';

interface Task {
  id: string;
  blockId: string;
  title: string;
  reward?: string;
}

interface TaskAdManagerProps {
  tasks: Task[];
  onAllTasksComplete?: () => void;
  onTaskComplete?: (taskId: string) => void;
}

export const TaskAdManager: React.FC<TaskAdManagerProps> = ({
  tasks,
  onAllTasksComplete,
  onTaskComplete,
}) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const handleTaskComplete = useCallback((taskId: string) => {
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);
      newSet.add(taskId);
      
      // Check if all tasks are completed
      if (newSet.size === tasks.length) {
        onAllTasksComplete?.();
      }
      
      return newSet;
    });
    
    onTaskComplete?.(taskId);
  }, [tasks.length, onAllTasksComplete, onTaskComplete]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Available Tasks</h2>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="p-4 border rounded-lg bg-white shadow-sm"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">{task.title}</h3>
            {task.reward && (
              <span className="text-green-600 font-medium">{task.reward}</span>
            )}
          </div>
          <TaskAd
            blockId={task.blockId}
            onTaskComplete={() => handleTaskComplete(task.id)}
            buttonText={completedTasks.has(task.id) ? "Completed" : "Start Task"}
            className="mt-2"
          />
          {completedTasks.has(task.id) && (
            <p className="text-green-600 mt-2">✓ Task completed</p>
          )}
        </div>
      ))}
      
      <div className="mt-4">
        <p className="text-gray-600">
          Completed: {completedTasks.size} / {tasks.length} tasks
        </p>
      </div>
    </div>
  );
}; 