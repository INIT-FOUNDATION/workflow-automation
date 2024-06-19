import React from "react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonRouterOutlet,
  IonIcon,
} from "@ionic/react";
import { Redirect, Route, useLocation } from "react-router-dom";
import MyTasks from "../MyTasks/MyTasks";
import AssignTasks from "../AssignTask/AssignTasks";
import { SKIP_FOOTER_ROUTES } from "../../constants/constant";
import "./Footer.css";
import TasksReport from "../TasksReport/TasksReport";

const Footer: React.FC = () => {
  const { pathname } = useLocation();
  const skipFooter = SKIP_FOOTER_ROUTES.includes(pathname);

  if (skipFooter) return null;

  const location = useLocation();
  console.log(location.pathname, "loc");

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tasks" component={MyTasks} exact={true} />
        <Route path="/assigned-tasks" component={AssignTasks} exact={true} />
        <Route path="/tasks-reports" component={TasksReport} exact={true} />
        <Redirect exact path="/" to="/tasks" />
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
          <IonIcon
            src="Assets/images/Footer/assigned_task.svg"
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
  );
};

export default Footer;
