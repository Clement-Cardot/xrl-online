    package fr.eseo.pfe.xrlonline.controller;

    import com.fasterxml.jackson.databind.ObjectMapper;
    import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
    import fr.eseo.pfe.xrlonline.model.dto.UserDTO;
    import fr.eseo.pfe.xrlonline.service.LoginService;
    import fr.eseo.pfe.xrlonline.service.UserService;
    import org.junit.jupiter.api.AfterEach;
    import org.junit.jupiter.api.BeforeEach;
    import org.junit.jupiter.api.Test;
    import org.mockito.InjectMocks;
    import org.mockito.Mock;
    import org.mockito.MockitoAnnotations;
    import org.springframework.http.MediaType;
    import org.springframework.http.ResponseEntity;
    import org.springframework.test.annotation.DirtiesContext;
    import org.springframework.test.web.servlet.MockMvc;
    import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
    import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
    import org.springframework.test.web.servlet.setup.MockMvcBuilders;

    import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
    import static org.mockito.Mockito.reset;
    import static org.mockito.Mockito.when;

@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @Mock
    private LoginService loginService;

        @InjectMocks
        private UserController userController;

        private UserDTO userDTO;
        private UserDTO nonexistentUserDTO;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
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
    void testLoginUserExist() throws Exception {
        when(loginService.login("testUser")).thenReturn(ResponseEntity.ok(userDTO));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.get("/users/login")
                            .param("login", "testUser")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.login").value("testUser"))
        );
                    
    }

    @Test
    void testLoginUserNotFound() throws Exception {
        when(loginService.login("nonexistentUser")).thenThrow(new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.get("/users/login")
                            .param("login", "nonexistentUser")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isNotFound())
        );
    }

    @Test
    void testGetAllUserUserExist() throws Exception {
        when(userService.getAllUser()).thenReturn(ResponseEntity.ok(Arrays.asList(userDTO, nonexistentUserDTO)));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.get("/users/get-all-users")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.jsonPath("$[0].login").value("testUser"))
                    .andExpect(MockMvcResultMatchers.jsonPath("$[1].login").value("nonexistentUser"))
        );
    }

    @Test
    void testGetAllUserUserNotFound() throws Exception {
        when(userService.getAllUser()).thenThrow(new CustomRuntimeException(CustomRuntimeException.USER_LIST_EMPTY));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.get("/users/get-all-users")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isNoContent())
        );
    }

    @Test
    void testGetUserByIdUserExist() throws Exception {
        when(userService.getUserById("1")).thenReturn(ResponseEntity.ok(userDTO));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.get("/users/get-user-by-id")
                            .param("id", "1")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.login").value("testUser"))
        );
    }

    @Test
    void testGetUserByIdUserNotFound() throws Exception {
        when(userService.getUserById("nonexistentId")).thenThrow(new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND));

        assertDoesNotThrow(() ->
            mockMvc.perform(MockMvcRequestBuilders.get("/users/get-user-by-id")
                            .param("id", "nonexistentId")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isNotFound())
        );
    }

    @Test
    void testCreateUser() throws Exception {
        when(userService.createUser(any(UserDTO.class))).thenReturn(ResponseEntity.ok(userDTO));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.post("/users/create-user")
                            .content(asJsonString(userDTO))
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.login").value("testUser"))
        );
    }

    @Test
    void testUpdateUserUserExist() throws Exception {
        when(userService.updateUser(any(UserDTO.class))).thenReturn(ResponseEntity.ok(userDTO));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.put("/users/update-user")
                            .content(asJsonString(userDTO))
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.login").value("testUser"))
        );
    }

    @Test
    void testUpdateUserLoginAlreadyExist() throws Exception {
        when(userService.updateUser(any(UserDTO.class))).thenThrow(new CustomRuntimeException(CustomRuntimeException.USER_LOGIN_ALREADY_EXISTS));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.put("/users/update-user")
                            .content(asJsonString(userDTO))
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isConflict())
        );
    }

    @Test
    void testUpdateUserUserNotFound() throws Exception {
        when(userService.updateUser(any(UserDTO.class))).thenThrow(new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.put("/users/update-user")
                            .content(asJsonString(userDTO))
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isNotFound())
        );
    }

    @Test
    void testDeleteUserUserExist() throws Exception {
        when(userService.deleteUser("1")).thenReturn(ResponseEntity.ok(userDTO));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.delete("/users/delete-user")
                            .param("id", "1")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.jsonPath("$.login").value("testUser"))
        );
    }

    @Test
    void testDeleteUserUserNotFound() throws Exception {
        when(userService.deleteUser("nonexistentId")).thenThrow(new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND));

        assertDoesNotThrow(() -> 
            mockMvc.perform(MockMvcRequestBuilders.delete("/users/delete-user")
                            .param("id", "nonexistentId")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(MockMvcResultMatchers.status().isNotFound())
        );
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