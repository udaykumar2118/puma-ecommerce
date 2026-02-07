package com.example.demo.service;

import com.example.demo.dto.CartResponse;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    public CartItem addToCart(Long userId, Long productId, int quantity) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existing =
                cartRepo.findByUserIdAndProductId(userId, productId);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartRepo.save(item);
        }

        CartItem item = new CartItem();
        item.setUser(user);
        item.setProduct(product);
        item.setQuantity(quantity);

        return cartRepo.save(item);
    }

    public CartResponse getUserCart(Long userId){
        List<CartItem> items = cartRepo.findByUserId(userId);

        BigDecimal total = items.stream()
                .map(item ->
                        item.getProduct().getPrice()
                                .multiply(BigDecimal.valueOf(item.getQuantity()))
                )
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(items, total);
    }

    public CartItem increaseQty(Long cartId){
        CartItem item = cartRepo.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        item.setQuantity(item.getQuantity() + 1);
        return cartRepo.save(item);
    }

    public CartItem decreaseQty(Long cartId){
        CartItem item = cartRepo.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if(item.getQuantity() > 1)
            item.setQuantity(item.getQuantity() - 1);

        return cartRepo.save(item);
    }

    public void removeItem(Long cartId){
        cartRepo.deleteById(cartId);
    }
}
