import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LeadTable from '../components/LeadTable';
import { toast } from 'react-toastify';
import ErrorBoundary from '../components/ErrorBoundary';

const LeadPage = () => {
  const [leads, setLeads] = useState([]);

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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Leads</h2>
        <ErrorBoundary>
        <LeadTable leads={leads} />
        </ErrorBoundary>
    </div>
  );
};

export default LeadPage;
