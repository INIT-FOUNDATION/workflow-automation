import React, { useEffect, useState } from "react";
import { IonIcon, IonInput, IonLabel, useIonRouter } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useForm } from "react-hook-form";
import "./Profile.css";
import { useAuth } from "../../contexts/AuthContext";
import moment from "moment";
import { updateProfile, updateProfilePic } from "./ProfileService";
import { getLoggedInUserDetails } from "../../services/authService";
import { IconCloudUpload } from "@tabler/icons-react";
import CustomModal from "../../shared/CustomModal/CustomModal";
import ImageUploader from "../../shared/ImageUploader/ImageUploader";

const Profile: React.FC = () => {
  const router = useIonRouter();
  const { userDetails, addUserDetailsToContext } = useAuth();
  const { handleSubmit, register, setValue } = useForm();
  const [fileUpload, setFileUpload] = useState<any>(null);
  const [imageUploader, setImageUploader] = useState(false);

  useEffect(() => {
    if (userDetails) {
      setValue("first_name", userDetails.data.first_name);
      setValue("last_name", userDetails.data.last_name);
      setValue("email_id", userDetails.data.email_id);
      setValue(
        "dob",
        moment(userDetails.data.dob, "DD/MM/YYYY").format("YYYY-MM-DD")
      );
      setValue("mobile_number", userDetails.data.mobile_number);
    }
  }, [userDetails, setValue]);

  const handleBack = () => {
    router.push("/tasks");
  };

  const onSubmit = async (formData: any) => {
    try {
      const { mobile_number, ...profileData } = formData;
      const updatedProfileData = await updateProfile(profileData);

      if (fileUpload) {
        const formData = new FormData();
        formData.append("file", fileUpload);

        const updateProfilePicResponse = await updateProfilePic(formData);

        if (updateProfilePicResponse.error) {
          console.error("Error updating profile picture");
          return;
        }
      }

      if (updatedProfileData) {
        addUserDetailsToContext(updatedProfileData.data.data);
        getLoggedInUserDetails(addUserDetailsToContext);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleUploadedImage = (e: any) => {
    setImageUploader(true);
  };

  const handleImageUploader = () => {
    setImageUploader(!imageUploader);
  };

  return (
    <div className="workflow-selection-container scrollable-content h-full flex flex-col">
      <div className="cursor-pointer rounded-md flex items-center pt-20 w-full">
        <IonIcon icon={arrowBack} onClick={handleBack} className="pl-2" />
        <span className="search-text text-black-600 pl-2">Edit Profile</span>
      </div>

      {/* <div className="profile-container flex justify-center items-center pt-2">
        <img
          src="Assets/images/Profile/Profile_img.svg"
          alt="Profile"
          className="profile-img"
        />
      </div> */}

      <div
        className="flex justify-center items-center border border-dashed border-gray-500 rounded-full w-28 h-28 m-4 cursor-pointer bg-[#F2F2F2]"
        onClick={(e) => {
          handleUploadedImage(e);
        }}
      >
        {fileUpload || userDetails?.data?.profile_pic_url ? (
          <div className="flex justify-end items-end">
            <img
              src={
                fileUpload
                  ? URL.createObjectURL(fileUpload)
                  : userDetails?.data?.profile_pic_url
              }
              alt="profile"
              className="w-24 h-24 rounded-full"
            />
            <IconCloudUpload
              className="rounded-full absolute bg-[#db3525] p-1"
              color="white"
              size={30}
            />
          </div>
        ) : (
          <IconCloudUpload size={40} color="grey" />
        )}
      </div>
      <CustomModal
        isOpen={imageUploader}
        onRequestClose={handleImageUploader}
        className={"uploadPopupImage"}
        contentLabel={"Upload Image"}
      >
        <ImageUploader
          uploadFile={setFileUpload}
          allowedTypes={["image/png", "image/jpeg"]}
          maxSize={2}
          onClose={handleImageUploader}
          cropWidth={150}
          cropHeight={150}
        />
      </CustomModal>

      <div className="flex-grow">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center w-full form-profile"
        >
          <div className="input-group mb-4 w-full ps-4">
            <IonLabel className="block text-black-600 text-sm font-semibold mb-1">
              First Name
            </IonLabel>
            <IonInput
              placeholder="Enter your first name"
              className="input-field w-full"
              {...register("first_name")}
            />
          </div>
          <div className="input-group mb-4 w-full ps-4">
            <IonLabel className="block text-black-600 text-sm font-semibold mb-1">
              Last Name
            </IonLabel>
            <IonInput
              placeholder="Enter your last name"
              className="input-field w-full"
              {...register("last_name")}
            />
          </div>
          <div className="input-group mb-4 w-full ps-4">
            <IonLabel className="block text-black-600 text-sm font-semibold mb-1">
              Email ID
            </IonLabel>
            <IonInput
              type="email"
              placeholder="Enter your email"
              className="input-field w-full"
              {...register("email_id")}
            />
          </div>
          <div className="input-group mb-4 w-full ps-4">
            <IonLabel className="block text-black-600 text-sm font-semibold mb-1">
              Date of Birth
            </IonLabel>
            <IonInput
              type="date"
              className="input-field w-full"
              {...register("dob")}
            />
          </div>
          <div className="input-group mb-4 w-full ps-4">
            <IonLabel className="block text-black-600 text-sm font-semibold mb-1">
              Mobile Number
            </IonLabel>
            <IonInput
              placeholder="Enter your mobile number"
              className="input-field w-full"
              {...register("mobile_number")}
              disabled
            />
          </div>

          <button
            id="add-task-button"
            className="rounded w-full add-task create-task-button font-semibold flex justify-center items-center text-lg"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
