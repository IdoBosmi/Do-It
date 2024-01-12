import "dotenv/config";
import express, {NextFunction, Request, Response, request} from "express";
import tasksRoutes from "./routes/tasks";
import userRoutes from "./routes/users";
import taskListsRoute from "./routes/taskLists";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { requireAuth } from "./middleware/auth";

const app = express();

app.use(morgan("dev"));

app.use(express.json());


app.use(session({
    secret: process.env.SESSION_SECERET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000
    },
    rolling: true,
    store: MongoStore.create({mongoUrl: process.env.MONGO_CONNECTION_STRING})
}));


app.use("/api/taskLists", taskListsRoute)
app.use("/api/tasks", requireAuth, tasksRoutes);
app.use("/api/users", userRoutes)

app.use((req: Request, res: Response, next:NextFunction )=>{
    next(createHttpError(404,"Endpoint not found"));
});


app.use((error: unknown, req: Request, res: Response, next: NextFunction)=>{
    console.log(error);
    let errorMessagme = "An unknown error occured";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessagme  = error.message;
    }
    res.status(statusCode).json({error: errorMessagme});
});


export default app;