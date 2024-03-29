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
        type: Date,
        required: true
    },
    isCompleted: {
        type: Boolean,
        required: true
    },
    googleCalendarEventId: {
        type: String
    }
}, { timestamps: true });

type Task = InferSchemaType<typeof taskSchema>

export default model<Task>("Task", taskSchema);
