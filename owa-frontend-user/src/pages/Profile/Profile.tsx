import React from "react";
import {
  IonButton,
  IonIcon,
  IonInput,
  IonLabel,
  useIonRouter,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useForm } from "react-hook-form";
import { updateProfile } from "../../services/profileService";
import "./Profile.css";

const Profile: React.FC = () => {
  const router = useIonRouter();

  const handleBack = () => {
    router.push("/tasks");
  };

  const { handleSubmit, register } = useForm();

  const onSubmit = async (payload: any) => {
    try {
      const updatedProfileData = await updateProfile(payload);
      if (updatedProfileData) {
        console.log("Profile updated successfully:", updatedProfileData);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center w-full form-profile"
        >
          <div className="input-group mb-4 w-full px-4">
            <IonLabel className="block text-black-600 text-sm">
              Full Name
            </IonLabel>
            <IonInput
              placeholder="Enter your full name"
              className="input-field w-full"
              {...register("full_name")} // Register each input with react-hook-form
            />
          </div>
          <div className="input-group mb-4 w-full px-4">
            <IonLabel className="block text-black-600 text-sm">
              Last Name
            </IonLabel>
            <IonInput
              placeholder="Enter your last name"
              className="input-field w-full"
              {...register("last_name")} // Register each input with react-hook-form
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
              {...register("email")} // Register each input with react-hook-form
            />
          </div>
          <div className="input-group mb-4 w-full px-4">
            <IonLabel className="block text-black-600 text-sm">
              Date of Birth
            </IonLabel>
            <IonInput
              type="date"
              className="input-field w-full"
              {...register("dob")} // Register each input with react-hook-form
            />
          </div>
          <div className="input-group mb-4 w-full px-4">
            <IonLabel className="block text-black-600 text-sm">
              Mobile no
            </IonLabel>
            <IonInput
              placeholder="Enter your mobile no"
              className="input-field w-full"
              {...register("mobile_no")} // Register each input with react-hook-form
            />
          </div>

          <IonButton
            type="submit"
            color="danger"
            className="rounded-md w-full px-4 pt-28"
          >
            Save changes
          </IonButton>
        </form>
      </div>
    </div>
  );
};

export default Profile;
