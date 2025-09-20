import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Stack, CircularProgress, Alert, IconButton, TextField, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import StarsIcon from '@mui/icons-material/Stars';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useBoostersBalanceHistory } from '../hooks/useBoostersBalanceHistory';
import { boosterBalanceColumns } from '../utils/columns';
import PaginationControls from '../components/shared/PaginationControls';
import HistoryHeader from '../components/shared/HistoryHeader';
import HeaderSection from '../components/layout/HeaderSection';
import { useSellerProfile } from '../hooks/useSellerProfile';
import { useNotifications } from '../components/layout/useNotifications';
import { toast } from 'react-toastify';

function BoostersBalance({ handleLogout }) {
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useBoostersBalanceHistory(page, fromDate, toDate);
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useSellerProfile();
  const { openNotifications, handleOpen, handleClose } = useNotifications(() => {
    console.log("Notifications modal opened");
  });

  const userData = useMemo(
    () => ({
      name: profile?.name || "مستخدم غير معروف",
      image: profile?.image || "/images/avatar.png",
    }),
    [profile]
  );

  useEffect(() => {
    if (isProfileError) {
      const errorMessage = profileError?.message || "فشل في جلب بيانات المستخدم";
      toast.error(errorMessage);
      if (profileError?.message?.includes("Unauthorized") || profileError?.status === 401) {
        handleLogout();
      }
    }
  }, [isProfileError, profileError, handleLogout]);

  const rows = data?.rows || [];
  const pagination = data?.pagination || {
    current_page: 1,
    last_page: 1,
    total: rows.length,
    per_page: 15,
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < pagination.last_page) {
      setPage((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    console.log("Navigating back from BoostersBalance");
    navigate(-1);
  };

  if (isProfileLoading) {
    return <CircularProgress size={40} sx={{ display: 'block', mx: 'auto', my: 4 }} />;
  }

  return (
    <>
      <HeaderSection
        title="سجل رصيد المسرعات"
        userData={userData}
        handleLogout={handleLogout}
        openNotifications={openNotifications}
        handleOpen={handleOpen}
        handleClose={handleClose}
        style={{ marginBottom: '12px' }}
      />
      <Stack alignItems="center" sx={{ minHeight: '100vh', bgcolor: 'transparent', pt: 4, direction: 'rtl' }}>
        <Paper elevation={4} sx={{ p: 2, width: '98%', maxWidth: 1200, mb: 2, bgcolor: '#23222a' }}>
          <HistoryHeader
            title="سجل رصيد المسرعات"
            icon={<StarsIcon sx={{ color: '#e53935', verticalAlign: 'middle' }} />}
            backButton={
              <IconButton onClick={handleBack} sx={{ color: '#fff' }}>
                <ArrowBackIcon />
              </IconButton>
            }
          />
          <Box sx={{ mb: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <TextField
              type="date"
              label="من"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ bgcolor: '#2a2a34', color: '#fff', '& .MuiInputBase-input': { color: '#fff' } }}
            />
            <TextField
              type="date"
              label="إلى"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ bgcolor: '#2a2a34', color: '#fff', '& .MuiInputBase-input': { color: '#fff' } }}
            />
          </Box>
          {isLoading ? (
            <CircularProgress size={40} sx={{ display: 'block', mx: 'auto', my: 4 }} />
          ) : isError ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error?.message || 'فشل في جلب سجل رصيد المسرعات'}
            </Alert>
          ) : rows.length === 0 ? (
            <Alert severity="info" sx={{ m: 2 }}>
              لا توجد بيانات متاحة لسجل رصيد المسرعات
            </Alert>
          ) : (
            <>
              <div style={{ width: '100%' }}>
                <DataGrid
                  rows={rows}
                  columns={boosterBalanceColumns}
                  pageSizeOptions={[pagination.per_page]}
                  disableRowSelectionOnClick
                  autoHeight
                  sx={{
                    bgcolor: '#2a2a34',
                    color: '#fff',
                    direction: 'rtl',
                    '& .MuiDataGrid-columnHeaders': { bgcolor: '#23222a' },
                    '& .active .MuiDataGrid-cell': {
                      bgcolor: '#ffcdd2 !important',
                      color: '#000 !important',
                    },
                  }}
                />
              </div>
              <PaginationControls
                pagination={pagination}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                totalRows={pagination.total}
              />
            </>
          )}
        </Paper>
      </Stack>
    </>
  );
}

export default BoostersBalance;