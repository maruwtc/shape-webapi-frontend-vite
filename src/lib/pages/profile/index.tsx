import {
    Box,
    Flex,
    Heading,
    Stack,
    Text,
    Avatar,
    Button,
    Center,
    useColorModeValue,
} from "@chakra-ui/react";
import { GetUsername, HandleLogout, CheckAuth } from "../../components/Authentication";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PageLoader from "~/lib/layout/PageLoader";

const Profile = () => {
    const [userid, setUserId] = useState('');
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate
    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const { uid, username, email } = await GetUsername();
                console.log(uid, username, email);
                setUserId(uid);
                setUserName(username[0].toUpperCase() + username.slice(1));
                setEmail(email);
            } catch (error) {
                console.error('Failed to fetch username:', error);
            }
        };
        const checkAuth = async () => {
            const auth = await CheckAuth();
            setIsAuthenticated(auth);
            if (!auth) {
                navigate('/login'); // Redirect to login if not authenticated
            }
        }
        fetchUsername();
        checkAuth();
    }, [navigate]);

    if (!isAuthenticated) {
        return <PageLoader />
    }
    return (
        <Center py={6}>
            <Flex direction="column" align="center" gap={4} mt={4} w="100%">
                <Heading as="h1" size="xl">
                    Profile
                </Heading>
                <Box
                    maxW={'400px'}
                    w={'full'}
                    bg={useColorModeValue('white', 'gray.900')}
                    boxShadow={'2xl'}
                    rounded={'2xl'}
                    p={6}
                    textAlign={'center'}>
                    <Avatar
                        size={'xl'}
                        src={''}
                        mb={4}
                        pos={'relative'}
                        _after={{
                            content: '""',
                            w: 4,
                            h: 4,
                            bg: 'green.300',
                            border: '2px solid white',
                            rounded: 'full',
                            pos: 'absolute',
                            bottom: 0,
                            right: 3,
                        }}
                    />
                    <Heading fontSize={'2xl'} fontFamily={'body'}>
                        {username}
                    </Heading>
                    <Text fontWeight={600} color={'gray.500'} mb={4}>
                        {email}
                    </Text>
                    <Stack align={'center'} justify={'center'} direction={'column'} mt={6}>
                        <Button
                            flex={1}
                            fontSize={'sm'}
                            rounded={'full'}
                            p={3}
                            _focus={{
                                bg: 'gray.200',
                            }}>
                            Change Password
                        </Button>
                        <Button
                            flex={1}
                            fontSize={'sm'}
                            rounded={'full'}
                            p={3}
                            bg={'blue.400'}
                            color={'white'}
                            boxShadow={
                                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                            }
                            _hover={{
                                bg: 'blue.500',
                            }}
                            _focus={{
                                bg: 'blue.500',
                            }}
                            onClick={HandleLogout}>
                            Logout
                        </Button>
                    </Stack>
                </Box>
            </Flex>
        </Center>
    );
}

export default Profile;