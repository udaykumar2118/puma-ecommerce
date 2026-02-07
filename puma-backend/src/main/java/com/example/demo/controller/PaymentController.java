package com.example.demo.controller;

import com.example.demo.entity.Payment;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.PaymentService;
import com.example.demo.service.RazorpayService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final RazorpayService razorpayService;
    private final PaymentService paymentService;
    private final OrderRepository orderRepo;

    public PaymentController(
            RazorpayService razorpayService,
            PaymentService paymentService,
            OrderRepository orderRepo) {
        this.razorpayService = razorpayService;
        this.paymentService = paymentService;
        this.orderRepo = orderRepo;
    }

    // ====================================
    // 🔥 CREATE RAZORPAY ORDER (FIXED)
    // ====================================
    @PostMapping("/create-razorpay-order")
    public Map<String, Object> createRazorpayOrder(@RequestParam Long orderId)
            throws Exception {

        var dbOrder = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // ⭐ FOR DEMO / TEST → charge ₹1 only
        int amount = 100;   // 100 paise = ₹1

        var razorpayOrder = razorpayService.createOrder(amount);

        Map<String, Object> response = new HashMap<>();
        response.put("razorpayOrderId", razorpayOrder.get("id"));
        response.put("amount", razorpayOrder.get("amount"));
        response.put("currency", razorpayOrder.get("currency"));
        response.put("orderId", dbOrder.getId());

        return response;
    }


    // ====================================
    // 🔐 VERIFY PAYMENT
    // ====================================
    @PostMapping("/verify")
    public Payment verifyPayment(@RequestBody RazorpayVerifyRequest req) {
        return paymentService.verifyRazorpayPayment(
                req.orderId,
                req.razorpay_order_id,
                req.razorpay_payment_id,
                req.razorpay_signature
        );
    }

    // ====================================
    // 💵 COD PAYMENT
    // ====================================
    @PostMapping("/cod")
    public Payment codPayment(@RequestParam Long orderId) {
        return paymentService.confirmCOD(orderId);
    }
}
