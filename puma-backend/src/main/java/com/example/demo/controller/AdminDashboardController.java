package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.entity.OrderStatus;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin
public class AdminDashboardController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    public AdminDashboardController(OrderService orderService,
                                    UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    // 🔢 TOTAL ORDERS
    @GetMapping("/total-orders")
    public long totalOrders() {
        return orderService.getTotalOrders();
    }

    // 👤 TOTAL USERS
    @GetMapping("/total-users")
    public long totalUsers() {
        return userRepository.count();
    }

    // 💰 TOTAL REVENUE
    @GetMapping("/total-revenue")
    public BigDecimal totalRevenue() {
        return orderService.getTotalRevenue();
    }

    // 📦 ALL ORDERS
    @GetMapping("/orders")
    public List<Order> allOrders() {
        return orderService.getAllOrders();
    }

    // 🚚 ORDERS BY STATUS
    @GetMapping("/orders/status")
    public List<Order> ordersByStatus(@RequestParam OrderStatus status) {
        return orderService.getOrdersByStatus(status);
    }

    // 📅 MONTHLY REVENUE
    @GetMapping("/revenue/monthly")
    public BigDecimal monthlyRevenue(@RequestParam int year,
                                     @RequestParam int month) {
        return orderService.getMonthlyRevenue(year, month);
    }

    // 📅 YEARLY REVENUE
    @GetMapping("/revenue/yearly")
    public BigDecimal yearlyRevenue(@RequestParam int year) {
        return orderService.getYearlyRevenue(year);
    }

    // 🔢 MONTHLY ORDERS
    @GetMapping("/orders/monthly")
    public long monthlyOrders(@RequestParam int year,
                              @RequestParam int month) {
        return orderService.getMonthlyOrders(year, month);
    }

    // 🔢 YEARLY ORDERS
    @GetMapping("/orders/yearly")
    public long yearlyOrders(@RequestParam int year) {
        return orderService.getYearlyOrders(year);
    }

}
