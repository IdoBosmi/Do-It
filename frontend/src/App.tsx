import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import * as TaskAPI from "./network/tasks_api";
import { TaskModel } from './models/task';


function App() {

  const [tasks, setTasks] = useState<TaskModel[]>([]);

  useEffect(()=>{
    async function loadTasks() {
      try { 
        const tasks = await TaskAPI.fetchTasks();
        setTasks(tasks);
      }
      catch (error){
        console.log(error);  
      }
    }
    loadTasks();
  }, []);


 
  const handleFilter = (filter: string) => {
    // Simulate frontend filtering based on the user's selection
    if (filter === 'Today') {
      const todayTasks = tasks.filter((task) => task);
      //setFilteredTasks(todayTasks);
    } else if (filter === 'Work') {
      const workTasks = tasks.filter((task) => task);
     // setFilteredTasks(workTasks);
    }
    // Add more filter cases as needed
  };
  

  
  return (
    <div className="App">
      <Sidebar onFilter={handleFilter} />
      <TaskList tasks={tasks} />
    </div>
  );
};

export default App;
