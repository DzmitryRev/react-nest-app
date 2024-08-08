import { User } from ".";

export type GetUsersResponse = {
    users: User[];
    totalPages: number;
};
