package com.flittly.ai.tool;

import io.agentscope.core.tool.Tool;
import io.agentscope.core.tool.ToolParam;
import org.springframework.stereotype.Component;

@Component
public class QueryCourseContentTool {

    @Tool(description = "查询课程内容，获取课程的详细信息和知识点")
    public String queryCourseContent(
            @ToolParam(description = "课程ID") Long courseId,
            @ToolParam(description = "知识点名称，可选") String knowledgePoint) {
        if (knowledgePoint != null && !knowledgePoint.isEmpty()) {
            return "课程 " + courseId + " 中关于 " + knowledgePoint + " 的详细内容...";
        }
        return "课程 " + courseId + " 的概要内容，包含多个知识点...";
    }
}
