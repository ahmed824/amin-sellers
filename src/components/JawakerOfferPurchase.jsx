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
} from "@mui/material";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
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
    isSuccess: isPurchaseSuccess,
    isError: isPurchaseError,
    error: purchaseError,
    reset: resetPurchase,
  } = usePurchaseJawakerOffer();

  const handlePurchase = (offerId) => {
    if (!selectedPlayer) {
      setError("يرجى اختيار لاعب أولاً");
      return;
    }

    purchaseOffer(
      {
        recipient_id: selectedPlayer.id,
        external_offer_id: offerId,
      },
      {
        onSuccess: () => {
          setSelectedPlayer(null);
          setSearchName("");
          setRecipientId("");
          setPlayers([]);
          setPlayerById([]);
          resetPurchase();
          setError(""); // Clear error on success
        },
        onError: (err) => {
          setError(err.message || "فشل في شراء العرض");
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
      {isPurchaseSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          تم شراء العرض بنجاح
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
                    onClick={() => handlePurchase(offer.external_offer_id)}
                    disabled={isPurchasing || !selectedPlayer}
                    fullWidth
                  >
                    {isPurchasing ? "جاري الشراء..." : "شراء العرض"}
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default JawakerOfferPurchase;
