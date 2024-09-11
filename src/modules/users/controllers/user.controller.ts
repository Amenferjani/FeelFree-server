import { Body, Controller, Delete, Get, Post, Query, UseGuards} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { IUser } from '../models/user.model';
import { User } from '../schemas/user.schema';
import { ObjectId } from "mongoose"
import { errorHandler } from 'src/utils/errors/exceptions';
import { JwtAuthGuard } from 'src/modules/auth/config/guard/jwtAuth.guard';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../models/newUser.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('signup')
    @ApiBody({ type: UserDto })
    @ApiResponse({
        status: 201,
        description: 'User created successfully',
        type: User,
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async createUser(@Body() createUser: UserDto): Promise<User> {
        try {
            return await this.userService.create(createUser);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Get('-i')
    @ApiQuery({ name: 'id', type: 'string'})
    @ApiResponse({
        status: 200,
        description: 'User retrieved successfully',
        type: User
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserById(@Query('id') id: ObjectId): Promise<User>{
        try {
            return await this.userService.findById(id);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Get('-u')
    @ApiQuery({ name: 'username', type: 'string'})
    @ApiResponse({
        status: 200,
        description: 'User retrieved successfully',
        type: User
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUser(@Query('username') username: string): Promise<User> { 
        try {
            const user = await this.userService.findOneSafe(username);
            return user;
        } catch (error) {
            errorHandler(error);
        }
    }

    @Delete('-i')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'id', type: 'string'})
    @ApiResponse({
        status: 200,
        description: 'User deleted successfully',
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async deleteById(@Query('id') id: ObjectId){
        try {
            return await this.userService.deleteById(id);
        } catch (error) {
            errorHandler(error);
        }
    }
}
