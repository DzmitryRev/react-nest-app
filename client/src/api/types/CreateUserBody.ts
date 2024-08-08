import { User } from ".";

export type CreateUserBody = Omit<User, "id" | "photo"> & { photo?: string };
