import {User} from "../../entities/User";
import {UserResponse} from "../responseModels/UserResponse";

export const UserDoesntExists = (userExists: User | undefined): UserResponse | null =>
{
        if (!userExists) {
                return {
                        errors: [
                                {
                                        field: 'usernameOrEmail',
                                        message: 'Username / Email is not registered.',
                                },
                        ],
                };
        }
        return null
}