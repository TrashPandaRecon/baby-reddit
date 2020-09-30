import { User } from '../../entities/User';
import { UserResponse } from '../responseModels/UserResponse';

export const EmailExists = (emailExists: User | undefined): UserResponse | null => {
	if (emailExists) {
		return {
			errors: [
				{
					field: 'email',
					message: 'Email has already been registered.',
				},
			],
		};
	}
	return null;
};
