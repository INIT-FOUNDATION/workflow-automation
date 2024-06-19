import React from "react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, useLocation } from "react-router-dom";
import MyTasks from "../MyTasks/MyTasks";
import AssignTasks from "../AssignTask/AssignTasks";
import { SKIP_FOOTER_ROUTES } from "../../constants/constant";
import "./Footer.css";

const Footer: React.FC = () => {
  const { pathname } = useLocation();
  const skipFooter = SKIP_FOOTER_ROUTES.includes(pathname);

  if (skipFooter) return null;

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/tasks" />
          <Route path="/assignedges-tasks" render={() => <AssignTasks/>} exact={true} />
          <Route path="/tasks" render={() => <MyTasks/>} exact={true} />
          <Route path="/tasks-reports" render={() => <AssignTasks/>} exact={true} />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="tasks" href="/tasks">
            <img
              src="Assets/images/Footer/my_task.svg"
              alt="My Tasks"
              style={{ width: "24px", height: "24px" }}
            />
            <IonLabel className="custom-font">My Tasks</IonLabel>
          </IonTabButton>

          <IonTabButton tab="assigned-tasks" href="/assigned-tasks">
            <img
              src="Assets/images/Footer/assigned_task.svg"
              alt="Assigned Tasks"
              style={{ width: "24px", height: "24px" }}
            />
            <IonLabel className="custom-font">Assigned Tasks</IonLabel>
          </IonTabButton>

          <IonTabButton tab="tasks-reports" href="/tasks-reports">
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
