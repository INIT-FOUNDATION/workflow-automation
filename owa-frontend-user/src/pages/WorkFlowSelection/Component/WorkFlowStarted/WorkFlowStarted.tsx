import { IonCard, IonCardHeader, IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React from "react";
import "./WorkFlowStarted.css"

const WorkFlowStarted: React.FC = () => {
  return (
    <div>
      <div className="cursor-pointer rounded-md flex items-center pt-32">
        <IonIcon icon={arrowBack} className="pl-2" />
        <span className="search-text text-black-600 pl-2">
          B2B lead conversion
        </span>
      </div>
      <IonCard className="custom-card border border-gray-300 rounded mb-2 bg-gray-100">
        <IonCardHeader>
          <div className="flex items-center">
            <img
              src="Assets/images/MyTasks/task_done.svg"
              alt=""
              className="task-done-img w-5 h-5 mr-2"
            />
            <span className="form-title">Contact Lead</span>
          </div>
        </IonCardHeader>
      </IonCard>
    </div>
  );
};

export default WorkFlowStarted;
