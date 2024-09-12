import { IsArray, IsDateString, IsNotEmpty, IsObject, IsOptional, IsString, IsMongoId, IsNumber } from 'class-validator';

export class PostDto {
    @IsMongoId()
    @IsNotEmpty()
    op: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsDateString()
    timestamp?: Date;

    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsOptional()
    @IsNumber()
    comments: number;

    @IsOptional()
    @IsNumber()
    boost: number;

    @IsMongoId()
    @IsNotEmpty()
    community: string;

    @IsObject()
    @IsOptional()
    media?: {
        videos?: Array<any>,
        images?: Array<any>
    };
}
