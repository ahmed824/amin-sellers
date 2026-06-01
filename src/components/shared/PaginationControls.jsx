import { Box, Button, Typography } from "@mui/material";

function PaginationControls({ pagination, onPreviousPage, onNextPage, totalRows }) {
  // Guard against undefined pagination
  if (!pagination) {
    return null;
  }

  const currentPage = pagination.current_page || 1;
  const lastPage = pagination.last_page || 1;
  const total = pagination.total || 0;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={2}
    >
      <Typography variant="body2" color="#fff">
        عرض {totalRows || 0} من {total} طلب
      </Typography>
      <Box>
        <Button
          variant="outlined"
          sx={{ color: "#fff", borderColor: "#a71d2a", mr: 1 }}
          disabled={currentPage === 1}
          onClick={onPreviousPage}
        >
          السابق
        </Button>
        <Button
          variant="outlined"
          sx={{ color: "#fff", borderColor: "#a71d2a" }}
          disabled={currentPage === lastPage}
          onClick={onNextPage}
        >
          التالي
        </Button>
      </Box>
    </Box>
  );
}

export default PaginationControls;