"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getTasks = void 0;
const task_1 = __importDefault(require("../models/task"));
const mongoose_1 = require("mongoose");
const http_errors_1 = __importDefault(require("http-errors"));
const assertIsDefined_1 = require("../util/assertIsDefined");
const getTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        const tasks = yield task_1.default.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(tasks);
    }
    catch (error) {
        next(error);
    }
});
exports.getTasks = getTasks;
const getTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.taskId;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!(0, mongoose_1.isValidObjectId)(taskId)) {
            throw (0, http_errors_1.default)(400, "Invalid task id");
        }
        const task = yield task_1.default.findById(taskId).exec();
        if (!task) {
            throw (0, http_errors_1.default)(404, "Task not found");
        }
        if (!task.userId.equals(authenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "You cannot access this task");
        }
        res.status(200).json(task);
    }
    catch (error) {
        next(error);
    }
});
exports.getTask = getTask;
const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const taskListId = req.body.taskListId;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!title) {
            throw (0, http_errors_1.default)(400, "Task must have a title");
        }
        //check if taskListId is ok
        const newTask = yield task_1.default.create({
            userId: authenticatedUserId,
            title: title,
            taskListId: taskListId
        });
        res.status(201).json(newTask);
    }
    catch (error) {
        next(error);
    }
});
exports.createTask = createTask;
const updateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.taskId;
    const title = req.body.title;
    const taskListId = req.body.taskListId;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!(0, mongoose_1.isValidObjectId)(taskId)) {
            throw (0, http_errors_1.default)(400, "Invalid task id");
        }
        if (!title) {
            throw (0, http_errors_1.default)(400, "Task must have a title");
        }
        const task = yield task_1.default.findById(taskId).exec();
        if (!task) {
            throw (0, http_errors_1.default)(404, "Task not found");
        }
        if (!task.userId.equals(authenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "You cannot access this task");
        }
        task.title = title;
        task.taskListId = taskListId;
        const updatedTask = yield task.save();
        res.status(200).json(updatedTask);
    }
    catch (error) {
        next(error);
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.taskId;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!(0, mongoose_1.isValidObjectId)(taskId)) {
            throw (0, http_errors_1.default)(400, "Invalid task id");
        }
        const task = yield task_1.default.findById(taskId).exec();
        if (!task) {
            throw (0, http_errors_1.default)(404, "Task not found");
        }
        if (!task.userId.equals(authenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "You cannot access this task");
        }
        yield task.deleteOne();
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTask = deleteTask;
