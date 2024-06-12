import Joi, { boolean } from "joi";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';

class validateLoginDetails {
  static validate(userDetails: any) : Joi.ValidationResult {
    const pattern = /^[0-9]{10}$/;
    const schema = {
        emailId: Joi.string()
            .trim()
            .regex(pattern)
            .required(),
        password: Joi.string().required()
    };
    return schema.validate(userDetails);
  }
}

class UpdateUser {
    userName: string;
    firstName: string;
    lastName: string;
    mobileNumber: number;
    emailId: string;
    gender: string;
    dob: string;
    profilePicUrl: string;
    dateUpdated: string;
    updatedBy: string;
  
    constructor (userDetails : {
        userName: string;
        firstName: string;
        lastName: string;
        mobileNumber: number;
        emailId: string;
        gender: string;
        dob: string;
        profilePicUrl: string;
        dateUpdated: string;
        updatedBy: string;
    }){
      this.userName = userDetails.userName;
      this.firstName = userDetails.firstName;
      this.lastName = userDetails.lastName;
      this.mobileNumber = userDetails.mobileNumber;
      this.emailId = userDetails.emailId;
      this.gender = userDetails.gender;
      this.dob = userDetails.dob;
      this.profilePicUrl = userDetails.profilePicUrl;
      this.dateUpdated = userDetails.dateUpdated;
      this.updatedBy = userDetails.updatedBy;
    }
  }

class validateUpdateUsers {
    static validate(userDetails: any) : Joi.ValidationResult {
      const pattern = /^[0-9]{10}$/;
      const schema = {
          emailId: Joi.string()
              .trim()
              .regex(pattern),
          password: Joi.string(),
          userName: Joi.string(),
          firstName: Joi.string(),
          lastName: Joi.string(),
          mobileNumber: Joi.number(),
          gender: Joi.string(),
          dob: Joi.string(),
          profilePicUrl: Joi.string(),
          dateUpdated: Joi.string(),
          updatedBy: Joi.string()
      };
      return schema.validate(userDetails);
    }
  }



export { 
    UpdateUser,
    validateLoginDetails,
    validateUpdateUsers

};