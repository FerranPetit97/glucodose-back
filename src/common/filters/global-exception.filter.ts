import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../errors/domain-error';

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path: string;
  };
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status: number;
    let errorResponse: ErrorResponse;

    if (exception instanceof DomainError) {
      // Handle custom domain errors
      status = exception.httpStatus;
      errorResponse = {
        success: false,
        error: {
          code: exception.code,
          message: exception.message,
          details: exception.details,
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      };

      this.logger.warn(`Domain Error: ${exception.code} - ${exception.message}`, {
        path: request.url,
        details: exception.details,
      });
    } else if (exception instanceof HttpException) {
      // Handle NestJS HTTP exceptions
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      errorResponse = {
        success: false,
        error: {
          code: 'HTTP_EXCEPTION',
          message: typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message || exception.message,
          details: typeof exceptionResponse === 'object' ? exceptionResponse : undefined,
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      };

      this.logger.warn(`HTTP Exception: ${status} - ${exception.message}`, {
        path: request.url,
        response: exceptionResponse,
      });
    } else {
      // Handle unexpected errors
      status = 500;
      errorResponse = {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      };

      this.logger.error(`Unexpected Error: ${exception}`, {
        path: request.url,
        stack: exception instanceof Error ? exception.stack : undefined,
      });
    }

    response.status(status).json(errorResponse);
  }
}
