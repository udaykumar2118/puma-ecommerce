package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    // USER REGISTER
    @PostMapping("/register")
    public LoginResponse register(@RequestBody RegisterRequest req) {

        if (userRepo.findByEmail(req.getEmail()).isPresent())
            throw new RuntimeException("Email already exists");

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setRole(Role.USER);

        userRepo.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new LoginResponse(
                token,
                user.getRole().name(),
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }

    // LOGIN (USER + ADMIN)
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {

        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid password");

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new LoginResponse(
                token,
                user.getRole().name(), 
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }

    // PROFILE
    @GetMapping("/me")
    public User getProfile(@RequestHeader("Authorization") String header) {

        String token = header.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
