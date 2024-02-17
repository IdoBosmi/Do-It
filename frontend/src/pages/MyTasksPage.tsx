import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import { UserModel } from "../models/user";
import * as TaskAPI from '../network/tasks_api'
import { TaskModel } from "../models/task";
import TaskModal from "../components/TaskModal";
import Sidebar from "../components/Sidebar";
import { TaskListModel } from "../models/TaskList";
import "../styles/taskPage.css"
import NewTaskListModal from "../components/NewTaskListModal";

interface MyTasksPageProps {
    loggedInUser: UserModel | null,
}

const MyTasksPage = ({ loggedInUser }: MyTasksPageProps) => {


    const [taskLists, setTaskLists] = useState<TaskListModel[]>([]);
    const [currentTaskList, setCurrentTaskList] = useState<TaskListModel | null>(null);
    const [isTodayFilterOn, setIsTodayFilterOn] = useState<boolean>(false);
    const [tasks, setTasks] = useState<TaskModel[]>([]);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showTaskListModal, setShowTaskListModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<TaskModel | null>(null);
    const [taskListToEdit, setTaskListToEdit] = useState<TaskListModel | null>(null);
    const [completedTasks, setCompletedTasks] = useState<TaskModel[]>([]);
    const [isCompletedMode, setIsCompletedMode] = useState<boolean>(false);



    useEffect(() => {
        async function loadTaskLists() {
            try {
                const taskLists = await TaskAPI.fetchTaskLists();
                setTaskLists(taskLists);
            }
            catch (error) {
                console.log(error);
            }
        }
        async function loadTasks() {
            try {
                const tasks = await TaskAPI.fetchTasks();
                const sortedTasks = tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
                setTasks(sortedTasks.filter(item=> !item.isCompleted));
                setCompletedTasks(sortedTasks.filter(item=> item.isCompleted))
            }
            catch (error) {
                console.log(error);
            }
        }
        
        if (loggedInUser){
            loadTasks();
            loadTaskLists();
        }

    }, [loggedInUser]);



    const onTaskListClick = (taskList: TaskListModel | null) =>{
        setCurrentTaskList(taskList);
    }

    //Tasks

    const onCreateSuccessful = (createdTask: TaskModel) => {
        setTasks([...tasks, createdTask].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
        setShowTaskModal(false);
    }

    const onUpdateSuccessful = (updatedTask: TaskModel) => {
        if(updatedTask.isCompleted){
            setCompletedTasks(completedTasks.map(item => item._id === updatedTask._id ? updatedTask : item).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
        }
        else {
            setTasks(tasks.map(item => item._id === updatedTask._id ? updatedTask : item).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
        }
        
        setShowTaskModal(false);
        setTaskToEdit(null);
    }

    const onCompleteSuccessful = (updatedTask: TaskModel) => {
        if(updatedTask.isCompleted){
            setCompletedTasks([...completedTasks, updatedTask].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
            setTasks(tasks.filter(item => item._id !== updatedTask._id))
        } else {
            setTasks([...tasks, updatedTask].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
            setCompletedTasks(completedTasks.filter(item => item._id !== updatedTask._id))
        }
    }

    const onDeleteSuccessful = (deletedTask: TaskModel) => {
        if(deletedTask.isCompleted){
            setCompletedTasks(completedTasks.filter(item => item._id !== deletedTask._id))
        } else {
            setTasks(tasks.filter(item => item._id !== deletedTask._id))
        }
        
    }

    const onEditClick = (task: TaskModel) => {
        setTaskToEdit(task);
        setShowTaskModal(true);
    }


    const onCreateSuccessfulTaskList = (createdTaskList: TaskListModel) => {
        setTaskLists([...taskLists, createdTaskList]);
        setShowTaskListModal(false);
    }

    const onUpdateSuccessfulTaskList = (updatedTaskList: TaskListModel) => {
        setTaskLists(taskLists.map(item => item._id === updatedTaskList._id ? updatedTaskList : item));
        setShowTaskListModal(false);
        setTaskListToEdit(null);
    }

    const onDeleteSuccessfulTaskList = (deletedTaskList: TaskListModel) => {
        setTaskLists(taskLists.filter(item => item._id !== deletedTaskList._id))
        setCurrentTaskList(null);
    }

    const onEditClickTaskList = (taskList: TaskListModel) => {
        setTaskListToEdit(taskList);
        setShowTaskListModal(true);
    }

    const onTodayClick = () => {
        setIsTodayFilterOn(!isTodayFilterOn);
    }


    const filterTasks = (tasksToFilter:TaskModel[]): TaskModel[] =>{

        if(isTodayFilterOn) {
            if(currentTaskList){
                return tasksToFilter.filter(item=> item.taskListId === currentTaskList._id && new Date(item.dueDate).toDateString() === new Date().toDateString());
            } else {
                return tasksToFilter.filter(item=> new Date(item.dueDate).toDateString() === new Date().toDateString());
            }
        } else{
            if(currentTaskList){   
                return tasksToFilter.filter(item=> item.taskListId === currentTaskList._id);
            } else {
                return tasksToFilter;
            }
        }
    }


    return (
        <div className="taskPageDiv">
            {loggedInUser
                ? <>
                    <Sidebar
                        taskLists={taskLists}
                        onTaskListClick={onTaskListClick}
                        onAddTaskListClick={()=>setShowTaskListModal(true)}
                        onDeleteSuccessful={onDeleteSuccessfulTaskList}
                        onEditClick={onEditClickTaskList}
                        onTodayClick = {onTodayClick}
                        isTodayFilterOn = {isTodayFilterOn}
                    />
                    <div className="TaskList">
                        <div className='TaskList-Header'>
                            <h1>{currentTaskList ? currentTaskList.title : "All"}</h1>
                        <button onClick={() => setShowTaskModal(true)}>Add Task</button>
                        </div>
                        {!isCompletedMode &&
                        <TaskList
                            title= {currentTaskList ? currentTaskList.title : "All"}
                            tasks={filterTasks(tasks)}
                            onDeleteSuccessful={onDeleteSuccessful}
                            onEditClick={onEditClick}
                            onCompletedSuccessful = {onCompleteSuccessful}
                            onAddTaskClick = {() => setShowTaskModal(true)}
                        />
                        }
                        <div className={isCompletedMode ? "" : "completed-tasks"}>
                            <h4 className="CompletedTaskTitle" onClick={()=>setIsCompletedMode(!isCompletedMode)}>{isCompletedMode ? "Back to tasks" : "See all completed tasks"}</h4>
                            
                            <TaskList
                                title= {currentTaskList ? currentTaskList.title : "All"}
                                tasks={filterTasks(completedTasks)}
                                onDeleteSuccessful={onDeleteSuccessful}
                                onEditClick={onEditClick}
                                onCompletedSuccessful = {onCompleteSuccessful}
                                onAddTaskClick = {() => setShowTaskModal(true)}
                            />
                        </div>
                    </div>
                    
                    {showTaskModal &&
                        <TaskModal
                            currentTaskList={currentTaskList}
                            currentTask={taskToEdit}
                            onDismiss={() => {
                                setShowTaskModal(false);
                                setTaskToEdit(null);
                            }}
                            onUpdateSuccessful={onUpdateSuccessful}
                            onCreateSuccessful={onCreateSuccessful}
                        />
                    }

                    {showTaskListModal &&
                        <NewTaskListModal
                            currentTaskList={taskListToEdit}
                            onDismiss={() => {
                                setShowTaskListModal(false);
                                setTaskListToEdit(null);
                            }}
                            onUpdateSuccessful={onUpdateSuccessfulTaskList}
                            onCreateSuccessful={onCreateSuccessfulTaskList}
                        />
                    }
                </>
                : 
                    <div className="not-logged-in-page">
                        <h1>Welcome to DO IT website!</h1>
                        <h2>Login or signup to start manage your tasks!</h2>
                    </div>

            }

        </div>
    )
}

export default MyTasksPage;