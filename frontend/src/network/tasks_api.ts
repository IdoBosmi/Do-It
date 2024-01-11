import { TaskModel } from "../models/task";

async function fetchData(input:RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);

    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        throw Error(errorBody.error);
    }
}

export async function fetchTasks(): Promise<TaskModel[]> {

    const response = await fetchData("/api/tasks", {method: "GET"});
    return response.json();

}

interface TaskInput {
    title: string
}


export async function createTask(task : TaskInput): Promise<TaskModel> {

    const response = await fetchData("/api/tasks",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    return response.json();
} 



export async function delteTask(taskId: string){
    await fetchData("/api/tasks/"+taskId, {method: "DELETE"});
}


export async function updateTask(taskId: string, task:TaskInput): Promise<TaskModel>{
    const response = await fetchData("/api/tasks/" +taskId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });
    return response.json();
}