import React, { useState, useRef, useEffect } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { Link, useNavigate } from "react-router-dom";

const BlogPage = () => {

  const navigate = useNavigate();
  const listRef = useRef();

  const blogs = [
    {
      id: 1,
      author: "Jonathan Reinink",
      date: "Aug 18",
      image:
        "https://cdn.pixabay.com/photo/2024/01/27/19/02/building-8536587_640.jpg",
      title: "Simplest Salad Recipe ever",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      category: "Cricket",
    },
    {
      id: 2,
      author: "Jonathan Reinink",
      date: "Aug 18",
      image:
        "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      title: "Best Pizza in Town",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      category: "Books",
    },
    {
      id: 3,
      author: "Jonathan Reinink",
      date: "Aug 18",
      image:
        "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      title: "Best Salad Images ever",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      category: "TV & Video",
    },
    {
      id: 4,
      author: "Jonathan Reinink",
      date: "Aug 18",
      image:
        "https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      title: "Simplest Salad Recipe ever",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      category: "Cricket",
    },
    {
      id: 6,
      author: "Jonathan Reinink",
      date: "Aug 18",
      image:
        "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      title: "Best Salad Images ever",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      category: "TV & Video",
    },
    {
      id: 7,
      author: "Jonathan Reinink",
      date: "Aug 18",
      image:
        "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      title: "Best Salad Images ever",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      category: "TV & Video",
    },
  ];

  const categoryCounts = {};
  blogs.forEach((blog) => {
    const category = blog.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  const uniqueCategoriesWithCounts = Object.entries(categoryCounts);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredProperties = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? blog.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <NewNav />
      <section className="bg-[#F4EFE5]" ref={listRef}>
        <div className="mb-4 ps-0">
          <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden">
            <img
              src="https://cdn.pixabay.com/photo/2016/10/06/17/28/architecture-1719526_640.jpg"
              alt="breadcrumb image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            <div className="absolute mt-5 inset-0 flex flex-col items-center justify-center text-white">
              <h2 className="text-3xl font-bold font-geometric-regular">Blogs</h2>
              <p className="mt-2 text-sm">
                <Link to="/" className="no-underline text-white font-semibold">Home</Link>
                <span className="mx-1">/</span>
                <span className="text-yellow-400 font-semibold">Blogs</span>
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-5 px-4 flex flex-col lg:flex-row gap-8">
          {/* Blog Cards */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 self-start">
            {[1, 2].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-4 flex flex-col"
              >
                <div className="aspect-video mb-3">
                  <iframe
                    width="100%"
                    height="100%"
                    className="rounded-md"
                    src={`https://www.youtube.com/embed/${index === 0 ? "YOUTUBE_VIDEO_ID_1" : "YOUTUBE_VIDEO_ID_2"
                      }`}
                    title="YouTube video player"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  Jan {index === 0 ? "5" : "31"}, 2024 · 0 Comments · Youtube
                </div>
                <h3 className="font-semibold text-lg text-blue-900 mb-2 line-clamp-2">
                  {index === 0
                    ? "Understand LG Washing Machine Error Codes"
                    : "LG Smart LED TV Repair Blue Screen Fix"}
                </h3>
                <p className="text-sm text-gray-700">
                  {index === 0
                    ? "LG washing machine error codes explained..."
                    : "Welcome to our blog, where we explain..."}
                </p>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/3 bg-white rounded-lg shadow p-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search"
                className="w-full border px-3 py-2 rounded focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <h4 className="font-semibold mb-2 text-gray-700">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <>
                {/* "All Blogs" option */}
                <li
                  onClick={() => setSelectedCategory(null)}
                  className={`flex justify-between border-b pb-1 cursor-pointer ${selectedCategory === null ? 'font-bold text-[#367588]' : ''
                    }`}
                >
                  <span>All Blogs</span> <span>({blogs.length})</span>
                </li>

                {/* Category list */}
                {uniqueCategoriesWithCounts.map(([category, count]) => (
                  <li
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex justify-between border-b pb-1 cursor-pointer ${selectedCategory === category ? 'font-bold text-[#367588]' : ''
                      }`}
                  >
                    <span>{category}</span> <span>({count})</span>
                  </li>
                ))}
              </>

              {/* <li className="flex justify-between border-b pb-1">
                <span>Cricket</span> <span>(46)</span>
              </li>
              <li className="flex justify-between border-b pb-1">
                <span>Books</span> <span>(15)</span>
              </li> */}
            </ul>
          </aside>
        </div>
        <hr />
        <div className="container mx-auto py-5 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProperties.map((blog) => (
              <div
                key={blog.id}
                className="rounded overflow-hidden shadow-lg flex flex-col border"
              >
                <a href="#">
                  <img className="w-full" src={blog.image} alt={blog.title} />
                </a>
                <div className="p-4 pb-6 bg-[#e6e6e6]">
                  <a
                    href="#"
                    className="no-underline font-medium text-lg text-[#3C4142] transition duration-500 ease-in-out block mb-2"
                  >
                    {blog.title}
                  </a>
                  <p className="text-gray-500 text-sm">{blog.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="bg-[#367588] text-white text-sm py-[5px] px-[15px] rounded-lg">{blog.category}</div>
                    <div className="flex items-center gap-2 text-[#367588] text-sm font-semibold float-right group">
                      <a onClick={() => navigate('/blogDetails')} className="no-underline cursor-pointer text-[#367588] flex items-center gap-2">
                        Read More
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                          <FaArrowRightLong />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default BlogPage;
