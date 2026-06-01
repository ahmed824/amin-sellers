import { Box, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import HeaderSection from "./layout/HeaderSection";
import ContentSection from "./layout/ContentSection";
import LoadingOverlay from "./layout/LoadingOverlay";
import { useSellerProfile } from "../hooks/useSellerProfile";
import { useNotifications } from "./layout/useNotifications";

function MainLayout({ tab, setTab, pages, handleLogout, handleOpenNotifications, children, title }) {
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useSellerProfile();

  const userData = useMemo(
    () => ({
      name: profile?.name || "مستخدم غير معروف",
      image: profile?.image || "/images/avatar.png",
    }),
    [profile]
  );

  const { openNotifications, handleOpen, handleClose } = useNotifications(handleOpenNotifications);

  // Handle profile error with toast
  useEffect(() => {
    if (isProfileError) {
      const errorMessage = profileError?.message || "فشل في جلب بيانات المستخدم";
      toast.error(errorMessage);
      // Optional: Redirect to login if error indicates auth issue
      if (profileError?.message?.includes("Unauthorized") || profileError?.status === 401) {
        handleLogout(); // Trigger logout if unauthorized
      }
    }
  }, [isProfileError, profileError, handleLogout]);

  // Render loading state
  if (isProfileLoading) {
    return <LoadingOverlay />;
  }

  // Render main layout
  return (
    <Box sx={{ display: "flex", flexDirection: "row-reverse", minHeight: "100vh", padding: "0" }}>
      <Sidebar
        tab={tab}
        setTab={setTab}
        pages={pages}
        handleLogout={handleLogout}
        userName={userData.name}
        userImage={userData.image}
      />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "transparent" }}>
        <HeaderSection
          title={title || pages[tab]?.label || "لوحة التحكم"}
          userData={userData}
          handleLogout={handleLogout}
          openNotifications={openNotifications}
          handleOpen={handleOpen}
          handleClose={handleClose}
        />
        <ContentSection>
          {children || pages[tab]?.component || <Typography>الصفحة غير متوفرة</Typography>}
        </ContentSection>
      </Box>
    </Box>
  );
}

export default MainLayout;