package fr.eseo.pfe.xrlonline.service;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.model.dto.UserDTO;
import fr.eseo.pfe.xrlonline.model.entity.User;
import fr.eseo.pfe.xrlonline.repository.UserRepository;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class LoginService {

    private final UserRepository userRepository;

    private final ModelMapper modelMapper;

    private final AuthenticationManager authenticationManager;

    public LoginService(UserRepository userRepository, ModelMapper modelMapper, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.authenticationManager = authenticationManager;
    }
    
    public ResponseEntity<UserDTO> login(String login) throws CustomRuntimeException {
    Authentication authentication = null;
    try {
        authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(login, login));
    } catch (AuthenticationException e) {
        log.warn("Authentication failed for user : {}", login);
        throw new CustomRuntimeException(CustomRuntimeException.USER_NOT_FOUND);
    }

    SecurityContextHolder.getContext().setAuthentication(authentication);
    UserDetails userDetails = (UserDetails) authentication.getPrincipal();

    User user = this.userRepository.findByLogin(userDetails.getUsername());

    UserDTO response = modelMapper.map(user, UserDTO.class);

    return new ResponseEntity<>(response, HttpStatus.OK);
    }
}