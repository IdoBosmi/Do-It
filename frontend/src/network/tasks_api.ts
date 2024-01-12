import { TaskListModel } from "../models/TaskList";
import { TaskModel } from "../models/task";
import { UserModel } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);

    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        throw Error(errorBody.error);
    }
}

//TaskLists


export async function fetchTaskLists(): Promise<TaskListModel[]> {

    const response = await fetchData("/api/taskLists", { method: "GET" });
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
        body: JSON.stringify(taskList)
    });

    return response.json();
}



export async function deleteTaskList(taskListId: string) {
    await fetchData("/api/taskLists/" + taskListId, { method: "DELETE" });
}


export async function updateTaskList(taskListId: string, taskList: TaskListInput): Promise<TaskListModel> {
    const response = await fetchData("/api/taskLists/" + taskListId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskList)
    });
    return response.json();
}



//Users

export async function getLoggedInUser(): Promise<UserModel> {
    const response = await fetchData("/api/users", { method: "GET" });
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
        body: JSON.stringify(credentials)
    })

    return response.json();

}


export interface LoginCredentials {
    username: string,
    password: string
}

export async function login(credentials: LoginCredentials): Promise<UserModel> {

    const response = await fetchData("/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    })

    return response.json();
}


export async function logout() {
    await fetchData("api/users/logout", { method: "POST" });
}




// Tasks

export async function fetchTasks(): Promise<TaskModel[]> {

    const response = await fetchData("/api/tasks", { method: "GET" });
    return response.json();

}

export interface TaskInput {
    title: string,
    taskListId?: string
}


export async function createTask(task: TaskInput): Promise<TaskModel> {

    const response = await fetchData("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    return response.json();
}



export async function deleteTask(taskId: string) {
    console.log(taskId)
    await fetchData("/api/tasks/" + taskId, { method: "DELETE" });
}


export async function updateTask(taskId: string, task: TaskInput): Promise<TaskModel> {
    const response = await fetchData("/api/tasks/" + taskId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });
    return response.json();
}