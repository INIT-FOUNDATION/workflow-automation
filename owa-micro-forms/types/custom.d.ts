export interface IForm {
    form_id: number;
    form_name: string;
    form_description: string;
    status: number;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}


export interface IFormFieldAssoc {
    form_field_assoc_id: number;
    form_id: number;
    field_id: number;
    options: object;
    status: number;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}


export interface IFormFieldProperties {
    field_property_id: number;
    field_id: number;
    field_property_name: string;
    field_property_type: string;
    field_property_label_display: string;
    options: object;
    status: number;
    description: string;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}


export interface IFormField {
    field_id: number;
    field_name: string;
    field_label: string;
    status: number;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}