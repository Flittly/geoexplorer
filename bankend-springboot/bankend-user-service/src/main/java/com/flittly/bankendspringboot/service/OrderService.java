package com.flittly.bankendspringboot.service;

import com.flittly.bankendspringboot.dto.*;
import com.flittly.bankendspringboot.entity.*;
import com.flittly.bankendspringboot.mapper.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final CoursePackageMapper packageMapper;
    private final UserPurchaseMapper purchaseMapper;
    private static final AtomicInteger ORDER_SEQ = new AtomicInteger(0);

    @Transactional
    public OrderResponse createOrder(UUID userId, List<UUID> packageIds) {
        int totalAmount = 0;
        List<OrderItem> items = new ArrayList<>();
        for (UUID packageId : packageIds) {
            CoursePackage pkg = packageMapper.findById(packageId);
            if (pkg == null || !pkg.getIsActive()) continue;
            if (purchaseMapper.existsByUserAndPackage(userId, packageId)) continue;
            totalAmount += pkg.getSellingPrice();
            OrderItem item = new OrderItem();
            item.setId(UUID.randomUUID());
            item.setPackageId(packageId);
            item.setPrice(pkg.getSellingPrice());
            item.setCreatedAt(LocalDateTime.now());
            items.add(item);
        }
        if (items.isEmpty()) return null;
        String orderNo = generateOrderNo();
        Order order = new Order();
        order.setId(UUID.randomUUID());
        order.setUserId(userId);
        order.setOrderNo(orderNo);
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");
        order.setExpireTime(LocalDateTime.now().plusMinutes(30));
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.insert(order);
        for (OrderItem item : items) {
            item.setOrderId(order.getId());
        }
        orderItemMapper.insertBatch(items);
        return buildOrderResponse(order, items);
    }

    public List<OrderResponse> getUserOrders(UUID userId, String status, int limit, int offset) {
        List<Order> orders = orderMapper.findByUserId(userId, status, limit, offset);
        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            responses.add(buildOrderResponse(order, orderItemMapper.findByOrderId(order.getId())));
        }
        return responses;
    }

    public OrderResponse getOrderById(UUID orderId) {
        Order order = orderMapper.findById(orderId);
        if (order == null) return null;
        return buildOrderResponse(order, orderItemMapper.findByOrderId(order.getId()));
    }

    @Transactional
    public boolean payOrder(UUID orderId, String paymentMethod) {
        Order order = orderMapper.findById(orderId);
        if (order == null || !"PENDING".equals(order.getStatus())) return false;
        orderMapper.updateStatus(orderId, "PAID", paymentMethod);
        List<OrderItem> items = orderItemMapper.findByOrderId(orderId);
        for (OrderItem item : items) {
            CoursePackage pkg = packageMapper.findById(item.getPackageId());
            UserPurchase purchase = new UserPurchase();
            purchase.setId(UUID.randomUUID());
            purchase.setUserId(order.getUserId());
            purchase.setPackageId(item.getPackageId());
            purchase.setOrderId(orderId);
            purchase.setPurchasedAt(LocalDateTime.now());
            purchase.setExpireAt(LocalDateTime.now().plusDays(pkg != null ? pkg.getExpireDays() : 365));
            purchase.setIsExpired(false);
            purchaseMapper.insert(purchase);
        }
        return true;
    }

    public boolean cancelOrder(UUID orderId, UUID userId) {
        Order order = orderMapper.findById(orderId);
        if (order == null || !order.getUserId().equals(userId) || !"PENDING".equals(order.getStatus())) return false;
        orderMapper.updateStatus(orderId, "CANCELLED", null);
        return true;
    }

    public void cancelExpiredOrders() {
        List<Order> expired = orderMapper.findExpiredPending();
        for (Order order : expired) {
            orderMapper.updateStatus(order.getId(), "CANCELLED", null);
        }
    }

    private String generateOrderNo() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        int seq = ORDER_SEQ.incrementAndGet() % 10000;
        return String.format("GEO%s%04d", timestamp, seq);
    }

    private OrderResponse buildOrderResponse(Order order, List<OrderItem> items) {
        OrderResponse resp = new OrderResponse();
        resp.setId(order.getId());
        resp.setOrderNo(order.getOrderNo());
        resp.setTotalAmount(order.getTotalAmount());
        resp.setStatus(order.getStatus());
        resp.setPaymentMethod(order.getPaymentMethod());
        resp.setPaymentTime(order.getPaymentTime());
        resp.setExpireTime(order.getExpireTime());
        resp.setCreatedAt(order.getCreatedAt());
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        for (OrderItem item : items) {
            OrderItemResponse ir = new OrderItemResponse();
            ir.setId(item.getId());
            ir.setPackageId(item.getPackageId());
            ir.setPrice(item.getPrice());
            CoursePackage pkg = packageMapper.findById(item.getPackageId());
            if (pkg != null) {
                ir.setPackageTitle(pkg.getTitle());
                ir.setPackageCoverUrl(pkg.getCoverUrl());
            }
            itemResponses.add(ir);
        }
        resp.setItems(itemResponses);
        return resp;
    }
}
