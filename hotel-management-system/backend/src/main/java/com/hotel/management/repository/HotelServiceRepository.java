package com.hotel.management.repository;

import com.hotel.management.entity.HotelService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HotelServiceRepository extends JpaRepository<HotelService, Long> {
    List<HotelService> findByActiveTrue();
    List<HotelService> findByCategory(String category);
}
