import React, { ReactNode, useEffect } from "react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonRouterOutlet,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import { Redirect, useLocation } from "react-router-dom";
import "./Footer.css";

interface FooterProps {
  children: ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  const location = useLocation();
  const router = useIonRouter();
  const [selectedTab, setSelectedTab] = React.useState(location.pathname);

  const handleTabClick = (tab: string) => {
    if (selectedTab !== tab) {
      setSelectedTab(tab);
      router.push(tab);
    }
  };

  return (
    <IonTabs>
      <IonRouterOutlet>
        {children}
        <Redirect exact path="/" to="/tasks" />
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="custom-iontabbar">
        <IonTabButton
          tab="tasks"
          onClick={() => handleTabClick("/tasks")}
          className={selectedTab === "/tasks" ? "tab-button-red" : ""}
        >
          <IonIcon
            src={
              selectedTab === "/tasks"
                ? "Assets/images/Footer/my_task_tab.svg"
                : "Assets/images/Footer/my_task.svg"
            }
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
          onClick={() => handleTabClick("/assigned-tasks")}
          className={selectedTab === "/assigned-tasks" ? "tab-button-red" : ""}
        >
          <IonIcon
            src={
              selectedTab === "/assigned-tasks"
                ? "Assets/images/Footer/assigned_task_tab.svg"
                : "Assets/images/Footer/assigned_task.svg"
            }
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
          onClick={() => handleTabClick("/tasks-reports")}
          className={selectedTab === "/tasks-reports" ? "tab-button-red" : ""}
        >
          <IonIcon
            src={
              selectedTab === "/tasks-reports"
                ? "Assets/images/Footer/task_report_tab.svg"
                : "Assets/images/Footer/task_report.svg"
            }
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
