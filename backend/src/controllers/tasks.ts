import { RequestHandler } from "express";
import taskModel from "../models/task";
import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";


export const getTasks: RequestHandler =  async (req, res, next) => {
    try{
        const tasks = await taskModel.find().exec();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}

export const getTask: RequestHandler =  async (req, res, next) => {

    const taskId = req.params.taskId;

    try{

        if (!isValidObjectId(taskId)){
            throw createHttpError(400, "Invalid task id");
        }

        const task = await taskModel.findById(taskId).exec();

        if (!task){
            throw createHttpError(404, "Task not found");
        }

        res.status(200).json(task);

    } catch (error) {
        next(error);
    }
}


export const createTask: RequestHandler = async (req, res, next) =>{
    
    const title =  req.body.title

    try {

        if (!title){
            throw createHttpError(400, "Task must have a title");
        }

        const newTask = await taskModel.create({
            title: title
        });

        res.status(201).json(newTask);

    } catch (error) {
        next(error);
    }


}


export const updateTask: RequestHandler = async (req, res, next) =>{
    
    const taskId = req.params.taskId;
    const title =  req.body.title

    try {

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

        task.title = title;

        const updatedTask = await task.save();

        res.status(200).json(updateTask);

    } catch (error) {
        next(error);
    }


}


export const deleteTask: RequestHandler = async (req, res, next) => {
    
    const taskId = req.params.noteId;
    
    try {

        if (!isValidObjectId(taskId)){
            throw createHttpError(400, "Invalid note id");
        }

        const note = await taskModel.findById(taskId).exec();

        if (!note){
            throw createHttpError(404, "Note not found");
        }

        await note.deleteOne();

        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
}