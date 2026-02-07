package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.service.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;

    public AdminController(ProductService productService,
                           OrderService orderService) {
        this.productService = productService;
        this.orderService = orderService;
    }

    // ➕ ADD PRODUCT
    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    // ✏️ UPDATE PRODUCT
    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable Long id,
                                 @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    // ❌ DELETE PRODUCT
    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    // 📦 VIEW ALL ORDERS
    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // 🔄 UPDATE ORDER STATUS
    @PutMapping("/orders/{orderId}/status")
    public Order updateOrderStatus(@PathVariable Long orderId,
                                   @RequestParam OrderStatus status) {
        return orderService.updateOrderStatus(orderId, status);
    }
}
