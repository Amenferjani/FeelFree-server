import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/users/services/user.service'; 
import * as bcryptJs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, pass: string) {
        const user = await this.userService.findOne(username);
        if (!user) {
            throw new UnauthorizedException('');
        }

        const isPasswordValid = await bcryptJs.compare(pass, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('');
        }
        user.password = "";
        return user;
    }

    async login(user: any) {
        const payload = {
            username: user.username,
            sub: user._id,
        };
        const result = {
            _id: user._id,
            username: user.username,
            lastName: user.lastName,
            firstName: user.firstName,
            email: user.email,
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, {expiresIn:'7d'}),
        };
        return result;
    }

    async refreshToken(refreshToken: string ) {
        const decoded = this.jwtService.verify(refreshToken);
        const newAccessToken = this.jwtService.sign({
            username: decoded.username,
            sub: decoded.sub,
        });

        return { access_token: newAccessToken };
        
    };
}
