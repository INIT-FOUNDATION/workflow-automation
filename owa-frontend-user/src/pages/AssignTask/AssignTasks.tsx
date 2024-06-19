import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import "./AssignTasks.css";
import { CgProfile } from "react-icons/cg";

const AssignTasks: React.FC = () => {
  return (
    <>
      <div className="cursor-pointer mx-2 rounded-sm flex items-center pt-[8rem]">
        <IonIcon icon={searchOutline} className="search-icon mr-2 w-5 h-5 text-gray-500 pl-2"/>
        <span className="search-text text-gray-500">Search</span>
      </div>
      <div className="ml-4 mt-6 text-sm font-medium text-black ">
        <span>Assigned Tasks</span>
      </div>
      <IonCard className="border border-gray-100 rounded p-4 mb-2 bg-gray-100 assign-task">
        <IonCardHeader>
          <IonCardSubtitle class="text-black text-[18px] text-left font-medium">Payment Collection</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="flex items-center mt-2">
            <IonIcon src="Assets/images/AssignTasks/calendar_month.svg"
              
              className="calender-img"></IonIcon>
             
            
            <span className="ml-1 text-base font-medium text-black">June 17, 2024</span>
          </div>
          <div className="mt-1 flex items-center">
          <IonIcon src="Assets/images/AssignTasks/profile_icon.svg"
              
              className="calender-img"></IonIcon>
            <span className="ml-2 font-medium text-black">Neha</span>
          </div>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default AssignTasks;
