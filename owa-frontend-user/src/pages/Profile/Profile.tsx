import React, { useEffect } from "react";
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
import { useAuth } from "../../contexts/AuthContext";
import moment from "moment";

const Profile: React.FC = () => {
  const router = useIonRouter();
  const { userDetails } = useAuth();
  const { handleSubmit, register, setValue } = useForm();

  useEffect(() => {
    // Populate form fields with user details on component mount
    if (userDetails) {
      setValue("first_name", userDetails.data.first_name);
      setValue("last_name", userDetails.data.last_name);
      setValue("email_id", userDetails.data.email_id);
      setValue("dob", moment(userDetails.data.dob, "DD/MM/YYYY").format("YYYY-MM-DD"));  // Specify the input format
      setValue("mobile_number", userDetails.data.mobile_number);
    }
  }, [userDetails, setValue]);

  const handleBack = () => {
    router.push("/tasks");
  };

  const onSubmit = async (formData: any) => {
    try {
      const { mobile_number, ...profileData } = formData; // Exclude mobile_number from form data
      const updatedProfileData = await updateProfile(profileData);
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
              First Name
            </IonLabel>
            <IonInput
              placeholder="Enter your first name"
              className="input-field w-full"
              {...register("first_name")}
            />
          </div>
          <div className="input-group mb-4 w-full px-4">
            <IonLabel className="block text-black-600 text-sm">
              Last Name
            </IonLabel>
            <IonInput
              placeholder="Enter your last name"
              className="input-field w-full"
              {...register("last_name")}
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
              {...register("email_id")}
            />
          </div>
          <div className="input-group mb-4 w-full px-4">
            <IonLabel className="block text-black-600 text-sm">
              Date of Birth
            </IonLabel>
            <IonInput
              type="date"
              className="input-field w-full"
              {...register("dob")}
            />
          </div>
          <div className="input-group mb-4 w-full px-4">
            <IonLabel className="block text-black-600 text-sm">
              Mobile Number
            </IonLabel>
            <IonInput
              placeholder="Enter your mobile number"
              className="input-field w-full"
              {...register("mobile_number")}
              disabled
            />
          </div>

          <IonButton
            type="submit"
            color="danger"
            className="rounded-md w-full px-4 pt-28"
          >
            Save Changes
          </IonButton>
        </form>
      </div>
    </div>
  );
};

export default Profile;
