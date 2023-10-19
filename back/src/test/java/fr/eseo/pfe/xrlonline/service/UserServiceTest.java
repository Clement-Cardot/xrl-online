package fr.eseo.pfe.xrlonline.service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.UserDTO;
import fr.eseo.pfe.xrlonline.model.entity.User;
import fr.eseo.pfe.xrlonline.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ModelMapper modelMapper;

    private UserDTO userDTO;
    private User user;

    @BeforeEach
    public void setUp() {
        userDTO = new UserDTO();
        userDTO.setId("1");
        userDTO.setLogin("testUser");
        userDTO.setFirstName("John");
        userDTO.setLastName("Doe");

        user = new User();
        user.setId("1");
        user.setLogin("testUser");
        user.setFirstName("John");
        user.setLastName("Doe");
    }

    @Test
    void testGetUserById_UserFound() throws CustomRuntimeException {
        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(modelMapper.map(user, UserDTO.class)).thenReturn(userDTO);

        ResponseEntity<UserDTO> response = userService.getUserById("1");

        assertEquals(ResponseEntity.ok(userDTO), response, "User found");
    }

    @Test
    void testGetUserById_UserNotFound() {
        when(userRepository.findById("1")).thenReturn(Optional.empty());

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> userService.getUserById("1"), "User not found");
        assertEquals(CustomRuntimeException.USER_NOT_FOUND, customRuntimeException.getMessage());
    }

    @Test
    void testGetUserByLogin_UserFound() throws CustomRuntimeException {
        when(userRepository.findByLogin("testUser")).thenReturn(user);
        when(modelMapper.map(user, UserDTO.class)).thenReturn(userDTO);

        ResponseEntity<UserDTO> response = userService.getUserByLogin("testUser");

        assertEquals(ResponseEntity.ok(userDTO), response, "User found");
    }

    @Test
    void testGetUserByLogin_UserNotFound() {
        when(userRepository.findByLogin("testUser")).thenReturn(null);

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> userService.getUserByLogin("testUser"), "User not found");
        assertEquals(CustomRuntimeException.USER_NOT_FOUND, customRuntimeException.getMessage());
    }

    @Test
    void testGetAllUser_UsersFound() throws CustomRuntimeException {
        List<User> userList = new ArrayList<>();
        userList.add(user);

        when(userRepository.findAll()).thenReturn(userList);
        when(modelMapper.map(user, UserDTO.class)).thenReturn(userDTO);

        ResponseEntity<List<UserDTO>> response = userService.getAllUser();

        assertEquals(ResponseEntity.ok(List.of(userDTO)), response, "Users found");
    }

    @Test
    void testGetAllUser_UsersNotFound() {
        when(userRepository.findAll()).thenReturn(new ArrayList<>());

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> userService.getAllUser(), "Users not found");
        assertEquals(CustomRuntimeException.USER_LIST_EMPTY, customRuntimeException.getMessage());
    }

    @Test
    void testLogin_UserFound() throws CustomRuntimeException {
        when(userRepository.findByLogin("testUser")).thenReturn(user);
        when(modelMapper.map(user, UserDTO.class)).thenReturn(userDTO);

        ResponseEntity<UserDTO> response = userService.login("testUser");

        assertEquals(ResponseEntity.ok(userDTO), response, "User found");
    }

    @Test
    void testLogin_UserNotFound() {
        when(userRepository.findByLogin("testUser")).thenReturn(null);

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> userService.login("testUser"), "User not found");
        assertEquals(CustomRuntimeException.USER_NOT_FOUND, customRuntimeException.getMessage());
    }

    @Test
    void testCreateUser_UserNotExists() throws CustomRuntimeException {
        when(userRepository.findByLogin("testUser")).thenReturn(null);
        when(modelMapper.map(userDTO, User.class)).thenReturn(user);

        User userSaved = user;

        // Verify that the createUser method returns the expected ResponseEntity
        when(userRepository.save(user)).thenReturn(userSaved);
        when(modelMapper.map(userSaved, UserDTO.class)).thenReturn(userDTO);

        ResponseEntity<UserDTO> response = userService.createUser(userDTO);

        // Verify that the createUser method returns the expected ResponseEntity
        assertEquals(ResponseEntity.ok(userDTO), response, "User created");
    }


    @Test
    void testCreateUser_UserExists() {
        when(userRepository.findByLogin("testUser")).thenReturn(user);

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> userService.createUser(userDTO), "User already exists");
        assertEquals(CustomRuntimeException.USER_LOGIN_ALREADY_EXISTS, customRuntimeException.getMessage());
    }

    @Test
    void testCreateUser_UserLoginNull() {
        userDTO.setLogin(null);

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> userService.createUser(userDTO), "User login null");
        assertEquals(CustomRuntimeException.USER_LOGIN_NULL, customRuntimeException.getMessage());
    }

    @Test
    void testCreateUser_UserFirstNameNull() {
        userDTO.setFirstName(null);

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> userService.createUser(userDTO), "User first name null");
        assertEquals(CustomRuntimeException.USER_FIRSTNAME_NULL, customRuntimeException.getMessage());
    }

    @Test
    void testCreateUser_UserLastNameNull() {
        userDTO.setLastName(null);

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> userService.createUser(userDTO), "User last name null");
        assertEquals(CustomRuntimeException.USER_LASTNAME_NULL, customRuntimeException.getMessage());
    }

    @Test
    void testUpdateUser_UserFound() throws CustomRuntimeException {
        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(userRepository.findByLogin("updatedUser")).thenReturn(null);

        UserDTO updatedUserDTO = new UserDTO();
        updatedUserDTO.setId("1");
        updatedUserDTO.setLogin("updatedUser");
        updatedUserDTO.setFirstName("Jane");
        updatedUserDTO.setLastName("Smith");

        // Verify that the updateUser method returns the expected ResponseEntity
        when(userRepository.save(user)).thenReturn(user);
        when(modelMapper.map(user, UserDTO.class)).thenReturn(updatedUserDTO);

        ResponseEntity<UserDTO> response = userService.updateUser(updatedUserDTO);

        assertEquals(ResponseEntity.ok(updatedUserDTO), response, "User updated");
    }

    @Test
    void testUpdateUser_LoginAlreadyExist() {
        userDTO.setLogin("updatedLogin");
        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        User userAlreadyExists = new User();
        when(userRepository.findByLogin("updatedLogin")).thenReturn(userAlreadyExists);

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> userService.updateUser(userDTO), "Login already exists");
        assertEquals(CustomRuntimeException.USER_LOGIN_ALREADY_EXISTS, customRuntimeException.getMessage());
    }

    @Test
    void testUpdateUser_UserNotFound() {
        when(userRepository.findById("1")).thenReturn(Optional.empty());

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> userService.updateUser(userDTO), "User not found");
        assertEquals(CustomRuntimeException.USER_NOT_FOUND, customRuntimeException.getMessage());
    }

    @Test
    void testDeleteUser_UserFound() throws CustomRuntimeException {
        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        when(modelMapper.map(user, UserDTO.class)).thenReturn(userDTO);

        ResponseEntity<UserDTO> response = userService.deleteUser("1");

        assertEquals(ResponseEntity.ok(userDTO), response, "User deleted");
        verify(userRepository).delete(user);
    }

    @Test
    void testDeleteUser_UserNotFound() {
        when(userRepository.findById("1")).thenReturn(Optional.empty());

        CustomRuntimeException customRuntimeException = assertThrowsExactly(CustomRuntimeException.class, () -> userService.deleteUser("1"), "User not found");
        assertEquals(CustomRuntimeException.USER_NOT_FOUND, customRuntimeException.getMessage());
    }
}



