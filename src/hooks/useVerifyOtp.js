import { useMutation } from '@tanstack/react-query';
import { setAuthToken } from "../utils/token"
import { baseUrl } from '../baseUrl';
import { normalizePhone } from '../utils/phone';

const verifyOtp = async ({ mobile, otp }) => {
  const phone = normalizePhone(mobile);
  const response = await fetch(`${baseUrl}/seller/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone, otp }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'فشل في التحقق من رمز التحقق');
  }

  const data = await response.json();
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,
    onError: (error) => {
      console.error('خطأ في التحقق من رمز التحقق:', error);
    },
  });
};
