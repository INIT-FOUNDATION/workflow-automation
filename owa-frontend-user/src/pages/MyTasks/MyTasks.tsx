import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonActionSheet,
  useIonRouter,
  IonInput,
} from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import "./MyTasks.css";

const MyTasks: React.FC = () => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const router = useIonRouter();

  const handleWorkFlow = () => {
    router.push("/tasks/workflow-selection");
  };
  const handleTasks = () => {
    router.push("/tasks/create-tasks");
  };
  return (
    <div>
      <div className="flex items-center justify-center pt-[6rem] px-4">
        <div className="flex items-center px-2 bg-neutral-100 border-gray-400 rounded-md w-full">
          <IonIcon
            icon={searchOutline}
            className="w-5 h-5 mr-2 text-gray-500"
          />
          <IonInput
            type="text"
            placeholder="Search"
            className="text-gray-500 w-full"
          />
          {/* <span className="text-gray-500">Search</span> */}
        </div>
      </div>
      <div className="flex items-center justify-between ml-4 mt-6 text-lg font-medium text-black">
        <span>Assigned Tasks</span>
        <img
          src="/Assets/images/MyTasks/filter_alt.svg"
          alt="filter"
          className="w-6 h-6 mr-6"
        />
      </div>

      <IonCard className="custom-card border border-gray-300 rounded p-4 mb-4 bg-neutral-100">
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
            <button className="ml-20 px-2 py-1 bg-orange-400 text-white text-sm rounded-xl">
              In Progress
            </button>
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
            <button className="ml-20 px-2 py-1 bg-green-500 text-white text-sm rounded-xl">
              completed
            </button>
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
            <span className="form-title">Follow up from school</span>
          </div>
          <div className="flex items-center mt-2">
            <img
              src="Assets/images/MyTasks/calendar_icon.svg"
              alt=""
              className="calender-img w-5 h-5 mr-2"
            />
            <span className="ml-1 calender-date">June 10, 2024</span>
            <button className="ml-20 px-2 py-1 bg-red-500 text-white text-sm rounded-xl">
              Failed
            </button>
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
            <span className="form-title">Contact Lead</span>
          </div>
          <div className="flex items-center mt-2">
            <img
              src="Assets/images/MyTasks/calendar_icon.svg"
              alt=""
              className="calender-img w-5 h-5 mr-2"
            />
            <span className="ml-1 calender-date">June 10, 2024</span>
            <button className="ml-20 px-2 py-1 bg-blue-600 text-white text-sm rounded-xl">
             To Do 
            </button>
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
                    handleWorkFlow();
                  },
                },
                {
                  text: "Create new task",
                  handler: () => {
                    setShowActionSheet(false);
                    handleTasks();
                  },
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
