import { 
    BadRequestException,
    UnauthorizedException,
    NotFoundException,
    ForbiddenException,
    UnprocessableEntityException,
    NotImplementedException,
    ImATeapotException,
    MethodNotAllowedException,
    BadGatewayException,
    ServiceUnavailableException,
    GatewayTimeoutException,
    PreconditionFailedException,
    NotAcceptableException,
    InternalServerErrorException,
    RequestTimeoutException,
    ConflictException,
    GoneException,
    HttpVersionNotSupportedException,
    PayloadTooLargeException,
    UnsupportedMediaTypeException,
} from "@nestjs/common";

function getErrorType(error: any): string {
    if (error instanceof RequestTimeoutException) return 'RequestTimeoutException';
    if (error instanceof ConflictException) return 'ConflictException';
    if (error instanceof GoneException) return 'GoneException';
    if (error instanceof HttpVersionNotSupportedException) return 'HttpVersionNotSupportedException';
    if (error instanceof PayloadTooLargeException) return 'PayloadTooLargeException';
    if (error instanceof UnsupportedMediaTypeException) return 'UnsupportedMediaTypeException';
    if (error instanceof BadRequestException) return 'BadRequestException';
    if (error instanceof UnauthorizedException) return 'UnauthorizedException';
    if (error instanceof NotFoundException) return 'NotFoundException';
    if (error instanceof ForbiddenException) return 'ForbiddenException';
    if (error instanceof PreconditionFailedException) return 'PreconditionFailedException';
    if (error instanceof GatewayTimeoutException) return 'GatewayTimeoutException';
    if (error instanceof ServiceUnavailableException) return 'ServiceUnavailableException';
    if (error instanceof NotImplementedException) return 'NotImplementedException';
    if (error instanceof MethodNotAllowedException) return 'MethodNotAllowedException';
    if (error instanceof BadGatewayException) return 'BadGatewayException';
    if (error instanceof ImATeapotException) return 'ImATeapotException';
    if (error instanceof UnprocessableEntityException) return 'UnprocessableEntityException';
    if (error instanceof NotAcceptableException) return 'NotAcceptableException';
    return 'UnknownException';
}

export function errorHandler(error: any) {
    console.error(error);

    const errorType = getErrorType(error);
    
    switch (errorType) {
        case 'RequestTimeoutException':
            throw new RequestTimeoutException('Request Timeout');
        case 'ConflictException':
            throw new ConflictException('Conflict');
        case 'GoneException':
            throw new GoneException('Gone');
        case 'HttpVersionNotSupportedException':
            throw new HttpVersionNotSupportedException('HTTP Version Not Supported');
        case 'PayloadTooLargeException':
            throw new PayloadTooLargeException('Payload Too Large');
        case 'UnsupportedMediaTypeException':
            throw new UnsupportedMediaTypeException('Unsupported Media Type');
        case 'BadRequestException':
            throw new BadRequestException('Bad Request');
        case 'UnauthorizedException':
            throw new UnauthorizedException('Unauthorized');
        case 'NotFoundException':
            throw new NotFoundException('Not Found');
        case 'ForbiddenException':
            throw new ForbiddenException('Forbidden');
        case 'PreconditionFailedException':
            throw new PreconditionFailedException('Precondition Failed');
        case 'GatewayTimeoutException':
            throw new GatewayTimeoutException('Gateway Timeout');
        case 'ServiceUnavailableException':
            throw new ServiceUnavailableException('Service Unavailable');
        case 'NotImplementedException':
            throw new NotImplementedException('Not Implemented');
        case 'MethodNotAllowedException':
            throw new MethodNotAllowedException('Method Not Allowed');
        case 'BadGatewayException':
            throw new BadGatewayException('Bad Gateway');
        case 'ImATeapotException':
            throw new ImATeapotException("I'm a teapot");
        case 'UnprocessableEntityException':
            throw new UnprocessableEntityException('Unprocessable Entity');
        case 'NotAcceptableException':
            throw new NotAcceptableException('Not Acceptable');
        default:
            throw new InternalServerErrorException('An unexpected error occurred');
    }
}
