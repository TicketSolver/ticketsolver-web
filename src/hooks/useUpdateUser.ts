
import { useState } from 'react';
import { UserUpdatePayload, UserProfile } from '@/types/user';
import { updateUserViaApi } from '@/services/admin-service';
interface HookUpdateUserResponse {
    success: boolean;
    message?: string;
    data?: UserProfile;
}
export function useUpdateUser() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateUser = async (
        userId: string,
        payload: UserUpdatePayload
    ): Promise<HookUpdateUserResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedUserData = await updateUserViaApi(userId, payload);
            return { success: true, data: updatedUserData };
        } catch (err: any) {
            setError(err);
            return { success: false, message: err.message || 'An unexpected error occurred' };
        } finally {
            setIsLoading(false);
        }
    };

    return { updateUser, isLoading, error };
}