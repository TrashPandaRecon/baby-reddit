export const Password = (password:string, reenterPassword:string) =>
{
	if (reenterPassword != password) {
		return {
			errors: [
				{
					field: 'reenterPassword',
					message: 'Passwords do not match',
				},
			],
		};
	}
    if (password.length < 4) {
        return {
            errors: [
                {
                    field: 'password',
                    message: 'Username must be more than 4 characters long.',
                },
            ],
        };
    }
    return null
}