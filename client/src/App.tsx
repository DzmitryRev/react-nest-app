import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { User } from "./api/types";
import { getUsers } from "./api/api";
import { Button, Modal } from "./components/ui";
import { UsersTable } from "./components/table";
import { Pagination } from "./components/pagination";
import { CreateUserForm } from "./components/create-user-form";

function App() {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

    useEffect(() => {
        loadUsers();
    }, [page]);

    useEffect(() => {
        if (isCreateUserModalOpen) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
    }, [isCreateUserModalOpen]);

    function loadUsers() {
        setIsLoading(true);
        getUsers(page).then((res) => {
            setUsers(res.users);
            setTotalPages(res.totalPages);
            setIsLoading(false);
        });
    }

    return (
        <div className={"users-page-container " + "modal-open"}>
            {(isLoading && (
                <div className="users-page-container__loader">
                    <BeatLoader size={10} />
                </div>
            )) || (
                <div className="users-table-container">
                    <header className="users-table-container__header">
                        <Button
                            onClick={() => {
                                setIsCreateUserModalOpen(true);
                            }}
                        >
                            Add user
                        </Button>
                    </header>
                    <UsersTable users={users} />
                    <footer className="users-table-container__footer">
                        <Pagination totalPages={totalPages} setPage={setPage} />
                    </footer>
                </div>
            )}
            <Modal
                isOpen={isCreateUserModalOpen}
                closeModal={() => {
                    setIsCreateUserModalOpen(false);
                }}
            >
                <CreateUserForm setUsers={setUsers} />
            </Modal>
        </div>
    );
}

export default App;

/**
 * TODO
 * 1. DELETE and PATCH;
 * 2. User modal with full user info + photo;
 */
