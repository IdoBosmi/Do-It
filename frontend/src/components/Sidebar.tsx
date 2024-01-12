import { TaskListModel } from '../models/TaskList';

interface SidebarProps {
  taskLists: TaskListModel[]
  onTaskListClick: (taskList: TaskListModel | null) => void
}

const Sidebar = ({ taskLists, onTaskListClick }:SidebarProps) => {
  return (
    <div className="Sidebar">
      <h1>My Task Lists</h1>
      <div className="ListItem" key={"Today"} onClick={()=>onTaskListClick(null)}>
          <span>Today</span>
      </div>
      <div className="ListItem" key={"All"} onClick={()=>onTaskListClick(null)}>
        <span>All</span>
      </div>
      {taskLists.map((list) => (
        <div className="ListItem" key={list._id} onClick={()=>onTaskListClick(list)}>
          <span>{list.title}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
