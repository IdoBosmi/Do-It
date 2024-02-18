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
        const eventRequests: EventRequest[] = tasks.map(task=> ({
                calendarId: calendarId,
                auth: oauth2Client,
                requestBody: {
                    summary: task.title,
                    description: `${task._id}`,
                    start: {
                        dateTime: task.dueDate.toISOString(), // Assuming dueDate is in ISO string format
                    },
                    end: {
                        dateTime: task.dueDate.toISOString(), // Assuming dueDate is in ISO string format
                    }
                }
        }));

        const eventPromises = eventRequests.map(async (eventRequest)=>{
            try {
                const eventResponse = await calendar.events.insert(eventRequest);
                const eventId = eventResponse.data.id;
                const task = tasks.find(task => task._id.equals(eventRequest.requestBody.description))
                if (task) {
                    task.googleCalendarEventId = eventId;
                    await task.save();
                }
        
                return eventResponse;
            } catch (error) {
                console.error('Error inserting event:', error);
                // Handle error (e.g., log, send notification, etc.)
                throw error;
            }
        })

        const eventResponses = await Promise.all(eventPromises);

        console.log('Tasks added to calendar successfully');
        res.status(200).send('Tasks added to calendar successfully');
    } catch (error) {
        console.error('Error creating calendar and events:', error);
        res.status(500).send('Error creating calendar and events');
    }
}

const refreshToken = async () =>{
    try {
        // Refresh the access token
        const { credentials } = await oauth2Client.refreshAccessToken();
        // Update the user's access token in the database
        oauth2Client.setCredentials(credentials);
    } catch (error) {
        // Handle token refresh errors
        console.error('Error refreshing access token:', error);

    }
}



//maybe auth??
export const addTaskEvent = async (task:TaskInterface, userId:Types.ObjectId) => {

    try {

        const user = await UserModel.findById(userId).exec();
        
        if (!user || !user.googleCalendarId) {
            return;
        }

        oauth2Client.setCredentials({refresh_token:user.googleRefreshToken})
        const { credentials } = await oauth2Client.refreshAccessToken();
        // Update the user's access token in the database
        oauth2Client.setCredentials(credentials);

        const calendar = google.calendar({ version: 'v3', auth: process.env.GOOGLE_API_KEY });
        const calendarId = user.googleCalendarId;

        if (calendarId) {
            const eventResponse = await calendar.events.insert({
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
            const eventId = eventResponse.data.id;
            return eventId;
        }
        return undefined
    } catch (error) {
        console.error('Error adding task event to calendar:', error);
        // Handle error (e.g., log, send notification, etc.)
        throw error;
    }
}


export const editTaskEvent = async (task: TaskInterface, userId: Types.ObjectId) => {
    try {
        const eventId = task.googleCalendarEventId; 

        if (!eventId){
            return
        }

        const user = await UserModel.findById(userId).exec();
        
        if (!user || !user.googleCalendarId) {
            return;
        }

        oauth2Client.setCredentials({refresh_token:user.googleRefreshToken})
        const { credentials } = await oauth2Client.refreshAccessToken();
        // Update the user's access token in the database
        oauth2Client.setCredentials(credentials);

        const calendar = google.calendar({ version: 'v3', auth: process.env.GOOGLE_API_KEY });
        const calendarId = user.googleCalendarId;

        if (calendarId) {
            // Call the events.update method to update the event
            await calendar.events.update({
                calendarId: calendarId,
                eventId: eventId,
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
        console.error('Error editing task event in calendar:', error);
        throw error;
    }
}


export const deleteTaskEvent = async (task: TaskInterface, userId: Types.ObjectId) => {
    try {
        const eventId = task.googleCalendarEventId; 

        if (!eventId){
            return
        }

        const user = await UserModel.findById(userId).exec();
        
        if (!user || !user.googleCalendarId) {
            return;
        }

        oauth2Client.setCredentials({refresh_token:user.googleRefreshToken})
        const { credentials } = await oauth2Client.refreshAccessToken();
        // Update the user's access token in the database
        oauth2Client.setCredentials(credentials);

        const calendar = google.calendar({ version: 'v3', auth: process.env.GOOGLE_API_KEY });
        const calendarId = user.googleCalendarId;

        if (calendarId) {
            await calendar.events.delete({
                calendarId: calendarId,
                eventId: eventId,
                auth: oauth2Client
            });
        }
    } catch (error) {
        console.error('Error editing task event in calendar:', error);
        throw error;
    }
}
