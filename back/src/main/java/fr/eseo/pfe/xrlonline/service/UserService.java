package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.UserDTO;
import fr.eseo.pfe.xrlonline.model.entity.User;
import fr.eseo.pfe.xrlonline.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    public ResponseEntity<UserDTO> getUserById(String id) throws CustomRuntimeException {
        User user = userRepository.findById(id).orElse(null);
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);

        if (user != null) {
            return ResponseEntity.ok(userDTO);
        }
        throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND);
    }

    public ResponseEntity<UserDTO> getUserByLogin(String login) throws CustomRuntimeException {
        User user = userRepository.findByLogin(login);
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);

        if (user != null) {
            return ResponseEntity.ok(userDTO);
        }
        throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND);
    }

    public ResponseEntity<List<UserDTO>> getAllUser() throws CustomRuntimeException {
        List<UserDTO> usersDTO = userRepository.findAll().stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .toList();

        if (!usersDTO.isEmpty()) {
            return ResponseEntity.ok(usersDTO);
        }
        throw new CustomRuntimeException(CustomRuntimeException.USER_LIST_EMPTY);

    }

    public ResponseEntity<UserDTO> login(String login) throws CustomRuntimeException {
        User user = userRepository.findByLogin(login);
        if (user == null) {
            throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND);
        }
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        return ResponseEntity.ok(userDTO);
    }

    public ResponseEntity<UserDTO> createUser(UserDTO userDTO) throws CustomRuntimeException {
        if(userDTO.getLogin() == null) {
            throw new CustomRuntimeException(CustomRuntimeException.USER_LOGIN_NULL);
        }
        if(userDTO.getFirstName() == null) {
            throw new CustomRuntimeException(CustomRuntimeException.USER_FIRSTNAME_NULL);
        }
        if(userDTO.getLastName() == null) {
            throw new CustomRuntimeException(CustomRuntimeException.USER_LASTNAME_NULL);
        }
        User userToSave = modelMapper.map(userDTO, User.class);

        if (userRepository.findByLogin(userDTO.getLogin()) == null) {
            User userSaved = userRepository.save(userToSave);
            UserDTO userDTOSaved = modelMapper.map(userSaved, UserDTO.class);
            return ResponseEntity.ok(userDTOSaved);
        }

        throw new CustomRuntimeException(CustomRuntimeException.USER_LOGIN_ALREADY_EXISTS);
    }

    public ResponseEntity<UserDTO> updateUser(UserDTO updatedUser) throws CustomRuntimeException {
        User existingUser = userRepository.findById(updatedUser.getId()).orElse(null);

        if (existingUser != null) {
            if (userRepository.findByLogin(updatedUser.getLogin()) != null
                && !existingUser.getLogin().equals(updatedUser.getLogin())) {
                throw new CustomRuntimeException(CustomRuntimeException.USER_LOGIN_ALREADY_EXISTS);
            }

            existingUser.setLogin(updatedUser.getLogin() == null ? existingUser.getLogin() : updatedUser.getLogin());
            existingUser.setFirstName(updatedUser.getFirstName() == null ? existingUser.getFirstName() : updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName() == null ? existingUser.getLastName() : updatedUser.getLastName());
            User userUpdated = userRepository.save(existingUser);
            UserDTO userUpdatedDTO = modelMapper.map(userUpdated, UserDTO.class);
            return ResponseEntity.ok(userUpdatedDTO);
        }
        throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND);
    }

    public ResponseEntity<UserDTO> deleteUser(String id) throws CustomRuntimeException {
        User userToDelete = userRepository.findById(id).orElse(null);
        UserDTO userToDeleteDTO = modelMapper.map(userToDelete, UserDTO.class);

        if (userToDelete != null) {
            userRepository.delete(userToDelete);
            return ResponseEntity.ok(userToDeleteDTO);
        }
        throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND);
    }
}
