import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useOrderHistory } from "../../hooks/useOrderHistory";
import PaginationControls from "../../components/shared/PaginationControls";

const getStatusLabel = (status) => {
  const labels = {
    pending: "قيد الانتظار",
    processing: "قيد المعالجة",
    completed: "مكتمل",
    failed: "فشل",
  };
  return labels[status] || status;
};

const getStatusColor = (status) => {
  const colors = {
    pending: "#ff9800",
    processing: "#2196f3",
    completed: "#4caf50",
    failed: "#f44336",
  };
  return colors[status] || "#999";
};

const getSystemStatusLabel = (status) => {
  const labels = {
    queued: "في قائمة الانتظار",
    assigned: "مُعيَّن",
    processing: "قيد المعالجة",
    polling: "جاري الاستعلام",
    completed: "مكتمل",
    failed: "فشل",
    refunded: "مسترد",
  };
  return labels[status] || status || "-";
};

const getSystemStatusColor = (status) => {
  const colors = {
    queued: "#9e9e9e",
    assigned: "#ff9800",
    processing: "#2196f3",
    polling: "#00bcd4",
    completed: "#4caf50",
    failed: "#f44336",
    refunded: "#9c27b0",
  };
  return colors[status] || "#999";
};

function OrderHistoryPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data, isLoading, isError, error } = useOrderHistory({
    page,
    status: status || undefined,
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
    per_page: 20,
  });

  // Filter out any null/undefined orders and ensure each order has an id
  const orders = (data?.data || []).filter((order) => order && order.id);
  const pagination = data
    ? {
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        total: data.total || 0,
        per_page: data.per_page || 20,
      }
    : {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 20,
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      // Format time
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const formattedTime = `${hours}:${minutes} ${ampm}`;

      return `${day} ${month} ${year} - ${formattedTime}`;
    } catch {
      return "-";
    }
  };

  if (isLoading) {
    return (
      <CircularProgress
        size={40}
        sx={{ display: "block", mx: "auto", my: 4 }}
      />
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error?.message || "فشل في جلب سجل الطلبات"}
      </Alert>
    );
  }

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        bgcolor: "transparent",
        pt: 4,
        direction: "rtl",
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 3,
          width: "100%",
          maxWidth: 1400,
          mx: "auto",
          bgcolor: "#23222a",
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "#fff", mb: 3, textAlign: "center", fontWeight: 700 }}
        >
          سجل الطلبات
        </Typography>

        {/* Filters */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: "#fff" }}>الحالة</InputLabel>
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              label="الحالة"
              sx={{
                color: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#555",
                },
              }}
            >
              <MenuItem value="">الكل</MenuItem>
              <MenuItem value="pending">قيد الانتظار</MenuItem>
              <MenuItem value="processing">قيد المعالجة</MenuItem>
              <MenuItem value="completed">مكتمل</MenuItem>
              <MenuItem value="failed">فشل</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="من تاريخ"
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#555" },
              },
            }}
          />

          <TextField
            label="إلى تاريخ"
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#555" },
              },
            }}
          />
        </Stack>

        {/* Orders Table */}
        <TableContainer
          sx={{ maxHeight: 600, bgcolor: "#2d2d35", borderRadius: 1 }}
        >
          <Table stickyHeader sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#3d3d45",
                    color: "#fff",
                    fontWeight: 700,
                    borderColor: "#555",
                    textAlign: "right",
                  }}
                >
                  رقم الطلب
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#3d3d45",
                    color: "#fff",
                    fontWeight: 700,
                    borderColor: "#555",
                    textAlign: "right",
                  }}
                >
                  المنتج
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#3d3d45",
                    color: "#fff",
                    fontWeight: 700,
                    borderColor: "#555",
                    textAlign: "right",
                  }}
                >
                  المتغير
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#3d3d45",
                    color: "#fff",
                    fontWeight: 700,
                    borderColor: "#555",
                    textAlign: "right",
                  }}
                >
                  الكمية
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#3d3d45",
                    color: "#fff",
                    fontWeight: 700,
                    borderColor: "#555",
                    textAlign: "right",
                  }}
                >
                  السعر الإجمالي
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#3d3d45",
                    color: "#fff",
                    fontWeight: 700,
                    borderColor: "#555",
                    textAlign: "right",
                  }}
                >
                  المورد
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#3d3d45",
                    color: "#fff",
                    fontWeight: 700,
                    borderColor: "#555",
                    textAlign: "right",
                  }}
                >
                  طريقة التسليم
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#3d3d45",
                    color: "#fff",
                    fontWeight: 700,
                    borderColor: "#555",
                    textAlign: "right",
                  }}
                >
                  الحالة
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#3d3d45",
                    color: "#fff",
                    fontWeight: 700,
                    borderColor: "#555",
                    textAlign: "right",
                  }}
                >
                  حالة النظام
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#3d3d45",
                    color: "#fff",
                    fontWeight: 700,
                    borderColor: "#555",
                    textAlign: "right",
                  }}
                >
                  المحاولات
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#3d3d45",
                    color: "#fff",
                    fontWeight: 700,
                    borderColor: "#555",
                    textAlign: "right",
                  }}
                >
                  تاريخ الإنشاء
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#3d3d45",
                    color: "#fff",
                    fontWeight: 700,
                    borderColor: "#555",
                    textAlign: "right",
                  }}
                >
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    sx={{
                      textAlign: "center",
                      color: "#fff",
                      py: 4,
                      borderColor: "#555",
                    }}
                  >
                    <Typography variant="body1">لا توجد طلبات</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.id || order.order_number}
                    sx={{
                      "&:hover": { bgcolor: "#3d3d45" },
                      "& .MuiTableCell-root": {
                        borderColor: "#555",
                        color: "#fff",
                        textAlign: "right",
                      },
                    }}
                  >
                    <TableCell sx={{ textAlign: "right" }}>
                      {order.order_number || "-"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {order.product_variant?.product?.name || "-"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {order.product_variant?.name || "-"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {order.quantity || 0}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      $
                      {order.total_price
                        ? parseFloat(order.total_price).toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {order.current_provider?.name || "-"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {order.delivery_method || "-"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Typography
                        sx={{
                          color: getStatusColor(order.user_status),
                          fontWeight: 600,
                        }}
                      >
                        {getStatusLabel(order.user_status)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Typography
                        sx={{
                          color: getSystemStatusColor(order.system_status),
                          fontWeight: 600,
                          fontSize: "0.875rem",
                        }}
                      >
                        {getSystemStatusLabel(order.system_status)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {order.attempts || 0}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Box
                        component="span"
                        sx={{ direction: "ltr", display: "inline-block" }}
                      >
                        {formatDate(order.created_at)}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <IconButton
                        onClick={() =>
                          navigate(`/multi-provider/orders/${order.id}`)
                        }
                        sx={{
                          color: "#00e676",
                          "&:hover": { bgcolor: "rgba(0, 230, 118, 0.1)" },
                        }}
                        aria-label="عرض التفاصيل"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <Box sx={{ mt: 2 }}>
            <PaginationControls
              pagination={pagination}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
              totalRows={orders.length}
            />
          </Box>
        )}
      </Paper>
    </Stack>
  );
}

export default OrderHistoryPage;
