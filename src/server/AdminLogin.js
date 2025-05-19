import React from "react";

const AdminLogin = () => {
  return (
    <div className="bg-[#F7E7CE] h-screen">
      <div className="lg:flex container mx-auto px-20 py-20">
        {/* Left Section - Login Form */}
        <div className="lg:w-1/2 xl:max-w-screen-sm bg-indigo-100 lg:bg-white">
          <div className="py-12 bg-indigo-100 lg:bg-white flex justify-center lg:justify-start lg:px-12">
            <div className="cursor-pointer flex items-center">
              <svg
                className="w-10 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 225 225"
              >
                <g>
                  <path
                    className="fill-none stroke-current stroke-[20] stroke-linecap-round"
                    d="M173.8,151.5l13.6-13.6 M35.4,89.9l29.1-29 M89.4,34.9v1 M137.4,187.9l-0.6-0.4 M36.6,138.7l0.2-0.2 M56.1,169.1l27.7-27.6 M63.8,111.5l74.3-74.4 M87.1,188.1L187.6,87.6 M110.8,114.5l57.8-57.8"
                  />
                </g>
              </svg>
              <span className="text-2xl text-indigo-800 tracking-wide ml-2 font-semibold">
                Welcome in Sand2Sky
              </span>
            </div>
          </div>

          <div className="px-12 sm:px-24 md:px-48 lg:px-12  xl:px-24 xl:max-w-2xl">
            <h2 className="text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl">
              Log in
            </h2>

            <div className="mt-12 my-10">
              <form>
                <div>
                  <label className="text-sm font-bold text-gray-700 tracking-wide">
                    Email Address
                  </label>
                  <input
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    type="email"
                    placeholder="mike@gmail.com"
                  />
                </div>

                <div className="mt-8">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-gray-700 tracking-wide">
                      Password
                    </label>
                    <a className="text-xs font-display font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                      Forgot Password?
                    </a>
                  </div>
                  <input
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    type="password"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="mt-10">
                  <button
                    type="submit"
                    className="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none hover:bg-indigo-600 shadow-lg"
                  >
                    Log In
                  </button>
                </div>
              </form>

              {/* <div className="mt-12 text-sm font-display font-semibold text-gray-700 text-center">
                Don't have an account?{" "}
                <a className="cursor-pointer text-indigo-600 hover:text-indigo-800">
                  Sign up
                </a>
              </div> */}
            </div>
          </div>
        </div>

        {/* Right Section - Illustration */}
        <div className="hidden lg:flex items-center justify-center bg-indigo-100 flex-1 ">
          <div className="max-w-xs transform duration-200 hover:scale-110 cursor-pointer">
            <img
              className="w-5/6 mx-auto"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSni4W_ssx3U1KqS7a7wY_Q4NVU2hW3CP-1jA&s"
              alt="Login Illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
