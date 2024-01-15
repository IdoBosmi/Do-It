import {RequestHandler} from "express"
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcryptjs from "bcryptjs";


export const getAuthenticatedUser: RequestHandler = async(req, res, next)=>{


    try {

        const user = await UserModel.findById(req.session.userId).select("+email").exec();

        res.status(200).json(user);

    } catch (error){
        next(error)
    }
}


export const signUp: RequestHandler = async (req, res, next) => {

    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {

        if (!username || !email || !passwordRaw){
            throw createHttpError(400, "parameters missing");
        }

        const existingUsername = await UserModel.findOne({username: username}).exec();

        if (existingUsername){
            throw createHttpError(409, "Username is already taken. Please Choose a different one or login instead.")
        }

        const existingEmail = await UserModel.findOne({email: email}).exec();

        if (existingEmail){
            throw createHttpError(409, "Email is already taken. Please Choose a different one or login instead.")
        }

        const passwordHashed = await bcryptjs.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed
        });


        req.session.userId = newUser._id;

        res.status(201).json(newUser);


    } catch (error) {
        next(error);
    }

}

export const login: RequestHandler = async (req, res, next) =>{

    const username = req.body.username;
    const password = req.body.password;

    try {

        if(!username || !password) {
            throw createHttpError(400, "parameters missing");
        }

        const user = await UserModel.findOne({username: username}).select("+password +email").exec();

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcryptjs.compare(password, user.password);

        if(!passwordMatch){
            throw createHttpError(401,"Invalid credentials")
        }

        req.session.userId = user._id;
        

        res.status(201).json(user)

    } catch (error) {
        next(error);
    }

}


export const logout: RequestHandler = (req, res, next)=> {


    req.session.destroy(error=>{
        if(error){
            next(error)
        } else {
            res.sendStatus(200);
        }
    })

}