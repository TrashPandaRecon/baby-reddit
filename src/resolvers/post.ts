import {Arg, Int, Mutation, Query, Resolver} from 'type-graphql';
import {Post} from '../entities/Post';

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	async posts(): Promise<Post[]> {
		return Post.find();
	}
	@Query(() => Post, { nullable: true })
	post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
		return Post.findOne(id);
	}
	@Mutation(() => Post)
	async createPost(
		@Arg('title') title: string,
		@Arg('post') post: string,
		@Arg('media') media: string,
		@Arg('sub') sub: string,
	): Promise<Post> {
		return Post.create({ title, post, media, sub }).save();
	}
	@Mutation(() => Post)
	async updatePost(
		@Arg('id', () => Int) id: number,
		@Arg('title', () => String) title: string,
		@Arg('post') post: string,
		@Arg('media') media: string,
		@Arg('sub') sub: string,
	): Promise<Post | null> {
		const postExists = await Post.findOne(id)
		if (!postExists) {
			return null;
		}
        if (typeof title !== 'undefined') {
            await Post.update({id}, {title, post, media, sub});
		}
		return postExists
	}
	@Mutation(() => Boolean)
	async deletePost(
		@Arg('id', () => Int) id: number,
	): Promise<boolean> {
		try {
			await Post.delete(id)
			return true;
		} catch {
			return false;
		}
	}
}
