package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.User;
import fr.eseo.pfe.xrlonline.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByLogin(String login) {
        return userRepository.findByLogin(login);
    }

    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    public ResponseEntity<User> login(String login) throws CustomRuntimeException {
        User user = userRepository.findByLogin(login);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND);
    }

    public User createUser(String name, String firstName, String login) {
        User user = new User();
        user.setLastName(name);
        user.setFirstName(firstName);
        user.setLogin(login);
        return userRepository.save(user);
    }

    public User updateUser(User user) {
        User existingUser = userRepository.findById(user.getId()).orElse(null);
        existingUser.setLastName(user.getLastName());
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLogin(user.getLogin());
        return userRepository.save(existingUser);
    }

    public String deleteUser(String id) {
        userRepository.deleteById(id);
        return "User removed !! " + id;
    }

}
