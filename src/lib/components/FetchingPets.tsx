import { config } from '../../../config/config';

const apiRequest = async (endpoint: string, method: string, body?: object, token?: string, others?: object) => {
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'token': token }),
        ...(others && others),
    };
    const response = await fetch(`${config.api_url}${endpoint}`, {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
    });
    const data = await response.json();
    return { response, data };
};

const handleApiResponse = (response: Response, data: any, defaultError: any = {}) => {
    if (!response.ok || data.error) {
        console.error('API Error:', data.error || 'Request failed');
        return defaultError;
    }
    return data;
};

export const GetAllPet = async () => {
    try {
        const { response, data } = await apiRequest('/api/v1/pets', 'GET');
        return handleApiResponse(response, data, []);
    } catch (error) {
        console.error('Failed to fetch pets:', error);
        return [];
    }
};

export const GetIdPet = async (id: string) => {
    try {
        const { response, data } = await apiRequest(`/api/v1/pets/${id}`, 'GET', undefined, String(sessionStorage.getItem('token')));
        return handleApiResponse(response, data, {});
    } catch (error) {
        console.error('Failed to fetch pet:', error);
        return {};
    }
};

export const CreatePet = async (pet: any) => {
    try {
        const { response, data } = await apiRequest('/api/v1/pets', 'POST', { pet, token: sessionStorage.getItem('token') });
        return handleApiResponse(response, data, {});
    } catch (error) {
        console.error('Failed to create pet:', error);
        return {};
    }
};

export const UpdatePet = async (id: string, pet: any) => {
    try {
        const { response, data } = await apiRequest(`/api/v1/pets/${id}`, 'PUT', { pet, token: sessionStorage.getItem('token') });
        return handleApiResponse(response, data, {});
    } catch (error) {
        console.error('Failed to update pet:', error);
        return {};
    }
};

export const DeletePet = async (id: string) => {
    try {
        const { response, data } = await apiRequest(`/api/v1/pets/${id}`, 'DELETE', { token: sessionStorage.getItem('token') });
        return handleApiResponse(response, data, {});
    } catch (error) {
        console.error('Failed to delete pet:', error);
        return {};
    }
};

export const UploadImage = async (base64Image: any) => {
    try {
        const { response, data } = await apiRequest('/api/v1/user/uploadimage', 'POST', { image: base64Image, token: sessionStorage.getItem('token') });
        if (!response.ok) {
            throw new Error('Failed to upload image');
        }
        return data.url;
    } catch (error) {
        console.error('Failed to upload image:', error);
        throw error;
    }
};

export const GetWishlist = async (id: string) => {
    try {
        const { response, data } = await apiRequest(`/api/v1/user/${id}/wishlist`, 'GET', undefined, String(sessionStorage.getItem('token')));
        return handleApiResponse(response, data, []);
    } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        return [];
    }
};

export const AddToWishlist = async (id: string, petId: string) => {
    try {
        const { response, data } = await apiRequest(`/api/v1/user/${id}/wishlist`, 'PUT', { wishlist: petId }, String(sessionStorage.getItem('token')));
        return handleApiResponse(response, data, {});
    } catch (error) {
        console.error('Failed to add to wishlist:', error);
        return {};
    }
};

export const RemoveFromWishlist = async (id: string, petId: string) => {
    try {
        const { response, data } = await apiRequest(`/api/v1/user/${id}/wishlist`, 'DELETE', { wishlist: petId }, String(sessionStorage.getItem('token')));
        return handleApiResponse(response, data, {});
    } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        return {};
    }
};

export const DogAPI = async (value: any) => {
    if (!value) return [];
    try {
        const { response, data } = await apiRequest('/api/v1/petapi/breed', 'GET', undefined, undefined, {'breed': value.toLowerCase()});
        console.log('data', data);
        console.log('response', response);
        return handleApiResponse(response, data, []);
    } catch (error) {
        console.error('Failed to fetch dog:', error);
        return [];
    }
};

export const DogAPIList = async () => {
    try {
        const { response, data } = await apiRequest('/api/v1/petapi/breeds', 'GET');
        return handleApiResponse(response, data, []);
    } catch (error) {
        console.error('Failed to fetch dog list:', error);
        return [];
    }
};
