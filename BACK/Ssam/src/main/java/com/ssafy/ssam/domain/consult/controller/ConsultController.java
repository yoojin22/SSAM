package com.ssafy.ssam.domain.consult.controller;

import com.ssafy.ssam.domain.consult.dto.response.UpcomingConsultResponseDTO;
import com.ssafy.ssam.domain.consult.service.ConsultService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/consults")
public class ConsultController {
    private final ConsultService consultService;

    // 유저 기준 가장 최근의 상담 하나 불러오는 컨트롤러
    @GetMapping("/check")
    public ResponseEntity<UpcomingConsultResponseDTO> getUpcomingConsult() {
        return ResponseEntity.ok(consultService.getUpcomingConsult());
    }


//    @GetMapping("/test")
//    public ResponseEntity<CommonResponseDto> test() {
//        log.info("test");
//        consultService.startConsult(1);
//        return ResponseEntity.ok(new CommonResponseDto("ok"));
//    }

}
