import { RequestHandler } from "express";
import { assertIsDefined } from "../util/assertIsDefined";
import taskListModel from '../models/taskList'
import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";


export const getTaskLists: RequestHandler = async (req, res, next) => {

    const authenticatedUserId = req.session.userId;
    try {

        assertIsDefined(authenticatedUserId);
        const taskLists = await taskListModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(taskLists);

    } catch (error) {
        next(error);
    }
}



export const createTaskList: RequestHandler = async (req, res, next) => {

    const title =  req.body.title;
    const authenticatedUserId = req.session.userId;

    try {

        assertIsDefined(authenticatedUserId);

        if (!title){
            throw createHttpError(400, "Task list must have a title");
        }

        const newTaskList = await taskListModel.create({
            userId: authenticatedUserId,
            title: title
        });

        res.status(201).json(newTaskList);

    } catch (error) {
        next(error);
    }

}



export const updateTaskList: RequestHandler = async (req, res, next) => {

    const taskListId = req.params.taskListId;
    const title =  req.body.title
    const authenticatedUserId = req.session.userId;

    try {

        assertIsDefined(authenticatedUserId);

        if (!isValidObjectId(taskListId)){
            throw createHttpError(400, "Invalid task list id");
        }

        if (!title){
            throw createHttpError(400, "Task list must have a title");
        }

        const taskList = await taskListModel.findById(taskListId).exec();

        if (!taskList){
            throw createHttpError(404, "Task list not found");
        }

        if(!taskList.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this task list");
        }

        taskList.title = title;

        const updatedTask = await taskList.save();

        res.status(200).json(updatedTask);

    } catch (error) {
        next(error);
    }



}


export const deleteTaskList: RequestHandler = async (req, res, next) => {

    const taskListId = req.params.taskListId;
    const authenticatedUserId = req.session.userId;
    
    try {

        assertIsDefined(authenticatedUserId);

        if (!isValidObjectId(taskListId)){
            throw createHttpError(400, "Invalid task list id");
        }

        const taskList = await taskListModel.findById(taskListId).exec();

        if (!taskList){
            throw createHttpError(404, "Task list not found");
        }

        if(!taskList.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this task list");
        }


        await taskList.deleteOne();

        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }

}