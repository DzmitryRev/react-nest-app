import axios from "axios";
import { CreateUserBody, GetUsersResponse, User } from "./types";

const API_URL = "http://localhost:3001/";

export async function getUsers(page: number): Promise<GetUsersResponse> {
    let response = await axios.get<GetUsersResponse>(API_URL + `users?page=${page}`);
    return response.data;
}

export async function createUser(body: CreateUserBody): Promise<User> {
    let response = await axios.post<User>(API_URL + "users", body);
    return response.data;
}

/**
 * TODO:
 * 1. Patch and delete requests.
 */
