import {
    Button,
    Collapse,
    Flex,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
} from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import RenderBadge from './Badge';

const SearchFilter = ({
    searchQuery,
    setSearchQuery,
    isAccordionOpen,
    setIsAccordionOpen,
    pets,
}) => {
    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleToggleAccordion = () => {
        setIsAccordionOpen(!isAccordionOpen);
    };

    return (
        <Stack spacing={4}>
            <InputGroup size='md'>
                <Input
                    variant='outline'
                    placeholder='Search for Name/Species'
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                <InputRightElement width='4.5rem'>
                    <IconButton
                        aria-label='Clear'
                        icon={<CloseIcon />}
                        size='sm'
                        colorScheme='gray.500'
                        variant='ghost'
                        onClick={() => setSearchQuery('')}
                    />
                    <IconButton
                        aria-label='Open options'
                        icon={<HamburgerIcon />}
                        size='md'
                        colorScheme='gray.500'
                        variant='ghost'
                        onClick={handleToggleAccordion}
                    />
                </InputRightElement>
            </InputGroup>
            <Collapse in={isAccordionOpen} animateOpacity>
                <Stack spacing={4} p={4} borderWidth='1px' borderRadius='lg'>
                    <Heading size='md'>Filter by:</Heading>
                    <Flex direction='column'>
                        <Flex pb={3}>
                            <Text>Species:</Text>
                            {pets.map((pet, index, array) => {
                                const isDuplicate = array.findIndex((item) => item.breed === pet.breed) !== index;
                                if (!pet.breed || isDuplicate) {
                                    return null;
                                }
                                return (
                                    <RenderBadge
                                        key={`species-${pet.breed}`}
                                        label='breed'
                                        value={pet.breed}
                                        colorScheme='blue'
                                        onClick={() => setSearchQuery(pet.breed)}
                                    />
                                );
                            })}
                        </Flex>
                        <Flex>
                            <Text>Location:</Text>
                            {pets.map((pet, index, array) => {
                                const isDuplicate = array.findIndex((item) => item.location === pet.location) !== index;
                                if (!pet.location || isDuplicate) {
                                    return null;
                                }
                                return (
                                    <RenderBadge
                                        key={`location-${pet.location}`}
                                        label='location'
                                        value={pet.location}
                                        colorScheme='green'
                                        onClick={() => setSearchQuery(pet.location)}
                                    />
                                );
                            })}
                        </Flex>
                        <Button
                            onClick={() => {
                                setSearchQuery('');
                            }}
                            colorScheme='gray'
                            variant='outline'
                            mt={4}
                            width={'max-content'}
                        >
                            Clear Filters
                        </Button>
                    </Flex>
                </Stack>
            </Collapse>
        </Stack>
    );
};

export default SearchFilter;
