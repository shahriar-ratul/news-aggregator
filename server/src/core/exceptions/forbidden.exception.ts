/**
 * A custom exception that represents a Forbidden error.
 */

// Import required modules
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';

// Import internal modules
import { ExceptionConstants } from '../constants/exceptions.constants';
import { ErrorResponse, IException } from '../interfaces/response.interfaces';
import { format } from 'date-fns';


/**
 * A custom exception for forbidden errors.
 */
export class ForbiddenException extends HttpException {
    /** The error code. */
    @ApiProperty({
        enum: ExceptionConstants.ForbiddenCodes,
        description: 'You do not have permission to perform this action.',
        example: ExceptionConstants.ForbiddenCodes.MISSING_PERMISSIONS,
    })
    statusCode: number;

    /** The error that caused this exception. */
    @ApiHideProperty()
    cause: Error;

    /** The error message. */
    @ApiProperty({
        description: 'Message for the exception',
        example: 'You do not have permission to perform this action.',
    })
    message: string;

    /** The detailed description of the error. */
    @ApiProperty({
        description: 'A description of the error message.',
    })
    description: string;

    /** Timestamp of the exception */
    @ApiProperty({
        description: 'Timestamp of the exception',
        format: 'date-time',
        example: '2022-12-31T23:59:59.999Z',
    })
    timestamp: string;

    /** Trace ID of the request */
    @ApiProperty({
        description: 'Trace ID of the request',
        example: '65b5f773-df95-4ce5-a917-62ee832fcdd0',
    })
    traceId: string; // Trace ID of the request

    /**
     * Constructs a new ForbiddenException object.
     * @param exception An object containing the exception details.
     *  - message: A string representing the error message.
     *  - cause: An object representing the cause of the error.
     *  - description: A string describing the error in detail.
     *  - code: A number representing internal status code which helpful in future for frontend
     */
    constructor(exception: IException) {
        super(exception.message, HttpStatus.FORBIDDEN, {
            cause: exception.cause,
            description: exception.description,
        });

        this.message = exception.message;
        this.cause = exception.cause;
        this.description = exception.description;
        this.statusCode = exception.statusCode;
        this.timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss a');
    }

    /**
     * Set the Trace ID of the ForbiddenException instance.
     * @param traceId A string representing the Trace ID.
     */
    setTraceId = (traceId: string) => {
        this.traceId = traceId;
    };

    /**
     * Generate an HTTP response body representing the ForbiddenException instance.
     * @param message A string representing the message to include in the response body.
     * @returns An object representing the HTTP response body.
     */
    generateHttpResponseBody = (
        message?: string
    ): ErrorResponse => {
        return {
            success: false,
            statusCode: this.statusCode,
            data: {
                error: this.cause,
            },
            message: message || this.message,
            timestamp: this.timestamp,


        };
    };

    /**
     * A static method to generate an exception forbidden error.
     * @param msg - An optional error message.
     * @returns An instance of the ForbiddenException class.
     */
    static FORBIDDEN = (msg?: string) => {
        return new ForbiddenException({
            success: false,
            message: msg || 'Access to this resource is forbidden.',
            statusCode: ExceptionConstants.ForbiddenCodes.FORBIDDEN,

        });
    };

    /**
     * A static method to generate an exception missing permissions error.
     * @param msg - An optional error message.
     * @returns An instance of the ForbiddenException class.
     */
    static MISSING_PERMISSIONS = (msg?: string) => {
        return new ForbiddenException({
            success: false,
            message:
                msg || 'You do not have permission to perform this action.',
            statusCode: ExceptionConstants.ForbiddenCodes.MISSING_PERMISSIONS,
        });
    };
}
