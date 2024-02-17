import {useState, useEffect} from 'react';
import * as TaskAPI from '../network/tasks_api'
import {Modal} from 'react-bootstrap'
import { TaskModel } from '../models/task';
import { TaskListModel } from '../models/TaskList';
import '../styles/taskModal.css';


interface TaskModalProps {
    currentTaskList: TaskListModel | null,
    currentTask: TaskModel | null
    onDismiss: () => void,
    onCreateSuccessful: (task: TaskModel) => void,
    onUpdateSuccessful: (task: TaskModel) => void
}

const TaskModal = ({currentTask, onDismiss, onCreateSuccessful, onUpdateSuccessful, currentTaskList} : TaskModalProps) =>{

    const [title, setTitle] = useState<string>("");
    const [dueDate, setDueDate] = useState<Date>(new Date());

    useEffect(() => {
        if (currentTask) {
            setTitle(currentTask.title);
            setDueDate(new Date(currentTask.dueDate)) 
        }
    }, [currentTask]);

    const onSubmit = async (task:TaskAPI.TaskInput)=> {
        try {

            if (currentTask){
                task.taskListId=currentTask.taskListId;
                const updatedTask = await TaskAPI.updateTask(currentTask._id, task);
                onUpdateSuccessful(updatedTask);
            } else {
                if (currentTaskList){
                    task.taskListId = currentTaskList._id;
                }
                const newTask = await TaskAPI.createTask(task);
                onCreateSuccessful(newTask);
            }

        } catch (error) {
            console.log(error);
        }
    }

    return(
        <Modal show onHide={onDismiss} centered className="LoginModal">
            <Modal.Header closeButton>
                <Modal.Title className="modal-title">
                    {currentTask ? "Edit Task" : "Create New Task"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <input placeholder="Enter Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="date" placeholder="Enter Due Date" value={dueDate.toISOString().split('T')[0]} onChange={(e) => setDueDate(new Date(e.target.value))} />
                <button className= "submit-button" onClick={() => onSubmit({title: title, dueDate:dueDate})}>
                Submit
                </button>
            </Modal.Body>
        </Modal>
    )
}


export default TaskModal;