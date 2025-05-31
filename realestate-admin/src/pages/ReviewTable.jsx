import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ReviewTable = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/review/pending`);
      setReviews(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    }
  };

  const handleApprove = async (id, is_approved) => {
    try {
      await axios.patch(`${BASE_URL}/api/review/${id}/approve`, {
        is_approved,
      });
      toast.success(
        `Review ${is_approved ? "approved" : "rejected"} successfully`
      );
      setIsOpen(false);
      fetchReviews();
    } catch (error) {
      console.error("Error approving review:", error);
      toast.error("Error processing the review");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        📝 Pending Property Reviews
      </h2>
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead className="bg-blue-100 text-gray-800 text-xs uppercase">
            <tr>
              <th className="px-5 py-3 text-left">#</th>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Property</th>
              <th className="px-5 py-3 text-left">Comment</th>
              <th className="px-5 py-3 text-left">Rating</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {reviews.map((review, index) => (
              <tr key={review.id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-3">{index + 1}</td>
                <td className="px-5 py-3">{review.name}</td>
                <td className="px-5 py-3">{review.property_title}</td>
                <td className="px-5 py-3">{review.review}</td>
                <td className="px-5 py-3">{review.rating}</td>
                <td className="px-5 py-3">
                  {new Date(review.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-center">
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded shadow"
                    onClick={() => {
                      setSelectedReview(review);
                      setIsOpen(true);
                    }}
                  >
                    View & Approve
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No pending reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isOpen && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl relative p-6">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Review Details
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Name:</strong> {selectedReview.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedReview.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedReview.phone}
              </p>
              <p>
                <strong>Property:</strong> {selectedReview.property_title}
              </p>
              <p>
                <strong>Rating:</strong> {selectedReview.rating}
              </p>
              <p>
                <strong>Review:</strong> {selectedReview.review}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedReview.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
                onClick={() => handleApprove(selectedReview.id, true)}
              >
                Approve ✅
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow"
                onClick={() => handleApprove(selectedReview.id, false)}
              >
                Reject ❌
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewTable;
