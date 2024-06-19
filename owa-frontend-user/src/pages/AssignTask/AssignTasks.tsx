import React from "react";
import { IonCard, IonCardHeader, IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import Header from "../Header/Header";
import "./AssignTasks.css";
import { CgProfile } from "react-icons/cg";

const AssignTasks: React.FC = () => {
  return (
    <>
      {/* <Header /> */}

      <div className="search-container pt-[9rem]">
        <IonIcon icon={searchOutline} className="search-icon" />
        <span className="search-text">Search</span>
      </div>
      <IonCard className="custom-card border border-gray-300 rounded p-4 mb-2">
        <IonCardHeader>
          <div>
            <span>payment collection</span>
          </div>
          <div className="flex items-center mt-2">
            <img
              src="Assets/images/MyTasks/calendar_icon.svg"
              alt=""
              className="calender-img"
            />
            <span className="ml-1 calender-date">June 17, 2024</span>
          </div>
          <div className="mt-1 flex items-center">
            <CgProfile color="black" size={22} />
            <span className="ml-2 font-medium">Neha</span>
          </div>
        </IonCardHeader>
      </IonCard>
    </>
  );
};

export default AssignTasks;
