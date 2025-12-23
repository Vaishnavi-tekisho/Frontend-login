import { API_BASE_URL, API_ENDPOINTS, getAuthHeader } from '../config/api';

export interface User {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    full_name?: string; // Derived or optional
    phone_number?: string;
    location?: string;
    profile_image_url?: string;
    is_active: boolean;
    email_verified: boolean;
    acc_created_at: string;
    acc_updated_at: string;
    last_login?: string;
}

class UserService {
    async getCurrentUser(): Promise<User> {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users.me}`, {
            headers: {
                ...getAuthHeader(),
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }

        return await response.json();
    }

    async updateCurrentUser(userData: Partial<User>): Promise<User> {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users.update}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(),
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Failed to update user');
        }

        return await response.json();
    }
}

export const userService = new UserService();
