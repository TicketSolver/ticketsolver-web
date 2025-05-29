import { DefaultSession, DefaultUser } from "next-auth"

export interface LoginFormData {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: {
      id: string
      email: string
      name: string
    }
  }
  errors: any
}

export interface BaseResponse<T> {
  success: boolean
  message: string
  data: T | null
  errors: any
}

export type InviteCodeFormValues = { 
  inviteCode: string 
}

export interface VerifyInviteResponse {
  tenantKey: string
  typeKey: number
}

export type RegisterFormValues = {
  name: string
  email: string
  password: string
  confirmPassword?: string
  inviteCode: string
}

export interface RegisterRequest {
  email: string
  password: string
  key: string
}
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: AppUser;
    }
    interface User extends DefaultUser, AppUser { }
}

export interface PreRegisterPayload {
  email: string
  fullName: string
  password: string
  defUserTypeId: number
  tenantId: number
  key: string
}

export interface PreRegisterResponse {
  success: boolean
  message: string
  data: {
    result: {
      succeeded: boolean
      errors: string[]
    }
  }
  errors: any
}