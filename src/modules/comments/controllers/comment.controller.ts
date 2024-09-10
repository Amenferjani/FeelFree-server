import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { CommentDto } from '../models/comment.dto';
import { Comment } from '../schemas/comment.schema';
import { errorHandler } from 'src/utils/errors/exceptions';
import { ObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/modules/auth/config/guard/jwtAuth.guard';
import { ApiBody, ApiResponse, ApiTags, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post('create')
    @ApiBody({ type: CommentDto, description: 'Add a new comment' })
    @ApiResponse({
        status: 200,
        description: 'Successful',
        type: Comment
    })
    async createComment(@Body() comment: CommentDto): Promise<Comment> {
        try {
            return this.commentService.create(comment); 
        } catch (error) {
            errorHandler(error)
        }
    }

    @Get(':id')
    @ApiParam({
        name: 'id',
        description: 'Comment ID',
        type: 'string'
    })
    @ApiResponse({
        status: 200,
        description: 'Successful',
        type: Comment
    })
    @ApiResponse({ status: 404, description: 'Not Found' })
    async getCommentById(@Param('id') id: ObjectId): Promise<Comment> {
        try {
            return this.commentService.findOneById(id);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Get('all/')
    @ApiQuery({
        name: 'id',
        description: 'Post ID to get all comments',
        type: 'string'
    })
    @ApiResponse({
        status: 200,
        description: 'Successful',
        type: [Comment]
    })
    async getAllCommentsByPost(@Query('id') id: ObjectId): Promise<Comment[]> {
        try {
            return this.commentService.findAllByPost(id);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Get('relatedCommentsTo/:id')
    @ApiParam({
        name: 'id',
        description: 'Comment ID to get related comments',
        type: 'string'
    })
    @ApiResponse({
        status: 200,
        description: 'Successful',
        type: [Comment]
    })
    async getRelatedComments(@Param('id') id: ObjectId): Promise<Comment[]> {
        try {
            return this.commentService.getRelatedComments(id);
        } catch (error) {
            console.log(error);
        }
    }

    @Patch(':id/boost')
    @ApiParam({
        name: 'id',
        description: 'Comment ID',
        type: 'string'
    })
    @ApiBody({
    description: 'Boost value to update',
    schema: {
        type: 'object',
            properties: {
                boost: { type: 'number', example: 1 }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Boost value updated successfully'
    })
    @ApiResponse({ status: 404, description: 'Not Found' })
    async updateBoost(@Param('id') id: ObjectId, @Body() boost?: number) {
        try {
            return this.commentService.updateBoost(id, boost);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiParam({
        name: 'id',
        description: 'Comment ID to update',
        type: 'string'
    })
    @ApiBody({
        description: 'Updated comment content',
        schema: {
            type: 'object',
            properties: {
                content: { type: 'string' }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Comment updated successfully',
        type: Comment
    })
    @ApiResponse({ status: 404, description: 'Not Found' })
    async updateComment(@Param('id') id: ObjectId, @Request() req) {
        const body = {
            id: id,
            content: req.body.content,
            userId: req.user.userId
        };
        try {
            return this.commentService.update(body);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiParam({
        name: 'id',
        description: 'Comment ID to delete',
        type: 'string'
    })
    @ApiResponse({
        status: 200,
        description: 'Comment deleted successfully'
    })
    @ApiResponse({ status: 404, description: 'Not Found' })
    async deletePost(@Param('id') id: ObjectId, @Request() req) {
        const body = {
            id: id,
            userId: req.user.userId
        };
        try {
            return this.commentService.delete(body);
        } catch (error) {
            errorHandler(error);
        }
    }
}