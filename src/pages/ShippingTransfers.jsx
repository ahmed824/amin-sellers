import { useEffect, useState } from "react";
import { Stack, Alert } from "@mui/material";
import { useSearchPlayers } from "../hooks/useSearchPlayers";
import { useGetPlayerById } from "../hooks/useGetPlayerById";
import { useGetPlayerProfile } from "../hooks/useGetPlayerProfile";
import { useTokenTransfer } from "../hooks/useTokenTransfer";
import RecipientInput from "../components/RecipientInput";
import TokenTransfer from "../components/TokenTransfer";
import JawakerOfferPurchase from "../components/JawakerOfferPurchase";
import PlayerDetailsModal from "../components/PlayerDetailsModal";

function ShippingTransfers() {
  const [recipientMode, setRecipientMode] = useState("id");
  const [searchName, setSearchName] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [recipientError, setRecipientError] = useState("");
  const [offerError, setOfferError] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalPlayerId, setModalPlayerId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [playerById, setPlayerById] = useState([]);

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
  const {
    mutate: transferTokens,
    isPending: isTransferring,
    isSuccess: isTransferSuccess,
    isError: isTransferError,
    error: transferError,
    reset: resetTransfer,
  } = useTokenTransfer();

  useEffect(() => {
    if (searchedPlayers.length > 0 && !selectedPlayer) {
      setPlayers(searchedPlayers);
    }
  }, [searchedPlayers, selectedPlayer]);

  useEffect(() => {
    if (fetchedPlayerById.length > 0 && !selectedPlayer) {
      setPlayerById(fetchedPlayerById);
    }
  }, [fetchedPlayerById, selectedPlayer]);

  useEffect(() => {
    if (searchError)
      setRecipientError(searchError.message || "خطأ في البحث عن اللاعبين");
    if (idError)
      setRecipientError(idError.message || "خطأ في جلب اللاعب بواسطة المعرف");
    if (isTransferError)
      setTokenError(transferError.message || "خطأ في نقل التوكنز");
  }, [searchError, idError, isTransferError, transferError]);

  const handleOpenModal = (player) => {
    setModalPlayerId(player.id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalPlayerId(null);
  };

  return (
    <Stack
      className="transfer-page"
      spacing={3}
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
        bgcolor: "transparent",
        direction: "rtl",
        position: "relative",
      }}
    >
      {recipientError && (
        <Alert severity="error" sx={{ width: 400, maxWidth: "95%" }}>
          {recipientError}
        </Alert>
      )}
      <RecipientInput
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
        resetTransfer={resetTransfer}
        resetBoosters={() => {}} // Empty function since we don't have boosters here anymore
        setError={setRecipientError}
        handleOpenModal={handleOpenModal}
      />
      {tokenError && (
        <Alert severity="error" sx={{ width: 400, maxWidth: "95%" }}>
          {tokenError}
        </Alert>
      )}
      <TokenTransfer
        tokenAmount={tokenAmount}
        setTokenAmount={setTokenAmount}
        selectedPlayer={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
        recipientMode={recipientMode}
        recipientId={recipientId}
        setError={setTokenError}
        transferTokens={transferTokens}
        isTransferring={isTransferring}
        isTransferSuccess={isTransferSuccess}
        isTransferError={isTransferError}
        transferError={transferError}
        resetTransfer={resetTransfer}
        setSearchName={setSearchName}
        setRecipientId={setRecipientId}
        setPlayers={setPlayers}
        setPlayerById={setPlayerById}
      />
      {offerError && (
        <Alert severity="error" sx={{ width: 400, maxWidth: "95%" }}>
          {offerError}
        </Alert>
      )}
      <JawakerOfferPurchase
        selectedPlayer={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
        setError={setOfferError}
        setSearchName={setSearchName}
        setRecipientId={setRecipientId}
        setPlayers={setPlayers}
        setPlayerById={setPlayerById}
      />
      <PlayerDetailsModal
        open={openModal}
        onClose={handleCloseModal}
        player={modalPlayer}
        isFetchingProfile={isFetchingProfile}
        profileError={profileError}
      />
    </Stack>
  );
}

export default ShippingTransfers;
