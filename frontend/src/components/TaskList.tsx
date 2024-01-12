import { TaskModel } from '../models/task';
import * as TaskAPI from '../network/tasks_api';

interface TaskListProps {
  title: string,
  tasks: TaskModel[],
  onDeleteSuccessful: (task: TaskModel) => void,
  onEditClick: (task: TaskModel) => void,
  onAddTaskClick: ()=>void
}


const TaskList = ({ tasks, onDeleteSuccessful, onEditClick, title, onAddTaskClick }: TaskListProps) => {


  const onDeleteClick = async (taskToDelete: TaskModel) => {
    await TaskAPI.deleteTask(taskToDelete._id);
    onDeleteSuccessful(taskToDelete)
    //setTasks(tasks.filter(item=> item._id !== taskToDelete._id))
  }

  return (
    <div className="TaskList">
      <div className='TaskList-Header'>
        <h1>{title}</h1>
        <button onClick={onAddTaskClick}>Add Task</button>
      </div>
      {tasks.map((task) => (
        <div className="TaskItem" key={task._id}>
          <span>{task.title}</span>
          <button className='edit' onClick={() => onEditClick(task)}>Edit</button>
          <button className='complete' onClick={() => console.log('Complete task')}>Complete</button>
          <button className='delete' onClick={() => onDeleteClick(task)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
