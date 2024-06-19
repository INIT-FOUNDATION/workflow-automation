import React from "react";
import { IonButton, IonIcon, useIonRouter } from "@ionic/react";
import { arrowBack } from "ionicons/icons";

const WorkFlowSelection: React.FC = () => {
  const router = useIonRouter();

  const handleNextClick = () => {
    console.log("Create new task clicked");
    router.push("/workflow-started");
  };

  return (
    <div className="flex flex-col h-screen p-2">
      <div className="cursor-pointer rounded-md flex items-center pt-32">
        <IonIcon icon={arrowBack} className="pl-2" />
        <span className="search-text text-black-600 pl-2">Choose workflow</span>
      </div>
      <div className="flex-grow"></div>
      <div className="flex justify-center pb-16">
        <IonButton
          onClick={handleNextClick}
          color="danger"
          className="bg-red-500 rounded w-full"
        >
          Next
        </IonButton>
      </div>
    </div>
  );
};

export default WorkFlowSelection;
