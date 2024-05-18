import {
    Box,
    Center,
    SkeletonCircle,
    SkeletonText,
    useColorModeValue
} from '@chakra-ui/react'

const PageLoader = () => {
    return (
        <Center>
            <Box
                padding='6'
                boxShadow='lg'
                borderRadius='10'
                bg={useColorModeValue('gray.100', 'gray.900')}
                width={{ base: "100%", md: "700px" }}>
                <SkeletonCircle size='20' />
                <SkeletonText mt='4' noOfLines={7} spacing='5' skeletonHeight='3' />
            </Box>
        </Center>
    )
}

export default PageLoader