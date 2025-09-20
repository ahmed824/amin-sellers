import { useState } from "react";
import { Alert, Button, Card, CardContent, CardMedia, Grid, Typography, Paper, Box, Divider, Chip } from "@mui/material";
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
    const { data: offersData, isLoading, error: offersError } = useJawakerOffers();
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
        if (isNaN(date.getTime())) return null; // Invalid date
        return format(date, "d MMMM yyyy, h:mm a", { locale: ar });
    };

    if (!offersData?.rows?.length && !isLoading) {
        return null; // Don't render if no offers are available
    }

    return (
        <Paper elevation={4} sx={{ p: 3, maxWidth: "450px", mt: 2, direction: "rtl" }}>
            <Typography variant="h6" gutterBottom align="right" color="primary">
                شراء عرض جواكر
            </Typography>

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
                                {/* Image */}
                                <CardMedia
                                    component="img"
                                    height="160"
                                    image={offer.image || "/bg-img.jpg"} // Fallback image
                                    alt={offer.description}
                                />

                                {/* Content */}
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="body1" gutterBottom color="#fff">
                                        {offer.description}
                                    </Typography>

                                    <Divider sx={{ my: 1 }} />

                                    <Typography variant="h6" color="success.main" gutterBottom>
                                        السعر: {offer.seller_price.toLocaleString()} توكنز
                                    </Typography>

                                    {offer.max_per_user && (
                                        <Chip
                                            label={offer.max_per_user}
                                            color="secondary"
                                            variant="outlined"
                                            sx={{ mb: 1 }}
                                        />
                                    )}

                                    {formattedDate && (
                                        <Typography variant="body2" color="error.main">
                                            ينتهي في: {formattedDate}
                                        </Typography>
                                    )}
                                </CardContent>

                                {/* Button */}
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