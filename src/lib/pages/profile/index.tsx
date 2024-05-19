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
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import { GetUsername, HandleLogout, CheckAuth, DeleteAccount } from "../../components/Firebase";
import React, { useEffect, useState, useRef } from "react";
import Unauthorize from "~/lib/layout/Unauthorize";
import PageLoader from "~/lib/layout/PageLoader";

const Profile = () => {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen: onOpenDeleteAlert, onClose: onCloseDeleteAlert } = useDisclosure();
    const cancelRef = useRef();
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isAuthenticated = await CheckAuth();
                setIsAuthenticated(isAuthenticated);
                if (isAuthenticated) {
                    const { username, email } = await GetUsername();
                    setUserName(username[0].toUpperCase() + username.slice(1));
                    setEmail(email);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDeleteAccount = async () => {
        try {
            await DeleteAccount(toast);
        } catch (error) {
            console.error('Error deleting account:', error);
        } finally {
            onCloseDeleteAlert();
        }
    };

    if (loading) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        return <Unauthorize />;
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
                    textAlign={'center'}
                >
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
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}
                            _focus={{
                                bg: 'blue.500',
                            }}
                            onClick={HandleLogout}
                        >
                            Logout
                        </Button>
                        <Text py={3}>Wanna delete account?</Text>
                        <Button
                            flex={1}
                            fontSize={'sm'}
                            rounded={'full'}
                            p={3}
                            _focus={{
                                bg: 'gray.200',
                            }}
                            onClick={onOpenDeleteAlert}
                        >
                            Delete Account
                        </Button>
                        <AlertDialog
                            isOpen={isOpen}
                            leastDestructiveRef={cancelRef}
                            onClose={onCloseDeleteAlert}
                        >
                            <AlertDialogOverlay>
                                <AlertDialogContent>
                                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                        Delete Account
                                    </AlertDialogHeader>
                                    <AlertDialogBody>
                                        Are you sure? You can't undo this action afterwards.
                                    </AlertDialogBody>
                                    <AlertDialogFooter>
                                        <Button ref={cancelRef} onClick={onCloseDeleteAlert}>
                                            Cancel
                                        </Button>
                                        <Button colorScheme='red' onClick={handleDeleteAccount} ml={3}>
                                            Delete
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialogOverlay>
                        </AlertDialog>
                    </Stack>
                </Box>
            </Flex>
        </Center>
    );
};

export default Profile;
