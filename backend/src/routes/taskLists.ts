import express from 'express'
import * as TaskListsController from '../controllers/taskLists'

const router = express.Router();

router.get("/", TaskListsController.getTaskLists);

router.post("/", TaskListsController.createTaskList)

router.patch("/:taskListId", TaskListsController.updateTaskList);

router.delete("/:taskListId", TaskListsController.deleteTaskList);

export default router;