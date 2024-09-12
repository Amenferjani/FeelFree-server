import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId} from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
@Prop({ required: true , unique : true})
    username: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ type: mongoose.Schema.Types.Mixed })
    profilePicture?: any; 

    @Prop({ required: true , unique : true})
    password: string;
    
    @Prop({default : []})
    communities :ObjectId[]

    @Prop({default : []})
    posts :ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User);
