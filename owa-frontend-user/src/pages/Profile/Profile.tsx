import { IonIcon, IonInput, IonLabel } from "@ionic/react";
import React from "react";
import "./Profile.css";
import { arrowBack } from "ionicons/icons";

const Profile: React.FC = () => {
  return (
    <div className="workflow-selection-container scrollable-content">
      <div className="cursor-pointer rounded-md flex items-center pt-32 w-full">
        <IonIcon icon={arrowBack} className="pl-2" />
        <span className="search-text text-black-600 pl-2">Choose workflow</span>
      </div>
      <div className="profile-container flex justify-center items-center pt-4">
        <img
          src="Assets/images/Profile/Profile_img.svg"
          alt="Profile"
          className="profile-img"
        />
      </div>

      <div className="profile-form-container pt-4 ">
        <form className="flex flex-col items-center w-full">
          <div className="input-group mb-4 w-full">
            <IonLabel className="block text-black-600 text-sm">
              Full Name
            </IonLabel>
            <IonInput
              placeholder="Enter your full name"
              className="input-field"
            />
          </div>
          <div className="input-group mb-4 w-full">
            <IonLabel className="block text-black-600 text-sm">
              Email ID
            </IonLabel>
            <IonInput
              type="email"
              placeholder="Enter your email"
              className="input-field"
            />
          </div>
          <div className="input-group mb-4 w-full">
            <IonLabel className="block text-black-600 text-sm">
              Date of Birth
            </IonLabel>
            <IonInput type="date" className="input-field" />
          </div>
          <div className="input-group mb-4 w-full">
            <IonLabel className="block text-black-600 text-sm">Gender</IonLabel>
            <IonInput placeholder="Enter your gender" className="input-field" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
