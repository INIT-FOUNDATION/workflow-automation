import Joi from "joi";
import { IForm, IFormFieldAssoc } from "../types/custom";
import moment from "moment";
import { PlainToken } from "../types/express";
import { FORMS } from "../constants/ERRORCODE";


class Form implements IForm {
    form_id: number;
    form_name: string;
    form_description: string;
    status: number;
    date_created: string;
    date_updated: string;
    created_by: number;
    updated_by: number;
  
    constructor(form: IForm, plainToken: PlainToken) {
        this.form_id = form.form_id;
        this.form_name = form.form_name;
        this.form_description = form.form_description;
        this.status = form.status ? form.status : 1;
        this.date_created = form.date_created ? form.date_created : moment().toISOString();
        this.date_updated = form.date_updated ? form.date_updated : moment().toISOString();
        this.created_by = form.created_by ? form.created_by : plainToken.user_id;
        this.updated_by = form.updated_by ? form.updated_by : plainToken.user_id;
    }

    static validateForm = (form: IForm) : Joi.ValidationResult => {
        const formSchema = Joi.object({
            form_id: Joi.number().integer().optional(),
            form_name: Joi.string().min(3).max(50).required().error(
                new Error(JSON.stringify(FORMS.FORM00002))
            ),
            form_description: Joi.string().min(3).max(500).required().error(
                new Error(JSON.stringify(FORMS.FORM00003))
            ),
            status: Joi.number().integer().required(),
            date_created: Joi.string().allow("", null),
            date_updated: Joi.string().allow("", null),
            created_by: Joi.number().integer().required(),
            updated_by: Joi.number().integer().required(),
        });
        return formSchema.validate(form);
    }
}


class FormField implements IFormFieldAssoc {
    form_field_assoc_id: number;
    form_id: number;
    field_id: number;
    options: object;
    status: number;
    date_created: string;
    date_updated: string;
    created_by: number;
    updated_by: number;

    constructor(formFieldAssoc: IFormFieldAssoc, plainToken: PlainToken) {
        this.form_field_assoc_id = formFieldAssoc.form_field_assoc_id;
        this.form_id = formFieldAssoc.form_id;
        this.field_id = formFieldAssoc.field_id;
        this.options = formFieldAssoc.options;
        this.status = formFieldAssoc.status ? formFieldAssoc.status : 1;
        this.date_created = formFieldAssoc.date_created ? formFieldAssoc.date_created : moment().toISOString();
        this.date_updated = formFieldAssoc.date_updated ? formFieldAssoc.date_updated : moment().toISOString();
        this.created_by = formFieldAssoc.created_by ? formFieldAssoc.created_by : plainToken.user_id;
        this.updated_by = formFieldAssoc.updated_by ? formFieldAssoc.updated_by : plainToken.user_id;
    }


    static validateFormFieldAssoc = (formFieldAssoc: IFormFieldAssoc) : Joi.ValidationResult => {
        const formFieldAssocSchema = Joi.object({
            form_field_assoc_id: Joi.number().integer().optional(), 
            form_id: Joi.number().integer().optional(),
            field_id: Joi.number().integer().required(),
            options: Joi.object().required(),
            status: Joi.number().integer().required(),
            date_created: Joi.string().allow("", null),
            date_updated: Joi.string().allow("", null),
            created_by: Joi.number().integer().required(),
            updated_by: Joi.number().integer().required(),
        });
        return formFieldAssocSchema.validate(formFieldAssoc);
    }

}

export {
    Form,
    FormField
}