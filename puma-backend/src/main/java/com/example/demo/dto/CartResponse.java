package com.example.demo.dto;

import com.example.demo.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class CartResponse {
    private List<CartItem> items;
    private BigDecimal totalAmount;
}
