import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReviewTable = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/pendingreview`);
      setReviews(res.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id, is_approved) => {
    try {
      await axios.put(`${BASE_URL}/api/review/${id}/approve`, { is_approved });
      toast.success(`Review ${is_approved ? 'approved' : 'rejected'}`);
      setIsOpen(false);
      fetchReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Error approving review');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Pending Reviews</h2>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Property</th>
              <th className="px-4 py-2 text-left">Rating</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.map((review, index) => (
              <tr key={review.id}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{review.name}</td>
                <td className="px-4 py-2">{review.property_title}</td>
                <td className="px-4 py-2">{review.rating}</td>
                <td className="px-4 py-2">{new Date(review.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
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
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No pending reviews
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal without Headless UI */}
      {isOpen && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Review Details</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Name:</strong> {selectedReview.name}</p>
              <p><strong>Email:</strong> {selectedReview.email}</p>
              <p><strong>Phone:</strong> {selectedReview.phone}</p>
              <p><strong>Property:</strong> {selectedReview.property_title}</p>
              <p><strong>Rating:</strong> {selectedReview.rating}</p>
              <p><strong>Review:</strong> {selectedReview.review}</p>
              <p><strong>Date:</strong> {new Date(selectedReview.created_at).toLocaleString()}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                onClick={() => handleApprove(selectedReview.id, true)}
              >
                Approve
              </button>
              <button
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                onClick={() => handleApprove(selectedReview.id, false)}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewTable;
