import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { calendarOutline, searchOutline } from "ionicons/icons";
import Header from "../Header/Header";
import "./MyTasks.css";

const MyTasks: React.FC = () => {
  //   const [showPopover, setShowPopover] = useState(false);

  //   const togglePopover = () => setShowPopover(!showPopover);

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
      <div className="add-task-container">
        <IonButton
          color="red"
          id="add-task-button"
          className="text-white flex justify-center bg-red-500 rounded add-task"
        >
          Add Task
        </IonButton>
        <IonPopover
          trigger="add-task-button"
          triggerAction="click"
          side="top"
          alignment="center"
          className="custom-popover"
        >
          <IonContent className="ion-padding">
            <IonList>
              <IonItem
                button
                onClick={() => console.log("Choose existing workflow clicked")}
              >
                <IonLabel className="custom-popover-text">
                  Choose existing workflow
                </IonLabel>
              </IonItem>
              <IonItem
                button
                onClick={() => console.log("Create new task clicked")}
              >
                <IonLabel className="custom-popover-text">
                  Create new task
                </IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>
      </div>
    </>
  );
};

export default MyTasks;
