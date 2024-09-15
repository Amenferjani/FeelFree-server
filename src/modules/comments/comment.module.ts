import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    EventsModule],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
