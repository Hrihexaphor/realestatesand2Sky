import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { FaArrowRightLong } from "react-icons/fa6";

const ToolsAdvice = () => {
  const navigate = useNavigate();

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
  const cards = [
    {
      title: "Rates & Trends",
      bgColor: "bg-yellow-200",
      iconBg: "bg-yellow-400",
      textColor: "text-gray-800",
      icon: "🏠",
      value: "28",
      unit: "min",
      message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    },
    {
      title: "EMI Calculator",
      bgColor: "bg-green-200",
      iconBg: "bg-green-400",
      textColor: "text-gray-800",
      icon: "📜",

      value: "32",
      unit: "+",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab beatae consequuntur dolore doloribus eius fugit, porro quidem repellat temporibus unde?",
    },
    {
      title: "Investment Hotspot",
      bgColor: "bg-teal-200",
      iconBg: "bg-teal-400",
      textColor: "text-gray-800",
      icon: "🔑",
      value: "25",
      unit: "%",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, labore, voluptatem. Deserunt illum laborum maxime?",
    },
    {
      title: "Research Insights",
      bgColor: "bg-red-200",
      iconBg: "bg-red-600",
      textColor: "text-black opacity-75",
      icon: "🏢",
      value: "89",
      unit: "m²",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam, nemo!",
    },
  ];

  return (
    <div className="bg-[#F4EFE5]">
      <div className="container mx-auto pt-4">
        <div className="mb-3">
          <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">Advice and Tools</h2>
          <div className="w-12 h-1 bg-yellow-500"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 pb-20">
          {cards.map((card, index) =>
            card.title === "EMI Calculator" ? (
              <Link
                to="/emiCalculator"
                key={index}
                className={`flex ${card.bgColor} p-4 rounded-lg shadow-md w-full cursor-pointer no-underline`}
              >
                <CardContent card={card} />
              </Link>
            ) : (
              <div
                key={index}
                className={`flex ${card.bgColor} p-4 rounded-lg shadow-md w-full`}
              >
                <CardContent card={card} />
              </div>
            )
          )}
        </div>
      </div>
      <div className="container mx-auto  sm:p-10  bg-[#F4EFE5] mt-[-40px]">
        <div className="border-b mb-5 flex justify-between text-sm">
          <div className="mb-3">
            <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">Our Blogs</h2>
            <div className="w-12 h-1 bg-yellow-500"></div>
          </div>

          {/* Right Side - Link */}
          <Link to="/blogs" className="text-[#367588] text-sm sm:text-base font-small font-bold flex items-center no-underline font-roboto-light">
            See All Blogs <span className="ml-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate('/blogDetails')}
              className="rounded overflow-hidden shadow-lg flex flex-col cursor-pointer border"
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
          ))}
        </div>
      </div>
    </div>
  );
};

export const CardContent = ({ card }) => (
  <>
    <div className={`${card.iconBg} w-16 flex items-center justify-center p-4 rounded-l-lg`}>
      {card.icon.startsWith("M") ? (
        <svg className="h-8 w-8 text-white fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d={card.icon} />
        </svg>
      ) : (
        <span className="text-3xl">{card.icon}</span>
      )}
    </div>
    <div className={`w-auto ${card.textColor} p-4 flex flex-col justify-center`}>
      <span className="text-lg font-bold">{card.title}</span>
      <p className="leading-tight">{card.message}</p>
    </div>
  </>
);

export default ToolsAdvice;
