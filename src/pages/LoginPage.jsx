import { useState } from 'react';
import { useSendOtp } from '../hooks/useSendOtp';
import { useVerifyOtp } from '../hooks/useVerifyOtp';
import LoginForm from '../components/LoginForm';
import OtpForm from '../components/OtpForm';
import LoginLayout from '../components/LoginLayout';

function LoginPage({ onLogin }) {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');

  const { mutate: sendOtp, isLoading: isSendingOtp } = useSendOtp();
  const { mutate: verifyOtp, isLoading: isVerifyingOtp } = useVerifyOtp();

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{10,15}$/.test(mobile)) {
      setError('يرجى إدخال رقم جوال صحيح');
      return;
    }

    sendOtp(mobile, {
      onSuccess: () => {
        setError('');
        setShowOtp(true);
      },
      onError: (error) => {
        setError(error.message || 'حدث خطأ أثناء إرسال رمز التحقق');
      },
    });
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    verifyOtp({ mobile, otp }, {
      onSuccess: () => {
        setError('');
        onLogin(mobile, otp);
      },
      onError: (error) => {
        setError(error.message || 'حدث خطأ أثناء التحقق من رمز التحقق');
      },
    });
  };

  const handleBackToMobile = () => {
    setShowOtp(false);
    setOtp('');
    setError('');
  };

  return (
    <LoginLayout>
      {showOtp ? (
        <OtpForm 
          mobile={mobile}
          setMobile={setMobile}
          otp={otp}
          setOtp={setOtp}
          error={error}
          onSubmit={handleOtpSubmit}
          onBack={handleBackToMobile}
          isLoading={isVerifyingOtp}
        />
      ) : (
        <LoginForm 
          mobile={mobile}
          setMobile={setMobile}
          error={error}
          onSubmit={handleMobileSubmit}
          isLoading={isSendingOtp}
        />
      )}
    </LoginLayout>
  );
}

export default LoginPage;