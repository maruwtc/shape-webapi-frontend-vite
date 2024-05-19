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
} from '@chakra-ui/react';
import { GetAllPet } from '~/lib/components/FetchingPets';
import { useEffect, useState } from 'react';
import PageLoader from '~/lib/layout/PageLoader';
import SearchFilter from '~/lib/pages/layout/SearchFilter';
import { Pet } from '~/lib/components/HandleFunctions';

const Home = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

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
    fetchPets();
  }, []);

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
      <SimpleGrid columns={[1, 2, 3]} gap={5} marginTop={5}>
        {filteredPets.map((pet) => (
          <Stack
            key={pet._id}
            borderWidth='1px'
            borderRadius='lg'
            w='100%'
            minW={{ base: '100%', sm: '100%', md: '500px' }}
            height='auto'
            direction={{ base: 'column', md: 'row' }}
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
                  onClick={() => window.location.href = '/chat'}
                >
                  Message
                </Button>
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
                >
                  Follow
                </Button>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default Home;
