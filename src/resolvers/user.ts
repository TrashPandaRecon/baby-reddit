import { Resolver, Mutation, Arg, Ctx, Query } from 'type-graphql';
import { isValid } from 'mailchecker';
import argon2 from 'argon2';
import { User } from '../entities/User';
import { MyContext } from '../types';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import { validateRegister } from '../utils/validation/Register';
import { RegistrationInput } from '../utils/inputModels/RegistrationInput';
import { UserResponse } from '../utils/responseModels/UserResponse';
import { UserExists } from '../utils/validation/UserExists';
import { UserDoesntExists } from '../utils/validation/UserDoesntExist';
import { EmailExists } from '../utils/validation/EmailExists';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';
import { Password } from '../utils/validation/Password';
import { getConnection } from 'typeorm';

@Resolver()
export class UserResolver {
	@Mutation(() => UserResponse)
	async changePassword(
		@Arg('token') token: string,
		@Arg('password') password: string,
		@Arg('reenterPassword') reenterPassword: string,
		@Ctx() { redis, req }: MyContext,
	): Promise<UserResponse> {
		const isPassword = Password(password, reenterPassword);
		if (isPassword != null) {
			return isPassword;
		}
		const key = FORGET_PASSWORD_PREFIX + token;
		const userId = await redis.get(key);
		if (userId == null) {
			return {
				errors: [
					{
						field: 'token',
						message: 'Token has expired.',
					},
				],
			};
		}
		const userIntId = parseInt(userId);
		const user = await User.findOne(userIntId);
		if (user == null) {
			return {
				errors: [
					{
						field: 'token',
						message: 'User does not exist.',
					},
				],
			};
		}
		await User.update(
			{ id: userIntId },
			{ password: await argon2.hash(password) },
		);
        // deletes key that enables the user with said key to reset password    
		redis.del(key);
		// logs the user in
		req.session!.userId = user.id;
		return {
			user,
		};
	}

	@Mutation(() => Boolean)
	async forgotPassword(
		@Arg('email') email: string,
		@Ctx() { redis }: MyContext,
	) {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return true;
		}
		const token = v4();
		await redis.set(
			FORGET_PASSWORD_PREFIX + token,
			user.id,
			'ex',
			1000 * 60 * 60 * 2,
		); // 2 hours
		sendEmail(
			email,
			`<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`,
			'BabyReddit: Change Password',
		);
		return true;
	}
	@Query(() => User, { nullable: true })
	me(@Ctx() { req }: MyContext) {
		if (!req.session!.userId) {
			return null;
		}
		return User.findOne(req.session!.userId);
	}
	@Mutation(() => UserResponse)
	async register(
		@Arg('input') input: RegistrationInput,
		@Ctx() { req }: MyContext,
	): Promise<UserResponse> {
		const passed = validateRegister(input);
		if (passed) {
			return passed;
		}
		const usernameExists = UserExists(
			await User.findOne({ where: { username: input.username } }),
		);
		if (usernameExists) {
			return usernameExists;
		}
		const emailExists = EmailExists(
			await User.findOne({ where: { email: input.email.toLowerCase() } }),
		);
		if (emailExists) {
			return emailExists;
		}
        const hashedPassword = await argon2.hash(input.password);
        let user;
        try {
            // const result = await User.create({
			// 	username: input.username,
			// 	password: hashedPassword,
			// 	email: input.email,
			// }).save();
			const result = await getConnection()
				.createQueryBuilder()
				.insert()
				.into(User)
				.values({
					username: input.username,
					password: hashedPassword,
					email: input.email,
				})
				.returning('*')
                .execute();
            user = result.raw[0]
		} catch (err) {
			console.error(err.message);
        }
        req.session!.userId = user.id
		return { user };
	}
	@Mutation(() => UserResponse)
	async login(
		@Arg('usernameOrEmail') usernameOrEmail: string,
		@Arg('password') password: string,
		@Ctx() { req }: MyContext,
	): Promise<UserResponse> {
		const user = await User.findOne({
			where: isValid(usernameOrEmail)
				? { email: usernameOrEmail.toLowerCase() }
				: { username: usernameOrEmail },
		});
		const exists = UserDoesntExists(user);
		if (exists) {
			return exists;
		}

		const verify = await argon2.verify(user!.password, password);
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

		req.session!.userId = user!.id;
		return {
			user,
		};
	}
	@Mutation(() => Boolean)
	logout(@Ctx() { req, res }: MyContext) {
		return new Promise((resolve) =>
			req.session?.destroy((err) => {
				res.clearCookie(COOKIE_NAME);
				if (err) {
					console.log(err);
					resolve(false);
					return;
				}

				resolve(true);
			}),
		);
	}
}
