import { useParams, useNavigate } from "react-router-dom";
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
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useProducts } from "../../hooks/useProducts";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

function ProductsPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { data: products, isLoading, isError, error } = useProducts(
    categoryId,
    !!categoryId
  );

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
        {error?.message || "فشل في جلب المنتجات"}
      </Alert>
    );
  }

  const handleProductClick = (productId) => {
    navigate(`/multi-provider/product/${productId}/order`);
  };

  const handleBack = () => {
    navigate("/multi-provider");
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
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ color: "#fff", mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{ color: "#fff", fontWeight: 700, flexGrow: 1 }}
          >
            المنتجات
          </Typography>
        </Box>

        {products && products.length > 0 ? (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onClick={() => handleProductClick(product.id)}
                >
                  <CardMedia
                    sx={{
                      height: 180,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#3d3d45",
                    }}
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <ShoppingBagIcon sx={{ fontSize: 60, color: "#00e676" }} />
                    )}
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {product.name}
                    </Typography>
                    {product.description && (
                      <Typography
                        variant="body2"
                        sx={{ color: "#aaa", mb: 1 }}
                        noWrap
                      >
                        {product.description}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: "#00e676" }}>
                      {product.variants_count || 0} متغير متاح
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              لا توجد منتجات متاحة في هذه الفئة
            </Typography>
          </Box>
        )}
      </Paper>
    </Stack>
  );
}

export default ProductsPage;

