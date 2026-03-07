package com.rk.dashboard.controller;

import com.rk.dashboard.model.ResultsDataDTO;
import com.rk.dashboard.repository.ResultsRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/results")
public class ResultsController {

    private final ResultsRepository resultsRepository;

    public ResultsController(ResultsRepository resultsRepository) {
        this.resultsRepository = resultsRepository;
    }

    @GetMapping("/{userId}")
    public ResultsDataDTO getResults(@PathVariable String userId) {
        return resultsRepository.getResultsForUser(userId);
    }
}
