import {RequestHandler} from "express"
import createHttpError from "http-errors";
import {google, calendar_v3 } from "googleapis"
import * as taskController from "../controllers/tasks"
import { TaskInterface } from "../interfaces/task";
import "dotenv/config";
import taskModel from "../models/task"
import { oauth2 } from "googleapis/build/src/apis/oauth2";
import { assertIsDefined } from "../util/assertIsDefined";

const REDIRECT_URL = process.env.GOOGLE_AUTH_REDIRECT_URL || "http://localhost:5000/api/google/callback"


const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_AUTH_CLIENT_ID,
    process.env.GOOGLE_AUTH_CLIENT_SECERET,
    REDIRECT_URL
)



// // Define route for initiating OAuth 2.0 authentication
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'] }));

// // Handle OAuth 2.0 callback
// app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
//     // Successful authentication, redirect to a success page or send a response
//     res.redirect('/success');
// });



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

        console.log("TASKS:")
        console.log()


        const authenticatedUserId = req.session.userId;
        assertIsDefined(authenticatedUserId);
        const tasks = await taskModel.find({userId: authenticatedUserId }).exec();
        

        console.log(tasks);
        const filteredTasks = tasks.filter(item=> item.taskListId == "65d0d2c81fa2098083ad4af0")
        console.log(filteredTasks)

        // Add tasks as events to the calendar
        const eventRequests: EventRequest[] = filteredTasks.map(task=> {
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