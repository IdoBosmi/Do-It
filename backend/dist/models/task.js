"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.default = (0, mongoose_1.model)("Task", taskSchema);
