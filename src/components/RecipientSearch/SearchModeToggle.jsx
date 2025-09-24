import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { memo } from "react";

const SearchModeToggle = memo(({ recipientMode, onModeChange }) => {
  return (
    <ToggleButtonGroup
      exclusive
      value={recipientMode}
      onChange={onModeChange}
      sx={{ mb: 2, width: "100%", flexDirection: "row-reverse" }}
    >
      <ToggleButton
        value="id"
        sx={{
          flex: 1,
          bgcolor: recipientMode === "id" ? "#000 !important" : "#18171d",
          color: recipientMode === "id" ? "#fff !important" : "#fff",
          border:
            recipientMode === "id"
              ? "2px solid #fff !important"
              : "1px solid #444",
          zIndex: recipientMode === "id" ? 1000 : "auto",
          fontWeight: recipientMode === "id" ? 600 : "normal",
        }}
      >
        رقم اللاعب
      </ToggleButton>
      <ToggleButton
        value="name"
        sx={{
          flex: 1,
          bgcolor: recipientMode === "name" ? "#000 !important" : "#18171d",
          color: recipientMode === "name" ? "#fff !important" : "#fff",
          border:
            recipientMode === "name"
              ? "2px solid #fff !important"
              : "1px solid #444",
          zIndex: recipientMode === "name" ? 1000 : "auto",
          fontWeight: recipientMode === "name" ? 600 : "normal",
        }}
      >
        اسم اللاعب
      </ToggleButton>
    </ToggleButtonGroup>
  );
});

SearchModeToggle.displayName = "SearchModeToggle";
export default SearchModeToggle;
