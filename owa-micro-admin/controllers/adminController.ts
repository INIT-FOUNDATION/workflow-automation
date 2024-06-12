import { Request, Response } from "express";
import { STATUS } from "owa-micro-common";

export const adminController = {
    health: (req: Request, res: Response): Response => {
        return res.status(STATUS.OK).send({
            data: null,
            message: "Admin Service is Healthy",
        });
    }
}
