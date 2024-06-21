import React from "react";
import "./Login.css";
import { IonInput } from "@ionic/react";

const Login: React.FC = () => {
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
          <div className="mb-4">
            <IonInput
              label="Enter your Password *"
              labelPlacement="floating"
              fill="outline"
              placeholder="Enter here"
              required
              mode="md"
              type="password"
            ></IonInput>
            <div className="pt-2 text-right flex justify-start">
              <img src="Assets/images/LoginPage/lock.svg" alt="" />
              <a href="#" className="text-red-600 ms-2 text-sm hover:text-red-700">Forgot Password?</a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full text-white py-2 rounded-md transition duration-200 submit-button"
          >
            Login
          </button>
          <div className="or-container my-4 flex items-center">
            <hr className="flex-grow border-gray-500"/>
            <span className="mx-4 text-gray-500">OR</span>
            <hr className="flex-grow border-gray-500"/>
          </div>
          <button
            type="submit"
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
