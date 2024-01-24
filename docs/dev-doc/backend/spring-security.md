# Spring Security

## Authentication

We use Spring Security to handle the authentication in the back end. As requested, we do not use any password for the authentication. We only use the username. Spring security does not allow us to do that by default. We had to override the default behavior of the UserDetailsService to make it work.

We inject the login in the password field of the User object. We also define the role of the user depending on the login. If the login is `admin` the role will be `ADMIN` otherwise it will be `USER`.

```java title="CustomUserDetailsService.java"
@Override
public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
    try {
        userService.getUserByLogin(login);
        return User.withUsername(login)
                .password(login)
                .roles(login.equals("admin") ? "ADMIN" : "USER")
                .build();
    } catch (CustomRuntimeException e) {
        log.error(e);
        throw new UsernameNotFoundException("Login not found !");
    }
}
```

With this hack, we can use the default behavior of Spring Security to authenticate the user.

## Request Authorization

Even if we do not use any password, we still want to secure our API from unauthorized access. We have define in the SecurityFilterChain the authorization rules for each endpoint.

```java
.requestMatchers(new AntPathRequestMatcher("/users/login")).permitAll()

// Users Admin Routes
.requestMatchers(new AntPathRequestMatcher("/users/create-user")).hasRole(ADMIN_ROLE)
.requestMatchers(new AntPathRequestMatcher("/users/update-user")).hasRole(ADMIN_ROLE)
.requestMatchers(new AntPathRequestMatcher("/users/delete-user")).hasRole(ADMIN_ROLE)

// Teams Admin Routes
.requestMatchers(new AntPathRequestMatcher("/teams/create-team")).hasRole(ADMIN_ROLE)
.requestMatchers(new AntPathRequestMatcher("/teams/update-team")).hasRole(ADMIN_ROLE)
.requestMatchers(new AntPathRequestMatcher("/teams/delete-team")).hasRole(ADMIN_ROLE)

// RL Admin Routes
.requestMatchers(new AntPathRequestMatcher("/readiness-levels/create-readiness-level")).hasRole(ADMIN_ROLE)
.requestMatchers(new AntPathRequestMatcher("/readiness-levels/update-readiness-level")).hasRole(ADMIN_ROLE)
.requestMatchers(new AntPathRequestMatcher("/readiness-levels/delete-readiness-level")).hasRole(ADMIN_ROLE)

// BL Admin Routes
.requestMatchers(new AntPathRequestMatcher("/business-lines/create-business-line")).hasRole(ADMIN_ROLE)
.requestMatchers(new AntPathRequestMatcher("/business-lines/update-business-line")).hasRole(ADMIN_ROLE)
.requestMatchers(new AntPathRequestMatcher("/business-lines/delete-business-line")).hasRole(ADMIN_ROLE)

// Publics Routes
.requestMatchers(new AntPathRequestMatcher("/projects/get-all-projects")).permitAll()
.requestMatchers(new AntPathRequestMatcher("/projects/get-project-by-id")).permitAll()
.requestMatchers(new AntPathRequestMatcher("/projects/get-projects-by-team-id")).permitAll()
.requestMatchers(new AntPathRequestMatcher("/projects/get-projects-by-business-line-id")).permitAll()
.requestMatchers(new AntPathRequestMatcher("/readiness-levels/get-all-readiness-levels")).permitAll()
.requestMatchers(new AntPathRequestMatcher("/readiness-levels/get-readiness-level-by-id")).permitAll()

// download report
.requestMatchers(new AntPathRequestMatcher("/report/**")).permitAll()

.anyRequest().authenticated()
```

## Session Management

We use the default session management of Spring Security. We just have change it expiration time to -1 to make it last forever.

(application.properties)
```properties
# Cookie Properties
server.servlet.session.timeout=-1
```
