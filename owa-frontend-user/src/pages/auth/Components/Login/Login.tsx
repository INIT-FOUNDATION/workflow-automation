import React, { useState } from "react";
import "./Login.css";
import { IonInput, useIonRouter, IonIcon } from "@ionic/react";
import { useForm } from "react-hook-form";
import * as AppPreference from "../../../../utility/AppPreferences";
import * as authService from "../../../../services/authService";
import { encrypt } from "../../../../utility/EncrytDecrypt";
import { RouteProps } from "react-router";
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

interface LoginProps extends RouteProps {
  showSnackbar: (message: string, severity: string) => void;
}

const Login: React.FC<LoginProps> = ({ showSnackbar }) => {
  const router = useIonRouter();
  const { handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  // Initialize form with default values and criteria mode
  const form = useForm({
    defaultValues: {
      mobile_no: "",
      password: "",
    },
    criteriaMode: "all",
  });

  // Handle form submission
  const onSubmit = async () => {
    const { mobile_no, password } = form.getValues();

    // Encrypt password before sending
    const hashedPassword = await encrypt(password);

    // Prepare payload for login request
    const payload = {
      user_name: mobile_no,
      password: hashedPassword,
    };

    // Call login service
    const loginResponse = await authService.loginPassword(payload);

    if (!loginResponse.error) {
  console.log(loginResponse);
  
      AppPreference.setValue("userToken", loginResponse.data.data.token);
      router.push("/tasks");
    } else {
      if (
        loginResponse?.errorMessage.response.data.errorCode === "USRAUT0007"
      ) {
        let user_id = loginResponse?.errorMessage.response.data.userId;
        // Handle specific error case if needed
      } else {
        showSnackbar("Login failed. Please try again.", "error");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img src="Assets/images/Login/ollUserLogo.svg" alt="Login" />
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
              maxlength={10}
              required
              mode="md"
              type="tel"
              {...form.register("mobile_no")}
            ></IonInput>
          </div>

          <div className="mb-4 relative">
            <IonInput
              label="Enter your Password *"
              labelPlacement="floating"
              fill="outline"
              placeholder="Enter here"
              required
              mode="md"
              type={showPassword ? "text" : "password"}
              {...form.register("password")}
            ></IonInput>
            <IonIcon
              icon={showPassword ? eyeOffOutline : eyeOutline}
              onClick={() => setShowPassword(!showPassword)}
              className="eye-icon"
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
            />
            <div className="pt-2 text-right flex justify-start">
              <img src="Assets/images/LoginPage/lock.svg" alt="Lock" />
              <div
                className="text-red-600 ms-2 text-sm hover:text-red-700"
                onClick={() => router.push("/forgot-password")}
              >
                Forgot Password?
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-white py-2 rounded-md transition duration-200 submit-button"
          >
            Login
          </button>

          {/* OR Divider */}
          <div className="or-container my-4 flex items-center">
            <hr className="flex-grow border-gray-500" />
            <span className="mx-4 text-gray-500">OR</span>
            <hr className="flex-grow border-gray-500" />
          </div>

          <button
            type="button" // Changed to button to prevent default form submit
            className="w-full py-2 rounded-md transition duration-200 otp-button"
          >
            Login using OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
