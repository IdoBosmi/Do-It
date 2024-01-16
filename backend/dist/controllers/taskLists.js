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
exports.deleteTaskList = exports.updateTaskList = exports.createTaskList = exports.getTaskLists = void 0;
const assertIsDefined_1 = require("../util/assertIsDefined");
const taskList_1 = __importDefault(require("../models/taskList"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = require("mongoose");
const getTaskLists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        const taskLists = yield taskList_1.default.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(taskLists);
    }
    catch (error) {
        next(error);
    }
});
exports.getTaskLists = getTaskLists;
const createTaskList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!title) {
            throw (0, http_errors_1.default)(400, "Task list must have a title");
        }
        const newTaskList = yield taskList_1.default.create({
            userId: authenticatedUserId,
            title: title
        });
        res.status(201).json(newTaskList);
    }
    catch (error) {
        next(error);
    }
});
exports.createTaskList = createTaskList;
const updateTaskList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const taskListId = req.params.taskListId;
    const title = req.body.title;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!(0, mongoose_1.isValidObjectId)(taskListId)) {
            throw (0, http_errors_1.default)(400, "Invalid task list id");
        }
        if (!title) {
            throw (0, http_errors_1.default)(400, "Task list must have a title");
        }
        const taskList = yield taskList_1.default.findById(taskListId).exec();
        if (!taskList) {
            throw (0, http_errors_1.default)(404, "Task list not found");
        }
        if (!taskList.userId.equals(authenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "You cannot access this task list");
        }
        taskList.title = title;
        const updatedTask = yield taskList.save();
        res.status(200).json(updatedTask);
    }
    catch (error) {
        next(error);
    }
});
exports.updateTaskList = updateTaskList;
const deleteTaskList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const taskListId = req.params.taskListId;
    const authenticatedUserId = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUserId);
        if (!(0, mongoose_1.isValidObjectId)(taskListId)) {
            throw (0, http_errors_1.default)(400, "Invalid task list id");
        }
        const taskList = yield taskList_1.default.findById(taskListId).exec();
        if (!taskList) {
            throw (0, http_errors_1.default)(404, "Task list not found");
        }
        if (!taskList.userId.equals(authenticatedUserId)) {
            throw (0, http_errors_1.default)(401, "You cannot access this task list");
        }
        yield taskList.deleteOne();
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTaskList = deleteTaskList;
