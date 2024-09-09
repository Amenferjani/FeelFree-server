import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId} from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
    @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
    creator: ObjectId;

    @Prop({ ref: 'Post', type: mongoose.Schema.Types.ObjectId })
    post: ObjectId;

    @Prop({ ref: 'Comment', type: mongoose.Schema.Types.ObjectId ,default: null})
    replayedTo: ObjectId;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true ,default: 0})
    boost: number;

    @Prop({ type: Date, default: Date.now })
    timestamp: Date;

    @Prop({ type: Boolean, default: false })
    deleted: boolean;

}

export const CommentSchema = SchemaFactory.createForClass(Comment);
