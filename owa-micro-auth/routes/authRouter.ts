import express from 'express';
import { authContoller } from '../controllers/authController';

export const authRouter = express.Router();

authRouter.get("/health", authContoller.health);
