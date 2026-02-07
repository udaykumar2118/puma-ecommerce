package com.example.demo.repository;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByStatus(OrderStatus status);

    // 💰 Revenue between dates
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderDate BETWEEN :start AND :end")
    BigDecimal getRevenueBetween(LocalDateTime start, LocalDateTime end);

    // 🔢 Orders count between dates
    long countByOrderDateBetween(LocalDateTime start, LocalDateTime end);
}
