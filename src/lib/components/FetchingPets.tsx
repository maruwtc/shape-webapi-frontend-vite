import { config } from '../../../config/config';

export const GetAllPet = async () => {
    try {
        const response = await fetch(config.api_url + '/api/v1/pets', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            return [];
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Failed to fetch pets:', error);
        return [];
    }
}

export const GetIdPet = async (id: string) => {
    try {
        const response = await fetch(config.api_url + '/api/v1/pets/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: sessionStorage.getItem('token'),
            }),
        });
        if (!response.ok) {
            return {};
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Failed to fetch pet:', error);
        return {};
    }
}

export const CreatePet = async (pet: any) => {
    try {
        console.log(pet);
        const response = await fetch(config.api_url + '/api/v1/pets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pet,
                token: sessionStorage.getItem('token'),
            }),
        });
        if (!response.ok) {
            return {};
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Failed to create pet:', error);
        return {};
    }
}

export const UpdatePet = async (id: string, pet: any) => {
    try {
        const response = await fetch(config.api_url + '/api/v1/pets/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pet,
                token: sessionStorage.getItem('token'),
            }),
        });
        if (!response.ok) {
            return {};
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Failed to update pet:', error);
        return {};
    }
}

export const DeletePet = async (id: string) => {
    try {
        const response = await fetch(config.api_url + '/api/v1/pets/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: sessionStorage.getItem('token'),
            }),
        });
        if (!response.ok) {
            return {};
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Failed to delete pet:', error);
        return {};
    }
}

export const UploadImage = async (base64Image: any) => {
    const response = await fetch(config.api_url + '/api/v1/uploadimage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            image: base64Image,
            token: sessionStorage.getItem('token'),
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to upload image');
    }
    const data = await response.json();
    return data.url;
};