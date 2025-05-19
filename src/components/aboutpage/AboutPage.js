import React from "react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import CallAction from "../aboutpage/CallAction";
import Faq from "../aboutpage/Faq";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <>
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
              <h2 className="text-3xl font-bold font-geometric-regular">About Us</h2>
              <p className="mt-2 text-sm">
                <Link to="/" className="no-underline text-white font-semibold">Home</Link>
                <span className="mx-1">/</span>
                <span className="text-yellow-400 font-semibold">About</span>
              </p>
            </div>
          </div>
        </div>
        <div className="w-full mt-[50px] pb-[20px] px-6 lg:px-16 lg:h-[50vh] flex bg-cover bg-center flex items-center justify-between pl-8 text-black pt-10">
          <div className="about-left">
            <h2 className="text-[#3C4142] font-bold">About Us</h2>
            <p className="text-base">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution</p>
          </div>
          <div className="about-right">
            <div className="about-img-box">
              <img className="h-[100%] w-[100%] cover rounded-lg" src={"https://images.unsplash.com/photo-1484861671664-4ebd42ced711?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODN8fGJ1aWxkaW5nfGVufDB8fDB8fHww"} alt="about image" />
            </div>
          </div>
        </div>
        <div class="flex flex-col md:flex-row items-center justify-between px-6 lg:px-16 w-full mx-auto py-10">
          <img
            src="https://houssed.com/assets/images/houseimg.jpg"
            alt="Company Image"
            class="w-full md:w-2/5 max-w-sm rounded-lg abt-profile-img"
          />
          <div class="w-full md:w-3/5">
            <h1 class="text-2xl font-bold mb-4">Company Profile</h1>
            <p class="text-gray-700 text-justify">
              Sand2Sky is a Comprehensive Tech Platform in the residential search
              and listing space. Developers' new projects in India will be listed
              on the portal and shall contain all the information you need while
              house-hunting. We know how taxing the process can get, thus, making
              it easier for people to buy their dream house(s) has been our métier
              from the very beginning. It's the manifesto that we've stood by ever
              since this venture was a mere blueprint; it's our niche, and we'll
              continue carving it. As far as your side of the deal is concerned,
              all you have to do is simply shortlist your Shangri-La, book
              appointments to visit sites listed by builders (minus the third
              party interference you come across elsewhere), and voilà, you'll
              find all the results that match your preferences! What's not to
              love?
            </p>
          </div>
        </div>
      </div>
      <CallAction />
      <Faq />
      <Footer />
    </>

  );
};

export default AboutPage;
