package com.hotel.management.repository;

import com.hotel.management.entity.Invoice;
import com.hotel.management.entity.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByInvoiceCode(String invoiceCode);
    Optional<Invoice> findByBookingId(Long bookingId);
    long countByStatus(InvoiceStatus status);
}
