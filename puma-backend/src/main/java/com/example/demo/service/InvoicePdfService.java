package com.example.demo.service;

import com.example.demo.entity.Invoice;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

@Service
public class InvoicePdfService {

    public ByteArrayInputStream generateInvoicePdf(Invoice invoice) {

        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
            Font textFont = new Font(Font.HELVETICA, 12);

            Paragraph title = new Paragraph("PUMA STORE INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Invoice ID: " + invoice.getId(), textFont));
            document.add(new Paragraph("Order ID: " + invoice.getOrderId(), textFont));
            document.add(new Paragraph("Customer: " + invoice.getCustomerName(), textFont));
            document.add(new Paragraph("Email: " + invoice.getEmail(), textFont));
            document.add(new Paragraph("Payment Method: " + invoice.getPaymentMethod(), textFont));
            document.add(new Paragraph("Amount Paid: ₹" + invoice.getAmount(), textFont));
            document.add(new Paragraph("Date: " + invoice.getCreatedAt(), textFont));

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Thank you for shopping with PUMA ❤️"));

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
