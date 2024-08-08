import { memo } from "react";
import { User } from "../../api/types";

type UsersTableRowProps = {
    user: User;
};

export const UsersTableRow = memo(({ user }: UsersTableRowProps) => {
    return (
        <div className="users-table__row">
            <p>
                {user.firstName} {user.lastName}
            </p>
            <p>{user.address}</p>
        </div>
    );
});
