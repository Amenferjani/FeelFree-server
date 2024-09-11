import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptJs from 'bcryptjs';
import { ObjectId } from 'mongoose';
import { UserDto } from '../models/newUser.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async create(requestData: UserDto): Promise<User> {
        const existingUsername = await this.userModel.findOne({ username: requestData.username });

        if (existingUsername) {
            throw new BadRequestException('Username already exists');
        }
        const existingUserEmail = await this.userModel.findOne({ email: requestData.email });

        if (existingUserEmail) {
            throw new BadRequestException('Email already exists');
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

    //!!! for post controller :

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

    //!!! for community controller :

    async addCommunity(id: ObjectId, communityId: ObjectId) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.communities.push( communityId );
        return
    }

    async removeCommunity(id: ObjectId, communityId: ObjectId) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!user.communities.includes(communityId)) {
            throw new NotFoundException('');
        }

        user.communities = user.communities.filter(
            community => community.toString() !== communityId.toString()
        );
        user.save();
        return ;
    }
}
