package com.hospital.hospitalsystem.controller;

import com.hospital.hospitalsystem.dto.SearchSuggestion;
import com.hospital.hospitalsystem.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/suggestions")
    public ResponseEntity<List<SearchSuggestion>> getSuggestions(@RequestParam String q) {
        return ResponseEntity.ok(searchService.getSuggestions(q));
    }

    @GetMapping
    public ResponseEntity<List<Object>> search(@RequestParam String q) {
        return ResponseEntity.ok(searchService.globalSearch(q));
    }
}
