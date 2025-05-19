import { useState, useEffect } from "react";
import { FiMenu, FiX, FiPhone } from "react-icons/fi";
import TailwindCarousel from "./Propertys";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import dark_logo from "../../assets/logos/black_logo.png"

const NewNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showPricingDropdown, setShowPricingDropdown] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();

  // Function to handle selection change
  const handleSelection = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "Bhubaneswar" || selectedValue === "Cuttack") {
      navigate("/listing"); // Redirect to the listing page
    }
  };

  return (
    <>
      <div className="top-0">
        {/* Top Navbar */}
        <nav className="bg-dark fixed top-0 left-0 w-full z-50 px-6 lg:px-16 py-2 shadow-sm flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 w-[150px] lg:w-[200px]">
            {/* <img
              src="https://cdn.staticmb.com/magicservicestatic/images/revamp/mb-logo-web-white.svg"
              alt="magicbricks Logo"
              className="h-8"
            /> */}
            {/* <span className="text-3xl font-bold text-gray-300">Sand2sky</span> */}
            <img src={dark_logo}/>
          </div>

          {/* Contact Info (Visible on Desktop) */}
          <div className="hidden  lg:flex space-x-10">
            <div className="p-2 bg-dark cursor-pointer">
              <Link to="/" className="text-white link no-underline font-geometric-regular lg:text-sm">
                Home
              </Link>
            </div>
            <div className="p-2 bg-dark text-white cursor-pointer">
              <Link to="/listing" className="text-white link no-underline font-geometric-regular lg:text-sm">
                Buy
              </Link>
            </div>
            <div className="p-2 bg-dark text-white cursor-pointer">
              <Link to="/newprojects" className="text-white link no-underline font-geometric-regular lg:text-sm">
                New Projects
              </Link>
            </div>
            <div className="p-2 bg-dark text-white cursor-pointer">
              <Link to="/projects" className="text-white link no-underline font-geometric-regular lg:text-sm">
                Projects
              </Link>
            </div>
            <div className="p-2 bg-dark text-white cursor-pointer">
              <Link to="/postreq"  target="_blank"  className="text-white link no-underline font-geometric-regular lg:text-sm">
                Post Requirement
              </Link>
            </div>
            {/* <div className="relative">
              <div
                className="p-2 bg-dark link text-white cursor-pointer flex items-center gap-1 font-geometric-regular lg:text-sm"
                onClick={() => setShowPricingDropdown(!showPricingDropdown)}
              >
                <span>Pricing</span>
                <FiChevronDown />
              </div>

              {showPricingDropdown && (
                <div className="absolute text-white rounded shadow-md mt-1 w-36 z-50  bg-gray-800 font-geometric-regular">
                  <Link
                    to="/buyer-plan"
                    className="block px-4 py-2 link text-sm text-white no-underline lg:text-sm"
                    onClick={() => setShowPricingDropdown(false)}
                  >
                    Buyer Plan
                  </Link>
                  <Link
                    to="/seller-plan"
                    className="block px-4 py-2 link text-sm text-white no-underline lg:text-sm"
                    onClick={() => setShowPricingDropdown(false)}
                  >
                    Seller Plan
                  </Link>
                </div>
              )}
            </div> */}
          </div>

          {/* Menu Button (Always Visible) */}
          <button
            className="text-white text-2xl focus:outline-none lg:hidden"
            onClick={() => setIsOpen(true)}
          >
            <FiMenu />
          </button>
        </nav>
        {/* Sidebar Menu */}
        <div
          className={`fixed top-0 right-0 w-80 h-full bg-black text-white p-6 shadow-lg transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-500 ease-in-out z-50`}
        >
          <button
            className="absolute top-4 right-4 text-2xl"
            onClick={() => setIsOpen(false)}
          >
            <FiX />
          </button>

          {isMobile ? (
            <div className="mt-10">
              <div className="mt-4">
                <div className="w-full p-2 bg-gray-800 text-white rounded mb-2">
                  <Link to="/" className="text-white no-underline font-geometric-regular">
                    Home
                  </Link>
                </div>
                <div className="w-full p-2 bg-gray-800 text-white rounded mb-2">
                  <Link to="/listing" className="text-white no-underline font-geometric-regular">
                    Buy
                  </Link>
                </div>
                <div className="w-full p-2 bg-gray-800 text-white rounded mb-2">
                  <Link to="/newprojects" className="text-white no-underline font-geometric-regular">
                    New Projects
                  </Link>
                </div>
                <div className="w-full p-2 bg-gray-800 text-white rounded mb-2 font-geometric-regular">
                  <Link to="/listing" className="text-white no-underline">
                    Projects
                  </Link>
                </div>{" "}
                <div className="w-full p-2 bg-gray-800 text-white rounded mb-2 font-geometric-regular">
                  <Link to="/postreq" className="text-white no-underline">
                    Post Requirement
                  </Link>
                </div>  <div className="relative">
              {/* <div
                className="p-2 text-white rounded bg-gray-800 cursor-pointer flex items-center gap-1 font-geometric-regular"
                onClick={() => setShowPricingDropdown(!showPricingDropdown)}
              >
                <span>Pricing</span>
                <FiChevronDown />
              </div> */}

              {showPricingDropdown && (
                <div className="absolute text-white rounded shadow-md mt-1 w-36 z-50  bg-gray-800 font-geometric-regular">
                  <Link
                    to="/buyer-plan"
                    className="block px-4 py-2 hover:bg-gray-700 text-sm text-white no-underline"
                    onClick={() => setShowPricingDropdown(false)}
                  >
                    Buyer Plan
                  </Link>
                  <Link
                    to="/seller-plan"
                    className="block px-4 py-2 hover:bg-gray-700 text-sm text-white no-underline"
                    onClick={() => setShowPricingDropdown(false)}
                  >
                    Seller Plan
                  </Link>
                </div>
              )}
            </div>
              </div>
            </div>
          ) : (
            <div className="mt-10">
              <img src="/logo.png" alt="Sand2Sky Logo" className="h-12 mb-4" />
            </div>
          )}
        </div>

        {/* Overlay when Sidebar is Open */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
      </div>
    </>
  );
};

export default NewNav;
