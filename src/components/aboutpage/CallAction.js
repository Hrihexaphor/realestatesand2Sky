import { useState } from "react";
import {
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

export default function CallToAction() {
  const [phone, setPhone] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleCaptchaVerify = () => {
    setCaptchaVerified(true);
  };

  const handleSendOTP = () => {
    if (phone.length === 10 && captchaVerified) {
      setOtpSent(true);
    }
  };

  // const toggleFAQ = (index) => {
  //   setOpenFAQ(openFAQ === index ? null : index);
  // };

  return (
    <div className="bg-[#F4EFE5] px-6 lg:px-16">
      <div className="flex items-center justify-center min-h-[500px] rounded-lg bg-[url('https://images.unsplash.com/photo-1696477194962-5c5340cc6bb0?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
        <div className="w-full bg-white shadow-lg rounded-2xl p-6 min-h-[350px] md:w-[350px] w-[310px]">
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Get Instant Property Alerts
            </h2>
            <p className="text-gray-600 text-center mt-2">
              Verify your phone number to receive updates.
            </p>
            <form>
              <div className="mt-6">
                <label className="text-gray-700 text-sm font-semibold">
                  Enter Mobile Number
                </label>
                <div className="relative mt-2">
                  <input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    className="ps-10 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <ShieldCheck className="text-green-500" />
                <button
                  className={`w-full px-4 py-2 rounded-lg ${captchaVerified
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                    }`}
                  onClick={handleCaptchaVerify}
                  disabled={captchaVerified}
                >
                  {captchaVerified ? "Verified" : "I'm not a robot"}
                </button>
              </div>
              <button
                className="w-full mt-4 bg-indigo-600 text-white font-semibold cursor-pointer py-2 rounded-lg hover:bg-indigo-700"
                onClick={handleSendOTP}
                disabled={!captchaVerified || phone.length !== 10}
              >
                {otpSent ? "OTP Sent!" : "Send OTP"}
              </button>
            </form>
            {otpSent && (
              <div className="mt-4 flex items-center text-green-600 text-sm font-semibold">
                <CheckCircle className="mr-2" /> OTP has been sent to your
                mobile number.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
