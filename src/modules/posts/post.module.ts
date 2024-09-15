import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostM, PostSchema } from './schemas/post.schema';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { UserModule } from '../users/user.module';
import { MediaModule } from '../media/media.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: PostM.name, schema: PostSchema }]),
        UserModule,
        MediaModule,
    ],
    controllers: [PostController],
    providers: [PostService],
    exports:[PostService]
})
export class PostModule {}
