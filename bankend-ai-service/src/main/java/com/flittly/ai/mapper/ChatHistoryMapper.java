package com.flittly.ai.mapper;

import com.flittly.ai.model.ChatHistory;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ChatHistoryMapper {
    List<ChatHistory> selectByStudentIdAndSessionId(
        @Param("studentId") Long studentId,
        @Param("sessionId") String sessionId
    );

    int insert(ChatHistory history);
}
