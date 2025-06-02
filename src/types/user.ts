export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'technician' | 'user';
    roleId: string;
}
export interface UserUpdatePayload {
    fullName?: string;
    defUserTypeId?: number;
}

export interface UserProfile {
    fullName: string;
    createdAt: string;
    updatedAt: string;
    defUserStatusId: number;
    defUserStatus: any | null;
    defUserTypeId: number;
    defUserType: any | null;
    tenantId: number;
    tenant: any | null;
    ticketUsers: any[];
    id: string;
    userName: string;
    normalizedUserName: string;
    email: string;
    normalizedEmail: string;
    emailConfirmed: boolean;
    passwordHash: string;
    securityStamp: string;
    concurrencyStamp: string;
    phoneNumber: string | null;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
    lockoutEnd: string | null;
    lockoutEnabled: boolean;
    accessFailedCount: number;
}