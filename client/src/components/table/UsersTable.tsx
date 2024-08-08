import { User } from "../../api/types";
import { UsersTableRow } from "./UsersTableRow";

type UsersTableProps = {
    users: User[];
};

export function UsersTable({ users }: UsersTableProps) {
    return (
        <div className="users-table">
            {users.map((user) => {
                return <UsersTableRow key={user.id} user={user} />;
            })}
        </div>
    );
}
