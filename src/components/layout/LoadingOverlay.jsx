import { Box, CircularProgress, Typography } from "@mui/material";

function LoadingOverlay({ text = "جاري تحميل ..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "rgba(35, 34, 42, 0.9)", // Semi-transparent dark background
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999, // Ensure overlay is above all content
        direction: "rtl",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "pulse 2s infinite ease-in-out",
          "@keyframes pulse": {
            "0%": { transform: "scale(1)", opacity: 1 },
            "50%": { transform: "scale(1.1)", opacity: 0.7 },
            "100%": { transform: "scale(1)", opacity: 1 },
          },
        }}
      >
        <CircularProgress
          size={60}
          sx={{
            color: "#a71d2a",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
              stroke: "url(#gradient)", // Gradient effect
            },
          }}
        />
        <svg width="0" height="0">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#a71d2a", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#ffd600", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
        <Typography
          sx={{
            mt: 2,
            color: "#fff",
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            fontWeight: "bold",
            animation: "fadeInOut 1.5s infinite",
            "@keyframes fadeInOut": {
              "0%": { opacity: 1 },
              "50%": { opacity: 0.5 },
              "100%": { opacity: 1 },
            },
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
}

export default LoadingOverlay;