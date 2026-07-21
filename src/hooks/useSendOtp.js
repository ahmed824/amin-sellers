import { useMutation } from '@tanstack/react-query';
import { baseUrl } from '../baseUrl';  
import { normalizePhone } from '../utils/phone';

const sendOtp = async (mobile) => {
  const phone = normalizePhone(mobile);
  const response = await fetch(`${baseUrl}/seller/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'فشل في إرسال رمز التحقق');
  }

  return response.json();
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: sendOtp,
    onError: (error) => {
      console.error('خطأ في إرسال رمز التحقق:', error);
    },
  });
};
