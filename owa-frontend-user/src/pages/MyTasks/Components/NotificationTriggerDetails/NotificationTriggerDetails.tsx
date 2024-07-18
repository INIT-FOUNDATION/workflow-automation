import React, { useState } from "react";
import {
  IonCheckbox,
  IonLabel,
  IonItem,
  IonInput,
  IonTextarea,
  IonContent,
  IonButton,
  IonRadioGroup,
  IonRadio,
} from "@ionic/react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { useLocation } from "react-router";

const NotificationTriggerDetails: React.FC = () => {
  const location = useLocation();
  const [selected, setSelected] = useState<string>("email");
  const [audience, setAudience] = useState("Select");

  const handleTargetAudienceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAudience(event.target.value);
  };

  return (
    <div>
      <div className="font-poppins text-base leading-5 mb-2 font-medium">
        Choose Notification Channel
      </div>
      <div className="flex items-center justify-center">
        <IonRadioGroup
          value={selected}
          onIonChange={(e) => setSelected(e.detail.value)}
        >
          <div className="flex space-x-10 ">
            <IonItem lines="none" className="flex-1 custom-ion-item">
              <IonRadio slot="start" value="email" />
              <IonLabel className="text-nowrap">Email</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonRadio slot="start" value="whatsapp" />
              <IonLabel className="whitespace-nowrap">WhatsApp</IonLabel>
            </IonItem>
            <IonItem lines="none" className="flex-1">
              <IonRadio slot="start" value="sms" />
              <IonLabel>SMS</IonLabel>
            </IonItem>
          </div>
        </IonRadioGroup>
      </div>
      {selected === "email" ? (
        <>
          <IonItem lines="none" className="mb-4 ">
            <div className="mt-8 w-full">
              <div className="mb-4 font-medium">Email details</div>
              <IonInput
                label="Subject"
                labelPlacement="floating"
                fill="outline"
                // placeholder="Enter here"

                className="w-full"
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
              className=" w-full rounded-md p-2 px-0 text-black h-48 resize-y"
              required
            ></IonTextarea>
          </div>

          <IonItem lines="none" className="mb-4">
            <div className="mt-5 w-full">
              <label className="font-medium">Target Audience</label>
              <TextField
                select
                value={audience}
                onChange={handleTargetAudienceChange}
                fullWidth
              >
                {["Select", "Admin", "User", "Accountant", "Cleark"].map(
                  (option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  )
                )}
              </TextField>
            </div>
          </IonItem>
        </>
      ) : selected === "whatsapp" ? (
        <IonItem lines="none" className="mb-4 ">
          <div className="mt-8 w-full">
            <div className="mb-4 font-medium">Whatsapp details</div>
            <IonInput
              label="Whatsapp Number"
              labelPlacement="floating"
              fill="outline"
              placeholder="Enter here"
              className="w-full"
              required
              mode="md"
              type="text"
            ></IonInput>
          </div>
        </IonItem>
      ) : (
        <IonItem lines="none" className="mb-4 ">
          <div className="mt-8 w-full">
            <div className="mb-4 font-medium">SMS details</div>
            <IonInput
              label="Mobile Number"
              labelPlacement="floating"
              fill="outline"
              placeholder="Enter here"
              className="w-full"
              required
              mode="md"
              type="text"
            ></IonInput>
          </div>
        </IonItem>
      )}
      <div className="flex-grow">
        <div className="flex justify-center">
          <button className="rounded w-full create-task-button" type="submit">
            Save Notification Trigger
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationTriggerDetails;
