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

  console.log(tasks)
  const onDeleteClick = async (taskToDelete: TaskModel) => {
    await TaskAPI.deleteTask(taskToDelete._id);
    onDeleteSuccessful(taskToDelete)
  }

  const onCompleteClick = async (taskToComplete: TaskModel) =>{
    taskToComplete.isCompleted = !taskToComplete.isCompleted;
    const completedTask = await TaskAPI.updateTask(taskToComplete._id, taskToComplete);
    onCompletedSuccessful(completedTask);
  }

  
  const getDueDateText = (dueDate: Date): string => {
      const currentDate = new Date();
      const taskDate = new Date(dueDate);

      if (taskDate.toDateString() === currentDate.toDateString()) {
          return 'Today';
      } else {
          const tomorrow = new Date();
          tomorrow.setDate(currentDate.getDate() + 1);
          if (taskDate.toDateString() === tomorrow.toDateString()) {
              return 'Tomorrow';
          }
      }

      return taskDate.toLocaleDateString(); // Use default due date format if not today or tomorrow

  }

  return (
      <>
      {tasks.map((task) => {

        let isPastDue = new Date(task.dueDate).getDate() < new Date().getDate();

        return(
        <div className={`TaskItem ${task.isCompleted ? 'completed' : ''} ${isPastDue ? 'past-due' : ''}`} key={task._id}>
          {task.isCompleted ?(
            <MdCheckBox className='task-icons' onClick={() => onCompleteClick(task)} />
          ) : (
            <MdCheckBoxOutlineBlank className='task-icons' onClick={() => onCompleteClick(task)} />
          )
          }
          
          <span>{task.title}</span>
          {!task.isCompleted && <h6 className='due-date'>{getDueDateText(task.dueDate)}</h6>}
          
          
          <FiEdit className='task-icons' onClick={() => onEditClick(task)}/>
          <FaTrashCan className='task-icons' onClick={() => onDeleteClick(task)}/>
        </div>
        )
      
        })}
        </>
  );
};

export default TaskList;
