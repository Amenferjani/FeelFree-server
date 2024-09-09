import { Body, Controller, Delete, Get, Param, Patch, Post , Query, UseGuards,Request  } from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { CommentDto } from '../models/comment.dto';
import { Comment } from '../schemas/comment.schema';
import { errorHandler } from 'src/utils/exceptions';
import { ObjectId} from 'mongoose';
import { JwtAuthGuard } from 'src/modules/auth/config/guard/jwtAuth.guard';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }
    @Post('create')
    async createComment(@Body() comment: CommentDto): Promise<Comment> {
        try {
            return this.commentService.create(comment); 
        } catch (error) {
            errorHandler(error)
        }
    }

    @Get('-i')
    async getCommentById(@Query('id') id: ObjectId): Promise<Comment> {
        try {
            return this.commentService.findOneById(id);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Get('All/')
    async getAllComments(@Query('id') id: ObjectId): Promise<Comment[]> {
        try {
            return this.commentService.findAllByPost(id);
        } catch (error) {
            errorHandler(error)
        }
    }

    @Patch(':id/boost')
    async updateBoost(@Param('id') id: ObjectId, @Body() boost?: number) {
        try {
            return this.commentService.updateBoost(id, boost);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Patch('-i')
    @UseGuards(JwtAuthGuard)
    async updateComment(@Query('id') id: ObjectId, @Request() req) {
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

    @Delete('-i')
    @UseGuards(JwtAuthGuard)
    async deletePost(@Query('id') id: ObjectId, @Request() req) {
        const body = {
            id: id,
            userId: req.user.userId
        };
        try {
            return this.commentService.delete(body);
        } catch (error) {
            errorHandler(error)
        }
    }
}

