import React, { useState } from "react";
import { IonInput, useIonRouter } from "@ionic/react";
import { useForm } from "react-hook-form";
import "./LoginOtp.css";
import { encrypt } from "../../../utility/EncrytDecrypt";
import * as authService from "../../../services/authService"
// import * as authService from "../../../../";

interface LoginOtpProps {
  showSnackbar: (message: string, severity: string) => void;
}

const LoginOtp: React.FC<LoginOtpProps> = ({ showSnackbar }) => {
  const router = useIonRouter();
  const [otpSent, setOtpSent] = useState(false);
  const [txnId, setTxnId] = useState("");

  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      mobile_no: "",
      otp: "",
    },
  });

  const goBackToLoginPage = () => {
    router.push("/login");
  };

  const handleSendOtp = async () => {
    const { mobile_no } = getValues();
    const mobileNumberPattern = /^[6-9]\d{9}$/;

    if (mobileNumberPattern.test(mobile_no)) {
      const payload = { mobile_number: mobile_no };
      try {
        const getOtpRequestResponse = await authService.loginWithMobile(payload);

        if (!getOtpRequestResponse.error) {
          showSnackbar("OTP sent successfully", "success");
          setOtpSent(true);
          setTxnId(getOtpRequestResponse?.data?.txnId);
        } else {
          showSnackbar("Failed to send OTP. Please try again.", "error");
        }
      } catch (error) {
        console.error("Error in OTP request:", error);
        showSnackbar("An error occurred. Please try again.", "error");
      }
    } else {
      showSnackbar("Please enter a valid Mobile Number", "error");
    }
  };

  const handleVerifyOtp = async () => {
    const { otp } = getValues();

    if (!txnId) {
      showSnackbar("Transaction ID is missing. Please resend the OTP.", "error");
      return;
    }

    const payload = { txnId, otp: encrypt(otp) };

    try {
      const verifyOtpResponse = await authService.verifyMobileOtp(payload);

      if (!verifyOtpResponse.error) {
        showSnackbar("OTP verified successfully", "success");
        router.push("/tasks");
      } else {
        showSnackbar("Invalid OTP. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error in OTP verification:", error);
      showSnackbar("An error occurred. Please try again.", "error");
    }
  };

  const onSubmit = otpSent ? handleVerifyOtp : handleSendOtp;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img
            src="Assets/images/Login/ollUserLogo.svg"
            alt="Login"
            onClick={goBackToLoginPage}
          />
        </div>
        <div className="mb-4">
          <div className="border-b border-gray-300" style={{ width: "98%" }}>
            <div className="ml-2">
              <h2 className="text-2xl font-medium">Login</h2>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <IonInput
              label="Enter your Mobile Number *"
              labelPlacement="floating"
              fill="outline"
              placeholder="Enter here"
              maxLength={10}
              required
              mode="md"
              type="tel"
              {...register("mobile_no")}
              disabled={otpSent}
            ></IonInput>
          </div>
          {otpSent && (
            <div className="mb-4">
              <IonInput
                label="Enter OTP *"
                labelPlacement="floating"
                fill="outline"
                placeholder="Enter OTP here"
                maxLength={6}
                required
                mode="md"
                type="tel"
                {...register("otp")}
              ></IonInput>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 rounded-md transition duration-200 text-white otp-btn"
          >
            {otpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginOtp;
