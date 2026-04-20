import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListView from '../components/ListView';
import apiClient from '../services/apiClient';

const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAccounts(20, 0);
      setAccounts(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'name', label: 'Account Name', minWidth: 200 },
    { id: 'industry', label: 'Industry', minWidth: 150 },
    { id: 'revenue', label: 'Revenue', minWidth: 150, format: (val: any) => val ? `$${val.toLocaleString()}` : '-' },
    { id: 'website', label: 'Website', minWidth: 150 },
  ];

  const handleNew = () => {
    console.log('New Account');
  };

  const handleEdit = (item: any) => {
    console.log('Edit Account:', item);
  };

  const handleViewDetails = (item: any) => {
    navigate(`/accounts/${item.id}`);
  };

  const handleDelete = async (item: any) => {
    if (confirm('Are you sure you want to delete this account?')) {
      try {
        await apiClient.deleteAccount(item.id);
        fetchAccounts();
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  return (
    <Box>
      <ListView
        data={accounts}
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

export default AccountsPage;
