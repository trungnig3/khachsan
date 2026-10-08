package com.hotel.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HotelManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(HotelManagementApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🏨 AURA GRAND LUXURY HOTEL SYSTEM - BACKEND READY");
        System.out.println("🚀 Swagger UI: http://localhost:8080/swagger-ui.html");
        System.out.println("API Docs:   http://localhost:8080/v3/api-docs");
        System.out.println("=================================================");
    }
}
