import Cookies from 'js-cookie';

export const setAuthToken = (token) => {
  Cookies.set('authToken', token, { expires: 7, secure: true, sameSite: 'Strict' });
};

export const getAuthToken = () => {
  return Cookies.get('authToken');
};

export const removeAuthToken = () => {
  Cookies.remove('authToken');
};