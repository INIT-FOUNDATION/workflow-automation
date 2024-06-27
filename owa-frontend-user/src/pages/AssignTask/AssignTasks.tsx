import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonIcon,
  IonInput,
} from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import "./AssignTasks.css";
const AssignTasks: React.FC = () => {
  return (
    <>
           <div className="flex items-center justify-center pt-24">
        <div className="flex items-center px-2 bg-neutral-100  border-gray-400 rounded-md w-[300px]">
          <IonIcon
            icon={searchOutline}
            className="w-5 h-5 mr-2 text-gray-500"
          />

          <IonInput
            type="text"
            placeholder="Search"
            className="text-gray-500"
          />
          {/* <span className="text-gray-500">Search</span> */}
        </div>
      </div>
      <div className="ml-4 mt-6 text-sm font-medium text-black ">
        <span>Assigned Tasks</span>
      </div>
      <IonCard className=" rounded-lg p-4 mb-2 bg-neutral-100 assign-task">
        <IonCardHeader>
          <IonCardSubtitle class="text-black text-[18px] text-left font-medium">
            Payment Collection
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="flex items-center mt-2">
            <IonIcon
              src="Assets/images/AssignTasks/calendar_month.svg"
              className="calender-img"
            ></IonIcon>

            <span className="ml-1 text-base font-medium text-black">
              June 17, 2024
            </span>
          </div>
          <div className="mt-1 flex items-center">
            <IonIcon
              src="Assets/images/AssignTasks/profile_icon.svg"
              className="calender-img"
            ></IonIcon>
            <span className="ml-2 font-medium text-black">Neha</span>
          </div>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default AssignTasks;
