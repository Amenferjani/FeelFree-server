import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, IsMongoId, IsNumber, IsEmail } from 'class-validator';

export class UserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    // @IsArray()
    // @IsOptional()
    // @IsMongoId()
    // @ApiProperty({ description : "don't use with user creation " })
    // communities?: string[];

    // @IsArray()
    // @IsOptional()
    // @IsMongoId()
    // @ApiProperty({ description : "don't use with user creation " })
    // posts?: string[];

    // @IsObject()
    // @IsOptional()
    // media?: {
    //     videos?: Array<{
    //         data: Buffer;
    //         contentType: string;
    //     }>;

    //     images?: Array<{
    //         data: Buffer;
    //         contentType: string;
    //     }>;
    // };
}
