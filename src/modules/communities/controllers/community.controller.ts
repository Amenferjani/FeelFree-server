import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CommunityService } from '../services/community.service';
import { CommunityDto } from '../dto/newCommunity.dto';
import { errorHandler } from 'src/utils/exceptions';
import { Community } from '../schemas/community.schema';
import { ObjectId } from 'mongoose';

@Controller('community')
export class CommunityController {
    constructor(private readonly communityService: CommunityService) { }
    @Post('create')
    async createCommunity(@Body() community: CommunityDto): Promise<Community> {
        try {
            return this.communityService.create(community);
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
    async addMods(@Param('id') id: ObjectId, @Body() mods: ObjectId[]) {
        try {
            return this.communityService.addMods(id, mods);
        } catch (error) {
            errorHandler(error)
        }
    }

    @Patch(':id/tags')
    async addTags(@Param('id') id: ObjectId, @Body() tags: string[]) {
        try {
            return this.communityService.addTags(id, tags);
        } catch (error) {
            errorHandler(error)
        }
    }

    @Patch(':id/mod')
    async removeMod(@Param('id') id: ObjectId, @Body() mods: ObjectId) {
        try {
            return this.communityService.removeMod(id, mods);
        } catch (error) {
            errorHandler(error)
        }
    }

    @Patch(':id/tag')
    async removeTag(@Param('id') id: ObjectId, @Body() tag: string) {
        try {
            return this.communityService.removeTag(id, tag);
        } catch (error) {
            errorHandler(error)
        }
    }

    @Delete('-i')
    async deleteCommunity(@Param('id') id: ObjectId) {
        try {
            return this.communityService.delete(id);
        } catch (error) {
            errorHandler(error)
        }
    }
}
