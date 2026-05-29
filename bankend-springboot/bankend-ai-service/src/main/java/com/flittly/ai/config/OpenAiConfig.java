package com.flittly.ai.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "agentscope.openai")
public class OpenAiConfig {
    private String apiKey;
    private String model;
    private String baseUrl;
}
