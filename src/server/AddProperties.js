import React from "react";

const PropertyForm = () => {
  return (
    <div className="bg-white ">
      <div className="max-w-6xl mx-auto px-4 py-10 bg-teal-500 rounded-lg shadow-md my-4">
        <h1 className="text-center text-white">Post your Properties</h1>
        {/* Basic Info */}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            Basic Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Title"
              className="input p-2 rounded"
            />
            <select className="input  p-2 rounded">
              <option>Property Type</option>
            </select>
            <select className="input  p-2 rounded">
              <option>Transaction Type</option>
            </select>
            <select className="input  p-2 rounded">
              <option>Possession Status</option>
            </select>
            <input
              type="text"
              placeholder="Expected Price"
              className="input  p-2 rounded"
            />
            <input
              type="text"
              placeholder="Developer Price"
              className="input  p-2 rounded"
            />
          </div>
        </section>

        {/* Details */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Project Name"
              className="input  p-2 rounded"
            />
            <input
              type="text"
              placeholder="Project Area"
              className="input  p-2 rounded"
            />
            <input
              type="text"
              placeholder="RERA ID"
              className="input  p-2 rounded"
            />
            <input
              type="text"
              placeholder="City"
              className="input  p-2 rounded"
            />
            <input
              type="text"
              placeholder="Locality"
              className="input  p-2 rounded "
            />
            <input
              type="number"
              placeholder="Bedrooms"
              className="input  p-2 rounded"
            />
            <input
              type="number"
              placeholder="Bathrooms"
              className="input  p-2 rounded"
            />
            <input
              type="number"
              placeholder="Total Floors"
              className="input  p-2 rounded"
            />
            <select className="input  p-2 rounded">
              <option>Facing 6mm</option>
            </select>
            <input
              type="text"
              placeholder="Facing"
              className="input  p-2 rounded"
            />
            <input
              type="text"
              placeholder="Built-up Area"
              className="input  p-2 rounded"
            />
            <input
              type="text"
              placeholder="Carpet Area"
              className="input  p-2 rounded"
            />
            <input
              type="text"
              placeholder="Plot Length"
              className="input  p-2 rounded"
            />
            <input
              type="text"
              placeholder="Plot Breadth"
              className="input  p-2 rounded"
            />
            <input
              type="text"
              placeholder="Description"
              className="input  p-2 rounded"
            />
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-3">
            <textarea
              placeholder="About Location"
              className="w-full h-24 px-4 py-2 border-2 border-indigo-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            ></textarea>
          </div>
        </section>

        {/* Location */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Latitude"
              className="input  p-2 rounded"
            />
            <input
              type="text"
              placeholder="Longitude"
              className="input  p-2 rounded"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Address"
              className="input mt-4  p-2 rounded"
            />
            <select className="input mt-4  p-2 rounded ms-2 pe-2">
              <option>Select amenities</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
                Images
              </h2>
              <input type="file" multiple className="input" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-indigo-700 mb-4 ">
                Nearby
              </h2>
              <select className="input  p-2 rounded">
                <option>Select nearby places</option>
              </select>
            </div>
          
          </div>
         
        </section>

        <div className="text-center">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
