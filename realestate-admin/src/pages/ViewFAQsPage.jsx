import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ViewFAQsPage = () => {
  const { id } = useParams(); // property ID
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchFaqs = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/faq/${id}`);
        setFaqs(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load FAQs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFaqs();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">FAQs for Property #{id}</h2>
        <Link 
          to={`/dashboard/property/${id}/add-faq`}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New FAQ
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : faqs.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
          <p className="text-yellow-700">No FAQs found for this property.</p>
          <p className="mt-2">Add your first FAQ using the button above.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                <span className="text-blue-600 mr-2">Q:</span> 
                {faq.question}
              </h3>
              <div className="pl-6 border-l-2 border-gray-300 mt-3">
                <p className="text-gray-700">
                  <span className="text-blue-600 font-semibold mr-2">A:</span>
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewFAQsPage;
