interface AppUser {
    id: string;
    fullName: string;
    userName: string;
    email: string;
    defUserTypeId: number;
    defUserStatusId: number;
    tenantId: number;
    role:  'admin' | 'technician' | 'user';
    token: string;
}


