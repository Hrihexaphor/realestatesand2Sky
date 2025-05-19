import React from "react";
import {  useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-[#1E1E50] text-white relative">
        <div className="text-center">
          <h1 className="text-7xl font-extrabold">404</h1>
          <p className="text-xl mt-4">This page is outside of the universe</p>
          <p className="text-md mt-2 text-gray-300">
            The page you are trying to access doesn't exist or has been moved.
          </p>
          <button
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
            onClick={() => navigate("/")} // Redirect to Home
          >
            Go to Homepage
          </button>
        </div>
        <div className="absolute top-10 left-10 bg-red-500 p-3 rounded-full"></div>
        <div className="absolute top-16 right-10 bg-blue-400 p-4 rounded-full"></div>
        <div className="absolute bottom-10 left-16 bg-yellow-400 p-2 rounded-full"></div>
        <div className="absolute bottom-10 right-16 bg-green-400 p-3 rounded-full"></div>
      </div>
    </div>
  );
};

export default Error;
