import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    useToast,
    Checkbox,
    HStack,
    PinInput,
    PinInputField,
    SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CheckAuth, HandleSignup } from "../../../lib/components/Firebase";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [errors, setErrors] = useState({
        email: false,
        password: false,
        otp: false,
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const toast = useToast({ position: 'top' });

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

    const handleChange = (setter: any) => (e: any) => setter(e.target.value);
    const handleOtpChange = (index: any) => (e: any) => {
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);
        setErrors((prev) => ({ ...prev, otp: false }));
    };

    const handleKeyPress = (e: any) => {
        if (e.key === "Enter") {
            registerSubmit();
        }
    };

    const registerSubmit = async () => {
        const newErrors = {
            email: email === "",
            password: password === "",
            otp: isAdmin && otp.some((digit) => digit === ""),
        };

        if (Object.values(newErrors).some((error) => error)) {
            setErrors(newErrors);
            return;
        }

        const userType = otp.join("") === "1234" && isAdmin ? "admin" : "user";
        if (otp.join("") !== "1234" && isAdmin) {
            setErrors((prev) => ({ ...prev, otp: true }));
            return;
        } else if (userType === "user" || userType === "admin") {
            toast.promise(
                HandleSignup(email, password, userType, toast),
                {
                    loading: { title: 'Signing up...' },
                    success: { title: 'Signup successful!' },
                    error: { title: 'Signup failed. Please try again.' },
                },
            );
        } else {
            setErrors((prev) => ({ ...prev, otp: true }));
        }
    };

    if (isAuthenticated) {
        window.location.href = "/profile";
    } 

    return (
        <Box>
            <Flex direction="column" align="center" gap={4} mt={4} w="100%">
                <Heading>Register</Heading>
                <Stack spacing={4}>
                    <Text>Email</Text>
                    <FormControl isInvalid={errors.email}>
                        <Input
                            variant="outline"
                            placeholder="Email"
                            value={email}
                            onChange={handleChange(setEmail)}
                            onKeyPress={handleKeyPress}
                        />
                        <FormErrorMessage>Email is required.</FormErrorMessage>
                    </FormControl>

                    <Text>Password</Text>
                    <FormControl isInvalid={errors.password}>
                        <InputGroup>
                            <Input
                                variant="outline"
                                placeholder="Password"
                                value={password}
                                type={showPassword ? "text" : "password"}
                                onChange={handleChange(setPassword)}
                                onKeyPress={handleKeyPress}
                            />
                            <InputRightElement width="4.5rem">
                                <Button
                                    h="1.75rem"
                                    size="sm"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>Password is required.</FormErrorMessage>
                    </FormControl>

                    <Checkbox my={3} onChange={() => setIsAdmin((prev) => !prev)}>
                        Admin
                    </Checkbox>

                    {isAdmin && (
                        <>
                            <Text>Admin Register Secrets</Text>
                            <FormControl isInvalid={errors.otp} my={2}>
                                <HStack>
                                    <PinInput>
                                        {otp.map((digit, index) => (
                                            <PinInputField
                                                key={index}
                                                value={digit}
                                                onChange={handleOtpChange(index)}
                                            />
                                        ))}
                                    </PinInput>
                                </HStack>
                                {errors.otp && <FormErrorMessage>OTP is not correct.</FormErrorMessage>}
                            </FormControl>
                        </>
                    )}

                    <Button
                        variant="outline"
                        colorScheme="blue"
                        onClick={registerSubmit}
                        my={5}
                        w="100%"
                    >
                        Register
                    </Button>
                    <SimpleGrid columns={2} spacing={4} alignItems="center">
                        <Text>Have an account?</Text>
                        <Button onClick={() => (window.location.href = "/login")}>
                            Login
                        </Button>
                    </SimpleGrid>
                </Stack>
            </Flex>
        </Box>
    );
};

export default Register;
