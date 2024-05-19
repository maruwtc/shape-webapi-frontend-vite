import { Button, Flex, Heading, Image, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import RenderBadge from './Badge';

const PetCard = ({ pet, onMessageClick, onFollowClick, onEditClick, onDeleteClick }) => {
    return (
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
                    <RenderBadge label='breed' value={pet.breed} colorScheme='blue' onClick={() => { }} />
                    <RenderBadge label='location' value={pet.location} colorScheme='green' onClick={() => { }} />
                </Stack>
                <Stack
                    width='100%'
                    mt='2rem'
                    direction='row'
                    padding={2}
                    justifyContent='space-between'
                    alignItems='center'
                >
                    {onMessageClick && (
                        <Button
                            flex={1}
                            fontSize='sm'
                            rounded='full'
                            _focus={{
                                bg: 'gray.200',
                            }}
                            onClick={() => window.alert('Message button clicked')}
                        >
                            Message
                        </Button>
                    )}
                    {onFollowClick && (
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
                            onClick={onFollowClick}
                        >
                            Follow
                        </Button>
                    )}
                    {onEditClick && (
                        <Button
                            flex={1}
                            fontSize='sm'
                            rounded='full'
                            _focus={{
                                bg: 'gray.200',
                            }}
                            onClick={onEditClick}
                        >
                            Edit
                        </Button>
                    )}
                    {onDeleteClick && (
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
                            onClick={onDeleteClick}
                        >
                            Delete
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Stack>
    );
};

export default PetCard;
