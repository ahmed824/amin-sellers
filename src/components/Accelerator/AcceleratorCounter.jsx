import { Box, Button, Typography, Paper } from "@mui/material";
import { useSellerProfile } from "../../hooks/useSellerProfile";

function AcceleratorCounter({ selectedAccelerator, acceleratorCounts, updateAcceleratorCount }) {
  const { data: profile } = useSellerProfile();
  const priceKey = `booster_${selectedAccelerator}`;
  const unitPrice = profile?.pricing?.group_pricing?.prices?.[priceKey];
  const currency = profile?.pricing?.group_pricing?.currency;
  const totalPrice = unitPrice ? unitPrice * acceleratorCounts[selectedAccelerator] : 0;

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
        <Box
          sx={{
            width: 80,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#18171d",
            border: "2px solid #a71d2a",
            borderRadius: 2,
            color: "#fff",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {acceleratorCounts[selectedAccelerator]}
        </Box>
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
      
      {/* Pricing Information */}
      {acceleratorCounts[selectedAccelerator] > 0 && unitPrice && currency && (
        <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            تفاصيل التسعير:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            الكمية: <strong>{acceleratorCounts[selectedAccelerator]} مسرع</strong>
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            السعر للوحدة: <strong>{unitPrice} {currency}</strong>
          </Typography>
          <Typography variant="body2">
            السعر الإجمالي: <strong>{totalPrice.toFixed(2)} {currency}</strong>
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default AcceleratorCounter;