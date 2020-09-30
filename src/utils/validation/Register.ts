import { isValid } from 'mailchecker';
import { RegistrationInput } from '../inputModels/RegistrationInput';
import { UserResponse } from '../responseModels/UserResponse';
import {Password} from './Password';
export const validateRegister = (
	input: RegistrationInput,
): UserResponse | null => {
	if (!isValid(input.email)) {
		return {
			errors: [
				{
					field: 'email',
					message: 'Email is invalid.',
				},
			],
		};
	}
	if (input.username.length < 3) {
		return {
			errors: [
				{
					field: 'username',
					message: 'Username must be more than 2 characters long.',
				},
			],
		};
	}
	if (!/^[\w\d-]*$/.test(input.username)) {
		return {
			errors: [
				{
					field: 'username',
					message:
						'Username can only contain letters, numbers and "-"',
				},
			],
		};
	}
    var isPasswordValid = Password(input.password, input.reenterPassword)
    if (isPasswordValid != null)
    {
        return isPasswordValid
    }
	return null;
};
