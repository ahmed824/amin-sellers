import { useState } from "react";
import {
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { useSellerProfile } from "../../hooks/useSellerProfile";
import { useWillCharge } from "../../hooks/useWillCharge";

function TransferButton({
  transferType, // "tokens" or "booster"
  selectedPlayer,
  setSelectedPlayer,
  setSearchName,
  setRecipientId,
  setPlayers,
  setPlayerById,
  setError,
  transferData,
  transferFn,
  isTransferring,
  setAmount,
  amount,
  resetTransfer,
  successMessage,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [chargeData, setChargeData] = useState(null);
  const { data: profile } = useSellerProfile();
  const { mutate: checkWillCharge, isPending: isCheckingCharge } =
    useWillCharge();

  const handleConfirmOpen = () => {
    if (!selectedPlayer) {
      setError("يرجى اختيار لاعب");
      toast.error("يرجى اختيار لاعب");
      return;
    }
    if (!amount || amount <= 0) {
      const msg =
        transferType === "tokens"
          ? "يرجى إدخال كمية صالحة من التوكنز"
          : "يرجى اختيار كمية صالحة من المسرعات";
      setError(msg);
      toast.error(msg);
      return;
    }

    // Prepare payload for will-charge
    const payload = {
      product: transferType,
      amount,
      ...(transferType === "booster" && { booster_type: transferData.type }),
    };

    // Call will-charge API
    checkWillCharge(payload, {
      onSuccess: (data) => {
        setChargeData(data);
        setConfirmOpen(true);
      },
      onError: (error) => {
        const msg = error.message || "فشل في جلب تفاصيل التسعير";
        setError(msg);
        toast.error(msg);
      },
    });
  };

  const handleTransfer = () => {
    setConfirmOpen(false);
    transferFn(transferData, {
      onSuccess: (data) => {
        setAmount(
          transferType === "tokens" ? "" : { black: 0, blue: 0, red: 0 }
        );
        setSelectedPlayer(null);
        setSearchName("");
        setRecipientId("");
        setPlayers([]);
        setPlayerById([]);
        setError("");
        resetTransfer();
        toast.success(data.message || successMessage);
        setChargeData(null);
      },
      onError: (error) => {
        const msg =
          error.message ||
          (transferType === "tokens"
            ? "فشل في تحويل التوكنز"
            : "فشل في تحويل المسرعات");
        setError(msg);
        toast.error(msg);
      },
    });
  };

  const handleCancel = () => {
    setAmount(transferType === "tokens" ? "" : { black: 0, blue: 0, red: 0 });
    setSelectedPlayer(null);
    setSearchName("");
    setRecipientId("");
    setPlayers([]);
    setPlayerById([]);
    setError("");
    resetTransfer();
    setConfirmOpen(false);
    setChargeData(null);
  };

  // Define color mapping for booster types
  const boosterColors = {
    red: "#ff0000",
    blue: "#2196f3",
    black: "#525252",
  };

  // Generate type label with colored text for boosters
  const typeLabel =
    transferType === "tokens" ? (
      `${parseInt(amount).toLocaleString()} توكن`
    ) : (
      <>
        {amount} مسرع (
        <span style={{ color: boosterColors[transferData?.type] || "#e0e0e0" }}>
          {transferData?.type || "غير محدد"}
        </span>
        )
      </>
    );

  return (
    <>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Button
          fullWidth
          variant="contained"
          sx={{ bgcolor: "#a71d2a" }}
          disabled={
            !selectedPlayer ||
            !amount ||
            amount <= 0 ||
            isTransferring ||
            isCheckingCharge
          }
          onClick={handleConfirmOpen}
        >
          {isCheckingCharge ? "جارٍ التحقق..." : "تنفيذ التحويل"}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          className="cancel-btn"
          onClick={handleCancel}
        >
          إلغاء
        </Button>
      </Stack>

      <Dialog
        open={confirmOpen}
        className="transfer-dialog"
        onClose={() => setConfirmOpen(false)}
        dir="rtl"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#1e1e1e",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            width: "90%",
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "right",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "1.25rem",
            backgroundColor: "#a71d2a",
            py: 1.5,
          }}
        >
          تأكيد التحويل
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText
            sx={{
              textAlign: "right",
              color: "#e0e0e0",
              fontSize: "1rem",
              mb: 2,
              mt: 2,
            }}
          >
            هل أنت متأكد من تحويل <strong>{typeLabel}</strong> إلى{" "}
            <strong>{selectedPlayer?.username || "اللاعب"}</strong>؟
          </DialogContentText>

          {/* Pricing Information */}
          {amount > 0 && (
            <Box
              sx={{
                bgcolor: "#2a2a34",
                p: 2,
                borderRadius: 1,
                border: "1px solid #444",
                mb: 2,
                mt: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                color="#ffd700"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                تفاصيل التسعير
              </Typography>
              {chargeData ? (
                <>
                  <Typography variant="body2" color="#e0e0e0" sx={{ mb: 1 }}>
                    الكمية:{" "}
                    <strong>
                      {transferType === "tokens"
                        ? parseInt(amount).toLocaleString()
                        : amount}{" "}
                      {transferType === "tokens"
                        ? "توكن"
                        : `مسرع ${transferData?.type}`}
                    </strong>
                  </Typography>
                  {chargeData.pricing?.unit_price && (
                    <Typography variant="body2" color="#e0e0e0" sx={{ mb: 1 }}>
                      سعر الوحدة:{" "}
                      <strong>
                        {chargeData.pricing.unit_price} {chargeData.currency}
                      </strong>
                    </Typography>
                  )}
                  <Typography variant="body2" color="#e0e0e0" sx={{ mb: 1 }}>
                    الإجمالي:{" "}
                    <strong>
                      {chargeData.subtotal} {chargeData.currency}
                    </strong>
                  </Typography>
                  <Typography variant="body2" color="#e0e0e0" sx={{ mb: 1 }}>
                    رصيد المحفظة الحالي:{" "}
                    <strong>
                      {chargeData.wallet.balance} {chargeData.currency}
                    </strong>
                  </Typography>
                  <Typography variant="body2" color="#e0e0e0" sx={{ mb: 1 }}>
                    سيتم خصم:{" "}
                    <strong>
                      {chargeData.will_deduct} {chargeData.currency}
                    </strong>
                  </Typography>
                  <Typography variant="body2" color="#e0e0e0">
                    الرصيد بعد التحويل:{" "}
                    <strong>
                      {chargeData.after_balance} {chargeData.currency}
                    </strong>
                  </Typography>
                  {!chargeData.can_charge && (
                    <Typography variant="body2" color="#ff0000" sx={{ mt: 1 }}>
                      خطأ: الرصيد غير كافٍ! المبلغ المطلوب:{" "}
                      <strong>
                        {chargeData.missing} {chargeData.currency}
                      </strong>
                    </Typography>
                  )}
                </>
              ) : (
                // Fallback to profile pricing if chargeData is unavailable
                <>
                  <Typography variant="body2" color="#e0e0e0" sx={{ mb: 1 }}>
                    الكمية:{" "}
                    <strong>
                      {transferType === "tokens"
                        ? parseInt(amount).toLocaleString()
                        : amount}{" "}
                      {transferType === "tokens"
                        ? "توكن"
                        : `مسرع ${transferData?.type}`}
                    </strong>
                  </Typography>
                  {transferType === "tokens" &&
                    profile?.pricing?.group_pricing?.prices?.tokens_million &&
                    profile?.pricing?.group_pricing?.currency && (
                      <Typography
                        variant="body2"
                        color="#e0e0e0"
                        sx={{ mb: 1 }}
                      >
                        السعر:{" "}
                        <strong>
                          {(
                            (amount / 1000000) *
                            profile.pricing.group_pricing.prices.tokens_million
                          ).toFixed(2)}{" "}
                          {profile.pricing.group_pricing.currency}
                        </strong>
                      </Typography>
                    )}
                  {transferType === "booster" &&
                    profile?.pricing?.group_pricing?.prices?.[
                      `booster_${transferData?.type}`
                    ] &&
                    profile?.pricing?.group_pricing?.currency && (
                      <>
                        <Typography
                          variant="body2"
                          color="#e0e0e0"
                          sx={{ mb: 1 }}
                        >
                          سعر الوحدة:{" "}
                          <strong>
                            {
                              profile.pricing.group_pricing.prices[
                                `booster_${transferData?.type}`
                              ]
                            }{" "}
                            {profile.pricing.group_pricing.currency}
                          </strong>
                        </Typography>
                        <Typography variant="body2" color="#e0e0e0">
                          السعر الإجمالي:{" "}
                          <strong>
                            {(
                              profile.pricing.group_pricing.prices[
                                `booster_${transferData?.type}`
                              ] * amount
                            ).toFixed(2)}{" "}
                            {profile.pricing.group_pricing.currency}
                          </strong>
                        </Typography>
                      </>
                    )}
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button
            onClick={handleCancel}
            sx={{
              color: "#ffffff",
              borderColor: "#ffffff",
              "&:hover": {
                borderColor: "#e0e0e0",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            variant="outlined"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleTransfer}
            autoFocus
            variant="contained"
            disabled={chargeData && !chargeData.can_charge}
            sx={{
              bgcolor: "#a71d2a",
              color: "#ffffff",
              "&:hover": {
                bgcolor: "#8e1923",
              },
              fontWeight: "bold",
            }}
          >
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TransferButton;
