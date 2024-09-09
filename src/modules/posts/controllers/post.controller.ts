import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PostService } from '../services/post.service';
import { PostDto } from '../models/newPost.dto';
import { PostM } from '../schemas/post.schema';
import { errorHandler } from 'src/utils/exceptions';
import { ObjectId } from 'mongoose';
import { UserService } from 'src/modules/users/services/user.service';
import { JwtAuthGuard } from 'src/modules/auth/config/guard/jwtAuth.guard';

@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly userService: UserService
    ) { }
    @Post('create')
    async createPost(@Body() post: PostDto) {
        try {
            const postResult =await this.postService.create(post)
            const request = {
                id: postResult.op,
                postId : postResult._id
            }
            return await this.userService.addPost(request.id , request.postId )
        } catch (error) {
            errorHandler(error);
        }
    }

    @Get('-i')
    async getPostById(@Query('id') id: ObjectId): Promise<PostM> {
        try {
            return this.postService.findOneById(id);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Patch('')
    @UseGuards(JwtAuthGuard)
    async updatePost(@Query('id') id: ObjectId, @Request() req) {
        const body = {
            title: req.body.title,
            content: req.body.content,
            id: id ,
            userId : req.user.userId
        };
        try {
            return this.postService.update(body);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Patch(':id/boost')
    async updateBoost(@Param('id') id: ObjectId, @Body() boost?: number) {
        try {
            return this.postService.updateBoost(id, boost);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Delete('')
    @UseGuards(JwtAuthGuard)
    async deletePost(@Query('id') id: ObjectId, @Request() req) {
        const userId = req.user.userId;
        try {
            if (!await this.postService.validateOp(id, userId)) {
                throw new UnauthorizedException();
            }
            await this.userService.removePost(userId, id);
            return await this.postService.delete(id ,userId);
        } catch (error) {
            errorHandler(error)
        }
    }
}

