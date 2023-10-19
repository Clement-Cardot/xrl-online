package fr.eseo.pfe.xrlonline.controller;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.UserDTO;
import fr.eseo.pfe.xrlonline.service.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.http.ResponseEntity;

import static org.mockito.Mockito.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private UserDTO userDTO;
    private UserDTO nonexistentUserDTO;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        userDTO = new UserDTO();
        userDTO.setLogin("testUser");

        nonexistentUserDTO = new UserDTO();
        nonexistentUserDTO.setLogin("nonexistentUser");
    }

    @AfterEach
    public void tearDown() {
        reset(userService);
    }

    @Test
    public void testLoginUserExist() throws Exception {
        when(userService.login("testUser")).thenReturn(ResponseEntity.ok(userDTO));

        mockMvc.perform(MockMvcRequestBuilders.get("/login")
                        .param("login", "testUser")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.login").value("testUser"));
    }

    @Test
    public void testLoginUserNotFound() throws Exception {
        when(userService.login("nonexistentUser")).thenThrow(new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND));

        mockMvc.perform(MockMvcRequestBuilders.get("/login")
                        .param("login", "nonexistentUser")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void testGetAllUserUserExist() throws Exception {
        when(userService.getAllUser()).thenReturn(ResponseEntity.ok(Arrays.asList(userDTO, nonexistentUserDTO)));

        mockMvc.perform(MockMvcRequestBuilders.get("/users")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].login").value("testUser"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].login").value("nonexistentUser"));
    }

    @Test
    public void testGetAllUserUserNotFound() throws Exception {
        when(userService.getAllUser()).thenThrow(new CustomRuntimeException(CustomRuntimeException.USER_LIST_EMPTY));

        mockMvc.perform(MockMvcRequestBuilders.get("/users")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    public void testGetUserByIdUserExist() throws Exception {
        when(userService.getUserById("1")).thenReturn(ResponseEntity.ok(userDTO));

        mockMvc.perform(MockMvcRequestBuilders.get("/user")
                        .param("id", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.login").value("testUser"));
    }

    @Test
    public void testGetUserByIdUserNotFound() throws Exception {
        when(userService.getUserById("nonexistentId")).thenThrow(new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND));

        mockMvc.perform(MockMvcRequestBuilders.get("/user")
                        .param("id", "nonexistentId")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void testCreateUser() throws Exception {
        when(userService.createUser(any(UserDTO.class))).thenReturn(ResponseEntity.ok(userDTO));

        mockMvc.perform(MockMvcRequestBuilders.post("/create-user")
                        .content(asJsonString(userDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.login").value("testUser"));
    }

    @Test
    public void testUpdateUserUserExist() throws Exception {
        when(userService.updateUser(any(UserDTO.class))).thenReturn(ResponseEntity.ok(userDTO));

        mockMvc.perform(MockMvcRequestBuilders.put("/update-user")
                        .content(asJsonString(userDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.login").value("testUser"));
    }

    @Test
    public void testUpdateUserLoginAlreadyExist() throws Exception {
        when(userService.updateUser(any(UserDTO.class))).thenThrow(new CustomRuntimeException(CustomRuntimeException.USER_LOGIN_ALREADY_EXISTS));

        mockMvc.perform(MockMvcRequestBuilders.put("/update-user")
                        .content(asJsonString(userDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isConflict());
    }

    @Test
    public void testUpdateUserUserNotFound() throws Exception {
        when(userService.updateUser(any(UserDTO.class))).thenThrow(new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND));

        mockMvc.perform(MockMvcRequestBuilders.put("/update-user")
                        .content(asJsonString(new UserDTO()))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void testDeleteUserUserExist() throws Exception {
        when(userService.deleteUser("1")).thenReturn(ResponseEntity.ok(userDTO));

        mockMvc.perform(MockMvcRequestBuilders.delete("/delete-user")
                        .param("id", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.login").value("testUser"));
    }

    @Test
    public void testDeleteUserUserNotFound() throws Exception {
        when(userService.deleteUser("nonexistentId")).thenThrow(new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND));

        mockMvc.perform(MockMvcRequestBuilders.delete("/delete-user")
                        .param("id", "nonexistentId")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    // Méthode utilitaire pour convertir un objet en JSON
    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}