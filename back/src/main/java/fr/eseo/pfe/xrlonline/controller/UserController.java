package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.UserDTO;
import fr.eseo.pfe.xrlonline.service.LoginService;
import fr.eseo.pfe.xrlonline.service.UserService;
import lombok.extern.log4j.Log4j2;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200") // Only For Dev
@Log4j2
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    private final LoginService loginService;

    public UserController(UserService userService, LoginService loginService) {
        this.userService = userService;
        this.loginService = loginService;
    }

    @GetMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestParam String login, @CurrentSecurityContext(expression="authentication?.name") String username) {
        log.info("AS [{}] REQUEST: Try to log in with : {}", username, login);
        try {
            ResponseEntity<UserDTO> response = this.loginService.login(login);
            log.info("Log in success with : {}", login);
            return response;
        } catch (CustomRuntimeException e) {
            log.error("AS [{}] Error while trying to log in with : {}, Error Details : {}", username, login, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @GetMapping("/get-all-users")
    public ResponseEntity<List<UserDTO>> getAllUsers(@CurrentSecurityContext(expression="authentication?.name") String username) {
        log.info("AS [{}] REQUEST: Get all users", username);
        
        try {
            return userService.getAllUser();
        } catch (CustomRuntimeException e) {
            log.error("AS [{}] Error while trying to get all users, Error Details : {}", username, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @GetMapping("/get-user-by-id")
    public ResponseEntity<UserDTO> getUserById(@RequestParam String id, @CurrentSecurityContext(expression="authentication?.name") String username) {
        log.info("AS [{}] REQUEST: Get user by id with : {}", username, id);
        try {
            return userService.getUserById(id);
        } catch (CustomRuntimeException e) {
            log.error("AS [{}] Error while trying to get user by id with : {}, Error Details : {}", username, id, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @GetMapping("/get-user-by-login")
    public ResponseEntity<UserDTO> getUserByLogin(@RequestParam String login, @CurrentSecurityContext(expression="authentication?.name") String username) {
        log.info("AS [{}] REQUEST: Get user by login with : {}", username, login);
        try {
            return userService.getUserByLogin(login);
        } catch (CustomRuntimeException e) {
            log.error("AS [{}] Error while trying to get user by id with : {}, Error Details : {}", username, login, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @PostMapping("/create-user")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO user, @CurrentSecurityContext(expression="authentication?.name") String username) {
        log.info("AS [{}] REQUEST: Create user with : {}", username, user.toString());
        try {
            return userService.createUser(user);
        } catch (CustomRuntimeException e) {
            log.error("AS [{}] Error while trying to create user with : {}, Error Details : {}", username, user, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @PutMapping("/update-user")
    public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO user, @CurrentSecurityContext(expression="authentication?.name") String username) {
        log.info("AS [{}] REQUEST: Update user with {}", username, user.toString());
        try {
            return userService.updateUser(user);
        } catch (CustomRuntimeException e) {
            log.error("AS [{}] Error while trying to update user with : {}, Error Details : {}", username, user, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<UserDTO> deleteUser(@RequestParam String id, @CurrentSecurityContext(expression="authentication?.name") String username) {
        log.info("AS [{}] REQUEST: Delete user with id : {}", username, id);
        try {
            return userService.deleteUser(id);
        } catch (CustomRuntimeException e) {
            log.error("AS [{}] Error while trying to delete user with : {}, Error Details : {}", username, id, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }
}
