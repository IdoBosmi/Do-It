import { RequestHandler } from "express";
import taskModel from "../models/task";
import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";
import { assertIsDefined } from "../util/assertIsDefined";
import * as GoogleController from "../controllers/google"


export const getTasks: RequestHandler =  async (req, res, next) => {

    const authenticatedUserId = req.session.userId;

    try{

        assertIsDefined(authenticatedUserId);


        const tasks = await taskModel.find({userId: authenticatedUserId }).exec();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}

export const getTask: RequestHandler =  async (req, res, next) => {

    const taskId = req.params.taskId;
    const authenticatedUserId = req.session.userId;

    try{

        assertIsDefined(authenticatedUserId);

        if (!isValidObjectId(taskId)){
            throw createHttpError(400, "Invalid task id");
        }

        const task = await taskModel.findById(taskId).exec();

        if (!task){
            throw createHttpError(404, "Task not found");
        }

        if(!task.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this task");
        }

        res.status(200).json(task);

    } catch (error) {
        next(error);
    }
}


export const createTask: RequestHandler = async (req, res, next) =>{
    
    const title =  req.body.title;
    const taskListId = req.body.taskListId;
    let dueDate = req.body.dueDate;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!title){
            throw createHttpError(400, "Task must have a title");
        }

        //check if taskListId is ok
        if (dueDate) {
            // If dueDate is defined, set the time
            dueDate = new Date(dueDate);
            dueDate.setHours(9);
            dueDate.setMinutes(0);
        } else {
            // If dueDate is not provided, you can handle it here, like setting a default value or throwing an error
            throw createHttpError(400, "Due date is required for the task");
        } 
        const newTask = await taskModel.create({
            userId: authenticatedUserId,
            title: title,
            taskListId: taskListId,
            dueDate: dueDate,
            isCompleted: false
        });

        await GoogleController.addTaskEvent(newTask, authenticatedUserId)

        res.status(201).json(newTask);

    } catch (error) {
        next(error);
    }

}


export const updateTask: RequestHandler = async (req, res, next) =>{
    
    const taskId = req.params.taskId;
    const title =  req.body.title;
    const taskListId = req.body.taskListId;
    const dueDate = req.body.dueDate;
    const isCompleted = req.body.isCompleted;
    const authenticatedUserId = req.session.userId;

    try {

        assertIsDefined(authenticatedUserId);

        if (!isValidObjectId(taskId)){
            throw createHttpError(400, "Invalid task id");
        }

        if (!title){
            throw createHttpError(400, "Task must have a title");
        }

        const task = await taskModel.findById(taskId).exec();

        if (!task){
            throw createHttpError(404, "Task not found");
        }

        if(!task.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this task");
        }

        task.title = title;
        task.taskListId = taskListId;
        task.dueDate = dueDate;
        task.isCompleted = isCompleted;

        const updatedTask = await task.save();

        res.status(200).json(updatedTask);

    } catch (error) {
        next(error);
    }

}


export const deleteTask: RequestHandler = async (req, res, next) => {
    
    const taskId = req.params.taskId;
    const authenticatedUserId = req.session.userId;
    
    try {

        assertIsDefined(authenticatedUserId);

        if (!isValidObjectId(taskId)){
            throw createHttpError(400, "Invalid task id");
        }

        const task = await taskModel.findById(taskId).exec();

        if (!task){
            throw createHttpError(404, "Task not found");
        }

        if(!task.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this task");
        }

        await task.deleteOne();

        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
}