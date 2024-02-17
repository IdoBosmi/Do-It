import { TaskListModel } from "../models/TaskList";
import { TaskModel } from "../models/task";
import { UserModel } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {

    const API_IP = process.env.REACT_APP_API_IP || "https://my-mesimot.online:5000"

    const response = await fetch(API_IP+input, init);

    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        throw Error(errorBody.error);
    }
}

//TaskLists


export async function fetchTaskLists(): Promise<TaskListModel[]> {

    const response = await fetchData("/api/taskLists", { method: "GET", credentials: 'include' });
    return response.json();

}

export interface TaskListInput {
    title: string
}

export async function createTaskList(taskList: TaskListInput): Promise<TaskListModel> {

    const response = await fetchData("/api/taskLists", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(taskList)
    });

    return response.json();
}



export async function deleteTaskList(taskListId: string) {
    await fetchData("/api/taskLists/" + taskListId, { method: "DELETE",credentials: 'include' });
}


export async function updateTaskList(taskListId: string, taskList: TaskListInput): Promise<TaskListModel> {
    const response = await fetchData("/api/taskLists/" + taskListId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(taskList)
    });
    return response.json();
}



//Users

export async function getLoggedInUser(): Promise<UserModel> {
    const response = await fetchData("/api/users", { method: "GET" , credentials: 'include'});
    return response.json();
}


export interface SignUpCredentials {
    username: string,
    email: string,
    password: string
}

export async function signUp(credentials: SignUpCredentials): Promise<UserModel> {

    const response = await fetchData("/api/users/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
    })

    return response.json();

}


export interface LoginCredentials {
    username: string,
    password: string
}

export async function login(credentials1: LoginCredentials): Promise<UserModel> {

    console.log("login");

    const response = await fetchData("/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(credentials1)
    })

    return response.json();
}


export async function logout() {
    await fetchData("/api/users/logout", { method: "POST" , credentials: 'include'});
}




// Tasks

export async function fetchTasks(): Promise<TaskModel[]> {

    const response = await fetchData("/api/tasks", { method: "GET", credentials: 'include' });
    return response.json();

}

export interface TaskInput {
    title: string,
    taskListId?: string,
    dueDate?: Date
}


export async function createTask(task: TaskInput): Promise<TaskModel> {

    const response = await fetchData("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(task)
    });

    return response.json();
}



export async function deleteTask(taskId: string) {
    console.log(taskId)
    await fetchData("/api/tasks/" + taskId, { method: "DELETE", credentials: 'include' });
}


export async function updateTask(taskId: string, task: TaskInput): Promise<TaskModel> {
    const response = await fetchData("/api/tasks/" + taskId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(task)
    });
    return response.json();
}

// google calendar

export async function getAuth(): Promise<TaskModel> {
    console.log("google")
    const response = await fetchData("/auth/google" ,{
        method: "GET",
        credentials: 'include',
        
    });
    return response.json();
}
