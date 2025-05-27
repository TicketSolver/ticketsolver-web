export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'technician' | 'user';
    roleId: string;
}


export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    defUserTypeId: number;
    tenantId:number;
}