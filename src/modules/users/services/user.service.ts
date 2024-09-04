import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptJs from 'bcryptjs';
import { IUser } from '../models/user.model';
import { ObjectId } from "mongoose"

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async create(requestData: IUser): Promise<User> {
        const salt = await bcryptJs.genSalt(10);
        const hashedPassword = await bcryptJs.hash(requestData.password, salt);
        const newRequestData = { ...requestData, password: hashedPassword };
        return this.userModel.create(newRequestData);
    }

    async findOneSafe(username: string): Promise<User>{
        const user = await this.userModel.findOne({ username }, { password: 0 });
        if (!user) {
            throw new NotFoundException('');
        }
        return user 
    }

    async findOne(username: string): Promise<User >{
        const user = this.userModel.findOne({ username });
        if (!user) {
            throw new NotFoundException('');
        }
        return user 
    }
    
    async findById(id: ObjectId): Promise<User>{
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('');
        }
        return user;
    }

    async deleteById(id: ObjectId): Promise<User>{
        return await this.userModel.findByIdAndDelete(id);
    }

    async login(requestData: IUser): Promise<User>{
            const user = await this.findOne(requestData.username);
            if (!user) {
                throw new NotFoundException('');
            }
            const isValidPassword = await bcryptJs.compare(requestData.password, user.password);
            if (!isValidPassword) {
                throw new UnauthorizedException('');
            }
            user.password = "";
            return user;
    }
}
