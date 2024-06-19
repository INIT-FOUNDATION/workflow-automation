import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonIcon,
  IonPopover,
} from "@ionic/react";
import { searchOutline } from "ionicons/icons";

import TaskOptionsDialogBox from "./Component/TaskOptionsDialogBox/TaskOptionsDialogBox";

import "./MyTasks.css";

const MyTasks: React.FC = () => {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <>
      <div className=" cursor-pointer rounded-md flex items-center pt-[8rem]">
        <IonIcon
          icon={searchOutline}
          className="search-icon w-5 h-5 mr-2 text-gray-500 pl-2"
        />
        <span className="search-text text-gray-500">Search</span>
      </div>
      <IonCard className="custom-card border border-gray-300 rounded p-4 mb-2 bg-gray-100">
        <IonCardHeader>
          <div className="flex items-center">
            <img
              src="Assets/images/MyTasks/task_done.svg"
              alt=""
              className="task-done-img w-5 h-5 mr-2"
            />
            <span className="form-title">School Feedback Form</span>
          </div>
          <div className="flex items-center mt-2">
            <img
              src="Assets/images/MyTasks/calendar_icon.svg"
              alt=""
              className="calender-img w-5 h-5 mr-2"
            />
            <span className="ml-1 calender-date">June 17, 2024</span>
          </div>
        </IonCardHeader>
      </IonCard>
      <div>
        <div className="add-task-container">
          <IonButton
            color="red"
            id="add-task-button" // Assign an ID to the button
            className="text-white flex justify-center bg-red-500 rounded add-task"
            onClick={() => setShowPopover(true)}
          >
            Add Task
          </IonButton>
          <IonPopover
            isOpen={showPopover}
            onDidDismiss={() => setShowPopover(false)}
            id="add-task-popover"
            trigger="add-task-button"
            side="top"
            alignment="center"
            className="custom-popover"
            // Set trigger to the ID of the button
          >
            <TaskOptionsDialogBox />
          </IonPopover>
        </div>
      </div>
    </>
  );
};

export default MyTasks;
