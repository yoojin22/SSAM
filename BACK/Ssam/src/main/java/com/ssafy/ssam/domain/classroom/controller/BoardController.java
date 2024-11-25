package com.ssafy.ssam.domain.classroom.controller;

import com.ssafy.ssam.domain.classroom.dto.request.*;
import com.ssafy.ssam.domain.classroom.dto.response.BoardGetByPinResponseDTO;
import com.ssafy.ssam.domain.classroom.dto.response.BoardGetResponseDTO;
import com.ssafy.ssam.domain.classroom.service.BoardService;
import com.ssafy.ssam.global.dto.CommonResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/classrooms")
public class BoardController {

    private final BoardService boardService;

    // Post(학급 생성)
    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/teachers")
    public ResponseEntity<CommonResponseDto> createBoard(@Valid @RequestBody BoardCreateRequestDTO requestDTO) {
        return ResponseEntity.ok(boardService.createBoard(requestDTO));
    }

    // 학급 페이지 진입
    @GetMapping("/{boardId}")
    public ResponseEntity<BoardGetResponseDTO> getBoard(@PathVariable("boardId") Integer boardId) {
        return ResponseEntity.ok(boardService.getBoardById(boardId));
    }

    // Pin번호로 학급 찾기
    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/pin/{pin}")
    public ResponseEntity<BoardGetByPinResponseDTO> getByPin(
            @PathVariable("pin") String pin){
        return ResponseEntity.ok(boardService.getBoardByPin(pin));
    }

    // 학급 등록 - 학생
    // @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/{boardId}")
    public ResponseEntity<CommonResponseDto> registClass (
            @PathVariable Integer boardId) {
        System.out.println("Something went wrong...");
        return ResponseEntity.ok(boardService.registClass(boardId));
    }

    // 학급 공지사항 수정
    @PreAuthorize("hasRole('TEACHER')")
    @PutMapping("/teachers/notice/{boardId}")
    public ResponseEntity<CommonResponseDto> changeNotice(
            @PathVariable Integer boardId,
            @Valid @RequestBody BoardNoticeUpdateRequestDTO requestDTO) {

        return ResponseEntity.ok(boardService.updateNotice(boardId, requestDTO.getNotice()));
    }

    // 학급 배너 수정
    @PreAuthorize("hasRole('TEACHER')")
    @PutMapping("/teachers/banner/{boardId}")
    public ResponseEntity<CommonResponseDto> changeBanner(
            @PathVariable Integer boardId,
            @Valid @RequestBody BoardBannerUpdateRequestDTO requestDTO) {

        return ResponseEntity.ok(boardService.updateBanner(boardId, requestDTO.getBanner()));
    }

    // 학급 pin 번호 재발급
    @PreAuthorize("hasRole('TEACHER')")
    @PutMapping("/teachers/pin/{boardId}")
    public ResponseEntity<CommonResponseDto> refreshPin(@PathVariable Integer boardId) {

        return ResponseEntity.ok(boardService.refreshPin(boardId));
    }

    // 학급 배너 이미지 수정
    @PreAuthorize("hasRole('TEACHER')")
    @PutMapping("/teachers/banner-img/{boardId}")
    public ResponseEntity<CommonResponseDto> changeBannerImage(
            @PathVariable Integer boardId,
            @Valid BoardBannerImageRequestDTO request) {
        return ResponseEntity.ok(boardService.updateBannerImage(boardId, request.getBannerImage()));
    }

    // 학급 삭제
    @PreAuthorize("hasRole('TEACHER')")
    @DeleteMapping("/teachers/{boardId}")
    public ResponseEntity<CommonResponseDto> deleteClass(
            @PathVariable Integer boardId) {
        return ResponseEntity.ok(boardService.deleteClass(boardId));
    }

}
