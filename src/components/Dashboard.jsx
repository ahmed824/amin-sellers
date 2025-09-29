import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLogout } from "../hooks/useLogout";
import { useSellerProfile } from "../hooks/useSellerProfile";
import { acceleratorTypes } from "../utils/acceleratorTypes";
import InstallButton from "./InstallButton";

function Dashboard({ onLogout, isModal = false }) {
  const {
    logout,
    isPending: isLogoutPending,
    error: logoutError,
  } = useLogout();

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useSellerProfile();

  const handleLogoutClick = () => {
    logout();
    onLogout();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ bgcolor: "transparent", direction: "rtl" }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, minWidth: 320, maxWidth: 400, bgcolor: "#23222a" }}
      >
        {isProfileLoading ? (
          <CircularProgress
            size={40}
            sx={{ display: "block", mx: "auto", my: 4 }}
          />
        ) : isProfileError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {profileError?.message || "فشل في جلب بيانات الملف الشخصي"}
          </Alert>
        ) : (
          <>
            {/* Profile Info */}
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={3}
            >
              <Typography
                variant="subtitle1"
                fontWeight={600}
                mt={1}
                mb={2}
                align="center"
                color="#fff"
              >
                اسم البائع : {profile?.name || "اسم المستخدم"}
              </Typography>

              {/* Wallet and Pricing Info */}
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  width: "100%",
                  bgcolor: "#2a2a34",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="#fff"
                  mb={2}
                >
                  رصيد الحساب
                </Typography>
                <Typography variant="body1" color="#bbb" mb={2}>
                  رصيد المحفظة:{" "}
                  <span style={{ color: "#00e676", fontWeight: 700 }}>
                    {Number(profile?.wallet?.balance).toLocaleString()}{" "}
                    {profile?.wallet?.currency}
                  </span>
                </Typography>

                {profile?.pricing?.group_pricing?.prices?.tokens_million && (
                  <Typography variant="body1" color="#bbb" mb={2}>
                    سعر المليون توكن:{" "}
                    <span style={{ color: "#ffd700", fontWeight: 700 }}>
                      {profile.pricing.group_pricing.prices.tokens_million}{" "}
                      {profile.pricing.group_pricing.currency}
                    </span>
                  </Typography>
                )}

                {profile?.pricing?.group_pricing?.prices && (
                  <>
                    <Typography variant="body2" color="#bbb" mb={1}>
                      أسعار المسرعات:
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      flexWrap="wrap"
                    >
                      {acceleratorTypes.map((type) => {
                        const priceKey = `booster_${type.value}`;
                        const price =
                          profile.pricing.group_pricing.prices[priceKey];
                        if (price) {
                          return (
                            <Chip
                              key={type.value}
                              icon={
                                <img
                                  src={type.iconSrc}
                                  alt={type.color}
                                  style={{ width: 20, height: 20 }}
                                />
                              }
                              label={`${
                                type.color === "Red"
                                  ? "أحمر"
                                  : type.color === "Blue"
                                  ? "أزرق"
                                  : "أسود"
                              }: ${price} ${
                                profile.pricing.group_pricing.currency
                              }`}
                              sx={{
                                bgcolor: "#2a2a34",
                                color: "#fff",
                                fontWeight: 700,
                                padding: "12px",
                                mb: 1,
                                maxWidth: "190px",
                                margin: "0 !important",
                              }}
                            />
                          );
                        }
                        return null;
                      })}
                    </Stack>
                  </>
                )}
              </Paper>
            </Box>

            {/* Logout error */}
            {logoutError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {logoutError.message || "فشل في تسجيل الخروج"}
              </Alert>
            )}

            {/* Links and actions */}
            {isLogoutPending ? (
              <CircularProgress
                size={24}
                sx={{ display: "block", mx: "auto", my: 2 }}
              />
            ) : (
              <>
                {/* Only show links if not inside modal */}
                {!isModal && (
                  <List className="dashboard-lists">
                    <ListItem disablePadding>
                      <ListItemButton component={Link} to="/shipping-transfers">
                        <ListItemText
                          sx={{ color: "#fff" }}
                          primary="الشحن والتحويلات"
                        />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton component={Link} to="/token-balance">
                        <ListItemText
                          sx={{ color: "#fff" }}
                          primary="سجل رصيد التوكنز"
                        />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton component={Link} to="/boosters-balance">
                        <ListItemText
                          sx={{ color: "#fff" }}
                          primary="سجل رصيد المسرعات"
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                )}

                {/* Install Button (always visible, modal or not) */}
                <InstallButton showInSidebar={false} />

                <Box mt={4} display="flex" justifyContent="center">
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogoutClick}
                    sx={{ minWidth: 120 }}
                    disabled={isLogoutPending}
                    className="logout-btn"
                  >
                    تسجيل الخروج
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}

export default Dashboard;
