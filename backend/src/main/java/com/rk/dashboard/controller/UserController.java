package com.rk.dashboard.controller;

import com.rk.dashboard.model.StudentStatDTO;
import com.rk.dashboard.model.UserDTO;
import com.rk.dashboard.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/sync")
    public ResponseEntity<Void> syncUser(@RequestBody UserDTO user) {
        userRepository.upsertUser(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<StudentStatDTO>> getAllStudentsStats() {
        return ResponseEntity.ok(userRepository.getAllStudentsStats());
    }
}
