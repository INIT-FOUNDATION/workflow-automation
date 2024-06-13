import Joi from "joi";
import { IUser } from "../types/custom";
import { USERS } from "../constants/ERRORCODE";
import { GENDER } from "../constants/CONST";
class User implements IUser {
  user_id: number;
  user_name: string;
  display_name: string;
  first_name: string;
  last_name: string;
  mobile_number: number;
  email_id: string;
  gender: number;
  dob: string;
  role_id: number;
  password: string;
  invalid_attempts: string;
  status: number;
  profile_pic_url: string;
  last_logged_in: string;
  date_created: string;
  date_updated: string;
  created_by: number;
  updated_by: number;

  constructor(user: IUser) {
    this.user_id = user.user_id;
    this.user_name = user.user_name;
    this.display_name = user.display_name;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.mobile_number = user.mobile_number;
    this.email_id = user.email_id;
    this.gender = user.gender;
    this.dob = user.dob;
    this.role_id = user.role_id;
    this.password = user.password;
    this.invalid_attempts = user.invalid_attempts;
    this.status = user.status;
    this.profile_pic_url = user.profile_pic_url;
    this.last_logged_in = user.last_logged_in;
    this.date_created = user.date_created;
    this.date_updated = user.date_updated;
    this.created_by = user.created_by;
    this.updated_by = user.updated_by;
  }
}

const validateCreateUser = (user: IUser): Joi.ValidationResult => {
  const userSchema = Joi.object({
    user_id: Joi.number().allow("", null),
    user_name: Joi.string().min(3).max(20).required().error(
      new Error(JSON.stringify(USERS.USER00001))
    ),
    display_name: Joi.string().min(3).max(50).required().error(
      new Error(JSON.stringify(USERS.USER00002))
    ),
    first_name: Joi.string().min(3).max(50).required().error(
      new Error(JSON.stringify(USERS.USER00003))
    ),
    last_name: Joi.string().min(3).max(50).required().error(
      new Error(JSON.stringify(USERS.USER00004))
    ),
    mobile_number: validateMobileNumber.string().mobile().required(),
    email_id: Joi.string().email().required(),
    gender: Joi.number().allow(Object.values(GENDER)).required(),
    role_id: Joi.number().required()
  });
  return userSchema.validate(user);
};

const validateUpdateUser = (user: IUser): Joi.ValidationResult => {
  const userSchema = Joi.object({
    user_id: Joi.number().required(),
    user_name: Joi.string().min(3).max(20).required().error(
      new Error(JSON.stringify(USERS.USER00001))
    ),
    display_name: Joi.string().min(3).max(50).required().error(
      new Error(JSON.stringify(USERS.USER00002))
    ),
    first_name: Joi.string().min(3).max(50).required().error(
      new Error(JSON.stringify(USERS.USER00003))
    ),
    last_name: Joi.string().min(3).max(50).required().error(
      new Error(JSON.stringify(USERS.USER00004))
    ),
    mobile_number: validateMobileNumber.string().mobile().required(),
    email_id: Joi.string().email().required(),
    gender: Joi.number().allow(Object.values(GENDER)).required(),
    role_id: Joi.number().required()
  });
  return userSchema.validate(user);
};

const validateMobileNumber = Joi.extend((joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.mobile': '{{#label}} must be a valid mobile number',
  },
  rules: {
    mobile: {
      validate(value, helpers) {
        if (/^[6789]\d{9}$/.test(value)) {
          return value;
        }
        return helpers.error('string.mobile');
      },
    },
  },
}));

export {
  User,
  validateCreateUser,
  validateUpdateUser
}