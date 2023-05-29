import jwtDecode from "jwt-decode";
import { cookies } from 'next/headers'

type User = {
    sub: string;
    name: string;
    avatarUrl: string;
}

export function getUser(): User {
    const token = cookies().get("token")?.value;

    if (!token) {
        throw new Error("User not authenticated");
    }
    
    const user = jwtDecode<User>(token);
    return user;
}