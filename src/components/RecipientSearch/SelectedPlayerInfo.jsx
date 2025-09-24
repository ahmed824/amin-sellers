import { Alert, Typography } from "@mui/material";
import { memo } from "react";

const SelectedPlayerInfo = memo(({ selectedPlayer }) => {
  if (!selectedPlayer) {
    return null;
  }

  return (
    <Alert
      severity="success"
      sx={{
        mt: 2,
        direction: "rtl",
        "& .MuiAlert-message": {
          textAlign: "right",
          width: "100%",
        },
      }}
    >
      <Typography variant="body2">
        <strong>تم اختيار:</strong> {selectedPlayer.username}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        المعرف: {selectedPlayer.id}
      </Typography>
    </Alert>
  );
});

SelectedPlayerInfo.displayName = "SelectedPlayerInfo";
export default SelectedPlayerInfo;
