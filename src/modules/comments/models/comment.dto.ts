import { IsNotEmpty, IsOptional, IsString, IsMongoId, IsNumber, IsBoolean } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CommentDto {
    @IsNotEmpty()
    @IsMongoId()
    creator: ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    post: ObjectId;

    @IsOptional()
    @IsMongoId()
    replayedTo: ObjectId;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsNumber()
    boost: number;

    @IsOptional()
    @IsBoolean()
    deleted: boolean;
}
