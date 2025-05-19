import React from "react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { Link } from "react-router-dom";

const ContactPage = () => {
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
              <h2 className="text-3xl font-bold font-geometric-regular">Contact Us</h2>
              <p className="mt-2 text-sm">
                <Link to="/" className="no-underline text-white font-semibold">Home</Link>
                <span className="mx-1">/</span>
                <span className="text-yellow-400 font-semibold">Contact</span>
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-10 px-4">
          {/* Contact Form Section */}
          <div className="flex items-center justify-center">
            <div className="w-full flex flex-col lg:flex-row lg:mt-5 mb-5">
              {/* Left Section */}
              <div className="lg:w-1/2 w-full flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-[#3C4142]">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-600 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum explicabo reprehenderit optio amet ab temporibus asperiores quasi cupiditate. Voluptatum ducimus voluptates voluptas?
                </p>
                <div className="mt-6 m-auto">
                  <img
                    src="https://www.poornima.org/img/contact-img.png"
                    alt="Contact Illustration"
                  />
                </div>
              </div>

              {/* Right Section - Contact Form */}
              <div className="md:w-1/2 p-6 bg-white rounded-lg shadow-lg contact-box">
                <h3 className="text-2xl font-bold text-[#3C4142] text-center mb-[52px]">
                  Want to Know more, let's connect.
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold">
                      Message
                    </label>
                    <textarea
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write your message"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.9440388033986!2d85.79810939999999!3d20.27631689999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19a78622f0fc5f%3A0x86bdd81c7c11e2f!2sRajdhani%20College!5e1!3m2!1sen!2sin!4v1746512670715!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
