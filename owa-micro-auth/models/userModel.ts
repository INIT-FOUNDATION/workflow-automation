import { IUser } from "../types/custom";
import Joi from "joi";


const validateLoginDetails = (user: IUser): Joi.ValidationResult => {
    const loginSchema = Joi.object({
        mobile_number: Joi.string().pattern(/^[1-9]\d{9}$/).required(),
        level: Joi.string(),
        password: Joi.string().required()
    });
    return loginSchema.validate(user);
};


export {
    validateLoginDetails
};
