import React, { useRef, useState } from "react";
import {
  IonButton,
  IonIcon,
  IonButtons,
  IonPopover,
  IonContent,
} from "@ionic/react";
import { notificationsOutline, ellipsisVerticalOutline } from "ionicons/icons";
import { CgProfile } from "react-icons/cg"; // Importing CgProfile
import { AiOutlineLogout } from "react-icons/ai";
import { useLocation } from "react-router";
import { SKIP_HEADER_ROUTES } from "../../constants/constant";

const Header: React.FC = () => {
  const location = useLocation();
  const { pathname } = location;

  const skipHeader = SKIP_HEADER_ROUTES.includes(pathname);
  if (skipHeader) return null;

  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLIonPopoverElement>(null);

  const openPopover = (event: React.MouseEvent<HTMLIonButtonElement>) => {
    event.persist();
    setShowPopover(true);
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
   
    // history.push('/profile'); 
  };

  return (
    <div className="flex items-center justify-between px-2 md:px-20 mt-3 pb-1">
      <div className="flex items-center">
        <img
          src="Assets/images/Header/Header_logo.svg"
          className="w-16"
          alt="logo"
        />
      </div>
      <IonButtons slot="end">
        <IonButton>
          <IonIcon
            icon={notificationsOutline}
            size="large"
            className="text-gray-500"
          />
        </IonButton>
        <IonButton id="click-trigger" onClick={openPopover}>
          <IonIcon
            icon={ellipsisVerticalOutline}
            size="large"
            className="text-gray-500"
          />
        </IonButton>
      </IonButtons>

      <IonPopover
        ref={popoverRef}
        isOpen={showPopover}
        onDidDismiss={() => setShowPopover(false)}
        trigger="click-trigger"
      >
        <IonContent className="ion-padding">
          <div
            className="flex justify-start items-center mb-3"
            style={{ cursor: "pointer" }}
            onClick={() => console.log("Profile clicked")}
          >
            <CgProfile color="black" size={22} />
            <span className="text-black m-0 ml-2" id="pop-over-text">
              Profile
            </span>
          </div>
          <div
            className="flex justify-start items-center"
            style={{ cursor: "pointer" }}
            onClick={() => console.log("Logout clicked")}
          >
            <AiOutlineLogout color="black" size={22} />
            <span className="text-black m-0 ml-2" id="pop-over-text">
              Logout
            </span>
          </div>
        </IonContent>
      </IonPopover>
    </div>
  );
};

export default Header;
