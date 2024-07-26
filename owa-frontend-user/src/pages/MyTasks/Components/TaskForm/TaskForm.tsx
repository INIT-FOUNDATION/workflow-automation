import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonRadioGroup,
  IonRadio,
  useIonRouter,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useLocation } from "react-router";
import { getTaskFormDataByTaskAssignmentId, getTasksFormById, submitTaskForm } from "../../MyTasks.service";

const generateSchema = (fields: any[]) => {
  const shape: any = {};

  fields.forEach((field: any) => {
    const fieldType = field.options.find((opt: any) => opt.type !== undefined)?.type;
    const fieldName = field.options.find((opt: any) => opt.name !== undefined)?.name;
    const isRequired = field.options.find((opt: any) => opt.required !== undefined)?.required;
    const minLength = field.options.find((opt: any) => opt.minlength !== undefined)?.minlength;
    const maxLength = field.options.find((opt: any) => opt.maxlength !== undefined)?.maxlength;

    if (fieldName) {
      let validationSchema;

      switch (fieldType) {
        case "number":
          validationSchema = yup.number();
          break;
        case "text":
          validationSchema = yup.string();
          break;
        case "email":
          validationSchema = yup.string().email();
          break;
        case "password":
          validationSchema = yup.string();
          break;
        case "select":
          validationSchema = yup.string();
          break;
        case "boolean":
          validationSchema = yup.boolean();
          break;
        default:
          validationSchema = yup.mixed();
          break;
      }

      if (minLength !== undefined && validationSchema instanceof yup.StringSchema) {
        validationSchema = validationSchema.min(minLength, `Minimum length is ${minLength}`);
      }

      if (maxLength !== undefined && validationSchema instanceof yup.StringSchema) {
        validationSchema = validationSchema.max(maxLength, `Maximum length is ${maxLength}`);
      }

      if (isRequired) {
        validationSchema = validationSchema.required(`${fieldName} is required`);
      }
      shape[fieldName] = validationSchema;
    }
  });
  return yup.object().shape(shape);
};

const TaskForm: React.FC = () => {
  const router = useIonRouter();
  const { state }: any = useLocation();
  const [formDetails, setFormDetails] = useState<any>(null);
  const [validationSchema, setValidationSchema] = useState<any>(null);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur"
  });

  useEffect(() => {
    handleTaskFormById(state.form_id);
  }, [state.form_id]);

  useEffect(() => {
    if (formDetails) {
      setValidationSchema(generateSchema(formDetails));
    }
  }, [formDetails]);

  const handleBackClick = () => {
    router.push("/tasks");
  };

  const handleTaskFormById = async (formId: string) => {
    try {
      const response = await getTasksFormById(parseInt(formId));
      if (response && response.data && response.data.data) {
        setFormDetails(response.data.data.formFieldsDetails);
      }
      await getTaskFormByWorkflowAssignmentId();
    } catch (error) {
      console.error("Error fetching tasks by form ID:", error);
    }
  };

  const getTaskFormByWorkflowAssignmentId = async () => {
    try {
      const response = await getTaskFormDataByTaskAssignmentId(parseInt(state.workflow_task_assignment_id));
    } catch (error) {
      console.error("Error fetching tasks by workflow assignment ID:", error);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await submitTaskForm({
        workflow_task_assignment_id: state.workflow_task_assignment_id,
        form_id: state.form_id,
        form_data: data
      });
      router.push("/tasks");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <IonContent>
      <div className="flex flex-col p-4 pt-28">
        <div className="cursor-pointer rounded-md flex items-center mb-4">
          <IonIcon
            icon={arrowBack}
            onClick={handleBackClick}
            className="pl-2"
          />
          <span className="text-lg font-medium text-black pl-2">
            {state.task_name}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full space-y-4">
          {formDetails && formDetails.map((field: any) => {
            const fieldType = field.options.find((opt: any) => opt.type !== undefined)?.type;
            const fieldName = field.options.find((opt: any) => opt.name !== undefined)?.name;
            const fieldPlaceholder = field.options.find((opt: any) => opt.placeholder !== undefined)?.placeholder;
            const fieldLabel = field.options.find((opt: any) => opt.label !== undefined)?.label;
            const fieldOptions = field.options.find((opt: any) => opt.options !== undefined)?.options;
            const isRequired = field.options.find((opt: any) => opt.field_property_id === 5)?.required || false;

            return (
              <div key={field.form_field_assoc_id} className="mb-2">
                <Controller
                  name={fieldName}
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, onBlur, value, name, ref } }) => (
                    <IonItem>
                      <IonLabel position="floating">{fieldLabel}</IonLabel>
                      {fieldType === "dropdown" ? (
                        <IonSelect
                          placeholder={fieldPlaceholder}
                          onIonChange={e => onChange(e.detail.value)}
                          onBlur={onBlur}
                          value={value}
                          ref={ref}
                        >
                          {fieldOptions.map((option: any) => (
                            <IonSelectOption key={option.value} value={option.value}>
                              {option.label}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      ) : fieldType === "radio" ? (
                        <IonRadioGroup onIonChange={e => onChange(e.detail.value)} value={value}>
                          {fieldOptions.map((option: any) => (
                            <IonItem key={option.value}>
                              <IonLabel>{option.label}</IonLabel>
                              <IonRadio value={option.value} />
                            </IonItem>
                          ))}
                        </IonRadioGroup>
                      ) : fieldType === "checkbox" ? (
                        <IonCheckbox
                          checked={value}
                          onIonChange={e => onChange(e.detail.checked)}
                          onBlur={onBlur}
                          ref={ref}
                        />
                      ) : fieldType === "textArea" ? (
                        <IonTextarea
                          placeholder={fieldPlaceholder}
                          value={value}
                          onIonInput={e => onChange(e.detail.value)}
                          onBlur={onBlur}
                          ref={ref}
                        />
                      ) : (
                        <IonInput
                          placeholder={fieldPlaceholder}
                          type={fieldType}
                          value={value}
                          onIonInput={e => onChange(e.detail.value)}
                          onBlur={onBlur}
                          ref={ref}
                        />
                      )}
                    </IonItem>
                  )}
                />
                 {errors[fieldName as string] && (
                  <p className="text-red-500">
                    {(errors as any)[fieldName]?.message || "This field is required"}
                  </p>
                )}
              </div>
            );
          })}
          <div className="custom-btn flex justify-center pt-5 inset-x-2">
            <button
              className="rounded w-full create-task-button"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </IonContent>
  );
};

export default TaskForm;
