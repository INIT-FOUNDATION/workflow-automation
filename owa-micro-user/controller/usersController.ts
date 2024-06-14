import { Request, Response } from "express";
import { STATUS } from "owa-micro-common";

export const userController = {
    health: (req: Request, res: Response): Response => {
        return res.status(STATUS.OK).send({
            data: null,
            message: "User Service is Healthy",
        });
    }
}

