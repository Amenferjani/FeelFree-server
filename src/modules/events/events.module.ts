import { Module,} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventGateway } from './events.gateway';
import { PostModule } from '../posts/post.module';
import { NotificationsModule } from '../notifications/notifications.module';



@Module({
    imports: [ConfigModule.forRoot(),
        PostModule,
        NotificationsModule,
    ],
    exports: [EventGateway],
    providers: [EventGateway],
})
export class EventsModule {}
