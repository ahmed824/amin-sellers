import { ToggleButton, ToggleButtonGroup, Typography, CircularProgress, Alert, Box } from "@mui/material";
import { acceleratorTypes } from "../../utils/acceleratorTypes";
import { useSellerProfile } from "../../hooks/useSellerProfile";

function AcceleratorSelector({ selectedAccelerator, setSelectedAccelerator, acceleratorCounts }) {
  const { data: profile, isLoading, error } = useSellerProfile();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <CircularProgress size={24} sx={{ color: "#a71d2a" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2, direction: "rtl" }}>
        {error.message || "فشل في جلب رصيد المسرعات"}
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <ToggleButtonGroup
        exclusive
        value={selectedAccelerator}
        onChange={(_, v) => v && setSelectedAccelerator(v)}
        sx={{ mb: 2, width: "100%", flexDirection: "row-reverse" }}
      >
      {acceleratorTypes.map((acc) => {
        const priceKey = `booster_${acc.value}`;
        const price = profile?.pricing?.group_pricing?.prices?.[priceKey];
        const currency = profile?.pricing?.group_pricing?.currency;
        
        return (
          <ToggleButton
            key={acc.value}
            value={acc.value}
            sx={{
              flex: 1,
              flexDirection: "column",
              border: selectedAccelerator === acc.value ? "3px solid #a71d2a !important" : "1px solid #444",
              m: 0.5,
              bgcolor: "#23222a",
              color: "#fff",
              borderRadius: 2,
            }}
          >
            <img
              src={acc.iconSrc}
              alt={acc.color}
              style={{ width: 24, height: 24, marginBottom: 4 }}
            />
            <Typography fontWeight={700}>{acc.color}</Typography>
            {price && currency && (
              <Typography variant="caption" sx={{ color: "#ffd700", fontWeight: 600 }}>
                {price} {currency}
              </Typography>
            )}
          </ToggleButton>
        );
      })}
      </ToggleButtonGroup>
    </Box>
  );
}

export default AcceleratorSelector;