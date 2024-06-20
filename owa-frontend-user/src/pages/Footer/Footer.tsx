import React, { useState } from "react";
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
import TasksReport from "../TasksReport/TasksReport";
import { SKIP_FOOTER_ROUTES } from "../../constants/constant";
import "./Footer.css";
import CreateTasks from "../CreateTasks/CreateTasks";
import WorkFlowSelection from "../WorkFlowSelection/WorkFlowSelection";
import WorkFlowStarted from "../WorkFlowSelection/Component/WorkFlowStarted/WorkFlowStarted";

const Footer: React.FC = () => {
  const { pathname } = useLocation();
  const skipFooter = SKIP_FOOTER_ROUTES.includes(pathname);
  const [selectedTab, setSelectedTab] = useState("/tasks");

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  if (skipFooter) return null;

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tasks" component={MyTasks} exact={true} />
        <Route path="/assigned-tasks" component={AssignTasks} exact={true} />
        <Route path="/tasks-reports" component={TasksReport} exact={true} />
        <Route path="/create-tasks" component={CreateTasks} exact={true} />
        <Route
          path="/workflow-selection"
          component={WorkFlowSelection}
          exact={true}
        />
        <Route
          path="/workflow-started"
          component={WorkFlowStarted}
          exact={true}
        />

        <Redirect exact path="/" to="/tasks" />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton
          tab="tasks"
          href="/tasks"
          onClick={() => handleTabClick("/tasks")}
          className={selectedTab === "/tasks" ? "tab-button-red" : ""}
        >
          <img
            src="Assets/images/Footer/my_task.svg"
            alt="My Tasks"
            style={{ width: "24px", height: "24px" }}
            className={selectedTab === "/tasks" ? "tab-button-icon" : ""}
          />
          <IonLabel
            className={
              selectedTab === "/tasks" ? "tab-button-label" : "custom-font"
            }
          >
            My Tasks
          </IonLabel>
        </IonTabButton>

        <IonTabButton
          tab="assigned-tasks"
          href="/assigned-tasks"
          onClick={() => handleTabClick("/assigned-tasks")}
          className={selectedTab === "/assigned-tasks" ? "tab-button-red" : ""}
        >
          <IonIcon
            src="Assets/images/Footer/assigned_task.svg"
            style={{ width: "24px", height: "24px" }}
            className={
              selectedTab === "/assigned-tasks" ? "tab-button-icon" : ""
            }
          />
          <IonLabel
            className={
              selectedTab === "/assigned-tasks"
                ? "tab-button-label"
                : "custom-font"
            }
          >
            Assigned Tasks
          </IonLabel>
        </IonTabButton>

        <IonTabButton
          tab="tasks-reports"
          href="/tasks-reports"
          onClick={() => handleTabClick("/tasks-reports")}
          className={selectedTab === "/tasks-reports" ? "tab-button-red" : ""}
        >
          <img
            src="Assets/images/Footer/task_report.svg"
            alt="Task Report"
            style={{ width: "24px", height: "24px" }}
            className={
              selectedTab === "/tasks-reports" ? "tab-button-icon" : ""
            }
          />
          <IonLabel
            className={
              selectedTab === "/tasks-reports"
                ? "tab-button-label"
                : "custom-font"
            }
          >
            Task Report
          </IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Footer;
