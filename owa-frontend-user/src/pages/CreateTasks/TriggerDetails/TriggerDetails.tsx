import React, { useState } from "react";
import "./TriggerDetails.css";
import { IonPage } from "@ionic/react";
import { ArrowBack } from "@mui/icons-material";
import { IconButton, Tabs, Tab, Box } from "@mui/material";
import { useHistory } from "react-router";

import NotificationTriggerDetails from "./NotificationTriggerDetails/NotificationTriggerDetails";
import ApiTriggerDetails from "./APITriggerDetails/APITriggerDetails";

const TriggerDetails: React.FC = () => {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleBackClick = () => {
    history.push("/create-tasks");
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <IonPage>
        <div className="flex flex-col p-2 mt-20">
          <div className="cursor-pointer rounded-md flex items-center pt-8">
            <IconButton onClick={handleBackClick}>
              <ArrowBack />
            </IconButton>
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
      </IonPage>
    </div>
  );
};

export default TriggerDetails;
