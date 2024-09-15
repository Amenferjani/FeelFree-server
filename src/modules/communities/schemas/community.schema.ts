import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId} from 'mongoose';

export type CommunityDocument = HydratedDocument<Community>;

@Schema()
export class Community {
    @Prop({ required: true ,unique : true})
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
            logo: {type: mongoose.Schema.Types.Mixed},
            banner: {type: mongoose.Schema.Types.Mixed},
        },default: { logo: "", banner: "" }})
    media: {
        logo: any; 
        banner: any; 
    };

    @Prop({ default: 1 })
    numberOfMembers: number;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);
