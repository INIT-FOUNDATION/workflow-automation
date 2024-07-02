import React, { useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonRow,
} from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import "./AssignTasks.css";
import FliterScreen from "../../shared/FliterScreen/FliterScreen";
const AssignTasks: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        <span>Assigned Tasks</span>
        <img
          src="/Assets/images/MyTasks/filter_alt.svg"
          alt="filter"
          className="w-6 h-6 mr-6"
          onClick={filterClick}
        />
        {isOpen && <FliterScreen isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>

      <IonGrid className="ion-no-padding">
        <IonRow>
          <IonCol size="12" size-md="6">
            <IonCard className="custom-card border border-gray-300 rounded p-4 mb-2 pt-3 shadow-md">
              <IonCardContent className="p-0">
                <div className="flex items-center">
                  <span className="form-title">School Feedback Form</span>
                </div>
                <div className="flex items-center mt-3 justify-between">
                  <div className="flex items-start flex-col">
                    <div className="flex items-center mb-1">
                      <IonIcon
                        src="Assets/images/MyTasks/calendar_icon.svg"
                        className="calendar-img w-5 h-5 mr-2"
                      ></IonIcon>
                      <span className="ml-1 calendar-date">June 10, 2024</span>
                    </div>

                    <div className="mt-1 flex items-center">
                      <IonIcon
                        src="Assets/images/AssignTasks/profile_icon.svg"
                        className="calendar-img w-5 h-5 mr-2"
                      ></IonIcon>
                      <span className="ml-2  font-medium text-black">Neha</span>
                    </div>
                  </div>
                  <button className="ml-2 px-3 py-1 bg-[#08670C] text-white text-sm rounded-full">
                    Completed
                  </button>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default AssignTasks;
