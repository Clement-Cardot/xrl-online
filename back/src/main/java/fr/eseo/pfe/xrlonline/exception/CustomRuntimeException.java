package fr.eseo.pfe.xrlonline.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public class CustomRuntimeException extends Exception {

    public static final String READINESS_LEVEL_NOT_FOUND = "Readiness Level Not Found !";
    public static final String READINESS_LEVEL_LIST_EMPTY = "The Readiness Level List Is Empty !";
    public static final String READINESS_LEVEL_NAME_NULL = "Readiness Level Name Cannot Be Null !";
    public static final String READINESS_LEVEL_DESCRIPTION_NULL = "Readiness Level Description Cannot Be Null !";
    public static final String READINESS_LEVEL_NAME_ALREADY_EXISTS = "Readiness Level Name Already Exists !";
    public static final String READINESS_LEVEL_LEVELS_SIZE = "Readiness Level Levels Size Must Be 9 !";
    public static final String READINESS_LEVEL_ID_NULL = "Readiness Level Id Cannot Be Null !";
    private final HttpStatusCode httpCode;
    public static final String BUSINESS_LINE_NOT_FOUND = "Business Line Not Found !";
    public static final String BUSINESS_LINE_NAME_ALREADY_EXISTS = "Business Line Name Already Exists !";
    public static final String BUSINESS_LINE_DESCRIPTION_NULL = "Business Line Description Cannot Be Null !";
    public static final String BUSINESS_LINE_NAME_NULL = "Business Line Name Cannot Be Null !";
    public static final String BUSINESS_LINE_LIST_EMPTY = "The Business Line List Is Empty !";
    public static final String USER_LOGIN_NULL = "User Login Cannot Be Null !";
    public static final String USER_FIRSTNAME_NULL = "User Firstname Cannot Be Null !";
    public static final String USER_LASTNAME_NULL = "User Lastname Cannot Be Null !";
    public static final String UNEXPECTED_EXCEPTION = "Unexpected exception occured !";
    public static final String USER_NOT_FOUND = "User Not Found !";
    public static final String USER_LIST_EMPTY = "The User List Is Empty !";
    public static final String USER_ADMIN_DELETE = "Admin User Cannot Be Deleted !";
    public static final String TEAM_LIST_EMPTY = "The Team List Is Empty !";
    public static final String TEAM_NAME_NULL = "Team Name Cannot Be Null !";
    public static final String TEAM_NOT_FOUND = "Team Not Found !";
    public static final String TEAM_NAME_ALREADY_EXISTS = "Team Name Already Exists !";
    public static final String TEAM_LINKED_PROJECTS = "Team is linked to projects !";
    public static final String USER_LOGIN_ALREADY_EXISTS = "User Login Already Exists !";
    public static final String DUPLICATE_MEMBERS = "Duplicate members found in the team !";
    public static final String PROJECT_NAME_NULL = "Project Name Cannot Be Null !";
    public static final String PROJECT_BUSINESS_LINE_NULL = "Project Business Line Cannot Be Null !";
    public static final String PROJECT_TEAM_NULL = "Project Team Cannot Be Null !";
    public static final String PROJECT_NAME_ALREADY_EXISTS = "Project Name Already Exists !";
    public static final String PROJECT_NOT_FOUND = "Project Not Found !";
    public static final String TEAM_NOT_CREATED = "Team Not Created !";
    public static final String TEAM_NOT_UPDATED = "Team Not Updated !";
    public static final String USER_NOT_MEMBER_OF_TEAM_PROJECT = "User Not Member Of Team Project !";
    public static final String PROJECT_LAST_ASSESSMENT_COMMENT_NULL = "Project Last Assessment Comment Cannot Be Null !";
    public static final String PROJECT_ASSESSMENT_LIST_IS_EMPTY = "Project Assessment List Is Empty !";

    public CustomRuntimeException(String message, Throwable cause) {
        super(message, cause);
        this.httpCode = this.defineHttpCode(message);
    }

    public CustomRuntimeException(String message) {
        super(message);
        this.httpCode = this.defineHttpCode(message);
    }

    public HttpStatusCode getHttpCode() {
        return this.httpCode;
    }

    private HttpStatusCode defineHttpCode(String message) {
        switch (message) {
            case USER_NOT_FOUND,
                    TEAM_NOT_FOUND,
                    PROJECT_NOT_FOUND,
                    BUSINESS_LINE_NOT_FOUND,
                    READINESS_LEVEL_NOT_FOUND:
                return HttpStatus.NOT_FOUND;
            case UNEXPECTED_EXCEPTION:
                return HttpStatus.I_AM_A_TEAPOT;
            case TEAM_NAME_ALREADY_EXISTS,
                    USER_LOGIN_ALREADY_EXISTS,
                    PROJECT_NAME_ALREADY_EXISTS,
                    BUSINESS_LINE_NAME_ALREADY_EXISTS,
                    READINESS_LEVEL_NAME_ALREADY_EXISTS:
                return HttpStatus.CONFLICT;
            case DUPLICATE_MEMBERS, TEAM_NAME_NULL,
                    USER_LOGIN_NULL, USER_FIRSTNAME_NULL, USER_LASTNAME_NULL,
                    BUSINESS_LINE_DESCRIPTION_NULL, BUSINESS_LINE_NAME_NULL,
                    READINESS_LEVEL_NAME_NULL, READINESS_LEVEL_DESCRIPTION_NULL, READINESS_LEVEL_LEVELS_SIZE,
                    READINESS_LEVEL_ID_NULL,
                    PROJECT_LAST_ASSESSMENT_COMMENT_NULL:
                return HttpStatus.BAD_REQUEST;
            case USER_LIST_EMPTY,
                    TEAM_LIST_EMPTY,
                    BUSINESS_LINE_LIST_EMPTY,
                    READINESS_LEVEL_LIST_EMPTY,
                    PROJECT_ASSESSMENT_LIST_IS_EMPTY:
                return HttpStatus.NO_CONTENT;
            case TEAM_LINKED_PROJECTS,
                    USER_ADMIN_DELETE, USER_NOT_MEMBER_OF_TEAM_PROJECT:
                return HttpStatus.UNAUTHORIZED;
            default:
                return HttpStatus.NOT_IMPLEMENTED;
        }
    }

}
