import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId} from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    receiver_id: mongoose.Types.ObjectId;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true, default: false })
    isSeen: boolean;

    @Prop({ required: true ,default: Date.now()})
    sendAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
