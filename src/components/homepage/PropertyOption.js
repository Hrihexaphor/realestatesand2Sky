import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PropertyOption = () => {

    const [activeTab, setActiveTab] = useState("buy");

    const buyItems = [
        {
            title: "Popular Residential Searches",
            items: [
                "Property for Sale in Bhubaneswar",
                "Flats in Bhubaneswar",
                "Studio Apartments in Bhubaneswar",
                "Resale House in Bhubaneswar",
                "Villas for Sale in Bhubaneswar",
                "House for Sale in Bhubaneswar",
                "Penthouse in Bhubaneswar",
                "Ready To Move Flats in Bhubaneswar",
                "Resale Flats in Bhubaneswar",
            ],
        },
        {
            title: "Popular BHK Searches",
            items: [
                "1 BHK Flats in Bhubaneswar",
                "2 BHK Flats in Bhubaneswar",
                "3 BHK Flats in Bhubaneswar",
                "4 BHK Flats in Bhubaneswar",
                "2 BHK House for Sale in Bhubaneswar",
                "3 BHK House for Sale in Bhubaneswar",
                "4 BHK House for Sale in Bhubaneswar",
                "3 BHK Villa for Sale in Bhubaneswar",
                "4 BHK Villa for Sale in Bhubaneswar",
            ],
        },
        {
            title: "Popular Flat Searches",
            items: [
                "Flats for Sale in Patia",
                "Flats for Sale in Khandagiri",
                "Flats for Sale in Kalinga Nagar",
                "Flats for Sale in Tamando",
                "Flats for Sale in Raghunathpur",
                "Flats for Sale in Pahala",
                "Flats for Sale in Hans Pal",
                "Flats for Sale in Patrapada",
                "Flats for Sale in BJB Nagar",
            ],
        },
        {
            title: "Popular House Searches",
            items: [
                "House for Sale in Sundarpada",
                "House for Sale in Hans Pal",
                "House for Sale in Patia",
                "House for Sale in Balianta",
                "House for Sale in Raghunathpur",
                "House for Sale in Maitre Vihar Road",
                "House for Sale in Kalinga Nagar",
                "House for Sale in Phulnakhara",
                "House for Sale in Niali Road",
            ],
        },
        {
            title: "Popular Property Searches",
            items: [
                "Property for Sale in Madanpur",
                "Property for Sale in Patia",
                "Property for Sale in Sundarpada",
                "Property for Sale in Hans Pal",
                "Property for Sale in Patrapada",
                "Property for Sale in Khandagiri",
                "Property for Sale in Tamando",
                "Property for Sale in Pahala",
                "Property for Sale in Raghunathpur",
            ],
        },
        {
            title: "Popular Plot Searches",
            items: [
                "Property for Sale in Bhubaneswar",
                "Flats in Bhubaneswar",
                "Studio Apartments in Bhubaneswar",
                "Resale House in Bhubaneswar",
                "Villas for Sale in Bhubaneswar",
                "House for Sale in Bhubaneswar",
                "Penthouse in Bhubaneswar",
                "Ready To Move Flats in Bhubaneswar",
                "Resale Flats in Bhubaneswar",
            ],
        },
        {
            title: "Popular Commercial Searches",
            items: [
                "Property for Sale in Bhubaneswar",
                "Flats in Bhubaneswar",
                "Studio Apartments in Bhubaneswar",
                "Resale House in Bhubaneswar",
                "Villas for Sale in Bhubaneswar",
                "House for Sale in Bhubaneswar",
                "Penthouse in Bhubaneswar",
                "Ready To Move Flats in Bhubaneswar",
                "Resale Flats in Bhubaneswar",
            ],
        },
        {
            title: "Popular Commercial Locality",
            items: [
                "Property for Sale in Bhubaneswar",
                "Flats in Bhubaneswar",
                "Studio Apartments in Bhubaneswar",
                "Resale House in Bhubaneswar",
                "Villas for Sale in Bhubaneswar",
                "House for Sale in Bhubaneswar",
                "Penthouse in Bhubaneswar",
                "Ready To Move Flats in Bhubaneswar",
                "Resale Flats in Bhubaneswar",
            ],
        },
        {
            title: "Popular Luxury Searches",
            items: [
                "Property for Sale in Bhubaneswar",
                "Flats in Bhubaneswar",
                "Studio Apartments in Bhubaneswar",
                "Resale House in Bhubaneswar",
                "Villas for Sale in Bhubaneswar",
                "House for Sale in Bhubaneswar",
                "Penthouse in Bhubaneswar",
                "Ready To Move Flats in Bhubaneswar",
                "Resale Flats in Bhubaneswar",
            ],
        },
        {
            title: "Property Near Me,Real Estate India",
            items: [
                "Property for Sale in Bhubaneswar",
                "Flats in Bhubaneswar",
                "Studio Apartments in Bhubaneswar",
                "Resale House in Bhubaneswar",
                "Villas for Sale in Bhubaneswar",
                "House for Sale in Bhubaneswar",
                "Penthouse in Bhubaneswar",
                "Ready To Move Flats in Bhubaneswar",
                "Resale Flats in Bhubaneswar",
            ],
        },
        {
            title: "New Project Searches",
            items: [
                "Property for Sale in Bhubaneswar",
                "Flats in Bhubaneswar",
                "Studio Apartments in Bhubaneswar",
                "Resale House in Bhubaneswar",
                "Villas for Sale in Bhubaneswar",
                "House for Sale in Bhubaneswar",
                "Penthouse in Bhubaneswar",
                "Ready To Move Flats in Bhubaneswar",
                "Resale Flats in Bhubaneswar",
            ],
        },
    ];

    const containerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [itemWidth, setItemWidth] = useState(0);

    // Update item width based on screen size
    const updateItemWidth = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1024) {
            setItemWidth(containerRef.current.offsetWidth / 4);
        } else if (screenWidth >= 768) {
            setItemWidth(containerRef.current.offsetWidth / 2);
        } else {
            setItemWidth(containerRef.current.offsetWidth);
        }
    };

    const updateScrollButtons = () => {
        const el = containerRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    useEffect(() => {
        updateItemWidth();
        updateScrollButtons();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleResize = () => {
        updateItemWidth();
        updateScrollButtons();
    };

    const scroll = (direction) => {
        const el = containerRef.current;
        if (!el || itemWidth === 0) return;
        el.scrollBy({
            left: direction === "right" ? itemWidth : -itemWidth,
            behavior: "smooth",
        });
        setTimeout(updateScrollButtons, 300);
    };

    return (
        <>
            <section className="bg-[#F4EFE5]">
                <div className="container mx-auto py-10 px-4">
                    <div className="mb-4 container pt-5 ps-0">
                        <h2 className="mb-2 text-2xl font-bold font-geometric-regular text-[#3C4142] ">
                            Property Options
                        </h2>
                        <div className="w-12 h-1 bg-yellow-500"></div>
                    </div>
                    <div className="w-full">
                        <div className="flex border-b border-gray-300">
                            <button
                                className={`px-4 py-2 font-medium text-base ${activeTab === "buy"
                                    ? "border-b-2 border-[#367588] text-[#367588]"
                                    : "text-gray-800"
                                    }`}
                                onClick={() => setActiveTab("buy")}
                            >
                                Buy
                            </button>
                            {/* <button
                                className={`px-4 py-2 font-medium text-base ${activeTab === "rent"
                                    ? "border-b-2 border-[#367588] text-[#367588]"
                                    : "text-gray-500"
                                    }`}
                                onClick={() => setActiveTab("rent")}
                            >
                                Rent
                            </button> */}
                        </div>

                        <div className="mt-4">
                            {activeTab === "buy" && (
                                <div className="relative w-full">
                                    {/* Left Arrow */}
                                    {canScrollLeft && (
                                        <button
                                            onClick={() => scroll("left")}
                                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
                                        >
                                            <ChevronLeft />
                                        </button>
                                    )}
                                    {/* Scrollable Area */}
                                    <div ref={containerRef} className="overflow-hidden">
                                        <div className="flex space-x-4 transition-all duration-300">
                                            {buyItems.map((buyItem, index) => (
                                                <div
                                                    key={index}
                                                    className="flex-shrink-0"
                                                    style={{
                                                        width:
                                                            window.innerWidth >= 1024
                                                                ? "25%"
                                                                : window.innerWidth >= 768
                                                                    ? "50%"
                                                                    : "100%",
                                                    }}
                                                >
                                                    <h4 className="text-base font-bold mb-2">{buyItem.title}</h4>
                                                    {buyItem.items.map((item, itemIndex) => (
                                                        <p
                                                            key={itemIndex}
                                                            className="text-base mb-1 hover:text-[#367588] cursor-pointer"
                                                        >
                                                            {item}
                                                        </p>
                                                    ))}

                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Arrow */}
                                    {canScrollRight && (
                                        <button
                                            onClick={() => scroll("right")}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
                                        >
                                            <ChevronRight />
                                        </button>
                                    )}
                                </div>
                            )}
                            {/* {activeTab === "rent" && (
                                <div className="relative w-full">
                                
                                {canScrollLeft && (
                                    <button
                                        onClick={() => scroll("left")}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
                                    >
                                        <ChevronLeft />
                                    </button>
                                )}
                               
                                <div ref={containerRef} className="overflow-hidden">
                                    <div className="flex space-x-4 transition-all duration-300">
                                        {rentItems.map((rentItem, index) => (
                                            <div
                                                key={index}
                                                className="flex-shrink-0"
                                                style={{
                                                    width:
                                                        window.innerWidth >= 1024
                                                            ? "25%"
                                                            : window.innerWidth >= 768
                                                                ? "50%"
                                                                : "100%",
                                                }}
                                            >
                                                <h4 className="text-base font-bold mb-2">{rentItem.title}</h4>
                                                {rentItem.items.map((item, itemIndex) => (
                                                    <p
                                                        key={itemIndex}
                                                        className="text-base mb-1 hover:text-[#367588] cursor-pointer"
                                                    >
                                                        {item}
                                                    </p>
                                                ))}

                                            </div>
                                        ))}
                                    </div>
                                </div>

                                
                                {canScrollRight && (
                                    <button
                                        onClick={() => scroll("right")}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
                                    >
                                        <ChevronRight />
                                    </button>
                                )}
                            </div>
                            )} */}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PropertyOption;