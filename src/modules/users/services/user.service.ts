import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptJs from 'bcryptjs';
import { IUser } from '../models/user.model';
import { ObjectId } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async create(requestData: IUser): Promise<User> {
        const existingUser = await this.userModel.findOne({ username: requestData.username });

        if (existingUser) {
            throw new BadRequestException('');
        }
        const salt = await bcryptJs.genSalt(10);
        const hashedPassword = await bcryptJs.hash(requestData.password, salt);
        const newRequestData = { ...requestData, password: hashedPassword };
        return this.userModel.create(newRequestData);
    }

    async findOneSafe(username: string): Promise<User> {
        const user = await this.userModel.findOne({ username }, { password: 0 });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findOne(username: string): Promise<User> {
        const user = await this.userModel.findOne({ username });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findById(id: ObjectId): Promise<User> {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async deleteById(id: ObjectId): Promise<User> {
        return await this.userModel.findByIdAndDelete(id);
    }

    async addPost(id: ObjectId, postId: ObjectId) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.posts = [...user.posts, postId]
        await user.save()
        return {
            message: 'Post added to user',
            user: id,
            postId : postId,
        };
    }

    async removePost(id: ObjectId, postId: ObjectId) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!user.posts.includes(postId)) {
            throw new NotFoundException('');
        }

        user.posts = user.posts.filter(post => post.toString() !== postId.toString());
        user.save();
        return ;
    }

    async addComment(id: ObjectId, commentId: ObjectId) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.comments.push( commentId );
        return
    }

    async removeComment(id: ObjectId, commentId: ObjectId) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!user.comments.includes(commentId)) {
            throw new NotFoundException('');
        }

        user.comments = user.comments.filter(comment => comment.toString() !== commentId.toString());
        user.save();
        return ;
    }
}
