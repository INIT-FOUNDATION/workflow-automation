import React from "react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import { Route, Redirect } from "react-router";
import "./Footer.css";
import MyTasks from "../MyTasks/MyTasks";
import AssignTasks from "../AssignTask/AssignTasks";

const Footer: React.FC = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/myTasks" component={MyTasks} exact={true} />
          <Route path="/assignedTasks" component={AssignTasks} exact={true} />
          {/* /  <Route path="/search" render={() => <SearchPage />} exact={true} /> */}
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="myTasks" href="/myTasks">
            <img
              src="Assets/images/Footer/my_task.svg"
              alt="Task Report"
              style={{ width: "24px", height: "24px" }}
            />
            <IonLabel className="custom-font">My Task’s</IonLabel>
          </IonTabButton>

          <IonTabButton tab="assignedTasks" href="/assignedTasks">
            <img
              src="Assets/images/Footer/assigned_task.svg"
              alt="Task Report"
              style={{ width: "24px", height: "24px" }}
            />
            <IonLabel className="custom-font">Assigned Tasks</IonLabel>
          </IonTabButton>

          <IonTabButton tab="taskReport" href="/taskReport">
            <img
              src="Assets/images/Footer/task_report.svg"
              alt="Task Report"
              style={{ width: "24px", height: "24px" }}
            />
            <IonLabel className="custom-font">Task Report</IonLabel>
          </IonTabButton>

        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};
export default Footer;
