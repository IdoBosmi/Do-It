export interface TaskModel {
    _id: string,
    userId: string, //???
    taskListId: string, 
    title: string,
    createdAt: string,
    updatedAt: string,
    dueDate: Date,
    isCompleted: boolean
}