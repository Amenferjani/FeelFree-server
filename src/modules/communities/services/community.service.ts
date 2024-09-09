import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Community } from '../schemas/community.schema';
import { Model ,ObjectId} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CommunityDto } from '../dto/newCommunity.dto';

@Injectable()
export class CommunityService {
    constructor(@InjectModel('Community') private readonly communityModel: Model<Community>) {}
    
    async create(requestData: CommunityDto): Promise<Community> {
    const existingCommunity = await this.communityModel.findOne({ name: requestData.name });

    if (existingCommunity) {
        throw new BadRequestException('');
    }

    const newCommunity = new this.communityModel(requestData);
    return newCommunity.save();
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

    async addMods(communityId: ObjectId, mods: ObjectId[]) {
        const community = await this.communityModel.findById(communityId);

        if (!community) {
            throw new NotFoundException('');
        }
        const newMods = mods.filter(mod => !community.mods.includes(mod));
        community.mods = [...community.mods, ...newMods];
        community.save();
        return ;
    }

    async addTags(communityId: ObjectId, tags: string[]) {
        const community = await this.communityModel.findById(communityId);

        if (!community) {
            throw new NotFoundException('');
        }
        const newTags = tags.filter(tag => !community.tags.includes(tag));
        community.tags = [...community.tags, ...newTags];
        community.save();
        return ;
    }

    async removeMod(communityId: ObjectId, modId: ObjectId) {
        const community = await this.communityModel.findById(communityId);

        if (!community) {
            throw new NotFoundException('');
        }
        if (!community.mods.includes(modId)) {
            throw new NotFoundException('');
        }

        const modIdString = modId.toString();

        community.mods = community.mods.filter(mod => mod.toString() !== modIdString);
        community.save();
        return ;
    }

    async removeTag(communityId: ObjectId, tagString: string) {
        const community = await this.communityModel.findById(communityId);

        if (!community) {
            throw new NotFoundException();
        }
        if (!community.tags.includes(tagString)) {
            throw new NotFoundException();
        }

        community.tags = community.tags.filter(tag => tag!== tagString);
        community.save();
        return ;
    }

    async delete(id: ObjectId) {
        const community = await this.communityModel.findById(id);
        if (!community) {
            throw new NotFoundException('');
        }
        return await this.communityModel.findByIdAndDelete(id);
    }
}
