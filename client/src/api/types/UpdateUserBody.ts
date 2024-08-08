import { User } from ".";

export type UpdateUserBody = Partial<Omit<User, "id">>;
