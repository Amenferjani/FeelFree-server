import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { PostDto } from '../models/newPost.dto';
import { PostM } from '../schemas/post.schema';
import { errorHandler } from 'src/utils/errors/exceptions';
import { ObjectId } from 'mongoose';
import { UserService } from 'src/modules/users/services/user.service';
import { JwtAuthGuard } from 'src/modules/auth/config/guard/jwtAuth.guard';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly userService: UserService
    ) { }
    @Post('create')
    @ApiBody({ type: PostDto })
    @ApiResponse({
        status: 201,
        description: 'Post created successfully',
        type: PostM
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async createPost(@Body() post: PostDto) {
        try {
            const postResult = await this.postService.create(post);
            const request = {
                id: postResult.op,
                postId: postResult._id
            };
            return await this.userService.addPost(request.id, request.postId);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Get('-i')
    @ApiQuery({ name: 'id', type: 'string', description: 'Post ID' })
    @ApiResponse({
        status: 200,
        description: 'Post retrieved successfully',
        type: PostM
    })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async getPostById(@Query('id') id: ObjectId): Promise<PostM> {
        try {
            return this.postService.findOneById(id);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Patch('')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'id', type: 'string', description: 'Post ID to update' })
    @ApiBody({
        description: 'Updated post content',
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                content: { type: 'string' }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Post updated successfully',
        type: PostM
    })
    @ApiResponse({ status: 404, description: 'Post not found' })
    @ApiResponse({ status: 403, description: 'ForbiddenException' })
    async updatePost(@Query('id') id: ObjectId, @Request() req) {
        const body = {
            title: req.body.title,
            content: req.body.content,
            id: id,
            userId: req.user.userId
        };
        try {
            return this.postService.update(body);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Patch(':id/boost')
    @ApiParam({
        name: 'id',
        description: 'Post ID to update the boost value',
        type: 'string'
    })
    @ApiBody({
        description: 'Boost value to update',
        schema: {
            type: 'object',
            properties: {
                boost: { type: 'number' }
            },
            required: ['boost']
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Boost value updated successfully',
        type: PostM
    })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async updateBoost(@Param('id') id: ObjectId, @Body() boost?: number) {
        try {
            return this.postService.updateBoost(id, boost);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Delete('')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({
        name: 'id',
        description: 'ID of the post to delete',
        type: 'string'
    })
    @ApiResponse({
        status: 200,
        description: 'Post deleted successfully'
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async deletePost(@Query('id') id: ObjectId, @Request() req) {
        const userId = req.user.userId;
        try {
            if (!await this.postService.validateOp(id, userId)) {
                throw new UnauthorizedException();
            }
            await this.userService.removePost(userId, id);
            return await this.postService.delete(id, userId);
        } catch (error) {
            errorHandler(error);
        }
    }
}

