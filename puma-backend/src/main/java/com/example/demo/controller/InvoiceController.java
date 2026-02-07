package com.example.demo.controller;

import com.example.demo.entity.Invoice;
import com.example.demo.service.InvoicePdfService;
import com.example.demo.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoice")
@RequiredArgsConstructor
@CrossOrigin
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final InvoicePdfService pdfService;

    // GET INVOICE JSON
    @GetMapping("/{orderId}")
    public Invoice getInvoice(@PathVariable Long orderId){
        return invoiceService.getInvoice(orderId);
    }

    // DOWNLOAD PDF
    @GetMapping("/download/{orderId}")
    public ResponseEntity<InputStreamResource> downloadInvoice(@PathVariable Long orderId){

        Invoice invoice = invoiceService.getInvoice(orderId);
        var pdf = pdfService.generateInvoicePdf(invoice);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=invoice_" + orderId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }
}
