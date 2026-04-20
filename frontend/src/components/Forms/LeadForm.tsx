import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import apiClient from '../../services/apiClient';

interface LeadFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  leadId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({
  open,
  mode,
  leadId,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    status: 'new' as 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected',
    source: 'website' as 'website' | 'email' | 'phone' | 'referral' | 'event' | 'social' | 'cold',
    notes: '',
    estimatedValue: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && leadId) {
        loadLead(leadId);
      } else if (mode === 'create') {
        resetForm();
      }
    }
  }, [open, mode, leadId]);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      status: 'new',
      source: 'website',
      notes: '',
      estimatedValue: '',
    });
    setError('');
  };

  const loadLead = async (id: string) => {
    try {
      setFetchLoading(true);
      const lead = await apiClient.getLead(id);
      setFormData({
        firstName: lead.firstName || '',
        lastName: lead.lastName || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        title: lead.title || '',
        status: lead.status || 'new',
        source: lead.source || 'website',
        notes: lead.notes || '',
        estimatedValue: lead.estimatedValue || '',
      });
      setError('');
    } catch (err: any) {
      setError(`Failed to load lead: ${err.message}`);
    } finally {
      setFetchLoading(false);
    }
  };

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
      if (!formData.firstName.trim()) {
        setError('First name is required');
        return;
      }
      if (!formData.lastName.trim()) {
        setError('Last name is required');
        return;
      }

      setLoading(true);

      const payload = {
        ...formData,
        estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : null,
      };

      if (mode === 'create') {
        await apiClient.createLead(payload);
      } else {
        await apiClient.updateLead(leadId!, payload);
      }

      setError('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'create' ? 'New Lead' : 'Edit Lead';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
            {error}
          </Alert>
        )}
        {fetchLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
            />

            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Job Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="qualified">Qualified</MenuItem>
                <MenuItem value="converted">Converted</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Lead Source</InputLabel>
              <Select
                name="source"
                value={formData.source}
                onChange={handleChange}
                label="Lead Source"
              >
                <MenuItem value="website">Website</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="phone">Phone</MenuItem>
                <MenuItem value="referral">Referral</MenuItem>
                <MenuItem value="event">Event</MenuItem>
                <MenuItem value="social">Social Media</MenuItem>
                <MenuItem value="cold">Cold Calling</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Estimated Value"
              name="estimatedValue"
              type="number"
              value={formData.estimatedValue}
              onChange={handleChange}
              fullWidth
              inputProps={{ step: '0.01', min: '0' }}
            />

            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || fetchLoading}
        >
          {loading ? <CircularProgress size={20} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeadForm;
