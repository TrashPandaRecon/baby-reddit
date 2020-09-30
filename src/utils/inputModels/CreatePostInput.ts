import { InputType, Field } from 'type-graphql';

@InputType()
export class RegistrationInput {
	@Field()
	title: string;
	@Field()
	sub: string;
	@Field()
	post: string;
	@Field()
	media: string;
}
