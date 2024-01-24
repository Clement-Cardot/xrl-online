# CustomRuntimeException

It is important to work with our own exceptions. We do not want to expose the Spring exceptions to the front end. We want to have a custom exception for each error that can occur in the back end. We have created a `CustomRuntimeException` class that extends the `RuntimeException` class. We use this class to throw our own exceptions.

in this class we define all the possible errors messages that can occur in the back end. Then we use the `CustomRuntimeException` class to throw the exception with the error message. To convert each exception to a http status code, we defined the defineHttpCode method. This method returns the http status code depending on the error message.

```java title="CustomRuntimeException.java"
public class CustomRuntimeException extends Exception {

    private final HttpStatusCode httpCode;

    public static final String READINESS_LEVEL_NOT_FOUND = "Readiness Level Not Found !";
    ...
    public static final String TEAM_NOT_UPDATED = "Team Not Updated !";
    public static final String INTERNAL_SERVER_ERROR = "Internal Server Error !";
    public static final String USER_NOT_MEMBER_OF_TEAM_PROJECT = "User Not Member Of Team Project !";
    public static final String PROJECT_LAST_ASSESSMENT_COMMENT_NULL = "Project Last Assessment Comment Cannot Be Null !";
    public static final String PROJECT_ASSESSMENT_LIST_IS_EMPTY = "Project Assessment List Is Empty !";
    public static final String ASSESSMENT_MUST_BE_DRAFT_TO_BE_MODIFIED = "Assessment Must Be Draft To Be Modified !";

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
                BUSINESS_LINE_NOT_DELETABLE,
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
                USER_ADMIN_DELETE, USER_NOT_MEMBER_OF_TEAM_PROJECT, READINESS_LEVEL_USED, USER_NOT_ADMIN:
                    return HttpStatus.UNAUTHORIZED;
            case INTERNAL_SERVER_ERROR:
                    return HttpStatus.INTERNAL_SERVER_ERROR;
            default:
                    return HttpStatus.NOT_IMPLEMENTED;
        }
    }

}

```