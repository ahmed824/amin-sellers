import { Box, Paper } from '@mui/material';

function LoginLayout({ children }) {
  return (
    <Box className="login-background">
      {/* <Box className="login-overlay" /> */}
      <Paper className="login-paper" elevation={8}>
        {children}
      </Paper>
    </Box>
  );
}

export default LoginLayout; 