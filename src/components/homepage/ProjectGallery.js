import React, { useRef } from "react";
import Marquee from "react-fast-marquee";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowDroprightCircle } from "react-icons/io";
import { RiBuilding2Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";


const ProjectGallery = () => {

  const navigate = useNavigate();
  const sliderRef = useRef(null);


  const settings = {
    dots: true,
    infinite: true,
    speed: 800,              
    cssEase: 'ease-in-out',
    slidesToShow: 1, // Show 2 cards on larger screens
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const projectDetails = [
    {
      title: "Shree Omkar Residency",
      subTitle: "Starting from ₹ 45 Lac",
      objective1: "Luxury & Affordable Flats Available",
      objective2: "Marketed by Top Realty Companies",
      projectImage: [
         "https://img.staticmb.com/mbimages/project/Photo_h410_w1440/2024/07/25/Project-Photo-49-Khushi-Capella-Bhubaneswar-5333617_410_1440_410_1440.jpg",
         "https://img.staticmb.com/mbimages/project/popup/2023/01/17/Project-Photo-35-Khushi-Capella-Bhubaneswar-5333617_1800_2400.jpg",
         "https://img.staticmb.com/mbimages/project/popup/2023/01/17/Project-Photo-34-Khushi-Capella-Bhubaneswar-5333617_1800_2400.jpg",
         "https://img.staticmb.com/mbimages/project/Photo_h410_w1440/2024/07/25/Project-Photo-49-Khushi-Capella-Bhubaneswar-5333617_410_1440_410_1440.jpg",
         "https://img.staticmb.com/mbimages/project/popup/2023/01/17/Project-Photo-27-Khushi-Capella-Bhubaneswar-5333617_1800_2400.jpg",
      ]
    },
    {
      title: "Raghuram Properties",
      subTitle: "Starting from ₹ 45 Lac",
      objective1: "Luxury & Affordable Flats Available",
      objective2: "Marketed by Top Realty Companies",
      projectImage: [
         "https://img.staticmb.com/mbimages/project/Photo_h410_w1440/2024/07/25/Project-Photo-49-Khushi-Capella-Bhubaneswar-5333617_410_1440_410_1440.jpg",
         "https://img.staticmb.com/mbimages/project/popup/2023/01/17/Project-Photo-35-Khushi-Capella-Bhubaneswar-5333617_1800_2400.jpg",
         "https://img.staticmb.com/mbimages/project/popup/2023/01/17/Project-Photo-34-Khushi-Capella-Bhubaneswar-5333617_1800_2400.jpg",
         "https://img.staticmb.com/mbimages/project/Photo_h410_w1440/2024/07/25/Project-Photo-49-Khushi-Capella-Bhubaneswar-5333617_410_1440_410_1440.jpg",
         "https://img.staticmb.com/mbimages/project/popup/2023/01/17/Project-Photo-27-Khushi-Capella-Bhubaneswar-5333617_1800_2400.jpg",
      ]
    },
    
  ];

  return (
    <>
      <div className=" bg-[#F4EFE5]">
        <div className="container mx-auto pt-20">
          {/* Title and Link Section */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className=" text-[#3C4142] text-2xl font-bold font-geometric-regular">
                Project Gallery
              </h2>
              <div className="w-12 h-1 bg-yellow-500 mt-1"></div>
            </div>
            <Link
              to="/Projects"
              className="text-[#367588] text-sm sm:text-base font-small font-bold flex items-center no-underline"
            >
              See all Projects <span className="ml-1">→</span>
            </Link>
          </div>


          <div className="float-right flex gap-6 mb-2">
            <button className="gal-slide" onClick={() => sliderRef.current?.slickPrev()}><IoIosArrowBack className="text-xl text-white" /></button>
            <button className="gal-slide" onClick={() => sliderRef.current?.slickNext()}><IoIosArrowForward className="text-xl text-white" /></button>
          </div>
          {/* Marquee Image Section */}
          <div className="w-full h-[350px] rounded-lg overflow-hidden shadow-2xl">
            <Slider ref={sliderRef} {...settings}>
            {projectDetails.map((project, index) => (
              <div key={index} className="relative w-[100%] h-[100%]">
                    <Marquee
                    pauseOnHover={true}
                    speed={50}
                    gradient={true}
                    gradientWidth={100}
                  >
                    {project.projectImage.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Project ${index + 1}`}
                        className="h-[350px] w-[600px] object-cover"
                      />
                    ))}
                  </Marquee>
                  {/* Overlay Text */}
                  <div className="absolute z-20 bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <RiBuilding2Line className="text-white text-3xl font-semibold"/>
                        <h2 className="text-white text-3xl font-semibold mb-0">
                          {project.title}
                        </h2>
                      </div>
                      <h5 className="font-bold text-lg">{project.subTitle}</h5>
                      <div className="flex items-center gap-2">
                        <IoIosArrowDroprightCircle className="text-white text-base"/>
                        <p className="text-white text-base mb-0">{project.objective1}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <IoIosArrowDroprightCircle className="text-white text-base"/>
                        <p className="text-white text-base mb-0">{project.objective2}</p>
                      </div>
                      
                    <button className="absolute bottom-3 right-3 bg-[#367588] hover:bg-[#1386a8] text-white text-base px-4 py-2 rounded-xl transition duration-300"
                    onClick={() => navigate('/details')}>
                      See Details
                    </button>
                  </div>
              </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectGallery;
