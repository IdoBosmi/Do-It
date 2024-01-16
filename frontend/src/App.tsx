// import { useEffect, useState } from 'react';
// import { UserModel } from './models/user';
// import * as TaskAPI from "./network/tasks_api";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import NotFoundPage from './pages/NotFoundPage';
// import MyTasksPage from './pages/MyTasksPage';
// import Header from './components/Header';
// import LoginModal from './components/LoginModal';
// import SignUpModal from './components/SignupModal';

function App() {


  // const [showSignUpModal, setShowSignUpModal] = useState(false);
  // const [showLoginModal, setShowLoginModal] = useState(false);
  // const [loggedInUser, setLoggedInUser] = useState<UserModel | null>(null);


  // useEffect(() => {
  //   async function fetchLoggedInUser() {
  //     try {
  //       const user = await TaskAPI.getLoggedInUser();
  //       setLoggedInUser(user);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchLoggedInUser();
  // }, []);


  return (

    <div>
      Hello Ido
    </div>
    // <BrowserRouter>
    //   <div>
    //     <Header
    //       loggedInUser={loggedInUser}
    //       onLoginClick={() => setShowLoginModal(true)}
    //       onSignupClick={() => setShowSignUpModal(true)}
    //       onLogoutSuccessful={() => setLoggedInUser(null)}
    //     />

    //     <Routes>
    //       <Route
    //         path="/"
    //         element={<MyTasksPage loggedInUser={loggedInUser} />}
    //       />

    //       <Route
    //         path="/*"
    //         element={<NotFoundPage />}
    //       />
    //     </Routes>

    //     {showSignUpModal &&
    //       <SignUpModal
    //         onDismiss={() => setShowSignUpModal(false)}
    //         onSignUpSuccessful={(user) => {
    //           setLoggedInUser(user);
    //           setShowSignUpModal(false);
    //         }}
    //       />
    //     }
    //     {showLoginModal &&
    //       <LoginModal
    //         onDismiss={() => setShowLoginModal(false)}
    //         onLoginSuccessful={(user) => {
    //           setLoggedInUser(user);
    //           setShowLoginModal(false);
    //         }}
    //       />
    //     }

    //   </div>
    // </BrowserRouter>
  );
};

export default App;
