import React from 'react';

interface Task {
  id: number;
  title: string;
  // Add other task properties as needed
}

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <div className="TaskItem">
      <span>{task.title}</span>
      <button onClick={() => console.log('Complete task')}>Complete</button>
      <button onClick={() => console.log('Delete task')}>Delete</button>
    </div>
  );
};

export default TaskItem;
