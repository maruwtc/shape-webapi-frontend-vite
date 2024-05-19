"use client"
import {
    Box,
    Button,
    Heading,
    Image,
    Flex,
    Center,
    Link
} from '@chakra-ui/react'

import MotionBox from '../components/MotionBox'

const Unauthorize = () => {
    return (
        <Flex minHeight="70vh" direction="column" justifyContent="center">
            <MotionBox
                animate={{ y: 20 }}
                transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
                width={{ base: '100%', sm: '70%', md: '60%' }}
                margin="0 auto"
            >
                <Center>
                    <Image
                        src="/assets/404 Error-rafiki.svg" 
                        alt="Error 404 not found Illustration"
                        width="400px"
                        margin={10}
                    />
                </Center>
            </MotionBox>

            <Box marginY={4}>
                <Heading textAlign="center" size="lg">
                    You are unauthorized to access this page!
                </Heading>

                <Box textAlign="center" marginTop={4}>
                    <Button
                        as={Link}
                        href={"/login"}
                    >
                        Login
                    </Button>
                </Box>
            </Box>
        </Flex>
    )
}

export default Unauthorize
