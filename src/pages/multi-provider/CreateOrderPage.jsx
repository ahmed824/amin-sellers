import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useVariants } from "../../hooks/useVariants";
import { useCreateOrder } from "../../hooks/useCreateOrder";
import { useSellerProfile } from "../../hooks/useSellerProfile";
import { useSearchPlayers } from "../../hooks/useSearchPlayers";
import { useGetPlayerById } from "../../hooks/useGetPlayerById";
import { useGetPlayerProfile } from "../../hooks/useGetPlayerProfile";
import RecipientInput from "../../components/RecipientInput";
import PlayerDetailsModal from "../../components/PlayerDetailsModal";

const duplicateOrderStorageKey = "aminSellerLastDeliveryOrder";
const recipientFieldKeys = [
  "recipient_id",
  "player_id",
  "jawaker_id",
  "public_id",
  "recipient_public_id",
  "account_id",
  "user_id",
  "uid",
];
const tokenQuickAmounts = [
  100000,
  200000,
  300000,
  500000,
  825000,
  1000000,
  2000000,
  3000000,
  5000000,
  10000000,
];

const normalizeDeliveryData = (data) =>
  Object.keys(data || {})
    .sort()
    .reduce((acc, key) => {
      const value = data[key];
      acc[key] =
        typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;
      return acc;
    }, {});

const extractRecipient = (data) => {
  for (const key of recipientFieldKeys) {
    const value = data?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim().toLowerCase();
    }
  }

  return JSON.stringify(normalizeDeliveryData(data || {})).toLowerCase();
};

const buildDuplicateOrderKey = ({ productId, quantity, deliveryData }) =>
  [productId, quantity, extractRecipient(deliveryData)].join("|");

const getLastDuplicateOrder = () => {
  try {
    return JSON.parse(localStorage.getItem(duplicateOrderStorageKey) || "null");
  } catch {
    localStorage.removeItem(duplicateOrderStorageKey);
    return null;
  }
};

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

const isRecipientField = (field) => {
  const values = [field?.key, field?.label, field?.provider_param]
    .map(normalizeText)
    .filter(Boolean);

  return values.some((value) => {
    const underscored = value.replace(/-/g, "_");
    return (
      recipientFieldKeys.includes(underscored) ||
      value.includes("player-id") ||
      value.includes("recipient-id") ||
      value.includes("jawaker-id") ||
      value.includes("معرف-اللاعب") ||
      value.includes("رقم-اللاعب")
    );
  });
};

const formatMoney = (value) => {
  const number = Number(value || 0);
  return number.toFixed(2).replace(/\.00$/, "");
};

const formatQuantityLabel = (amount) => {
  if (amount >= 1000000) return `${amount / 1000000}M`;
  if (amount >= 1000) return `${amount / 1000}K`;
  return String(amount);
};

