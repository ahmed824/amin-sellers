import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Dashboard from "../../pages/Dashboard";

function DashboardModal({ isOpen, onClose, onLogout }) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="dashboard-modal"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(16px)",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          p: 3,
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.9)",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease-in-out",
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Dashboard isModal={true} onLogout={onLogout} />
      </Box>
    </Modal>
  );
}

export default DashboardModal;
