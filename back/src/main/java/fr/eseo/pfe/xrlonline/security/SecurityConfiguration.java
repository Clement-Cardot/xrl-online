package fr.eseo.pfe.xrlonline.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {

	private static final String ADMIN_ROLE = "ADMIN";

	UserDetailsService userDetailsService;

	public SecurityConfiguration(UserDetailsService userDetailsService) {
		this.userDetailsService = userDetailsService;
	}

    @Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, CustomUserDetailService userDetailsService) throws Exception {
		http
			.csrf(AbstractHttpConfigurer::disable) // CSRF Disabled until we need to implement login with password
			.securityContext(securityContext -> securityContext
				.requireExplicitSave(false)
			)
			.authenticationProvider(authenticationProvider(userDetailsService))
			.sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
			.authorizeHttpRequests(authorize -> authorize
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
					
			);
		return http.build();
	}

	@Bean
    public DaoAuthenticationProvider authenticationProvider(CustomUserDetailService userDetailsService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);

        return authProvider;
    }

	@Bean
    public AuthenticationManager customAuthenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder
			.userDetailsService(userDetailsService)
			.passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder.build();
    }

	@Bean
	public static NoOpPasswordEncoder passwordEncoder() {
	return (NoOpPasswordEncoder) NoOpPasswordEncoder.getInstance();
	}
	
}
