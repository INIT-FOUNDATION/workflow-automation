import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonActionSheet,
  useIonRouter,
  IonInput,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import "./MyTasks.css";
import FliterScreen from "../../shared/FliterScreen/FliterScreen";

const MyTasks: React.FC = () => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useIonRouter();

  const handleWorkFlow = () => {
    router.push("/tasks/workflow-selection");
  };

  const handleTasks = () => {
    router.push("/tasks/create-tasks");
  };

  const filterClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <IonContent>
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
        </div>
      </div>
      <div className="flex items-center justify-between ml-4 mt-6 text-lg font-medium text-black">
        <span>My Tasks (4)</span>
        <img
          src="/Assets/images/MyTasks/filter_alt.svg"
          alt="filter"
          className="w-6 h-6 mr-6"
          onClick={filterClick}
        />
        {isOpen && <FliterScreen isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>

      <IonGrid className="ion-no-padding overflow-y-auto">
        <IonRow>
          <IonCol size="12" size-md="6">
            <IonCard className="custom-card border border-gray-300 rounded-md p-4 mb-2 shadow-md">
              <IonCardContent className="p-0">
                <div className="flex items-center">
                  <span className="form-title">School Feedback Form</span>
                </div>
                <div className="flex items-center mt-2 justify-between">
                  <div className="flex items-center">
                    <img
                      src="Assets/images/MyTasks/calendar_icon.svg"
                      alt=""
                      className="calendar-img w-5 h-5 mr-2"
                    />
                    <span className="ml-1 calendar-date">June 10, 2024</span>
                  </div>
                  <button className="ml-2 px-3 py-1 bg-[#D68812] text-white text-sm rounded-full">
                    In Progress
                  </button>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="12" size-md="6">
            <IonCard className="custom-card border border-gray-300 rounded-md p-4 mb-2 shadow-md">
              <IonCardContent className="p-0">
                <div className="flex items-center">
                  <span className="form-title">Follow up from school</span>
                </div>
                <div className="flex items-center mt-2 justify-between">
                  <div className="flex items-center">
                    <img
                      src="Assets/images/MyTasks/calendar_icon.svg"
                      alt=""
                      className="calendar-img w-5 h-5 mr-2"
                    />
                    <span className="ml-1 calendar-date">June 10, 2024</span>
                  </div>
                  <button className="ml-2 px-3 py-1 bg-[#EA2531] text-white text-sm rounded-full">
                    Failed
                  </button>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol size="12" size-md="6">
            <IonCard className="custom-card border border-gray-300 rounded-md p-4 mb-2 shadow-md">
              <IonCardContent className="p-0">
                <div className="flex items-center">
                  <span className="form-title">B2B lead conversion</span>
                </div>
                <div className="flex items-center mt-2 justify-between">
                  <div className="flex items-center">
                    <img
                      src="Assets/images/MyTasks/calendar_icon.svg"
                      alt=""
                      className="calendar-img w-5 h-5 mr-2"
                    />
                    <span className="ml-1 calendar-date">June 10, 2024</span>
                  </div>
                  <button className="ml-2 px-3 py-1 bg-[#08670C] text-white text-sm rounded-full">
                    Completed
                  </button>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="12" size-md="6">
            <IonCard className="custom-card border border-gray-300 rounded-md p-4 mb-2 shadow-md">
              <IonCardContent className="p-0">
                <div className="flex items-center">
                  <span className="form-title">Contact Lead</span>
                </div>
                <div className="flex items-center mt-2 justify-between">
                  <div className="flex items-center">
                    <img
                      src="Assets/images/MyTasks/calendar_icon.svg"
                      alt=""
                      className="calendar-img w-5 h-5 mr-2"
                    />
                    <span className="ml-1 calendar-date">June 10, 2024</span>
                  </div>
                  <button className="ml-2 px-3 py-1 bg-[#284AA9] text-white text-sm rounded-full">
                    To Do
                  </button>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

      <div className="add-task-container">
        <IonButton
          color="danger"
          id="add-task-button"
          className="rounded w-full add-task font-semibold flex items-center text-lg"
          onClick={() => setShowActionSheet(true)}
        >
          Add Task
          <img src="Assets/images/MyTasks/add.svg" className="ml-1" />
        </IonButton>
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
    </IonContent>
  );
};

export default MyTasks;
