import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../schemas/comment.schema';
import { Model, ObjectId } from 'mongoose';
import { CommentDto } from '../models/comment.dto';

@Injectable()
export class CommentService {
    constructor(@InjectModel('Comment') private readonly commentModel: Model<Comment>) {}
    
    async create(requestData: CommentDto): Promise<Comment> {
        const newComment = new this.commentModel(requestData);
        return newComment.save();
    }

    async findOneById(id: ObjectId): Promise<Comment>{
        const comment = this.commentModel.findById(id).lean();
        if (!comment) {
            throw new NotFoundException();
        }
        return comment;
    }

    async findAllByPost(postId: ObjectId): Promise<Comment[]>{
        const comments = this.commentModel.find({ post : postId ,replayedTo : null}).lean();
        return comments;
    }

    async getRelatedComments(id: ObjectId): Promise<Comment[]>{
        const comments = this.commentModel
            .find({ replayedTo: id})
            .sort({ timestamp: -1 })
            .lean()
            .exec();
        if (!comments) {
            throw new NotFoundException();
        }
        return comments
    }

    async update(body : any) {
        const comment = await this.commentModel.findById(body.id);

        if (!comment) {
            throw new NotFoundException();
        }
        if (comment.creator.toString() !== body.userId) {
            throw new ForbiddenException();
        }
        if (body.content) {
            comment.content = body.content;
        }
        return await comment.save();
    }

    async updateBoost(id: ObjectId , boost?: number) {
        const comment = await this.commentModel.findById(id);
        if (!comment) {
            throw new NotFoundException('');
        }
        if (boost === undefined || boost === null) {
            comment.boost += 1;
        } else {
            comment.boost += boost;
        }
        await comment.save();
        return 
    }

    async delete(body: any) {
        const comment = await this.commentModel.findById(body.id);
        if (!comment) {
            throw new NotFoundException('');
        }
        if (comment.creator.toString() !== body.userId) {
            throw new ForbiddenException();
        }
        comment.deleted = true;
        await comment.save();
        return;
    }
}
