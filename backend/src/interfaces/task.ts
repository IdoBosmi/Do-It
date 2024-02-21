import { Types } from "mongoose";

export interface TaskInterface {
    _id: Types.ObjectId,
    userId: Types.ObjectId, //???
    taskListId?: string | null, 
    title: string,
    createdAt: NativeDate,
    updatedAt: NativeDate,
    dueDate: Date,
    isCompleted: boolean,
    googleCalendarEventId?: string | null
}