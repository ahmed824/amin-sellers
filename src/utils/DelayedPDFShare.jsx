import { useState } from "react";
import ShareIcon from "@mui/icons-material/Share";
import CircularProgress from "@mui/material/CircularProgress";
import { pdf } from "@react-pdf/renderer";

const DelayedPDFShare = ({ document, fileName }) => {
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      // Generate PDF blob in memory
      const blob = await pdf(document).toBlob();
      const file = new File([blob], fileName, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Token Transfer Invoice",
          text: "Here is your token transfer invoice.",
          files: [file],
        });
      } else {
        alert("Your browser does not support file sharing. Please download instead.");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
    }
    setLoading(false);
  };

  return loading ? (
    <CircularProgress size={24} sx={{ color: "#ccc" }} />
  ) : (
    <ShareIcon
      onClick={handleShare}
      sx={{
        color: "#FFD700",
        cursor: "pointer",
        "&:hover": { color: "#FFCA28" },
      }}
    />
  );
};

export default DelayedPDFShare;
