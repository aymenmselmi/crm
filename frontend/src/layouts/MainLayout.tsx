import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import useNavStore from '../store/navStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { sidebarOpen } = useNavStore();

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#fff' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Header */}
        <Header />

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 3,
            backgroundColor: '#fff',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
