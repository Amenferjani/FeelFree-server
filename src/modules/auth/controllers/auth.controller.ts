import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { IUser } from 'src/modules/users/models/user.model';
import { errorHandler } from 'src/utils/errors/exceptions';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefreshJwtAuthGuard } from '../config/guard/refresh-jwt-auth.guard';
import { join } from 'path';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiBody({
        description: 'User credentials for login',
        type: 'object',
        schema: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                password: { type: 'string' },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Successful login',
        schema: {
            type: 'object',
            properties: {
                _id:{type: 'string'},
                username: {type: 'string'},
                lastName: {type: 'string'},
                firstName:{type: 'string'},
                email: {type: 'string'},
                access_token: { type: 'string' },
                refresh_token: { type: 'string' },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body() loginData: IUser): Promise<any> {
        try {
            const user = await this.authService.validateUser(loginData.username, loginData.password);
            return this.authService.login(user);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Post('refresh-token')
    @UseGuards(RefreshJwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'refresh-token' })
    @ApiBody({
        description: ' credentials for refreshing access token',
        type: 'object',
        schema: {
            type: 'object',
            properties: {
                refreshToken: {type: 'string'},
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Successful token refreshing',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string' },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async refreshToken(@Body('refreshToken') refreshToken: string) {
        try {
            return this.authService.refreshToken(refreshToken);
        } catch (error) {
            errorHandler(error);
        }
    }
}
