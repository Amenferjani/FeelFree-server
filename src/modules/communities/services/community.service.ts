import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Community } from '../schemas/community.schema';
import { Model ,ObjectId} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CommunityDto } from '../models/newCommunity.dto';
import { ICommunity } from '../models/community.model';
import { UserService } from 'src/modules/users/services/user.service';

@Injectable()
export class CommunityService {
    constructor(@InjectModel('Community')
        private readonly communityModel: Model<Community>,
        private readonly userService: UserService
    ) { }
    
    async create(requestData: CommunityDto) {
        const existingCommunity = await this.communityModel.findOne({ name: requestData.name });

        if (existingCommunity) {
            throw new BadRequestException('');
        }

        const newCommunity = await this.communityModel.create(requestData);
        const community = newCommunity.toObject() as unknown as ICommunity
        return await this.userService.addCommunity(requestData.creator,community._id);
    }

    async findOne(communityName: string): Promise<Community >{
        const community = this.communityModel.findOne({name:communityName});
        if (!community) {
            throw new NotFoundException('');
        }
        return community 
    }

    async findOneById(id: ObjectId): Promise<Community >{
        const community = this.communityModel.findById(id);
        if (!community) {
            throw new NotFoundException('');
        }
        return community 
    }

    async addMods(communityId: ObjectId, userId: ObjectId, mods: ObjectId[]) {
        const community = await this.communityModel.findById(communityId);

        if (!community) {
            throw new NotFoundException('');
        }
        if (!this.validateCreator(community, userId)) {
            throw new UnauthorizedException('');
        }
        const newMods = mods.filter(mod => !community.mods.includes(mod));
        community.mods = [...community.mods, ...newMods];
        await community.save();
        return ;
    }

    async removeMod(communityId: ObjectId, userId: ObjectId, modId: ObjectId) {
        const community = await this.communityModel.findById(communityId);

        if (!community) {
            throw new NotFoundException('');
        }
        if (!community.mods.includes(modId)) {
            throw new NotFoundException('');
        }
        if (!this.validateCreator(community, userId)) {
            throw new UnauthorizedException('');
        }
        const modIdString = modId.toString();

        community.mods = community.mods.filter(mod => mod.toString() !== modIdString);
        await community.save();
        return ;
    }

    async addTags(communityId: ObjectId, userId: ObjectId, tags: string[]) {
        const community = await this.communityModel.findById(communityId);

        if (!community) {
            throw new NotFoundException('');
        }
        if (!this.validateCreator(community, userId) && !this.validateMod(community, userId)) {
            throw new UnauthorizedException('');
        }
        const newTags = tags.filter(tag => !community.tags.includes(tag));
        community.tags = [...community.tags, ...newTags];
        await community.save();
        return ;
    }

    async removeTag(communityId: ObjectId,  userId: ObjectId, tagString: string) {
        const community = await this.communityModel.findById(communityId);

        if (!community) {
            throw new NotFoundException();
        }
        if (!this.validateCreator(community, userId) && !this.validateMod(community, userId)) {
            throw new UnauthorizedException('');
        }
        if (!community.tags.includes(tagString)) {
            throw new NotFoundException();
        }

        community.tags = community.tags.filter(tag => tag!== tagString);
        await community.save();
        return ;
    }

    async delete(id: ObjectId , userId: ObjectId) {
        const community = await this.communityModel.findById(id);
        if (!community) {
            throw new NotFoundException('');
        }
        if (!this.validateCreator(community, userId)) {
            throw new UnauthorizedException('');
        }
        await this.userService.removeCommunity(userId, id);
        return await this.communityModel.findByIdAndDelete(id);
    }

    private validateCreator(community: Community, userId: ObjectId): boolean {
        return community.creator.toString() == userId.toString()
    }
    private validateMod(community: Community, modId: ObjectId): Boolean{
        return community.mods.includes(modId);
    }
}
