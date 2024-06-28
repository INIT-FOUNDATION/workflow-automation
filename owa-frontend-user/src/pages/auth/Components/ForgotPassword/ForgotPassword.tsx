import React, { useState } from "react";
import { IonInput, useIonRouter } from "@ionic/react";
import { useForm } from "react-hook-form";
import "./ForgotPassword.css";
import * as authService from "../../../../services/authService";
import { encrypt } from "../../../../utility/EncrytDecrypt";

interface ForgotPasswordProps {
  showSnackbar: (message: string, severity: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ showSnackbar }) => {
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
      const getOtpRequestResponse = await authService.otpRequest(payload);

      if (!getOtpRequestResponse.error) {
        showSnackbar("OTP sent successfully", "success");
        setOtpSent(true);
        setTxnId(getOtpRequestResponse?.data?.data?.txnId);
        console.log("TxnId after sending OTP:", getOtpRequestResponse?.data?.data?.txnId);
      } else {
        showSnackbar("Failed to send OTP. Please try again.", "error");
      }
    } else {
      showSnackbar("Please enter a valid Mobile Number", "error");
    }
  };
  const handleVerifyOtp = async () => {
    const { otp } = getValues();
    const payload = { txnId: txnId, otp: encrypt(otp) };
    
    const verifyOtpResponse = await authService.verifyOtpRequest(payload);
  
    if (!verifyOtpResponse.error) {
      showSnackbar("OTP verified successfully", "success");
      router.push("/reset-password"); 
    } else {
      showSnackbar("Invalid OTP. Please try again.", "error");
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
              <h2 className="text-2xl font-medium">Forgot Password</h2>
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
              disabled={otpSent} // Disable mobile input if OTP has been sent
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

export default ForgotPassword;
