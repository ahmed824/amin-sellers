import { Box, Button, CardMedia, Typography } from "@mui/material";

function SearchResultItem({ player, selectedPlayer, onSelect, onOpenModal }) {
  return (
    <Box
      sx={{
        p: 1,
        bgcolor: selectedPlayer?.id === player.id ? "#a71d2a" : "#23222a",
        borderRadius: 1,
        border: selectedPlayer?.id === player.id ? "2px solid #fff" : "1px solid #444",
        cursor: "pointer",
      }}
      onClick={() => onSelect(player)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CardMedia
            component="img"
            image={player.avatar_url || "/images/default-avatar.png"}
            alt={player.username}
            sx={{ width: 40, height: 40, borderRadius: "50%" }}
          />
          <Box>
            <Typography
              variant="body2"
              fontWeight="bold"
              color={selectedPlayer?.id === player.id ? "#fff" : "inherit"}
            >
              {player.username}
            </Typography>
            <Typography
              variant="caption"
              color={selectedPlayer?.id === player.id ? "#ddd" : "text.secondary"}
            >
              المستوى: {player.level}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderColor: selectedPlayer?.id === player.id ? "#fff" : "#a71d2a",
            color: selectedPlayer?.id === player.id ? "#fff" : "#a71d2a",
            fontSize: "12px",
          }}
          onClick={() => onOpenModal(player)}
        >
          عن اللاعب
        </Button>
      </Box>
    </Box>
  );
}

export default SearchResultItem;