package com.example.trailguide;

// A trail, as trails.json has it.
public record Trail(long id, String name, double km, int climb, String level) {}
