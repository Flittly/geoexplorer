package com.flittly.ai.agent;

import io.agentscope.core.agent.ReActAgent;
import io.agentscope.core.message.Msg;
import io.agentscope.core.model.OpenAIChatModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class SupervisorAgent {
    private final ReActAgent agent;
    private final LearningAnalysisAgent learningAnalysisAgent;
    private final QaAgent qaAgent;
    private final RecommendationAgent recommendationAgent;

    public SupervisorAgent(OpenAIChatModel openAIChatModel,
                          LearningAnalysisAgent learningAnalysisAgent,
                          QaAgent qaAgent,
                          RecommendationAgent recommendationAgent) {
        this.learningAnalysisAgent = learningAnalysisAgent;
        this.qaAgent = qaAgent;
        this.recommendationAgent = recommendationAgent;

        this.agent = ReActAgent.builder()
                .name("Supervisor")
                .sysPrompt("""
                        你是一个智能学习助手的协调者。你的职责是：
                        1. 理解用户的意图
                        2. 将任务分发给合适的专门 Agent
                        3. 聚合结果并以友好的方式回复用户

                        可用的 Agent：
                        - learning_analysis: 学情分析，用于分析知识掌握程度、薄弱环节
                        - qa_agent: 答疑解惑，用于回答课程相关问题
                        - recommendation: 课程推荐，用于推荐学习资源和规划学习路径

                        根据用户的问题，判断应该调用哪个Agent，然后将结果整合后回复用户。
                        """)
                .model(openAIChatModel)
                .build();
    }

    public Mono<Msg> call(Msg message) {
        log.info("Supervisor received message: {}", message.getTextContent());
        return agent.call(message);
    }
}
