import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import { useCategories } from "../../hooks/useCategories";
import CategoryIcon from "@mui/icons-material/Category";

function CategoriesPage() {
  const navigate = useNavigate();
  const { data: categories, isLoading, isError, error } = useCategories();

  if (isLoading) {
    return (
      <CircularProgress
        size={40}
        sx={{ display: "block", mx: "auto", my: 4 }}
      />
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error?.message || "فشل في جلب الفئات"}
      </Alert>
    );
  }

  const handleCategoryClick = (categoryId) => {
    navigate(`/multi-provider/category/${categoryId}`);
  };

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        bgcolor: "transparent",
        pt: 4,
        direction: "rtl",
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{ p: 3, width: "100%", maxWidth: 1200, mx: "auto", bgcolor: "#23222a" }}
      >
        <Typography
          variant="h4"
          sx={{ color: "#fff", mb: 3, textAlign: "center", fontWeight: 700 }}
        >
          الفئات
        </Typography>

        {categories && categories.length > 0 ? (
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                    bgcolor: "#2d2d35",
                    color: "#fff",
                  }}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardMedia
                    sx={{
                      height: 140,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#3d3d45",
                    }}
                  >
                    {category.icon_image_url ? (
                      <img
                        src={category.icon_image_url}
                        alt={category.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <CategoryIcon sx={{ fontSize: 60, color: "#00e676" }} />
                    )}
                  </CardMedia>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {category.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#aaa" }}>
                      {category.products_count || 0} منتج
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              لا توجد فئات متاحة
            </Typography>
          </Box>
        )}
      </Paper>
    </Stack>
  );
}

export default CategoriesPage;

