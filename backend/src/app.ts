import "dotenv/config";
import express, {NextFunction, Request, Response, request} from "express";
import tasksRoutes from "./routes/tasks";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/tasks", tasksRoutes);

app.use((req: Request, res: Response, next:NextFunction )=>{
    next(createHttpError(404,"Endpoint not found"));
} )


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