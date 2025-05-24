export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'technician' | 'user';
    roleId: string;
}
