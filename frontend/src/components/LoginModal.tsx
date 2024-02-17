import { useState } from 'react';
import { LoginCredentials } from '../network/tasks_api';
import * as TaskAPI from '../network/tasks_api'
import { UserModel } from '../models/user';
import { Button, Modal } from 'react-bootstrap'
import '../styles/loginModal.css';


interface LoginModalProps {
  onDismiss: () => void,
  onLoginSuccessful: (user: UserModel) => void,
}


const LoginModal = ({ onDismiss, onLoginSuccessful }: LoginModalProps) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")

  const onSubmit = async (credentials: LoginCredentials) => {
    try {
      const user = await TaskAPI.login(credentials);
      onLoginSuccessful(user);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal show onHide={onDismiss} centered className="LoginModal">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">
          Login
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <input placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Enter Password" type="password" onChange={(e) => setPassword(e.target.value)} />
        <Button className="submit" onClick={() => onSubmit({ username: username, password: password })}>
          Submit
        </Button>
      </Modal.Body>
    </Modal>
  )
}


export default LoginModal;