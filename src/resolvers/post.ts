import {Arg, Ctx, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware} from 'type-graphql';
import {Post} from '../entities/Post';
import {isUserAuth} from '../middleware/isUserAuth';
import {MyContext} from '../types';
import {PostResponse} from '../utils/responseModels/PostResponse';

@InputType()
class PostInput
{
    @Field()
    title: string
    @Field()
    text: string
    @Field()
    media?: string
    @Field()
    sub?: string
}
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
	@Mutation(() => PostResponse)
    @UseMiddleware(isUserAuth)
	async createPost(
        @Arg("input") input: PostInput,
        @Ctx() {req}: MyContext
    ): Promise<PostResponse | Post>
    {
        if (!input.sub) {
            return {
                errors: [
                    {
                        field: "sub",
                        message: "sub cannot be null"
                }]
            }
        }
        return  Post.create({
                ...input,
                creatorId: req.session!.userId,
            }).save()
	}
    @Mutation(() => Post)
    @UseMiddleware(isUserAuth)
	async updatePost(
		@Arg('id', () => Int) id: number,
		@Arg("details") details: PostInput,
	): Promise<Post | null> {
		const postExists = await Post.findOne(id)
		if (!postExists) {
			return null;
		}
        if (typeof details.title !== 'undefined') {
            await Post.update({id}, details);
		}
		return postExists
	}
	@Mutation(() => Boolean)
    @UseMiddleware(isUserAuth)
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
