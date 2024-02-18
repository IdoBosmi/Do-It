import express from 'express'
import * as GoogleController from '../controllers/google'

const router = express.Router();

router.get("/", GoogleController.getAuth);

router.get("/callback", GoogleController.initializeGoogleCalendarIntegration);

export default router;