package com.example.signups;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

// Sign-ups for the bake sale: who's coming, and how many guests. Each field's rules are annotations, and @Valid
// checks them before the method runs.
@RestController
@RequestMapping("/api/signups")
public class SignupController {
	public record Signup(
		@NotBlank String name,
		@NotBlank @Email String email,
		@NotNull @Min(0) @Max(8) Integer guests) {}

	private final List<Signup> signups = new CopyOnWriteArrayList<>();

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	Signup add(@Valid @RequestBody Signup signup) {
		signups.add(signup);
		return signup;
	}

	@GetMapping
	List<Signup> all() {
		return signups;
	}
}
