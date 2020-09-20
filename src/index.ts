import { MikroORM } from '@mikro-orm/core';
import 'reflect-metadata';
import { COOKIE_NAME, SESSION_SECRET, _prod_ } from './constants';
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';
import cors from 'cors';

const main = async () => {
	const orm = await MikroORM.init(microConfig);
	await orm.getMigrator().up();
	const app = express();
	const RedisStore = connectRedis(session);
	const redisClient = redis.createClient();
	app.use(
		cors({
			credentials: true,
			origin: 'http://localhost:3000',
		}),
	);
	app.use(
		session({
			name: COOKIE_NAME,
			store: new RedisStore({
				client: redisClient,
				disableTouch: true,
			}),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24, // 1 day
				httpOnly: true,
				sameSite: 'lax', // csrf safety, see RFC6265
				secure: _prod_, // cookie only works in https
			},
			saveUninitialized: false,
			secret: SESSION_SECRET,
			resave: false,
		}),
	);
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			validate: false,
		}),
		context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
	});
	apolloServer.applyMiddleware({
		app,
		cors: false,
	});
	app.listen(4000, () => {
		console.log('server started on localhost:4000');
	});
};

main().catch((err) => {
	console.error(err);
});
