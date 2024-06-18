import React, { useState } from "react";
import { IonCard, IonCardHeader, IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import Header from "../Header/Header";
import "./MyTasks.css";
import TaskOptionsDialogBox from "./Component/TaskOptionsDialogBox/TaskOptionsDialogBox";


const MyTasks: React.FC = () => {
  return (
    <>
      <Header />
      <div className="search-container">
        <IonIcon icon={searchOutline} className="search-icon" />
        <span className="search-text">Search</span>
      </div>
      <IonCard className="custom-card border border-gray-300 rounded p-4 mb-2">
        <IonCardHeader>
          <div className="flex items-center">
            <img
              src="Assets/images/MyTasks/task_done.svg"
              alt=""
              className="task-done-img"
            />
            <span className="form-title">School Feedback Form</span>
          </div>
          <div className="flex items-center mt-2">
            <img
              src="Assets/images/MyTasks/calendar_icon.svg"
              alt=""
              className="calender-img"
            />
            <span className="ml-1 calender-date">June 17, 2024</span>
          </div>
        </IonCardHeader>
      </IonCard>
      <TaskOptionsDialogBox />
    </>
  );
};

export default MyTasks;
