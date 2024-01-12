import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import { UserModel } from "../models/user";
import * as TaskAPI from '../network/tasks_api'
import { TaskModel } from "../models/task";
import TaskModal from "../components/TaskModal";
import Sidebar from "../components/Sidebar";
import { TaskListModel } from "../models/TaskList";

interface MyTasksPageProps {
    loggedInUser: UserModel | null,
}

const MyTasksPage = ({ loggedInUser }: MyTasksPageProps) => {


    const [taskLists, setTaskLists] = useState<TaskListModel[]>([]);
    const [currentTaskList, setCurrentTaskList] = useState<TaskListModel | null>(null);
    const [tasks, setTasks] = useState<TaskModel[]>([]);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<TaskModel | null>(null);



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
                setTasks(tasks);
            }
            catch (error) {
                console.log(error);
            }
        }
        loadTasks();
        loadTaskLists();
    }, []);



    const onTaskListClick = (taskList: TaskListModel | null) =>{
        setCurrentTaskList(taskList);
    }


    //Tasks

    const onCreateSuccessful = (createdTask: TaskModel) => {
        setTasks([...tasks, createdTask]);
        setShowTaskModal(false);
    }

    const onUpdateSuccessful = (updatedTask: TaskModel) => {
        setTasks(tasks.map(item => item._id === updatedTask._id ? updatedTask : item));
        setShowTaskModal(false);
    }

    const onDeleteSuccessful = (deletedTask: TaskModel) => {
        setTasks(tasks.filter(item => item._id !== deletedTask._id))
    }

    const onEditClick = (task: TaskModel) => {
        setTaskToEdit(task);
        setShowTaskModal(true);
    }

    return (
        <div>
            {loggedInUser
                ? <>
                    <Sidebar taskLists={taskLists} onTaskListClick={onTaskListClick}/>
                    <TaskList
                        title= {currentTaskList ? currentTaskList.title : "All"}
                        tasks={currentTaskList ? tasks.filter(item=> item.taskListId === currentTaskList._id) : tasks}
                        onDeleteSuccessful={onDeleteSuccessful}
                        onEditClick={onEditClick}
                    />
                    <button onClick={() => setShowTaskModal(true)}>Add Task</button>

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
                </>
                : <>
                    <h2>You are not logged in! Login or signup to start doing your tasks!</h2>
                </>

            }

        </div>
    )
}

export default MyTasksPage;