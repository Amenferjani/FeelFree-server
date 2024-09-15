import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentDto } from '../comments/models/comment.dto';
// import { CommentService } from '../comments/services/comment.service';
import { PostService } from '../posts/services/post.service';
import { NotificationsService } from '../notifications/services/notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    // private readonly commentService: CommentService,
    private readonly postService: PostService,
    private readonly notificationService: NotificationsService,
  ){}
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('comment.created')
  async handleNewComment(@MessageBody() commentData: CommentDto): Promise<void> {
    const post = await this.postService.findOneById(commentData.post);
    console.log(`New comment: ${commentData}`);
    const notificationPayload = {
      receiver_id: post.op ,
      message: `New comment on your post: "${post.title}" `
    };

    this.server.to(post.op.toString()).emit('notification', notificationPayload);
    await this.notificationService.create({
      receiver_id:notificationPayload.receiver_id ,
      message:notificationPayload.message,
      sendAt: undefined,
      isSeen: false
    });
  }
}
