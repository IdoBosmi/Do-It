import { FiEdit } from 'react-icons/fi';
import { TaskListModel } from '../models/TaskList';
import { FaTrashCan } from 'react-icons/fa6';
import * as TaskAPI from '../network/tasks_api';
import { useState } from 'react';

interface SidebarProps {
  taskLists: TaskListModel[]
  onTaskListClick: (taskList: TaskListModel | null) => void
  onAddTaskListClick: () => void
  onDeleteSuccessful: (taskList:TaskListModel) => void
  onEditClick:(taskList:TaskListModel) => void
  onCompletedSuccessful: (taskList:TaskListModel) => void
}

const Sidebar = ({ taskLists, onTaskListClick, onAddTaskListClick, onDeleteSuccessful, onEditClick, onCompletedSuccessful }:SidebarProps) => {


  const [editMode, setEditMode] = useState<boolean>(false);

  const onDeleteClick = async (taskListToDelete: TaskListModel) => {
    await TaskAPI.deleteTaskList(taskListToDelete._id);
    onDeleteSuccessful(taskListToDelete)
  }

  return (
    <div className="Sidebar">
      <div className='SideBar-Header'>
        <h1>My Task Lists</h1>
        <button onClick={onAddTaskListClick}>Add List</button>
        <button onClick={()=>setEditMode(!editMode)}>{editMode ? "Done" : "Edit lists"}</button>
      </div>
      
      <div className="ListItem" key={"Today"} onClick={()=>onTaskListClick(null)}>
          <span>Today</span>
      </div>
      <div className="ListItem" key={"All"} onClick={()=>onTaskListClick(null)}>
        <span>All</span>
      </div>
      {taskLists.map((list) => (
        <div className="ListItem" key={list._id} onClick={()=>onTaskListClick(list)}>
          <span>{list.title}</span>
          { editMode && 
          <>
          <FiEdit className='task-icons' onClick={() => onEditClick(list)}/>
          <FaTrashCan className='task-icons' onClick={() => onDeleteClick(list)}/>
          </>}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
