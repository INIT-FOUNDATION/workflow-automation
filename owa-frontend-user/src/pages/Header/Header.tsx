import React from "react";
import { IonToolbar, IonImg, IonIcon, IonButtons, IonButton, IonMenuButton } from "@ionic/react";
import { notificationsOutline, personOutline, logOutOutline, ellipsisVerticalOutline } from "ionicons/icons";

const Header: React.FC = () => {
  return (
    <div className="header-container">
      <IonToolbar>
        <IonImg src="assests/ollUserLogo" alt="logo" />
        <IonButtons slot="end">
          <IonButton>
            <IonIcon icon={notificationsOutline} size="large" />
          </IonButton>
          <IonMenuButton>
            <IonIcon icon={ellipsisVerticalOutline} size="large" />
          </IonMenuButton>
        </IonButtons>
      </IonToolbar>
      <div className="profile-container">
        <IonIcon icon={personOutline} size="large" />
        <span className="text-black m-0">Profile</span>
      </div>
      <div className="logout-container" onClick={() => console.log("Logout")}>
        <IonIcon icon={logOutOutline} size="large" />
        <span className="text-black m-0">Logout</span>
      </div>
    </div>
  );
};

export default Header;
