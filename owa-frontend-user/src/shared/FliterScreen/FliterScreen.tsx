import React, { useState, useEffect } from "react";
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
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { IoMdArrowBack } from "react-icons/io";

interface FilterProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Dummy response simulating API data
const dummyResponse = {
  tabs: [
    {
      id: 1,
      name: "Time Range",
      checkboxes: ["Today", "This Week", "Month", "All Time"],
    },
    {
      id: 2,
      name: "Assigned By",
      checkboxes: ["Ramesh", "Suresh", "Shalini", "Priya"],
    },
  ],
};

const FliterScreen: React.FC<FilterProps> = ({ isOpen, setIsOpen }) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<Set<string>>(
    new Set()
  );

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
  };

  const handleCheckboxChange = (value: string) => {
    setSelectedCheckboxes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  const handleClearAll = () => {
    setSelectedCheckboxes(new Set());
  };

  const renderCheckboxes = (checkboxes: string[]) => {
    return checkboxes.map((checkbox) => (
      <IonCheckbox
        key={checkbox}
        className="mb-3"
        checked={selectedCheckboxes.has(checkbox)}
        onIonChange={() => handleCheckboxChange(checkbox)}
      >
        {checkbox}
      </IonCheckbox>
    ));
  };

  const activeTabData = dummyResponse.tabs.find((tab) => tab.id === activeTab);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="p-0">Task Filter</IonTitle>
          <IonButtons slot="start">
            <IonButton
              className="flex align-center filter-heading"
              onClick={() => setIsOpen(false)}
            >
              <IoMdArrowBack size={25} color="#000" />
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              className="clear-all-btn text-lg"
              onClick={handleClearAll}
            >
              CLEAR ALL
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="w-full h-full p-0">
          <IonRow className="w-full h-full">
            <IonCol
              size="auto"
              className="border-r-2 border-gray-300 bg-gray-200 p-0"
            >
              {dummyResponse.tabs.map((tab) => (
                <div
                  key={tab.id}
                  style={{ width: "150px" }}
                  className={`text-center bg-white p-4 mb-1 ${
                    activeTab === tab.id ? "active-tab" : ""
                  }`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.name}
                </div>
              ))}
            </IonCol>
            <IonCol className="border-gray-300 p-0">
              {activeTabData && (
                <div className="w-full flex flex-col align-center justify-center p-4">
                  {renderCheckboxes(activeTabData.checkboxes)}
                </div>
              )}
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
