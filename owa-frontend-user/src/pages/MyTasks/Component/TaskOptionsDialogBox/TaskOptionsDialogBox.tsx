import React from "react";

import {
  IonButton,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import "../../MyTasks.css";
import { useHistory } from "react-router";
const TaskOptionsDialogBox: React.FC = () => {
  const history = useHistory();

  const handleChooseWorkflow = () => {
    history.push("/workflow-selection");
  };

  return (
    <div>
      <div className="add-task-container">
        <IonButton
          color="red"
          id="add-task-button"
          className="text-white flex justify-center bg-red-500 rounded add-task"
        >
          Add Task
        </IonButton>
        <IonPopover
          trigger="add-task-button"
          triggerAction="click"
          side="top"
          alignment="center"
          className="custom-popover"
        >
          <IonContent className="ion-padding">
            <IonList>
              <IonItem button onClick={handleChooseWorkflow}>
                <IonLabel className="custom-popover-text">
                  Choose existing workflow
                </IonLabel>
              </IonItem>
              <IonItem
                button
                onClick={() => console.log("Create new task clicked")}
              >
                <IonLabel className="custom-popover-text">
                  Create new task
                </IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>
      </div>
    </div>
  );
};

export default TaskOptionsDialogBox;
