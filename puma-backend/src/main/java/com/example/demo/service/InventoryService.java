package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.InventoryTransactionRepository;
import com.example.demo.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ProductRepository productRepo;
    private final InventoryTransactionRepository transactionRepo;

    // 🔻 REDUCE STOCK AFTER PURCHASE
    public void reduceStock(Product product, int quantity) {

        if (product.getStock() < quantity)
            throw new RuntimeException(product.getName() + " is out of stock");

        int previous = product.getStock();
        int newStock = previous - quantity;

        product.setStock(newStock);
        productRepo.save(product);

        saveTransaction(product, TransactionType.SALE, quantity, previous, newStock, "Customer order");
    }

    // 🔺 ADD NEW STOCK (PURCHASE FROM SUPPLIER)
    public Product addStock(Long productId, int quantity, String note) {

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int previous = product.getStock();
        int newStock = previous + quantity;

        product.setStock(newStock);
        productRepo.save(product);

        saveTransaction(product, TransactionType.PURCHASE, quantity, previous, newStock, note);

        return product;
    }

    // ⚙️ MANUAL ADJUSTMENT
    public Product adjustStock(Long productId, int quantity, String note) {

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int previous = product.getStock();
        int newStock = previous + quantity;

        product.setStock(newStock);
        productRepo.save(product);

        saveTransaction(product, TransactionType.ADJUSTMENT, quantity, previous, newStock, note);

        return product;
    }

    // 📉 LOW STOCK PRODUCTS
    public List<Product> getLowStockProducts() {
        return productRepo.findLowStockProducts();
    }

    // 📜 INVENTORY HISTORY
    public List<InventoryTransaction> getHistory(Long productId) {
        return transactionRepo.findByProductIdOrderByCreatedAtDesc(productId);
    }

    // 💾 SAVE TRANSACTION
    private void saveTransaction(Product product,
                                 TransactionType type,
                                 int qty,
                                 int previous,
                                 int newStock,
                                 String note) {

        InventoryTransaction tx = new InventoryTransaction();
        tx.setProduct(product);
        tx.setType(type);
        tx.setQuantity(qty);
        tx.setPreviousStock(previous);
        tx.setNewStock(newStock);
        tx.setNote(note);

        transactionRepo.save(tx);
    }
}