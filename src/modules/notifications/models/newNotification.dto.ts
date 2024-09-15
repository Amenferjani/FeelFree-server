import { IsString, IsOptional, IsNotEmpty, IsArray, IsMongoId, IsNumber, IsObject, IsDate, IsBoolean } from 'class-validator';
import { ObjectId } from 'mongoose';

export class NotificationDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsMongoId()
    @IsNotEmpty()
    receiver_id: ObjectId;

    @IsDate()
    @IsOptional()
    sendAt: Date;

    @IsOptional()
    @IsBoolean()
    isSeen: boolean;
}
