package fr.eseo.pfe.xrlonline.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public class CustomRuntimeException extends Exception {

    private final HttpStatusCode httpCode;

    public static final String UNEXPECTED_EXCEPTION = "Unexpected exception occured !";
    public static final String USER_NOT_FOUND = "User Not Found !";

    public CustomRuntimeException(String message, Throwable cause){
        super(message, cause);
        this.httpCode = this.defineHttpCode(message);
    }

    public CustomRuntimeException(String message){
        super(message);
        this.httpCode = this.defineHttpCode(message);
    }

    private HttpStatusCode defineHttpCode(String message){
        switch(message){
            case USER_NOT_FOUND:
                return HttpStatus.NOT_FOUND;
            case UNEXPECTED_EXCEPTION:
                return HttpStatus.I_AM_A_TEAPOT;
            default:
                return HttpStatus.NOT_IMPLEMENTED;
        }
    }

    public HttpStatusCode getHttpCode() {
		return this.httpCode;
	}
}
