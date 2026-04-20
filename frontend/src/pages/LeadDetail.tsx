import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, PersonAdd } from '@mui/icons-material';
import apiClient from '../services/apiClient';

const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchLeadData();
    }
  }, [id]);

  const fetchLeadData = async () => {
    try {
      setLoading(true);
      const leadData = await apiClient.getLead(id!);
      setLead(leadData);
    } catch (error) {
      console.error('Failed to fetch lead details:', error);
      setError('Failed to load lead details');
    } finally {
      setLoading(false);
    }
  };

  const handleConvertClick = () => {
    setOpenDialog(true);
  };

  const handleConvertConfirm = async () => {
    try {
      setConverting(true);
      setError(null);
      const result = await apiClient.convertLead(id!);
      
      // Show success and redirect
      setOpenDialog(false);
      alert(`Lead converted successfully!\n\nCreated:\n- Account: ${result.account.name}\n- Contact: ${result.contact.firstName} ${result.contact.lastName}\n- Opportunity: ${result.opportunity.name}`);
      
      navigate('/leads');
    } catch (error: any) {
      console.error('Failed to convert lead:', error);
      setError(error.response?.data?.message || 'Failed to convert lead');
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!lead) {
    return (
      <Container>
        <Box sx={{ py: 4 }}>
          <Typography variant="h6" color="error">
            Lead not found
          </Typography>
          <Button variant="contained" onClick={() => navigate('/leads')} sx={{ mt: 2 }}>
            Back to Leads
          </Button>
        </Box>
      </Container>
    );
  }

  const statusColors: Record<string, string> = {
    new: '#ffb74d',
    contacted: '#64b5f6',
    qualified: '#81c784',
    converted: '#a5d6a7',
    rejected: '#e57373',
  };

  const sourceColors: Record<string, string> = {
    website: '#90caf9',
    email: '#f48fb1',
    phone: '#ce93d8',
    referral: '#a1887f',
    event: '#ffcc80',
    social: '#80deea',
    cold: '#ffab91',
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Lead Header */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<PersonAdd sx={{ fontSize: 40, color: 'primary.main' }} />}
          title={`${lead.firstName} ${lead.lastName}`}
          subheader={lead.company || 'No company specified'}
          action={
            lead.status !== 'converted' && (
              <Button
                variant="contained"
                color="success"
                startIcon={<TrendingUp />}
                onClick={handleConvertClick}
                disabled={converting}
              >
                {converting ? 'Converting...' : 'Convert Lead'}
              </Button>
            )
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Status
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  px: 1.5,
                  py: 0.5,
                  backgroundColor: statusColors[lead.status] || '#f5f5f5',
                  color: '#000',
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              >
                {lead.status}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Source
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  px: 1.5,
                  py: 0.5,
                  backgroundColor: sourceColors[lead.source] || '#f5f5f5',
                  color: '#000',
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              >
                {lead.source}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Lead Score
              </Typography>
              <Typography variant="h6">{lead.leadScore || 0}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Est. Value
              </Typography>
              <Typography variant="h6">
                ${lead.estimatedValue ? lead.estimatedValue.toLocaleString() : '0'}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Typography color="textSecondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="body2">
                {lead.email ? (
                  <a href={`mailto:${lead.email}`}>{lead.email}</a>
                ) : (
                  '-'
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography color="textSecondary" gutterBottom>
                Phone
              </Typography>
              <Typography variant="body2">
                {lead.phone ? (
                  <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                ) : (
                  '-'
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography color="textSecondary" gutterBottom>
                Title
              </Typography>
              <Typography variant="body2">{lead.title || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography color="textSecondary" gutterBottom>
                Company
              </Typography>
              <Typography variant="body2">{lead.company || '-'}</Typography>
            </Grid>
          </Grid>

          {lead.notes && (
            <Box sx={{ mt: 3 }}>
              <Typography color="textSecondary" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {lead.notes}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/leads')}
        >
          Back to Leads
        </Button>
      </Box>

      {/* Conversion Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Convert Lead</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            This will convert <strong>{lead.firstName} {lead.lastName}</strong> into:
          </Typography>
          <Box sx={{ mt: 2, ml: 2 }}>
            <Typography variant="body2">
              ✓ Account: {lead.company || `${lead.firstName} ${lead.lastName}`}
            </Typography>
            <Typography variant="body2">
              ✓ Contact: {lead.firstName} {lead.lastName}
            </Typography>
            <Typography variant="body2">
              ✓ Opportunity: {lead.firstName} {lead.lastName} - Opportunity
            </Typography>
          </Box>
          <Typography sx={{ mt: 2 }} color="textSecondary">
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={converting}>
            Cancel
          </Button>
          <Button
            onClick={handleConvertConfirm}
            variant="contained"
            color="success"
            disabled={converting}
          >
            {converting ? 'Converting...' : 'Confirm Conversion'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LeadDetail;
