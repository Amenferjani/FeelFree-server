import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof HttpException ? exception.getStatus() : 500;

    response
        .status(status)
        .json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception instanceof HttpException ? exception.message : 'Internal server error',
        });
    }
}
