import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListView from '../components/ListView';
import apiClient from '../services/apiClient';

const ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getContacts(20, 0);
      setContacts(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'firstName', label: 'First Name', minWidth: 150 },
    { id: 'lastName', label: 'Last Name', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'phone', label: 'Phone', minWidth: 150 },
    { id: 'title', label: 'Title', minWidth: 150 },
  ];

  const handleNew = () => {
    console.log('New Contact');
  };

  const handleEdit = (item: any) => {
    console.log('Edit Contact:', item);
  };

  const handleViewDetails = (item: any) => {
    navigate(`/contacts/${item.id}`);
  };

  const handleDelete = async (item: any) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await apiClient.deleteContact(item.id);
        fetchContacts();
      } catch (error) {
        console.error('Failed to delete contact:', error);
      }
    }
  };

  return (
    <Box>
      <ListView
        data={contacts}
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

export default ContactsPage;
