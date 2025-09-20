import { useState } from "react";
import {
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Box,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useTheme } from "@mui/material/styles";
import { useBoosters } from "../hooks/useBoosters";
import { getBoosterColumns } from "../utils/columns"; // Updated to use getBoosterColumns
import PaginationControls from "../components/shared/PaginationControls";
import HistoryHeader from "../components/shared/HistoryHeader";
import { useSellerProfile } from "../hooks/useSellerProfile"; // Import useSellerProfile

function AcceleratorHistory() {
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

  const { data, isLoading, isError, error } = useBoosters({
    page,
    from: fromDate || undefined, // Use undefined to omit from query if empty
    to: toDate || undefined, // Use undefined to omit from query if empty
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

  // Function to determine row class based on status
  const getRowClassName = (params) => {
    return params.row.status !== "Done" ? "active" : "";
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
  const columns = getBoosterColumns(sellerName); // Pass sellerName to getBoosterColumns

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
          title="سجل تحويل المسرعات"
          icon={
            <RocketLaunchIcon
              sx={{ color: "#e53935", verticalAlign: "middle" }}
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
            getRowClassName={getRowClassName}
            sx={{
              bgcolor: "#2a2a34",
              color: "#fff",
              direction: "rtl",
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

export default AcceleratorHistory;
