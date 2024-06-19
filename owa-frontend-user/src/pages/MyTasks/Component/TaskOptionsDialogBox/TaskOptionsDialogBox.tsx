import React from "react";
import {
  IonButton,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  useIonRouter,
} from "@ionic/react";
import "../../MyTasks.css";
import Footer from "../../../Footer/Footer";

const TaskOptionsDialogBox: React.FC = () => {
  const router = useIonRouter();

  const handleChooseWorkflow = () => {
    router.push("/workflow-selection");
  };

  return (
    <IonContent className="ion-padding">
      <IonList>
        <IonItem button onClick={handleChooseWorkflow}>
          <IonLabel className="custom-popover-text">
            Choose existing workflow
          </IonLabel>
        </IonItem>
        <IonItem button onClick={() => console.log("Create new task clicked")}>
          <IonLabel className="custom-popover-text">Create new task</IonLabel>
        </IonItem>
      </IonList>
    </IonContent>
  );
};

export default TaskOptionsDialogBox;
