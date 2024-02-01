import {useState, useEffect} from 'react';
import * as TaskAPI from '../network/tasks_api'
import {Button, Modal} from 'react-bootstrap'
import { TaskListModel } from '../models/TaskList';

interface NewTaskListModalProps {
    currentTaskList: TaskListModel | null
    onDismiss: () => void,
    onCreateSuccessful: (task: TaskListModel) => void,
    onUpdateSuccessful: (task: TaskListModel) => void
}

const TaskModal = ({currentTaskList, onDismiss, onCreateSuccessful, onUpdateSuccessful} : NewTaskListModalProps) =>{

    const [title, setTitle] = useState<string>("");

    useEffect(() => {
        if (currentTaskList) {
            setTitle(currentTaskList.title);
        }
    }, [currentTaskList]);

    const onSubmit = async (taskList:TaskAPI.TaskListInput)=> {
        try {
            if (currentTaskList){
                const updatedTaskList = await TaskAPI.updateTaskList(currentTaskList._id, taskList);
                onUpdateSuccessful(updatedTaskList);
            } else {
                const newTaskList = await TaskAPI.createTaskList(taskList);
                onCreateSuccessful(newTaskList);
            }

        } catch (error) {
            console.log(error);
        }
    }

    return(
        <Modal show onHide={onDismiss} centered className="LoginModal">
            <Modal.Header closeButton>
                <Modal.Title className="modal-title">
                    {currentTaskList ? "Edit Task List" : "Create New Task List"}
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