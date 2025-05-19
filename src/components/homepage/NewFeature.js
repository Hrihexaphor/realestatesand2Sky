import * as framerMotion from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";
import { FaBuildingUser, FaArrowsLeftRightToLine } from "react-icons/fa6";
import { IoBedOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const { motion } = framerMotion;

const NewFeature = () => {
  const properties = [
    {
      image:
        "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
      type: "2 BHK",
      name: "Bohra Homes",
      price: "93 Lac",
      area: "1340 sq.ft.",
      builder: "RK Builders",
      location: "Patia, Bhubaneswar",
      featured: true,
    },
    {
      image:
        "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
      type: "3 BHK",
      name: "RK Homes",
      price: "76 Lac",
      area: "1510 sq.ft.",
      builder: "RK Builders",
      location: "Baramunda, Bhubaneswar",
      featured: false,
    },
    {
      image:
        "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
      type: "3 BHK",
      name: "Vina Bhavan",
      price: "80 Lac",
      area: "1600 sq.ft.",
      builder: "RK Builders",
      location: "Jayadev Vihar, Bhubaneswar",
      featured: true,
    },
    {
      image:
        "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
      type: "4 BHK",
      name: "Alok Homes",
      price: "1 CR",
      area: "1200 sq.ft.",
      builder: "RK Builders",
      location: "Sahid Nagar, Bhubaneswar",
      featured: true,
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2, // Show 2 cards on larger screens
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, // For smaller screens
        settings: {
          slidesToShow: 1, // Show 1 card
        },
      },
    ],
  };

  const navigate = useNavigate();

  return (
    <div className="bg-[#F4EFE5]">
      <div className="flex flex-col md:flex-col lg:flex-row items-center justify-center px-4 md:px-10 pt-[6rem] pb-[2rem] container mx-auto popular">
        {/* Left Side - Image with Overlay */}
        <motion.div
          className="relative w-full max-w-md md:max-w-2xl lg:w-1/2 hidden lg:block mx-auto"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="http://hompark.themezinho.net/wp-content/uploads/2020/03/gallery-thumb03.jpg"
            alt="Family"
            className="rounded-lg shadow-lg h-auto relative small-img"
          />
          <img
            src="http://hompark.themezinho.net/wp-content/uploads/2020/03/side-image02.jpg"
            alt="Overlay"
            className="absolute left-36 bottom-16 h-[100%] rounded-lg opacity-80 small-img hidden md:block"
          />
          <div className="absolute -left-6 top-12 h-20 border-l-4 border-black hidden md:block"></div>
        </motion.div>

        {/* Right Side - Text Content & Slider */}
        <motion.div
          className="w-full max-w-md md:max-w-2xl lg:w-1/2 lg:pl-10 mx-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-between flex-col md:flex-row lg:flex-row">
            <h2 className="text-xl font-semibold">
              <span className="text-[#367588]">Popular Resale</span> Properties
            </h2>
            <Link
              to="/projects"
              className="text-[#367588] font-bold flex items-center no-underline"
            >
              See all Projects <span className="ml-1">→</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold mt-2">
            Living spaces for creative people
          </h1>
          <p className="text-gray-600 mt-3">
            Discover beautifully designed living spaces for your dream home.
          </p>

          {/* Property Slider */}
          <div className="mt-5">
            <Slider {...settings}>
              {properties.map((property, index) => (
                <motion.div
                  key={index}
                  className="px-2"
                >
                  <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative">
                      <img
                        src={property.image}
                        alt="Property"
                        className="w-full h-48 object-cover"
                      />
                      {property.featured === true && (
                      <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 text-[#fff] py-[5px] px-[10px] rounded-[5px]">
                        Featured
                      </p>
                    )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-lg text-[#3C4142] bold mb-1 mt-[-2px]">
                        {property.name}
                      </h3>
                      <div className="flex flex-wrap justify-between items-center">
                        <div className="flex gap-2 items-center w-[50%] mb-2">
                          <FaRupeeSign className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                          <div>
                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">Price</p>
                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.price}</p>
                          </div>

                        </div>
                        <div className="flex gap-2 items-center w-[50%]  mb-2">
                          <IoBedOutline className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                          <div>
                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">Type</p>
                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.type}</p>
                          </div>

                        </div>
                        <div className="flex gap-2 items-center w-[50%] mb-2">
                          <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                          <div>
                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">SBA</p>
                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.area}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center w-[50%]">
                          <FaBuildingUser className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                          <div>
                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">Builder</p>
                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px] cursor-pointer" onClick={() => navigate(`/builderProject`)}>{property.builder}</p>
                          </div>

                        </div>
                      </div>
                      <div className="flex gap-2 items-center mb-2">
                        <FaMapMarkerAlt className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Location</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.location}</p>
                        </div>
                      </div>
                      <button
                        className="px-3 py-1 bg-[#367588] w-full text-white text-base rounded-md hover:bg-[#1386a8]"
                        onClick={() => navigate(`/details`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </Slider>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default NewFeature;
