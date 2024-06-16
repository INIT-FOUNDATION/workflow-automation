import { Request, Response } from "express";
import { logger, STATUS, envUtils } from "owa-micro-common";
import { FORM_STATUS, GRID_DEFAULT_OPTIONS } from "../constants/CONST";
import { formService } from "../services/formService";
import { FORMS } from "../constants/ERRORCODE";
import { Form, FormField } from "../models/formModel";
import { IForm, IFormFieldAssoc } from "../types/custom";
import moment from "moment";

export const formController = {
    health: (req: Request, res: Response): Response => {
        /*  
                #swagger.tags = ['Health']
                #swagger.summary = 'Health Check API'
                #swagger.description = 'Endpoint to health check Form Service'
        */
        return res.status(STATUS.OK).send({
            data: null,
            message: "Form Service is Healthy",
        });
    },

    getFields: async (req: Request, res: Response): Promise<Response> => {
        /*  
                #swagger.tags = ['Form Builder API']
                #swagger.summary = 'Get All Fields List API'
                #swagger.description = 'Endpoint to get all form fields',
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
        */
        try {
            logger.info(`formController :: Inside getFields`);
            const formFieldsList = await formService.getListOfFields();
            return res.status(STATUS.OK).send({
                data: formFieldsList,
                message: "All Fields Fetched Successfully",
            });

        } catch (error) {
            logger.error(`formController :: getFieldPropertiesByFieldId :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(FORMS.FORM00000);
        }
    },
    
    getFieldPropertiesByFieldId: async (req: Request, res: Response): Promise<Response> => {
        /*  
                #swagger.tags = ['Form Builder API']
                #swagger.summary = 'Get Field Properties by Field Id'
                #swagger.description = 'Endpoint to get all properties of fields',
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
        */
        try {
            logger.info(`formController :: Inside getFieldPropertiesByFieldId`);
            const fieldId = req.params.fieldId ? parseInt(req.params.fieldId) : null;

            if (!fieldId) {
                return res.status(STATUS.BAD_REQUEST).send(FORMS.FORM00008);
            }


            const formFieldPropertiesDetails = await formService.getFieldPropertiesByFieldId(fieldId);

            return res.status(STATUS.OK).send({
                data: formFieldPropertiesDetails,
                message: "Field Properties Details Fetched Successfully",
            });

        } catch (error) {
            logger.error(`formController :: getFieldPropertiesByFieldId :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(FORMS.FORM00000);
        }
    },

    getFormDetailsById: async (req: Request, res: Response): Promise<Response> => {
        /*  
                #swagger.tags = ['Form Builder API']
                #swagger.summary = 'Get Form details by form id'
                #swagger.description = 'Endpoint to get form details along with form fields'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
        */
        try {
            logger.info(`formController :: Inside getFormDetailsById`);
            const formId = req.params.formId ? parseInt(req.params.formId) : null;

            if (!formId) {
                return res.status(STATUS.BAD_REQUEST).send(FORMS.FORM00006);
            }


            const formDetails = await formService.getFormById(formId);
            const formFieldsDetails = await formService.getFormFieldsByFormId(formId);

            return res.status(STATUS.OK).send({
                data: {
                    formDetails,
                    formFieldsDetails
                },
                message: "Form Details Fetched Successfully",
            });

        } catch (error) {
            logger.error(`formController :: getFormDetailsById :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(FORMS.FORM00000);
        }
    },

    listForms: async (req: Request, res: Response): Promise<Response> => {
        /*  
                #swagger.tags = ['Form Builder API']
                #swagger.summary = 'Get all the forms list'
                #swagger.description = 'Endpoint to get forms list by page size and current page'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        page_size: 50,
                        current_page: 1,
                        search_query: "School Feedback Form"
                    }
                }   
        */
        try {
            logger.info(`formController :: Inside listForms`);
            const pageSize = req.body.page_size || GRID_DEFAULT_OPTIONS.PAGE_SIZE;
            let currentPage = req.body.current_page || GRID_DEFAULT_OPTIONS.CURRENT_PAGE;
            const searchQuery = req.body.search_query || "";

            if (currentPage > 1) {
                currentPage = (currentPage - 1) * pageSize;
            } else {
                currentPage = 0;
            }

            logger.info(`formController :: listForms :: pageSize :: ${pageSize} :: currentPage :: ${currentPage} :: searchQuery :: ${searchQuery}`);

            const formsGridData = await formService.listForms(pageSize, currentPage, searchQuery);


            logger.info(`formController :: listForms :: response :: ${JSON.stringify(formsGridData)}`);

            return res.status(STATUS.OK).send({
                data: formsGridData,
                message: "Form Fetched Successfully",
            });
        } catch (error) {
            logger.error(`formController :: listForms :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(FORMS.FORM00000);
        }
    },

    createForm: async(req: Request, res: Response) : Promise<Response> => {
        /*  
                #swagger.tags = ['Form Builder API']
                #swagger.summary = 'Create a dynamic form'
                #swagger.description = 'Endpoint to create a dynamic form'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        form_name: "School Survey Form 2",
                        form_description: "This form is used for taking feedback from schools cxzczx",
                        form_fields: [
                            {
                                field_id: 1,
                                options: {}
                            }
                        ]
                    }
                }   
        */
        try {
            logger.info(`formController :: Inside createForm`);
            const formData: IForm = new Form(req.body, req.plainToken);
            const { error } = Form.validateForm(formData);

            if (error) {
                logger.error(`formController :: createForm :: form validation failed :: error :: ${JSON.stringify(error)}`);
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: FORMS.FORM00001, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: FORMS.FORM00001, errorMessage: error.message });
            }


            const formFields = req.body.form_fields;

            logger.info(`formController :: createForm :: formFields :: ${JSON.stringify(formFields)}`);
            if (!(formFields && formFields.length > 0)) {
                return res.status(STATUS.BAD_REQUEST).send(FORMS.FORM00005);
            }

            let errorInFormField;
            const formFieldsAssoc: IFormFieldAssoc[] = [];
            for(let formField of formFields) {
                const formFieldAssoc: IFormFieldAssoc = new FormField(formField, req.plainToken);
                const { error } = FormField.validateFormFieldAssoc(formFieldAssoc);

                if (error) {
                    logger.error(`formController :: createForm :: form field validation failed :: error :: ${JSON.stringify(error)}`);
                    errorInFormField = error;
                    break;
                }
                formFieldsAssoc.push(formFieldAssoc);
            }

            if (errorInFormField) {
                if (errorInFormField.details != null) {
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: FORMS.FORM00001, errorMessage: errorInFormField.details[0].message });
                } else {
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: FORMS.FORM00001, errorMessage: errorInFormField.message });
                }
            }


            const isExists = await formService.checkIfFormExistsByName(formData.form_name);
            logger.info(`formController :: createForm :: formName :: ${formData.form_name} :: isExists :: ${isExists}`);
            if (isExists) {
                return res.status(STATUS.BAD_REQUEST).send(FORMS.FORM00004);
            }

            const formId = await formService.createForm(formData, formFieldsAssoc);

            return res.status(STATUS.OK).send({
                message: "Form created successfully",
                data: {formId}
            });

        } catch (error) {
            logger.error(`formController :: createForm :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(FORMS.FORM00000);
        }
    },

    updateForm: async(req: Request, res: Response) : Promise<Response> => {
        /*  
                #swagger.tags = ['Form Builder API']
                #swagger.summary = 'Update a dynamic form'
                #swagger.description = 'Endpoint to update a dynamic form'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        form_id: 7,
                        form_name: "School Survey Form 2",
                        form_description: "This form is used for taking feedback from schools cxzczx",
                        form_fields: [
                            {
                                field_id: 1,
                                options: {}
                            }
                        ]
                    }
                }   
        */
        try {
            logger.info(`formController :: Inside updateForm`);
            const formData: IForm = new Form(req.body, req.plainToken);

            if (!formData.form_id) {
                return res.status(STATUS.BAD_REQUEST).send(FORMS.FORM00006);
            }
            
            const formDataDB = await formService.getFormById(formData.form_id);
            if (!formDataDB) {
                logger.error(`formController :: updateForm :: form with id :: ${formData.form_id} not exists`);
                return res.status(STATUS.BAD_REQUEST).send(FORMS.FORM00007);
            }

            formData.updated_by = req.plainToken.user_id;
            formData.date_updated = moment().toISOString();
            
            const { error } = Form.validateForm(formData);

            if (error) {
                logger.error(`formController :: updateForm :: form validation failed :: error :: ${JSON.stringify(error)}`);
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: FORMS.FORM00001, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: FORMS.FORM00001, errorMessage: error.message });
            }


            const formFields = req.body.form_fields;
            
            logger.info(`formController :: updateForm :: formFields from UI :: ${JSON.stringify(formFields)}`);

            if (!(formFields && formFields.length > 0)) {
                return res.status(STATUS.BAD_REQUEST).send(FORMS.FORM00005);
            }

            let errorInFormField;
            const formFieldsAssoc: IFormFieldAssoc[] = [];
            for(let formField of formFields) {
                const formFieldAssoc: IFormFieldAssoc = new FormField(formField, req.plainToken);
                const { error } = FormField.validateFormFieldAssoc(formFieldAssoc);

                if (error) {
                    logger.error(`formController :: updateForm :: form field validation failed :: error :: ${JSON.stringify(error)}`);
                    errorInFormField = error;
                    break;
                }
                formFieldsAssoc.push(formFieldAssoc);
            }

            if (errorInFormField) {
                if (errorInFormField.details != null) {
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: FORMS.FORM00001, errorMessage: errorInFormField.details[0].message });
                } else {
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: FORMS.FORM00001, errorMessage: errorInFormField.message });
                }
            }


            const isExists = await formService.checkIfFormExistsByName(formData.form_name, formData.form_id);
            logger.info(`formController :: updateForm :: formName :: ${formData.form_name} :: isExists :: ${isExists}`);
            if (isExists) {
                return res.status(STATUS.BAD_REQUEST).send(FORMS.FORM00004);
            }

            await formService.updateForm(formData, formFieldsAssoc, req.plainToken.user_id);

            return res.status(STATUS.OK).send({
                message: "Form updated successfully",
                data: {form_id: formData.form_id}
            });

        } catch (error) {
            logger.error(`formController :: updateForm :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(FORMS.FORM00000);
        }
    },

    updateFormStatus: async (req: Request, res: Response): Promise<Response> => {
        /*  
                #swagger.tags = ['Form Builder API']
                #swagger.summary = 'Update a dynamic form status'
                #swagger.description = 'Endpoint to update a dynamic form status'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        form_id: 7,
                        status: 1
                    }
                }   
        */
        try {
            logger.info(`formController :: Inside updateFormStatus`);
            let { form_id, status } = req.body;

            logger.info(`formController :: updateFormStatus :: formId :: ${form_id} :: status :: ${status}`);

            if (!form_id) {
                return res.status(STATUS.BAD_REQUEST).send(FORMS.FORM00006);
            }

            status = status ? status : FORM_STATUS.INACTIVE;

            await formService.updateStatus(form_id, req.plainToken.user_id, status);

            return res.status(STATUS.OK).send({
                message: "Form Status updated successfully",
            });

        } catch (error) {
            logger.error(`formController :: updateFormStatus :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(FORMS.FORM00000);
        }
    },
}

