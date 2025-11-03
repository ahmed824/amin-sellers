import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useTheme } from "@mui/material/styles";
import { useTokenTransfers } from "../hooks/useTokenTransfers";
import { getTokenColumns } from "../utils/columns"; // Updated to use getTokenColumns
import PaginationControls from "../components/shared/PaginationControls";
import HistoryHeader from "../components/shared/HistoryHeader";
import { useSellerProfile } from "../hooks/useSellerProfile"; // Import useSellerProfile

function TokenHistory() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // sm = 600px
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch seller profile
  const {
    data: sellerData,
    isLoading: isSellerLoading,
    isError: isSellerError,
    error: sellerError,
  } = useSellerProfile();

  console.log("sellerData",sellerData)

  const { data, isLoading, isError, error } = useTokenTransfers({
    page,
    from: fromDate || undefined, // Use undefined to omit from query if empty
    to: toDate || undefined, // Use undefined to omit from query if empty
    on: "",
    q: "",
  });

  const rows = data?.rows || [];
  const pagination = data?.pagination || {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15,
  };

  const handlePreviousPage = () => {
    if (pagination.current_page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.current_page < pagination.last_page) {
      setPage((prev) => prev + 1);
    }
  };

  // Combine loading and error states
  if (isSellerLoading || isLoading) {
    return (
      <CircularProgress
        size={40}
        sx={{ display: "block", mx: "auto", my: 4 }}
      />
    );
  }

  if (isSellerError || isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {sellerError?.message || error?.message || "فشل في جلب البيانات"}
      </Alert>
    );
  }

  const sellerName = sellerData?.name || "Unknown";
  const columns = getTokenColumns(sellerName); // Pass sellerName to getTokenColumns

  return (
    <Stack
      className="table-history"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        bgcolor: "transparent",
        pt: 4,
        direction: "rtl",
      }}
    >
      <Paper
        elevation={4}
        sx={{ p: 2, width: "98%", maxWidth: 1200, mb: 2, bgcolor: "#23222a" }}
      >
        <HistoryHeader
          title="سجل تحويل التوكنز"
          icon={
            <MonetizationOnIcon
              sx={{ color: "#FFD700", verticalAlign: "middle" }}
            />
          }
        />
        {/* Date Filter Inputs */}
        <Box
          sx={{
            display: "flex",
            flexWrap: isMobile ? "wrap" : "nowrap", // Stack vertically on mobile
            gap: 2,
            mb: 2,
            justifyContent: "flex-end",
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          <TextField
            label="من تاريخ"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true, sx: { color: "#fff" } }} // White label
            InputProps={{
              sx: {
                color: "#fff", // White text
                "& .MuiSvgIcon-root": { color: "#fff" }, // White calendar icon
                bgcolor: "#333", // Darker background for contrast
                "&:hover": { bgcolor: "#444" },
                "& input": { padding: "10px" },
              },
            }}
            sx={{
              width: isMobile ? "100%" : 180, // Full width on mobile, fixed on larger screens
            }}
            inputProps={{ max: toDate || undefined }} // Prevent selecting 'from' after 'to'
          />
          <TextField
            label="إلى تاريخ"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true, sx: { color: "#fff" } }} // White label
            InputProps={{
              sx: {
                color: "#fff", // White text
                "& .MuiSvgIcon-root": { color: "#fff" }, // White calendar icon
                bgcolor: "#333", // Darker background for contrast
                "&:hover": { bgcolor: "#444" },
                "& input": { padding: "10px" },
              },
            }}
            sx={{
              width: isMobile ? "100%" : 180, // Full width on mobile, fixed on larger screens
            }}
            inputProps={{ min: fromDate || undefined }} // Prevent selecting 'to' before 'from'
          />
        </Box>
        <div style={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={pagination.per_page}
            rowsPerPageOptions={[pagination.per_page]}
            disableRowSelectionOnClick
            autoHeight
            getRowHeight={() => 'auto'}
            getRowClassName={(params) =>
              params.row.status === "failed" ? "Mui-error-row" : ""
            }
            sx={{
              bgcolor: "#2a2a34",
              color: "#fff",
              direction: "rtl",
              "& .MuiDataGrid-cell": {
                alignItems: "flex-start",
                whiteSpace: "normal",
                lineHeight: 1.2,
                py: 1,
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "transparent", // Transparent background for all headers
                color: "#fff", // White text for all headers
                border: "none !important",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600, // Bold header text
                color: "#fff", // White text for header titles
              },
              "& .transparent-header": {
                bgcolor: "transparent", // Ensure share column header is transparent
                color: "#fff", // White text for share column header
                border: "none !important",
              },
              "& .active .MuiDataGrid-cell": {
                bgcolor: "#ffcdd2 !important",
                color: "#000 !important",
              },
            }}
          />
        </div>
        <PaginationControls
          pagination={pagination}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          totalRows={rows.length}
        />
      </Paper>
    </Stack>
  );
}

export default TokenHistory;
