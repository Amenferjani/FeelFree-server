import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaModule } from '../media/media.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MediaModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports : [UserService]
})
export class UserModule {}
