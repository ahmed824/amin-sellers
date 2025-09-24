import { Alert, CircularProgress, Stack, Typography } from "@mui/material";
import SearchResultItem from "../SearchResultItem";
import { memo } from "react";

const SearchResultsDisplay = memo(
  ({
    mode,
    searchValue,
    isLoading,
    error,
    results,
    selectedPlayer,
    onSelectPlayer,
    onOpenModal,
  }) => {
    // Don't show anything if no search value
    if (
      !searchValue ||
      searchValue.length === 0 ||
      (mode === "name" && searchValue.length < 2)
    ) {
      return null;
    }

    // Show loading spinner
    if (isLoading) {
      return (
        <CircularProgress
          size={24}
          sx={{ mt: 2, display: "block", mx: "auto" }}
        />
      );
    }

    // Show error
    if (error) {
      const errorMessage =
        mode === "id"
          ? error.message || "معرف اللاعب غير صحيح"
          : error.message || "حدث خطأ أثناء البحث";

      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      );
    }

    // Show no results found
    if (results.length === 0 && !isLoading && searchValue.length > 0) {
      const noResultsMessage =
        mode === "id"
          ? "لم يتم العثور على لاعب بهذا المعرف"
          : "لم يتم العثور على لاعبين بهذا الاسم";

      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          {noResultsMessage}
        </Alert>
      );
    }

    // Show search results
    if (results.length > 0) {
      // For ID search, show selected player or first result
      if (mode === "id") {
        const playerToShow = selectedPlayer || results[0];
        return (
          <SearchResultItem
            player={playerToShow}
            selectedPlayer={selectedPlayer}
            onSelect={onSelectPlayer}
            onOpenModal={onOpenModal}
            isSelected={!!selectedPlayer}
          />
        );
      }

      // For name search, show multiple results or selected player
      const playersToShow = selectedPlayer
        ? [selectedPlayer]
        : results.slice(0, 5); // Limit to 5 results

      return (
        <Stack spacing={1} sx={{ mt: 2 }}>
          {playersToShow.map((player) => (
            <SearchResultItem
              key={player.id}
              player={player}
              selectedPlayer={selectedPlayer}
              onSelect={onSelectPlayer}
              onOpenModal={onOpenModal}
              isSelected={selectedPlayer?.id === player.id}
            />
          ))}
          {!selectedPlayer && results.length > 5 && (
            <Typography
              variant="caption"
              sx={{ textAlign: "center", color: "text.secondary" }}
            >
              عرض أول 5 نتائج من {results.length} نتيجة
            </Typography>
          )}
        </Stack>
      );
    }

    return null;
  }
);

SearchResultsDisplay.displayName = "SearchResultsDisplay";
export default SearchResultsDisplay;
