package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.UserDTO;
import fr.eseo.pfe.xrlonline.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200") // Only For Dev
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

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUser() {
        logger.info("REQUEST: Get all users");
        try {
            return userService.getAllUser();
        } catch (CustomRuntimeException e) {
            logger.error("Error while trying to get all users, Error Details : {}", e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<UserDTO> getUserById(@RequestParam String id) {
        logger.info("REQUEST: Get user by id with : {}", id);
        try {
            return userService.getUserById(id);
        } catch (CustomRuntimeException e) {
            logger.error("Error while trying to get user by id with : {}, Error Details : {}", id, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @GetMapping("/user/login")
    public ResponseEntity<UserDTO> getUserByLogin(@RequestParam String login) {
        logger.info("REQUEST: Get user by login with : {}", login);
        try {
            return userService.getUserByLogin(login);
        } catch (CustomRuntimeException e) {
            logger.error("Error while trying to get user by id with : {}, Error Details : {}", login, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @PostMapping("/create-user")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO user) {
        logger.info("REQUEST: Create user");
        try {
            return userService.createUser(user);
        } catch (CustomRuntimeException e) {
            logger.error("Error while trying to create user with : {}, Error Details : {}", user, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @PutMapping("/update-user")
    public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO user) {
        logger.info("REQUEST: Update user");
        try {
            return userService.updateUser(user);
        } catch (CustomRuntimeException e) {
            logger.error("Error while trying to update user with : {}, Error Details : {}", user, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @DeleteMapping("/delete-user")
    public ResponseEntity<UserDTO> deleteUser(@RequestParam String id) {
        logger.info("REQUEST: Delete user");
        try {
            return userService.deleteUser(id);
        } catch (CustomRuntimeException e) {
            logger.error("Error while trying to delete user with : {}, Error Details : {}", id, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }
}
