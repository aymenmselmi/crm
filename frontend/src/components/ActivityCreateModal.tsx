import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Alert,
} from '@mui/material';
import apiClient from '../services/apiClient';

interface ActivityCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contactId?: string;
  opportunityId?: string;
  title?: string;
}

const ActivityCreateModal: React.FC<ActivityCreateModalProps> = ({
  open,
  onClose,
  onSuccess,
  contactId,
  opportunityId,
  title = 'Add Activity',
}) => {
  const [formData, setFormData] = useState({
    type: 'call' as 'call' | 'email' | 'meeting' | 'task' | 'note',
    subject: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    status: 'pending' as 'pending' | 'in-progress' | 'completed' | 'cancelled',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async () => {
    try {
      if (!formData.subject.trim()) {
        setError('Subject is required');
        return;
      }

      setLoading(true);

      const activityData: any = {
        ...formData,
      };

      if (contactId) {
        activityData.relatedContactId = contactId;
      }
      if (opportunityId) {
        activityData.relatedOpportunityId = opportunityId;
      }

      await apiClient.createActivity(activityData);

      // Reset form
      setFormData({
        type: 'call',
        subject: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending',
      });

      setError('');
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to create activity. Please try again.');
      console.error('Error creating activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        type: 'call',
        subject: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending',
      });
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Type"
            >
              <MenuItem value="call">Call</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="meeting">Meeting</MenuItem>
              <MenuItem value="task">Task</MenuItem>
              <MenuItem value="note">Note</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Activity subject"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Activity description"
            multiline
            rows={3}
            disabled={loading}
          />

          <TextField
            fullWidth
            type="date"
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              label="Priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Creating...' : 'Create Activity'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivityCreateModal;
