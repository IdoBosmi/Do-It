import {RequestHandler} from "express"
import createHttpError from "http-errors";
import {google, calendar_v3 } from "googleapis"
import { TaskInterface } from "../interfaces/task";
import "dotenv/config";
import taskModel from "../models/task"
import { assertIsDefined } from "../util/assertIsDefined";
import UserModel from "../models/user";
import { Types } from "mongoose";

const REDIRECT_URL = process.env.GOOGLE_AUTH_REDIRECT_URL || "http://localhost:5000/api/google/callback"


const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_AUTH_CLIENT_ID,
    process.env.GOOGLE_AUTH_CLIENT_SECERET,
    REDIRECT_URL
)

export const getAuth: RequestHandler = (req, res, next) =>{
    console.log("getauth")
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
    })

    res.redirect(url)
}


interface EventRequest {
    calendarId: string;
    requestBody: calendar_v3.Schema$Event;
}



export const initializeGoogleCalendarIntegration:RequestHandler = async (req, res, next) =>{
    
    const code = req.query.code as string;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        const accessToken = tokens.access_token;
        console.log(tokens)

        if (!accessToken){
            throw createHttpError(500, "No Acsees token")
        }

        const calendar = google.calendar({ version: 'v3', auth: process.env.GOOGLE_API_KEY});
        console.log("calendar:")
        console.log(calendar)
        console.log()
        // Create a new calendar for the user
        const calendarRes = await calendar.calendars.insert({
            auth: oauth2Client,
            requestBody: {
                summary: `Do It Calendar`
            }
        });

        console.log("calendar RES:")
        console.log(calendarRes)
        console.log()
        if (!calendarRes.data.id){
            throw createHttpError(500, "Failed to crete Calender");
        }
        const calendarId = calendarRes.data.id;

        const refreshToken = tokens.refresh_token;

        // Save the calendar ID and refresh token to the user's account
        const authenticatedUserId = req.session.userId;
        assertIsDefined(authenticatedUserId);

        const user = await UserModel.findById(authenticatedUserId).exec();
        if (user) {
            user.googleCalendarId = calendarId;
            user.googleRefreshToken = refreshToken;
            await user.save();
            
        } else {
            throw createHttpError(404, "User not found");
        }

        const tasks = await taskModel.find({userId: authenticatedUserId }).exec();

        // Add tasks as events to the calendar
        const eventRequests: EventRequest[] = tasks.map(task=> {
            return {
                calendarId: calendarId,
                auth: oauth2Client,
                requestBody: {
                    summary: task.title,
                    description: `Task ID: ${task._id}`,
                    start: {
                        dateTime: task.dueDate!.toISOString(), // Assuming dueDate is in ISO string format
                    },
                    end: {
                        dateTime: task.dueDate!.toISOString(), // Assuming dueDate is in ISO string format
                    }
                }
            };
        });

        await Promise.all(eventRequests.map((req) => calendar.events.insert(req)));

        console.log('Tasks added to calendar successfully');
        res.status(200).send('Tasks added to calendar successfully');
    } catch (error) {
        console.error('Error creating calendar and events:', error);
        res.status(500).send('Error creating calendar and events');
    }
}

export const addTaskEvent = async (task:TaskInterface, userId:Types.ObjectId) => {

    try {

        const user = await UserModel.findById(userId).exec();
        
        if (!user || !user.googleCalendarId) {
            return;
        }

        
        // const { expiry_date } = oauth2Client.credentials;
        // if (expiry_date && expiry_date < Date.now()) {
        //     // Access token has expired, refresh it
        //     try {
        //         const { tokens } = await oauth2Client.refreshToken(user.googleRefreshToken);
        //         oauth2Client.setCredentials(tokens);
        //     } catch (refreshError) {
        //         console.error('Error refreshing access token:', refreshError);
        //         throw refreshError;
        //     }
        // }

        const calendar = google.calendar({ version: 'v3', auth: process.env.GOOGLE_API_KEY });
        const calendarId = user!.googleCalendarId;

        if (calendarId) {
            await calendar.events.insert({
                calendarId: calendarId,
                auth: oauth2Client,
                requestBody: {
                    summary: task.title,
                    description: `Task ID: ${task._id}`,
                    start: {
                        dateTime: task.dueDate.toISOString(),
                    },
                    end: {
                        dateTime: task.dueDate.toISOString(),
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error adding task event to calendar:', error);
        // Handle error (e.g., log, send notification, etc.)
        throw error;
    }
}