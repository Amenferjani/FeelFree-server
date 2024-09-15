import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../schemas/notifications.schema';
import { NotificationDto } from '../models/newNotification.dto';

@Injectable()
export class NotificationsService {
    constructor(@InjectModel('Notification')
    private readonly notificationModel: Model<Notification>
    ) { }

    async create(requestData : NotificationDto) {
        const createdNotification = new this.notificationModel(requestData);
        return await createdNotification.save();
    }
}
