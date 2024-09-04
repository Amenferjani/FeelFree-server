import { IsString, IsOptional, IsNotEmpty, IsArray, IsMongoId, IsNumber, IsObject } from 'class-validator';

export class CreateCommunityDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsMongoId()
    @IsNotEmpty()
    creator: string;

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
        logo: {
            data: Buffer;
            contentType: string;
        };
        banner: {
            data: Buffer;
            contentType: string;
        };
    };

    @IsOptional()
    @IsNumber()
    numberOfMembers: number;
}
