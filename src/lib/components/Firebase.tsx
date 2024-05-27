import { config } from '../../../config/config';

const apiRequest = async (endpoint: string, method: string, body: object) => {
  const response = await fetch(`${config.api_url}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return { response, data };
};

const handleApiResponse = (response: Response, data: any, toast: any, successMessage: string) => {
  if (!response.ok || data.error) {
    toast({
      title: 'Error',
      description: data.error || 'An error occurred',
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top',
    });
    return false;
  }
  toast({
    title: 'Success',
    description: successMessage,
    status: 'success',
    duration: 9000,
    isClosable: true,
    position: 'top',
  });
  return true;
};

export const HandleLogin = async (email: string, password: string, toast: any) => {
  const { response, data } = await apiRequest('/api/v1/user/signin', 'POST', { email, password });
  if (handleApiResponse(response, data, toast, 'Login successful. Redirecting...')) {
    setTimeout(() => {
      sessionStorage.setItem('token', data.token);
      window.location.href = '/profile';
    }, 1000);
    return true;
  }
  return false;
};

export const HandleLogout = () => {
  sessionStorage.clear();
  window.location.href = '/login';
};

export const HandleSignup = async (email: string, password: string, role: string, toast: any) => {
  const { response, data } = await apiRequest('/api/v1/user/register', 'POST', { email, password, role: role || 'user' });
  if (handleApiResponse(response, data, toast, 'Signup successful. Redirecting...')) {
    sessionStorage.setItem('token', data.token);
    window.location.href = '/profile';
    return true;
  }
  return false;
};

export const CheckAuth = async () => {
  const { response, data } = await apiRequest('/api/v1/user/checkauth', 'POST', { token: sessionStorage.getItem('token') });
  if (response.ok && !data.error) {
    return true;
  }
  if (data.error === 'Token expired') {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
  }
  return false;
};

export const GetUsername = async () => {
  try {
    const { response, data } = await apiRequest('/api/v1/user/getuser', 'POST', { token: sessionStorage.getItem('token') });
    if (response.ok) {
      return { uid: data.uid, username: data.email.split('@')[0], email: data.email, role: data.role };
    }
    throw new Error('Network response was not ok');
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const DeleteAccount = async (toast: any) => {
  const { response, data } = await apiRequest('/api/v1/user/deleteaccount', 'POST', { token: sessionStorage.getItem('token') });
  if (handleApiResponse(response, data, toast, 'Account deleted. Redirecting...')) {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
    return true;
  }
  return false;
};

export const CheckAdmin = async () => {
  const { response, data } = await apiRequest('/api/v1/user/checkadmin', 'POST', { token: sessionStorage.getItem('token') });
  return response.ok && !data.error;
};
