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
        description: 'Login successful',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
      setTimeout(() => {
        sessionStorage.setItem('token', data.token);
        window.location.href = '/profile';
      }, 2000);
      return true;
    }
  }
}

export const HandleLogout = () => {
  sessionStorage.clear();
  window.location.href = '/login';
}

export const HandleSignup = async (email: string, password: string, role: string, toast: any) => {
  const response = await fetch(config.api_url + '/api/v1/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, role: role ? role : 'user' }),
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
      sessionStorage.setItem('token', data.token);
      window.location.href = '/profile';
      return true;
    }
  }
}

export const CheckAuth = async () => {
  const response = await fetch(config.api_url + '/api/v1/checkauth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: sessionStorage.getItem('token'),
    }),
  });
  if (!response.ok) {
    return false;
  } else {
    const data = await response.json();
    if (data.error) {
      if (data.error === 'Token expired') {
        sessionStorage.removeItem('token');
        window.location.href = '/login';
      }
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
      role: data.role,
    };
  }
};

export const DeleteAccount = async (toast: any) => {
  const response = await fetch(config.api_url + '/api/v1/deleteaccount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: sessionStorage.getItem('token'),
    }),
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
        description: 'Account deleted',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
      sessionStorage.removeItem('token');
      window.location.href = '/login';
      return true;
    }
  }
}

export const CheckAdmin = async () => {
  const response = await fetch(config.api_url + '/api/v1/checkadmin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: sessionStorage.getItem('token'),
    }),
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