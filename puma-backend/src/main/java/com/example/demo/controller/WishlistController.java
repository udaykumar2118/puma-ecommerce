package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.entity.Wishlist;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin
public class WishlistController {

    private final WishlistService wishlistService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // ADD TO WISHLIST (JWT)
    @PostMapping("/add")
    public void add(
            @RequestHeader("Authorization") String header,
            @RequestParam Long productId) {

        String token = header.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        wishlistService.add(user.getId(), productId);
    }

    // GET MY WISHLIST (JWT)
    @GetMapping("/my")
    public List<Wishlist> getMyWishlist(
            @RequestHeader("Authorization") String header) {

        String token = header.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return wishlistService.getUserWishlist(user.getId());
    }

    // REMOVE FROM WISHLIST (JWT)
    @DeleteMapping("/remove")
    public void remove(
            @RequestHeader("Authorization") String header,
            @RequestParam Long productId) {

        String token = header.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        wishlistService.remove(user.getId(), productId);
    }
}
