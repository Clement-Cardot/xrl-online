# Controller

The Spring Controller is the Facade of our Back-end.<br>
This is where we define what our client can do with our system.


```java
@RestController
public class UserController {

    Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestParam String login) {
        logger.info("Trying to log in with : {}", login);
        try {
            ResponseEntity<UserDTO> response = userService.login(login);
            logger.info("Log in success with : {}", login);
            return response;
        } catch (CustomRuntimeException e) {
            logger.error("Error while trying to log in with : {}, Error Details : {}", login, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    ...
}
```