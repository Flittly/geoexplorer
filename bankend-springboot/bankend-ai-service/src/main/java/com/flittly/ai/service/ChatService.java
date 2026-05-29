package com.flittly.ai.service;

import com.flittly.ai.agent.SupervisorAgent;
import com.flittly.ai.mapper.ChatHistoryMapper;
import com.flittly.ai.model.ChatHistory;
import com.flittly.ai.model.ChatMessage;
import io.agentscope.core.message.Msg;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {
    private final SupervisorAgent supervisorAgent;
    private final ChatHistoryMapper chatHistoryMapper;

    public Mono<ChatMessage> chat(Long studentId, String message, String sessionId) {
        saveChatHistory(studentId, sessionId, "user", message, null);

        Msg userMsg = Msg.builder()
                .textContent(message)
                .build();

        return supervisorAgent.call(userMsg)
                .map(response -> {
                    String reply = response.getTextContent();
                    saveChatHistory(studentId, sessionId, "assistant", reply, "supervisor");

                    return ChatMessage.builder()
                            .studentId(studentId)
                            .sessionId(sessionId)
                            .role("assistant")
                            .content(reply)
                            .agentType("supervisor")
                            .build();
                });
    }

    private void saveChatHistory(Long studentId, String sessionId, String role, String content, String agentType) {
        ChatHistory history = ChatHistory.builder()
                .studentId(studentId)
                .sessionId(sessionId)
                .role(role)
                .content(content)
                .agentType(agentType)
                .build();
        chatHistoryMapper.insert(history);
    }
}
