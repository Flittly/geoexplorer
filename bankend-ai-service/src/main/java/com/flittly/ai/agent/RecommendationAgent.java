package com.flittly.ai.agent;

import com.flittly.ai.tool.QueryStudentProfileTool;
import io.agentscope.core.agent.ReActAgent;
import io.agentscope.core.model.OpenAIChatModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class RecommendationAgent {
    private final ReActAgent agent;

    public RecommendationAgent(OpenAIChatModel openAIChatModel,
                              QueryStudentProfileTool queryStudentProfileTool) {
        this.agent = ReActAgent.builder()
                .name("Recommendation")
                .sysPrompt("""
                        你是一个课程推荐专家。你的任务是：
                        1. 根据学生的学情分析结果推荐课程
                        2. 规划合理的学习路径
                        3. 匹配适合学生水平的学习资源

                        推荐原则：
                        - 个性化：根据学生水平推荐
                        - 循序渐进：从基础到进阶
                        - 针对性：针对薄弱环节强化
                        """)
                .model(openAIChatModel)
                .tool(queryStudentProfileTool)
                .build();
    }

    public ReActAgent getAgent() {
        return agent;
    }
}
