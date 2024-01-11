import * as TasksController from "../controllers/tasks";
import express from "express";

const router = express.Router();

router.get("/", TasksController.getTasks);

router.get("/:taskId", TasksController.getTask)

router.post("/", TasksController.createTask);


router.patch("/:taskId", TasksController.updateTask);

router.delete("/:taskId", TasksController.deleteTask)

export default router;