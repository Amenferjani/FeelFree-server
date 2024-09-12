import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CommunityService } from '../services/community.service';
import { CommunityDto } from '../models/newCommunity.dto';
import { errorHandler } from 'src/utils/errors/exceptions';
import { Community } from '../schemas/community.schema';
import { ObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/modules/auth/config/guard/jwtAuth.guard';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Communities')
@Controller('community')
export class CommunityController {
    constructor(private readonly communityService: CommunityService) { }

    @Post('create')
    @ApiBody({ type: CommunityDto })
    @ApiResponse({
        status: 201,
        type: Community,
        description: 'Community created successfully',
    })
    @ApiResponse({ status: 400 , description: 'Bad Request' })
    async createCommunity(@Body() community: CommunityDto){
        try {
            return await this.communityService.create(community);
        } catch (error) {
            errorHandler(error)
        }
    }

    @Get('-i')
    @ApiQuery({ name: 'id', type: 'string'})
    @ApiResponse({
        status: 200,
        description: 'Community retrieved successfully',
        type: Community
    })
    @ApiResponse({ status: 404, description: 'Community not found' })
    async getCommunityById(@Query('id') id: ObjectId): Promise<Community> { 
        try {
            return this.communityService.findOneById(id);
        } catch (error) {
            errorHandler(error)
        }
    }

    @Get('-cy')
    @ApiQuery({ name: 'name', type: 'string'})
    @ApiResponse({
        status: 200,
        description: 'Community retrieved successfully',
        type: Community
    })
    @ApiResponse({ status: 404, description: 'Community not found' })
    async getCommunity(@Query('name') name: string): Promise<Community> { 
        try {
            return this.communityService.findOne(name);
        } catch (error) {
            errorHandler(error);
        }
    }

    @Patch(':id/mods')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'id', type: 'string', description: 'Community ID to update' })
    @ApiBody({
        description: 'Add mods',
        schema: {
            type: 'object',
            properties: {
                mods: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Mods added successfully'
    })
    @ApiResponse({ status: 404, description: 'Community not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async addMods(@Param('id') id: ObjectId, @Request() req) {
        const body = {
            mods: req.body.mods,
            userId: req.user.userId, 
        }
        try {
            return this.communityService.addMods(id, body.userId, body.mods);
        } catch (error) {
            errorHandler(error)
        }
    }

    @Patch(':id/mod')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'id', type: 'string', description: 'Community ID to update' })
    @ApiBody({
        description: 'remove mods',
        schema: {
            type: 'object',
            properties: {
                mods: {type: 'string'}
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Mod removed successfully'
    })
    @ApiResponse({ status: 404, description: 'Community not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async removeMod(@Param('id') id: ObjectId, @Request() req) {
        const body = {
            mod: req.body.mod,
            userId: req.user.userId, 
        }
        try {
            return this.communityService.removeMod(id, body.userId, body.mod);
        } catch (error) {
            errorHandler(error)
        }
    }

    @Patch(':id/tags')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'id', type: 'string', description: 'Community ID to update' })
    @ApiBody({
        description: 'Add tags',
        schema: {
            type: 'object',
            properties: {
                tags: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Tags added successfully'
    })
    @ApiResponse({ status: 404, description: 'Community not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async addTags(@Param('id') id: ObjectId, @Request() req) {
        const body = {
            tags: req.body.tags,
            userId: req.user.userId, 
        }
        try {
            return this.communityService.addTags(id, body.userId, body.tags);
        } catch (error) {
            errorHandler(error)
        }
    }

    @Patch(':id/tag')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'id', type: 'string', description: 'Community ID to update' })
    @ApiBody({
        description: 'Add tags',
        schema: {
            type: 'object',
            properties: {
                tags: {type: 'string'}
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Tag removed successfully'
    })
    @ApiResponse({ status: 404, description: 'Community not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async removeTag(@Param('id') id: ObjectId, @Request() req) {
        const body = {
            tag: req.body.tag,
            userId: req.user.userId, 
        }
        try {
            return this.communityService.removeTag(id, body.userId, body.tag);
        } catch (error) {
            errorHandler(error)
        }
    }

    @Delete('-i')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiQuery({ name: 'id', type: 'string', description: 'Community ID to delete' })
    @ApiResponse({
        status: 200,
        description: 'community is deleted successfully'
    })
    @ApiResponse({ status: 404, description: 'Community not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async deleteCommunity(@Param('id') id: ObjectId, @Request() req) {
        const userId = req.user.userId;
        try {
            return this.communityService.delete(id,userId);
        } catch (error) {
            errorHandler(error)
        }
    }
}
