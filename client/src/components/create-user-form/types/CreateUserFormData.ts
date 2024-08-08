import { User } from "../../../api/types";

export type CreateUserFormData = Omit<User, "id" | "height" | "weight"> & {
    height: string;
    weight: string;
};
