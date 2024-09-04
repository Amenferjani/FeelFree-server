import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from "mongoose"
@Injectable()
export class PostService {
    constructor(@InjectModel(Post.name) private postModel: Model<Post>) { }
    
}
