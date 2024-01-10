import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import './App.css';

interface Task {
  id: number;
  title: string;
  // Add other task properties as needed
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([
    {
      id:1,
      title: "Do fvsdjbvjsdbvjkdsb"
    },
    {
      id:3,
      title: "Do launddsadsaet"
    }
  ]);


  /*
  useEffect(() => {
    // Simulate fetching tasks from the backend
    axios.get<Task[]>('http://localhost:3001/tasks') // Replace with your actual backend URL
      .then((response) => {
        setTasks(response.data);
        setFilteredTasks(response.data);
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);


  */
  const handleFilter = (filter: string) => {
    // Simulate frontend filtering based on the user's selection
    if (filter === 'Today') {
      const todayTasks = tasks.filter((task) => task);
      setFilteredTasks(todayTasks);
    } else if (filter === 'Work') {
      const workTasks = tasks.filter((task) => task);
      setFilteredTasks(workTasks);
    }
    // Add more filter cases as needed
  };

  
  return (
    <div className="App">
      <Sidebar onFilter={handleFilter} />
      <TaskList tasks={filteredTasks} />
    </div>
  );
};

export default App;
