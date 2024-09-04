import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId} from 'mongoose';

export type CommunityDocument = HydratedDocument<Community>;

@Schema()
export class Community {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true ,default : ""})
    description: string;

    @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
    creator: ObjectId;

    @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId ,default: []})
    mods: ObjectId[];

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({type: {
            logo: {data: { type: Buffer },contentType: { type: String }},
            banner: {data: { type: Buffer },contentType: { type: String }},
        },default: { logo: "", banner: "" }})
    media: {
        logo: {data: Buffer;contentType: string};
        banner: {data: Buffer;contentType: string};
    };

    @Prop({ default: 1 })
    numberOfMembers: number;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);
