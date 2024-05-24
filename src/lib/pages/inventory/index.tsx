import {
    Button,
    Flex,
    Heading,
    Image,
    Input,
    Stack,
    Badge,
    SimpleGrid,
    useColorModeValue,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
    useToast,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogCloseButton,
    AlertDialogBody,
    AlertDialogFooter,
    Tooltip,
    Select,
} from '@chakra-ui/react';
import { GetAllPet, DeletePet, CreatePet, UploadImage, UpdatePet, DogAPI, DogAPIList } from '~/lib/components/FetchingPets';
import { useRef, useEffect, useState } from 'react';
import PageLoader from '~/lib/layout/PageLoader';
import Unauthorize from '~/lib/layout/Unauthorize';
import { CheckAuth, CheckAdmin } from '~/lib/components/Firebase';
import SearchFilter from '~/lib/pages/layout/SearchFilter';
import { Pet } from '~/lib/components/HandleFunctions'
import { randomDogName } from 'dog-names';

const Inventory = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { isOpen: isCreatePetModalOpen, onOpen: opOpenCreatePetModal, onClose: onCloseCreatePetModal } = useDisclosure();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [breed, setBreed] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState('');
    const { isOpen: isOpenDeletePetModal, onOpen: onOpenDeletePetModal, onClose: onCloseDeletePetModal } = useDisclosure();
    const [selectedDeletePet, setSelectedDeletePet] = useState<Pet | null>(null);
    const { isOpen: isEditPetModalOpen, onOpen: opOpenEditPetModal, onClose: onCloseEditPetModal } = useDisclosure();
    const [selectedEditPet, setSelectedEditPet] = useState<Pet | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [dogapiImage, setDogapiImage] = useState('');
    const [dogBreeds, setDogBreeds] = useState<string[]>([]);

    const toast = useToast({ position: 'top' });
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const isAuthenticated = await CheckAuth();
                if (isAuthenticated) {
                    const isAdmin = await CheckAdmin();
                    setIsAdmin(isAdmin);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    return;
                }
                try {
                    const fetchedPets = await GetAllPet();
                    setPets(fetchedPets);
                } catch (error) {
                    console.error('Failed to fetch pets:', error);
                } finally {
                    setLoading(false);
                }
                console.error('Failed to check user:', Error);
            } finally {
                setLoading(false);
            }
        }
        const fetchDogBreeds = async () => {
            try {
                const data = await DogAPIList();
                setDogBreeds(Object.keys(data.message));
            } catch (error) {
                console.error('Failed to fetch dog breeds:', error);
            }
        }
        fetchPets();
        fetchDogBreeds();
    }, []);

    const handleImageUpload = (event: any) => {
        const file = event.target.files[0];
        if (!file) return;
        const uploadImagePromise = new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result as string;
                localStorage.setItem('image', base64Image);
                setImage(base64Image);
                try {
                    const imageUrl = await UploadImage(base64Image);
                    setImage(imageUrl);
                    if (isEditPetModalOpen) {
                        setSelectedEditPet({ ...selectedEditPet, image: imageUrl } as Pet);
                    }
                    localStorage.removeItem('image');
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsDataURL(file);
        });
        toast.promise(uploadImagePromise, {
            loading: { title: 'Uploading Image...' },
            success: { title: 'Image uploaded.' },
            error: { title: 'Failed to upload image.' },
        });
    };

    const handleCreatePet = async (pet: any) => {
        try {
            await CreatePet(pet);
            toast({
                title: 'Pet added.',
                description: 'Pet has been successfully added. Reloading...',
                status: 'success',
                duration: 3000,
                position: 'top',
                isClosable: true,
            });
            setTimeout(() => {
                onCloseCreatePetModal();
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Failed to add pet:', error);
            toast({
                title: 'Failed to add pet.',
                description: 'An error occurred while adding the pet.',
                status: 'error',
                duration: 3000,
                position: 'top',
                isClosable: true,
            });
        }
    }

    const handleEditPet = async (pet: any) => {
        try {
            if (selectedEditPet) {
                const updateData = {
                    name: pet.name,
                    age: pet.age,
                    breed: pet.breed,
                    location: pet.location,
                    image: pet.image,
                };
                const result = await UpdatePet(String(selectedEditPet._id), updateData);
                if (result) {
                    setPets(pets.map((pet) => (pet._id === selectedEditPet._id ? { ...pet, ...updateData } : pet)));
                }
                toast({
                    title: 'Pet updated.',
                    description: 'Pet has been successfully updated. Reloading...',
                    status: 'success',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                });
                setTimeout(() => {
                    onCloseEditPetModal();
                    setSelectedEditPet(null);
                    window.location.reload();
                }, 1000);
            } else {
                throw new Error('No pet selected for editing.');
            }
        } catch (error) {
            console.error('Failed to update pet:', error);
            toast({
                title: 'Failed to update pet.',
                description: 'An error occurred while updating the pet.',
                status: 'error',
                duration: 3000,
                position: 'top',
                isClosable: true,
            });
        }
    }

    const handleDeletePet = async (id: string) => {
        try {
            const result = await DeletePet(id);
            if (result) {
                setPets(pets.filter((pet) => pet._id !== Number(id)));
            }
            toast({
                title: 'Pet deleted.',
                description: 'Pet has been successfully deleted. Reloading...',
                status: 'success',
                duration: 3000,
                position: 'top',
                isClosable: true,
            });
            setTimeout(() => {
                onCloseDeletePetModal();
                setSelectedDeletePet(null);
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Failed to delete pet:', error);
            toast({
                title: 'Failed to delete pet.',
                description: 'An error occurred while deleting the pet.',
                status: 'error',
                duration: 3000,
                position: 'top',
                isClosable: true,
            });
        }
    };

    const handleDogAPI = async (breed: string) => {
        try {
            if (breed !== "") {
                const data = await DogAPI(breed);
                setDogapiImage(data.message);
                toast.promise(
                    DogAPI(breed),
                    {
                        loading: { title: 'Fetching dog image...' },
                        success: { title: 'Dog image fetched.' },
                        error: { title: 'Failed to fetch dog image.' },
                    }
                );
            } else {
                toast({
                    title: 'No breed selected.',
                    description: 'Please select a breed before fetching the dog image.',
                    status: 'warning',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Failed to fetch dog image:', error);
            toast({
                title: 'Failed to fetch dog image.',
                description: 'An error occurred while fetching the dog image.',
                status: 'error',
                duration: 3000,
                position: 'top',
                isClosable: true,
            });
        }
    }

    if (loading) {
        return <PageLoader />
    }

    if (!isAuthenticated || !isAdmin) {
        return <Unauthorize />
    }

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
            <Button onClick={opOpenCreatePetModal}>Add New Pet</Button>
            <Modal isOpen={isCreatePetModalOpen} onClose={() => { onCloseCreatePetModal(); setDogapiImage('') }}>
                <ModalOverlay />
                <ModalContent maxW={{ base: '100%', md: '70%', sm: '80%' }}>
                    <ModalHeader>Add New Pet</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack
                            borderWidth='1px'
                            borderRadius='lg'
                            w='100%'
                            maxW={'100%'}
                            height='auto'
                            direction={{ base: 'column', md: 'row' }}
                            bg={useColorModeValue('white', 'gray.900')}
                            boxShadow={'2xl'}
                            padding={4}
                            mb={4}
                        >
                            <Flex flex={2}>
                                <Tooltip label='Click to upload image' aria-label='Click to upload image'>
                                    <Image
                                        objectFit='cover'
                                        boxSize='100%'
                                        maxW={{ base: '100%', md: '100%' }}
                                        mx={'auto'}
                                        borderRadius={'lg'}
                                        bgColor={'gray.200'}
                                        src={image || 'https://static.vecteezy.com/system/resources/previews/008/480/185/original/upload-click-with-cursor-3d-icon-model-cartoon-style-concept-render-illustration-png.png'}
                                        _hover={{ cursor: 'pointer' }}
                                        onClick={() => document.getElementById('uploadInput')?.click()}
                                    />
                                </Tooltip>
                                <Input
                                    type="file"
                                    id="uploadInput"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                            </Flex>
                            <Stack
                                flex={3}
                                flexDirection='column'
                                p={1}
                                pt={2}
                                ml={5}
                            >
                                <Text>Name:</Text>
                                <Input
                                    placeholder='Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Text>Age:</Text>
                                <Input
                                    placeholder='Age'
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                                <Text>Breed:</Text>
                                <Select
                                    placeholder='Select breed'
                                    value={breed}
                                    onChange={(e) => setBreed(e.target.value)}
                                >
                                    {dogBreeds.map((breed) => (
                                        <option key={breed[0].toUpperCase() + breed.slice(1)} value={breed[0].toUpperCase() + breed.slice(1)}>{breed[0].toUpperCase() + breed.slice(1)}</option>
                                    ))}
                                </Select>
                                <Button onClick={() => handleDogAPI(breed)}>Fetch Dog Image</Button>
                                <Image
                                    src={dogapiImage}
                                    width={200}
                                />
                                <Text>Location:</Text>
                                <Input
                                    placeholder='Location'
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
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
                                        onClick={() => handleCreatePet({ name: name ? name : randomDogName().toString(), age, breed, location, image: image || dogapiImage })}
                                    >
                                        Add
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <SimpleGrid gap={5} marginTop={5} columns={{ base: 1, sm: 2, md: 2, xl: 3 }}>
                {filteredPets.map((pet) => (
                    <Stack
                        key={pet._id}
                        borderWidth='1px'
                        borderRadius='lg'
                        w='100%'
                        maxW={{ base: '100%', sm: '100%', md: '500px' }}
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
                                src={pet.image ? pet.image : dogapiImage}
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
                                    onClick={() => { setSelectedEditPet(pet); opOpenEditPetModal() }}
                                >
                                    Edit
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
                                    onClick={() => { setSelectedDeletePet(pet); onOpenDeletePetModal() }}
                                >
                                    Delete
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                ))}
            </SimpleGrid>
            {selectedEditPet && (
                <Modal isOpen={isEditPetModalOpen} onClose={() => { onCloseEditPetModal(); setDogapiImage(''); }} >
                    <ModalOverlay />
                    <ModalContent maxW={{ base: '100%', md: '70%', sm: '80%' }}>
                        <ModalHeader>Add New Pet</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Stack
                                borderWidth='1px'
                                borderRadius='lg'
                                w='100%'
                                maxW={'100%'}
                                height='auto'
                                direction={{ base: 'column', md: 'row' }}
                                bg={useColorModeValue('white', 'gray.900')}
                                boxShadow={'2xl'}
                                padding={4}
                                mb={4}
                            >
                                <Flex flex={2}>
                                    <Tooltip label='Click to upload image' aria-label='Click to upload image'>
                                        <Image
                                            objectFit='cover'
                                            boxSize='100%'
                                            maxW={{ base: '100%', md: '100%' }}
                                            mx={'auto'}
                                            borderRadius={'lg'}
                                            bgColor={'gray.200'}
                                            src={selectedEditPet.image}
                                            _hover={{ cursor: 'pointer' }}
                                            onClick={() => document.getElementById('uploadInput')?.click()}
                                        />
                                    </Tooltip>
                                    <Input
                                        type="file"
                                        id="uploadInput"
                                        style={{ display: 'none' }}
                                        onChange={handleImageUpload}
                                    />
                                </Flex>
                                <Stack
                                    flex={3}
                                    flexDirection='column'
                                    p={1}
                                    pt={2}
                                    ml={5}
                                >
                                    <Text>Name:</Text>
                                    <Input
                                        placeholder={selectedEditPet.name}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <Text>Age:</Text>
                                    <Input
                                        placeholder={selectedEditPet.age}
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                    <Text>Breed:</Text>
                                    {/* <Input
                                        placeholder={selectedEditPet.breed}
                                        value={breed}
                                        onChange={(e) => setBreed(e.target.value)}
                                    /> */}
                                    <Select
                                        placeholder='Select breed'
                                        value={breed}
                                        onChange={(e) => setBreed(e.target.value)}
                                    >
                                        {dogBreeds.map((breed) => (
                                            <option key={breed[0].toUpperCase() + breed.slice(1)} value={breed[0].toUpperCase() + breed.slice(1)}>{breed[0].toUpperCase() + breed.slice(1)}</option>
                                        ))}
                                    </Select>
                                    <Button onClick={() => handleDogAPI(breed)}>Fetch Dog Image</Button>
                                    <Image
                                        src={dogapiImage}
                                        width={200}
                                    />
                                    <Text>Location:</Text>
                                    <Input
                                        placeholder={selectedEditPet.location}
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
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
                                            onClick={() => handleEditPet({ name: name ? name : selectedEditPet.name, age: age ? age : selectedEditPet.age, breed: breed ? breed : selectedEditPet.breed, location: location ? location : selectedEditPet.location, image: image || selectedEditPet.image })}
                                        >
                                            Update
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
            {selectedDeletePet && (
                <AlertDialog
                    motionPreset='slideInBottom'
                    leastDestructiveRef={cancelRef}
                    onClose={onCloseDeletePetModal}
                    isOpen={isOpenDeletePetModal}
                    isCentered
                >
                    <AlertDialogOverlay />

                    <AlertDialogContent>
                        <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody>
                            Are you sure you want to delete the following pet? <br />
                            Pet name: {selectedDeletePet.name} <br />
                            Pet id: {selectedDeletePet._id.toString()}
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onCloseDeletePetModal}>
                                No
                            </Button>
                            <Button colorScheme='red' ml={3} onClick={() => handleDeletePet(String(selectedDeletePet._id))}>
                                Yes
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </Stack>
    );
};

export default Inventory;
