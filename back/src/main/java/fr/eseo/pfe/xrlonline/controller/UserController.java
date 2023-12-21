package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.logger.UserLogger;
import fr.eseo.pfe.xrlonline.logger.UserLoggerFactory;
import fr.eseo.pfe.xrlonline.model.dto.UserDTO;
import fr.eseo.pfe.xrlonline.service.LoginService;
import fr.eseo.pfe.xrlonline.service.UserService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200") // Only For Dev
@Log4j2
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    private final LoginService loginService;

    UserLogger logger = UserLoggerFactory.getLogger(ProjectController.class, log);

    public UserController(UserService userService, LoginService loginService) {
        this.userService = userService;
        this.loginService = loginService;
    }

    @GetMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestParam String login) {
        logger.logInfo("REQUEST: Try to log in with : %s", login);
        try {
            ResponseEntity<UserDTO> response = this.loginService.login(login);
            logger.logInfo("Log in success with : %s", login);
            return response;
        } catch (CustomRuntimeException e) {
            logger.logError("Error while trying to log in with : %s, Error Details : %s", login, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    // Simple request to check if the cookie has expired (403 if expired, 200 if not)
    @GetMapping("/check-connexion")
    public ResponseEntity<Boolean> checkConnexion() {
        logger.logInfo("REQUEST: Check connexion");
        return ResponseEntity.ok(true);
    }

    @GetMapping("/get-all-users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        logger.logInfo("REQUEST: Get all users");

        try {
            return userService.getAllUser();
        } catch (CustomRuntimeException e) {
            logger.logError("Error while trying to get all users, Error Details : %s", e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @GetMapping("/get-user-by-id")
    public ResponseEntity<UserDTO> getUserById(@RequestParam String id) {
        logger.logInfo("REQUEST: Get user by id with : %s", id);
        try {
            return userService.getUserById(id);
        } catch (CustomRuntimeException e) {
            logger.logError("Error while trying to get user by id with : %s, Error Details : %s", id, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @GetMapping("/get-user-by-login")
    public ResponseEntity<UserDTO> getUserByLogin(@RequestParam String login) {
        logger.logInfo("REQUEST: Get user by login with : %s", login);
        try {
            return userService.getUserByLogin(login);
        } catch (CustomRuntimeException e) {
            logger.logError("Error while trying to get user by id with : %s, Error Details : %s", login, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @PostMapping("/create-user")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO user) {
        logger.logInfo("REQUEST: Create user with : %s", user.toString());
        try {
            return userService.createUser(user);
        } catch (CustomRuntimeException e) {
            logger.logError("Error while trying to create user with : %s, Error Details : %s", user, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @PutMapping("/update-user")
    public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO user) {
        logger.logInfo("REQUEST: Update user with %s", user.toString());
        try {
            return userService.updateUser(user);
        } catch (CustomRuntimeException e) {
            logger.logError("Error while trying to update user with : %s, Error Details : %s", user, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<UserDTO> deleteUser(@RequestParam String id) {
        logger.logInfo("REQUEST: Delete user with id : %s", id);
        try {
            return userService.deleteUser(id);
        } catch (CustomRuntimeException e) {
            logger.logError("Error while trying to delete user with : %s, Error Details : %s", id, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }
}
