import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Response } from "express";
import { ValidationError } from "class-validator";
import { QueryFailedError } from "typeorm";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = "Internal server error";
    let message = "An unexpected error occurred. Please try again later.";
    let field = "general";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as any;
        if (responseObj.message) {
          message = responseObj.message;
        }
        if (responseObj.error) {
          error = responseObj.error;
        }
        if (responseObj.field) {
          field = responseObj.field;
        }
      }
    } else if (exception instanceof BadRequestException) {
      // Handle validation errors specifically
      status = HttpStatus.BAD_REQUEST;
      error = "Validation failed";

      const exceptionResponse = exception.getResponse() as any;
      if (
        exceptionResponse.message &&
        Array.isArray(exceptionResponse.message)
      ) {
        // Transform validation errors into user-friendly format
        const validationMessages = exceptionResponse.message.map((msg: any) => {
          if (typeof msg === "string") {
            return msg;
          }
          // Handle nested validation errors
          return this.formatValidationError(msg);
        });

        message = validationMessages.join("; ");
      } else if (exceptionResponse.message) {
        message = exceptionResponse.message;
      }
    } else if (exception instanceof QueryFailedError) {
      // Handle database-specific errors
      status = HttpStatus.SERVICE_UNAVAILABLE;
      error = "Database operation failed";

      const dbError = exception as any;
      if (dbError.code === "23505" || dbError.code === "ER_DUP_ENTRY") {
        status = HttpStatus.CONFLICT;
        error = "Duplicate entry";
        message = "This information already exists in our system.";
        field = "email";
      } else if (
        dbError.code === "ECONNREFUSED" ||
        dbError.code === "ENOTFOUND"
      ) {
        message =
          "Database connection is currently unavailable. Please try again later.";
      } else {
        message = "A database error occurred. Please try again later.";
      }
    } else if (exception instanceof Error) {
      // Handle other types of errors
      if (exception.message.includes("connect ECONNREFUSED")) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        error = "Service unavailable";
        message =
          "The service is temporarily unavailable. Please try again later.";
      } else if (exception.message.includes("timeout")) {
        status = HttpStatus.REQUEST_TIMEOUT;
        error = "Request timeout";
        message = "The request took too long to process. Please try again.";
      }
    }

    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      console.error("Exception caught by GlobalExceptionFilter:", {
        exception:
          exception instanceof Error ? exception.message : String(exception),
        stack: exception instanceof Error ? exception.stack : undefined,
        status,
        error,
        message,
      });
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      field,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === "development" && {
        debug:
          exception instanceof Error ? exception.message : String(exception),
      }),
    });
  }

  private formatValidationError(error: any): string {
    if (typeof error === "string") {
      return error;
    }

    if (error.constraints) {
      // Get the most appropriate constraint message
      const constraintKeys = Object.keys(error.constraints);
      if (constraintKeys.length > 0) {
        // Prioritize certain constraints
        const priorityOrder = [
          "isEmail",
          "isNotEmpty",
          "minLength",
          "maxLength",
        ];
        for (const priority of priorityOrder) {
          if (constraintKeys.includes(priority)) {
            return error.constraints[priority];
          }
        }
        // Fallback to first available constraint
        return error.constraints[constraintKeys[0]];
      }
    }

    if (error.children && error.children.length > 0) {
      // Handle nested validation errors
      return error.children
        .map((child: any) => this.formatValidationError(child))
        .join("; ");
    }

    return "Invalid input provided";
  }
}
