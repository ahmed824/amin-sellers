import { Box, Typography, AppBar, Toolbar, Avatar, IconButton, Badge, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useUnreadNotificationsCount } from '../hooks/useNotifications';
import DashboardModal from './shared/DashboardModal';
import { useState } from 'react';

function TopBar({ title, userName, handleLogout, handleOpenNotifications, style }) {
  const { data: unreadCount = 0, isLoading: isUnreadLoading } = useUnreadNotificationsCount();
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const handleDashboardClick = () => {
    setIsDashboardOpen(true);
  };
  const handleCloseDashboard = () => {
    setIsDashboardOpen(false);
  };
  return (
    <AppBar position="static" sx={{ bgcolor: '#23222a', direction: 'rtl', style }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={handleOpenNotifications}
            sx={{ p: 0 }}
            aria-label={`إشعارات مع ${unreadCount} غير مقروءة`}
          >
            <Badge badgeContent={isUnreadLoading ? 0 : unreadCount} color="error">
              <NotificationsActiveIcon sx={{ color: '#fff' }} />
            </Badge>
          </IconButton>
          <Button onClick={handleDashboardClick} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: '#fff' }}>
              المستخدم: {userName}
            </Typography>
            {/* <Avatar src={userImage} sx={{ width: 32, height: 32 }} />  */}
          </Button>
          {/* Dashboard Modal for mobile/tablet */}
          <DashboardModal
            isOpen={isDashboardOpen}
            onClose={handleCloseDashboard}
            onLogout={handleLogout}
          />
          <IconButton className='logout-icon' onClick={handleLogout} sx={{ color: '#fff' }} aria-label="تسجيل الخروج">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;