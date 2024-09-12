import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { PostM } from '../schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongoose"
import { PostDto } from '../models/newPost.dto';
import { IPost } from '../models/post.model';
import { MediaService } from 'src/modules/media/services/media.service';
@Injectable()
export class PostService {
    constructor(@InjectModel(PostM.name)
    private readonly postModel: Model<PostM>,
    private readonly mediaService : MediaService
    ) { }
    
    async create(post: PostDto): Promise<IPost> {
        const newPost = await this.postModel.create(post) 
        return newPost.toObject() as unknown as IPost;
    }

    async findOneById(id: ObjectId): Promise<PostM>{
        const post = this.postModel.findById(id);
        if (!post) {
            throw new NotFoundException('');
        }
        return post 
    }

    async update(body : any) {
        const post = await this.postModel.findById(body.id);

        if (!post) {
            throw new NotFoundException();
        }
        if (post.op.toString() !== body.userId) {
            throw new ForbiddenException();
        }
        if (body.content) {
            post.content = body.content;
        }
        if (body.title) {
            post.title = body.title;
        }
        await post.save();
        return "updated"
    }

    async delete(id: ObjectId , userId: ObjectId) {
        const post = await this.postModel.findById(id);

        if (!post) {
            throw new NotFoundException();
        }
        await this.postModel.findByIdAndDelete(id)
        return {
            message: 'Post deleted successfully',
            userId: userId,
        }
    }

    async updateBoost(id: ObjectId , boost?: number) {
        const post = await this.postModel.findById(id);
        if (!post) {
            throw new NotFoundException('');
        }
        if (boost === undefined || boost === null) {
            post.boost += 1;
        } else {
            post.boost += boost;
        }
        return await post.save();
    }

    async validateOp(id: ObjectId, userId: ObjectId): Promise<Boolean>{
        const post = await this.findOneById(id);
        if (!post) {
            throw new NotFoundException();
        }
        if (post.op.toString() !== userId.toString()) {
            return false
        }
        return true;
    }
}
