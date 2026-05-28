package com.flittly.bankendspringboot.controller;

import com.flittly.bankendspringboot.dto.*;
import com.flittly.bankendspringboot.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/")
    public ResponseEntity<OrderResponse> createOrder(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody OrderCreateRequest request) {
        OrderResponse order = orderService.createOrder(UUID.fromString(userId), request.getPackageIds());
        if (order == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(order);
    }

    @GetMapping("/")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        return ResponseEntity.ok(orderService.getUserOrders(UUID.fromString(userId), status, limit, offset));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable("id") UUID id) {
        OrderResponse order = orderService.getOrderById(id);
        if (order == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(order);
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<?> payOrder(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable("id") UUID id,
            @RequestBody OrderPayRequest request) {
        boolean success = orderService.payOrder(id, request.getPaymentMethod());
        if (!success) return ResponseEntity.badRequest().body(MessageResponse.error(1001, "Payment failed"));
        return ResponseEntity.ok(MessageResponse.success("Payment successful"));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable("id") UUID id) {
        boolean success = orderService.cancelOrder(id, UUID.fromString(userId));
        if (!success) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(MessageResponse.success("Order cancelled"));
    }
}
