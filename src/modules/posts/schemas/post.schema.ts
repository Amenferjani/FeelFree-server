import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId} from 'mongoose';

export type PostDocument = HydratedDocument<PostM>;

@Schema()
export class PostM {
    @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
    op: ObjectId;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    title: string;

    @Prop({ type: Date, default: Date.now })
    timestamp: Date;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ required: true ,default: 0})
    comments: number;

    @Prop({ required: true ,default: 0})
    boost: number;

    @Prop({ ref: 'Community', type: mongoose.Schema.Types.ObjectId })
    community: ObjectId

    @Prop({type: {
            videos: [{type: mongoose.Schema.Types.Mixed }],
            images: [{type: mongoose.Schema.Types.Mixed }],
        },default: { videos: [], images: [] }})
    media: {
        videos: {type: mongoose.Schema.Types.Mixed }[];
        images: {type: mongoose.Schema.Types.Mixed }[];
    };
}

export const PostSchema = SchemaFactory.createForClass(PostM);
