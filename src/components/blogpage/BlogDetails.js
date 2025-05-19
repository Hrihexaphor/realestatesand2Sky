import React from "react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { BsCalendarDate } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const posts = [
  {
    id: 1,
    author: "Jonathan Reinink",
    date: "Aug 18",
    categories: ["Cooking"],
    image:
      "https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Simplest Salad Recipe ever",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: 2,
    author: "Jonathan Reinink",
    date: "Aug 18",
    categories: ["Recipe"],
    image:
      "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Best Pizza in Town",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: 3,
    author: "Jonathan Reinink",
    date: "Aug 18",
    categories: ["Cooking"],
    image:
      "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Best Salad Images ever",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
];
const BlogDetails = () => {

  const navigate = useNavigate();

  return (
    <>
      <NewNav />
      <section className="bg-[#F4EFE5]">
        <div className="mb-4 ps-0">
          <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden">
            <img
              src="https://cdn.pixabay.com/photo/2016/10/06/17/28/architecture-1719526_640.jpg"
              alt="breadcrumb image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            <div className="absolute mt-5 inset-0 flex flex-col items-center justify-center text-white">
              <h2 className="text-3xl font-bold font-geometric-regular">Blog Details</h2>
              <p className="mt-2 text-sm">
                <Link to="/" className="no-underline text-white font-semibold">Home</Link>
                <span className="mx-1">/</span>
                <Link to="/blogs" className="no-underline text-white font-semibold">Blogs</Link>
                <span className="mx-1">/</span>
                <span className="text-yellow-400 font-semibold">Blog Details</span>
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-10 px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Blog Details */}
            <div className="w-full lg:w-2/3">
              <div className="w-full bg-white rounded-lg p-4">
                <img className="w-full" src="https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="blog dtl image" />
                <div className="flex justify-between items-center my-2">
                  <div className="bg-[#367588] inline-block text-white text-sm py-[5px] px-[15px] rounded-lg">Category</div>
                  <div className="flex gap-2 items-center">
                    <BsCalendarDate className="font-bold text-[#3C4142]" />
                    <p className="mb-0 text-sm font-bold text-[#3C4142]">01/05/2025</p>
                  </div>
                </div>
                <h2 className="my-2 text-[#3C4142] text-2xl">Simplest Salad Recipe ever</h2>
                <p className="my-2">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. </p>
                <p className="my-2">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturi. </p>
                <p className="my-2">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean . </p>
              </div>
              <div className="my-5">
                <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">
                  Other Related Blogs
                </h2>
                <div className="w-12 h-1 bg-yellow-500"></div>
              </div>
              <Slider {...settings}>
                {posts.map((post) => (
                  <div key={post.id} className="p-2">
                    <div
                      onClick={() => navigate('/blogDetails')}
                      className="rounded overflow-hidden flex flex-col cursor-pointer border h-[400px] bg-[#e6e6e6]"
                    >
                      <a href="#">
                        <img className="w-full" src={post.image} alt={post.title} />
                      </a>
                      <div className="p-4 pb-6 bg-[#e6e6e6]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="bg-[#367588] text-white text-sm py-[5px] px-[15px] rounded-lg">{post.categories}</div>
                          <p className="mb-0 text-[#367588] font-semibold">
                            Dt: 10/05/25
                          </p>
                        </div>
                        <h3
                          className="font-lg text-center text-lg text-[#3C4142] transition duration-500 ease-in-out block mb-2"
                        >
                          {post.title}
                        </h3>
                        <p className="text-gray-500 text-sm">{post.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
            {/* Sidebar */}
            <aside className="hidden lg:block lg:w-1/3 bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-gray-700">Add Sections</h4>
              <div className="hidden md:block bg-white rounded-lg shadow-md p-4  ">
                <div className="bg-yellow-100 text-center p-4 rounded-lg">
                  <img
                    src="https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg"
                    alt="Advertise"
                    className="mx-auto mb-3"
                  />
                  <h3 className="text-xl font-semibold">Advertise With Us</h3>
                  <p className="text-gray-600">
                    Reach millions of potential customers
                  </p>
                </div>
                <button className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-md w-full hover:bg-yellow-600">
                  Post Property
                </button>
                <div className="mt-6">
                  <h4 className="text-lg font-semibold">
                    Why Advertise With Us?
                  </h4>
                  <ul className="list-disc pl-4 text-gray-600">
                    <li>Millions of Active Users</li>
                    <li>Targeted Audience</li>
                    <li>High Conversion Rates</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default BlogDetails;
