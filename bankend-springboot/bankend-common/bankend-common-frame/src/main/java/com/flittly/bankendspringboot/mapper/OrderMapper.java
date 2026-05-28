package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface OrderMapper {
    List<Order> findByUserId(@Param("userId") UUID userId, @Param("status") String status,
                             @Param("limit") int limit, @Param("offset") int offset);
    List<Order> findAll(@Param("status") String status, @Param("limit") int limit, @Param("offset") int offset);
    Order findById(@Param("id") UUID id);
    Order findByOrderNo(@Param("orderNo") String orderNo);
    int insert(Order order);
    int updateStatus(@Param("id") UUID id, @Param("status") String status, @Param("paymentMethod") String paymentMethod);
    List<Order> findExpiredPending();
}
