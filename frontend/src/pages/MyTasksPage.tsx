import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import { UserModel } from "../models/user";
import * as TaskAPI from '../network/tasks_api'
import { TaskModel } from "../models/task";
import TaskModal from "../components/TaskModal";

interface MyTasksPageProps {
    loggedInUser: UserModel | null,
}

const MyTasksPage = ({ loggedInUser }: MyTasksPageProps) => {


    const [tasks, setTasks] = useState<TaskModel[]>([]);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<TaskModel | null>(null);

    useEffect(() => {
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
    }, []);


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
                    {/* <Sidebar onFilter={handleFilter} /> */}
                    <TaskList
                        tasks={tasks}
                        onDeleteSuccessful={onDeleteSuccessful}
                        onEditClick={onEditClick}
                    />
                    <button onClick={() => setShowTaskModal(true)}>Add Task</button>

                    {showTaskModal &&
                        <TaskModal
                            currentTask={taskToEdit}
                            onDismiss={() => setShowTaskModal(false)}
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