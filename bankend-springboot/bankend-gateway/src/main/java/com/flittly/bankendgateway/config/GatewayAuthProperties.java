package com.flittly.bankendgateway.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * 网关鉴权配置属性
 * 读取 application.yml 中 gateway.auth 前缀的配置
 */
@Data
@Component
@ConfigurationProperties(prefix = "gateway.auth")
public class GatewayAuthProperties {

    /**
     * 白名单路径列表（支持 Ant 风格通配符，如 /api/auth/**）
     */
    private List<String> whitelist = new ArrayList<>();
}
