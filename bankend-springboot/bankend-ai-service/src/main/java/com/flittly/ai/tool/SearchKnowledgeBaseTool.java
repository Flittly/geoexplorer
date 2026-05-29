package com.flittly.ai.tool;

import io.agentscope.core.tool.Tool;
import io.agentscope.core.tool.ToolParam;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class SearchKnowledgeBaseTool {

    @Tool(description = "搜索知识库，查找与问题相关的知识点和解释")
    public List<String> searchKnowledgeBase(
            @ToolParam(description = "搜索关键词或问题") String query,
            @ToolParam(description = "课程ID，可选") Long courseId,
            @ToolParam(description = "返回结果数量，默认5", defaultValue = "5") Integer limit) {
        List<String> results = new ArrayList<>();
        results.add("知识点1: " + query + "的基本概念...");
        results.add("知识点2: " + query + "的应用场景...");
        results.add("知识点3: " + query + "的常见问题...");
        return results.subList(0, Math.min(limit, results.size()));
    }
}
