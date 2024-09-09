import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from './schemas/community.schema';
import { CommunityController } from './controllers/community.controller';
import { CommunityService } from './services/community.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Community.name, schema: CommunitySchema }])],
    controllers: [CommunityController],
    providers: [CommunityService],
})
export class CommunityModule {}
