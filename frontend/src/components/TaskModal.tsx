import {useState, useEffect} from 'react';
import * as TaskAPI from '../network/tasks_api'
import {Button, Modal} from 'react-bootstrap'
import '../styles/loginModal.css';
import { TaskModel } from '../models/task';

interface LoginModalProps {
    currentTask: TaskModel | null
    onDismiss: () => void,
    onCreateSuccessful: (task: TaskModel) => void,
    onUpdateSuccessful: (task: TaskModel) => void
}

const TaskModal = ({currentTask, onDismiss, onCreateSuccessful, onUpdateSuccessful} : LoginModalProps) =>{

    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        if (currentTask) {
            setTitle(currentTask.title); // Use empty string as a fallback
        }
    }, [currentTask]);

    const onSubmit = async (task:TaskAPI.TaskInput)=> {
        try {

            if (currentTask){
                const updatedTask = await TaskAPI.updateTask(currentTask._id, task);
                onUpdateSuccessful(updatedTask);
            } else {
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
                <Button className= "submit-button" onClick={() => onSubmit({title: title})}>
                Submit
                </Button>
            </Modal.Body>
        </Modal>
    )
}


export default TaskModal;