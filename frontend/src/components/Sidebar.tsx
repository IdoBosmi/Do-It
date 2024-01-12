import React from 'react';
import { TaskListModel } from '../models/TaskList';

interface SidebarProps {
  taskLists: TaskListModel[]
  onTaskListClick: (taskList: TaskListModel | null) => void
}

const Sidebar = ({ taskLists, onTaskListClick }:SidebarProps) => {
  return (
    <div className="Sidebar">
      <div className="TaskItem" key={"Today"} onClick={()=>onTaskListClick(null)}>
          <span>Today</span>
      </div>
      <div className="TaskItem" key={"All"} onClick={()=>onTaskListClick(null)}>
        <span>All</span>
      </div>
      {taskLists.map((list) => (
        <div className="TaskItem" key={list._id} onClick={()=>onTaskListClick(list)}>
          <span>{list.title}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
