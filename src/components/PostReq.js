import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
// import NewNav from "./header/NewNav";
// import Footer from "./footer/Footer";

const PostReq = () => {
  const [activeTab, setActiveTab] = useState("Buy");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    city: '',
    budget: '',
    property: '',
    constructionStatus: '',
    professionTp: '',
    intrestHloan: '',
    knowCreditScore: '',
    payBrokerage: '',
    onsiteExpl: '',
  });
  const [sellFormData, setSellFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    city: '',
    property: '',
    constructionStatus: '',
    payBrokerage: '',
  });

  const handleBuySubmit = async (e) => {
    e.preventDefault();
    alert("form submit")
    setFormData({
      name: '',
      email: '',
      whatsapp: '',
      city: '',
      budget: '',
      property: '',
      constructionStatus: '',
      professionTp: '',
      intrestHloan: '',
      knowCreditScore: '',
      payBrokerage: '',
      onsiteExpl: '',
    });
    //  if (!validate()) return; 

    // try {
    //   const response = await axios.post('https://your-api-endpoint.com/submit', formData);
    //   console.log('Success:', response.data);
    //   setSubmitted(true);
    // } catch (error) {
    //   console.error('Error submitting form:', error);
    // }
  };
  const handleSellSubmit = (e) => {
     e.preventDefault();
    alert("form submit")
    setSellFormData({
      name: '',
    email: '',
    whatsapp: '',
    city: '',
    property: '',
    constructionStatus: '',
    payBrokerage: '',
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSellChange = (e) => {
    const { name, value } = e.target;
    setSellFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* <NewNav /> */}
      <div className="bg-white">
        <section>
          <div className="flex">
            <div className="req-left-box relative">
              <img src={"https://images.unsplash.com/photo-1520880446380-51410f244831?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXxQV283WUx4Nml1Y3x8ZW58MHx8fHx8"} alt="req-img" className="w-full h-full cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="absolute top-[30%] px-[8%]">
                <h1 className="text-white font-bold mb-3">Save Money,<br /> Save The Environment.</h1>
                <h4 className="text-white font-base mb-3">Providing Value to Our Clients Through Ongoing Product & Innnovations.</h4>
                <p className="text-white font-base mb-2">Our real-estate service delivers value through customer-focused solutions, transparacy and expert support.</p>
              </div>
            </div>
            <div className="req-right-box p-10">
              <Link to="/" className="cursor-pointer text-xl font-[600] no-underline flex items-center gap-1">
                <RiArrowLeftSLine className="text-[25px] font-bold mt-[4px]" /> Home
              </Link>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-6 space-y-4 sm:space-y-0">
                <h4 className="text-lg text-[#3C4142] sm:text-xl md:text-2xl font-sans font-bold">
                  Post Your Requirement
                </h4>
                <div className="space-x-0 sm:space-x-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded text-white transition ${activeTab === "Buy"
                      ? "bg-[#367588] hover:bg-[#1386a8]"
                      : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    onClick={() => setActiveTab("Buy")}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded text-white transition ${activeTab === "Sell"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    onClick={() => setActiveTab("Sell")}
                  >
                    Sell
                  </button>
                </div>
              </div>
              <div>
                {activeTab === "Buy" && (
                  <form className="space-y-6" onSubmit={handleBuySubmit}>
                    {/* Input Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Name */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">Name :</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Name"
                          className="w-full h-[50px] pl-5 pr-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600"></i>
                      </div>
                      {/* Email */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">Email :</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email"
                          className="w-full h-[50px] pl-5 pr-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600"></i>
                      </div>
                      {/* Phone */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">WhatsApp Number :</label>
                        <input
                          type="text"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleChange}
                          placeholder="WhatsApp Number"
                          maxLength={10}
                          className="w-full h-[50px] pl-5 pr-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <i className="fas fa-phone-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600"></i>
                      </div>
                      {/* Address */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">City :</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="City"
                          className="w-full h-[50px] pl-5 pr-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <i className="fas fa-map-marker-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600"></i>
                      </div>
                      {/* Budget */}
                      <div className="col-span-1 sm:col-span-2">
                        <label className="text-[#3C4142] font-semibold mb-1">Budget :</label>
                        <input
                          type="text"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          placeholder="Budget (e.g. ₹40 Lakh - ₹60 Lakh)"
                          className="w-full h-[50px] pl-5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      {/* Property Category */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">Property Category :</label>
                        <select required className="border h-[50px] border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                          name="property"
                          value={formData.property}
                          onChange={handleChange}
                        >
                          <option value="">Select a Property</option>
                          {["Premium", "Mid-Range", "Budget"].map((item) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      {/* Construction Status */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">Construction Status :</label>
                        <select required className="border h-[50px] border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                          name="constructionStatus"
                          value={formData.constructionStatus}
                          onChange={handleChange}
                        >
                          <option value="">Select a Status</option>
                          {["Ready to Move",
                            "Pre-Launch",
                            "New Launch",
                            "Possession within 2 Year",
                            "Possession Above 2 Year",].map((item) => (
                              <option value={item}>{item}</option>
                            ))}
                        </select>
                      </div>
                      {/* Profession Type */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">Profession Type :</label>
                        <select required className="border h-[50px] border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                          name="professionTp"
                          value={formData.professionTp}
                          onChange={handleChange}
                        >
                          <option value="">Select a Type</option>
                          {["Job", "Business"].map((item) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      {/* Intrested in Housing Loan */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">Intrested in Housing Loan ? :</label>
                        <select required className="border h-[50px] border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                          name="intrestHloan"
                          value={formData.intrestHloan}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          {["Yes", "No"].map((item) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      {/* Credit Score */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">Do you know your Credit Score ? :</label>
                        <select required className="border h-[50px] border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                          name="knowCreditScore"
                          value={formData.knowCreditScore}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          {["Yes", "No"].map((item) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      {/* Ready to Pay Brokerage? * */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">Ready to Pay Brokerage ? :</label>
                        <select required className="border h-[50px] border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                          name="payBrokerage"
                          value={formData.payBrokerage}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          {["Yes", "No"].map((item) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      {/* Comfortable with On-Site Explanation? * */}
                      <div className="col-span-1 sm:col-span-2">
                        <label className="text-[#3C4142] font-semibold mb-1">Comfortable with On-Site Explanation ? :</label>
                        <select required className="border h-[50px] border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                          name="onsiteExpl"
                          value={formData.onsiteExpl}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          {["Yes", "No"].map((item) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                    </div>



                    {/* Submit */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-[#005F6B] hover:bg-green-700 text-white py-3 rounded transition duration-300"
                      >
                        Submit Requirement
                      </button>
                    </div>
                  </form>
                )}
                {activeTab === "Sell" && (
                  <form className="space-y-6" onSubmit={handleSellSubmit}>
                    {/* Input Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Name */}
                      <div className="col-span-1 sm:col-span-2">
                        <label className="text-[#3C4142] font-semibold mb-1">Name :</label>
                        <input
                          type="text"
                          name="name"
                          value={sellFormData.name}
                          onChange={handleSellChange}
                          placeholder="Name"
                          className="w-full h-[50px] pl-5 pr-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600"></i>
                      </div>
                      {/* Email */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">Email :</label>
                        <input
                          type="email"
                          name="email"
                          value={sellFormData.email}
                          onChange={handleSellChange}
                          placeholder="Email"
                          className="w-full h-[50px] pl-5 pr-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600"></i>
                      </div>
                      {/* Phone */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">WhatsApp Number :</label>
                        <input
                          type="text"
                          name="whatsapp"
                          value={sellFormData.whatsapp}
                          onChange={handleSellChange}
                          placeholder="WhatsApp Number"
                          maxLength={10}
                          className="w-full h-[50px] pl-5 pr-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <i className="fas fa-phone-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600"></i>
                      </div>
                      {/* Address */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">City :</label>
                        <input
                          type="text"
                          name="city"
                          value={sellFormData.city}
                          onChange={handleSellChange}
                          placeholder="City"
                          className="w-full h-[50px] pl-5 pr-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                        <i className="fas fa-map-marker-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600"></i>
                      </div>
                      {/* Property Category */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">Property Category :</label>
                        <select required className="border h-[50px] border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                          name="property"
                          value={sellFormData.property}
                          onChange={handleSellChange}
                        >
                          <option value="">Select a Property</option>
                          {["Premium", "Mid-Range", "Budget"].map((item) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      {/* Construction Status */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">Construction Status :</label>
                        <select required className="border h-[50px] border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                          name="constructionStatus"
                          value={sellFormData.constructionStatus}
                          onChange={handleSellChange}
                        >
                          <option value="">Select a Status</option>
                          {["Ready to Move",
                            "Pre-Launch",
                            "New Launch",
                            "Possession within 2 Year",
                            "Possession Above 2 Year",].map((item) => (
                              <option value={item}>{item}</option>
                            ))}
                        </select>
                      </div>
                      {/* Ready to Pay Brokerage? * */}
                      <div className="relative">
                        <label className="text-[#3C4142] font-semibold mb-1">Ready to Pay Brokerage ? :</label>
                        <select required className="border h-[50px] border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                          name="payBrokerage"
                          value={sellFormData.payBrokerage}
                          onChange={handleSellChange}
                        >
                          <option value="">Select</option>
                          {["Yes", "No"].map((item) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                    </div>



                    {/* Submit */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-[#005F6B] hover:bg-green-700 text-white py-3 rounded transition duration-300"
                      >
                        Submit Requirement
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section >
      </div >
      {/* <Footer /> */}
    </>
  );
};

export default PostReq;
