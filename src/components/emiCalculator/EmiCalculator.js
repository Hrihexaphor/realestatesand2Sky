import React, { useState } from "react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";

const EmaiCalculator = () => {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [emi, setEmi] = useState(null);
  const [errors, setErrors] = useState({});

  const handleCalculate = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!amount) newErrors.amount = true;
    if (!rate) newErrors.rate = true;
    if (!tenure || tenure === 'Select Year') newErrors.tenure = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setEmi(null);
      return;
    }

    const principal = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const loanTenure = parseInt(tenure);

    if (isNaN(principal) || isNaN(annualRate) || isNaN(loanTenure)) {
      setEmi(null);
      return;
    }

    const monthlyRate = annualRate / (12 * 100); // Convert to monthly rate
    const numberOfMonths = loanTenure * 12;

    const emiAmount =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
      (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

    setEmi(emiAmount.toFixed(2));
  };

  const handleReset = () => {
    setAmount('');
    setRate('');
    setTenure('');
    setEmi(null);
    setErrors({});
  };

  return (
    <>
      <NewNav />
      <div className="bg-[#F4EFE5] py-20">
        <div className="container mx-auto px-4">
          <div className="mb-4 container pt-4 ps-0">
            <h2 className="mb-2 text-2xl font-bold font-geometric-regular text-[#3C4142]">
              EMI Calculator
            </h2>
            <div className="w-12 h-1 bg-yellow-500"></div>
          </div>
          <div className="flex items-center justify-center min-h-[600px] rounded-lg bg-none md:bg-[url('https://images.unsplash.com/photo-1696477194962-5c5340cc6bb0?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
            <div className="w-full bg-white shadow-lg rounded-2xl p-6 min-h-[350px] md:w-[350px] w-[310px]">
              <h4 className="text-lg font-bold text-center text-[#3C4142] mb-0">EMI Calculator</h4>
              <p className="text-sm font-semibold text-center text-gray-600">Calculate your monthly loan EMI</p>

              <div className="w-full h-[100px] rounded-2xl p-5 flex flex-col items-center justify-center bg-[#FFD700] mb-4">
                {emi ? (
                  <>
                    <h5 className="mb-0 font-bold text-2xl">₹ {emi}</h5>
                    <p className="text-base font-semibold text-center text-gray-600 mb-0">Monthly EMI</p>
                  </>
                ) : (
                  <>
                    <h5 className="mb-0 font-bold">EMI</h5>
                    <p className="text-base font-semibold text-center text-gray-600 mb-0">Monthly EMI</p>
                  </>
                )}
              </div>

              <form onSubmit={handleCalculate}>
                <div className="w-full flex flex-col my-2">
                  <label className="text-sm font-semibold mb-1">Loan Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter Amount"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (errors.amount) setErrors((prev) => ({ ...prev, amount: false }));
                    }}
                    className={`px-3 py-2 outline-0 ${errors.amount ? 'bg-red-200' : 'bg-[#F5F5DC]'}`}
                  />
                </div>
                <div className="w-full flex flex-col my-2">
                  <label className="text-sm font-semibold mb-1">Annual Interest Rate (%)</label>
                  <input
                    type="number"
                    placeholder="Interest Rate"
                    value={rate}
                    onChange={(e) => {
                      setRate(e.target.value);
                      if (errors.rate) setErrors((prev) => ({ ...prev, rate: false }));
                    }}
                    className={`px-3 py-2 outline-0 ${errors.rate ? 'bg-red-200' : 'bg-[#F5F5DC]'}`}
                  />
                </div>
                <div className="w-full flex flex-col my-2">
                  <label className="text-sm font-semibold mb-1">Loan Tenure (Years)</label>
                  <select
                    value={tenure}
                    onChange={(e) => {
                      setTenure(e.target.value);
                      if (errors.tenure) setErrors((prev) => ({ ...prev, tenure: false }));
                    }}
                    className={`block w-full px-3 py-2 outline-0 ${errors.tenure ? 'bg-red-200' : 'bg-[#F5F5DC]'}`}
                  >
                    <option>Select Year</option>
                    <option value="5">5 Yrs</option>
                    <option value="10">10 Yrs</option>
                    <option value="15">15 Yrs</option>
                  </select>
                </div>

                <div className="w-full mt-4 flex gap-2">
                  <button
                    type="submit"
                    className="w-1/2 bg-[#367588] hover:bg-[#1386a8] text-white py-2 rounded"
                  >
                    Calculate
                  </button>
                  <button
                    type="button"
                    className="w-1/2 bg-gray-300 text-black py-2 rounded"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmaiCalculator;
