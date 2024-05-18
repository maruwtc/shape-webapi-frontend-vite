import { App as SendbirdApp } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import { config } from '../../../../config/config';
import { Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { GetUsername } from '../../components/Authentication';
import { useNavigate } from 'react-router-dom';
import PageLoader from '~/lib/layout/PageLoader';

const Chat = () => {
    const [userid, setUserId] = useState('');
    const [username, setUserName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate
    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const { uid, username } = await GetUsername();
                console.log(uid, username);
                setUserId(uid);
                setUserName(username[0].toUpperCase() + username.slice(1));
            } catch (error) {
                console.error('Failed to fetch username:', error);
            }
        };
        const checkAuth = async () => {
            setIsAuthenticated(true);
            if (!isAuthenticated) {
                navigate('/login'); // Redirect to login if not authenticated
            }
        }
        fetchUsername();
        checkAuth();
    }, [navigate]);

    if (!isAuthenticated) {
        return <PageLoader />; // Optionally render a loading indicator or nothing while checking authentication
    }
    return (
        <Box w={'100%'} h={'80vh'}>
            <SendbirdApp
                appId={config.sendbird_app_id}
                userId={userid}
                nickname={username}
            />
        </Box>
    );
}

export default Chat;