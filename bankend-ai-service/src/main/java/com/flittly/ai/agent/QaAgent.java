package com.flittly.ai.agent;

import com.flittly.ai.tool.QueryCourseContentTool;
import com.flittly.ai.tool.SearchKnowledgeBaseTool;
import io.agentscope.core.agent.ReActAgent;
import io.agentscope.core.model.OpenAIChatModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class QaAgent {
    private final ReActAgent agent;

    public QaAgent(OpenAIChatModel openAIChatModel,
                   SearchKnowledgeBaseTool searchKnowledgeBaseTool,
                   QueryCourseContentTool queryCourseContentTool) {
        this.agent = ReActAgent.builder()
                .name("QaAgent")
                .sysPrompt("""
                        你是一个课程答疑专家。你的任务是：
                        1. 准确回答学生的问题
                        2. 用简单易懂的语言解释概念
                        3. 提供具体的例子
                        4. 必要时引导学生思考

                        回答原则：
                        - 准确性：基于课程内容回答
                        - 易懂性：使用学生能理解的语言
                        - 引导性：适当引导学生思考
                        """)
                .model(openAIChatModel)
                .tool(searchKnowledgeBaseTool, queryCourseContentTool)
                .build();
    }

    public ReActAgent getAgent() {
        return agent;
    }
}
