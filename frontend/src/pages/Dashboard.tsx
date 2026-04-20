import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, Button } from '@mui/material';
import { TrendingUp, People, Flag, Business, Event } from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import apiClient from '../services/apiClient';

interface Stats {
  accounts: number;
  contacts: number;
  leads: number;
  opportunities: number;
  activities: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({
    accounts: 0,
    contacts: 0,
    leads: 0,
    opportunities: 0,
    activities: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [accounts, contacts, leads, opportunities, activities] = await Promise.all([
          apiClient.getAccounts(1, 0),
          apiClient.getContacts(1, 0),
          apiClient.getLeads(1, 0),
          apiClient.getOpportunities(1, 0),
          apiClient.getActivities(1, 0),
        ]);

        setStats({
          accounts: accounts.total || 0,
          contacts: contacts.total || 0,
          leads: leads.total || 0,
          opportunities: opportunities.total || 0,
          activities: activities.total || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Accounts', value: stats.accounts, icon: Business, color: '#0070d2' },
    { label: 'Contacts', value: stats.contacts, icon: People, color: '#0070d2' },
    { label: 'Leads', value: stats.leads, icon: Flag, color: '#0070d2' },
    { label: 'Opportunities', value: stats.opportunities, icon: TrendingUp, color: '#0070d2' },
    { label: 'Activities', value: stats.activities, icon: Event, color: '#0070d2' },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#111' }}>
        Welcome back, {user?.firstName}!
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {statCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={card.label}>
              <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                        {card.label}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#111', mt: 1 }}>
                        {card.value}
                      </Typography>
                    </Box>
                    <IconComponent sx={{ fontSize: 40, color: card.color, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Paper sx={{ p: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Getting Started
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
          <Button variant="outlined" sx={{ justifyContent: 'flex-start', p: 2 }}>
            📊 View Reports
          </Button>
          <Button variant="outlined" sx={{ justifyContent: 'flex-start', p: 2 }}>
            👥 Manage Team
          </Button>
          <Button variant="outlined" sx={{ justifyContent: 'flex-start', p: 2 }}>
            ⚙️ Customize Objects
          </Button>
          <Button variant="outlined" sx={{ justifyContent: 'flex-start', p: 2 }}>
            📚 View Docs
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
