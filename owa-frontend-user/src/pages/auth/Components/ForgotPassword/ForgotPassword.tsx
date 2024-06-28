import { IonInput } from "@ionic/react";
import React from "react";
import "./ForgotPassword.css"

const ForgotPassword: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img src="Assets/images/Login/ollUserLogo.svg" alt="Login" />
        </div>
        <div className="mb-4">
          <div className="border-b border-gray-300" style={{ width: "98%" }}>
            <div className="ml-2">
              <h2 className="text-2xl font-medium">Forgot Password</h2>
            </div>
          </div>
        </div>
        <form>
          <div className="mb-4">
            <IonInput
              label="Enter your Mobile Number *"
              labelPlacement="floating"
              fill="outline"
              placeholder="Enter here"
              maxlength={10}
              required
              mode="md"
              type="tel"
            ></IonInput>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md transition duration-200 text-white otp-btn"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
