import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Paper,
  Box,
  Divider,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "react-toastify";
import { usePurchaseJawakerOffer } from "../hooks/usePurchaseJawakerOffer";
import { useJawakerOffers } from "../hooks/useJawakerOffers";

const JawakerOfferPurchase = ({
  selectedPlayer,
  setSelectedPlayer,
  setError,
  setSearchName,
  setRecipientId,
  setPlayers,
  setPlayerById,
}) => {
  const {
    data: offersData,
    isLoading,
    error: offersError,
  } = useJawakerOffers();
  const {
    mutate: purchaseOffer,
    isPending: isPurchasing,
    isError: isPurchaseError,
    error: purchaseError,
    reset: resetPurchase,
  } = usePurchaseJawakerOffer();
  const [purchasingOfferId, setPurchasingOfferId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmOffer, setConfirmOffer] = useState(null);

  const handlePurchase = (offer) => {
    if (!selectedPlayer) {
      setError("يرجى اختيار لاعب أولاً");
      return;
    }

    setConfirmOffer(offer);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!confirmOffer) return;

    setConfirmOpen(false);
    setPurchasingOfferId(confirmOffer.external_offer_id);
    purchaseOffer(
      {
        recipient_id: selectedPlayer.id,
        external_offer_id: confirmOffer.external_offer_id,
      },
      {
        onSuccess: (data) => {
          setSelectedPlayer(null);
          setSearchName("");
          setRecipientId("");
          setPlayers([]);
          setPlayerById([]);
          setError(""); // Clear error on success
          toast.success(data?.message || "تم شراء العرض بنجاح");
          resetPurchase();
        },
        onError: (err) => {
          const msg = err.message || "فشل في شراء العرض";
          setError(msg);
          toast.error(msg);
        },
        onSettled: () => {
          setPurchasingOfferId(null);
        },
      }
    );
  };

  // Helper function to validate and format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return format(date, "d MMMM yyyy, h:mm a", { locale: ar });
  };

  // Hide completely if not loading and no offers
  if (!isLoading && !offersData?.rows?.length) {
    return null;
  }

  return (
    <Paper
      elevation={4}
      sx={{ p: 3, maxWidth: "450px", mt: 2, direction: "rtl" }}
    >
      <Typography variant="h6" gutterBottom align="right" color="primary">
         عروض جواكر
      </Typography>

      {/* Loading spinner */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Errors */}
      {offersError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {offersError.message || "خطأ في جلب العروض"}
        </Alert>
      )}
      {isPurchaseError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {purchaseError.message || "خطأ في شراء العرض"}
        </Alert>
      )}
      {/* Offers */}
      <Grid container spacing={2}>
        {offersData?.rows?.map((offer) => {
          const formattedDate = formatDate(offer.ends_at);

          return (
            <Grid item xs={12} key={offer.id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  border: "1px solid #e0e0e0",
                }}
                elevation={3}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={offer.image || "/bg-img.jpg"}
                  alt={offer.description}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ color: "#e0e0e0" }}
                  >
                    {offer.description}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="h6" color="success.main" gutterBottom>
                    {offer.seller_price.toLocaleString()} توكنز
                    {offer.seller_price_money
                      ? ` = ${offer.seller_price_money}${offer.currency ? ` ${offer.currency}` : ""}`
                      : ""}
                  </Typography>

                  {(offer.max_per_user || formattedDate) && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                        mt: 1,
                      }}
                    >
                      {offer.max_per_user && (
                        <Chip
                          label={`الحد: ${offer.max_per_user}`}
                          color="secondary"
                          variant="outlined"
                        />
                      )}
                      {formattedDate && (
                        <Typography variant="body2" color="error.main">
                          ينتهي في: {formattedDate}
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePurchase(offer)}
                    disabled={isPurchasing || !selectedPlayer}
                    fullWidth
                    startIcon={
                      isPurchasing && purchasingOfferId === offer.external_offer_id ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : null
                    }
                  >
                    {isPurchasing && purchasingOfferId === offer.external_offer_id
                      ? "جاري الشراء..."
                      : "شراء العرض"}
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        dir="rtl"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            width: "90%",
            maxWidth: "420px",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "right",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "1.1rem",
            backgroundColor: "#a71d2a",
            py: 1.5,
          }}
        >
          تأكيد شراء العرض
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText
            sx={{
              textAlign: "right",
              color: "#e0e0e0",
              fontSize: "0.95rem",
              mb: 1,
              mt: 1,
            }}
          >
            هل أنت متأكد من إرسال العرض إلى{" "}
            <strong>{selectedPlayer?.username || "اللاعب"}</strong>؟
          </DialogContentText>
          {confirmOffer && (
            <Box sx={{ mt: 1, color: "#cfd8dc", fontSize: "0.9rem" }}>
              <div>{confirmOffer.description}</div>
              <div style={{ marginTop: 6, color: "#b9f6ca" }}>
                {confirmOffer.seller_price?.toLocaleString()} توكنز
                {confirmOffer.seller_price_money
                  ? ` = ${confirmOffer.seller_price_money}${
                      confirmOffer.currency ? ` ${confirmOffer.currency}` : ""
                    }`
                  : ""}
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setConfirmOpen(false)}
            sx={{ color: "#fff", borderColor: "#555" }}
          >
            إلغاء
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            disabled={isPurchasing}
          >
            موافق
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default JawakerOfferPurchase;
