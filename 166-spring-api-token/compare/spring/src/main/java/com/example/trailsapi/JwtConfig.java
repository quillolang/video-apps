package com.example.trailsapi;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.JwtClaimNames;
import org.springframework.security.oauth2.jwt.JwtClaimValidator;
import org.springframework.security.oauth2.jwt.JwtIssuerValidator;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtTypeValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

// Access tokens of the kind RFC 9068 describes, "typ": "at+jwt": Spring's checks take only "JWT" unless told.
// So the checks, one by one: not expired, from this issuer, of that type, and for this API.
@Configuration
public class JwtConfig {
    @Bean
    JwtDecoder jwtDecoder(@Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}") String issuer,
                          @Value("${spring.security.oauth2.resourceserver.jwt.audiences}") String audience) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withIssuerLocation(issuer).validateType(false).build();
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
            new JwtTimestampValidator(),
            new JwtIssuerValidator(issuer),
            new JwtTypeValidator("at+jwt"),
            new JwtClaimValidator<List<String>>(JwtClaimNames.AUD,
                (aud) -> aud != null && aud.contains(audience))));
        return decoder;
    }
}
