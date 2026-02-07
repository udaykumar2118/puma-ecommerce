package com.example.demo.dto;

import lombok.Data;

@Data
public class CheckoutRequest {

    public String firstName;
    public String lastName;
    public String email;
    public String phone;
    public String address;
    public String city;
    public String state;
    public String pin;
}
