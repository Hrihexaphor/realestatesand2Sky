import dark_logo from "../../assets/logos/black_logo.png"
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { FaPhoneAlt, FaRegEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-10 px-6 md:px-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          {/* <h2 className="text-2xl font-bold">
            Sand2Sky<span className="text-blue-400">.</span>
          </h2> */}
          <img src={dark_logo} className="w-[200px]" />
          <p className="mt-2 text-gray-300">
            A real estate platform that makes the home-buying experience smart
            and seamless.
          </p>
          <div className="flex flex-col lg:flex-row gap-2 items-center">
            <p className="text-base font-semibold text-white mb-0">Social Media :</p>
            <div className="flex space-x-4 mt-0">
              <FaFacebookF className="text-white bg-gray-600 p-2 rounded-full text-3xl cursor-pointer" />
              <FaInstagram className="text-white bg-gray-600 p-2 rounded-full text-3xl cursor-pointer" />
              {/* <FaLinkedinIn className="text-white bg-gray-600 p-2 rounded-full text-3xl cursor-pointer" />
              <FaXTwitter className="text-white bg-gray-600 p-2 rounded-full text-3xl cursor-pointer" /> */}
              <FaYoutube className="text-white bg-gray-600 p-2 rounded-full text-3xl cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-xl font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2 text-gray-300">
            <li className="cursor-pointer">
              <Link
                to="/blogs"
                className="text-white no-underline "
                rel="noopener noreferrer"
              >
                Blog
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link
                to="/aboutus"
                className="text-white no-underline "
                rel="noopener noreferrer"
              >
                About Us
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link
                to="/contact"
                className="text-white no-underline"
                rel="noopener noreferrer"
              >
                Contact Us
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link
                to="/privacy"
                className="text-white no-underline"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link
                to="/cancellationPolicy"
                className="text-white no-underline"
                rel="noopener noreferrer"
              >
                Cancellation Policy
              </Link>
            </li>
            <li className="cursor-pointer">
              <Link
                to="/termofService"
                className="text-white no-underline"
                rel="noopener noreferrer"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Properties in Odisha</h3>
          <ul className="mt-2 space-y-2 text-gray-300">
            <li className="cursor-pointer">
              <Link className="text-white no-underline">Bhubaneswar</Link>
            </li>
            <li className="cursor-pointer">
              <Link className="text-white no-underline">Cuttack</Link>
            </li>
            <li className="cursor-pointer">
              <Link className="text-white no-underline">Puri</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-xl font-semibold">Contact</h3>
          <p className="mt-1 mb-0 text-gray-300 flex items-center gap-2">
          <span><FaPhoneAlt/></span> 
          <a href="tel:+919114942292" className="no-underline text-white">+91 9114942292</a>
          </p>
          <p className="mt-0 mb-0 text-gray-300 flex items-center gap-2">
          <span><FaPhoneAlt/></span>
          <a href="tel:+917030066666" className="no-underline text-white">+91 70300 66666</a>
          </p>
          <p className="mt-2 mb-0 text-gray-300 flex items-center gap-2">
          <span><FaRegEnvelope/></span>
          <a href="mailto:info@houssed.com" className="no-underline text-white">info@houssed.com</a>
          </p>
          <p className="mt-0 mb-0 text-gray-300 flex items-center gap-2">
          <span><FaRegEnvelope/></span>
          <a href="mailto:info@houssed.com" className="no-underline text-white">info@houssed.com</a>
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-600 mt-8 pt-4 text-center text-gray-300 text-sm">
        <p>&copy; 2025 Sand2sky Technologies Pvt Ltd. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <span className="cursor-pointer hover:text-blue-400">
            <Link
              to="/term"
              className="text-white  no-underline hover:text-red-500"
              rel="noopener noreferrer"
            >
              Terms and Conditions
            </Link>
          </span>
          <span className="cursor-pointer hover:text-blue-400">
            <Link
              to="/privacy"
              className="text-white  no-underline hover:text-red-500"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
