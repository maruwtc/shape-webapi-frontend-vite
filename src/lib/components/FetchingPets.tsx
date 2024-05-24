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
                'token': String(sessionStorage.getItem('token'))
            },
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

export const GetWishlist = async (id: string) => {
    try {
        const response = await fetch(config.api_url + '/api/v1/user/' + id + '/wishlist', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': String(sessionStorage.getItem('token'))
            },
        });
        if (!response.ok) {
            return [];
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        return [];
    }
}

export const AddToWishlist = async (id: string, petId: string) => {
    try {
        const response = await fetch(config.api_url + '/api/v1/user/' + id + '/wishlist', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': String(sessionStorage.getItem('token'))
            },
            body: JSON.stringify({
                "wishlist": petId
            }),
        });
        if (!response.ok) {
            return {};
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Failed to add to wishlist:', error);
        return {};
    }
}

export const RemoveFromWishlist = async (id: string, petId: string) => {
    try {
        const response = await fetch(config.api_url + '/api/v1/user/' + id + '/wishlist', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': String(sessionStorage.getItem('token'))
            },
            body: JSON.stringify({
                "wishlist": petId
            }),
        });
        if (!response.ok) {
            return {};
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        return {};
    }
}

export const DogAPI = async (value: any) => {
    if (value === "") {
        return [];
    } else {
        try {
            const response = await fetch(config.api_url + '/api/v1/petapi/breed', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Breed': value.toLowerCase(),
                },
            });
            if (!response.ok) {
                return [];
            } else {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.error('Failed to fetch dog:', error);
            return [];
        }
    }
}

export const DogAPIList = async () => {
    try {
        const response = await fetch(config.api_url + '/api/v1/petapi/breeds', {
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
        console.error('Failed to fetch dog list:', error);
        return [];
    }
}