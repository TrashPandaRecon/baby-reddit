import {
	Resolver,
	Mutation,
	Arg,
	InputType,
	Field,
	Ctx,
	ObjectType,
	Query,
} from 'type-graphql';
import argon2 from 'argon2';
import { User } from '../entities/User';
import { MyContext } from '../types';
import { COOKIE_NAME } from '../constants';

@InputType()
class UsernamePasswordInput {
	@Field()
	username: string;
	@Field()
	password: string;
}
@ObjectType()
class FieldError {
	@Field()
	field: string;
	@Field()
	message: string;
}
@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];
	@Field(() => User, { nullable: true })
	user?: User;
}
@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	async me(@Ctx() { req, em }: MyContext) {
		if (!req.session!.userId) {
			return null;
		}
		const user = await em.findOne(User, { id: req.session!.userId });
		return user;
	}
	@Mutation(() => UserResponse)
	async register(
		@Arg('input') input: UsernamePasswordInput,
		@Ctx() { em, req }: MyContext
	): Promise<UserResponse> {
		if (input.username.length <= 2) {
			return {
				errors: [
					{
						field: 'username',
						message:
							'Username must be more than 2 characters long.',
					},
				],
			};
		}
		if (input.password.length <= 4) {
			return {
				errors: [
					{
						field: 'password',
						message:
							'Username must be more than 4 characters long.',
					},
				],
			};
		}
		const userExists = await em.findOne(User, { username: input.username });
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
		const hashedPassword = await argon2.hash(input.password);
		const user = em.create(User, {
			username: input.username,
			password: hashedPassword,
		});
		try {
			await em.persistAndFlush(user);
		} catch (err) {
			console.error(err.message);
		}
		//login user
		req.session!.userId = user.id;
		return { user };
	}
	@Mutation(() => UserResponse)
	async login(
		@Arg('input') input: UsernamePasswordInput,
		@Ctx() { em, req }: MyContext
	): Promise<UserResponse> {
		const user = await em.findOne(User, { username: input.username });
		if (!user) {
			return {
				errors: [
					{
						field: 'username',
						message: 'Username does not exist.',
					},
				],
			};
		}
		const verify = await argon2.verify(user.password, input.password);
		if (!verify) {
			return {
				errors: [
					{
						field: 'password',
						message: 'Password is incorrect.',
					},
				],
			};
		}
		req.session!.userId = user.id;
		return {
			user,
		};
        }
        @Mutation(() => Boolean)
        logout(@Ctx() {req,res}: MyContext){
                return new Promise((resolve) =>
                        req.session?.destroy((err) =>
                        {
                                res.clearCookie(COOKIE_NAME);
                                if (err) {
                                        console.log(err)
                                        resolve(false)
                                        return
                                }
                        
                                resolve(true)
                        })
                );
                
                
        }
}
