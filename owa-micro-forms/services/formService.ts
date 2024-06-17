import { logger, redis } from "owa-micro-common";
import { IForm, IFormField, IFormFieldAssoc, IFormFieldProperties } from "../types/custom";
import { formRepository } from "../repository/formRepository";
import { CACHE_TTL, FORM_STATUS } from "../constants/CONST";
import moment from "moment";
import * as arrayUtil from "../utility/arrayUtility";


export const formService = {

    listForms: async(pageSize: number, currentPage: number, searchQuery: string) : Promise<{formsList: IForm[], total_count: number}> => {
        try {
            let formListRedisKey = "FORMS"
            let formListCountRedisKey = "FORMS_COUNT"
            const formsListResponse = {
                formsList: [],
                total_count: 0
            }

            if (searchQuery) {
                formListRedisKey += `|SEARCH:${searchQuery}`;
                formListCountRedisKey += `|SEARCH:${searchQuery}`;
            }
            
            if (pageSize) {
                formListRedisKey += `|LIMIT:${pageSize}`;
            }
        
            if (currentPage) {
                formListRedisKey += `|OFFSET:${currentPage}`;
            }

            const isFormsUpdatedWithin5mins = await formRepository.formsUpdatedWithinFiveMints();
            if (!isFormsUpdatedWithin5mins) {
                const formsListCached = await redis.GetKeyRedis(formListRedisKey);
                let isCachePresent = false;
                if (formsListCached) {
                    logger.debug(`formRepository :: listForms :: cached list :: ${formsListCached}`)
                    formsListResponse.formsList = JSON.parse(formsListCached);
                    isCachePresent = true;
                }
    
    
                const formsListCountCached = await redis.GetKeyRedis(formListCountRedisKey);
                if (formsListCountCached) {
                    logger.debug(`formRepository :: listForms :: cached count :: ${formsListCountCached}`)
                    formsListResponse.total_count = JSON.parse(formsListCountCached);
                    isCachePresent = true;
                }

                if (isCachePresent) return formsListResponse;
            }


            const listFormsData = await formRepository.listForms(pageSize, currentPage, searchQuery);
            redis.SetRedis(formListCountRedisKey, listFormsData.total_count, CACHE_TTL.LONG);
            redis.SetRedis(formListRedisKey, listFormsData.formsList, CACHE_TTL.LONG);

            return listFormsData;
        } catch (error) {
            logger.error(`formService :: listForms :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    checkIfFormExistsByName: async(formName: string, formId?: number) : Promise<boolean> => {
        try {
            const isExists = await formRepository.checkIfFormExistsByName(formName, formId);
            return isExists;
        } catch (error) {
            logger.error(`formService :: checkIfFormExistsByName :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    createForm: async(form: IForm, formFieldsAssoc: IFormFieldAssoc[]) : Promise<number> => {
        try {
            await formRepository.executeTransactionQuery("BEGIN");
            const formId = await formRepository.createForm(form);
            for (const formFieldAssoc of formFieldsAssoc) {
                formFieldAssoc.form_id = formId;
                await formRepository.createFormFieldAssoc(formFieldAssoc);
            }
            await formRepository.executeTransactionQuery("COMMIT");
            return formId;
        } catch (error) {
            await formRepository.executeTransactionQuery("ROLLBACK");
            logger.error(`formService :: createForm :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    updateForm: async(form: IForm, formFieldsAssocUI: IFormFieldAssoc[], user_id: number) : Promise<void> => {
        try {
            logger.info(`formService :: Inside updateForm :: form :: ${JSON.stringify(form)} :: formFieldsAssocUI :: ${JSON.stringify(formFieldsAssocUI)} :: user_id :: ${user_id}`);
            await formRepository.executeTransactionQuery("BEGIN");
            await formRepository.updateForm(form);
            
            const formFieldsAssocDB = await formRepository.getFormFieldsByFormId(form.form_id);
            logger.info(`formService :: Inside updateForm :: form :: ${JSON.stringify(form)} :: formFieldsAssocDB :: ${JSON.stringify(formFieldsAssocDB)}`);

            const formFieldsTransactions = {
                update: [],
                insert: [],
                delete: []
            }

            for (const formFieldAssocUI of formFieldsAssocUI) {
                formFieldAssocUI.form_id = form.form_id;
                const formFieldAssocDB = formFieldsAssocDB.find(ele => ele.form_field_assoc_id == formFieldAssocUI.form_field_assoc_id);
                if (formFieldAssocDB) {
                    formFieldAssocUI.status = FORM_STATUS.ACTIVE;
                    formFieldAssocUI.updated_by = 1;
                    formFieldAssocUI.date_updated = moment().toISOString();
                    formFieldAssocUI.form_field_assoc_id = formFieldAssocDB.form_field_assoc_id;
                    formFieldsTransactions.update.push(formFieldAssocUI);
                } else {
                    formFieldAssocUI.status = FORM_STATUS.ACTIVE;
                    formFieldAssocUI.updated_by = user_id;
                    formFieldAssocUI.created_by = user_id;
                    formFieldAssocUI.date_created = moment().toISOString();
                    formFieldAssocUI.date_updated = moment().toISOString();
                    formFieldsTransactions.insert.push(formFieldAssocUI);
                }
            }

            const formFieldsDeleted = arrayUtil.difference(formFieldsAssocDB, formFieldsTransactions.update, "form_field_assoc_id");
            formFieldsTransactions.delete = formFieldsDeleted;

            await formRepository.updateAllFormFieldsAssoc(formFieldsTransactions, user_id);

            await formRepository.executeTransactionQuery("COMMIT");
        } catch (error) {
            await formRepository.executeTransactionQuery("ROLLBACK");
            logger.error(`formService :: updateForm :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getFormById: async(formId: number) : Promise<IForm> => {
        try {
            logger.info(`formService :: Inside getFormById`);
            const formData = await formRepository.getFormByFormId(formId);
            return formData;
        } catch (error) {
            logger.error(`formService :: getFormById :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getFormFieldsByFormId: async(formId: number) : Promise<IFormFieldAssoc[]> => {
        try {
            logger.info(`formService :: Inside getFormById :: formId :: ${formId}`);
            const formFieldsData = await formRepository.getFormFieldsByFormId(formId);
            return formFieldsData;
        } catch (error) {
            logger.error(`formService :: getFormFieldsByFormId :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getFieldPropertiesByFieldId: async(fieldId: number) : Promise<IFormFieldProperties[]> => {
        try {
            logger.info(`formService :: Inside getFieldPropertiesByFieldId :: fieldId :: ${fieldId}`);
            const formFieldPropertiesData = await formRepository.getFormFieldPropertiesByFieldId(fieldId);
            return formFieldPropertiesData;
        } catch (error) {
            logger.error(`formService :: getFieldPropertiesByFieldId :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getListOfFields: async() : Promise<IFormField[]> => {
        try {
            logger.info(`formService :: Inside getListOfFields`);
            const formFieldsList = await formRepository.getFormFieldsList();
            return formFieldsList;
        } catch (error) {
            logger.error(`formService :: getFieldPropertiesByFieldId :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    updateStatus: async(formId: number, userId: number, status: number) : Promise<void> => {
        try {
            logger.info(`formService :: Inside updateStatus :: formId :: ${formId} :: userId :: ${userId}`);
            await formRepository.updateStatus(formId, userId, status);
        } catch (error) {
            logger.error(`formService :: updateStatus :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    }

};
