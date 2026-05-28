package com.flittly.bankendspringboot.mapper;

import com.flittly.bankendspringboot.entity.UserPurchase;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;
import java.util.UUID;

@Mapper
public interface UserPurchaseMapper {
    List<UserPurchase> findByUserId(@Param("userId") UUID userId, @Param("isExpired") Boolean isExpired);
    UserPurchase findByUserAndPackage(@Param("userId") UUID userId, @Param("packageId") UUID packageId);
    int insert(UserPurchase purchase);
    int expireOldPurchases();
    boolean existsByUserAndPackage(@Param("userId") UUID userId, @Param("packageId") UUID packageId);
}
