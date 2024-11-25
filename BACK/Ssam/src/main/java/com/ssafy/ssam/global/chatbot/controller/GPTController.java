package com.ssafy.ssam.global.chatbot.controller;

import com.ssafy.ssam.global.chatbot.dto.request.NoticeRequestDto;
import com.ssafy.ssam.global.chatbot.dto.request.QuestionRequestDto;
import com.ssafy.ssam.global.chatbot.dto.response.QuestionResponseDto;
import com.ssafy.ssam.global.chatbot.service.GPTChatbotService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ssafy.ssam.global.chatbot.dto.request.ImageRequestDto;
import com.ssafy.ssam.global.dto.CommonResponseDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/chatbots")
@RequiredArgsConstructor
public class GPTController {
    private final GPTChatbotService gptChatbotService;
    
    @PostMapping("/teachers/imageupload")
    public ResponseEntity<CommonResponseDto> uploadImage(@Valid @ModelAttribute ImageRequestDto imageRequestDto) {
        return ResponseEntity.ok(gptChatbotService.uploadNoticeAndImage(imageRequestDto));
    }

    @PostMapping("/teachers/noticeupload")
    public ResponseEntity<CommonResponseDto> uploadNotice(@Valid @RequestBody NoticeRequestDto noticeRequestDto) {
        return ResponseEntity.ok(gptChatbotService.uploadNotice(noticeRequestDto));
    }

    @GetMapping("/questions")
    public ResponseEntity<QuestionResponseDto> askQuestion(@Valid @RequestParam("question") String question) {
        return ResponseEntity.ok(gptChatbotService.askQuestion(question));
    }

}