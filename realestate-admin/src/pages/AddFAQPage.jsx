import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddFAQPage = () => {
  const { id } = useParams(); // property ID
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({ question: '', answer: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      return toast.error('Both fields are required');
    }

    setIsSubmitting(true);
    
    try {
      await axios.post(`${BASE_URL}/api/addfaq`, {
        property_id: id,
        question: formData.question,
        answer: formData.answer
      }, { withCredentials: true });
      toast.success('FAQ added successfully!');
      resetForm(); // Clear the form fields after successful submission
      // Stay on the same page
    } catch (err) {
      console.error(err);
      toast.error('Failed to add FAQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add FAQ</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Question:</label>
          <input 
            name="question" 
            value={formData.question} 
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter question here..."
            required 
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Answer:</label>
          <textarea 
            name="answer" 
            value={formData.answer} 
            onChange={handleChange} 
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter answer here..."
            required 
          />
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear Form
          </button>
          
          <div className="flex">
            <button 
              type="button" 
              onClick={() => navigate(`/dashboard/property`)}
              className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : "Submit FAQ"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddFAQPage;