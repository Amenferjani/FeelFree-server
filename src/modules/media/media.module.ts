import { Module } from '@nestjs/common';
import { MediaService } from './services/media.service'; 

@Module({
    providers: [MediaService],
    exports: [MediaService],
})
export class MediaModule {}
