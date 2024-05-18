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
import React, { useState } from 'react';
import { HandleLogin } from '../../components/Authentication';

const Login = () => {
  const [email, setEmailPlaceholder] = useState('');
  const [password, setPasswordPlaceholder] = useState('');
  const [emptyEmailPlaceholder, setEmptyEmailPlaceholder] = useState(false);
  const [emptyPasswordPlaceholder, setEmptyPasswordPlaceholder] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toast = useToast();

  const changeEmailPlaceholder = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailPlaceholder(e.target.value);
    setEmptyEmailPlaceholder(false);
  }

  const changePasswordPlaceholder = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordPlaceholder(e.target.value);
    setEmptyPasswordPlaceholder(false);
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
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm'
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>Password is required.</FormErrorMessage>
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={loginSubmit}
              my={5}
            >Login</Button>
            <SimpleGrid columns={2} spacing={4}>
              <Button>Register</Button>
              <Button>Forgot Password</Button>
            </SimpleGrid>
          </FormControl>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Login;
