import React from "react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const Imgsec = () => {
  return (
    <>
      <NewNav />
      <div className="bg-[#F4EFE5] p-20">
        <Link to="/listing" className="cursor-pointer mt-3 text-xl font-[600] no-underline flex items-center text-white bg-[#367588] hover:bg-[#1386a8] w-[90px] rounded-lg pb-1 gap-1">
          <RiArrowLeftSLine className="text-[25px] font-bold mt-[4px]" /> Back
        </Link>
        <div className="max-w-screen-2xl mx-auto mt-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-1 flex-col">
                {/* img_01 */}

                <img
                  className="object-cover h-full"
                  src="https://images.unsplash.com/photo-1665689285334-b0044b6d2dc7?crop=entropy&cs=tinysrgb&fm=jpg&q=80"
                  alt=""
                />
              </div>
              <div className="hidden md:flex flex-1 flex-row gap-2">
                <div className="flex flex-1 flex-col">
                  {/* img_02 */}

                  <img
                    className="object-cover h-full"
                    src="https://images.unsplash.com/photo-1666433723497-38d1d053185b?crop=entropy&cs=tinysrgb&fm=jpg&q=80"
                    alt=""
                  />
                </div>
                <div className="hidden md:flex flex-1 flex-col">
                  {/* img_03 */}

                  <img
                    className="object-cover h-full"
                    src="https://images.unsplash.com/photo-1665048110211-91d0b74c421c?crop=entropy&cs=tinysrgb&fm=jpg&q=80"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <div className="hidden md:flex flex-1 flex-row gap-2">
                <div className="flex flex-1 flex-col">
                  {/* img_04 */}

                  <img
                    className="object-cover h-full"
                    src="https://images.unsplash.com/photo-1666297599033-09b318f2c8b5?crop=entropy&cs=tinysrgb&fm=jpg&q=80"
                    alt=""
                  />
                </div>
                <div className="hidden md:flex flex-1 flex-col">
                  {/* img_05 */}

                  <img
                    className="object-cover h-full"
                    src="https://images.unsplash.com/photo-1664713815297-9ce06950c022?crop=entropy&cs=tinysrgb&fm=jpg&q=80"
                    alt=""
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col">
                <img
                  className="object-cover h-full"
                  src="https://images.unsplash.com/photo-1666060519824-796d5638d809?crop=entropy&cs=tinysrgb&fm=jpg&q=80"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Imgsec;
