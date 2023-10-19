# Service

Services are the core of the back-end, this is where every action is made.<br>
A service is linked to one or multiple repository to work with DB.<br>
We also use a modelMapper to convert Entities to DTO and vice versa.

```java
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

    ...
}
```