const isJawakerVariant = (variant) => {
  const category = variant?.category || {};
  const generalCategory = category.general_category || {};
  const categoryValues = [
    category.slug,
    category.name,
    generalCategory.slug,
    generalCategory.name,
  ].map(normalizeText);
  const hasJawakerRequiredField = (variant?.required_data || []).some(
    (field) => normalizeText(field?.key).replace(/-/g, "_") === "jawaker_id"
  );

  return (
    categoryValues.includes("jawaker") ||
    categoryValues.includes("جواكر") ||
    variant?.delivery_method === "jawaker" ||
    hasJawakerRequiredField
  );
};

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
  const [duplicateBlockUntil, setDuplicateBlockUntil] = useState(null);
  const [nowTick, setNowTick] = useState(Date.now());
  const [recipientMode, setRecipientMode] = useState("id");
  const [searchName, setSearchName] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [recipientError, setRecipientError] = useState("");
  const [players, setPlayers] = useState([]);
  const [playerById, setPlayerById] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalPlayerId, setModalPlayerId] = useState(null);

  const selectedVariant = useMemo(
    () => variants?.find((v) => v.id === parseInt(selectedVariantId, 10)),
    [variants, selectedVariantId]
  );
  const isJawakerProduct = isJawakerVariant(selectedVariant);
  const isJawakerTokenProduct =
    isJawakerProduct && selectedVariant?.product_type === "amount";
  const minimumQuantity = isJawakerTokenProduct
    ? Math.max(10000, selectedVariant?.qty_constraints?.min || 1)
    : selectedVariant?.qty_constraints?.min || 1;
  const extraRequiredFields = (selectedVariant?.required_data || []).filter(
    (field) => !(isJawakerProduct && isRecipientField(field))
  );

  const {
    data: searchedPlayers = [],
    isLoading: isSearching,
    error: searchError,
  } = useSearchPlayers(searchName);
  const {
    data: fetchedPlayerById = [],
    isLoading: isFetchingId,
    error: idError,
  } = useGetPlayerById(recipientId);
  const {
    data: modalPlayer = null,
    isLoading: isFetchingProfile,
    error: profileError,
  } = useGetPlayerProfile(modalPlayerId, openModal);

  useEffect(() => {
    if (!selectedVariantId && variants?.length > 0) {
      setSelectedVariantId(String(variants[0].id));
    }
  }, [variants, selectedVariantId]);

  useEffect(() => {
    if (!selectedVariant) return;

    const initialData = {};
    (selectedVariant.required_data || []).forEach((field) => {
      initialData[field.key] = "";
    });

    setDeliveryData(initialData);
    setErrors({});

    setQuantity(isJawakerTokenProduct ? "" : minimumQuantity);
  }, [selectedVariant, isJawakerTokenProduct, minimumQuantity]);

  useEffect(() => {
    if (!duplicateBlockUntil) return undefined;

    const timer = window.setInterval(() => {
      if (Date.now() >= duplicateBlockUntil) {
        setDuplicateBlockUntil(null);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.form;
          return newErrors;
        });
      } else {
        setNowTick(Date.now());
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [duplicateBlockUntil]);

  useEffect(() => {
    if (searchedPlayers.length > 0 && !selectedPlayer) {
      setPlayers(searchedPlayers);
    }
  }, [searchedPlayers, selectedPlayer]);

  useEffect(() => {
    if (!fetchedPlayerById || selectedPlayer) return;
    const normalized = Array.isArray(fetchedPlayerById)
      ? fetchedPlayerById
      : [fetchedPlayerById].filter(Boolean);

    if (normalized.length > 0) {
      setPlayerById(normalized);
    }
  }, [fetchedPlayerById, selectedPlayer]);

  useEffect(() => {
    if (searchError) {
      setRecipientError(searchError.message || "خطأ في البحث عن اللاعبين");
    }
    if (idError) {
      setRecipientError(idError.message || "خطأ في جلب اللاعب بواسطة المعرف");
    }
  }, [searchError, idError]);

  useEffect(() => {
    if (!isJawakerProduct || !selectedPlayer) return;

    setDeliveryData((prev) => {
      const next = { ...prev, jawaker_id: selectedPlayer.id };
      (selectedVariant?.required_data || []).forEach((field) => {
        if (isRecipientField(field)) {
          next[field.key] = selectedPlayer.id;
        }
      });

      if (recipientMode === "id" && recipientId) {
        next.recipient_public_id = recipientId;
      }
      if (selectedPlayer.username) {
        next.recipient_name = selectedPlayer.username;
      }

      return next;
    });

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.recipient;
      (selectedVariant?.required_data || []).forEach((field) => {
        if (isRecipientField(field)) {
          delete newErrors[field.key];
        }
      });
      return newErrors;
    });
  }, [
    isJawakerProduct,
    selectedPlayer,
    selectedVariant,
    recipientMode,
    recipientId,
  ]);

  const handleDeliveryDataChange = (key, value) => {
    setDeliveryData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      delete newErrors.form;
      return newErrors;
    });
    setDuplicateBlockUntil(null);
  };

  const handleOpenModal = (player) => {
    setModalPlayerId(player.id);
    setOpenModal(true);
  };

  const calculateTotal = () => {
    if (!selectedVariant) return "0.00";

    if (selectedVariant.product_type === "amount") {
      if (!selectedVariant.base_amount || selectedVariant.base_amount <= 0) {
        return (Number(selectedVariant.price || 0) * quantity).toFixed(2);
      }

      return (
        (quantity / selectedVariant.base_amount) *
        Number(selectedVariant.price || 0)
      ).toFixed(2);
    }

    return (Number(selectedVariant.price || 0) * quantity).toFixed(2);
  };

  const quickAmounts = useMemo(() => {
    if (!selectedVariant) return [];
    const constraints = selectedVariant.qty_constraints || {};
    const min = minimumQuantity;
    const max = constraints.max;

    if (selectedVariant.product_type === "amount") {
      return tokenQuickAmounts
        .concat([min, selectedVariant.base_amount].filter(Boolean))
        .filter((amount, index, arr) => arr.indexOf(amount) === index)
        .filter((amount) => amount >= min && (!max || amount <= max))
        .sort((a, b) => a - b);
    }

    return [1, 2, 3, 4, 5].filter((amount) => amount >= min && (!max || amount <= max));
  }, [selectedVariant, minimumQuantity]);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedVariant) {
      newErrors.form = "هذا المنتج غير متاح حالياً";
    }

    if (selectedVariant) {
      const constraints = selectedVariant.qty_constraints || {};
      const min = minimumQuantity;
      const max = constraints.max;
      const step = constraints.step || 1;
      const numericQuantity = Number(quantity);

      if (quantity === "" || !Number.isInteger(numericQuantity)) {
        newErrors.quantity = "أدخل كمية صحيحة";
      } else if (numericQuantity < min) {
        newErrors.quantity = `الكمية يجب أن تكون ${min} على الأقل`;
      } else if (max && numericQuantity > max) {
        newErrors.quantity = `الكمية يجب ألا تتجاوز ${max}`;
      } else if (step > 1 && (numericQuantity - min) % step !== 0) {
        newErrors.quantity = `الكمية يجب أن تكون بخطوات ${step} بدءاً من ${min}`;
      }

      if (isJawakerProduct && !selectedPlayer) {
        newErrors.recipient = "اختر اللاعب من البحث قبل إنشاء الطلب";
      }

      extraRequiredFields.forEach((field) => {
        if (field.required && !deliveryData[field.key]) {
          newErrors[field.key] = `${field.label || field.key} مطلوب`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const normalizedDeliveryData = normalizeDeliveryData(deliveryData);
    const duplicateKey = buildDuplicateOrderKey({
      productId: parseInt(selectedVariant.id, 10),
      quantity: parseInt(quantity, 10),
      deliveryData: normalizedDeliveryData,
    });
    const now = Date.now();
    const lastOrder = getLastDuplicateOrder();

    if (lastOrder?.key === duplicateKey && now - lastOrder.createdAt < 60000) {
      const blockUntil = lastOrder.createdAt + 60000;
      setDuplicateBlockUntil(blockUntil);
      setErrors((prev) => ({
        ...prev,
        form: "لا يمكن إرسال نفس الطلب لنفس اللاعب خلال أقل من دقيقة.",
      }));
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        product_id: parseInt(selectedVariant.id, 10),
        quantity: parseInt(quantity, 10),
        delivery_data: normalizedDeliveryData,
      });
      localStorage.setItem(
        duplicateOrderStorageKey,
        JSON.stringify({ key: duplicateKey, createdAt: now })
      );
      setTimeout(() => navigate("/multi-provider/orders"), 1500);
    } catch {
      // The mutation hook shows the toast.
    }
  };

  const duplicateRemainingSeconds = duplicateBlockUntil
    ? Math.max(0, Math.ceil((duplicateBlockUntil - nowTick) / 1000))
    : 0;
  const walletBalance = Number(sellerProfile?.wallet?.balance || 0);
  const total = Number(calculateTotal());

  if (isLoading) {
    return (
      <CircularProgress size={40} sx={{ display: "block", mx: "auto", my: 4 }} />
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error?.message || "فشل في جلب المنتج"}
      </Alert>
    );
  }

  if (!variants || variants.length === 0 || !selectedVariant) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        هذا المنتج غير متاح حالياً
      </Alert>
    );
  }

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        bgcolor: "transparent",
        pt: 4,
        pb: 4,
        direction: "rtl",
        px: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1120, mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: "#fff", ml: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ color: "#fff", fontWeight: 800 }}>
              {selectedVariant.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#aaa", mt: 0.5 }}>
              إنشاء طلب مباشر بدون اختيار منتج إضافي
            </Typography>
          </Box>
          {isJawakerProduct && (
            <Chip
              icon={<PersonSearchIcon />}
              label="بحث لاعب جواكر"
              sx={{ bgcolor: "#1d3b2a", color: "#00e676", fontWeight: 700 }}
            />
          )}
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.15fr) 360px" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Paper sx={{ p: 3, bgcolor: "#23222a", color: "#fff" }}>
            <Stack spacing={3}>
              {isJawakerProduct ? (
                <Box>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <PersonSearchIcon sx={{ color: "#90caf9" }} />
                  المستلم
                </Typography>
                {recipientError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {recipientError}
                  </Alert>
                )}
                {errors.recipient && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    {errors.recipient}
                  </Alert>
                )}
                <Box
                  sx={{
                    bgcolor: "#18171d",
                    border: "1px solid #333",
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <RecipientInput
                    embedded
                    recipientMode={recipientMode}
                    setRecipientMode={setRecipientMode}
                    searchName={searchName}
                    setSearchName={setSearchName}
                    recipientId={recipientId}
                    setRecipientId={setRecipientId}
                    selectedPlayer={selectedPlayer}
                    setSelectedPlayer={setSelectedPlayer}
                    players={players}
                    setPlayers={setPlayers}
                    isSearching={isSearching}
                    searchError={searchError}
                    playerById={playerById}
                    setPlayerById={setPlayerById}
                    isFetchingId={isFetchingId}
                    idError={idError}
                    resetTransfer={() => {}}
                    resetBoosters={() => {}}
                    setError={setRecipientError}
                    handleOpenModal={handleOpenModal}
                  />
                </Box>
                </Box>
              ) : null}

              {isJawakerProduct && <Divider sx={{ borderColor: "#333" }} />}

              <Box>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <MonetizationOnIcon sx={{ color: "#ffd600" }} />
                الكمية والسعر
              </Typography>

              <TextField
                label={
                  selectedVariant.product_type === "amount"
                    ? "الكمية المطلوبة"
                    : "عدد الوحدات"
                }
                type="number"
                value={quantity}
                onChange={(event) => {
                  const rawValue = event.target.value;

                  if (isJawakerTokenProduct) {
                    if (rawValue === "" || /^\d+$/.test(rawValue)) {
                      setQuantity(rawValue);
                    }
                  } else {
                    const value = parseInt(rawValue, 10) || 1;
                    setQuantity(Math.max(minimumQuantity, value));
                  }

                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.quantity;
                    delete next.form;
                    return next;
                  });
                }}
                inputProps={{
                  min: minimumQuantity,
                  max: selectedVariant.qty_constraints?.max || undefined,
                  step: selectedVariant.qty_constraints?.step || 1,
                }}
                error={!!errors.quantity}
                helperText={
                  errors.quantity ||
                  (selectedVariant.product_type === "amount" &&
                  selectedVariant.qty_constraints
                    ? `أدخل كمية بين ${minimumQuantity} و ${
                        selectedVariant.qty_constraints.max || "∞"
                      }`
                    : "اختر عدد الوحدات")
                }
                fullWidth
                sx={{
                  mb: 2,
                  "& .MuiInputLabel-root": { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": { borderColor: "#555" },
                    "&:hover fieldset": { borderColor: "#00e676" },
                  },
                  "& .MuiFormHelperText-root": {
                    color: errors.quantity ? "#f44336" : "#aaa",
                  },
                }}
              />

              {quickAmounts.length > 0 && (
                <Stack direction="row" flexWrap="wrap" sx={{ gap: 1, mb: 2 }}>
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="contained"
                      onClick={() => setQuantity(amount)}
                      sx={{
                        bgcolor: quantity === amount ? "#a71d2a" : "#18171d",
                        color: "#fff",
                        border: "1px solid #444",
                        minWidth: 64,
                        "&:hover": { bgcolor: "#a71d2a" },
                      }}
                    >
                      {formatQuantityLabel(amount)}
                    </Button>
                  ))}
                </Stack>
              )}

              <Box
                sx={{
                  p: 2,
                  bgcolor: "#18171d",
                  border: "1px solid #00e676",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: "#00e676", mb: 0.5 }}>
                  السعر الحالي
                </Typography>
                <Typography variant="h5" sx={{ color: "#fff", fontWeight: 800 }}>
                  ${calculateTotal()}
                </Typography>
                {selectedVariant.product_type === "amount" && (
                    <Typography variant="caption" sx={{ color: "#aaa" }}>
                      {selectedVariant.pricing_summary ||
                        `$${Number(selectedVariant.pricing_unit_price || selectedVariant.price || 0)
                          .toFixed(6)
                          .replace(/\.?0+$/, "")} لكل ${Number(selectedVariant.pricing_unit_amount || selectedVariant.base_amount || 1).toLocaleString()} وحدة`}
                    </Typography>
                  )}
              </Box>
              </Box>

              {extraRequiredFields.length > 0 && (
                <Box>
                <Divider sx={{ borderColor: "#333", mb: 3 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  البيانات المطلوبة
                </Typography>
                <Stack spacing={2}>
                  {extraRequiredFields.map((field) => (
                    <TextField
                      key={field.key}
                      label={field.label || field.key}
                      type={field.type || "text"}
                      value={deliveryData[field.key] || ""}
                      onChange={(event) =>
                        handleDeliveryDataChange(field.key, event.target.value)
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
                </Stack>
                </Box>
              )}
            </Stack>
          </Paper>

          <Paper
            elevation={4}
            sx={{
              p: 3,
              bgcolor: "#23222a",
              color: "#fff",
              position: { md: "sticky" },
              top: { md: 24 },
            }}
          >
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
            >
              <Inventory2Icon sx={{ color: "#00e676" }} />
              تفاصيل الطلب
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              {selectedVariant.name}
            </Typography>
            {selectedVariant.description && (
              <Typography variant="body2" sx={{ color: "#aaa", mb: 2 }}>
                {selectedVariant.description}
              </Typography>
            )}
            <Stack direction="row" flexWrap="wrap" sx={{ gap: 1, mb: 2 }}>
              <Chip
                label={selectedVariant.category?.name || "منتج"}
                size="small"
                sx={{ bgcolor: "#18171d", color: "#fff" }}
              />
              <Chip
                label={
                  selectedVariant.product_type === "amount"
                    ? "كمية متغيرة"
                    : "باقة"
                }
                size="small"
                sx={{ bgcolor: "#18171d", color: "#fff" }}
              />
            </Stack>

            <Divider sx={{ borderColor: "#444", my: 2 }} />

            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: "#aaa" }}>الكمية</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {quantity === "" ? "-" : Number(quantity).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: "#aaa" }}>طريقة التسليم</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {selectedVariant.delivery_method || "-"}
                </Typography>
              </Box>
              {isJawakerProduct && selectedPlayer && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "#aaa" }}>اللاعب</Typography>
                  <Typography sx={{ fontWeight: 700 }}>
                    {selectedPlayer.username || selectedPlayer.id}
                  </Typography>
                </Box>
              )}
            </Stack>

            <Divider sx={{ borderColor: "#444", my: 2 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">الإجمالي</Typography>
              <Typography variant="h4" sx={{ color: "#00e676", fontWeight: 900 }}>
                ${calculateTotal()}
              </Typography>
            </Box>

            {sellerProfile && (
              <Alert
                severity={walletBalance >= total ? "success" : "error"}
                sx={{ mb: 2 }}
              >
                الرصيد المتاح: {formatMoney(walletBalance)}{" "}
                {sellerProfile.wallet?.currency || "USD"}
              </Alert>
            )}

            {errors.form && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {errors.form}
                {duplicateRemainingSeconds > 0 &&
                  ` حاول مرة أخرى بعد ${duplicateRemainingSeconds} ثانية.`}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              startIcon={<ReceiptLongIcon />}
              disabled={
                createOrderMutation.isPending || duplicateRemainingSeconds > 0
              }
              sx={{
                bgcolor: "#00e676",
                color: "#000",
                fontWeight: 800,
                py: 1.4,
                "&:hover": { bgcolor: "#00c764" },
                "&:disabled": { bgcolor: "#555" },
              }}
            >
              {createOrderMutation.isPending ? "جاري إنشاء الطلب..." : "إنشاء الطلب"}
            </Button>
          </Paper>
        </Box>
      </Box>

      <PlayerDetailsModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setModalPlayerId(null);
        }}
        player={modalPlayer}
        isFetchingProfile={isFetchingProfile}
        profileError={profileError}
      />
    </Stack>
  );
}

export default CreateOrderPage;
