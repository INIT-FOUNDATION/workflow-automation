import { CACHE_TTL, FORM_STATUS } from "../constants/CONST";
import { redis, logger, pg } from "owa-micro-common";
import { IForm, IFormField, IFormFieldAssoc, IFormFieldProperties } from "../types/custom";
import { FORMS } from "../constants/QUERY";
import moment from "moment";


export const formRepository = {

    formsUpdatedWithinFiveMints: async() : Promise<boolean> => {
        try {
            logger.info("formRepository :: Inside formsUpdatedWithinFiveMints");

            const _queryToCheckLatestUpdated = {
                text: FORMS.latestUpdatedCheck
            };

            logger.debug(`formRepository :: latestUpdated :: query :: ${JSON.stringify(_queryToCheckLatestUpdated)}`)
            const latestUpdatedInForm = await pg.executeQueryPromise(_queryToCheckLatestUpdated);
            const isFormsUpdatedWithin5mins = (latestUpdatedInForm[0].count > 0);
            logger.info(`formRepository :: latestUpdated :: result :: ${JSON.stringify(latestUpdatedInForm)} :: isFormsUpdatedWithin5mins :: ${isFormsUpdatedWithin5mins}`);

            return isFormsUpdatedWithin5mins;
        } catch (error) {
            logger.error(`formRepository :: formsUpdatedWithinFiveMints :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    listForms: async(pageSize: number, currentPage: number, searchQuery: string) : Promise<{formsList: IForm[], total_count: number}> => {
        try {
            const _queryForListOfForms = {
                text: FORMS.listForms
            };

            const _queryForTotalCountForms = {
                text: FORMS.formsTotalCount
            };

            if (searchQuery) {
                _queryForListOfForms.text += ` AND form_name ILIKE %${searchQuery}%`;
                _queryForTotalCountForms.text += ` AND form_name ILIKE %${searchQuery}%`;
            }
            
            if (pageSize) {
                _queryForListOfForms.text += ` LIMIT ${pageSize}`;
            }
        
            if (currentPage) {
                _queryForListOfForms.text += ` OFFSET ${currentPage}`;
            }

            const formsListResponse = {
                formsList: [],
                total_count: 0
            }


            logger.debug(`formRepository :: listFormsCount :: query :: ${JSON.stringify(_queryForTotalCountForms)}`);

            const totalCountRes = await pg.executeQueryPromise(_queryForTotalCountForms);
            logger.debug(`usersService :: listUsersCount :: db result :: ${JSON.stringify(totalCountRes)}`)

            if (totalCountRes.length > 0) {
                formsListResponse.total_count = totalCountRes[0].count;
            };

            const formResult: IForm[] = await pg.executeQueryPromise(_queryForListOfForms);
            logger.debug(`formRepository :: listForms :: db result :: ${JSON.stringify(formResult)}`);
            
            if (formResult && formResult.length > 0) {
                formsListResponse.formsList = formResult;
            }
            return formsListResponse;
        } catch (error) {
            logger.error(`formRepository :: listForms :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    createForm: async(form: IForm) : Promise<number> => {
        try {
            logger.info(`formRepository :: Inside createForm`);
            const _query = {
                text: FORMS.createForm,
                values: [form.form_name, form.form_description, form.status, form.date_created, form.date_updated, form.created_by, form.updated_by]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`formRepository :: createForm :: result :: ${JSON.stringify(result)}`);
            return result[0].form_id;
        } catch (error) {
            logger.error(`formRepository :: createForm :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    updateForm: async(form: IForm) : Promise<void> => {
        try {
            logger.info(`formRepository :: Inside updateForm :: form :: ${JSON.stringify(form)}`);
            const _query = {
                text: FORMS.updateForm,
                values: [form.form_id, form.form_name, form.form_description, form.status, form.date_updated, form.updated_by]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`formRepository :: updateForm :: result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`formRepository :: updateForm :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },


    createFormFieldAssoc: async(formFieldAssoc: IFormFieldAssoc) : Promise<number> => {
        try {
            logger.info(`formRepository :: Inside createFormFieldAssoc`);
            const _query = {
                text: FORMS.createFormFieldAssoc,
                values: [formFieldAssoc.form_id, formFieldAssoc.field_id, formFieldAssoc.options, formFieldAssoc.status, formFieldAssoc.date_created, formFieldAssoc.date_updated, formFieldAssoc.created_by, formFieldAssoc.updated_by]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`formRepository :: createFormFieldAssoc :: result :: ${JSON.stringify(result)}`);
            return result[0].form_field_assoc_id;
        } catch (error) {
            logger.error(`formRepository :: createFormFieldAssoc :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    updateFormFieldAssoc: async(formFieldAssoc: IFormFieldAssoc) : Promise<void> => {
        try {
            logger.info(`formRepository :: Inside updateFormFieldAssoc :: formFieldAssoc :: ${JSON.stringify(formFieldAssoc)}`);
            const _query = {
                text: FORMS.updateFormFieldsAssoc,
                values: [formFieldAssoc.form_field_assoc_id, formFieldAssoc.options, formFieldAssoc.status, formFieldAssoc.date_updated, formFieldAssoc.updated_by]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`formRepository :: updateFormFieldAssoc :: result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`formRepository :: updateFormFieldAssoc :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },


    updateAllFormFieldsAssoc: async(formFieldsAssocTransaction: {insert: IFormFieldAssoc[], update: IFormFieldAssoc[], delete: IFormFieldAssoc[]}, userId: number) : Promise<void> => {
        try {
            logger.info(`formRepository :: Inside updateAllFormFieldsAssoc :: formFieldsAssocTransaction :: ${JSON.stringify(formFieldsAssocTransaction)}`);
            

            //Insert
            for (const formFieldAssoc of formFieldsAssocTransaction.insert) {
                await formRepository.createFormFieldAssoc(formFieldAssoc);
            }

            //update
            for (const formFieldAssoc of formFieldsAssocTransaction.update) {
                await formRepository.updateFormFieldAssoc(formFieldAssoc);
            }


            //delete
            for (const formFieldAssoc of formFieldsAssocTransaction.delete) {
                formFieldAssoc.status = FORM_STATUS.INACTIVE;
                formFieldAssoc.updated_by = userId;
                formFieldAssoc.date_updated = moment().toISOString();
                await formRepository.updateFormFieldAssoc(formFieldAssoc);
            }

            logger.info(`formRepository :: updateAllFormFieldsAssoc :: all fields updated successfully`);
        } catch (error) {
            logger.error(`formRepository :: updateAllFormFieldsAssoc :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    

    getFormByFormId: async(formId: number): Promise<IForm> => {
        try {
            logger.info(`formRepository :: Inside getFormByFormId :: formId :: ${formId}`);
            const _query = {
                text: FORMS.getFormById,
                values: [formId]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`formRepository :: getFormByFormId :: result :: ${JSON.stringify(result)}`);
            return result[0];
        } catch (error) {
            logger.error(`formRepository :: getFormByFormId :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getFormFieldsByFormId: async(formId: number): Promise<IFormFieldAssoc[]> => {
        try {
            logger.info(`formRepository :: Inside getFormFieldsByFormId :: formId :: ${formId}`);
            const _query = {
                text: FORMS.getFormFieldsByFormId,
                values: [formId]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`formRepository :: getFormFieldsByFormId :: result :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`formRepository :: getFormFieldsByFormId :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getFormFieldPropertiesByFieldId: async(fieldId: number): Promise<IFormFieldProperties[]> => {
        try {
            logger.info(`formRepository :: Inside getFormFieldPropertiesByFieldId :: fieldId :: ${fieldId}`);
            const _query = {
                text: FORMS.getFormFieldPropertiesByFieldId,
                values: [fieldId]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`formRepository :: getFormFieldPropertiesByFieldId :: result :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`formRepository :: getFormFieldPropertiesByFieldId :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getFormFieldsList: async(): Promise<IFormField[]> => {
        try {
            logger.info(`formRepository :: Inside getFormFieldsList`);
            const _query = {
                text: FORMS.getFormFieldsList,
                values: []
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`formRepository :: getFormFieldsList :: result :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`formRepository :: getFormFieldsList :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    updateStatus: async(formId: number, userId: number, status: number): Promise<void> => {
        try {
            logger.info(`formRepository :: Inside updateStatus :: formId :: ${formId} :: userId :: ${userId}`);
            const _query = {
                text: FORMS.updateFormStatus,
                values: [status, userId, moment().toISOString(), formId]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`formRepository :: updateStatus :: result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`formRepository :: updateStatus :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    

    checkIfFormExistsByName: async(formName: string, formId?: number) : Promise<boolean> => {
        try {
            const _query = {
                text: FORMS.formExistsByName,
                values: [formName.trim().toLowerCase()]
            }


            if (formId) {
                _query.text += ` AND form_id <> $2`;
                _query.values = [formName.trim().toLowerCase(), formId.toString()]; 
            }

            logger.debug(`formRepository :: checkIfFormExists :: query :: ${JSON.stringify(_query)}`)
            const result = await pg.executeQueryPromise(_query);
            const isExists = (result[0].count > 0);
            logger.info(`formRepository :: checkIfFormExists :: result :: ${JSON.stringify(result)} :: isExists :: ${isExists}`);
            return isExists;
        } catch (error) {
            logger.error(`formRepository :: checkIfFormExists :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    executeTransactionQuery: async(query: string) : Promise<void> => {
        try{
            logger.info(`formRepository :: executeTransactionQuery :: query :: ${query}`);
            await pg.transactionQuery(query);
        } catch(error) {
            logger.error(`formRepository :: executeTransactionQuery :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    }
};
