package com.example.demo.service;

import com.example.demo.dto.CheckoutRequest;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;
    private final CartItemRepository cartRepo;
    private final UserRepository userRepo;

    public OrderService(OrderRepository orderRepo,
                        OrderItemRepository orderItemRepo,
                        CartItemRepository cartRepo,
                        UserRepository userRepo) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.cartRepo = cartRepo;
        this.userRepo = userRepo;
    }

    // PLACE ORDER WITH SHIPPING DETAILS
    public Order placeOrder(Long userId, CheckoutRequest req) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartRepo.findByUserId(userId);
        if (cartItems.isEmpty())
            throw new RuntimeException("Cart is empty");

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cartItems) {
            BigDecimal price = item.getProduct().getPrice();
            BigDecimal qty = BigDecimal.valueOf(item.getQuantity());
            total = total.add(price.multiply(qty));
        }

        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(total);
        order.setStatus(OrderStatus.PENDING);

        order.setFirstName(req.firstName);
        order.setLastName(req.lastName);
        order.setEmail(req.email);
        order.setPhone(req.phone);
        order.setAddress(req.address);
        order.setCity(req.city);
        order.setState(req.state);
        order.setPin(req.pin);

        order = orderRepo.save(order);

        // create order items
        for (CartItem item : cartItems) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(item.getProduct());
            oi.setQuantity(item.getQuantity());
            oi.setPrice(item.getProduct().getPrice());
            orderItemRepo.save(oi);
        }

        return order;
    }

    // USER ORDERS
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepo.findByUserId(userId);
    }

    // CANCEL ORDER
    public void cancelOrder(Long orderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() == OrderStatus.DELIVERED)
            throw new RuntimeException("Delivered order cannot be cancelled");

        order.setStatus(OrderStatus.CANCELLED);
        orderRepo.save(order);
    }

    // ADMIN FEATURES
    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        return orderRepo.save(order);
    }

    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepo.findByStatus(status);
    }

    public long getTotalOrders() {
        return orderRepo.count();
    }

    public BigDecimal getTotalRevenue() {
        return orderRepo.findAll()
                .stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // ANALYTICS
    public BigDecimal getMonthlyRevenue(int year, int month) {
        LocalDateTime start = LocalDate.of(year, month, 1).atStartOfDay();
        LocalDateTime end =
                start.with(TemporalAdjusters.lastDayOfMonth()).plusDays(1);

        return orderRepo.getRevenueBetween(start, end);
    }

    public BigDecimal getYearlyRevenue(int year) {
        LocalDateTime start = LocalDate.of(year, 1, 1).atStartOfDay();
        LocalDateTime end =
                LocalDate.of(year, 12, 31).atTime(23, 59, 59);

        return orderRepo.getRevenueBetween(start, end);
    }

    public long getMonthlyOrders(int year, int month) {
        LocalDateTime start = LocalDate.of(year, month, 1).atStartOfDay();
        LocalDateTime end =
                start.with(TemporalAdjusters.lastDayOfMonth()).plusDays(1);

        return orderRepo.countByOrderDateBetween(start, end);
    }

    public long getYearlyOrders(int year) {
        LocalDateTime start = LocalDate.of(year, 1, 1).atStartOfDay();
        LocalDateTime end =
                LocalDate.of(year, 12, 31).atTime(23, 59, 59);

        return orderRepo.countByOrderDateBetween(start, end);
    }
}
