import { InputType, Field } from 'type-graphql';

@InputType()
export class RegistrationInput {
	@Field()
	email: string;
	@Field()
	username: string;
	@Field()
	password: string;
	@Field()
	reenterPassword: string;
}
