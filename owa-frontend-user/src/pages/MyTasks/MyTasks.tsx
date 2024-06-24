import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonActionSheet,
} from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import "./MyTasks.css";

const MyTasks: React.FC = () => {
  const [showActionSheet, setShowActionSheet] = useState(false);

  return (
    <>
      <div className="cursor-pointer rounded-md flex items-center pt-[8rem]">
        <IonIcon
          icon={searchOutline}
          className="search-icon w-5 h-5 mr-2 text-gray-500 pl-4"
        />
        <span className="search-text text-gray-500">Search</span>
      </div>
      <IonCard className="custom-card border border-gray-300 rounded p-4 mb-2 bg-neutral-100">
        <IonCardContent>
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
        </IonCardContent>
      </IonCard>
      <IonCard className="custom-card border border-gray-300 rounded p-4 mb-2 bg-neutral-100">
        <IonCardContent>
          <div className="flex items-center">
            <img
              src="Assets/images/MyTasks/task_done.svg"
              alt=""
              className="task-done-img w-5 h-5 mr-2"
            />
            <span className="form-title">B2B lead conversion</span>
          </div>
          <div className="flex items-center mt-2">
            <img
              src="Assets/images/MyTasks/calendar_icon.svg"
              alt=""
              className="calender-img w-5 h-5 mr-2"
            />
            <span className="ml-1 calender-date">June 10, 2024</span>
          </div>
        </IonCardContent>
      </IonCard>
      <div>
        <div className="add-task-container">
          <IonButton
            color="danger"
            id="add-task-button"
            className="rounded w-full add-task"
            onClick={() => setShowActionSheet(true)}
          >
            Add Task
          </IonButton>
         <div>
           <IonActionSheet
           className="my-custom-class"
            isOpen={showActionSheet}
            onDidDismiss={() => setShowActionSheet(false)}
            buttons={[
              {
                text: "Choose existing workflow",
                handler: () => {
                  setShowActionSheet(false);
                  window.location.href = "/tasks/workflow-selection";
                },
              },
              {
                text: "Create new task",
                handler: () => {
                  setShowActionSheet(false);
                  window.location.href = "/tasks/create-tasks";
                },
              },
            ]}
          />
         </div>
        </div>
      </div>
    </>
  );
};

export default MyTasks;
