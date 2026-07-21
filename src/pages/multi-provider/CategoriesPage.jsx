import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
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

  const groups = (categories || []).map((group) => {
    if (Array.isArray(group.categories)) {
      return group;
    }

    return {
      id: "legacy",
      name: "التصنيفات",
      products_count: categories.reduce((sum, category) => sum + (category.products_count || 0), 0),
      categories,
    };
  });

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        bgcolor: "transparent",
        pt: 4,
        direction: "rtl",
        px: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
        {groups && groups.length > 0 ? (
          <Stack spacing={6}>
            {groups.map((group) => (
              <Box key={group.id ?? group.slug}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    mb: 3,
                  }}
                >
                  {group.icon_url && (
                    <Box
                      component="img"
                      src={group.icon_url}
                      alt={group.name}
                      sx={{
                        width: 84,
                        height: 84,
                        objectFit: "cover",
                        borderRadius: 3,
                        border: "1px solid #3d3d45",
                        mb: 1.5,
                      }}
                    />
                  )}
                  <Typography variant="h5" sx={{ color: "#fff", fontWeight: 800 }}>
                    {group.name}
                  </Typography>
                  <Chip
                    label={`${group.categories_count || group.categories?.length || 0} تصنيف - ${group.products_count || 0} منتج`}
                    size="small"
                    sx={{ mt: 1, bgcolor: "#1d3b2a", color: "#00e676", fontWeight: 700 }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, minmax(0, 1fr))",
                      sm: "repeat(3, minmax(0, 1fr))",
                      md: "repeat(4, minmax(0, 1fr))",
                      lg: "repeat(5, minmax(0, 1fr))",
                    },
                    gap: 2,
                  }}
                >
                  {(group.categories || []).map((category) => (
                    <Card
                      key={category.id}
                      sx={{
                        bgcolor: "#2d2d35",
                        color: "#fff",
                        border: "1px solid #3d3d45",
                        transition: "transform 0.2s, border-color 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          borderColor: "#00e676",
                        },
                      }}
                    >
                      <CardActionArea onClick={() => handleCategoryClick(category.id)}>
                        <CardMedia
                          sx={{
                            height: 120,
                            bgcolor: "#202028",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {category.icon_image_url ? (
                            <Box
                              component="img"
                              src={category.icon_image_url}
                              alt={category.name}
                              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <CategoryIcon fontSize="small" />
                          )}
                        </CardMedia>
                        <CardContent sx={{ textAlign: "center", minHeight: 86 }}>
                          <Typography sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }} noWrap>
                            {category.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#aaa" }}>
                            {category.products_count || 0} منتج
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  ))}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              لا توجد فئات متاحة
            </Typography>
          </Box>
        )}
      </Box>
    </Stack>
  );
}

export default CategoriesPage;
