// hooks/useUpdateUser.ts
import { useState } from 'react';

interface UpdateUserData {
    fullName?: string;
    defUserTypeId?: number;
}

interface UseUpdateUserReturn {
    updateUser: (userId: string, data: UpdateUserData) => Promise<any>; // Consider defining a more specific return type
    isLoading: boolean;
    error: string | null;
    data: any | null; // Consider defining a more specific type for the returned user data
}

export const useUpdateUser = (): UseUpdateUserReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any | null>(null);

    const updateUser = async (userId: string, updateData: UpdateUserData) => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || `Error ${response.status}: Failed to update user`);
            }

            setData(responseData);
            setIsLoading(false);
            return responseData;
        } catch (err: any) {
            console.error("useUpdateUser hook error:", err);
            setError(err.message || 'An unknown error occurred');
            setIsLoading(false);
            throw err;
        }
    };

    return { updateUser, isLoading, error, data };
};