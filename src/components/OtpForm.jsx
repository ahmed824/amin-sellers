import { TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';

function OtpForm({ mobile, setMobile, otp, setOtp, error, onSubmit, onBack, isLoading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{10,15}$/.test(mobile)) {
      error('يرجى إدخال رقم جوال صحيح');
      return;
    }
    if (!/^\d{4,6}$/.test(otp)) {
      error('يرجى إدخال رمز التحقق المكون من 4 إلى 6 أرقام');
      return;
    }
    onSubmit(e);
  };

  return (
    <>
      <Typography variant="h5" mb={2} align="center" color="#fff" className="login-title">
        رمز التحقق
      </Typography>
      <Typography variant="body2" mb={3} align="center" color="#bbb">
        أدخل رمز التحقق المرسل إلى رقم الجوال
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="tel"
          label="رقم الجوال"
          placeholder="05xxxxxxxxx"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
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
        <TextField
          fullWidth
          type="text"
          label="رمز التحقق"
          placeholder="1234"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          margin="normal"
          className="login-input"
          inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: 18, letterSpacing: 8 } }}
          InputProps={{
            startAdornment: (
              <LockIcon sx={{ color: '#90caf9', mr: 1 }} />
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
              جاري التحقق...
            </>
          ) : (
            'تأكيد'
          )}
        </Button>
        <Button 
          fullWidth 
          variant="text" 
          onClick={onBack} 
          className="login-text-button"
          sx={{ mt: 1 }}
          disabled={isLoading}
        >
          العودة لتغيير الرقم
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </form>
    </>
  );
}

export default OtpForm;