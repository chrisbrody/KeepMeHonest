// lib/auth/roles.ts

export const ROLES = {
    SUPER_ADMIN: 'Super Admin',
    USER_ADMIN: 'User Admin',
    USER: 'User',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];