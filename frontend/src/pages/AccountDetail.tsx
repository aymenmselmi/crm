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
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Business, Contacts, TrendingUp } from '@mui/icons-material';
import apiClient from '../services/apiClient';

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

const AccountDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [account, setAccount] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (id) {
      fetchAccountData();
    }
  }, [id]);

  const fetchAccountData = async () => {
    try {
      setLoading(true);
      const [accountRes, contactsRes, opportunitiesRes] = await Promise.all([
        apiClient.getAccount(id!),
        apiClient.getAccountContacts(id!, 50, 0),
        apiClient.getAccountOpportunities(id!, 50, 0),
      ]);

      setAccount(accountRes);
      setContacts(contactsRes.data || []);
      setOpportunities(opportunitiesRes.data || []);
    } catch (error) {
      console.error('Failed to fetch account details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!account) {
    return (
      <Container>
        <Box sx={{ py: 4 }}>
          <Typography variant="h6" color="error">
            Account not found
          </Typography>
          <Button variant="contained" onClick={() => navigate('/accounts')} sx={{ mt: 2 }}>
            Back to Accounts
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Account Header */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<Business sx={{ fontSize: 40, color: 'primary.main' }} />}
          title={account.name}
          subheader={account.type}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Industry
              </Typography>
              <Typography variant="h6">{account.industry || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Website
              </Typography>
              <Typography variant="body2">
                {account.website ? (
                  <a href={account.website} target="_blank" rel="noopener noreferrer">
                    {account.website}
                  </a>
                ) : (
                  '-'
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Employees
              </Typography>
              <Typography variant="h6">{account.employees || '-'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography color="textSecondary" gutterBottom>
                Annual Revenue
              </Typography>
              <Typography variant="h6">
                {account.annualRevenue ? `$${(account.annualRevenue / 1000000).toFixed(2)}M` : '-'}
              </Typography>
            </Grid>
          </Grid>
          {account.description && (
            <Box sx={{ mt: 2 }}>
              <Typography color="textSecondary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2">{account.description}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Tabs for related records */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              label={`Contacts (${contacts.length})`}
              icon={<Contacts />}
              iconPosition="start"
            />
            <Tab
              label={`Opportunities (${opportunities.length})`}
              icon={<TrendingUp />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Contacts Tab */}
        <TabPanel value={tabValue} index={0}>
          {contacts.length === 0 ? (
            <Typography color="textSecondary">No contacts linked to this account</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      hover
                      onClick={() => navigate(`/contacts/${contact.id}`)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{`${contact.firstName} ${contact.lastName}`}</TableCell>
                      <TableCell>{contact.email || '-'}</TableCell>
                      <TableCell>{contact.phone || '-'}</TableCell>
                      <TableCell>{contact.title || '-'}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1.5,
                            py: 0.5,
                            backgroundColor:
                              contact.status === 'active' ? '#e8f5e9' : '#f5f5f5',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                        >
                          {contact.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Opportunities Tab */}
        <TabPanel value={tabValue} index={1}>
          {opportunities.length === 0 ? (
            <Typography color="textSecondary">No opportunities linked to this account</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Opportunity Name</TableCell>
                    <TableCell>Stage</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Probability</TableCell>
                    <TableCell>Expected Close</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {opportunities.map((opportunity) => (
                    <TableRow
                      key={opportunity.id}
                      hover
                      onClick={() => navigate(`/opportunities/${opportunity.id}`)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{opportunity.name}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            backgroundColor: '#e3f2fd',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                        >
                          {opportunity.stage}
                        </Box>
                      </TableCell>
                      <TableCell>${opportunity.amount?.toLocaleString() || '0'}</TableCell>
                      <TableCell>{opportunity.probability || '0'}%</TableCell>
                      <TableCell>
                        {opportunity.expectedCloseDate
                          ? new Date(opportunity.expectedCloseDate).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1.5,
                            py: 0.5,
                            backgroundColor:
                              opportunity.status === 'closed-won'
                                ? '#e8f5e9'
                                : opportunity.status === 'closed-lost'
                                  ? '#ffebee'
                                  : '#fff3e0',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                        >
                          {opportunity.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </Card>

      <Button
        variant="outlined"
        onClick={() => navigate('/accounts')}
        sx={{ mt: 3 }}
      >
        Back to Accounts
      </Button>
    </Container>
  );
};

export default AccountDetail;
