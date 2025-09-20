import {
    Alert,
    Button,
    Card,
    CardContent,
    CardMedia,
    Modal,
    Stack,
    Typography,
    CircularProgress,
  } from "@mui/material";
  
  function PlayerDetailsModal({
    open,
    onClose,
    player,
    isFetchingProfile,
    profileError,
  }) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Card
          sx={{
            maxWidth: 400,
            width: "90%",
            bgcolor: "#23222a",
            color: "#fff",
            direction: "rtl",
            p: 2,
          }}
        >
          {isFetchingProfile ? (
            <CircularProgress
              size={24}
              sx={{ display: "block", mx: "auto", my: 4 }}
            />
          ) : profileError ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {profileError.message || "فشل في جلب ملف اللاعب"}
            </Alert>
          ) : player ? (
            <>
              <CardMedia
                component="img"
                image={player.avatar_url || "/images/default-avatar.png"}
                alt={player.username}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  mx: "auto",
                  mb: 2,
                }}
              />
              <CardContent>
                <Typography variant="h6" textAlign="center" mb={2}>
                  {player.username}
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>المعرف:</strong> {player.id}
                  </Typography>
                  <Typography variant="body2">
                    <strong>المستوى:</strong> {player.level}
                  </Typography>
                  <Typography variant="body2">
                    <strong>الدولة:</strong> {player.country || "غير محدد"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>المجموعة:</strong> {player.group || "غير منتمي"}
                  </Typography>
                  {/* <Typography variant="body2">
                    <strong>الشارات:</strong>{" "}
                    {player.badges?.length > 0
                      ? player.badges.join(", ")
                      : "لا توجد شارات"}
                  </Typography> */}
                  <Typography variant="body2">
                    <strong>نقاط الخبرة:</strong> {player.total_exp_points || 0}
                  </Typography>
                  <Typography variant="body2">
                    <strong>عدد الأصدقاء:</strong> {player.friends_count || 0}
                  </Typography>
                </Stack>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, bgcolor: "#a71d2a" }}
                  onClick={onClose}
                >
                  إغلاق
                </Button>
              </CardContent>
            </>
          ) : (
            <Alert severity="info" sx={{ m: 2 }}>
              لا توجد بيانات للاعب
            </Alert>
          )}
        </Card>
      </Modal>
    );
  }
  
  export default PlayerDetailsModal;