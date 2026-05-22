package com.flittly.bankendgateway.filter;

import com.flittly.bankendgateway.config.GatewayAuthProperties;
import com.flittly.bankendgateway.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * 全局鉴权过滤器
 * 拦截所有经过网关的请求，校验 JWT Token，并将用户信息透传给下游服务
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AuthGlobalFilter implements GlobalFilter, Ordered {

    private final GatewayAuthProperties authProperties;
    private final JwtUtil jwtUtil;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        String method = exchange.getRequest().getMethod().name();

        // 0. OPTIONS 预检请求直接放行（由 Gateway CORS 配置处理）
        if ("OPTIONS".equalsIgnoreCase(method)) {
            return chain.filter(exchange);
        }

        // 1. 提取 Token（如果有的话）
        String token = extractToken(exchange.getRequest());

        // 2. 白名单路径：如果有 Token 则尝试注入用户信息，但不阻止请求
        if (isWhitelist(path)) {
            if (StringUtils.hasText(token) && jwtUtil.validateToken(token)) {
                ServerHttpRequest mutated = injectUserHeaders(exchange.getRequest(), token);
                return chain.filter(exchange.mutate().request(mutated).build());
            }
            return chain.filter(exchange);
        }

        // 3. 非白名单路径：校验 Token
        if (!StringUtils.hasText(token) || !jwtUtil.validateToken(token)) {
            return unauthorizedResponse(exchange, "未登录或登录已过期");
        }

        // 4. 解析用户信息并注入请求头
        ServerHttpRequest mutatedRequest = injectUserHeaders(exchange.getRequest(), token);

        // 5. 继续执行过滤器链
        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    @Override
    public int getOrder() {
        return 1000;
    }

    /**
     * 判断路径是否在白名单中
     */
    private boolean isWhitelist(String path) {
        List<String> whitelist = authProperties.getWhitelist();
        if (whitelist == null || whitelist.isEmpty()) return false;
        return whitelist.stream().anyMatch(pattern -> pathMatcher.match(pattern, path));
    }

    /**
     * 注入用户信息头（使用 set 而非 add，防止客户端伪造的 X-User-Id 透传下去）
     */
    private ServerHttpRequest injectUserHeaders(ServerHttpRequest request, String token) {
        return request.mutate()
                .headers(headers -> {
                    headers.set("X-User-Id", jwtUtil.getUserId(token));
                    headers.set("X-Username", jwtUtil.getUsername(token));
                    headers.set("X-User-Roles", jwtUtil.getRoles(token));
                })
                .build();
    }

    /**
     * 从 Authorization 头提取 Bearer Token
     */
    private String extractToken(ServerHttpRequest request) {
        String bearerToken = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /**
     * 返回 401 统一 JSON 响应
     */
    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange, String msg) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        
        String body = String.format("{\"code\":401,\"msg\":\"%s\"}", msg);
        DataBuffer buffer = response.bufferFactory().wrap(body.getBytes(StandardCharsets.UTF_8));
        return response.writeWith(Mono.just(buffer));
    }
}
