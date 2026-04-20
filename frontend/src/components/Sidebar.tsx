import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Flag as FlagIcon,
  TrendingUp as TrendingUpIcon,
  Event as EventIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useNavStore, { objects } from '../store/navStore';
import useAuthStore from '../store/authStore';

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { selectedObject, setSelectedObject, sidebarOpen, toggleSidebar } = useNavStore();
  const { logout } = useAuthStore();

  const iconMap: { [key: string]: React.ReactNode } = {
    Business: <BusinessIcon />,
    Person: <PersonIcon />,
    Flag: <FlagIcon />,
    TrendingUp: <TrendingUpIcon />,
    Event: <EventIcon />,
  };

  const objectRoutes: { [key: string]: string } = {
    'Accounts': '/accounts',
    'Contacts': '/contacts',
    'Leads': '/leads',
    'Opportunities': '/opportunities',
    'Activities': '/activities',
  };

  const handleObjectSelect = (obj: typeof objects[0]) => {
    setSelectedObject(obj);
    const route = objectRoutes[obj.plural];
    if (route) {
      navigate(route);
    }
    if (isMobile) toggleSidebar();
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={sidebarOpen}
      onClose={toggleSidebar}
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          backgroundColor: '#f3f3f3',
          borderRight: '1px solid #ddd',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <BusinessIcon sx={{ fontSize: 32, color: '#0070d2' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0070d2' }}>
          CRM
        </Typography>
      </Box>

      <Divider />

      <Typography
        variant="caption"
        sx={{ display: 'block', px: 2, py: 1.5, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}
      >
        Objects
      </Typography>

      <List sx={{ px: 1 }}>
        {objects.map((obj) => (
          <ListItem key={obj.id} disablePadding>
            <ListItemButton
              selected={selectedObject?.id === obj.id}
              onClick={() => handleObjectSelect(obj)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: '#e3f2fd',
                  color: '#0070d2',
                  '& .MuiListItemIcon-root': { color: '#0070d2' },
                },
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {iconMap[obj.icon || 'Business']}
              </ListItemIcon>
              <ListItemText primary={obj.plural} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="caption"
        sx={{ display: 'block', px: 2, py: 1.5, fontWeight: 600, color: '#666', textTransform: 'uppercase' }}
      >
        Views
      </Typography>

      <List sx={{ px: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate('/pipeline');
              if (isMobile) toggleSidebar();
            }}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary="Sales Pipeline" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />

      <List sx={{ px: 1 }}>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, mb: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
