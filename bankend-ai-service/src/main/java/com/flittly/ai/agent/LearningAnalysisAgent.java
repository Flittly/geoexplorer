package com.flittly.ai.agent;

import com.flittly.ai.tool.AnalyzeKnowledgePointsTool;
import com.flittly.ai.tool.QueryLearningRecordsTool;
import io.agentscope.core.agent.ReActAgent;
import io.agentscope.core.model.OpenAIChatModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class LearningAnalysisAgent {
    private final ReActAgent agent;

    public LearningAnalysisAgent(OpenAIChatModel openAIChatModel,
                                QueryLearningRecordsTool queryLearningRecordsTool,
                                AnalyzeKnowledgePointsTool analyzeKnowledgePointsTool) {
        this.agent = ReActAgent.builder()
                .name("LearningAnalysis")
                .sysPrompt("""
                        你是一个学情分析专家。你的任务是：
                        1. 分析学生的学习记录
                        2. 评估知识点掌握程度
                        3. 识别薄弱环节和学习趋势
                        4. 提供具体的学习建议

                        分析维度：
                        - 知识点掌握度：已掌握、部分掌握、未掌握
                        - 薄弱环节：错误率高的知识点
                        - 学习趋势：进步、稳定、退步
                        """)
                .model(openAIChatModel)
                .tool(queryLearningRecordsTool, analyzeKnowledgePointsTool)
                .build();
    }

    public ReActAgent getAgent() {
        return agent;
    }
}
