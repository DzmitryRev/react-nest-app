import { FormEventHandler, ChangeEvent, useState } from "react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import { CreateUserFormData } from "./types/CreateUserFormData";
import { createUser } from "../../api/api";
import { convertFormDataToBody } from "./utils/convertFormDataToBody";
import { User } from "../../api/types";

type CreateUserFormProps = {
    setUsers: (cb: (prevUsers: User[]) => User[]) => void;
};

export function CreateUserForm({ setUsers }: CreateUserFormProps) {
    const [formData, setFormData] = useState<CreateUserFormData>({
        firstName: "",
        lastName: "",
        height: "",
        weight: "",
        address: "",
        photo: "",
    });

    function handleChange(e: ChangeEvent<HTMLInputElement>): void {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        await createUser(convertFormDataToBody(formData)).then((user) => {
            setUsers((prevUsers) => {
                return [user, ...prevUsers];
            });
        });
    };

    return (
        <form className="create-user-form" onSubmit={handleSubmit}>
            <div className="create-user-form__field-container">
                <label htmlFor="first-name">First Name:</label>
                <input
                    type="text"
                    id="first-name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="create-user-form__field-container">
                <label htmlFor="last-name">Last Name:</label>
                <input
                    type="text"
                    id="last-name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="create-user-form__field-container">
                <label htmlFor="height">Height:</label>
                <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="create-user-form__field-container">
                <label htmlFor="weight">Weight:</label>
                <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="create-user-form__field-container">
                <label htmlFor="address">Address:</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="create-user-form__field-container">
                <label>Photo:</label>
                <FileUploaderRegular
                    pubkey="76a684b0e7043efa9a79"
                    maxLocalFileSizeBytes={1000000000}
                    multiple={false}
                    imgOnly={true}
                    onFileUploadSuccess={(e) => {
                        setFormData({ ...formData, photo: e.cdnUrl });
                    }}
                    onFileRemoved={() => {
                        setFormData({ ...formData, photo: "" });
                    }}
                    sourceList="local, url, camera"
                    classNameUploader="my-config uc-light"
                />
            </div>
            <div className="create-user-form__submit-btn-container">
                <button className="button create-user-form__submit-btn" type="submit">
                    Submit
                </button>
            </div>
        </form>
    );
}
