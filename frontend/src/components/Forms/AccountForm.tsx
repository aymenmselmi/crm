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

interface AccountFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  accountId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({
  open,
  mode,
  accountId,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'prospect' as 'prospect' | 'customer' | 'partner' | 'competitor',
    website: '',
    phone: '',
    email: '',
    industry: '',
    annualRevenue: '',
    description: '',
    billingAddress: '',
    shippingAddress: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    if (open && mode === 'edit' && accountId) {
      loadAccount(accountId);
    } else if (open && mode === 'create') {
      // Reset form for create mode
      setFormData({
        name: '',
        type: 'prospect',
        website: '',
        phone: '',
        email: '',
        industry: '',
        annualRevenue: '',
        description: '',
        billingAddress: '',
        shippingAddress: '',
      });
      setError('');
    }
  }, [open, mode, accountId]);

  const loadAccount = async (id: string) => {
    try {
      setFetchLoading(true);
      const account = await apiClient.getAccount(id);
      setFormData({
        name: account.name || '',
        type: account.type || 'prospect',
        website: account.website || '',
        phone: account.phone || '',
        email: account.email || '',
        industry: account.industry || '',
        annualRevenue: account.annualRevenue || '',
        description: account.description || '',
        billingAddress: account.billingAddress || '',
        shippingAddress: account.shippingAddress || '',
      });
      setError('');
    } catch (err: any) {
      setError(`Failed to load account: ${err.message}`);
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
      if (!formData.name.trim()) {
        setError('Account name is required');
        return;
      }

      setLoading(true);

      const payload = {
        ...formData,
        annualRevenue: formData.annualRevenue ? parseFloat(formData.annualRevenue) : null,
      };

      if (mode === 'create') {
        await apiClient.createAccount(payload);
      } else {
        await apiClient.updateAccount(accountId!, payload);
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

  const title = mode === 'create' ? 'New Account' : 'Edit Account';

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
              label="Account Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
            />

            <FormControl fullWidth>
              <InputLabel>Account Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Account Type"
              >
                <MenuItem value="prospect">Prospect</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="partner">Partner</MenuItem>
                <MenuItem value="competitor">Competitor</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
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
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Annual Revenue"
              name="annualRevenue"
              type="number"
              value={formData.annualRevenue}
              onChange={handleChange}
              fullWidth
              inputProps={{ step: '0.01', min: '0' }}
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              label="Billing Address"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
            />

            <TextField
              label="Shipping Address"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              multiline
              rows={2}
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

export default AccountForm;
