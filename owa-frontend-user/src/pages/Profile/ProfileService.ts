import { post } from "../../utility/ApiCall";

const updateProfile = async (payload: any) => {
  const updatedProfileData = await post(
    "api/v1/user/admin/updateProfile",
    payload
  );
  return updatedProfileData;
};

const updateProfilePic = async (payload: any) => {
  const updatedProfileData = await post(
    "api/v1/user/admin/updateProfilePic",
    payload
  );
  return updatedProfileData;
};

export { updateProfile, updateProfilePic };
