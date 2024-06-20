import React from "react";
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  useIonRouter,
} from "@ionic/react";
import "../../MyTasks.css";

const TaskOptionsDialogBox: React.FC = () => {
  const router = useIonRouter();

  const handleChooseWorkflow = () => {
    router.push("/workflow-selection");
  };

  const handleCreateTasks = () => {
    router.push("/create-tasks");
  };
  return (
    <IonContent className="ion-padding">
      <IonList>
        <IonItem button onClick={handleChooseWorkflow}>
          <IonLabel className="custom-popover-text">
            Choose existing workflow
          </IonLabel>
        </IonItem>
        <IonItem button onClick={handleCreateTasks}>
          <IonLabel className="custom-popover-text">Create new task</IonLabel>
        </IonItem>
      </IonList>
    </IonContent>
  );
};

export default TaskOptionsDialogBox;
