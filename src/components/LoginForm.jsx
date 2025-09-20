import { TextField, Button, Typography, Alert } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import CircularProgress from '@mui/material/CircularProgress';

function LoginForm({ mobile, setMobile, error, onSubmit, isLoading }) {
  return (
    <>
      <Typography variant="h5" mb={2} align="center" color="#fff" className="login-title">
        تسجيل الدخول
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          fullWidth
          type="tel"
          label="رقم الجوال"
          placeholder="05xxxxxxxxx"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          required
          margin="normal"
          className="login-input"
          inputProps={{ maxLength: 15 }}
          InputProps={{
            startAdornment: (
              <PhoneIcon sx={{ color: '#90caf9', mr: 1 }} />
            ),
          }}
          disabled={isLoading}
        />
        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          type="submit" 
          className="login-button"
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress size={24} sx={{ color: '#fff', mr: 1 }} />
              جاري الإرسال...
            </>
          ) : (
            'إرسال رمز التحقق'
          )}
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </form>
    </>
  );
}

export default LoginForm;