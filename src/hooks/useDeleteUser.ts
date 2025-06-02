import { useState } from 'react';
import { deleteUserViaApi } from '@/services/admin-service';

interface HookDeleteUserResponse {
    success: boolean;
    message?: string;
}

export function useDeleteUser() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const deleteUser = async (userId: string): Promise<HookDeleteUserResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await deleteUserViaApi(userId); 
            return { success: result.success, message: result.message || 'Usuário deletado com sucesso.' };
        } catch (err: any) {
            setError(err);
            return { success: false, message: err.message || 'Ocorreu um erro inesperado ao deletar o usuário.' };
        } finally {
            setIsLoading(false);
        }
    };

    return { deleteUser, isLoading, error };
}