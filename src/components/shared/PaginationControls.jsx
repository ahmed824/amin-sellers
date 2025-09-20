import { Box, Button, Typography } from "@mui/material";

function PaginationControls({ pagination, onPreviousPage, onNextPage, totalRows }) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={2}
    >
      <Typography variant="body2" color="#fff">
        عرض {totalRows} من {pagination.total} تحويل
      </Typography>
      <Box>
        <Button
          variant="outlined"
          sx={{ color: "#fff", borderColor: "#a71d2a", mr: 1 }}
          disabled={pagination.current_page === 1}
          onClick={onPreviousPage}
        >
          السابق
        </Button>
        <Button
          variant="outlined"
          sx={{ color: "#fff", borderColor: "#a71d2a" }}
          disabled={pagination.current_page === pagination.last_page}
          onClick={onNextPage}
        >
          التالي
        </Button>
      </Box>
    </Box>
  );
}

export default PaginationControls;