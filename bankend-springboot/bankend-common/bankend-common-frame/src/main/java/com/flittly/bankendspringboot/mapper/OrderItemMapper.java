package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.OrderItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface OrderItemMapper {
    List<OrderItem> findByOrderId(@Param("orderId") UUID orderId);
    int insert(OrderItem orderItem);
    int insertBatch(@Param("items") List<OrderItem> items);
}
