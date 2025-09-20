import { Paper, Typography } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import AcceleratorSelector from "./Accelerator/AcceleratorSelector";
import AcceleratorCounter from "./Accelerator/AcceleratorCounter";
import TransferButton from "./shared/TransferButton";
import { useSellerProfile } from "../hooks/useSellerProfile";

function AcceleratorTransfer({
  selectedAccelerator,
  setSelectedAccelerator,
  acceleratorCounts,
  setAcceleratorCounts,
  selectedPlayer,
  setSelectedPlayer,
  setError,
  sendBoosters,
  isSendingBoosters,
  resetBoosters,
  setSearchName,
  setRecipientId,
  setPlayers,
  setPlayerById,
}) {
  const { data: profile } = useSellerProfile();

  const updateAcceleratorCount = (type, increment) => {
    setAcceleratorCounts((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + increment),
    }));
    setError("");
    resetBoosters();
  };

  return (
    <Paper
      elevation={4}
      sx={{ p: 3, width: 400, maxWidth: "95%", mt: 2, direction: "rtl" }}
    >
      <Typography variant="subtitle1" mb={1} sx={{ textAlign: "right" }}>
        تحويل مسرعات{" "}
        <RocketLaunchIcon sx={{ verticalAlign: "middle", color: "#e53935" }} />
      </Typography>
      <AcceleratorSelector
        selectedAccelerator={selectedAccelerator}
        setSelectedAccelerator={setSelectedAccelerator}
        acceleratorCounts={acceleratorCounts}
      />
      <AcceleratorCounter
        selectedAccelerator={selectedAccelerator}
        acceleratorCounts={acceleratorCounts}
        updateAcceleratorCount={updateAcceleratorCount}
      />
      <TransferButton
        transferType="booster"
        selectedPlayer={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
        setSearchName={setSearchName}
        setRecipientId={setRecipientId}
        setPlayers={setPlayers}
        setPlayerById={setPlayerById}
        setError={setError}
        transferData={{
          recipientId: selectedPlayer?.id,
          type: selectedAccelerator,
          amount: acceleratorCounts[selectedAccelerator],
          note: "",
        }}
        transferFn={sendBoosters}
        isTransferring={isSendingBoosters}
        setAmount={setAcceleratorCounts}
        amount={acceleratorCounts[selectedAccelerator]}
        resetTransfer={resetBoosters}
        successMessage={`تم تحويل ${acceleratorCounts[selectedAccelerator]} مسرع (${selectedAccelerator})${profile?.pricing?.group_pricing?.prices?.[`booster_${selectedAccelerator}`] ? ` (${(profile.pricing.group_pricing.prices[`booster_${selectedAccelerator}`] * acceleratorCounts[selectedAccelerator]).toFixed(2)} ${profile.pricing.group_pricing.currency})` : ''} بنجاح إلى ${selectedPlayer?.username || "اللاعب"}`}
      />
    </Paper>
  );
}

export default AcceleratorTransfer;