import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LeadTable from '../components/LeadTable';
import CampaignSender from '../components/CampaignSender'; // Import it
import { toast } from 'react-toastify';

const LeadPage = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showCampaignForm, setShowCampaignForm] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/leads');
        setLeads(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch leads');
      }
    };

    fetchLeads();
  }, []);

  const handleSendCampaign = () => {
    if (selectedLeads.length === 0) {
      toast.warning('Please select at least one lead.');
      return;
    }
    setShowCampaignForm(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Leads</h2>

      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSendCampaign}
        >
          Send Campaign
        </button>
      </div>

      <LeadTable leads={leads} onSelectedLeadsChange={setSelectedLeads} />

      {showCampaignForm && (
        <CampaignSender
          selectedLeads={selectedLeads}
          onClose={() => setShowCampaignForm(false)}
        />
      )}
    </div>
  );
};

export default LeadPage;
