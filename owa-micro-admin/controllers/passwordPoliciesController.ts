import { logger, STATUS } from "owa-micro-common";
import { Response } from "express";
import { Request } from "../types/express";
import { IPasswordPolicy } from "../types/custom";
import { PASSWORDPOLICIES } from "../constants/ERRORCODE";
import { passwordPoliciesService } from "../services/passwordPoliciesService";
import { PasswordPolicy, validateCreatePasswordPolicy, validateUpdatePasswordPolicy } from "../models/passwordPoliciesModel";

export const passwordPoliciesController = {
    listPasswordPolicies: async (req: Request, res: Response): Promise<Response> => {
        try {
            const passwordPolicies = await passwordPoliciesService.listPasswordPolicies();
            return res.status(STATUS.OK).send({
                data: passwordPolicies,
                message: "Password Policies Fetched Successfully",
            });
        } catch (error) {
            logger.error(`passwordPoliciesController :: listPasswordPolicies :: ${error.message} :: ${error}`);
            return res.status(STATUS.OK).send(PASSWORDPOLICIES.PASSWORDPOLICIES000);
        }
    },
    addPasswordPolicy: async (req: Request, res: Response): Promise<Response> => {
        try {
            const passwordPolicy: IPasswordPolicy = new PasswordPolicy(req.body)
            const { error } = validateCreatePasswordPolicy(passwordPolicy);

            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
                else return res.status(STATUS.BAD_REQUEST).send(error.message);
            }

            await passwordPoliciesService.createPasswordPolicy(passwordPolicy);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Password Policy Added Successfully",
            });
        } catch (error) {
            logger.error(`passwordPoliciesController :: addPasswordPolicy :: ${error.message} :: ${error}`);
            return res.status(STATUS.OK).send(PASSWORDPOLICIES.PASSWORDPOLICIES000);
        }
    },
    updatePasswordPolicy: async (req: Request, res: Response): Promise<Response> => {
        try {
            const passwordPolicy: IPasswordPolicy = req.body
            const { error } = validateUpdatePasswordPolicy(passwordPolicy);

            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
                else return res.status(STATUS.BAD_REQUEST).send(error.message);
            }

            const passwordPolicyExists = await passwordPoliciesService.existsByPasswordPolicyId(passwordPolicy.id);
            if (!passwordPolicyExists) return res.status(STATUS.BAD_REQUEST).send(PASSWORDPOLICIES.PASSWORDPOLICIES001);

            await passwordPoliciesService.updatePasswordPolicy(passwordPolicy);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Password Policy Updated Successfully",
            });
        } catch (error) {
            logger.error(`passwordPoliciesController :: updatePasswordPolicy :: ${error.message} :: ${error}`);
            return res.status(STATUS.OK).send(PASSWORDPOLICIES.PASSWORDPOLICIES000);
        }
    },
    getPasswordPolicyById: async (req: Request, res: Response): Promise<Response> => {
        try {
            const passwordPolicyId = req.params.passwordPolicyId;
            if (!passwordPolicyId) return res.status(STATUS.BAD_REQUEST).send(PASSWORDPOLICIES.PASSWORDPOLICIES002)

            const passwordPolicyExists = await passwordPoliciesService.existsByPasswordPolicyId(parseInt(passwordPolicyId));
            if (!passwordPolicyExists) return res.status(STATUS.BAD_REQUEST).send(PASSWORDPOLICIES.PASSWORDPOLICIES001);

            const passwordPolicy = await passwordPoliciesService.getPasswordPolicyById(parseInt(passwordPolicyId));

            return res.status(STATUS.OK).send({
                data: passwordPolicy,
                message: "Password Policy Fetched Successfully",
            });
        } catch (error) {
            logger.error(`passwordPoliciesController :: getPasswordPolicyById :: ${error.message} :: ${error}`);
            return res.status(STATUS.OK).send(PASSWORDPOLICIES.PASSWORDPOLICIES000);
        }
    },
}