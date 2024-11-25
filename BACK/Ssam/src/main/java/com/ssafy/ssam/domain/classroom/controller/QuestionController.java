package com.ssafy.ssam.domain.classroom.controller;

import com.ssafy.ssam.domain.classroom.dto.request.AnswerRequestDto;
import com.ssafy.ssam.domain.classroom.dto.request.QuestionRequestDto;
import com.ssafy.ssam.domain.classroom.dto.response.QuestionResponseDto;
import com.ssafy.ssam.domain.classroom.service.QuestionService;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Controller
@ResponseBody
@RequestMapping("/v1/classrooms")
public class QuestionController {
    private final QuestionService questionService;

    @GetMapping("/questions/{boardId}")
    public ResponseEntity<List<QuestionResponseDto>> getQuestions(@PathVariable Integer boardId) {
        log.info("controller - getQuestions");
        return ResponseEntity.ok(questionService.getQuestions(boardId));
    }
    @PostMapping("/questions/{boardId}")
    public ResponseEntity<QuestionResponseDto> createQuestion(@PathVariable Integer boardId, @Valid @RequestBody QuestionRequestDto questionRequestDto) {
        log.info("controller - createQuestion");
        return ResponseEntity.ok(questionService.createQuestion(boardId, questionRequestDto));
    }
    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<CommonResponseDto> deleteQuestion(@PathVariable Integer questionId) {
        log.info("controller - deleteQuestion");
        return ResponseEntity.ok(questionService.deleteQuestion(questionId));
    }
    @PutMapping("/answers/{questionId}")
    public ResponseEntity<QuestionResponseDto> putAnswer(@PathVariable Integer questionId, @Valid @RequestBody AnswerRequestDto answerRequestDto) {
        log.info("controller - createAnswer");
        return ResponseEntity.ok(questionService.putAnswer(questionId, answerRequestDto));
    }

}
