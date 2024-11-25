package com.ssafy.ssam.global.chatbot.repository;

import com.ssafy.ssam.global.chatbot.entity.ChatBot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ChatbotRepository extends JpaRepository<ChatBot, Integer> {
    @Query("SELECT c.content FROM ChatBot c WHERE c.startTime <= :time AND c.endTime >= :time AND c.board.boardId = :boardId")
    Optional<List<String>> findContentByTimeAndBoardId(
            @Param("time") LocalDateTime time,
            @Param("boardId") Integer boardId
    );
}
