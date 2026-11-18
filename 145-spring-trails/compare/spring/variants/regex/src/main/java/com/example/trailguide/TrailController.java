package com.example.trailguide;

import java.io.IOException;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import tools.jackson.databind.json.JsonMapper;

// Trail Guide: a page for each trail, at /trails/<its number>.
@Controller
public class TrailController {
	private final List<Trail> trails;

	public TrailController(JsonMapper json) throws IOException {
		var file = new ClassPathResource("trails.json").getInputStream();
		trails = List.of(json.readValue(file, Trail[].class));
	}

	@GetMapping("/")
	String home(Model model) {
		model.addAttribute("trails", trails);
		return "home";
	}

	@GetMapping("/trails/{id:[1-9][0-9]*}")
	String trail(@PathVariable Long id, Model model) {
		Trail trail = trails.stream().filter(t -> t.id() == id).findFirst()
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No such trail"));
		model.addAttribute("trail", trail);
		return "trail";
	}
}
