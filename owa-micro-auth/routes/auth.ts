import express, { Request, Response } from "express";
import { SupportSystemUser, ValidateSSRole, ValidateSSuser, ValidateSSuserLogin, ValidateUpdateSSUser } from "../model/ssUsers";
import { STATUS, redis, generateToken, mongoDBRead, mongoDB, logger, kafka, auditLog, auditLogModel } from "owa-micro-common";
import { ERRORCODE } from "../constants/ERRORCODE";
import { AUTH } from "../constants/AUTH";
import { } from "../services/authService";
import bcrypt from "bcryptjs";
import { MONGO_COLLECTIONS } from "../constants/MONGO_COLLECTIONS";
import {  } from "../constants/CONST";

export const authRouter = express.Router();

authRouter.get("/health", async (req: Request, res: Response) => {
  try {
    return res.status(STATUS.OK).send("Auth Service is Healthy");
  } catch (error) {
    logger.error("auth :: healthCheck :: ", error);
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ errorCode: error, error });
  }
});
