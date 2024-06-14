import {  } from "../constants/CONST";
import { ERRORCODE } from "../constants/ERRORCODE";
import { IUser } from "../types/custom";
import Joi from "joi";
  

const validateLoginDetails = (user: IUser) => {
    const userSchema = Joi.object({
        user_name: Joi.string(),
        password: Joi.string()
    });
    return userSchema.validate(user);
};
  
const validateUpdateUsers = (user: IUser) => {
    const userSchema = Joi.object({
        first_name: Joi.string(),
        last_name: Joi.string(),
        mobile_number: Joi.number(),
        email_id: Joi.string(),
        gender: Joi.string(),
        dob: Joi.string(),
        role_id: Joi.string(),
        password: Joi.string(),
        password_last_updated: Joi.string(),
        invalid_attempts: Joi.string(),
        status: Joi.string(),
        profile_pic_url: Joi.string()
    });
    return userSchema.validate(user);
}
  
export { 
    validateLoginDetails,
    validateUpdateUsers
  };
