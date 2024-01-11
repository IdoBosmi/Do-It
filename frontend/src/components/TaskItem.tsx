import React from 'react';
import { TaskModel } from '../models/task';

interface TaskItemProps {
  task: TaskModel;
}

const TaskItem= ({ task } : TaskItemProps) => {
  return (
    <div className="TaskItem">
      <span>{task.title}</span>
      <button onClick={() => console.log('Complete task')}>Complete</button>
      <button onClick={() => console.log('Delete task')}>Delete</button>
    </div>
  );
};

export default TaskItem;
