import Joi, { boolean } from "joi";
import {ERRORCODE} from '../constants/ERRORCODE';

class validateLoginDetails {
  static validate(userDetails: any) : Joi.ValidationResult {
    const pattern = /^[0-9]{10}$/;
    const schema = {
        email: Joi.string()
            .trim()
            .regex(pattern)
            .required(),
        password: Joi.string().required()
    };
    return schema.validate(userDetails);
  }
}

class validateUpdateUsers {
  static validate(userDetails: any) : Joi.ValidationResult {
  const userPattern = /^([ A-Za-z.\-()]){2,30}$/
  const schema = {
      first_name: Joi.string(),
      last_name: Joi.string(),
      display_name: Joi.string()
          .strict()
          .trim()
          .regex(userPattern)
          .error(
              new Error(`{"errorCode":"USRAUT0021", "error":"${ERRORCODE.USRAUT0021}"}`)
          ),
      gender: Joi.number().allow("", null),
      zip_code: Joi.string(),
      date_of_birth: Joi.date().allow("", null),
      date_modified: Joi.date(),
      updated_by: Joi.number(),
      email_id: Joi.string().allow("", null),
      experience: Joi.number().allow(null),
      about_me: Joi.string().allow(null),
  };

    return schema.validate(userDetails);
  }
}


export { 
  validateLoginDetails,
  validateUpdateUsers

};