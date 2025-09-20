import {
    Button,
    CircularProgress,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useSellerProfile } from "../hooks/useSellerProfile";
import TransferButton from "./shared/TransferButton";  

const tokenAmounts = [
    825000, 500000, 300000, 200000, 100000, 10000000, 5000000, 3000000, 2000000,
    1000000,
];

function TokenTransfer({
    tokenAmount,
    setTokenAmount,
    selectedPlayer,
    setSelectedPlayer,
    setError,
    transferTokens,
    isTransferring,
    resetTransfer,
    setSearchName, // Added to clear searchName
    setRecipientId, // Added to clear recipientId
    setPlayers, // Added to clear players
    setPlayerById, // Added to clear playerById
}) {
    const { data: profile } = useSellerProfile();

    return (
        <Paper
            elevation={4}
            sx={{ p: 3, width: 400, maxWidth: "95%", mt: 2, direction: "rtl" }}
        >
            <Typography
                variant="subtitle1"
                mb={1}
                sx={{
                    textAlign: "right",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    تحويل التوكنز{" "}
                    <MonetizationOnIcon sx={{ verticalAlign: "middle", color: "#ffd600" }} />
                </div>
                <div>
                    رصيد المحفظة:{" "}
                    <span style={{ color: "#00e676", fontWeight: 700 }}>
                        {Number(profile?.wallet?.balance).toLocaleString()} {profile?.wallet?.currency}
                    </span>
                </div>
            </Typography>
            <TextField
                fullWidth
                placeholder="أدخل الكمية"
                type="text"
                value={tokenAmount.toLocaleString()}
                onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, "");
                    setTokenAmount(Number(rawValue) || 0);
                    setError("");
                    resetTransfer();
                }}
                sx={{ mb: 2 }}
                InputProps={{
                    sx: { direction: "rtl", textAlign: "right" },
                    endAdornment: isTransferring ? (
                        <CircularProgress color="inherit" size={20} />
                    ) : null,
                }}
                inputProps={{ style: { textAlign: "right", direction: "rtl" } }}
            />
            
            {/* Pricing Information */}
            {tokenAmount > 0 && profile?.pricing?.group_pricing?.prices?.tokens_million && (
                <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        تفاصيل التسعير:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        الكمية: <strong>{Number(tokenAmount).toLocaleString()} توكن</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        السعر: <strong>{((tokenAmount / 1000000) * profile.pricing.group_pricing.prices.tokens_million).toFixed(2)} {profile.pricing.group_pricing.currency}</strong>
                    </Typography>
                    <Typography variant="body2">
                        سعر المليون توكن: <strong>{profile.pricing.group_pricing.prices.tokens_million} {profile.pricing.group_pricing.currency}</strong>
                    </Typography>
                </Paper>
            )}
            
            <Stack
                direction="row"
                flexWrap="wrap"
                mb={2}
                sx={{ justifyContent: "center", gap: 1 }}
            >
                {tokenAmounts.map((amt) => (
                    <Button
                        key={amt}
                        variant="contained"
                        color="inherit"
                        sx={{
                            bgcolor: "#23222a",
                            color: "#fff",
                            border: "1px solid #444",
                            minWidth: 62,
                            m: 0,
                            flex: "0 1 calc(15% - 0px)",
                        }}
                        onClick={() => {
                            setTokenAmount(amt);
                            setError("");
                            resetTransfer();
                        }}
                    >
                        {amt >= 1000000 ? `${amt / 1000000}M` : `${amt / 1000}K`}
                    </Button>
                ))}
            </Stack>
            <TransferButton
                transferType="tokens"
                selectedPlayer={selectedPlayer}
                setSelectedPlayer={setSelectedPlayer}
                setSearchName={setSearchName}
                setRecipientId={setRecipientId}
                setPlayers={setPlayers}
                setPlayerById={setPlayerById}
                setError={setError}
                transferData={{
                    recipient_id: selectedPlayer?.id,
                    amount: parseInt(tokenAmount),
                    note: "تحويل تجريبي",
                }}
                transferFn={transferTokens}
                isTransferring={isTransferring}
                setAmount={setTokenAmount}
                amount={tokenAmount}
                resetTransfer={resetTransfer}
                successMessage={`تم تحويل ${parseInt(tokenAmount).toLocaleString()} توكن${profile?.pricing?.group_pricing?.prices?.tokens_million ? ` (${((tokenAmount / 1000000) * profile.pricing.group_pricing.prices.tokens_million).toFixed(2)} ${profile.pricing.group_pricing.currency})` : ''} بنجاح إلى ${selectedPlayer?.username || "اللاعب"
                    }`}
            />
        </Paper>
    );
}

export default TokenTransfer;