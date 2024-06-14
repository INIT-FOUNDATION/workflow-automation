import express from 'express';
import { adminController } from "../controllers/adminController";

export const authRouter = express.Router();

authRouter.get("/health", adminController.health);
