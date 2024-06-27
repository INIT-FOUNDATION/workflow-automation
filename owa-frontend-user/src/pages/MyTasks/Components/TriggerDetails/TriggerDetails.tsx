import React, { useState } from "react";
import { IonContent, IonIcon, useIonRouter } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { Tabs, Tab, Box } from "@mui/material";
import "./TriggerDetails.css";

import NotificationTriggerDetails from "../NotificationTriggerDetails/NotificationTriggerDetails";
import ApiTriggerDetails from "../APITriggerDetails/APITriggerDetails";
import { useLocation } from "react-router";

const TriggerDetails: React.FC = () => {
  const router = useIonRouter();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleBackClick = () => {
    router.push("/tasks/create-tasks");
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const location = useLocation();
  console.log(location.pathname, "path");

  return (
    <IonContent>
      <div className="flex flex-col p-2 mt-20">
        <div className="cursor-pointer rounded-md flex items-center pt-4">
          <IonIcon
            icon={arrowBack}
            onClick={handleBackClick}
            className="pl-2"
          />

          <span className="text-lg font-medium text-black pl-2">
            Trigger Details
          </span>
        </div>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="tabs"
        >
          <Tab label="Notification" />
          <Tab label="API Trigger" />
        </Tabs>
        <Box p={3}>
          {selectedTab === 0 && <NotificationTriggerDetails />}
          {selectedTab === 1 && <ApiTriggerDetails />}
        </Box>
      </div>
    </IonContent>
  );
};

export default TriggerDetails;
