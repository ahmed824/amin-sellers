import { Paper, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useSearchLogic } from "../hooks/useSearchLogic";
import SearchModeToggle from "./RecipientSearch/SearchModeToggle";
import SearchInputField from "./RecipientSearch/SearchInputField";
import SearchResultsDisplay from "./RecipientSearch/SearchResultsDisplay";
import SelectedPlayerInfo from "./RecipientSearch/SelectedPlayerInfo";

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
  setPlayers,
  isSearching,
  searchError,
  playerById,
  setPlayerById,
  isFetchingId,
  idError,
  resetTransfer,
  resetBoosters,
  setError,
  handleOpenModal,
}) {
  const {
    handleModeChange,
    handleNameChange,
    handleIdChange,
    handleSelectPlayer,
  } = useSearchLogic({
    recipientMode,
    setRecipientMode,
    setSearchName,
    setRecipientId,
    setSelectedPlayer,
    setPlayers,
    setPlayerById,
    setError,
    resetTransfer,
    resetBoosters,
  });

  const isIdMode = recipientMode === "id";
  const currentValue = isIdMode ? recipientId : searchName;
  const currentResults = isIdMode ? playerById : players;
  const currentLoading = isIdMode ? isFetchingId : isSearching;
  const currentError = isIdMode ? idError : searchError;

  const placeholder = isIdMode
    ? "أدخل معرف اللاعب"
    : "أدخل اسم اللاعب (حرفين على الأقل)";

  return (
    <Paper
      elevation={4}
      sx={{ p: 3, width: 400, maxWidth: "95%", direction: "rtl" }}
    >
      <Typography variant="subtitle1" mb={1} sx={{ textAlign: "right" }}>
        المستلم{" "}
        <PersonIcon sx={{ verticalAlign: "middle", color: "#90caf9" }} />
      </Typography>

      <SearchModeToggle
        recipientMode={recipientMode}
        onModeChange={handleModeChange}
      />

      <SearchInputField
        mode={recipientMode}
        value={currentValue}
        onChange={isIdMode ? handleIdChange : handleNameChange}
        isLoading={currentLoading}
        placeholder={placeholder}
      />

      <SearchResultsDisplay
        mode={recipientMode}
        searchValue={currentValue}
        isLoading={currentLoading}
        error={currentError}
        results={currentResults}
        selectedPlayer={selectedPlayer}
        onSelectPlayer={handleSelectPlayer}
        onOpenModal={handleOpenModal}
      />

      <SelectedPlayerInfo selectedPlayer={selectedPlayer} />
    </Paper>
  );
}

export default RecipientInput;
