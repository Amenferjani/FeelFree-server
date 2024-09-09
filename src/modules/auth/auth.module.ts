import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './config/constants/constants';
import { JwtStrategy } from './config/token/jwt.strategy';
import { AuthController } from './controllers/auth.controller';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
