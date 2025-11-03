import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Button,
  useMediaQuery,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useTheme } from "@mui/material/styles";
import BottomNavItem from "./BottomNavItem";
import DashboardModal from "./shared/DashboardModal";
import InstallButton from "./InstallButton";
import { useState, useEffect } from "react";
import { useSellerProfile } from "../hooks/useSellerProfile";

const drawerWidth = 220;

function Sidebar({ tab, setTab, pages, handleLogout, userName }) {
  const { data: profile } = useSellerProfile();
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md")); // md = 960px
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const handleDashboardClick = () => {
    setIsDashboardOpen(true);
  };

  const handleCloseDashboard = () => {
    setIsDashboardOpen(false);
  };

  return (
    <>
      {/* Sidebar for desktop only */}
      {!isTabletOrMobile && (
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            },
          }}
        >
          <Box>
            <Toolbar>
              <Typography
                variant="h6"
                fontWeight={700}
                color="primary.main"
                sx={{ width: "100%", textAlign: "center" }}
              >
                Amin Card Sellers
              </Typography>
            </Toolbar>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={2}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                mt={1}
                mb={1}
                align="center"
              >
                {userName}
              </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#00e676", fontWeight: 700 }}
              align="center"
            >
              {Number(profile?.wallet?.balance).toLocaleString()} {profile?.wallet?.currency}
            </Typography>
            </Box>

            <Divider />

            <List>
              {pages.map((page, idx) => (
                <ListItem key={page.label} disablePadding>
                  <ListItemButton
                    selected={tab === idx}
                    onClick={() => setTab(idx)}
                  >
                    <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
                      {page.icon}
                    </ListItemIcon>
                    <ListItemText primary={page.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          <Box p={2} className="drawer-bottom">
            {/* Install Button for Desktop */}
            <InstallButton showInSidebar={true} />
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              fullWidth
              onClick={handleLogout}
              sx={{ minWidth: 120 }}
            >
              تسجيل الخروج
            </Button>
          </Box>
        </Drawer>
      )}

      {/* Bottom Navigation for tablet/mobile only */}
      {isTabletOrMobile && (
        <div
          className="bottom-nav"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            paddingTop: "2px",
            background: "#a9a9a9",
            zIndex: 1000,
            boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {pages.map((page, idx) => (
            <BottomNavItem
              key={page.label}
              icon={page.icon}
              label={page.label}
              value={idx}
              isSelected={tab === idx}
              onClick={setTab}
            />
          ))}
          <BottomNavItem
            icon={<DashboardIcon />}
            label="الملف الشخصي"
            value={-1}
            isSelected={false}
            onClick={handleDashboardClick}
          />
        </div>
      )}

      {/* Dashboard Modal for mobile/tablet */}
      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={handleCloseDashboard}
        onLogout={handleLogout}
      />
    </>
  );
}

export default Sidebar;