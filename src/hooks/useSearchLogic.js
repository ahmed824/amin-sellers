import { useCallback } from "react";

export const useSearchLogic = ({
  recipientMode,
  setRecipientMode,
  setSearchName,
  setRecipientId,
  selectedPlayer, // 🔥 you forgot to destructure this
  setSelectedPlayer,
  setPlayers,
  setPlayerById,
  setError,
  resetTransfer,
  resetBoosters,
}) => {
  // Clear all search states and selections (but preserve selected player when needed)
  const clearAllStates = useCallback(
    (preserveSelection = false) => {
      if (!preserveSelection) {
        setSelectedPlayer(null);
      }
      setError("");
      resetTransfer();
      resetBoosters();
    },
    [setSelectedPlayer, setError, resetTransfer, resetBoosters]
  );

  // Handle search mode change
  const handleModeChange = useCallback(
    (event, newMode) => {
      if (newMode && newMode !== recipientMode) {
        setRecipientMode(newMode);

        // Only clear states if no player is selected
        if (!selectedPlayer) {
          clearAllStates();
        }

        // Clear search inputs
        setSearchName("");
        setRecipientId("");

        // Clear search results but keep selected player if exists
        setPlayers(selectedPlayer ? [selectedPlayer] : []);
        setPlayerById(selectedPlayer ? [selectedPlayer] : []);
      }
    },
    [
      recipientMode,
      setRecipientMode,
      selectedPlayer, // ✅ now it’s defined
      clearAllStates,
      setSearchName,
      setRecipientId,
      setPlayers,
      setPlayerById,
    ]
  );

  // Handle name search input change
  const handleNameChange = useCallback(
    (e) => {
      const name = e.target.value;
      setSearchName(name);

      // Clear states when input changes
      clearAllStates();

      if (name.length < 2) {
        setPlayers([]);
      }
    },
    [setSearchName, clearAllStates, setPlayers]
  );

  // Handle ID search input change
  const handleIdChange = useCallback(
    (e) => {
      const id = e.target.value;
      setRecipientId(id);

      clearAllStates();

      if (id.length === 0) {
        setPlayerById([]);
      }
    },
    [setRecipientId, clearAllStates, setPlayerById]
  );

  // Handle player selection
  const handleSelectPlayer = useCallback(
    (player) => {
      setSelectedPlayer(player);
      setError("");

      if (recipientMode === "name") {
        setPlayers([player]);
      } else {
        setPlayerById([player]);
      }
    },
    [setSelectedPlayer, setError, recipientMode, setPlayers, setPlayerById]
  );

  return {
    clearAllStates,
    handleModeChange,
    handleNameChange,
    handleIdChange,
    handleSelectPlayer,
  };
};
