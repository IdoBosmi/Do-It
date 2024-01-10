import React from 'react';
import TaskItem from './TaskItem';

interface Task {
  id: number;
  title: string;
  // Add other task properties as needed
}

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="TaskList">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
