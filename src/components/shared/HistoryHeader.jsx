import { Box, Typography } from '@mui/material';

function HistoryHeader({ title, icon, backButton }) {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
            sx={{ direction: 'rtl' }}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Box display="flex" alignItems="center">
                    {icon && <Box sx={{ ml: 1 }}>{icon}</Box>}
                    <Typography variant="h6" fontWeight={700} color="#fff">
                        {title}
                    </Typography>
                </Box>
                {backButton && <Box sx={{ ml: 1 }}>{backButton}</Box>}
            </Box>
        </Box>
    );
}

export default HistoryHeader;