package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    // ADD TO WISHLIST
    public void add(Long userId, Long productId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // prevent duplicate wishlist items
        if (wishlistRepo.findByUserIdAndProductId(userId, productId).isPresent())
            return;

        Wishlist wish = new Wishlist();
        wish.setUser(user);
        wish.setProduct(product);

        wishlistRepo.save(wish);
    }

    // GET USER WISHLIST
    public List<Wishlist> getUserWishlist(Long userId) {
        return wishlistRepo.findByUserId(userId);
    }

 // REMOVE FROM WISHLIST (SAFE DELETE)
    public void remove(Long userId, Long productId) {

        wishlistRepo.findByUserIdAndProductId(userId, productId)
                .ifPresent(wishlistRepo::delete);
    }

}
