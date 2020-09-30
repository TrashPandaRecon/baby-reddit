import { User } from '../../entities/User';
import { UserResponse } from '../responseModels/UserResponse';

export const UserExists = (userExists: User | undefined): UserResponse | null => {
	if (userExists) {
		return {
			errors: [
				{
					field: 'username',
					message: 'Username already exists.',
				},
			],
		};
	}
	return null;
};
