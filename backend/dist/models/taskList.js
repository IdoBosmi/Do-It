"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskListScheme = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});
exports.default = (0, mongoose_1.model)("TaskList", taskListScheme);
