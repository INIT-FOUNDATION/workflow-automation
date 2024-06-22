import React from "react";
import {
  IonCheckbox,
  IonLabel,
  IonItem,
  IonInput,
  IonTextarea,
} from "@ionic/react";
import {
  Button,
  FormControl,
  InputLabel,
  TextareaAutosize,
} from "@mui/material";

const NotificationTriggerDetails: React.FC = () => {
  return (
    <div style={{ height: "100vh", overflowY: "auto" }}>
      <div className="font-poppins text-base font-normal leading-5 mb-2">
        <div >Choose Notification</div>
      </div>
      <div className="flex space-x-4">
        <IonItem lines="none" className="flex-1  custom-ion-item">
          <IonCheckbox slot="start" />
          <IonLabel>Mail</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonCheckbox slot="start" />
          <IonLabel class="whitespace-nowrap">WhatsApp</IonLabel>
        </IonItem>
        <IonItem lines="none" className="flex-1">
          <IonCheckbox slot="start" />
          <IonLabel>SMS</IonLabel>
        </IonItem>
      </div>
      <IonItem lines="none" className="mb-4">
        <div className="mt-8">
          <div className="mb-4 ">Enter details for email</div>
          <IonInput
            label="Task Name *"
            labelPlacement="floating"
            fill="outline"
            // placeholder="Enter here"

            className="w-[140%]"
            required
            mode="md"
            type="text"
          ></IonInput>
        </div>
      </IonItem>
      <div className="mt-5">
        <IonTextarea
          id="description"
          labelPlacement="floating"
          label="Enter description here"
          fill="outline"
          className=" w-full border rounded-md p-2 text-black h-56 resize-y"
          style={{ minHeight: "56px" }}
          required
        ></IonTextarea>
      </div>

      <IonItem lines="none" className="mb-4">
        <div className="mt-5">
          <IonInput
            label="Task Name *"
            labelPlacement="floating"
            fill="outline"
            // placeholder="Enter here"

            className="w-[143%]"
            required
            mode="md"
            type="text"
          ></IonInput>
        </div>
      </IonItem>
      <div className="flex-grow">
        <div className="flex justify-center pb-16">
          <Button
            // onClick={() => handleNextClick()}
            variant="contained"
            color="error"
            className="w-full"
            type="submit"
          >
           Create Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationTriggerDetails;
