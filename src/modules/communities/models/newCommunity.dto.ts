import { IsString, IsOptional, IsNotEmpty, IsArray, IsMongoId, IsNumber, IsObject } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CommunityDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsMongoId()
    @IsNotEmpty()
    creator: ObjectId;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    mods: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @IsObject()
    @IsOptional()
    media: {
        logo: any,
        banner: any
    };

    @IsOptional()
    @IsNumber()
    numberOfMembers: number;
}
