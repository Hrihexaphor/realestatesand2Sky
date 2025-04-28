import React from 'react';

const LeadTable = ({ leads }) => {
  return (
    <div className="overflow-auto border rounded-lg">
      <table className="min-w-full text-sm table-auto">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2">Sl NO.</th>
            <th className="px-4 py-2">Visitor Info</th>
            <th className="px-4 py-2">Contact Info</th>
            <th className="px-4 py-2">Inquiry Info</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr key={lead.visitor_id} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>

              <td className="px-4 py-2">
                <div><strong>IP:</strong> {lead.ip_address}</div>
                <div><strong>Device:</strong> {typeof lead.device_info === 'object'
                    ? `${lead.device_info.browser || ''} / ${lead.device_info.os || ''}`
                         : lead.device_info}
                </div>
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
              <td colSpan="4" className="px-4 py-6 text-center text-gray-400">
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
