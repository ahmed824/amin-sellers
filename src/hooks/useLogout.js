import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../baseUrl';
import { getAuthToken } from '../utils/token';

const logout = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('لم يتم العثور على رمز التوثيق. الرجاء تسجيل الدخول مرة أخرى.');
  }

  const response = await fetch(`${baseUrl}/seller/token-transfers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'فشل في تسجيل الخروج');
  }

  const data = await response.json();
   return data;
};

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess: () => {
      Cookies.remove('authToken'); // Clear token
      queryClient.clear(); // Clear query cache
      navigate('/login'); // Redirect to login page
    },
    onError: (error) => {
      console.error('Logout error:', error.message);
    },
  });

  return { logout: mutate, isPending, error };
}