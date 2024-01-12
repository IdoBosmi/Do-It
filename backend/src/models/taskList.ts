import { InferSchemaType, Schema, model } from "mongoose";

const taskListScheme = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

type TaskList = InferSchemaType<typeof taskListScheme>

export default model<TaskList>("TaskList", taskListScheme);
