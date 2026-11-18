package com.example.signups;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

// Sign-ups for the bake sale: who's coming, and how many guests.
@RestController
@RequestMapping("/api/signups")
public class SignupController {
	public record Signup(String name, String email, int guests) {}

	private final List<Signup> signups = new CopyOnWriteArrayList<>();

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	Signup add(@RequestBody Signup signup) {
		signups.add(signup);
		return signup;
	}

	@GetMapping
	List<Signup> all() {
		return signups;
	}
}
