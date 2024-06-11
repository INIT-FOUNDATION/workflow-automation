import Joi, { boolean } from "joi";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';


class SupportSystemUser {
  userId: string;
  emailId: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  mobileNumber: number;
  dialCode: string;
  supportSystemClientId: string;
  roleId: string;
  status: number;
  faceLockEnabled: number;
  faceUrl: string;

  constructor (ssDetails : {
    userId: string;
    emailId: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    mobileNumber: number;
    dialCode: string;
    supportSystemClientId: string;
    roleId: string;
    status: number;
    faceLockEnabled: number;
    faceUrl: string;
  }){
    this.userId = uuidv4();
    this.emailId = ssDetails.emailId;
    this.password = ssDetails.password;
    this.confirmPassword = ssDetails.confirmPassword;
    this.firstName = ssDetails.firstName;
    this.lastName = ssDetails.lastName;
    this.mobileNumber = ssDetails.mobileNumber;
    this.dialCode = ssDetails.dialCode;
    this.supportSystemClientId = ssDetails.supportSystemClientId;
    this.roleId = ssDetails.roleId;
    this.status = ssDetails.status;
    this.faceLockEnabled = ssDetails.faceLockEnabled;
    this.faceUrl = ssDetails.faceUrl;
  }
}

class ValidateSSuser {
  static validate(ssDetails: any) : Joi.ValidationResult {
    const schema = Joi.object({
      userId: Joi.string(),
      emailId: Joi.string().required(),
      confirmPassword: Joi.string().required(),
      password: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      mobileNumber: Joi.number().required(),
      dialCode: Joi.string().required(),
      supportSystemClientId: Joi.string().allow("", null),
      roleId: Joi.string().required(),
      status: Joi.number().allow("", null),
      faceLockEnabled: Joi.number().allow("", null),
      faceUrl: Joi.string().allow("", null)
    });
    return schema.validate(ssDetails);
  }
}


class ValidateSSuserLogin {
  static validate(ssDetails: any) : Joi.ValidationResult {
    const schema = Joi.object({
      emailId: Joi.string().required(),
      password: Joi.string().required()
    });
    return schema.validate(ssDetails);
  }
}

class ValidateSSRole {
  static validate(ssDetails: any) : Joi.ValidationResult {
    const schema = Joi.object({
      roleId: Joi.string(),
      roleName: Joi.string().required(),
      isPrimary: Joi.boolean().required(),
      isAdmin: Joi.boolean()
    });
    return schema.validate(ssDetails);
  }
}


class ValidateUpdateSSUser {
  static validate(ssDetails: any) : Joi.ValidationResult {
    const schema = Joi.object({
      emailId: Joi.string().required(),
      confirmPassword: Joi.string(),
      password: Joi.string(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      mobileNumber: Joi.number().required(),
      categories: Joi.array().items(
        Joi.object({
          categoryId: Joi.number().required().messages({
            'string.base': 'categoryId should be a number',
            'string.empty': 'categoryId cannot be an empty field',
            'any.required': 'categoryId is a required field'
          }),
          categoryName: Joi.string().required().messages({
            'string.base': 'categoryName should be a string',
            'string.empty': 'categoryName cannot be an empty field',
            'any.required': 'categoryName is a required field'
          })
        })
      )
    });
    return schema.validate(ssDetails);
  }
}


export { 
  SupportSystemUser,
  ValidateSSuser,
  ValidateSSuserLogin,
  ValidateSSRole,
  ValidateUpdateSSUser
};
