import { IonButton, IonIcon, IonInput, IonLabel, useIonRouter } from "@ionic/react";
import React from "react";
import "./Profile.css";
import { arrowBack } from "ionicons/icons";
import { useForm } from "react-hook-form";

const Profile: React.FC = () => {
  const router = useIonRouter();
  const handleBack = () => {
    router.push("/tasks");
  };
  const {
    handleSubmit,
    // formState: { errors },
  } = useForm();

  const onSubmit = () => {};
  return (
    <div className="workflow-selection-container scrollable-content h-full flex flex-col">
      <div className="cursor-pointer rounded-md flex items-center pt-28 w-full">
        <IonIcon icon={arrowBack} onClick={handleBack} className="pl-2" />
        <span className="search-text text-black-600 pl-2">Edit Profile</span>
      </div>
      <div className="profile-container flex justify-center items-center pt-2">
        <img
          src="Assets/images/Profile/Profile_img.svg"
          alt="Profile"
          className="profile-img"
        />
      </div>

      <div className="flex-grow">
        <form className="flex flex-col items-center w-full form-profile">
          <div className="input-group mb-4 w-full px-4">
            <IonLabel className="block text-black-600 text-sm">
              Full Name
            </IonLabel>
            <IonInput
              placeholder="Enter your full name"
              className="input-field w-full"
            />
          </div>
          <div className="input-group mb-4 w-full px-4">
            <IonLabel className="block text-black-600 text-sm">
              Email ID
            </IonLabel>
            <IonInput
              type="email"
              placeholder="Enter your email"
              className="input-field w-full"
            />
          </div>
          <div className="input-group mb-4 w-full px-4">
            <IonLabel className="block text-black-600 text-sm">
              Date of Birth
            </IonLabel>
            <IonInput type="date" className="input-field w-full" />
          </div>
          <div className="input-group mb-4 w-full px-4">
            <IonLabel className="block text-black-600 text-sm">Gender</IonLabel>
            <IonInput placeholder="Enter your gender" className="input-field w-full" />
          </div>
        </form>
      </div>
      <div className="pt-2 pb-8 w-full px-4">
        <IonButton
          color="danger"
          className="rounded-md w-full"
        >
          Save changes
        </IonButton>
      </div>
    </div>
  );
};

export default Profile;
