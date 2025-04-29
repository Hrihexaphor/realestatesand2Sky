import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';

function CampaignSender({ selectedLeads, onClose }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!title || !message) {
      toast.warning('Please fill both title and message.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/campaign/send', {
        leadIds: selectedLeads,
        title,
        message,
      });

      toast.success('Campaign sent successfully!');
      onClose(); // 👈 Close the form after sending
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast.error('Failed to send campaign.');
    }
  };

  return (
    <div className="border p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Send Campaign</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      <textarea
        placeholder="Write your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
        className="w-full mb-4 p-2 border rounded"
      />

      <div className="flex justify-between">
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send to Selected Leads
        </button>
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CampaignSender;
