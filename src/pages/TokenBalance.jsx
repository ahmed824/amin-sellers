import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Stack, CircularProgress, Alert, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSellerBalanceHistory } from '../hooks/useSellerBalanceHistory';
import { useSellerProfile } from '../hooks/useSellerProfile';
import { useNotifications } from '../components/layout/useNotifications';
import { tokenBalanceColumns } from '../utils/columns';
import PaginationControls from '../components/shared/PaginationControls';
import HistoryHeader from '../components/shared/HistoryHeader';
import HeaderSection from '../components/layout/HeaderSection';
import { toast } from 'react-toastify';

function TokenBalance({ handleLogout }) {
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const { data, isLoading, isError, error } = useSellerBalanceHistory(page);
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
        console.log("Navigating back from TokenBalance");
        navigate(-1);
    };

    if (isProfileLoading) {
        return <CircularProgress size={40} sx={{ display: 'block', mx: 'auto', my: 4 }} />;
    }

    return (
        <Stack alignItems="center" sx={{ minHeight: '100vh', bgcolor: 'transparent', pt: 4, direction: 'rtl' }}>
            <HeaderSection
                title="سجل رصيد التوكن"
                userData={userData}
                handleLogout={handleLogout}
                openNotifications={openNotifications}
                handleOpen={handleOpen}
                handleClose={handleClose}
            />
            <Paper elevation={4} sx={{ p: 2, width: '98%', maxWidth: 1200, mb: 2, bgcolor: '#23222a' }}>
                <HistoryHeader
                    title="سجل رصيد التوكن"
                    icon={<AccountBalanceIcon sx={{ color: '#e53935', verticalAlign: 'middle' }} />}
                    backButton={
                        <IconButton onClick={handleBack} sx={{ color: '#fff' }}>
                            <ArrowBackIcon />
                        </IconButton>
                    }
                />
                {isLoading ? (
                    <CircularProgress size={40} sx={{ display: 'block', mx: 'auto', my: 4 }} />
                ) : isError ? (
                    <Alert severity="error" sx={{ m: 2 }}>
                        {error?.message || 'فشل في جلب سجل رصيد التوكن'}
                    </Alert>
                ) : rows.length === 0 ? (
                    <Alert severity="info" sx={{ m: 2 }}>
                        لا توجد بيانات متاحة لسجل رصيد التوكن
                    </Alert>
                ) : (
                    <>
                        <div style={{ width: '100%' }}>
                            <DataGrid
                                className='token-balance-table'
                                rows={rows}
                                columns={tokenBalanceColumns}
                                pageSizeOptions={[pagination.per_page]}
                                disableRowSelectionOnClick
                                autoHeight
                                sx={{
                                    bgcolor: '#2a2a34',
                                    color: '#fff',
                                    direction: 'rtl',
                                    '& .MuiDataGrid-columnHeaders': {
                                        bgcolor: 'transparent !important', // Transparent background for headers
                                        color: '#fff !important', // White text color for headers
                                        border: "none !important",
                                    },
                                    '& .MuiDataGrid-columnHeaderTitle': {
                                        fontWeight: 600, // Optional: Make header text bold
                                        color: '#fff !important', // Ensure header text is white
                                    },
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
    );
}

export default TokenBalance;