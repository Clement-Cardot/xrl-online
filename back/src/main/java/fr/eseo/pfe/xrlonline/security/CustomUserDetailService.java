package fr.eseo.pfe.xrlonline.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import fr.eseo.pfe.xrlonline.exception.CustomRuntimeException;
import fr.eseo.pfe.xrlonline.service.UserService;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service("customUserDetailService")
public class CustomUserDetailService implements UserDetailsService{

    private final UserService userService;

    public CustomUserDetailService(UserService userService) {
        super();
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        try {
            userService.getUserByLogin(login);
            return User.withUsername(login)
                    .password(login)
                    .build();
        } catch (CustomRuntimeException e) {
            log.error(e);
            throw new UsernameNotFoundException("Login not found !");
        }
    }
    
}
