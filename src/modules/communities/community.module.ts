import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from './schemas/community.schema';
import { CommunityController } from './controllers/community.controller';
import { CommunityService } from './services/community.service';
import { UserService } from '../users/services/user.service';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Community.name, schema: CommunitySchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    controllers: [CommunityController],
    providers: [CommunityService,UserService],
})
export class CommunityModule {}
