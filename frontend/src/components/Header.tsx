import { UserModel } from "../models/user";
import * as TaskAPI from '../network/tasks_api'
import "../styles/header.css"

interface HeaderProps {
  loggedInUser: UserModel | null,
  onLoginClick: () => void,
  onSignupClick: () => void,
  onLogoutSuccessful: () => void
}

const Header = ({ loggedInUser, onLoginClick, onSignupClick, onLogoutSuccessful }: HeaderProps) => {

  const logout = async () => {
    try {
      await TaskAPI.logout();
      onLogoutSuccessful();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="header-container">
      <div className="title">DO IT</div>
      {loggedInUser
        ? <div className="logged-in-section">
          <div className="username">{"Hello " + loggedInUser.username}</div>
          <button className="logout-button" onClick={logout}>Logout</button>
        </div>
        : <div>
          <button className="login-button" onClick={onLoginClick}>Login</button>
          <button className="signup-button" onClick={onSignupClick}>SignUp</button>
        </div>
      }
    </div>
  );
};

export default Header;