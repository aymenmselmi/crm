import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem, Avatar } from '@mui/material';
import { Menu as MenuIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import useNavStore from '../store/navStore';
import useAuthStore from '../store/authStore';

const Header: React.FC = () => {
  const { selectedObject, toggleSidebar } = useNavStore();
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    window.location.href = '/login';
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#fff',
        color: '#111',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #ddd',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            sx={{ color: '#666', minWidth: 'auto', p: 1 }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </Button>
          {selectedObject && (
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0070d2' }}>
              {selectedObject.plural}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={handleMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#111',
              textTransform: 'none',
              fontSize: '0.9rem',
            }}
          >
            <Avatar sx={{ width: 32, height: 32, backgroundColor: '#0070d2' }}>
              {user?.firstName.charAt(0).toUpperCase()}
            </Avatar>
            {user?.firstName}
            <KeyboardArrowDownIcon />
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
