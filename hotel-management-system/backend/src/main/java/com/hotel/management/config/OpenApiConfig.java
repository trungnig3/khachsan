package com.hotel.management.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI hotelManagementOpenAPI() {
        final String securitySchemeName = "BearerAuth";
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(
                        new Components()
                                .addSecuritySchemes(securitySchemeName,
                                        new SecurityScheme()
                                                .name(securitySchemeName)
                                                .type(SecurityScheme.Type.HTTP)
                                                .scheme("bearer")
                                                .bearerFormat("JWT")
                                                .description("Nhập Bearer Token để xác thực API")
                                )
                )
                .info(new Info()
                        .title("Hệ Thống Quản Lý Khách Sạn - REST API")
                        .description("RESTful API cho Hệ thống Quản lý Khách sạn Chuẩn Quốc Tế với Spring Boot 3, Spring Security & JWT")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Ban Quản Lý Aura Grand Resort")
                                .email("contact@auragrand.vn")
                                .url("https://auragrand.vn")
                        )
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}
