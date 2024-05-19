import { App as SendbirdApp } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import { config } from '../../../../config/config';
import { Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { GetUsername, CheckAuth } from '../../components/Firebase';
import Unauthorize from '~/lib/layout/Unauthorize';
import { useColorMode } from '@chakra-ui/react';
import PageLoader from '~/lib/layout/PageLoader';

const Chat = () => {
    const [userid, setUserId] = useState('');
    const [username, setUserName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const { colorMode } = useColorMode();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isAuthenticated = await CheckAuth();
                setIsAuthenticated(isAuthenticated);
                if (isAuthenticated) {
                    const { uid, username } = await GetUsername();
                    setUserId(uid);
                    setUserName(username[0].toUpperCase() + username.slice(1));
                }
            } catch (error) {
                console.error('Failed to fetch username:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <PageLoader />
    }

    if (!isAuthenticated) {
        return <Unauthorize />;
    }

    return (
        <Box w={'100%'} h={'96vh'}>
            <SendbirdApp
                appId={config.sendbird_app_id}
                userId={userid}
                nickname={username}
                theme={colorMode}
            />
        </Box>
    );
}

export default Chat;