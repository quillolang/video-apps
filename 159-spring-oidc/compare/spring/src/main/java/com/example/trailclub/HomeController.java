package com.example.trailclub;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.web.util.HtmlUtils.htmlEscape;

// Trail Club: log in with the club's OpenID Connect provider, through Spring Security.
@RestController
public class HomeController {
    private final String css;

    HomeController() throws IOException {
        css = new ClassPathResource("club.css").getContentAsString(StandardCharsets.UTF_8);
    }

    private String page(String body) {
        return "<!doctype html><title>Trail Club</title><style>" + css + "</style><main>" + body + "</main>";
    }

    @GetMapping("/")
    String home(@AuthenticationPrincipal OidcUser user) {
        if (user == null) {
            return page("<h1>Trail Club</h1><p><a href=\"/oauth2/authorization/club\">Log in</a></p>");
        }
        return page("<h1>Trail Club: hello, " + htmlEscape(user.getFullName()) + "</h1>"
            + "<p class=\"who\">Signed in as " + htmlEscape(user.getSubject()) + ".</p>");
    }
}
