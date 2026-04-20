import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          CRM System
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          React is working! Counter: {count}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => setCount(count + 1)}
          sx={{ backgroundColor: '#0070d2' }}
        >
          Click me
        </Button>
        <Typography variant="body2" sx={{ mt: 3, color: 'textSecondary' }}>
          If you see this and can click the button,<br /> React and Material-UI are working correctly.
        </Typography>
      </Paper>
    </Container>
  );
}
