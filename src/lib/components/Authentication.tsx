import { Navigate } from 'react-router-dom';
import { config } from '../../../config/config';

export const HandleLogin = async (email: string, password: string, toast: any) => {
  const response = await fetch(config.api_url + '/api/v1/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    console.log(response);
    toast({
      title: 'Error',
      description: 'An error occurred',
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top',
    });
    return false;
  } else {
    const data = await response.json();
    console.log(data);
    if (data.error) {
      toast({
        title: 'Error',
        description: data.error,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
      return false;
    } else {
      toast({
        title: 'Success',
        description: 'Login successful',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
      sessionStorage.setItem('token', data.token);
      window.location.href = '/profile';
      return true;
    }
  }
}

export const HandleLogout = () => {
  sessionStorage.removeItem('token');
  window.location.href = '/login';
}

export const HandleSignup = async (email: string, password: string, toast: any) => {
  const response = await fetch(config.api_url + '/api/v1/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    toast({
      title: 'Error',
      description: 'An error occurred',
      status: 'error',
      duration: 9000,
      isClosable: true,
      position: 'top',
    });
    return false;
  } else {
    const data = await response.json();
    if (data.error) {
      toast({
        title: 'Error',
        description: data.error,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
      return false;
    } else {
      toast({
        title: 'Success',
        description: 'Signup successful',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('token', data.token);
      window.location.href = '/profile';
      return true;
    }
  }
}

export const CheckAuth = async () => {
  const response = await fetch(config.api_url + '/api/v1/checkauth', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
  });
  if (!response.ok) {
    return false;
  } else {
    const data = await response.json();
    if (data.error) {
      return false;
    } else {
      return true;
    }
  }
}

export const GetUsername = async () => {
  const response = await fetch(config.api_url + '/api/v1/getuser', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          token: sessionStorage.getItem('token'),
      }),
  });
  if (!response.ok) {
      throw new Error('Network response was not ok');
  } else {
      const data = await response.json();
      return {
          uid: data.uid,
          username: data.email.split('@')[0],
          email: data.email,
      };
  }
};

type PrivateRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

const RequireAuth = ({
  children,
  redirectTo = '/login',
}: PrivateRouteProps) => {
  if (sessionStorage.getItem('token') != null) {
    const isAuthenticated = true;
    return isAuthenticated ? (
      (children as React.ReactElement)
    ) : (
      <Navigate to={redirectTo} />
    );
  }
};

export default RequireAuth;