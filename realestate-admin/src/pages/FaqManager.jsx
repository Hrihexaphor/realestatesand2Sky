import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const FaqManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const fetchFAQs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/generalfaq`);
      setFaqs(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load FAQs');
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error('Both fields are required');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/generalfaq/${editingId}`, { question, answer });
        toast.success('FAQ updated');
      } else {
        await axios.post(`${BASE_URL}/api/generalfaq`, { question, answer });
        toast.success('FAQ added');
      }

      setQuestion('');
      setAnswer('');
      setEditingId(null);
      fetchFAQs();
    } catch (err) {
      console.error(err);
      toast.error('Error saving FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq) => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setEditingId(faq.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/generalfaq/${id}`);
      toast.success('FAQ deleted');
      fetchFAQs();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete FAQ');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage FAQs</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div>
          <label className="block font-medium mb-1">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter question"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter answer"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {editingId ? (loading ? 'Updating...' : 'Update FAQ') : loading ? 'Adding...' : 'Add FAQ'}
        </button>
      </form>

      {/* Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4">FAQ List</h3>
        {faqs.length === 0 ? (
          <p className="text-gray-500">No FAQs found.</p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">#</th>
                <th className="border px-4 py-2 text-left">Question</th>
                <th className="border px-4 py-2 text-left">Answer</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq, index) => (
                <tr key={faq.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{faq.question}</td>
                  <td className="border px-4 py-2">{faq.answer}</td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FaqManager;
