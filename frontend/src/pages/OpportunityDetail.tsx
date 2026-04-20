import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, Business, AssignmentOutlined } from '@mui/icons-material';
import apiClient from '../services/apiClient';
import ActivityCreateModal from '../components/ActivityCreateModal';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'prospecting':
      return '#bbdefb';
    case 'qualification':
      return '#c5cae9';
    case 'proposal':
      return '#fff9c4';
    case 'negotiation':
      return '#ffe0b2';
    case 'closed-won':
      return '#c8e6c9';
    case 'closed-lost':
      return '#ffccbc';
    default:
      return '#f5f5f5';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return '#fff9c4';
    case 'closed-won':
      return '#c8e6c9';
    case 'closed-lost':
      return '#ffccbc';
    default:
      return '#f5f5f5';
  }
};

const getActivityTypeColor = (type: string) => {
  switch (type) {
    case 'call':
      return '#bbdefb';
    case 'email':
      return '#c8e6c9';
    case 'meeting':
      return '#fff9c4';
    case 'task':
      return '#ffe0b2';
    case 'note':
      return '#f0f4c3';
    default:
      return '#f5f5f5';
  }
};

const getActivityStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return '#c8e6c9';
    case 'in-progress':
      return '#fff9c4';
    case 'pending':
      return '#ffccbc';
    case 'cancelled':
      return '#ffebee';
    default:
      return '#f5f5f5';
  }
};

const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [showActivityModal, setShowActivityModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOpportunityData();
    }
  }, [id]);

  const fetchOpportunityData = async () => {
    try {
      setLoading(true);
      const [oppRes, accountRes, activitiesRes] = await Promise.all([
        apiClient.getOpportunity(id!),
        apiClient.getOpportunityAccount(id!),
        apiClient.getOpportunityActivities(id!, 50, 0),
      ]);

      setOpportunity(oppRes);
      setAccount(accountRes);
      setActivities(activitiesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch opportunity details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleActivityCreated = async () => {
    // Refresh activities list after creating new activity
    try {
      const activitiesRes = await apiClient.getOpportunityActivities(id!, 50, 0);
      setActivities(activitiesRes.data || []);
    } catch (error) {
      console.error('Failed to refresh activities:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!opportunity) {
    return (
      <Container>
        <Box sx={{ py: 4 }}>
          <Typography variant="h6" color="error">
            Opportunity not found
          </Typography>
          <Button variant="contained" onClick={() => navigate('/opportunities')} sx={{ mt: 2 }}>
            Back to Opportunities
          </Button>
        </Box>
      </Container>
    );
  }

  const expectedRevenue = (opportunity.amount || 0) * ((opportunity.probability || 0) / 100);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Opportunity Header */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />}
          title={opportunity.name}
          subheader={account ? account.name : 'No account'}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Stage
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  px: 1.5,
                  py: 0.5,
                  backgroundColor: getStageColor(opportunity.stage),
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              >
                {opportunity.stage}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Amount
              </Typography>
              <Typography variant="h6">
                ${parseFloat(opportunity.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Probability
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">{opportunity.probability}%</Typography>
                <LinearProgress
                  variant="determinate"
                  value={opportunity.probability || 0}
                  sx={{ flex: 1, minWidth: 100 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Expected Revenue
              </Typography>
              <Typography variant="h6">
                ${expectedRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Status
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  px: 1.5,
                  py: 0.5,
                  backgroundColor: getStatusColor(opportunity.status),
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              >
                {opportunity.status}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Expected Close Date
              </Typography>
              <Typography variant="body2">
                {opportunity.expectedCloseDate
                  ? new Date(opportunity.expectedCloseDate).toLocaleDateString()
                  : '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Actual Close Date
              </Typography>
              <Typography variant="body2">
                {opportunity.actualCloseDate
                  ? new Date(opportunity.actualCloseDate).toLocaleDateString()
                  : '-'}
              </Typography>
            </Grid>
          </Grid>

          {/* Linked Account */}
          {account && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography color="textSecondary" gutterBottom>
                Linked Account
              </Typography>
              <Box
                onClick={() => navigate(`/accounts/${account.id}`)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                <Business sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="h6">{account.name}</Typography>
              </Box>
            </Box>
          )}

          {opportunity.description && (
            <Box sx={{ mt: 2 }}>
              <Typography color="textSecondary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2">{opportunity.description}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Activities */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              label={`Activities (${activities.length})`}
              icon={<AssignmentOutlined />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Activities Tab */}
        <TabPanel value={tabValue} index={0}>
          {activities.length === 0 ? (
            <Typography color="textSecondary">No activities linked to this opportunity</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Type</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Priority</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.id} hover>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1.5,
                            py: 0.5,
                            backgroundColor: getActivityTypeColor(activity.type),
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            textTransform: 'capitalize',
                          }}
                        >
                          {activity.type}
                        </Box>
                      </TableCell>
                      <TableCell>{activity.subject}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1.5,
                            py: 0.5,
                            backgroundColor: getActivityStatusColor(activity.status),
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            textTransform: 'capitalize',
                          }}
                        >
                          {activity.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {activity.dueDate
                          ? new Date(activity.dueDate).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={activity.priority}
                          size="small"
                          variant="outlined"
                          color={
                            activity.priority === 'urgent' || activity.priority === 'high'
                              ? 'error'
                              : activity.priority === 'medium'
                              ? 'warning'
                              : 'default'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowActivityModal(true)}
            >
              Add Activity
            </Button>
          </Box>
        </TabPanel>
      </Card>

      <ActivityCreateModal
        open={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        onSuccess={handleActivityCreated}
        opportunityId={id}
        title="Add Activity to Opportunity"
      />
    </Container>
  );
};

export default OpportunityDetail;
