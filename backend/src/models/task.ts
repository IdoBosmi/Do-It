import { InferSchemaType, Schema, model } from "mongoose";

const taskSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    taskListId: {
        type: String
    },
    dueDate: {
        type: Date
    },
    isCompleted: {
        type: Boolean
    }
}, { timestamps: true });

type Task = InferSchemaType<typeof taskSchema>

export default model<Task>("Task", taskSchema);
