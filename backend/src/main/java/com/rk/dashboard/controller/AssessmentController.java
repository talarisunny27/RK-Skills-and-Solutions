package com.rk.dashboard.controller;

import com.rk.dashboard.model.AssessmentDTO;
import com.rk.dashboard.repository.AssessmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/assessments")
public class AssessmentController {

    private final AssessmentRepository assessmentRepository;

    public AssessmentController(AssessmentRepository assessmentRepository) {
        this.assessmentRepository = assessmentRepository;
    }

    // --- Student ---
    @GetMapping("/{userId}")
    public List<AssessmentDTO> getAssessments(@PathVariable String userId, @RequestParam(defaultValue = "ALL") String college) {
        return assessmentRepository.getAssessmentsForUser(userId, college);
    }

    // --- Admin ---
    @GetMapping("/admin/all")
    public List<AssessmentDTO> getAllAssessmentsAdmin() {
        return assessmentRepository.getAllAssessments();
    }

    @GetMapping("/colleges")
    public List<String> getUniqueColleges() {
        return assessmentRepository.getUniqueColleges();
    }

    @PostMapping("/admin")
    public AssessmentDTO createAssessment(@RequestBody Map<String, Object> body) {
        return assessmentRepository.createAssessment(body);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<Void> updateAssessment(@PathVariable int id, @RequestBody Map<String, Object> body) {
        int updated = assessmentRepository.updateAssessment(id, body);
        return updated > 0 ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteAssessment(@PathVariable int id) {
        int deleted = assessmentRepository.deleteAssessment(id);
        return deleted > 0 ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
