package com.flittly.ai.config;

import io.agentscope.core.model.OpenAIChatModel;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class AgentConfig {
    private final OpenAiConfig openAiConfig;

    @Bean
    public OpenAIChatModel openAIChatModel() {
        return OpenAIChatModel.builder()
                .apiKey(openAiConfig.getApiKey())
                .modelName(openAiConfig.getModel())
                .build();
    }
}
