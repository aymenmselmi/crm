import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Chip,
  Grid,
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

interface Opportunity {
  id: string;
  name: string;
  amount: number;
  probability: number;
  stage: string;
  status: string;
}

const PIPELINE_STAGES = [
  { id: 'prospecting', label: 'Prospecting', color: '#bbdefb' },
  { id: 'qualification', label: 'Qualification', color: '#c5cae9' },
  { id: 'proposal', label: 'Proposal', color: '#fff9c4' },
  { id: 'negotiation', label: 'Negotiation', color: '#ffe0b2' },
  { id: 'closed-won', label: 'Closed Won', color: '#c8e6c9' },
  { id: 'closed-lost', label: 'Closed Lost', color: '#ffccbc' },
];

const KanbanPipeline: React.FC = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getOpportunities(1000, 0); // Fetch all for pipeline view
      setOpportunities(response.data || []);
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOpportunitiesByStage = (stage: string) => {
    return opportunities.filter((opp) => opp.stage === stage);
  };

  const getStageTotalAmount = (stage: string) => {
    return getOpportunitiesByStage(stage).reduce((sum, opp) => sum + (opp.amount || 0), 0);
  };

  const getStageTotalExpectedRevenue = (stage: string) => {
    return getOpportunitiesByStage(stage).reduce(
      (sum, opp) => sum + (opp.amount || 0) * ((opp.probability || 0) / 100),
      0
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const totalPipelineAmount = opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0);
  const totalExpectedRevenue = opportunities.reduce(
    (sum, opp) => sum + (opp.amount || 0) * ((opp.probability || 0) / 100),
    0
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Pipeline Summary */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TrendingUp sx={{ fontSize: 32, color: 'success.main' }} />
          <Typography variant="h4">Sales Pipeline</Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Pipeline Value
                </Typography>
                <Typography variant="h5">
                  ${totalPipelineAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Expected Revenue
                </Typography>
                <Typography variant="h5">
                  ${totalExpectedRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Opportunities
                </Typography>
                <Typography variant="h5">{opportunities.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Win Probability
                </Typography>
                <Typography variant="h5">
                  {opportunities.length > 0
                    ? (
                        (opportunities.reduce((sum, opp) => sum + (opp.probability || 0), 0) /
                          opportunities.length) *
                        100
                      ).toFixed(0)
                    : 0}
                  %
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Kanban Board */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)',
          },
          gap: 2,
          overflowX: 'auto',
          pb: 2,
        }}
      >
        {PIPELINE_STAGES.map((stage) => {
          const stageOpportunities = getOpportunitiesByStage(stage.id);
          const stageAmount = getStageTotalAmount(stage.id);
          const stageExpectedRevenue = getStageTotalExpectedRevenue(stage.id);

          return (
            <Box key={stage.id}>
              <Card sx={{ backgroundColor: stage.color, height: '100%' }}>
                <CardContent sx={{ p: 2 }}>
                  {/* Stage Header */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      fontSize: '0.95rem',
                    }}
                  >
                    {stage.label}
                  </Typography>

                  <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Pipeline: ${stageAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Expected: ${stageExpectedRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </Typography>
                    <Chip label={`${stageOpportunities.length} deals`} size="small" sx={{ mt: 1 }} />
                  </Box>

                  {/* Opportunity Cards */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {stageOpportunities.length === 0 ? (
                      <Typography variant="caption" color="textSecondary" sx={{ py: 2, textAlign: 'center' }}>
                        No deals
                      </Typography>
                    ) : (
                      stageOpportunities.map((opp) => (
                        <Card
                          key={opp.id}
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: 2,
                              transform: 'translateY(-2px)',
                            },
                          }}
                          onClick={() => navigate(`/opportunities/${opp.id}`)}
                        >
                          <CardContent sx={{ p: 1.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                              {opp.name.length > 25 ? opp.name.substring(0, 25) + '...' : opp.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block">
                              ${(opp.amount || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                              <Chip
                                label={`${opp.probability || 0}%`}
                                size="small"
                                variant="outlined"
                                sx={{ height: 'auto', py: 0.25, fontSize: '0.7rem' }}
                              />
                              <Chip
                                label={opp.status}
                                size="small"
                                variant="outlined"
                                sx={{ height: 'auto', py: 0.25, fontSize: '0.7rem' }}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>

      {/* Add New Opportunity Button */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="contained" size="large" onClick={() => console.log('Create opportunity')}>
          Add Opportunity
        </Button>
      </Box>
    </Container>
  );
};

export default KanbanPipeline;
