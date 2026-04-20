import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListView from '../components/ListView';
import OpportunityForm from '../components/Forms/OpportunityForm';
import apiClient from '../services/apiClient';

const OpportunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getOpportunities(20, 0);
      setOpportunities(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'name', label: 'Opportunity Name', minWidth: 200 },
    { id: 'stage', label: 'Stage', minWidth: 150 },
    { id: 'amount', label: 'Amount', minWidth: 150 },
    { id: 'probability', label: 'Probability', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 120 },
  ];

  const handleNew = () => {
    setFormMode('create');
    setEditingId(null);
    setFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setFormMode('edit');
    setEditingId(item.id);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    fetchOpportunities();
  };

  const handleViewDetails = (item: any) => {
    navigate(`/opportunities/${item.id}`);
  };

  const handleDelete = async (item: any) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await apiClient.deleteOpportunity(item.id);
        fetchOpportunities();
      } catch (error) {
        console.error('Failed to delete opportunity:', error);
      }
    }
  };

  return (
    <Box>
      <ListView
        data={opportunities}
        columns={columns}
        loading={loading}
        onAdd={handleNew}
        onEdit={handleEdit}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
        total={total}
      />
      <OpportunityForm
        open={formOpen}
        mode={formMode}
        opportunityId={editingId || undefined}
        onClose={() => setFormOpen(false)}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
};

export default OpportunitiesPage;
