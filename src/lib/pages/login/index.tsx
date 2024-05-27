import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  FormControl,
  Input,
  FormErrorMessage,
  Button,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  useToast
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { HandleLogin } from '../../components/Firebase';
import { CheckAuth } from "../../../lib/components/Firebase";

const Login = () => {
  const [email, setEmailPlaceholder] = useState('');
  const [password, setPasswordPlaceholder] = useState('');
  const [emptyEmailPlaceholder, setEmptyEmailPlaceholder] = useState(false);
  const [emptyPasswordPlaceholder, setEmptyPasswordPlaceholder] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await CheckAuth();
        setIsAuthenticated(isAuthenticated);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    checkAuth();
  }, []);

  const changeEmailPlaceholder = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailPlaceholder(e.target.value);
    setEmptyEmailPlaceholder(false);
  }

  const changePasswordPlaceholder = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordPlaceholder(e.target.value);
    setEmptyPasswordPlaceholder(false);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      loginSubmit();
    }
  }

  const loginSubmit = async () => {
    let anyError = false;
    if (email === '') {
      setEmptyEmailPlaceholder(true);
      anyError = true;
    } else {
      setEmptyEmailPlaceholder(false);
    }
    if (password === '') {
      setEmptyPasswordPlaceholder(true);
      anyError = true;
    } else {
      setEmptyPasswordPlaceholder(false);
    }
    if (anyError) return;
    HandleLogin(email, password, toast);
  }

  if (isAuthenticated) {
    window.location.href = "/profile";
  }

  return (
    <Box>
      <Flex direction="column" align="center" gap={4} mt={4} w="100%">
        <Heading>Login</Heading>
        <Stack spacing={4}>
          <Text>Email</Text>
          <FormControl isInvalid={emptyEmailPlaceholder}>
            <Input
              variant="outline"
              placeholder="Email"
              value={email}
              onChange={changeEmailPlaceholder}
              onKeyPress={handleKeyPress}
            />
            <FormErrorMessage>Email is required.</FormErrorMessage>
          </FormControl>
          <Text>Password</Text>
          <FormControl isInvalid={emptyPasswordPlaceholder}>
            <InputGroup>
              <Input
                variant="outline"
                placeholder="Password"
                value={password}
                type={showPassword ? 'text' : 'password'}
                onChange={changePasswordPlaceholder}
                onKeyDown={handleKeyPress}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm'
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>Password is required.</FormErrorMessage>
            <SimpleGrid columns={2} spacing={4} mt={10} w={{ base: '100%', md: '300px' }}>
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={loginSubmit}
              >Login</Button>
              <Button onClick={() => window.location.href = '/register'}>Register</Button>
            </SimpleGrid>
          </FormControl>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Login;
