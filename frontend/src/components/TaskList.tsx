import { TaskModel } from '../models/task';
import * as TaskAPI from '../network/tasks_api';
import { MdCheckBox , MdCheckBoxOutlineBlank  } from 'react-icons/md';
import { FaTrashCan } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";

interface TaskListProps {
  title: string,
  tasks: TaskModel[],
  onDeleteSuccessful: (task: TaskModel) => void,
  onEditClick: (task: TaskModel) => void,
  onAddTaskClick: ()=>void,
  onCompletedSuccessful: (task: TaskModel) => void
}


const TaskList = ({ tasks, onDeleteSuccessful, onEditClick, title, onAddTaskClick, onCompletedSuccessful}: TaskListProps) => {


  const onDeleteClick = async (taskToDelete: TaskModel) => {
    await TaskAPI.deleteTask(taskToDelete._id);
    onDeleteSuccessful(taskToDelete)
  }

  const onCompleteClick = async (taskToComplete: TaskModel) =>{
    taskToComplete.isCompleted = !taskToComplete.isCompleted;
    const completedTask = await TaskAPI.updateTask(taskToComplete._id, taskToComplete);
    onCompletedSuccessful(completedTask);
  }

  return (
    <div className="TaskList">
      <div className='TaskList-Header'>
        <h1>{title}</h1>
        <button onClick={onAddTaskClick}>Add Task</button>
      </div>
      {tasks.map((task) => (
        <div className={`TaskItem ${task.isCompleted ? 'completed' : ''}`} key={task._id}>
          {task.isCompleted ?(
            <MdCheckBox className='task-icons' onClick={() => onCompleteClick(task)} />
          ) : (
            <MdCheckBoxOutlineBlank className='task-icons' onClick={() => onCompleteClick(task)} />
          )
          }

          <span>{task.title}</span>
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          
          <FiEdit className='task-icons' onClick={() => onEditClick(task)}/>
          <FaTrashCan className='task-icons' onClick={() => onDeleteClick(task)}/>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
