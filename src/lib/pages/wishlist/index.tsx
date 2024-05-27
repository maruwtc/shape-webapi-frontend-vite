import {
    Heading,
    Stack,
    Text,
    useColorModeValue,
    Image,
    Flex,
    Button,
    Badge,
    SimpleGrid,
    useToast,
} from '@chakra-ui/react';
import { CheckAuth, GetUsername } from '../../components/Firebase';
import { useEffect, useState } from 'react';
import Unauthorize from '../../layout/Unauthorize';
import { GetWishlist, RemoveFromWishlist, GetIdPet } from '../../components/FetchingPets';
import PageLoader from '~/lib/layout/PageLoader';
import copy from 'copy-to-clipboard';

const Wishlist = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userid, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [petList, setPetList] = useState([]);

    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isAuthenticated = await CheckAuth();
                setIsAuthenticated(isAuthenticated);
                if (isAuthenticated) {
                    const { uid } = await GetUsername();
                    setUserId(uid);
                } else {
                    toast({
                        title: 'Please login to view your wishlist',
                        status: 'info',
                        duration: 2000,
                        position: 'top',
                        isClosable: true,
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (userid) {
                try {
                    const data = await GetWishlist(userid);
                    const petPromises = data.map(async (petId: any) => {
                        const pet = await GetIdPet(petId);
                        return pet;
                    });
                    const pets: any = await Promise.all(petPromises);
                    setPetList(pets);
                } catch (error) {
                    console.error('Error fetching wishlist:', error);
                }
            }
        };
        fetchWishlist();
    }, [userid]);

    const handleUnFollow = async (petId: any) => {
        if (isAuthenticated) {
            try {
                await RemoveFromWishlist(userid, petId);
                toast({
                    title: 'Unfollow from wishlist! Reloading...',
                    status: 'success',
                    duration: 2000,
                    position: 'top',
                    isClosable: true,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                console.error('Failed to unfollow from wishlist:', error);
            }
        } else {
            window.alert('Please login to unfollow from wishlist');
            window.location.href = '/login';
        }
    };

    const renderBadge = (label: any, value: any, colorScheme: any) => {
        return (
            <Badge
                key={`${label}-${value}`}
                variant='outline'
                colorScheme={colorScheme}
                px={2}
                py={1}
                ml={1}
                borderRadius='full'
                bg={useColorModeValue('gray.50', 'gray.800')}
                fontWeight='400'
                _hover={{ cursor: 'pointer' }}
            // onClick={() => setSearchQuery(value)}
            >
                {value ? value : 'Unknown'}
            </Badge>
        );
    };

    if (!isAuthenticated) {
        return <Unauthorize />;
    }

    if (loading) {
        return <PageLoader />;
    }

    return (
        <SimpleGrid gap={5} columns={{ base: 1, sm: 2, md: 2, xl: 3 }}>
            {petList.map((pet: any) => (
                <Stack
                    key={pet._id}
                    borderWidth='1px'
                    borderRadius='lg'
                    w='100%'
                    maxW={{ base: '100%', sm: '100%', xl: '500px' }}
                    height='auto'
                    direction={{ base: 'column', lg: 'row' }}
                    bg={useColorModeValue('white', 'gray.900')}
                    boxShadow={'2xl'}
                    padding={4}
                >
                    <Flex flex={1}>
                        <Image
                            objectFit='cover'
                            boxSize='100%'
                            maxW={{ base: '200px', md: '100%' }}
                            maxH={{ base: '200px', md: '250px' }}
                            mx={'auto'}
                            borderRadius={'lg'}
                            src={pet.image ? pet.image : 'https://via.placeholder.com/150'}
                            alt={pet.name}
                        />
                    </Flex>
                    <Stack
                        flex={1}
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                        p={1}
                        pt={2}
                    >
                        <Heading fontSize='2xl' fontFamily='body'>
                            {pet.name ? pet.name : 'Unknown'}
                        </Heading>
                        <Text fontWeight={600} color='gray.500' mb={4}>
                            {pet.age ? pet.age : 'Unknown'} years old
                        </Text>
                        <Stack align='center' justify='center' direction='column' mt={2}>
                            {renderBadge('breed', pet.breed, 'blue')}
                            {renderBadge('location', pet.location, 'green')}
                        </Stack>
                        <Stack
                            width='100%'
                            mt='2rem'
                            direction='row'
                            padding={2}
                            justifyContent='space-between'
                            alignItems='center'
                        >
                            <Button
                                flex={1}
                                fontSize='sm'
                                rounded='full'
                                _focus={{
                                    bg: 'gray.200',
                                }}
                                onClick={() => {
                                    if (isAuthenticated) {
                                        copy(String(pet._id));
                                        toast({
                                            title: 'Copied Pet ID, please mention this ID when messaging. Redirecting...',
                                            status: 'success',
                                            duration: 2000,
                                            position: 'top',
                                            isClosable: true,
                                        });
                                        setTimeout(() => {
                                            window.location.href = '/chat';
                                        }, 1000);
                                    } else {
                                        window.alert('Please login to message');
                                        window.location.href = '/login';
                                    }
                                }}
                            >
                                Message
                            </Button>
                            <Button
                                flex={1}
                                fontSize={'sm'}
                                rounded={'full'}
                                bg={'red.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'red.500',
                                }}
                                _focus={{
                                    bg: 'red.500',
                                }}
                                onClick={() => handleUnFollow(pet._id)}
                            >
                                Unfollow
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            ))}
        </SimpleGrid>
    );
}
export default Wishlist;