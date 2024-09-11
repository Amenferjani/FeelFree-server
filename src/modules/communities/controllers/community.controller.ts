import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CommunityService } from '../services/community.service';
import { CommunityDto } from '../models/newCommunity.dto';
import { errorHandler } from 'src/utils/errors/exceptions';
import { Community } from '../schemas/community.schema';
import { ObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/modules/auth/config/guard/jwtAuth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('community')
export class CommunityController {
    constructor(private readonly communityService: CommunityService) { }

    @Post('create')
    async createCommunity(@Body() community: CommunityDto){
        try {
            return await this.communityService.create(community);
        } catch (error) {
            errorHandler(error)
        }
    }

    @Get('-i')
    async getCommunityById(@Query('id') id: ObjectId): Promise<Community> { 
        try {
            return this.communityService.findOneById(id);
        } catch (error) {
            errorHandler(error)
        }
    }

    @Get('-cy')
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
    async removeMod(@Param('id') id: ObjectId, @Body() mod: ObjectId, @Request() req) {
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
    async deleteCommunity(@Param('id') id: ObjectId, @Request() req) {
        const userId = req.user.userId;
        try {
            return this.communityService.delete(id,userId);
        } catch (error) {
            errorHandler(error)
        }
    }
}
