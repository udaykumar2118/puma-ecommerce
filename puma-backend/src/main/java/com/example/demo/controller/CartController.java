package com.example.demo.controller;

import com.example.demo.dto.CartResponse;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // ADD TO CART (JWT)
    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(
            @RequestHeader("Authorization") String header,
            @RequestParam Long productId,
            @RequestParam int quantity
    ){
        String token = header.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                cartService.addToCart(user.getId(), productId, quantity)
        );
    }

    //  GET MY CART (JWT) 
    @GetMapping("/my")
    public ResponseEntity<CartResponse> getMyCart(
            @RequestHeader("Authorization") String header
    ){
        String token = header.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                cartService.getUserCart(user.getId())
        );
    }

    // INCREASE QTY 
    @PutMapping("/{cartId}/increase")
    public ResponseEntity<CartItem> increaseQty(@PathVariable Long cartId){
        return ResponseEntity.ok(cartService.increaseQty(cartId));
    }

    // DECREASE QTY 
    @PutMapping("/{cartId}/decrease")
    public ResponseEntity<CartItem> decreaseQty(@PathVariable Long cartId){
        return ResponseEntity.ok(cartService.decreaseQty(cartId));
    }

    // REMOVE ITEM 
    @DeleteMapping("/{cartId}")
    public ResponseEntity<String> removeItem(@PathVariable Long cartId){
        cartService.removeItem(cartId);
        return ResponseEntity.ok("Item removed");
    }
}
