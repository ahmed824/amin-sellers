import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, CircularProgress, Alert, Modal, Card, CardContent, Divider, Button, IconButton } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CloseIcon from '@mui/icons-material/Close';
import { useNotifications, useMarkAllNotificationsAsRead } from '../hooks/useNotifications';
import PaginationControls from './shared/PaginationControls';

function NotificationsModal({ open, onClose }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useNotifications(page);
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();

  const rows = data?.rows || [];
  const pagination = data?.pagination || { current_page: 1, last_page: 1, total: 0, per_page: 15 };

  const handlePreviousPage = () => {
    if (pagination.current_page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.current_page < pagination.last_page) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (open) {
      markAllAsRead();
    }
  }, [open, markAllAsRead]);

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ width: '90%', maxWidth: 800, bgcolor: '#23222a', p: 3, direction: 'rtl', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={700} color="#fff">
            الإشعارات <ReceiptIcon sx={{ color: '#90caf9', verticalAlign: 'middle' }} />
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        {isLoading || isMarkingAll ? (
          <CircularProgress size={40} sx={{ display: 'block', mx: 'auto', my: 4 }} />
        ) : isError ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {error?.message || 'فشل في جلب الإشعارات'}
          </Alert>
        ) : (
          <>
            <Stack spacing={2}>
              {rows.length === 0 ? (
                <Typography color="#fff" textAlign="center">
                  لا توجد إشعارات
                </Typography>
              ) : (
                rows.map((row) => (
                  <Card
                    key={row.id}
                    sx={{
                      bgcolor: row.read ? '#2a2a34' : '#3a1c1c', // Different background for read/unread
                      border: row.read ? '1px solid #444' : '1px solid #a71d2a', // Different border color
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: row.read ? '#33333d' : '#5a2d2d', // Hover effect
                        transition: 'background-color 0.2s',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="body1" color="#fff" fontWeight={600} mb={1}>
                        {row.title}
                      </Typography>
                      <Typography variant="body2" color="#bbb" mb={1}>
                        الملاحظة: {row.note}
                      </Typography>
                      <Typography variant="body2" color="#bbb" mb={1}>
                        التاريخ: {row.date} | الوقت: {row.time}
                      </Typography>
                      <Divider sx={{ bgcolor: '#444', my: 1 }} />
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
            <PaginationControls
              pagination={pagination}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
              totalRows={rows.length}
            />
            <Button
              variant="contained"
              sx={{ mt: 2, bgcolor: '#a71d2a', width: '100%' }}
              onClick={onClose}
            >
              إغلاق
            </Button>
          </>
        )}
      </Paper>
    </Modal>
  );
}

export default NotificationsModal;