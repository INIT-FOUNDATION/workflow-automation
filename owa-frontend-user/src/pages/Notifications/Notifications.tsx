import React, { useState } from "react";
import "./Notifications.css";
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { IoMdArrowBack } from "react-icons/io";

interface NotificationProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const NotificationScreen: React.FC<NotificationProps> = ({
  isOpen,
  setIsOpen,
}) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="p-0">Notifications</IonTitle>
          <IonButtons slot="start">
            <IonButton
              className="flex align-center filter-heading"
              onClick={() => setIsOpen(false)}
            >
              <IoMdArrowBack size={25} color="#000" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="h-full py-6 px-4 ">
          <span className="font-medium text-lg"> Today (3)</span>
          <div className="flex items-center justify-between my-6 text-lg font-medium text-black">
            <img
              src="/Assets/images/Profile/Profile_img.svg"
              className="h-16 w-16 mr-4"
            ></img>
            <div className="text-md">
              <span className="font-semibold">Contact Lead</span>{" "}
              <span>Task assigned by Ramesh.</span>{" "}
              <span className="text-gray-400">2 hours ago</span>
            </div>
          </div>
          <div className="flex items-center justify-between my-6 text-lg font-medium text-black">
            <img
              src="/Assets/images/Profile/Profile_img.svg"
              className="h-16 w-16 mr-4"
            ></img>
            <div className="text-md">
              <span className="font-semibold">Contact Lead</span>{" "}
              <span>Task assigned by Ramesh.</span>{" "}
              <span className="text-gray-400">2 hours ago</span>
            </div>
          </div>
          <div className="flex items-center justify-between my-6 text-lg font-medium text-black">
            <img
              src="/Assets/images/Profile/Profile_img.svg"
              className="h-16 w-16 mr-4"
            ></img>
            <div className="text-md">
              <span className="font-semibold">Contact Lead</span>{" "}
              <span>Task assigned by Ramesh.</span>{" "}
              <span className="text-gray-400">2 hours ago</span>
            </div>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default NotificationScreen;
