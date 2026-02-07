package com.example.demo.controller;

import com.example.demo.dto.CheckoutRequest;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderItem;
import com.example.demo.entity.User;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin
public class OrderController {

    private final OrderService orderService;
    private final OrderItemRepository orderItemRepo;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // ======================================================
    // 🛒 PLACE ORDER WITH SHIPPING
    // ======================================================
    @PostMapping("/place")
    public Order placeOrder(
            @RequestHeader("Authorization") String header,
            @RequestBody CheckoutRequest req) {

        String token = header.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderService.placeOrder(user.getId(), req);
    }

    // ======================================================
    // 📦 MY ORDERS
    // ======================================================
    @GetMapping("/my")
    public List<Order> getMyOrders(@RequestHeader("Authorization") String header) {

        String token = header.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderService.getOrdersByUser(user.getId());
    }

    // ======================================================
    // 📄 ORDER ITEMS
    // ======================================================
    @GetMapping("/{orderId}/items")
    public List<OrderItem> getOrderItems(@PathVariable Long orderId) {
        return orderItemRepo.findByOrderId(orderId);
    }

    // ======================================================
    // ❌ CANCEL ORDER
    // ======================================================
    @PutMapping("/{orderId}/cancel")
    public String cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return "Order cancelled successfully";
    }
}
