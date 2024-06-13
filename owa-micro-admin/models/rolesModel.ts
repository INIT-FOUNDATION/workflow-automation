import { ROLES_STATUS } from "../constants/CONST";
import { ROLES } from "../constants/ERRORCODE";
import { IRole } from "../types/custom";
import Joi from "joi";

class Role {
  role_id: number;
  role_name: string;
  role_description: string;
  status: number;
  date_created: string;
  date_updated: string;
  created_by: number;
  updated_by: number;

  constructor(role: {
    role_id: number;
    role_name: string;
    role_description: string;
    status: number;
    date_created: string;
    date_updated: string;
    created_by: number;
    updated_by: number;
  }) {
    this.role_id = role.role_id;
    this.role_name = role.role_name;
    this.role_description = role.role_description;
    this.status = role.status;
    this.date_created = role.date_created;
    this.date_updated = role.date_updated;
    this.created_by = role.created_by;
    this.updated_by = role.updated_by
  }
}

const validateCreateRole = (role: IRole): Joi.ValidationResult => {
  const roleSchema = Joi.object({
    role_id: Joi.number().allow("", null),
    role_name: Joi.string().min(3).max(20).required().error(
      new Error(JSON.stringify(ROLES.ROLE00001))
    ),
    role_description: Joi.string().min(3).max(50).required().error(
      new Error(JSON.stringify(ROLES.ROLE00002))
    )
  });
  return roleSchema.validate(role);
};

const validateUpdateRole = (role: IRole): Joi.ValidationResult => {
  const roleSchema = Joi.object({
    role_id: Joi.number().required(),
    role_name: Joi.string().min(3).max(20).required().error(
      new Error(JSON.stringify(ROLES.ROLE00001))
    ),
    role_description: Joi.string().min(3).max(50).required().error(
      new Error(JSON.stringify(ROLES.ROLE00002))
    )
  });
  return roleSchema.validate(role);
};

const validateUpdateRoleStatus = (role: IRole): Joi.ValidationResult => {
  const roleSchema = Joi.object({
    role_id: Joi.number().required(),
    status: Joi.number().allow(Object.values(ROLES_STATUS)).required().error(
      new Error(JSON.stringify(ROLES.ROLE00004))
    )
  });
  return roleSchema.validate(role);
};


export {
  Role,
  validateCreateRole,
  validateUpdateRole,
  validateUpdateRoleStatus
};