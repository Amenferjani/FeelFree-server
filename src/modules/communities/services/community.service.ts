import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Community } from '../schemas/community.schema';
import { Model ,ObjectId} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CommunityDto } from '../models/newCommunity.dto';
import { ICommunity } from '../models/community.model';
import { UserService } from 'src/modules/users/services/user.service';
import { MediaService } from 'src/modules/media/services/media.service';
import { extname } from 'path';

@Injectable()
export class CommunityService {
    constructor(@InjectModel('Community')
        private readonly communityModel: Model<Community>,
        private readonly userService: UserService,
        private readonly mediaService : MediaService
    ) { }
    
    async create(requestData: CommunityDto,
    logo: Express.Multer.File,
    banner: Express.Multer.File):Promise<ICommunity> {
        const existingCommunity = await this.communityModel.findOne({ name: requestData.name });

        if (existingCommunity) {
            throw new BadRequestException('');
        }

        const { logoName, bannerName } = await this.uploadFiles(logo, banner);
        const newCommunity = await this.communityModel.create({...requestData,media:{logoName,bannerName}});
        const community = newCommunity.toObject() as unknown as ICommunity
        await this.userService.addCommunity(requestData.creator, community._id);
        return community;
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

    async updateCommunityLogo(communityId: ObjectId, userId: ObjectId,logo: Express.Multer.File) {
        const community = await this.communityModel.findById(communityId);
        let logoName = "";
        if (!community) {
            throw new NotFoundException('');
        }
        if (!this.validateCreator(community, userId) && !this.validateMod(community, userId)) {
            throw new UnauthorizedException('');
        }
        if (logo) {
            logoName = await this.mediaService.uploadCommunityLogo(logo);
        } else {
            logoName = community.media.logo;
        }
        community.media.logo = logoName;
        await community.save();
        return ;
    }

    async updateCommunityBanner(communityId: ObjectId, userId: ObjectId,banner: Express.Multer.File) {
        const community = await this.communityModel.findById(communityId);
        let bannerName = "";
        if (!community) {
            throw new NotFoundException('');
        }
        if (!this.validateCreator(community, userId) && !this.validateMod(community, userId)) {
            throw new UnauthorizedException('');
        }
        if (banner) {
            bannerName = await this.mediaService.uploadCommunityBanner(banner);
        } else {
            bannerName = community.media.banner;
        }
        community.media.banner = bannerName;
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

    private async uploadFiles(logo: Express.Multer.File, banner: Express.Multer.File)
        : Promise<{ logoName: string, bannerName: string }>{
        let logoName = "";
        let bannerName = "";

        if (logo) {
            logoName = await this.mediaService.uploadCommunityLogo(logo);
        }

        if (banner ) {
            bannerName = await this.mediaService.uploadCommunityBanner(banner);
        }

        return { logoName , bannerName }
    }
}
