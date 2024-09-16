import { User } from "@/types/models/user";

export const getUserFullName = (user: User) => {
    return `${user?.firstName || 'N/A'} ${user?.lastName || ''}`;
};