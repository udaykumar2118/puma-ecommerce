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

    // 🔻 Reduce stock after customer order
    public void reduceStock(Product product, int quantity) {

        if (product.getStock() < quantity)
            throw new RuntimeException(product.getName() + " is out of stock");

        int previous = product.getStock();
        int newStock = previous - quantity;

        product.setStock(newStock);
        productRepo.save(product);

        saveTransaction(product, TransactionType.SALE, quantity,
                previous, newStock, "Customer order");
    }

    // 🔺 Add stock (Purchase from supplier)
    public Product addStock(Long productId, int quantity, String note) {

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int previous = product.getStock();
        int newStock = previous + quantity;

        product.setStock(newStock);
        productRepo.save(product);

        saveTransaction(product, TransactionType.PURCHASE, quantity,
                previous, newStock, note);

        return product;
    }

    // ⚙️ Manual adjustment
    public Product adjustStock(Long productId, int quantity, String note) {

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int previous = product.getStock();
        int newStock = previous + quantity;

        product.setStock(newStock);
        productRepo.save(product);

        saveTransaction(product, TransactionType.ADJUSTMENT, quantity,
                previous, newStock, note);

        return product;
    }

    // ⭐ Set minimum stock level
    public Product setMinStockLevel(Long productId, Integer minLevel) {

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setMinStockLevel(minLevel);
        return productRepo.save(product);
    }

    // 📉 Get low stock products
    public List<Product> getLowStockProducts() {
        return productRepo.findLowStockProducts();
    }

    // 📜 Get inventory history
    public List<InventoryTransaction> getHistory(Long productId) {
        return transactionRepo.findByProductIdOrderByCreatedAtDesc(productId);
    }

    // 💾 Save inventory transaction
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