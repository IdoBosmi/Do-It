import mongoos from "mongoose";

declare module "express-session" {
    interface SessionData {
        userId: mongoos.Types.ObjectId;
    }
}