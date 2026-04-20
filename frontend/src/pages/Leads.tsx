import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListView from '../components/ListView';
import apiClient from '../services/apiClient';

const LeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getLeads(20, 0);
      setLeads(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'firstName', label: 'First Name', minWidth: 150 },
    { id: 'lastName', label: 'Last Name', minWidth: 150 },
    { id: 'company', label: 'Company', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'phone', label: 'Phone', minWidth: 120 },
    { id: 'source', label: 'Source', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
  ];

  const handleNew = () => {
    console.log('New Lead');
  };

  const handleEdit = (item: any) => {
    console.log('Edit Lead:', item);
  };

  const handleViewDetails = (item: any) => {
    navigate(`/leads/${item.id}`);
  };

  const handleDelete = async (item: any) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        await apiClient.deleteLead(item.id);
        fetchLeads();
      } catch (error) {
        console.error('Failed to delete lead:', error);
      }
    }
  };

  return (
    <Box>
      <ListView
        data={leads}
        columns={columns}
        loading={loading}
        onAdd={handleNew}
        onEdit={handleEdit}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
        total={total}
      />
    </Box>
  );
};

export default LeadsPage;
