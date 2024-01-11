import { TaskModel } from '../models/task';
import * as TaskAPI from '../network/tasks_api';
import '../styles/taskList.css';

interface TaskListProps {
  tasks: TaskModel[],
  onDeleteSuccessful: (task: TaskModel) => void,
  onEditClick: (task: TaskModel) => void
}


const TaskList = ({ tasks, onDeleteSuccessful, onEditClick }: TaskListProps) => {


  const onDeleteClick = async (taskToDelete: TaskModel) => {
    await TaskAPI.deleteTask(taskToDelete._id);
    onDeleteSuccessful(taskToDelete)
    //setTasks(tasks.filter(item=> item._id !== taskToDelete._id))
  }

  return (
    <div className="TaskList">
      {tasks.map((task) => (
        <div className="TaskItem" key={task._id}>
          <span>{task.title}</span>
          <button onClick={() => onEditClick(task)}>Edit</button>
          <button onClick={() => console.log('Complete task')}>Complete</button>
          <button onClick={() => onDeleteClick(task)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
