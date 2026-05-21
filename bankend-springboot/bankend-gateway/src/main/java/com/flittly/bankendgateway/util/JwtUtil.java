package com.flittly.bankendgateway.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * JWT 工具类：负责 Token 的解析、校验与信息提取
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    /**
     * 校验 Token 是否合法且未过期
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(io.jsonwebtoken.security.Keys.hmacShaKeyFor(secret.getBytes())).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 获取用户 ID
     */
    public String getUserId(String token) {
        Claims claims = getClaims(token);
        return claims.get("userId", String.class);
    }

    /**
     * 获取用户名
     */
    public String getUsername(String token) {
        Claims claims = getClaims(token);
        return claims.getSubject();
    }

    /**
     * 获取角色信息
     */
    public String getRoles(String token) {
        Claims claims = getClaims(token);
        return claims.get("roles", String.class);
    }

    /**
     * 解析 Claims
     */
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(io.jsonwebtoken.security.Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
