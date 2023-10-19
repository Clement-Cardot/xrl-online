# Custom Exception
To have a better error feedback, we have created a custom exception class.<br>
In this class, we define every error we will need, then when we need to raise one, we just have to call it with the corresponding name. (See under)
We also define, depending on the error, the httpCode that will be send to the front-end

```java
public class CustomRuntimeException extends Exception {

    private final HttpStatusCode httpCode;

    public static final String USER_LOGIN_NULL = "User Login Cannot Be Null !";
    public static final String USER_FIRSTNAME_NULL = "User Firstname Cannot Be Null !";
    public static final String USER_NOT_FOUND = "User Not Found !";
    public static final String USER_LIST_EMPTY = "The User List Is Empty !";
    ...
    public static final String DUPLICATE_MEMBERS = "Duplicate members found in the team !";



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
            default:
                return HttpStatus.NOT_IMPLEMENTED;
        }
    }

}
```

Example of throw of custom exception :

```java
throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND);
```