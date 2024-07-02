import React, { useRef, useState } from "react";
import {
  IonButton,
  IonIcon,
  IonButtons,
  IonPopover,
  IonContent,
  useIonRouter,
} from "@ionic/react";
import { notificationsOutline, ellipsisVerticalOutline } from "ionicons/icons";
import { CgProfile } from "react-icons/cg";
import { AiOutlineLogout } from "react-icons/ai";

import { SKIP_HEADER_ROUTES } from "../../constants/constant";
import { useAuth } from "../../contexts/AuthContext";
import { RouteProps, useLocation } from "react-router";

interface HeaderProps extends RouteProps {
  showSnackbar: (message: string, severity: string) => void;
}

const Header: React.FC<HeaderProps> = ({ showSnackbar }) => {
  const location = useLocation();
  const router = useIonRouter();
  const { pathname } = location;
  const { userDetails, logout } = useAuth();

  const skipHeader = SKIP_HEADER_ROUTES.includes(pathname);

  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLIonPopoverElement>(null);

  const openPopover = (
    event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>
  ) => {
    event.persist();
    setShowPopover(true);
  };

  const handleProfileClick = () => {
    router.push("/profile");
    setShowPopover(false);
  };

  const logOutTrigger = async () => {
    await logout();
    showSnackbar("Logged out successfully", "success");
  };

  if (skipHeader) return null;

  return (
    <div className="flex items-center justify-between px-2 md:px-20 pt-2 pb-2 fixed z-10 w-full">
      <div className="flex items-center mt-2">
        <img
          src="/Assets/images/Header/Header_logo.png"
          className="w-10 h-10 ml-2"
          alt="logo"
        />
      </div>
      <IonButtons slot="end">
        <IonButton>
          <IonIcon
            icon={notificationsOutline}
            size="medium"
            className="text-gray-500"
          />
        </IonButton>
        <IonButton id="click-trigger" onClick={openPopover}>
          <IonIcon
            icon={ellipsisVerticalOutline}
            size="medium"
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
            onClick={handleProfileClick}
          >
            <CgProfile color="black" size={22} />
            <span className="text-black m-0 ml-2" id="pop-over-text">
              Profile
            </span>
          </div>
          <div
            className="flex justify-start items-center"
            style={{ cursor: "pointer" }}
            onClick={logOutTrigger}
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
