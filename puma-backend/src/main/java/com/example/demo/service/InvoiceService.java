package com.example.demo.service;

import com.example.demo.entity.Invoice;
import com.example.demo.entity.Order;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.repository.OrderRepository;
import org.springframework.stereotype.Service;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepo;
    private final OrderRepository orderRepo;

    public InvoiceService(InvoiceRepository invoiceRepo,
                          OrderRepository orderRepo) {
        this.invoiceRepo = invoiceRepo;
        this.orderRepo = orderRepo;
    }

    // ⭐ CREATE INVOICE AFTER PAYMENT
    public Invoice createInvoice(Long orderId, String method){

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Invoice invoice = new Invoice();
        invoice.setOrderId(orderId);
        invoice.setCustomerName(order.getUser().getName());
        invoice.setEmail(order.getUser().getEmail());
        invoice.setAmount(order.getTotalAmount().doubleValue());
        invoice.setPaymentMethod(method);

        return invoiceRepo.save(invoice);
    }

    // ⭐ GET INVOICE
    public Invoice getInvoice(Long orderId){
        Invoice invoice = invoiceRepo.findByOrderId(orderId);
        if(invoice == null)
            throw new RuntimeException("Invoice not found for order " + orderId);
        return invoice;
    }
}
