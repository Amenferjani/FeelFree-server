import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema,Notification } from './schemas/notifications.schema';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService],
    exports:[NotificationsService]
})

export class NotificationsModule {}
