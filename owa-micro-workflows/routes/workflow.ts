import express, { Request, Response } from "express";
import { STATUS, redis, generateToken, mongoDBRead, mongoDB, logger, kafka, auditLog, auditLogModel } from "owa-micro-common";
import { ERRORCODE } from "../constants/ERRORCODE";
import { AUTH } from "../constants/AUTH";
import bcrypt from "bcryptjs";
import { MONGO_COLLECTIONS } from "../constants/MONGO_COLLECTIONS";
import {  } from "../constants/CONST";

export const workflowRouter = express.Router();

workflowRouter.get("/health", async (req: Request, res: Response) => {
  try {
    return res.status(STATUS.OK).send("Workflow Service is Healthy");
  } catch (error) {
    logger.error("workflow :: health :: ", error);
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ errorCode: error, error });
  }
});
