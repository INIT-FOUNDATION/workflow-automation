import React, { useRef, useState } from 'react';
import { IonButton, IonIcon, IonButtons, IonPopover, IonContent, IonLabel, IonItem } from '@ionic/react';
import { notificationsOutline, ellipsisVerticalOutline } from 'ionicons/icons';
import { CgProfile } from 'react-icons/cg'; // Assuming you're using react-icons for CgProfile
import { AiOutlineLogout } from 'react-icons/ai'; // Assuming you're using react-icons for AiOutlineLogout

const Header: React.FC = () => {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLIonPopoverElement>(null);

  const openPopover = (event: React.MouseEvent<HTMLIonButtonElement>) => {
    event.persist();
    setShowPopover(true);
  };

  const profile = () => {
    // Handle profile action
  };

  const logOutTrigger = () => {
    // Handle logout action
  };

  return (
    <div className="flex items-center justify-between px-2 md:px-20 mt-3 pb-1 shadow">
      <div className="flex items-center">
        <img src="/Assets/images/Header/Header_logo.svg" className="w-16" alt="logo" />
      </div>

      <IonButtons slot="end">
        <IonButton>
          <IonIcon icon={notificationsOutline} size="large" />
        </IonButton>

        <IonButton onClick={openPopover}>
          <IonIcon icon={ellipsisVerticalOutline} size="large" />
        </IonButton>
      </IonButtons>

      <IonPopover
        ref={popoverRef}
        isOpen={showPopover}
        onDidDismiss={() => setShowPopover(false)}
      >
        {/* Popover Content */}
        <IonContent className="ion-padding">
          <IonItem lines="none" onClick={profile} button>
            <IonIcon icon={CgProfile} color="black" size="large" />
            <IonLabel className="text-black">Profile</IonLabel>
          </IonItem>
          <IonItem lines="none" onClick={logOutTrigger} button>
            <IonIcon icon={AiOutlineLogout} color="black" size="large" />
            <IonLabel className="text-black">Logout</IonLabel>
          </IonItem>
        </IonContent>
      </IonPopover>
    </div>
  );
};

export default Header;
