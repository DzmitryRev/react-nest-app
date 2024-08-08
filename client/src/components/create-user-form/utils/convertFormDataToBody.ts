import { CreateUserBody } from "../../../api/types";
import { CreateUserFormData } from "../types/CreateUserFormData";

export function convertFormDataToBody(formData: CreateUserFormData): CreateUserBody {
    let height = isNaN(+formData.height) || formData.height === "" ? 0 : parseInt(formData.height);
    let weight = isNaN(+formData.weight) || formData.weight === "" ? 0 : parseInt(formData.weight);
    return { ...formData, height, weight };
}
