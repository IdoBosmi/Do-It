import { useState } from 'react';
import * as TaskAPI from '../network/tasks_api'
import { UserModel } from '../models/user';
import { Modal } from 'react-bootstrap'
import '../styles/signupModal.css';


interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: UserModel) => void,
}


const SignUpModal = ({ onDismiss, onSignUpSuccessful }: SignUpModalProps) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const onSubmit = async (credentials: TaskAPI.SignUpCredentials) => {
        try {
            const newUser = await TaskAPI.signUp(credentials);
            onSignUpSuccessful(newUser);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Modal show onHide={onDismiss} centered className="SignupModal">
            <Modal.Header closeButton>
                <Modal.Title>
                    Login
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)} />
                <input placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Enter Password" type="password" onChange={(e) => setPassword(e.target.value)} />
                <button onClick={() => onSubmit({ username: username, password: password, email: email })}>Submit</button>

            </Modal.Body>
        </Modal>
    )
}


export default SignUpModal;