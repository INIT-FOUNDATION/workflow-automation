import React from "react";
import "./Login.css";

const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8  w-full max-w-sm">
        <div className="flex justify-center mb-16">
          <img src="Assets/images/Login/ollUserLogo.svg" alt="Login" />
        </div>
        <div className="mb-4">
          <div className="border-b border-gray-300 pb-2" style={{ width: '98%' }}>
            <div className="ml-2">
              <h2 className="text-2xl font-medium">Login/SignUp</h2>
            </div>
          </div>
        </div>
        <form>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-grey"
            />
          </div>

          <button
            type="submit"
            className="w-full  text-white py-2 rounded-md transition duration-200 submit-button"
          >
            Get OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
