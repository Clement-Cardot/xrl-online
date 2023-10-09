package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.User;
import fr.eseo.pfe.xrlonline.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200") // Only For Dev
@RestController
public class UserController {

    Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public ResponseEntity<User> login(@RequestParam String login) {
        logger.info("Trying to log in with : {}", login);
        try {
            return userService.login(login);
        } catch (CustomRuntimeException e) {
            logger.error("Error while trying to log in with : {}, Error Details : {}", login, e.getMessage());
            return new ResponseEntity<>(e.getHttpCode());
        }
    }

    @GetMapping("/users")
    public List<User> getAllUser() {
        return userService.getAllUser();
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @GetMapping("/users-login/{login}")
    public User getUserByLogin(@PathVariable String login) {
        return userService.getUserByLogin(login);
    }

    @GetMapping("/create-user")
    public User createUser(String name, String firstName, String login) {
        return userService.createUser(name, firstName, login);
    }

    @GetMapping("/update-user")
    public User updateUser(User user) {
        return userService.updateUser(user);
    }

    @GetMapping("/delete-user/{id}")
    public String deleteUser(@PathVariable String id) {
        return userService.deleteUser(id);
    }

}
