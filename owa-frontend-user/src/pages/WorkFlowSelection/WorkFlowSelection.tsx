import React from "react";
import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";

const WorkFlowSelection: React.FC = () => {
  return (
    <div className="flex flex-col h-screen p-2">
      <div className="cursor-pointer rounded-md flex items-center pt-32">
        <IonIcon icon={arrowBack} className="pl-2" />
        <span className="search-text text-black-600 pl-2">Choose workflow</span>
      </div>
      <div className="flex-grow"></div>
      <div className="flex justify-center pb-16">
        <IonButton color="danger" className="bg-red-500 rounded w-full">Next</IonButton>
      </div>
    </div>
  );
};

export default WorkFlowSelection;
