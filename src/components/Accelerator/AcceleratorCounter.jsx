import { Box, Button, TextField } from "@mui/material";
import { useSellerProfile } from "../../hooks/useSellerProfile";

function AcceleratorCounter({
  selectedAccelerator,
  acceleratorCounts,
  updateAcceleratorCount,
}) {
  const { data: profile } = useSellerProfile();
  const priceKey = `booster_${selectedAccelerator}`;
  const unitPrice = profile?.pricing?.group_pricing?.prices?.[priceKey];
  const currency = profile?.pricing?.group_pricing?.currency;
  const totalPrice = unitPrice
    ? unitPrice * acceleratorCounts[selectedAccelerator]
    : 0;

  const handleManualChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      updateAcceleratorCount(
        selectedAccelerator,
        value - acceleratorCounts[selectedAccelerator]
      );
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={2}
        mb={2}
        sx={{ flexDirection: "row-reverse" }}
      >
        {/* Minus Button */}
        <Button
          variant="outlined"
          sx={{
            minWidth: 48,
            height: 48,
            color: "#fff",
            borderColor: "#a71d2a",
            fontSize: "20px",
            fontWeight: "bold",
          }}
          onClick={() => updateAcceleratorCount(selectedAccelerator, -1)}
        >
          -
        </Button>

        {/* Editable Input */}
        <TextField
          value={acceleratorCounts[selectedAccelerator]}
          onChange={handleManualChange}
          type="number"
          inputProps={{
            min: 0,
            style: {
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#fff",
            },
          }}
          sx={{
            width: 80,
            height: 48,
            "& .MuiInputBase-root": {
              bgcolor: "#18171d",
              borderRadius: 2,
              border: "2px solid #a71d2a",
              height: "100%",
            },
            "& input": {
              padding: 0,
            },
          }}
        />

        {/* Plus Button */}
        <Button
          variant="outlined"
          sx={{
            minWidth: 48,
            height: 48,
            color: "#fff",
            borderColor: "#a71d2a",
            fontSize: "20px",
            fontWeight: "bold",
          }}
          onClick={() => updateAcceleratorCount(selectedAccelerator, 1)}
        >
          +
        </Button>
      </Box>
    </Box>
  );
}

export default AcceleratorCounter;
