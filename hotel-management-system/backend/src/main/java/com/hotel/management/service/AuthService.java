package com.hotel.management.service;

import com.hotel.management.dto.JwtResponse;
import com.hotel.management.dto.LoginRequest;
import com.hotel.management.dto.RegisterRequest;
import com.hotel.management.entity.User;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    User registerUser(RegisterRequest registerRequest);
}
