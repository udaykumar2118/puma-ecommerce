package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.PaymentRepository;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final OrderRepository orderRepo;
    private final InvoiceService invoiceService;

    public PaymentService(PaymentRepository paymentRepo,
                          OrderRepository orderRepo,
                          InvoiceService invoiceService) {
        this.paymentRepo = paymentRepo;
        this.orderRepo = orderRepo;
        this.invoiceService = invoiceService;
    }

    // ======================================================
    // 💳 VERIFY RAZORPAY PAYMENT
    // ======================================================
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

        // ⭐ UPDATE ORDER STATUS
        order.setStatus(OrderStatus.PAID);
        orderRepo.save(order);

        // ⭐ CREATE INVOICE
        invoiceService.createInvoice(orderId, "RAZORPAY");

        return payment;
    }

    // ======================================================
    // 💵 CASH ON DELIVERY
    // ======================================================
    public Payment confirmCOD(Long orderId) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod("COD");
        payment.setStatus(PaymentStatus.SUCCESS);

        paymentRepo.save(payment);

        order.setStatus(OrderStatus.PLACED);
        orderRepo.save(order);

        // ⭐ CREATE INVOICE
        invoiceService.createInvoice(orderId, "COD");

        return payment;
    }
}
