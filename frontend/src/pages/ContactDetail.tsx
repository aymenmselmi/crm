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
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Person, Business, AssignmentOutlined } from '@mui/icons-material';
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return '#e8f5e9';
    case 'inactive':
      return '#ffebee';
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

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [showActivityModal, setShowActivityModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchContactData();
    }
  }, [id]);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const [contactRes, accountRes, activitiesRes] = await Promise.all([
        apiClient.getContact(id!),
        apiClient.getContactAccount(id!),
        apiClient.getContactActivities(id!, 50, 0),
      ]);

      setContact(contactRes);
      setAccount(accountRes);
      setActivities(activitiesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch contact details:', error);
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
      const activitiesRes = await apiClient.getContactActivities(id!, 50, 0);
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

  if (!contact) {
    return (
      <Container>
        <Box sx={{ py: 4 }}>
          <Typography variant="h6" color="error">
            Contact not found
          </Typography>
          <Button variant="contained" onClick={() => navigate('/contacts')} sx={{ mt: 2 }}>
            Back to Contacts
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Contact Header */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<Person sx={{ fontSize: 40, color: 'primary.main' }} />}
          title={`${contact.firstName} ${contact.lastName}`}
          subheader={contact.title || 'No title'}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="body2">
                {contact.email ? (
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                ) : (
                  '-'
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Phone
              </Typography>
              <Typography variant="body2">
                {contact.phone ? (
                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                ) : (
                  '-'
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Department
              </Typography>
              <Typography variant="h6">{contact.department || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Status
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  px: 1.5,
                  py: 0.5,
                  backgroundColor: getStatusColor(contact.status),
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                {contact.status}
              </Box>
            </Grid>
          </Grid>

          {/* Account Link */}
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
              <Typography color="textSecondary" sx={{ mt: 1, fontSize: '0.875rem' }}>
                {account.industry} • {account.type}
              </Typography>
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
            <Typography color="textSecondary">No activities linked to this contact</Typography>
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
        contactId={id}
        title="Add Activity to Contact"
      />
    </Container>
  );
};

export default ContactDetail;
