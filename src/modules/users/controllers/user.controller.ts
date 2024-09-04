import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Post, Query, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { IUser } from '../models/user.model';
import { User } from '../schemas/user.schema';
import { ObjectId } from "mongoose"
import { errorHandler } from 'src/utils/exceptions';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    @Post('signup')
    async createUser(@Body() createUser: IUser): Promise<User> {
        try {
            return await this.userService.create(createUser);;
        } catch (error) {
            errorHandler(error);
        }
    }
    @Get('-i')
    async getUserById(@Query('id') id: ObjectId): Promise<IUser>{
        try {
            return await this.userService.findById(id);
        } catch (error) {
            errorHandler(error);
        }
    }
    @Delete('-i')
    // @HttpCode(HttpStatus.NO_CONTENT)
    async deleteById(@Query('id') id: ObjectId){
        try {
            return await this.userService.deleteById(id);
        } catch (error) {
            errorHandler(error);
        }
    }
    @Get('-u')
    async getUser(@Query('username') username: string): Promise<IUser> { 
        try {
            const user = await this.userService.findOneSafe(username);
            return user;
        } catch (error) {
            errorHandler(error);
        }
    }
    @Post('login')
    async getInfo(@Body() User: IUser): Promise<User> {
        try {
            return await this.userService.login(User);
        } catch (error) {
            errorHandler(error);
        }
    }
}