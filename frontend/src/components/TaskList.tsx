import TaskItem from './TaskItem';
import { TaskModel } from '../models/task';

interface TasksProps {
  tasks:  TaskModel[]
}

const TaskList = ({ tasks }: TasksProps) => {
  return (
    <div className="TaskList">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
