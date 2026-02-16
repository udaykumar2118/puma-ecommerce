package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.service.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final InventoryService inventoryService;

    public AdminController(ProductService productService,
                           OrderService orderService,
                           InventoryService inventoryService) {
        this.productService = productService;
        this.orderService = orderService;
        this.inventoryService = inventoryService;
    }

    // ================= PRODUCT MANAGEMENT =================

    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable Long id,
                                 @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    // ⭐ SET MINIMUM STOCK LEVEL
    @PutMapping("/inventory/min-level")
    public Product updateMinStock(
            @RequestParam Long productId,
            @RequestParam int minLevel) {

        Product product = productService.getProductById(productId);
        product.setMinStockLevel(minLevel);
        return productService.addProduct(product);
    }

    // ================= ORDER MANAGEMENT =================

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/orders/{orderId}/status")
    public Order updateOrderStatus(@PathVariable Long orderId,
                                   @RequestParam OrderStatus status) {
        return orderService.updateOrderStatus(orderId, status);
    }

    // =====================================================
    // ⭐⭐⭐ INVENTORY APIs ⭐⭐⭐
    // =====================================================

    // ➕ Add stock (Purchase entry)
    @PostMapping("/inventory/add-stock")
    public Product addStock(@RequestParam Long productId,
                            @RequestParam int quantity,
                            @RequestParam String note) {
        return inventoryService.addStock(productId, quantity, note);
    }

    // ⚙️ Manual adjustment (+ / -)
    @PostMapping("/inventory/adjust-stock")
    public Product adjustStock(@RequestParam Long productId,
                               @RequestParam int quantity,
                               @RequestParam String note) {
        return inventoryService.adjustStock(productId, quantity, note);
    }

    // 📉 Low stock products
    @GetMapping("/inventory/low-stock")
    public List<Product> lowStockProducts() {
        return inventoryService.getLowStockProducts();
    }

    // 📜 Inventory history per product
    @GetMapping("/inventory/history/{productId}")
    public List<InventoryTransaction> history(@PathVariable Long productId) {
        return inventoryService.getHistory(productId);
    }
}