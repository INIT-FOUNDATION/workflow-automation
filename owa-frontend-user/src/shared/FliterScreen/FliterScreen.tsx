import React, { useState } from "react";
import "./FliterScreen.css";
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
  IonToolbar,
} from "@ionic/react";

import { IoMdArrowBack } from "react-icons/io";

interface FilterProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const FliterScreen: React.FC<FilterProps> = ({ isOpen, setIsOpen }) => {
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = (event: any) => {
    setSearchText(event.target.value);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              className="flex align-center filter-heading"
              onClick={() => setIsOpen(false)}
            >
              <IoMdArrowBack size={25} color="#000" className="mr-2" />
              Task Filters
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton className="clear-all-btn">CLEAR ALL</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="w-full h-full p-0">
          <IonRow className="w-full h-full">
            <IonCol
              size="auto"
              className="border-r-2 border-t-2 border-gray-300 bg-gray-200 p-0"
            >
              <div
                style={{ width: "150px" }}
                className="text-center bg-white p-2"
              >
                Task Status
              </div>
            </IonCol>
            <IonCol className="border-t-2 border-gray-300 p-0">
              <div className="w-full flex flex-col align-center justify-center pt-2 px-4">
                <IonCheckbox className="mb-3"> In progress </IonCheckbox>
                <IonCheckbox className="mb-3"> Completed </IonCheckbox>
                <IonCheckbox className="mb-3"> Pending </IonCheckbox>
                <IonCheckbox className="mb-3"> Failed </IonCheckbox>
                <IonCheckbox className="mb-3"> To Do </IonCheckbox>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFooter className="w-full border-t-2 border-gray-300">
        <IonGrid className="p-0">
          <IonRow className="p-0">
            <IonCol className="p-0">
              <IonButton
                className="close-btn w-full m-0"
                onClick={() => setIsOpen(!isOpen)}
                fill="clear"
              >
                Close
              </IonButton>
            </IonCol>
            <IonCol className="p-0">
              <IonButton className="apply-btn w-full m-0" fill="clear">
                Apply
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonFooter>
    </IonModal>
  );
};

export default FliterScreen;
