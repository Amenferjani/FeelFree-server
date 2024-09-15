import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/users/user.module';
import { CommunityModule } from './modules/communities/community.module';
import { PostModule } from './modules/posts/post.module';
import { CommentModule } from './modules/comments/comment.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster.f4rts7w.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`,
    ),
    UserModule,
    CommunityModule,
    PostModule,
    CommentModule,
    AuthModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
