package com.example.trailsapi;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// The club's trails API: the list of trails. Spring Security lets only a call with a good token get here.
@RestController
public class TrailsController {
    private final String trails;

    TrailsController() throws IOException {
        trails = new ClassPathResource("trails.json").getContentAsString(StandardCharsets.UTF_8);
    }

    @GetMapping(value = "/api/trails", produces = MediaType.APPLICATION_JSON_VALUE)
    String trails() {
        return trails;
    }
}
