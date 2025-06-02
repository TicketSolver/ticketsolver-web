import { useState } from 'react'
import { preregisterUser } from '@/services/auth'
import { PreRegisterPayload, PreRegisterResponse } from '@/types/auth'

export function usePreregisterUser() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function createUser(data: PreRegisterPayload): Promise<PreRegisterResponse | null> {
        setIsLoading(true)
        setError(null)
        try {
            const response = await preregisterUser(data)
            return response
        } catch (err: any) {
            setError(err.message)
            return null
        } finally {
            setIsLoading(false)
        }
    }

    return { createUser, isLoading, error }
}
