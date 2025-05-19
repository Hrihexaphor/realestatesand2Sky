import React from "react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { Link } from "react-router-dom";

const CancellationPolicy = () => {
  return (
    <div>
      <NewNav />
      <div className="bg-[#F4EFE5]">
        <div className="mb-4 ps-0">
          <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden">
            <img
              src="https://cdn.pixabay.com/photo/2016/10/06/17/28/architecture-1719526_640.jpg"
              alt="breadcrumb image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            <div className="absolute mt-5 inset-0 flex flex-col items-center justify-center text-white">
              <h2 className="text-3xl font-bold font-geometric-regular">Cancellation Policy</h2>
              <p className="mt-2 text-sm">
                <Link to="/" className="no-underline text-white font-semibold">Home</Link>
                <span className="mx-1">/</span>
                <span className="text-yellow-400 font-semibold">Cancellation Policy</span>
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-10 px-4">
          {/* Contact Form Section */}
          <div className="bg-white p-2 rounded-lg w-[70%] m-auto items-center justify-center">
            <h2 className="text-lg font-bold text-center my-2">Term of Service</h2>
            <div>
              
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CancellationPolicy;
