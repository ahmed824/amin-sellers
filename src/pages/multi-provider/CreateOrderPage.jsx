import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useVariants } from "../../hooks/useVariants";
import { useCreateOrder } from "../../hooks/useCreateOrder";
import { useSellerProfile } from "../../hooks/useSellerProfile";

function CreateOrderPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { data: variants, isLoading, isError, error } = useVariants(
    productId,
    !!productId
  );
  const { data: sellerProfile } = useSellerProfile();
  const createOrderMutation = useCreateOrder();

  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [deliveryData, setDeliveryData] = useState({});
  const [errors, setErrors] = useState({});

  const selectedVariant = variants?.find((v) => v.id === parseInt(selectedVariantId));

  useEffect(() => {
    if (selectedVariant) {
      // Initialize delivery_data with empty values for required fields
      const initialData = {};
      (selectedVariant.required_data || []).forEach((field) => {
        initialData[field.key] = "";
      });
      setDeliveryData(initialData);
      setErrors({});
    }
  }, [selectedVariant]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDeliveryDataChange = (key, value) => {
    setDeliveryData((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Clear error for this field
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedVariantId) {
      newErrors.variant = "يرجى اختيار متغير المنتج";
    }
    
    // Validate quantity based on product type
    if (selectedVariant) {
      const productType = selectedVariant.product_type || 'package';
      const qtyConstraints = selectedVariant.qty_constraints;
      
    if (quantity < 1) {
      newErrors.quantity = "الكمية يجب أن تكون 1 أو أكثر";
      } else if (productType === 'amount' && qtyConstraints) {
        // Validate min
        if (qtyConstraints.min && quantity < qtyConstraints.min) {
          newErrors.quantity = `الكمية يجب أن تكون ${qtyConstraints.min} على الأقل`;
        }
        // Validate max
        if (qtyConstraints.max && quantity > qtyConstraints.max) {
          newErrors.quantity = `الكمية يجب ألا تتجاوز ${qtyConstraints.max}`;
        }
        // Validate step
        if (qtyConstraints.step && qtyConstraints.step > 1 && qtyConstraints.min) {
          const offset = quantity - qtyConstraints.min;
          if (offset % qtyConstraints.step !== 0) {
            newErrors.quantity = `الكمية يجب أن تكون بخطوات ${qtyConstraints.step} بدءاً من ${qtyConstraints.min}`;
          }
        }
    }

    // Validate required_data fields
      (selectedVariant.required_data || []).forEach((field) => {
        if (field.required && !deliveryData[field.key]) {
          newErrors[field.key] = `${field.label || field.key} مطلوب`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        product_variant_id: parseInt(selectedVariantId),
        quantity: parseInt(quantity),
        delivery_data: deliveryData,
      });
      // Navigate to order history on success
      setTimeout(() => {
        navigate("/multi-provider/orders");
      }, 1500);
    } catch (error) {
      // Error is handled by the mutation hook (toast)
    }
  };

  const calculateTotal = () => {
    if (!selectedVariant) return 0;
    
    const productType = selectedVariant.product_type || 'package';
    
    if (productType === 'amount' && selectedVariant.base_amount && selectedVariant.base_amount > 0) {
      // For amount types: (quantity / base_amount) * price
      const total = (quantity / selectedVariant.base_amount) * selectedVariant.price;
      return total.toFixed(2);
    }
    
    // For package types: quantity * price
    return (selectedVariant.price * quantity).toFixed(2);
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
        {error?.message || "فشل في جلب المتغيرات"}
      </Alert>
    );
  }

  if (!variants || variants.length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        لا توجد متغيرات متاحة لهذا المنتج
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
        sx={{ p: 3, width: "100%", maxWidth: 800, mx: "auto", bgcolor: "#23222a" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ color: "#fff", mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{ color: "#fff", fontWeight: 700, flexGrow: 1 }}
          >
            إنشاء طلب جديد
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Variant Selection */}
            <FormControl fullWidth error={!!errors.variant}>
              <InputLabel sx={{ color: "#fff" }}>اختر متغير المنتج</InputLabel>
              <Select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                label="اختر متغير المنتج"
                sx={{
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#555",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#00e676",
                  },
                }}
              >
                {variants.map((variant) => (
                  <MenuItem key={variant.id} value={variant.id}>
                    {variant.name} - ${variant.price}
                    {variant.product_type === 'amount' && variant.base_amount && (
                      ` (لكل ${variant.base_amount.toLocaleString()} وحدة)`
                    )}
                    {variant.product_type === 'package' && ' (باقة)'}
                  </MenuItem>
                ))}
              </Select>
              {errors.variant && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.variant}
                </Typography>
              )}
            </FormControl>

            {selectedVariant && (
              <>
                <Divider sx={{ borderColor: "#555" }} />

                {/* Variant Info */}
                <Box>
                  <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
                    معلومات المتغير
                  </Typography>
                  {selectedVariant.description && (
                    <Typography variant="body2" sx={{ color: "#aaa", mb: 2 }}>
                      {selectedVariant.description}
                    </Typography>
                  )}
                  
                  {/* Price display based on type */}
                  {selectedVariant.product_type === 'amount' && selectedVariant.unit_price && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: "#2d2d35", borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ color: "#00e676", mb: 1 }}>
                        💰 السعر: ${selectedVariant.unit_price.toFixed(6).replace(/\.?0+$/, '')} لكل وحدة
                      </Typography>
                      {selectedVariant.base_amount && (
                        <Typography variant="caption" sx={{ color: "#aaa" }}>
                          (${selectedVariant.price} لكل {selectedVariant.base_amount.toLocaleString()} وحدة)
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  <Typography variant="body2" sx={{ color: "#00e676" }}>
                    طريقة التسليم: {selectedVariant.delivery_method}
                  </Typography>
                </Box>

                {/* Quantity */}
                <Box>
                <TextField
                    label={
                      selectedVariant.product_type === 'amount' 
                        ? 'الكمية المطلوبة' 
                        : 'عدد الوحدات'
                    }
                  type="number"
                  value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      const qtyConstraints = selectedVariant.qty_constraints;
                      const min = qtyConstraints?.min || 1;
                      setQuantity(Math.max(min, val));
                    }}
                    inputProps={{
                      min: selectedVariant.qty_constraints?.min || 1,
                      max: selectedVariant.qty_constraints?.max || undefined,
                      step: selectedVariant.qty_constraints?.step || 1,
                    }}
                  error={!!errors.quantity}
                    helperText={
                      errors.quantity || 
                      (selectedVariant.product_type === 'amount' && selectedVariant.qty_constraints
                        ? `أدخل كمية بين ${selectedVariant.qty_constraints.min || 1} و ${selectedVariant.qty_constraints.max || '∞'}`
                        : 'اختر عدد الوحدات التي تريد شراءها'
                      )
                    }
                  fullWidth
                  sx={{
                    "& .MuiInputLabel-root": { color: "#fff" },
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": { borderColor: "#555" },
                      "&:hover fieldset": { borderColor: "#00e676" },
                    },
                      "& .MuiFormHelperText-root": { 
                        color: errors.quantity ? "#f44336" : "#aaa" 
                      },
                  }}
                />
                  
                  {/* Real-time price calculation for amount type */}
                  {selectedVariant.product_type === 'amount' && selectedVariant.base_amount && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: "#2d2d35", borderRadius: 1, border: "1px solid #00e676" }}>
                      <Typography variant="body2" sx={{ color: "#00e676", mb: 1 }}>
                        💰 السعر الفوري:
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
                        ${calculateTotal()}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#aaa", display: "block", mt: 1 }}>
                        {quantity.toLocaleString()} وحدة × ${selectedVariant.unit_price?.toFixed(6).replace(/\.?0+$/, '') || '0'} لكل وحدة
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Required Data Fields */}
                {selectedVariant.required_data &&
                  selectedVariant.required_data.length > 0 && (
                    <>
                      <Divider sx={{ borderColor: "#555" }} />
                      <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
                        البيانات المطلوبة
                      </Typography>
                      {selectedVariant.required_data.map((field) => (
                        <TextField
                          key={field.key}
                          label={field.label || field.key}
                          type={field.type || "text"}
                          value={deliveryData[field.key] || ""}
                          onChange={(e) =>
                            handleDeliveryDataChange(field.key, e.target.value)
                          }
                          required={field.required}
                          error={!!errors[field.key]}
                          helperText={errors[field.key]}
                          fullWidth
                          sx={{
                            "& .MuiInputLabel-root": { color: "#fff" },
                            "& .MuiOutlinedInput-root": {
                              color: "#fff",
                              "& fieldset": { borderColor: "#555" },
                              "&:hover fieldset": { borderColor: "#00e676" },
                            },
                          }}
                        />
                      ))}
                    </>
                  )}

                <Divider sx={{ borderColor: "#555" }} />

                {/* Total Price */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "#2d2d35",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#fff" }}>
                    الإجمالي:
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ color: "#00e676", fontWeight: 700 }}
                  >
                    ${calculateTotal()}
                  </Typography>
                </Box>

                {/* Balance Check */}
                {sellerProfile && (
                  <Alert
                    severity={
                      parseFloat(sellerProfile.wallet?.balance || 0) >=
                      parseFloat(calculateTotal())
                        ? "success"
                        : "error"
                    }
                  >
                    الرصيد المتاح: {sellerProfile.wallet?.balance || 0}{" "}
                    {sellerProfile.wallet?.currency || "USD"}
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={createOrderMutation.isPending}
                  sx={{
                    bgcolor: "#00e676",
                    color: "#000",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#00c764" },
                    "&:disabled": { bgcolor: "#555" },
                  }}
                >
                  {createOrderMutation.isPending
                    ? "جاري إنشاء الطلب..."
                    : "إنشاء الطلب"}
                </Button>
              </>
            )}
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}

export default CreateOrderPage;

