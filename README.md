# Do-It Task Manager

## Overview and Features
The Do It Tasks Manager is a TypeScript Node.js application with a React frontend and MongoDB database. It allows users to manage tasks efficiently. Features include:

- Add, edit, and delete tasks
- Mark tasks as completed
- Create lists for tasks in different subjects (e.g., "work", "sport", etc.)
- Add due dates to tasks
- User authentication and authorization

## Table of Contents
1. [Project Architecture](#project-architecture)
2. [Getting Started](#getting-started)
   - [Run Locally (Without Docker)](#run-locally-without-docker)
   - [Run Locally with Docker](#run-locally-with-docker)
   - [Access Online (my-mesimot.online)](#access-online-mymesimotonline)
3. [Technologies Used](#technologies-used)
4. [License](#license)

## Project Architecture
![Do-it-Architecture](https://github.com/IdoBosmi/Do-It/assets/80417979/1fffc485-1510-4831-914e-961752d7862d)


## Getting Started
### Run Locally (Without Docker)
- Clone the repository: `git clone https://github.com/IdoBosmi/Do-It.git`
- Install dependencies: `npm install`
- Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     MONGODB_URI=<mongodb-uri> 
     SESSION_SECRET=<session-secret>
     ```
- Option 1: Start the backend server in one terminal: `npm start` from the backend directory. Then start the frontend server in another terminal: `npm start` from the frontend directory.
- Option 2: Start both the backend and frontend servers concurrently: `npm start` from the root directory.
- Access the application at `http://localhost:3000`

### Run Locally with Docker
- Clone the repository: `git clone https://github.com/IdoBosmi/Do-It.git`
- Set up environment variables (as above)
- Run the command: `npm run start:docker` from the root directory.
- Access the application at `http://localhost:3000`

### Access Online
- Visit [my-mesimot.online](https://my-mesimot.online) to access the deployed application.

## Technologies Used
- TypeScript
- Node.js
- React
- MongoDB
- Express
- MongoStore for session management
- GitHub Actions
- Docker
- Amazon ECR
- Amazon ECS
- EC2 instances
- AWS ELB
- Route 53 Hosted Zone

## License
This project is licensed under the [MIT License](LICENSE).
