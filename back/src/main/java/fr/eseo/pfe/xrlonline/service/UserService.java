package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.UserDTO;
import fr.eseo.pfe.xrlonline.model.entity.Team;
import fr.eseo.pfe.xrlonline.model.entity.User;
import fr.eseo.pfe.xrlonline.repository.TeamRepository;
import fr.eseo.pfe.xrlonline.repository.UserRepository;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    private final ModelMapper modelMapper;

    public UserService(UserRepository userRepository, TeamRepository teamRepository, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.modelMapper = modelMapper;
    }

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
                .collect(Collectors.toList());

        if (!usersDTO.isEmpty()) {
            return ResponseEntity.ok(usersDTO);
        }
        throw new CustomRuntimeException(CustomRuntimeException.USER_LIST_EMPTY);

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
        userToSave.setId(null);

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

            if (existingUser.getLogin().equals("admin")) {
                throw new CustomRuntimeException(CustomRuntimeException.ADMIN_CANNOT_BE_MODIFIED);
            }

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

        if (userToDelete == null) {
            throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND);
        }
        if (userToDelete.isAdmin()) {
            throw new CustomRuntimeException(CustomRuntimeException.USER_ADMIN_DELETE);
        }
        this.removeFromTeam(userToDelete);
        userRepository.delete(userToDelete);
        return ResponseEntity.ok(userToDeleteDTO);
    }

    private void removeFromTeam(User user) {
        List<Team> teams = this.teamRepository.findAll();
        for (Team team : teams) {
            List<User> members = team.getMembers();
            members.remove(user);
            this.teamRepository.save(team);
        }
    }
}
