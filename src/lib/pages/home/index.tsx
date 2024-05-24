import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Badge,
  SimpleGrid,
  useColorModeValue,
  Text,
  useToast,
} from '@chakra-ui/react';
import { GetAllPet, GetWishlist, AddToWishlist, RemoveFromWishlist } from '~/lib/components/FetchingPets';
import { useEffect, useState } from 'react';
import PageLoader from '~/lib/layout/PageLoader';
import SearchFilter from '~/lib/pages/layout/SearchFilter';
import { Pet } from '~/lib/components/HandleFunctions';
import { CheckAuth, GetUsername } from '~/lib/components/Firebase';
import copy from 'copy-to-clipboard';

const Home = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [userId, setUserId] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toast = useToast();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const fetchedPets = await GetAllPet();
        setPets(fetchedPets);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch pets:', error);
        setLoading(false);
      }
    };
    const checkAuth = async () => {
      try {
        const isAuthenticated = await CheckAuth();
        setIsAuth(isAuthenticated);
        const { uid } = await GetUsername();
        setUserId(uid);
        // const userWishlist = await GetWishlist(uid);
        // setWishlist(userWishlist);
      } catch (error) {
        console.error('Error fetching authentication status:', error);
      }
    }
    fetchPets();
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (userId) {
        try {
          const data = await GetWishlist(userId);
          setWishlist(data);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      }
    };
    fetchWishlist();
  }, [userId]);

  const handleFollow = async (petId: any) => {
    if (isAuth) {
      try {
        await AddToWishlist(userId, petId);
        toast({
          title: 'Added to wishlist! Reloading...',
          status: 'success',
          duration: 2000,
          position: 'top',
          isClosable: true,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
      }
    } else {
      window.alert('Please login to wishlist');
      window.location.href = '/login';
    }
  };

  const handleUnFollow = async (petId: any) => {
    if (isAuth) {
      try {
        await RemoveFromWishlist(userId, petId);
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
        onClick={() => setSearchQuery(value)}
      >
        {value ? value : 'Unknown'}
      </Badge>
    );
  };

  if (loading) {
    return <PageLoader />;
  }

  const filteredPets = pets.filter((pet) => {
    const petName = pet.name.toLowerCase();
    const petSpecies = pet.breed.toLowerCase();
    const petLocation = pet.location.toLowerCase();
    const searchQueryLower = searchQuery.toLowerCase();
    return (
      petName.includes(searchQueryLower) ||
      petSpecies.includes(searchQueryLower) ||
      petLocation.includes(searchQueryLower)
    );
  });

  return (
    <Stack spacing={4}>
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAccordionOpen={isAccordionOpen}
        setIsAccordionOpen={setIsAccordionOpen}
        pets={pets}
      />
      <SimpleGrid gap={5} marginTop={5} columns={{ base: 1, sm: 2, md: 2, xl: 3 }}>
        {filteredPets.map((pet) => (
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
                    if (isAuth) {
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
                {wishlist.includes(String(pet._id)) ?
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
                    onClick={() => {
                      handleUnFollow(pet._id)
                    }}
                  >
                    Unfollow
                  </Button>
                  :
                  <Button
                    flex={1}
                    fontSize={'sm'}
                    rounded={'full'}
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                    _focus={{
                      bg: 'blue.500',
                    }}
                    onClick={() => {
                      handleFollow(pet._id)
                    }}
                  >
                    Follow
                  </Button>
                }
              </Stack>
            </Stack>
          </Stack>
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default Home;
