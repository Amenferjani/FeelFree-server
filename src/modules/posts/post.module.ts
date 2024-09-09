import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostM, PostSchema } from './schemas/post.schema';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { UserService } from '../users/services/user.service';
import { UserModule } from '../users/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PostM.name, schema: PostSchema }]),
        UserModule
    ],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
