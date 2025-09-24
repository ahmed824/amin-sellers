import { useEffect, useState } from "react";
import { Stack, Alert } from "@mui/material";
import { useSearchPlayers } from "../hooks/useSearchPlayers";
import { useGetPlayerById } from "../hooks/useGetPlayerById";
import { useGetPlayerProfile } from "../hooks/useGetPlayerProfile";
import { useSendBoosters } from "../hooks/useSendBoosters";
import RecipientInput from "../components/RecipientInput";
import AcceleratorTransfer from "../components/AcceleratorTransfer";
import PlayerDetailsModal from "../components/PlayerDetailsModal";

function AcceleratorTransfers() {
  const [recipientMode, setRecipientMode] = useState("id");
  const [searchName, setSearchName] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [recipientError, setRecipientError] = useState("");
  const [acceleratorError, setAcceleratorError] = useState("");
  const [selectedAccelerator, setSelectedAccelerator] = useState("red");
  const [acceleratorCounts, setAcceleratorCounts] = useState({
    black: 0,
    blue: 0,
    red: 0,
  });
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
    mutate: sendBoosters,
    isPending: isSendingBoosters,
    isSuccess: isBoostersSuccess,
    isError: isBoostersError,
    error: boostersError,
    reset: resetBoosters,
  } = useSendBoosters();

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
    if (isBoostersError)
      setAcceleratorError(boostersError.message || "خطأ في إرسال المسرعات");
  }, [searchError, idError, isBoostersError, boostersError]);

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
      className="accelerator-transfer-page"
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
        resetTransfer={resetBoosters}
        resetBoosters={resetBoosters}
        setError={setRecipientError}
        handleOpenModal={handleOpenModal}
      />
      {acceleratorError && (
        <Alert severity="error" sx={{ width: 400, maxWidth: "95%" }}>
          {acceleratorError}
        </Alert>
      )}
      <AcceleratorTransfer
        selectedAccelerator={selectedAccelerator}
        setSelectedAccelerator={setSelectedAccelerator}
        acceleratorCounts={acceleratorCounts}
        setAcceleratorCounts={setAcceleratorCounts}
        selectedPlayer={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
        setError={setAcceleratorError}
        sendBoosters={sendBoosters}
        isSendingBoosters={isSendingBoosters}
        isBoostersSuccess={isBoostersSuccess}
        isBoostersError={isBoostersError}
        boostersError={boostersError}
        resetBoosters={resetBoosters}
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

export default AcceleratorTransfers;
