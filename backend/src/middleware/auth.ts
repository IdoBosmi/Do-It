import {RequestHandler} from "express";
import createHttpError from "http-errors"

export const requireAuth: RequestHandler = (req, res, next) => {
    console.log("sadsadasdsadsasavsdvbds234234234");
    console.log(req.session.userId)
    if (req.session.userId) {
        next();
    } else {
        next(createHttpError(401, "User not authenticated"))
    }
}