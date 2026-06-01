import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  Button,
  IconButton,
  Divider,
  Chip,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useOrderDetails } from "../../hooks/useOrderDetails";

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
  return labels[status] || status;
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
    hours = hours ? hours : 12;
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return `${day} ${month} ${year} - ${formattedTime}`;
  } catch (e) {
    return "-";
  }
};

function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, error } = useOrderDetails(id, !!id);

  const handleBack = () => {
    navigate("/multi-provider/orders");
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
        {error?.message || "فشل في جلب تفاصيل الطلب"}
      </Alert>
    );
  }

  if (!order) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        الطلب غير موجود
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
          maxWidth: 1200,
          mx: "auto",
          bgcolor: "#23222a",
        }}
      >
        {/* Header with Back Button */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ color: "#fff", mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{ color: "#fff", fontWeight: 700, flexGrow: 1 }}
          >
            تفاصيل الطلب
          </Typography>
        </Box>

        {/* Order Number and Status */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: "#aaa", mb: 0.5 }}>
                رقم الطلب
              </Typography>
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
                {order.order_number || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: "#aaa", mb: 0.5 }}>
                الحالة
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={getStatusLabel(order.user_status)}
                  sx={{
                    bgcolor: getStatusColor(order.user_status),
                    color: "#fff",
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={getSystemStatusLabel(order.system_status)}
                  variant="outlined"
                  sx={{
                    borderColor: "#555",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: "#555", mb: 3 }} />

        {/* Product Information */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ color: "#fff", fontWeight: 600, mb: 2 }}
          >
            معلومات المنتج
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ color: "#aaa", mb: 0.5 }}>
                الفئة
              </Typography>
              <Typography variant="body1" sx={{ color: "#fff" }}>
                {order.product_variant?.product?.category?.name || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ color: "#aaa", mb: 0.5 }}>
                المنتج
              </Typography>
              <Typography variant="body1" sx={{ color: "#fff" }}>
                {order.product_variant?.product?.name || "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ color: "#aaa", mb: 0.5 }}>
                المتغير
              </Typography>
              <Typography variant="body1" sx={{ color: "#fff" }}>
                {order.product_variant?.name || "-"}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: "#555", mb: 3 }} />

        {/* Order Details */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ color: "#fff", fontWeight: 600, mb: 2 }}
          >
            تفاصيل الطلب
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ color: "#aaa", mb: 0.5 }}>
                الكمية
              </Typography>
              <Typography variant="body1" sx={{ color: "#fff" }}>
                {order.quantity || 0}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ color: "#aaa", mb: 0.5 }}>
                السعر الإجمالي
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#00e676", fontWeight: 600 }}
              >
                ${order.total_price ? parseFloat(order.total_price).toFixed(2) : "0.00"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ color: "#aaa", mb: 0.5 }}>
                طريقة التسليم
              </Typography>
              <Typography variant="body1" sx={{ color: "#fff" }}>
                {order.delivery_method || "-"}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Delivery Data */}
        {order.delivery_data && Object.keys(order.delivery_data).length > 0 && (
          <>
            <Divider sx={{ borderColor: "#555", mb: 3 }} />
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: "#fff", fontWeight: 600, mb: 2 }}
              >
                بيانات التسليم
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(order.delivery_data).map(([key, value]) => (
                  <Grid item xs={12} md={6} key={key}>
                    <Typography variant="body2" sx={{ color: "#aaa", mb: 0.5 }}>
                      {key}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#fff" }}>
                      {String(value) || "-"}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}

        <Divider sx={{ borderColor: "#555", mb: 3 }} />

        {/* Dates and Provider */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ color: "#fff", fontWeight: 600, mb: 2 }}
          >
            معلومات إضافية
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ color: "#aaa", mb: 0.5 }}>
                تاريخ الإنشاء
              </Typography>
              <Box
                component="span"
                sx={{ direction: "ltr", display: "inline-block" }}
              >
                <Typography variant="body1" sx={{ color: "#fff" }}>
                  {formatDate(order.created_at)}
                </Typography>
              </Box>
            </Grid>
            {order.completed_at && (
              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ color: "#aaa", mb: 0.5 }}>
                  تاريخ الإكمال
                </Typography>
                <Box
                  component="span"
                  sx={{ direction: "ltr", display: "inline-block" }}
                >
                  <Typography variant="body1" sx={{ color: "#fff" }}>
                    {formatDate(order.completed_at)}
                  </Typography>
                </Box>
              </Grid>
            )}
            {order.failed_at && (
              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ color: "#aaa", mb: 0.5 }}>
                  تاريخ الفشل
                </Typography>
                <Box
                  component="span"
                  sx={{ direction: "ltr", display: "inline-block" }}
                >
                  <Typography variant="body1" sx={{ color: "#fff" }}>
                    {formatDate(order.failed_at)}
                  </Typography>
                </Box>
              </Grid>
            )}
            {order.current_provider && (
              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ color: "#aaa", mb: 0.5 }}>
                  المورد الحالي
                </Typography>
                <Typography variant="body1" sx={{ color: "#fff" }}>
                  {order.current_provider?.name || "-"}
                </Typography>
              </Grid>
            )}
            {order.attempts !== undefined && (
              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ color: "#aaa", mb: 0.5 }}>
                  عدد المحاولات
                </Typography>
                <Typography variant="body1" sx={{ color: "#fff" }}>
                  {order.attempts || 0}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Status Logs Section - Prepared for Future */}
        <Divider sx={{ borderColor: "#555", mb: 3 }} />
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ color: "#fff", fontWeight: 600, mb: 2 }}
          >
            سجل الحالات
          </Typography>
          {order.status_logs && order.status_logs.length > 0 ? (
            <Stack spacing={2}>
              {order.status_logs.map((log, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    bgcolor: "#2d2d35",
                    borderLeft: `4px solid ${getStatusColor(log.new_status)}`,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#aaa", mb: 1 }}>
                    {formatDate(log.created_at)}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#fff", mb: 0.5 }}>
                    {log.old_status && (
                      <span>
                        من: {getSystemStatusLabel(log.old_status)} → إلى:{" "}
                        {getSystemStatusLabel(log.new_status)}
                      </span>
                    )}
                    {!log.old_status && (
                      <span>الحالة: {getSystemStatusLabel(log.new_status)}</span>
                    )}
                  </Typography>
                  {log.message && (
                    <Typography variant="body2" sx={{ color: "#aaa" }}>
                      {log.message}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" sx={{ color: "#aaa" }}>
              لا توجد سجلات حالات متاحة
            </Typography>
          )}
        </Box>

        {/* Actions Section - Prepared for Future */}
        <Divider sx={{ borderColor: "#555", mb: 3 }} />
        <Box>
          <Typography
            variant="h6"
            sx={{ color: "#fff", fontWeight: 600, mb: 2 }}
          >
            الإجراءات
          </Typography>
          <Typography variant="body2" sx={{ color: "#aaa" }}>
            الإجراءات ستكون متاحة قريباً
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
}

export default OrderDetailsPage;

