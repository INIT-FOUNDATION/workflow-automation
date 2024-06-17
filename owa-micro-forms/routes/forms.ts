import express from "express";
import { formController } from '../controllers/formController';

export const formsRouter = express.Router();


formsRouter.get("/health", formController.health);

formsRouter.post("/list", formController.listForms);

formsRouter.post("/create", formController.createForm);

formsRouter.post("/update", formController.updateForm);

formsRouter.get("/details/:formId", formController.getFormDetailsById);

formsRouter.get("/fieldPropertiesDetails/:fieldId", formController.getFieldPropertiesByFieldId);

formsRouter.get("/fields", formController.getFields);

formsRouter.post("/updateStatus", formController.updateFormStatus);
