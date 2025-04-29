import React, { useState } from 'react';

const LeadTable = ({ leads, onSelectedLeadsChange }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (visitorId) => {
    setSelectedIds((prev) =>
      prev.includes(visitorId)
        ? prev.filter(id => id !== visitorId)
        : [...prev, visitorId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map(lead => lead.visitor_id));
    }
  };

  // Inform parent component of selected IDs
  React.useEffect(() => {
    onSelectedLeadsChange(selectedIds);
  }, [selectedIds, onSelectedLeadsChange]);

  return (
    <div className="overflow-auto border rounded-lg">
      <table className="min-w-full text-sm table-auto">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">
              <input
                type="checkbox"
                checked={selectedIds.length === leads.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="px-4 py-2">Sl No</th>
            <th className="px-4 py-2">Visitor Info</th>
            <th className="px-4 py-2">Contact Info</th>
            <th className="px-4 py-2">Inquiry Info</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr key={lead.visitor_id} className="border-t">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(lead.visitor_id)}
                  onChange={() => toggleSelect(lead.visitor_id)}
                />
              </td>

              <td className="px-4 py-2">{index + 1}</td>

              <td className="px-4 py-2">
                <div><strong>IP:</strong> {lead.ip_address}</div>
                <div><strong>Device:</strong> {typeof lead.device_info === 'object' ? `${lead.device_info.browser || ''} / ${lead.device_info.os || ''}` : lead.device_info}</div>
                <div><strong>Visited:</strong> {new Date(lead.visit_time).toLocaleString()}</div>
              </td>

              <td className="px-4 py-2">
                <div><strong>Email:</strong> {lead.email || '-'}</div>
                <div><strong>Phone:</strong> {lead.phone || '-'}</div>
              </td>

              <td className="px-4 py-2">
                <div><strong>Property ID:</strong> {lead.property_id || '-'}</div>
                <div><strong>Name:</strong> {lead.inquiry_name || '-'}</div>
                <div><strong>Message:</strong> {lead.message || '-'}</div>
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan="5" className="px-4 py-6 text-center text-gray-400">
                No leads found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
