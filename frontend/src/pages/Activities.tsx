import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ListView from '../components/ListView';
import apiClient from '../services/apiClient';

const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getActivities(20, 0);
      setActivities(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'type', label: 'Type', minWidth: 100 },
    { id: 'subject', label: 'Subject', minWidth: 250 },
    { id: 'status', label: 'Status', minWidth: 120 },
    { id: 'priority', label: 'Priority', minWidth: 100 },
    { id: 'dueDate', label: 'Due Date', minWidth: 150 },
  ];

  const handleNew = () => {
    console.log('New Activity');
  };

  const handleEdit = (item: any) => {
    console.log('Edit Activity:', item);
  };

  const handleViewDetails = (item: any) => {
    console.log('View Details:', item);
  };

  const handleDelete = async (item: any) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      try {
        await apiClient.deleteActivity(item.id);
        fetchActivities();
      } catch (error) {
        console.error('Failed to delete activity:', error);
      }
    }
  };

  return (
    <Box>
      <ListView
        data={activities.map((activity) => ({
          ...activity,
          dueDate: activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : '-',
        }))}
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

export default ActivitiesPage;
