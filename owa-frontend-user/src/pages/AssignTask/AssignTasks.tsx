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
import Header from "../Header/Header";
import "./AssignTasks.css";
import { CgProfile } from "react-icons/cg";

const AssignTasks: React.FC = () => {
  return (
    <>
      {/* <Header /> */}

      <div className="cursor-pointer mx-2 rounded-sm flex items-center pt-[8rem]">
        <IonIcon icon={searchOutline} className="search-icon" />
        <span className="search-text">Search</span>
      </div>
      <div className="ml-6 mt-8 text-sm font-medium text-black ">
        <span>Assigned Tasks</span>
      </div>
      <IonCard className="border border-gray-300 rounded p-4 mb-2">
        <IonCardHeader>
          <IonCardSubtitle>Payment Collection</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="flex items-center mt-2">
            <img
              src="Assets/images/MyTasks/calendar_icon.svg"
              alt=""
              className="calender-img"
            />
            <span className="ml-1 text-base font-medium text-black">June 17, 2024</span>
          </div>
          <div className="mt-1 flex items-center">
            <CgProfile color="black" size={22} />
            <span className="ml-2 font-medium text-black">Neha</span>
          </div>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default AssignTasks;
