import { _prod_ } from './constants';
import { Post } from './entities/Post';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { User } from './entities/User';

export default {
	migrations: {
		path: path.join(__dirname, './migrations'), // path to the folder with migrations
		pattern: /^[\w-]+\d+\.[jt]s$/,
	},
	entities: [Post, User],
	dbName: 'redditClone',
	type: 'postgresql',
	debug: !_prod_,
	user: 'postgres',
	password: 'postgres',
} as Parameters<typeof MikroORM.init>[0];
