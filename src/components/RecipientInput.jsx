import {
  Alert,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SearchResultItem from "./SearchResultItem";

function RecipientInput({
  recipientMode,
  setRecipientMode,
  searchName,
  setSearchName,
  recipientId,
  setRecipientId,
  selectedPlayer,
  setSelectedPlayer,
  players,
  setPlayers, // New prop to update players list
  isSearching,
  searchError,
  playerById,
  setPlayerById, // New prop to update playerById list
  isFetchingId,
  idError,
  resetTransfer,
  resetBoosters,
  setError,
  handleOpenModal,
}) {
  const handleNameChange = (e) => {
    const name = e.target.value;
    setSearchName(name);
    setSelectedPlayer(null);
    setError("");
    resetTransfer();
    resetBoosters();
    setPlayers([]); // Reset players list when typing new search
  };

  const handleIdChange = (e) => {
    const id = e.target.value;
    setRecipientId(id);
    setSelectedPlayer(null);
    setError("");
    resetTransfer();
    resetBoosters();
    setPlayerById([]); // Reset playerById list when typing new ID
    if (playerById.length > 0 && !isFetchingId && !idError) {
      setSelectedPlayer(playerById[0]);
      setPlayerById([playerById[0]]); // Keep only the selected player
    }
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
    if (recipientMode === "name") {
      setPlayers([player]); // Keep only the selected player in players list
    } else {
      setPlayerById([player]); // Keep only the selected player in playerById list
    }
  };

  const renderIdSearchResult = () => {
    if (isFetchingId) {
      return (
        <CircularProgress
          size={24}
          sx={{ mt: 2, display: "block", mx: "auto" }}
        />
      );
    }
    if (idError) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {idError.message || "معرف اللاعب غير صحيح"}
        </Alert>
      );
    }
    if (playerById.length === 0 && !isFetchingId) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          لم يتم العثور على لاعب بهذا المعرف
        </Alert>
      );
    }
    if (playerById.length === 1 || selectedPlayer) {
      return (
        <SearchResultItem
          player={selectedPlayer || playerById[0]}
          selectedPlayer={selectedPlayer}
          onSelect={handleSelectPlayer}
          onOpenModal={handleOpenModal}
        />
      );
    }
    return null;
  };

  const renderNameSearchResult = () => {
    if (isSearching) {
      return (
        <CircularProgress
          size={24}
          sx={{ mt: 2, display: "block", mx: "auto" }}
        />
      );
    }
    if (searchError) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {searchError.message || "حدث خطأ أثناء البحث"}
        </Alert>
      );
    }
    if (players.length === 0 && searchName.length >= 2) {
      return (
        <CircularProgress
          size={24}
          sx={{ mt: 2, display: "block", mx: "auto" }}
        />
      );
    }
    if (players.length > 0) {
      return (
        <Stack spacing={1} sx={{ mt: 2 }}>
          {(selectedPlayer ? [selectedPlayer] : players).map((player) => (
            <SearchResultItem
              key={player.id}
              player={player}
              selectedPlayer={selectedPlayer}
              onSelect={handleSelectPlayer}
              onOpenModal={handleOpenModal}
            />
          ))}
        </Stack>
      );
    }
    return null;
  };

  return (
    <Paper
      elevation={4}
      sx={{ p: 3, width: 400, maxWidth: "95%", direction: "rtl" }}
    >
      <Typography variant="subtitle1" mb={1} sx={{ textAlign: "right" }}>
        المستلم{" "}
        <PersonIcon sx={{ verticalAlign: "middle", color: "#90caf9" }} />
      </Typography>
      <ToggleButtonGroup
        exclusive
        value={recipientMode}
        onChange={(e, value) => value && setRecipientMode(value)}
        sx={{ mb: 2, width: "100%", flexDirection: "row-reverse" }}
      >
        <ToggleButton
          value="name"
          sx={{
            flex: 1,
            bgcolor: recipientMode === "name" ? "#000 !important" : "#18171d",
            color: recipientMode === "name" ? "#fff !important" : "#fff",
            border:
              recipientMode === "name"
                ? "2px solid #fff !important"
                : "1px solid #444",
            zIndex: recipientMode === "name" ? 1000 : "auto",
            fontWeight: recipientMode === "name" ? 600 : "normal",
          }}
        >
          اسم اللاعب
        </ToggleButton>
        <ToggleButton
          value="id"
          sx={{
            flex: 1,
            bgcolor: recipientMode === "id" ? "#000 !important" : "#18171d",
            color: recipientMode === "id" ? "#fff !important" : "#fff",
            border:
              recipientMode === "id"
                ? "2px solid #fff !important"
                : "1px solid #444",
            zIndex: recipientMode === "id" ? 1000 : "auto",
            fontWeight: recipientMode === "id" ? 600 : "normal",
          }}
        >
          رقم اللاعب
        </ToggleButton>
      </ToggleButtonGroup>
      {recipientMode === "name" ? (
        <>
          <TextField
            fullWidth
            placeholder="أدخل اسم اللاعب"
            value={searchName}
            onChange={handleNameChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#90caf9" }} />
                </InputAdornment>
              ),
              endAdornment: isSearching ? (
                <CircularProgress color="inherit" size={20} />
              ) : null,
              sx: { direction: "rtl", textAlign: "right" },
            }}
            inputProps={{ style: { textAlign: "right", direction: "rtl" } }}
          />
          {renderNameSearchResult()}
        </>
      ) : (
        <>
          <TextField
            fullWidth
            placeholder="أدخل معرف اللاعب"
            value={recipientId}
            onChange={handleIdChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#90caf9" }} />
                </InputAdornment>
              ),
              endAdornment: isFetchingId ? (
                <CircularProgress color="inherit" size={20} />
              ) : null,
              sx: { direction: "rtl", textAlign: "right" },
            }}
            inputProps={{ style: { textAlign: "right", direction: "rtl" } }}
          />
          {renderIdSearchResult()}
        </>
      )}
      {selectedPlayer && (
        <Typography
          variant="caption"
          color="success.main"
          sx={{ mt: 1, display: "block", textAlign: "right" }}
        >
          تم اختيار: {selectedPlayer.username} (المعرف: {selectedPlayer.id})
        </Typography>
      )}
    </Paper>
  );
}

export default RecipientInput;
