import { logger, STATUS } from "owa-micro-common";
import { Response } from "express";
import { Request } from "../types/express";
import { IDepartment } from "../types/custom";
import { DEPARTMENTS } from "../constants/ERRORCODE";
import { departmentsService } from "../services/departmentsService";
import { Department, validateCreateDepartment, validateUpdateDepartment, validateUpdateDepartmentStatus } from "../models/departmentsModel";

export const departmentsController = {
    listDepartments: async(req: Request, res: Response): Promise<Response> => {
        try {
            const departments = await departmentsService.listDepartments();
            return res.status(STATUS.OK).send({
                data: departments,
                message: "Departments Fetched Successfully",
              });
        } catch (error) {
            logger.error(`departmentsController :: listDepartments :: ${error.message} :: ${error}`)
        }
    },
    addDepartment: async(req: Request, res: Response): Promise<Response> => {
        try {
            const department: IDepartment = new Department(req.body)
            const { error } = validateCreateDepartment(department);

            if (error) {
              if (error.details != null)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
              else return res.status(STATUS.BAD_REQUEST).send(error.message);
            } 

            await departmentsService.addDepartment(department);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Department Added Successfully",
              });
        } catch (error) {
            logger.error(`departmentsController :: addDepartment :: ${error.message} :: ${error}`)
        }
    },
    updateDepartment: async(req: Request, res: Response): Promise<Response> => {
        try {
            const department: IDepartment = req.body
            const { error } = validateUpdateDepartment(department);

            if (error) {
              if (error.details != null)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
              else return res.status(STATUS.BAD_REQUEST).send(error.message);
            } 

            const departmentExists = await departmentsService.existsByDepartmentId(department.department_id);
            if (!departmentExists) return res.status(STATUS.BAD_REQUEST).send(DEPARTMENTS.DEPARTMENT003);
            
            await departmentsService.updateDepartment(department);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Department Updated Successfully",
              });
        } catch (error) {
            logger.error(`departmentsController :: updateDepartment :: ${error.message} :: ${error}`)
        }
    },
    getDepartmentById: async(req: Request, res: Response): Promise<Response> => {
        try {
            const departmentId = req.params.departmentId;
            if (!departmentId) return res.status(STATUS.BAD_REQUEST).send(DEPARTMENTS.DEPARTMENT002)
            
            const departmentExists = await departmentsService.existsByDepartmentId(parseInt(departmentId));
            if (!departmentExists) return res.status(STATUS.BAD_REQUEST).send(DEPARTMENTS.DEPARTMENT003);
            
            const department = await departmentsService.getDepartmentById(parseInt(departmentId));

            return res.status(STATUS.OK).send({
                data: department,
                message: "Department Fetched Successfully",
              });
        } catch (error) {
            logger.error(`departmentsController :: getDepartmentById :: ${error.message} :: ${error}`)
        }
    },
    updateDepartmentStatus: async(req: Request, res: Response): Promise<Response> => {
        try {
            const department: IDepartment = req.body
            const { error } = validateUpdateDepartmentStatus(department);

            if (error) {
              if (error.details != null)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
              else return res.status(STATUS.BAD_REQUEST).send(error.message);
            } 

            const departmentExists = await departmentsService.existsByDepartmentId(department.department_id);
            if (!departmentExists) return res.status(STATUS.BAD_REQUEST).send(DEPARTMENTS.DEPARTMENT003);
            
            await departmentsService.updateDepartmentStatus(department.department_id, department.status);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Department Status Updated Successfully",
              });
        } catch (error) {
            logger.error(`departmentsController :: updateDepartmentStatus :: ${error.message} :: ${error}`)
        }
    },
}