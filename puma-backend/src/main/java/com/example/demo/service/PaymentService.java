package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.PaymentRepository;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final OrderRepository orderRepo;
    private final InvoiceService invoiceService;

    // ⭐ NEW DEPENDENCIES
    private final OrderItemRepository orderItemRepo;
    private final InventoryService inventoryService;

    public PaymentService(PaymentRepository paymentRepo,
                          OrderRepository orderRepo,
                          InvoiceService invoiceService,
                          OrderItemRepository orderItemRepo,
                          InventoryService inventoryService) {
        this.paymentRepo = paymentRepo;
        this.orderRepo = orderRepo;
        this.invoiceService = invoiceService;
        this.orderItemRepo = orderItemRepo;
        this.inventoryService = inventoryService;
    }

    // ================= RAZORPAY PAYMENT =================
    public Payment verifyRazorpayPayment(Long orderId,
                                         String razorpayOrderId,
                                         String razorpayPaymentId,
                                         String razorpaySignature) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod("RAZORPAY");
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setRazorpayOrderId(razorpayOrderId);
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(razorpaySignature);

        paymentRepo.save(payment);

        // update order status
        order.setStatus(OrderStatus.PAID);
        orderRepo.save(order);

        // ⭐⭐⭐ INVENTORY LOGIC (NEW)
        orderItemRepo.findByOrderId(orderId)
                .forEach(item ->
                        inventoryService.reduceStock(
                                item.getProduct(),
                                item.getQuantity()
                        )
                );

        // create invoice
        invoiceService.createInvoice(orderId, "RAZORPAY");

        return payment;
    }

    // ================= CASH ON DELIVERY =================
    public Payment confirmCOD(Long orderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod("COD");
        payment.setStatus(PaymentStatus.SUCCESS);

        paymentRepo.save(payment);

        // update order status
        order.setStatus(OrderStatus.PLACED);
        orderRepo.save(order);

        // ⭐⭐⭐ INVENTORY LOGIC (NEW)
        orderItemRepo.findByOrderId(orderId)
                .forEach(item ->
                        inventoryService.reduceStock(
                                item.getProduct(),
                                item.getQuantity()
                        )
                );

        // create invoice
        invoiceService.createInvoice(orderId, "COD");

        return payment;
    }
}