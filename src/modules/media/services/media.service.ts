import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
    private static readonly allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    private static readonly allowedVideoExtensions = ['.mp4'];

    async uploadPostMedia(file: Express.Multer.File): Promise<string> {
        return this.uploadFile(file, 'posts', MediaService.allowedImageExtensions.concat(MediaService.allowedVideoExtensions));
    }

    async uploadProfilePicture(file: Express.Multer.File): Promise<string> {
        return this.uploadFile(file, 'profile-pictures', MediaService.allowedImageExtensions);
    }

    async uploadCommunityBanner(file: Express.Multer.File): Promise<string> {
        return this.uploadFile(file, 'community-banners', MediaService.allowedImageExtensions);
    }

    async uploadCommunityLogo(file: Express.Multer.File): Promise<string> {
        return this.uploadFile(file, 'community-logos', MediaService.allowedImageExtensions);
    }

    private async uploadFile(file: Express.Multer.File, directory: string, allowedExtensions: string[]): Promise<string> {
        if (!file) {
        throw new BadRequestException('No file uploaded');
        }

        const fileExt = extname(file.originalname).toLowerCase();

        if (!allowedExtensions.includes(fileExt)) {
        throw new BadRequestException('Invalid file format');
        }

        const fileName = `${uuidv4()}${fileExt}`;
        const uploadDir = join(process.cwd(), 'uploads', directory);

        if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uploadPath = join(uploadDir, fileName);
        await fs.promises.writeFile(uploadPath, file.buffer);

        return fileName;
    }
}
