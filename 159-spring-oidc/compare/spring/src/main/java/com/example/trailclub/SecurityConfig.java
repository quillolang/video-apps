package com.example.trailclub;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

// The home page is open to all; logging in is OpenID Connect, with the club's provider.
@Configuration
public class SecurityConfig {
    @Bean
    SecurityFilterChain security(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(a -> a.requestMatchers("/").permitAll().anyRequest().authenticated())
            .oauth2Login(Customizer.withDefaults())
            .build();
    }
}
