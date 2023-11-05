package fr.eseo.pfe.xrlonline.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter // TODO: Why ?
public class CustomRuntimeException extends Exception {
    private final HttpStatusCode httpCode;
    public static final String USER_LOGIN_NULL = "User Login Cannot Be Null !";
    public static final String USER_FIRSTNAME_NULL = "User Firstname Cannot Be Null !";
    public static final String USER_LASTNAME_NULL = "User Lastname Cannot Be Null !";
    public static final String UNEXPECTED_EXCEPTION = "Unexpected exception occured !";
    public static final String USER_NOT_FOUND = "User Not Found !";
    public static final String USER_LIST_EMPTY = "The User List Is Empty !";
    public static final String TEAM_LIST_EMPTY = "The Team List Is Empty !";
    public static final String TEAM_NAME_NULL = "Team Name Cannot Be Null !";
    public static final String TEAM_NOT_FOUND = "Team Not Found !";
    public static final String TEAM_NAME_ALREADY_EXISTS = "Team Name Already Exists !";
    public static final String USER_LOGIN_ALREADY_EXISTS = "User Login Already Exists !";
    public static final String DUPLICATE_MEMBERS = "Duplicate members found in the team !";
    public static final String TEAM_NOT_CREATED = "Team Not Created !";
    public static final String TEAM_NOT_UPDATED = "Team Not Updated !";


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
            case USER_NOT_FOUND, TEAM_NOT_FOUND:
                return HttpStatus.NOT_FOUND;
            case UNEXPECTED_EXCEPTION:
                return HttpStatus.I_AM_A_TEAPOT;
            case TEAM_NAME_ALREADY_EXISTS, USER_LOGIN_ALREADY_EXISTS:
                return HttpStatus.CONFLICT;
            case DUPLICATE_MEMBERS, TEAM_NAME_NULL, USER_LOGIN_NULL, USER_FIRSTNAME_NULL, USER_LASTNAME_NULL:
                return HttpStatus.BAD_REQUEST;
            case USER_LIST_EMPTY, TEAM_LIST_EMPTY:
                return HttpStatus.NO_CONTENT;
            case TEAM_NOT_CREATED, TEAM_NOT_UPDATED:
                return HttpStatus.INTERNAL_SERVER_ERROR;
            default:
                return HttpStatus.NOT_IMPLEMENTED;
        }
    }

}
